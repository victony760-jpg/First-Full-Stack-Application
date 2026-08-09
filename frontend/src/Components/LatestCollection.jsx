import { useContext, useMemo } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {
  const { products, currencySymbol } = useContext(ShopContext)
  const latestProducts = useMemo(() => products.slice(0, 10), [products])

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={"LATEST"} text2={"COLLECTION"} />
        <p className='text-gray-500 w-3/4 mx-auto text-xs sm:text-sm md:text-base'>Check out our latest collection of products. We have the newest and most exciting items for you!</p>
      </div>
      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
        {latestProducts.map((product, index) => (
          <ProductItem
            key={index}
            id={product._id}
            name={product.name}
            price={product.price}
            image={product.image[0]}
            currency={currencySymbol}
          />
        ))}
      </div>
    </div>
  )
}

export default LatestCollection
