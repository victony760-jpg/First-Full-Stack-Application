import { useMemo, useState } from 'react'
import Title from '../Components/Title'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from '../Components/ProductItem'

const Collection = () => {

  const { products, currencySymbol, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [sortType, setSortType] = useState('relevant');
  const [selectedCategory, setSelectedCategory] = useState(''); // CHANGED: single select
  const [selectedSubCategory, setSelectedSubCategory] = useState(''); // CHANGED: single select

  const handleCategoryChange = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category); // toggle off if same
  };

  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(selectedSubCategory === subCategory ? '' : subCategory); // toggle off if same
  };

  const filteredProducts = useMemo(() => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (selectedCategory) { // CHANGED
      productsCopy = productsCopy.filter((item) => item.category === selectedCategory);
    }

    if (selectedSubCategory) { // CHANGED
      productsCopy = productsCopy.filter((item) => item.subCategory === selectedSubCategory);
    }

    if (sortType === 'low-high') {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    return productsCopy;
  }, [products, search, showSearch, selectedCategory, selectedSubCategory, sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Filter Options */}
      <div className='w-full sm:w-1/4 min-w-[240px]'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 uppercase'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Men', 'Women', 'Kids'].map((item) => (
              <label key={item} className='flex gap-2 cursor-pointer items-center'>
                <input
                  className='w-3'
                  type="radio" // CHANGED
                  name="category" // CHANGED
                  checked={selectedCategory === item} // CHANGED
                  onChange={() => handleCategoryChange(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            {['Topwear', 'Bottomwear', 'Winterwear'].map((item) => (
              <label key={item} className='flex gap-2 cursor-pointer items-center'>
                <input
                  className='w-3'
                  type="radio" // CHANGED
                  name="subcategory" // CHANGED
                  checked={selectedSubCategory === item} // CHANGED
                  onChange={() => handleSubCategoryChange(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex flex-col sm:flex-row justify-between text-2xl sm:text-3xl mb-4 gap-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border-2 cursor-pointer border-gray-300 text-sm px-2 h-10'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6'>
          {
            filteredProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image[0]} currency={currencySymbol} />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Collection