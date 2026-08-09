import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import Title from '../Components/Title'
import { toast } from 'react-toastify'
import axios from 'axios'

const formatCurrency = (amount, currency) => {
  const isNGN = currency?.toLowerCase() === 'ngn';
  const num = Number(amount) / 100 || 0; // divide because we saved in kobo/cents

  if (isNGN) {
    return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const OrderDetails = () => {
  const { orderId } = useParams()
  const { backendUrl, token } = useContext(ShopContext)
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/order/single`,
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        setOrder(response.data.order)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Order not found")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchOrder();
  }, [token, orderId])

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/cancel`,
          { orderId },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.warn("Order has been cancelled.")
          fetchOrder()
        } else {
          toast.error(response.data.message)
        }
      } catch (err) {
        toast.error("Failed to cancel order")
      }
    }
  }

  const handleDeleteOrder = async () => {
    if (window.confirm("Delete this order permanently?")) {
      try {
        const response = await axios.delete(
          `${backendUrl}/api/order/delete/${orderId}`,
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success("Order deleted")
          navigate('/orders')
        } else toast.error(response.data.message)
      } catch (error) { toast.error("Failed to delete order"); }
    }
  }

  if (loading) return <div className='py-20 text-center text-gray-500'>Loading order...</div>
  if (!order) return <div className='py-20 text-center text-gray-500'>Order not found.</div>

  const steps = ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered']
  const isCancelled = order.status === 'Cancelled'
  const currentStatusIndex = isCancelled ? -1 : steps.indexOf(order.status)
  const canDelete = order.status === 'Order Placed' || order.status === 'Cancelled'

  return (
    <div className='border-t pt-16'>
      <div className='flex justify-between items-center mb-10'>
        <Title text1={'ORDER'} text2={'DETAILS'} />
        <div className='flex gap-3'>
          {order.status === 'Order Placed' && !order.payment && (
            <button onClick={handleCancelOrder} className='border border-red-300 text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 transition-colors'>Cancel Order</button>
          )}
          {canDelete && (
            <button onClick={handleDeleteOrder} className='border border-gray-400 text-gray-600 px-4 py-2 text-sm hover:bg-gray-100'>Delete Order</button>
          )}
        </div>
      </div>

      <div className={`mb-16 px-4 ${isCancelled ? 'opacity-50 grayscale' : ''}`}>
        <div className='flex items-center justify-between relative max-w-3xl mx-auto'>
          <div className='absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0'></div>
          <div className='absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-1000' style={{ width: `${(currentStatusIndex / (steps.length - 1)) * 100}%` }}></div>
          {steps.map((step, index) => (
            <div key={step} className='relative z-10 flex-col items-center'>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 ${index <= currentStatusIndex ? 'bg-green-500 border-white text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {index < currentStatusIndex ? '✓' : index + 1}
              </div>
              <p className={`mt-2 text-xs font-medium text-center ${index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {isCancelled && (
        <div className='bg-red-50 border border-red-100 text-red-700 p-4 mb-10 text-center rounded-sm font-medium'>
          This order was cancelled on {new Date(order.date).toDateString()}. If this was a mistake, please contact support.
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700'>
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold border-b pb-2'>Items Ordered</h3>
          {order.items.map((item, index) => (
            <div key={index} className='flex items-center gap-4 py-2 border-b border-gray-100 last:border-0'>
              <img className='w-16' src={item.image[0]} alt="" />
              <div className='flex-1'>
                <p className='font-medium'>{item.name}</p>
                <p className='text-sm text-gray-500'>Size: {item.size} | Qty: {item.quantity}</p>
              </div>
              <p className='font-medium'>{formatCurrency(item.price * 100 * item.quantity, order.currency)}</p>
            </div>
          ))}
          <div className='pt-4 text-right border-t'>
            <p className='text-sm text-gray-500'>Delivery: {formatCurrency(order.deliveryCharge || 250000, order.currency)}</p>
            <p className='text-lg font-bold'>Total Amount: {formatCurrency(order.amount, order.currency)}</p>
          </div>
        </div>

        <div className='space-y-6 bg-slate-50 p-6 rounded-sm'>
          <div>
            <h3 className='text-lg font-semibold mb-3'>Shipping Address</h3>
            <p className='font-medium'>{order.address.firstName} {order.address.lastName}</p>
            <p>{order.address.street}</p>
            <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
            <p>{order.address.country}</p>
            <p className='mt-2 text-sm text-gray-500'>Phone: {order.address.phone}</p>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-3'>Payment Info</h3>
            <p className='uppercase text-sm'>Method: <span className='font-bold'>{order.paymentMethod}</span></p>
            <p className={`text-sm font-medium ${order.payment ? 'text-green-600' : 'text-red-600'}`}>{order.payment ? 'Paid' : 'Not Paid'}</p>
          </div>

          <div>
            <h3 className='text-lg font-semibold mb-3'>Order Info</h3>
            <p className='text-sm'>ID: #{order._id}</p>
            <p className='text-sm'>Date: {new Date(order.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails