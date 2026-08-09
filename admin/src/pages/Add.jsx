import { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [loading, setLoading] = useState(false)
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)
  const [image3, setImage3] = useState(null)
  const [image4, setImage4] = useState(null)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [sizes, setSizes] = useState([])
  const [bestSeller, setBestSeller] = useState(false)

  useEffect(() => {
    return () => {
      [image1, image2, image3, image4].forEach(img => img && URL.revokeObjectURL(img))
    }
  }, [image1, image2, image3, image4])

  const toggleSize = (size) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }

  const resetForm = () => {
    setName(''); setDescription(''); setPrice('');
    setCategory('Men'); setSubCategory('Topwear');
    setSizes([]); setBestSeller(false);
    setImage1(null); setImage2(null); setImage3(null); setImage4(null);
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (sizes.length === 0) return toast.error("Please select at least 1 size")
    if (!image1) return toast.error("Please upload at least 1 image")

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const res = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data.success) {
        toast.success(res.data.message)
        resetForm()
      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-6 cormorant-regular'>
      <h1 className='text-2xl font-semibold mb-4 prata-regular'>Add Product</h1>

      <div className='w-full'>
        <p className='mb-2 text-sm font-medium prata-regular'>Upload Image</p>
        <div className='flex flex-wrap gap-4'>
          {[image1, image2, image3, image4].map((img, i) => (
            <label key={i} htmlFor={`image${i + 1}`} className='cursor-pointer'>
              <img
                className='w-20 h-20 object-cover rounded border-gray-200 hover:border-[#C586A5]'
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />
              <input
                onChange={(e) => [setImage1, setImage2, setImage3, setImage4][i](e.target.files[0])}
                type='file'
                id={`image${i + 1}`}
                hidden
                accept="image/*"
              />
            </label>
          ))}
        </div>
      </div>

      <div className='flex flex-col w-full gap-2'>
        <p className='mb-2 text-sm font-medium prata-regular'>Product Name</p>
        <input type='text' className='border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#C586A5]' placeholder='Enter product name' value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className='flex flex-col w-full gap-2'>
        <p className='mb-2 text-sm font-medium prata-regular'>Product Description</p>
        <textarea className='border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#C586A5]' rows={4} placeholder='Enter product description' value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      </div>

      <div className='flex flex-col w-full gap-4 sm:flex-row sm:gap-6'>
        <div className='w-full sm:w-1/3'>
          <p className='mb-2 text-sm font-medium prata-regular'>Product Category</p>
          <select className='border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#C586A5]' value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value='Men'>Men</option>
            <option value='Women'>Women</option>
            <option value='Kids'>Kids</option>
          </select>
        </div>

        <div className='w-full sm:w-1/3'>
          <p className='mb-2 text-sm font-medium prata-regular'>Sub Category</p>
          <select className='border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#C586A5]' value={subCategory} onChange={(e) => setSubCategory(e.target.value)} required>
            <option value='Topwear'>Topwear</option>
            <option value='Bottomwear'>Bottomwear</option>
            <option value='Winterwear'>Winterwear</option>
          </select>
        </div>

        <div className='w-full sm:w-1/3'>
          <p className='mb-2 text-sm font-medium prata-regular'>Product Price</p>
          <input type='number' className='border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#C586A5]' placeholder='100' value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
      </div>

      <div className='w-full'>
        <p className='mb-2 text-sm font-medium prata-regular'>Product Sizes</p>
        <div className='flex flex-wrap gap-4'>
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
            const isSelected = sizes.includes(size);
            return (
              <label key={size} className={`flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer transition-all ${isSelected ? 'border-[#C586A5] bg-[#C586A5]/10 text-[#C586A5] font-semibold' : 'border-gray-300 text-gray-700'}`}>
                <input type='checkbox' checked={isSelected} onChange={() => toggleSize(size)} className='sr-only' />
                <span className='prata-regular'>{size}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className='flex flex-col gap-4 mt-4 w-full'>
        <label htmlFor='best-seller' className='flex items-center gap-2 cursor-pointer prata-regular w-fit'>
          <input type='checkbox' id='best-seller' checked={bestSeller} onChange={() => setBestSeller(!bestSeller)} className='h-5 w-5 accent-[#C586A5] rounded border border-gray-300' />
          <span>Add to Best Sellers</span>
        </label>

        <button
          type='submit'
          disabled={loading}
          className='bg-[#C586A5] text-white px-6 py-3 rounded-md cursor-pointer hover:bg-[#a86b8c] transition-all duration-300 w-full sm:w-auto font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}

export default Add