import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Title from '../Components/Title'
import { toast } from 'react-toastify'
import emailjs from '@emailjs/browser'

const JobApply = () => {
  const { jobTitle } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    cv: null
  })

  const onChangeHandler = (e) => {
    const { name, value, files } = e.target
    if (name === 'cv') {
      const file = files[0];
      if (!file) {
        setFormData(prev => ({ ...prev, cv: null }))
        return
      }
      // Safety threshold check for EmailJS Free Tier variables limit
      if (file.size > 45 * 1024) {
        toast.error("File too large! EmailJS Free Tier limit is 50KB. Please upload a smaller file or compress your PDF.");
        e.target.value = null; // Reset the input field
        return;
      }
      setFormData(prev => ({ ...prev, cv: file }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // Helper function to read file as Base64 asynchronously
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    try {
      if (!serviceId || !templateId || !publicKey) {
        toast.error('Email service is not configured yet.')
        return
      }

      // 1. Convert CV to Base64 ONLY if user uploaded one
      let cvBase64 = "No CV uploaded";
      if (formData.cv) {
        cvBase64 = await convertToBase64(formData.cv);
      }

      // 2. Package parameters explicitly to match dashboard variables
      const templateParams = {
        job_title: jobTitle,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        coverLetter: formData.coverLetter,
        cv_link: cvBase64 // Will be "No CV uploaded" if empty
      };

      // 3. Send via emailjs.send
      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      toast.success(`Application for ${jobTitle} sent successfully!`)
      navigate('/careers')
    } catch (error) {
      console.error("EmailJS Error:", error)
      toast.error("Failed to send application. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-10'>
        <Title text1={'APPLY FOR'} text2={(jobTitle || 'POSITION').toUpperCase()} />
      </div>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-6 w-full sm:max-w-150 m-auto text-gray-700 mb-20'>

        <div className='flex flex-col gap-2'>
          <label htmlFor="full-name" className='text-sm font-medium'>Full Name</label>
          <input id="full-name" onChange={onChangeHandler} name='name' value={formData.name} className='border border-gray-300 rounded py-2 px-4 outline-none focus:border-black transition-all' type="text" placeholder='Enter your full name' required />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor="email" className='text-sm font-medium'>Email Address</label>
            <input id="email" onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-2 px-4 outline-none focus:border-black transition-all' type="email" placeholder='your@email.com' required />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor="phone" className='text-sm font-medium'>Phone Number</label>
            <input id="phone" onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-2 px-4 outline-none focus:border-black transition-all' type="tel" placeholder='(123) 456-7890' required />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="cv-upload" className='text-sm font-medium'>Upload CV (PDF preferred) <span className='text-gray-500 font-normal'>Optional</span></label>
          <input id="cv-upload" onChange={onChangeHandler} name='cv' className='border border-gray-300 rounded py-2 px-4 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800' type="file" accept=".pdf" />
          {formData.cv && <p className='text-xs text-green-600'>Selected: {formData.cv.name}</p>}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="cover-letter" className='text-sm font-medium'>Cover Letter / Message</label>
          <textarea id="cover-letter" onChange={onChangeHandler} name='coverLetter' value={formData.coverLetter} className='border border-gray-300 rounded py-2 px-4 outline-none focus:border-black transition-all min-h-37.5' placeholder='Tell us why you are a good fit...' required></textarea>
        </div>

        <button disabled={isLoading} type='submit' className='bg-black text-white px-10 py-3 mt-4 active:bg-gray-700 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400'>
          {isLoading ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              SENDING APPLICATION...
            </>
          ) : 'SUBMIT APPLICATION'}
        </button>
      </form>
    </div>
  )
}

export default JobApply