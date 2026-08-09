import { useContext, useMemo } from 'react';
import { ShopContext } from '../Context/ShopContext';

import Title from './Title'
import ProductItem from './ProductItem'
const BestSeller = () => {
  const { products, currencySymbol } = useContext(ShopContext);
  const bestSellerProducts = useMemo(
    () => products.filter((item) => item.bestseller).slice(0, 5),
    [products]
  );
  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className='text-gray-500 w-3/4 mx-auto text-xs sm:text-sm md:text-base'>Discover our best-selling products that customers love. These items are popular for their quality and value.</p>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
        {bestSellerProducts.map((product, index) => (
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

export default BestSeller
