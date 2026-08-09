import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Paystack from "paystack";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const paystackInstance = Paystack(process.env.PAYSTACK_SECRET_KEY);

// Config
const USD_TO_NGN_RATE = 1400; // 1 USD = 1400 NGN
const deliveryChargeNGN = 2500; // 2500 NGN
const deliveryChargeUSD = 15; // 15 USD

const getConfig = (currency = "ngn") => {
  const isUSD = currency.toLowerCase() === "usd";
  return {
    currency: isUSD ? "usd" : "ngn",
    deliveryCharge: isUSD ? deliveryChargeUSD : deliveryChargeNGN,
    multiplier: 100, // to convert to cents/kobo
  };
};

// Helper: convert item prices
const convertItemsCurrency = (items, currency) => {
  const isNGN = currency === "ngn";
  return items.map((item) => ({
    ...item,
    price: isNGN ? Math.round(item.price * USD_TO_NGN_RATE) : item.price, // convert to NGN
  }));
};

// 1. COD
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, currency } = req.body;
    const {
      currency: finalCurrency,
      deliveryCharge,
      multiplier,
    } = getConfig(currency);

    const convertedItems = convertItemsCurrency(items, finalCurrency);

    const newOrder = new orderModel({
      userId,
      items: convertedItems,
      address,
      amount: amount + deliveryCharge * multiplier, // add delivery in kobo/cents
      currency: finalCurrency,
      paymentMethod: "COD",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 2. Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, currency } = req.body;
    const { origin } = req.headers;
    const {
      currency: finalCurrency,
      deliveryCharge,
      multiplier,
    } = getConfig(currency);

    const convertedItems = convertItemsCurrency(items, finalCurrency);

    const newOrder = new orderModel({
      userId,
      items: convertedItems,
      address,
      amount: amount + deliveryCharge * multiplier,
      currency: finalCurrency,
      paymentMethod: "Stripe",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });
    await newOrder.save();

    const line_items = convertedItems.map((item) => ({
      price_data: {
        currency: finalCurrency,
        product_data: { name: item.name },
        unit_amount: item.price * multiplier,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: finalCurrency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * multiplier,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}&userId=${userId}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 3. Verify Stripe - FIXED
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body; // reads from body now
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      if (userId) await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return res.json({ success: true, message: "Payment Successful" }); // return JSON
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 4. Paystack
const placeOrderPaystack = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address, email } = req.body;
    const {
      currency: finalCurrency,
      deliveryCharge,
      multiplier,
    } = getConfig("ngn");
    const totalAmount = amount + deliveryCharge * multiplier;

    const convertedItems = convertItemsCurrency(items, finalCurrency);

    const newOrder = new orderModel({
      userId,
      items: convertedItems,
      address,
      amount: totalAmount,
      currency: finalCurrency,
      paymentMethod: "Paystack",
      payment: false,
      status: "Order Placed",
      date: Date.now(),
    });
    await newOrder.save();

    const response = await paystackInstance.transaction.initialize({
      email,
      amount: totalAmount,
      currency: "NGN",
      callback_url: `${process.env.BACKEND_URL}/api/order/verify-paystack?orderId=${newOrder._id}`,
      metadata: { orderId: newOrder._id.toString(), userId },
    });
    res.json({
      success: true,
      authorization_url: response.data.authorization_url,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 5. Verify Paystack - FIXED
const verifyPaystack = async (req, res) => {
  try {
    const { reference, orderId: orderIdFromBody } = req.body; // reads from body now
    if (!reference)
      return res.json({ success: false, message: "Payment reference missing" });

    const response = await paystackInstance.transaction.verify(reference);

    if (response.data.status !== "success") {
      return res.json({ success: false, message: "Payment not successful" });
    }

    const { orderId, userId } = response.data.metadata || {
      orderId: orderIdFromBody,
    };

    await orderModel.findByIdAndUpdate(orderId, {
      payment: true,
      status: "Order Placed",
    });
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Payment Successful" }); // return JSON
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 6. Admin: Mark COD as paid
const markAsPaid = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    res.json({ success: true, message: "Order marked as Paid" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 7. Admin: All orders
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 8. User: My orders
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 9. Get Single Order
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;
    const isAdmin = req.isAdmin;

    let query = { _id: orderId };
    if (!isAdmin) query.userId = userId;

    const order = await orderModel.findOne(query);
    if (!order) return res.json({ success: false, message: "Order not found" });

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 10. User cancels order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;
    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) return res.json({ success: false, message: "Order not found" });
    if (order.status !== "Order Placed" || order.payment) {
      return res.json({ success: false, message: "Cannot cancel order now" });
    }
    await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
    res.json({ success: true, message: "Order Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 11. Delete - User can only delete Placed/Cancelled
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const isAdmin = req.isAdmin;
    const userId = req.userId;

    let query = { _id: orderId };
    if (!isAdmin) {
      query.userId = userId;
      query.status = { $in: ["Order Placed", "Cancelled"] };
    }

    const deleted = await orderModel.findOneAndDelete(query);
    if (!deleted)
      return res.json({
        success: false,
        message: isAdmin
          ? "Order not found."
          : "You can only delete orders that are Placed or Cancelled.",
      });
    res.json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 12. Delete all cancelled orders
const deleteCancelledOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const result = await orderModel.deleteMany({ userId, status: "Cancelled" });
    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Cancelled orders deleted",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// 13. Admin: Update status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderPaystack,
  verifyStripe,
  verifyPaystack,
  markAsPaid,
  allOrders,
  userOrders,
  getOrderById,
  deleteOrder,
  deleteCancelledOrders,
  updateStatus,
  cancelOrder,
};
