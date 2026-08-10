import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Title from '../Components/Title';
import CartTotal from '../Components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../Context/ShopContext';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'Nigeria',
    phone: ''
  });
  const [method, setMethod] = useState('paystack');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    navigate,
    setCart,
    products,
    cart,
    backendUrl,
    token,
    getCartAmount
  } = useContext(ShopContext);

  const rate = 1400;

  // BLOCK GUESTS + REDIRECT IF CART IS EMPTY
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const justPaid = query.get('success') === 'true';

    if (!token) {
      toast.error("Please login to checkout");
      navigate('/login');
      return;
    }

    // Only redirect if cart is empty, user didn't just pay, and order is not actively submitting
    if (Object.keys(cart).length === 0 && !justPaid && !isSubmitting) {
      toast.error("Your cart is empty");
      navigate('/collection');
    }
  }, [token, cart, navigate, isSubmitting]);

  // Handle country default payment method selection
  useEffect(() => {
    const isNigeriaCountry = formData.country.toLowerCase().includes('nigeria');
    setMethod(isNigeriaCountry ? 'paystack' : 'stripe');
  }, [formData.country]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  };

  const isNigeria = formData.country.toLowerCase().includes('nigeria');
  const orderCurrency = isNigeria ? 'ngn' : 'usd';

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    let orderItems = [];
    let subtotalUSD = 0;

    for (const itemId in cart) {
      for (const size in cart[itemId]) {
        if (cart[itemId][size] > 0) {
          const itemInfo = structuredClone(products.find(product => product._id === itemId));
          if (itemInfo) {
            itemInfo.size = size;
            itemInfo.quantity = cart[itemId][size];
            orderItems.push(itemInfo);
            subtotalUSD += itemInfo.price * itemInfo.quantity;
          }
        }
      }
    }

    if (subtotalUSD === 0) {
      toast.error("Your cart is empty");
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      toast.error("You must be logged in to place an order.");
      setIsSubmitting(false);
      return;
    }

    const deliveryFeeNGN = 2500;
    const deliveryFeeUSD = 15;

    const subtotalFinal = isNigeria ? subtotalUSD * rate : subtotalUSD;
    const deliveryFinal = isNigeria ? deliveryFeeNGN : deliveryFeeUSD;
    const totalFinal = subtotalFinal + deliveryFinal;

    const amountToSave = Math.round(totalFinal * 100);

    const payload = {
      items: orderItems,
      amount: amountToSave,
      address: formData,
      currency: orderCurrency,
      email: formData.email,
    };

    try {
      let response;

      if (method === 'cod') {
        response = await axios.post(`${backendUrl}/api/order/place`, payload, { headers: { token } });
      } else if (method === 'stripe') {
        if (isNigeria) {
          toast.error("Stripe is for international cards. Please select Paystack for Nigeria");
          setIsSubmitting(false);
          return;
        }
        response = await axios.post(`${backendUrl}/api/order/stripe`, payload, { headers: { token } });
      } else if (method === 'paystack') {
        if (!isNigeria) {
          toast.error("Paystack is for Nigerian cards. Please select Stripe for international");
          setIsSubmitting(false);
          return;
        }
        response = await axios.post(`${backendUrl}/api/order/paystack`, payload, { headers: { token } });
      } else {
        toast.error("Unknown payment method selected.");
        setIsSubmitting(false);
        return;
      }

      if (!response.data.success) {
        toast.error(response.data.message || "Unable to place order.");
        setIsSubmitting(false);
        return;
      }

      // FIX: Only clear cart immediately for COD.
      // For Paystack/Stripe, cart will be cleared on /orders page after success redirect
      if (method === 'cod') {
        setCart({});
        localStorage.removeItem('cart');
        toast.success("Order Placed Successfully!");
        navigate('/orders');
      } else if (method === 'stripe') {
        window.location.href = response.data.session_url;
      } else if (method === 'paystack') {
        window.location.href = response.data.authorization_url;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong while placing your order.');
      setIsSubmitting(false);
    }
  };

  if (!token) return null;

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side - Delivery Info */}
      <div className='flex flex-col gap-4 w-full sm:max-w-120'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' required />
          <input onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' required />
        </div>
        <input onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' required />
        <input onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' required />
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' required />
          <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' required />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' required />
          <select onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' required>
            <option value="Nigeria">Nigeria</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Ghana">Ghana</option>
          </select>
        </div>
        <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' required />
      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
          {isNigeria && (
            <div className='mt-3 p-3 bg-gray-50 rounded border border-gray-200 text-sm font-medium text-gray-700'>
              <p className='text-xs text-gray-500'>Exchange Rate: $1 = ₦{rate.toLocaleString()}</p>
              <p className='text-green-700 font-bold text-base mt-1'>
                Estimated Checkout Total: ₦{((getCartAmount() * rate) + 2500).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => !isNigeria && setMethod('stripe')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'stripe' ? 'border-green-400' : 'border-gray-300'} ${isNigeria ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => isNigeria && setMethod('paystack')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'paystack' ? 'border-green-500' : 'border-gray-300'} ${!isNigeria ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input name='paymentMethod' type='radio' checked={method === 'paystack'} readOnly />
              <p className='text-gray-700 text-sm font-medium uppercase tracking-wide' style={{ fontFamily: 'Prata, serif' }}>PAYSTACK</p>
            </div>
            <div onClick={() => setMethod('cod')} className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${method === 'cod' ? 'border-green-400' : 'border-gray-300'}`}>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm uppercase'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;