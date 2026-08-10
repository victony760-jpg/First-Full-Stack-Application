import { useCallback, useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../Components/Title';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const formatCurrency = (amount, currency) => {
  const isNGN = currency?.toLowerCase() === 'ngn';
  const num = Number(amount) || 0;

  // Amount from DB is already in kobo/cents. So divide by 100
  const displayAmount = num / 100;

  if (isNGN) {
    return `₦${displayAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${displayAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Orders = () => {
  const { navigate, backendUrl, token, setCart } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded.role === 'admin');
      } catch (e) { setIsAdmin(false) }
    }
  }, [token])

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) return;
      setLoading(true);
      const url = isAdmin ? `${backendUrl}/api/order/list` : `${backendUrl}/api/order/userorders`;
      const response = await axios.post(url, {}, { headers: { token } });
      if (response.data.success) setOrders(response.data.orders);
      else toast.error(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally { setLoading(false); }
  }, [backendUrl, token, isAdmin])

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)

    // Clear cart after successful payment redirect from Stripe/Paystack
    if (query.get('success') === 'true') {
      toast.success("Payment Successful")
      setCart({})
      localStorage.removeItem('cart')
      navigate('/orders', { replace: true }) // remove ?success=true from url
    }
    if (query.get('success') === 'false') {
      toast.error("Payment Failed")
      navigate('/orders', { replace: true })
    }

    if (token) loadOrderData();
  }, [loadOrderData, setCart, navigate, token]); // added token

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order permanently?")) return;
    try {
      const url = isAdmin ? `${backendUrl}/api/order/admin/delete/${orderId}` : `${backendUrl}/api/order/delete/${orderId}`;
      const response = await axios.delete(url, { headers: { token } });
      if (response.data.success) {
        toast.success("Order deleted")
        loadOrderData();
      } else toast.error(response.data.message)
    } catch (error) { toast.error("Failed to delete order"); }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const response = await axios.post(`${backendUrl}/api/order/cancel`, { orderId }, { headers: { token } });
      if (response.data.success) { toast.success("Order cancelled"); loadOrderData(); }
      else toast.error(response.data.message);
    } catch (err) { toast.error("Failed to cancel order"); }
  }

  if (loading) return <div className='border-t pt-16 text-center py-10'>Loading orders...</div>

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-6'><Title text1={isAdmin ? 'ALL' : 'MY'} text2={'ORDERS'} /></div>

      {orders.length === 0 ?
        <p className='text-gray-500 text-center py-10'>No orders yet.</p> :
        <div className='flex flex-col gap-8'>
          {orders.map((order) => (
            <div key={order._id} className='py-6 border-t border-b'>
              <div className='flex justify-between items-center mb-4'>
                <div>
                  <p className='font-medium text-base'>Order: #{order._id.slice(-6)}</p>
                  <p className='text-sm text-gray-500'>Date: {new Date(order.date).toDateString()}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <p className={`min-w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-blue-500' : order.status === 'Cancelled' ? 'bg-red-500' : 'bg-green-500'}`}></p>
                  <p className='text-sm font-medium'>{order.status}</p>
                </div>
              </div>

              <div className='flex flex-col gap-4 mb-4'>
                {order.items.map((item, idx) => (
                  <div key={idx} className='flex gap-4 items-center border p-3 rounded-lg hover:shadow-sm transition'>
                    <img className='w-20 h-20 object-cover rounded' src={item.image?.[0] || ''} alt={item.name} />
                    <div className='flex-1'>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-gray-600'>Size: <span className='font-medium'>{item.size}</span> | Qty: {item.quantity}</p>
                      <p className='text-sm font-medium mt-1'>
                        {/* FIX: item.price is already in base currency. Don't *100 again */}
                        {formatCurrency(item.price * item.quantity * 100, order.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-4 border-t'>
                <div className='text-sm space-y-1'>
                  <p>Items: {order.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p>Total: <span className='font-semibold text-base'>{formatCurrency(order.amount, order.currency)}</span></p>
                  <p className={`font-medium ${order.payment ? 'text-green-600' : 'text-red-600'}`}>{order.payment ? 'Paid' : 'Not Paid'}</p>
                </div>

                <div className='flex gap-2'>
                  {!isAdmin && order.status === 'Order Placed' && !order.payment && (
                    <button onClick={() => cancelOrder(order._id)} className='border border-red-500 text-red-500 px-3 py-2 text-xs rounded-sm hover:bg-red-500 hover:text-white transition'>Cancel</button>
                  )}
                  {(isAdmin || order.status === 'Order Placed') && (
                    <button onClick={() => deleteOrder(order._id)} className='border border-red-600 text-red-600 px-3 py-2 text-xs rounded-sm hover:bg-red-600 hover:text-white transition'>Delete</button>
                  )}
                  <button onClick={() => navigate(`/order/${order._id}`)} className='border px-4 py-2 text-sm rounded-sm hover:bg-black hover:text-white transition'>Track Order</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
export default Orders