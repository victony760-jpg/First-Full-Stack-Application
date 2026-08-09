
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../Components/NewsLetterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-112.5' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-3/4 text-gray-600'>
              <p><span className='prata-regular'>VICTONY</span> was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
              <p>Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
          </div>
      </div>

      {/* Parallax Mission Section */}
      <div 
        className='relative h-75 sm:h-100 my-20 bg-fixed bg-center bg-cover flex items-center justify-center overflow-hidden'
        style={{ backgroundImage: `url(${assets.about_img})` }}
      >
          <div className='absolute inset-0 bg-black/40'></div>
          <div className='relative z-10 text-center px-10 md:px-20 text-white'>
              <h2 className='text-3xl sm:text-4xl prata-regular mb-4'>Our Mission</h2>
              <p className='text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed'>
                Our mission at <span className='prata-regular'>VICTONY</span> is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.
              </p>
          </div>
      </div>

      <div className=' text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer group transform hover:scale-105 hover:shadow-2xl relative hover:z-10 ease-in-out rounded-sm'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600 group-hover:text-white transition-all duration-500 ease-in-out'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer group transform hover:scale-105 hover:shadow-2xl relative hover:z-10 ease-in-out rounded-sm'>
            <b>Convenience:</b>
            <p className='text-gray-600 group-hover:text-white transition-all duration-500 ease-in-out'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:bg-black hover:text-white transition-all duration-500 cursor-pointer group transform hover:scale-105 hover:shadow-2xl relative hover:z-10 ease-in-out rounded-sm'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600 group-hover:text-white transition-all duration-500 ease-in-out'>Our team of dedicated professionals is here to assist you every step of the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

      <NewsLetterBox/>

    </div>
  )
}

export default About
