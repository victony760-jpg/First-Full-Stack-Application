import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderPaystack,
  verifyStripe,
  verifyPaystack,
  verifyPaystackRedirect, // NEW
  markAsPaid,
  userOrders,
  allOrders,
  updateStatus,
  deleteOrder,
  deleteCancelledOrders,
  cancelOrder,
  getOrderById,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// USER ROUTES
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/paystack", authUser, placeOrderPaystack);

// API VERIFY - called by frontend with token
orderRouter.post("/verify-stripe", authUser, verifyStripe);
orderRouter.post("/verify-paystack", authUser, verifyPaystack);

// BROWSER REDIRECT - called by Paystack after payment. No auth
orderRouter.get("/verify-paystack", verifyPaystackRedirect);

orderRouter.post("/userorders", authUser, userOrders);
orderRouter.post("/single", authUser, getOrderById);
orderRouter.post("/cancel", authUser, cancelOrder);
orderRouter.delete("/delete/:orderId", authUser, deleteOrder);
orderRouter.delete("/delete-cancelled", authUser, deleteCancelledOrders);

// ADMIN ROUTES
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/mark-paid", adminAuth, markAsPaid);
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.delete("/admin/delete/:orderId", adminAuth, deleteOrder);

export default orderRouter;
