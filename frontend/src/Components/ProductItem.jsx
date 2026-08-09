
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'

const ProductItem = ({ id, name, price, image }) => {
  const { currency, exchangeRate, currencySymbol } = useContext(ShopContext);
  const displayPrice = currency === 'ngn' ? price * exchangeRate : price;
  return (
    <Link to={`/product/${id}`} className='block'>
      <div className='overflow-hidden cursor-pointer group rounded-lg bg-white'>
        <img src={image} alt={name} className='w-full h-56 sm:h-48 lg:h-56 object-cover transition-transform duration-300 group-hover:scale-110' />
        <div className='p-4'>
          <p className='pt-3 pb-1 text-sm line-clamp-2'>{name}</p>
          <p className='text-sm font-medium'>{currencySymbol}{displayPrice}</p>
        </div>
      </div>
    </Link>
  )
}




export default ProductItem
