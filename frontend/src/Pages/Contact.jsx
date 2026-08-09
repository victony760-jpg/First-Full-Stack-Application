import { useState } from 'react';
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../Components/NewsLetterBox'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Contact = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields")
      return
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    // Simulation of an API call
    setTimeout(() => {
      console.log("Form Submitted:", formData)
      toast.success("Message sent successfully! We'll get back to you soon.")
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-120' src={assets.contact_img} alt="" />
        
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>54709 Willms Station <br /> Suite 350, Washington, USA</p>
          <p className='text-gray-500'>Tel: (415) 555-0132 <br /> Email: admin@victony.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at <span className='prata-regular'>VICTONY</span></p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p>
          <button onClick={() => navigate('/careers')} className='prata-regular border border-black px-8 py-4 text-sm transition-all duration-300 hover:bg-black hover:text-white active:scale-95 transform hover:scale-105 hover:shadow-xl'>Explore Jobs</button>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className='my-10 w-full'>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2030000000003!2d-73.9856644845949!3d40.75800000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2585555555555%3A0x89c2585555555555!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Our Store Location">
        </iframe>
      </div>

      <div className='text-center text-2xl py-10'>
        <Title text1={'GET IN'} text2={'TOUCH'} />
      </div>

      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-150 m-auto gap-4 text-gray-800 mb-20'>
        <div className='w-full flex flex-col sm:flex-row gap-4'>
          <input id="contact-name" onChange={onChangeHandler} name='name' value={formData.name} type="text" className='w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all duration-300' placeholder='Your Name' required aria-label="Your Name" />
          <input id="contact-email" onChange={onChangeHandler} name='email' value={formData.email} type="email" className='w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all duration-300' placeholder='Your Email' required aria-label="Your Email" />
        </div>
        <input id="contact-subject" onChange={onChangeHandler} name='subject' value={formData.subject} type="text" className='w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all duration-300' placeholder='Subject' aria-label="Subject" />
        <textarea id="contact-message" onChange={onChangeHandler} name='message' value={formData.message} className='w-full px-3 py-2 border border-gray-300 rounded min-h-37.5 outline-none focus:border-gray-800 focus:ring-1 focus:ring-gray-800 transition-all duration-300' placeholder='Message' required aria-label="Message"></textarea>
        
        <button disabled={isLoading} type='submit' className='bg-black text-white font-light px-10 py-3 mt-4 active:bg-gray-700 transition-all flex items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed'>
          {isLoading ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              SENDING...
            </>
          ) : 'SEND MESSAGE'}
        </button>
      </form>

      <NewsLetterBox />

    </div>
  )
}

export default Contact
