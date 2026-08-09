import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../Components/Title'
import ProductItem from '../Components/ProductItem'
import { toast } from 'react-toastify'; // add this

const Product = () => {
  const { productId } = useParams()
  const { products, currencySymbol, currency, exchangeRate, addToCart, token, navigate } = useContext(ShopContext) // added token, navigate
  const productData = useMemo(
    () => products.find((item) => item._id === productId) || null,
    [productId, products]
  )
  const [image, setImage] = useState('')
  const [size, setSize] = useState(productData?.sizes?.[0] || '')
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (productData?.image?.length) {
      setImage(productData.image[0])
    }
    if (productData?.sizes?.length) {
      setSize(productData.sizes[0])
    }
  }, [productData])

  const handleAddToCart = () => { // NEW HANDLER
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }
    addToCart(productData._id, size);
  }

  const relatedProducts = useMemo(() => {
    if (!productData) return []
    const candidates = products.filter((item) => item._id !== productData._id)
    const sameSubcategory = candidates.filter(
      (item) => item.category === productData.category && item.subCategory === productData.subCategory
    )
    const sameCategory = candidates.filter(
      (item) => item.category === productData.category && item.subCategory !== productData.subCategory
    )
    const fallback = candidates.filter((item) => item.category !== productData.category)
    return [...sameSubcategory, ...sameCategory, ...fallback].slice(0, 5)
  }, [products, productData])

  if (!productData) {
    return <div className='min-h-[60vh] flex items-center justify-center text-sm text-slate-500'>Loading product...</div>
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8'>
      <div className='grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start'>
        <section className='grid gap-4 sm:grid-cols-[104px_minmax(0,1fr)]'>
          <div className='flex gap-3 overflow-x-auto sm:flex-col sm:overflow-y-auto sm:pb-0 pb-4 no-scrollbar'>
            {productData.image.map((item, index) => (
              <button
                key={index}
                type='button'
                onClick={() => setImage(item)}
                className={`rounded-2xl border-2 transition-all duration-300 ${item === image ? 'border-black shadow-md' : 'border-transparent hover:border-slate-300 bg-slate-50'} overflow-hidden shrink-0`}
              >
                <img src={item} alt={`${productData.name} ${index + 1}`} className='h-20 w-20 object-cover sm:h-24 sm:w-24' />
              </button>
            ))}
          </div>

          <div className='rounded-3xl border-slate-200 bg-white p-2 shadow-sm'>
            <img src={image} alt={productData.name} className='h-full w-full rounded-[1.25rem] object-cover transition-opacity duration-300' />
          </div>
        </section>

        <section className='space-y-6'>
          <div className='rounded-3xl border-slate-200 bg-white p-8 shadow-sm'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div>
                <p className='text-sm uppercase tracking-[0.24em] text-slate-500'>{productData.category ?? 'Product'}</p>
                <h1 className='mt-3 text-4xl font-bold tracking-tight text-slate-900'>{productData.name}</h1>
              </div>
              <p className='rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600'>{productData.subCategory ?? ''}</p>
            </div>

            <div className='mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500'>
              <div className='flex items-center gap-1'>
                <img src={assets.star_icon} alt='Star' className='w-3.5' />
                <img src={assets.star_icon} alt='Star' className='w-3.5' />
                <img src={assets.star_icon} alt='Star' className='w-3.5' />
                <img src={assets.star_icon} alt='Star' className='w-3.5' />
                <img src={assets.star_dull_icon} alt='Star' className='w-3.5' />
              </div>
              <span className='text-slate-500'>(122 reviews)</span>
            </div>

            <p className='mt-6 text-4xl font-bold text-slate-900'>{currencySymbol}{(currency === 'ngn' ? productData.price * exchangeRate : productData.price).toLocaleString()}</p>
            <p className='mt-5 text-slate-600 leading-7'>{productData.description}</p>

            <div className='mt-8 space-y-6'>
              <div>
                <p className='text-sm font-medium text-slate-700'>Select Size</p>
                <div className='mt-4 flex flex-wrap gap-3'>
                  {productData.sizes.map((item, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => setSize(item)}
                      className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${item === size ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPDATED BUTTON */}
              <button
                type='button'
                onClick={handleAddToCart} // use new handler
                className={`inline-flex w-full items-center justify-center rounded-2xl px-8 py-5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 ${token ? 'bg-black' : 'bg-gray-500'}`}
                disabled={!size}
              >
                {token ? 'Add to cart' : 'Login to Add to Cart'}
              </button>

              <div className='grid gap-3 text-sm text-slate-500 sm:grid-cols-2'>
                <p>100% original items with verified quality.</p>
                <p>Free returns within 7 days and fast delivery options.</p>
                <p>Cash on delivery available.</p>
                <p>Secure checkout and customer support.</p>
              </div>
            </div>
          </div>

          {/*... rest of your tabs and related products... */}
          <div className='rounded-3xl border border-slate-200 bg-white p-8 shadow-sm'>
            <div className='flex flex-wrap gap-3 border-b border-slate-200 pb-4'>
              {['description', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  type='button'
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-3 text-sm font-medium transition ${activeTab === tab ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {tab === 'description' ? 'Description' : 'Reviews (122)'}
                </button>
              ))}
            </div>
            <div className='mt-6 space-y-5 text-sm leading-7 text-slate-600'>
              {activeTab === 'description' ? (
                <>
                  <p>{productData.description}</p>
                  <p>This product is designed to give you premium comfort while keeping a modern, stylish look.</p>
                </>
              ) : (
                <div className='space-y-5'>
                  <article className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
                    <p className='font-medium text-slate-900'>MAHORAGA</p>
                    <p className='mt-3 text-slate-600'>"Great fit and quality — exactly as described."</p>
                  </article>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className='my-24'>
        <div className='text-center py-8 text-3xl'>
          <Title text1={'RELATED'} text2={'PRODUCTS'} />
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {relatedProducts.map((item) => (
            <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.image[0]} currency={currencySymbol} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Product