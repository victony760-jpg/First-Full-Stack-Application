import { useContext, useMemo, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext';
import Title from '../Components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../Components/CartTotal';
import { toast } from 'react-toastify';

const Cart = () => {

  const { products, cart, currencySymbol, currency, exchangeRate, updateQuantity, navigate, token } = useContext(ShopContext);

  // BLOCK GUESTS FROM ACCESSING CART PAGE
  useEffect(() => {
    if (!token) {
      toast.error("Please login to view cart");
      navigate('/login');
    }
  }, [token, navigate])

  const cartData = useMemo(() => {
    const tempData = [];
    for (const itemId in cart) {
      for (const item in cart[itemId]) {
        if (cart[itemId][item] > 0) {
          tempData.push({ _id: itemId, size: item, quantity: cart[itemId][item] });
        }
      }
    }
    return tempData;
  }, [cart]);

  if (!token) return null; // prevent flash

  return (
    <div className='border-t pt-10'>
      <div className='text-2xl mb-6'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const product = products.find((prod) => prod._id === item._id);
          if (!product) return null;

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
              <div className='flex items-start gap-6'>
                <img className='w-16 sm:w-20' src={product.image?.[0] || ''} alt={product.name || 'Product'} />
                <div>
                  <p className='text-xs sm:text-lg font-medium'>{product.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p>{currencySymbol}{(currency === 'ngn' ? product.price * exchangeRate : product.price).toLocaleString()}</p>
                    <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))}
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className='w-4 sm:w-5 cursor-pointer hover:opacity-70'
                src={assets.bin_icon}
                alt=""
              />
            </div>
          );
        })}
      </div>

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-112.5'>
          <CartTotal />
          <div className='text-right'>
            <button onClick={() => navigate('/placeorder')} className='bg-black text-white text-sm my-8 px-8 py-3 uppercase active:bg-gray-700'>Proceed To Checkout</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart