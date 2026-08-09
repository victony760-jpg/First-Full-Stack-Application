import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../assets/assets'
import { formatCurrency } from '../utils/formatCurrency'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllOrders = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` } // same header
        })
      if (response.data.success) {
        toast.success("Status updated")
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Delete this order permanently?")) return
    try {
      const response = await axios.delete(
        `${backendUrl}/api/order/admin/delete/${orderId}`,
        { headers: { Authorization: `Bearer ${token}`, token } }
      )
      if (response.data.success) {
        toast.success("Order deleted")
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete order")
    }
  }

  const markAsPaid = async (orderId) => {
    if (!window.confirm("Mark this COD order as Paid?")) return
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/mark-paid`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}`, token } }
      )
      if (response.data.success) {
        toast.success("Marked as Paid")
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to mark as paid")
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAllOrders()
  }, [fetchAllOrders])

  if (loading) return <div className='p-8'>Loading orders...</div>

  return (
    <div className='cormorant-regular p-4 md:p-8'>
      <h3 className='prata-regular text-2xl font-semibold mb-6'>All Orders</h3>

      {orders.length === 0 ? (
        <p className='text-gray-500'>No orders yet</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {orders.map((order) => (
            <div
              className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr_0.5fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 text-xs sm:text-sm text-gray-700'
              key={order._id} // use _id not index
            >
              <img className='w-12' src={assets.parcel_icon} alt="parcel" />

              {/* Items + Address */}
              <div>
                <div className='mb-2'>
                  {order.items.map((item, i) => (
                    <p className='py-0.5' key={i}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {i !== order.items.length - 1 && ','}
                    </p>
                  ))}
                </div>
                <p className='mt-3 font-medium'>{order.address.firstName} {order.address.lastName}</p>
                <div>
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>

              {/* Order Info */}
              <div>
                <p className='text-sm sm:text-base'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
                {order.paymentMethod === 'COD' && !order.payment && (
                  <span className='inline-block mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>Collect Cash: {formatCurrency(order.amount, order.currency)}</span>
                )}
              </div>

              <p className='text-sm sm:text-base font-semibold'>{formatCurrency(order.amount, order.currency)}</p>

              {/* Status Dropdown */}
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className='p-2 font-semibold border rounded'
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Delete Button */}
              {!order.payment && order.paymentMethod === 'COD' && (
                <button
                  onClick={() => markAsPaid(order._id)}
                  className='text-green-600 border border-green-600 px-2 py-1 rounded hover:bg-green-600 hover:text-white transition'
                >
                  Mark as Paid
                </button>
              )}
              <button
                onClick={() => deleteOrder(order._id)}
                className='text-red-600 border-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders