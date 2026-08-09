import { useContext, useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Verify = () => {
  const { token, setCart, backendUrl } = useContext(ShopContext)
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const success = searchParams.get('success'); // from Stripe
  const reference = searchParams.get('reference'); // from Paystack
  const userId = searchParams.get('userId');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!token) {
        toast.error("Please login to continue");
        navigate('/login');
        return;
      }

      if (!orderId) {
        toast.error("Order ID missing");
        navigate('/cart');
        return;
      }

      try {
        let response;

        // 1. Paystack Verification
        if (reference) {
          response = await axios.post(
            `${backendUrl}/api/order/verify-paystack`,
            { orderId, userId, reference },
            { headers: { token } }
          );
        }
        // 2. Stripe Verification
        else {
          response = await axios.post(
            `${backendUrl}/api/order/verify-stripe`,
            { orderId, success, userId },
            { headers: { token } }
          );
        }

        if (response.data.success) {
          setCart({}); // clear cart
          toast.success(response.data.message);
          navigate('/order'); // go to my orders page
        } else {
          toast.error(response.data.message || "Payment verification failed");
          navigate('/cart'); // send back to cart
        }

      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error(error.response?.data?.message || 'Something went wrong while verifying payment');
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [token, orderId, success, reference, userId, backendUrl, navigate, setCart]);

  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      {loading ? (
        <div className='flex flex-col items-center gap-4'>
          <div className='w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin'></div>
          <p className='text-gray-600 text-lg'>Verifying your payment...</p>
          <p className='text-sm text-gray-400'>Please do not refresh the page</p>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <p className='text-gray-600 text-lg'>Redirecting...</p>
        </div>
      )}
    </div>
  )
}

export default Verify