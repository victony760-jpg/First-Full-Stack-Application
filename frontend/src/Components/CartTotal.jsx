import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from './Title'

const CartTotal = () => {
    const { currencySymbol, delivery_fee, getCartAmount } = useContext(ShopContext);
    const subtotal = getCartAmount(); // this runs again every time currency changes

    return (
        <div className='w-full'>
            <div className='text-2xl mb-3'>
                <Title text1={'CART'} text2={'TOTALS'} />
            </div>
            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Subtotal</p>
                    <p>{currencySymbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Shipping Fee</p>
                    <p>{currencySymbol}{delivery_fee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <hr />
                <div className='flex justify-between text-base'>
                    <b>Total</b>
                    <b>{currencySymbol}{(subtotal + delivery_fee).toLocaleString(undefined, { minimumFractionDigits: 2 })}</b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal