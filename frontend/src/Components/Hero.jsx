
import { assets } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row items-stretch border border-gray-200'>
      {/* Hero Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-8 sm:py-16 p-4 sm:p-8'>
        <div className='text-[#414141] max-w-xl'>
          <div className='flex items-center gap-2'>
            <p className='w-8 md:w-11 h-0.5 bg-[#414141]'></p>
            <p className='font-medium text-sm md:text-base'>BEST-SELLERS</p>
          </div>
          <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed text-gray-800'>LATEST ARRIVALS</h1>
          <div className='flex items-center gap-2'>
            <p className='font-medium text-sm md:text-base'>SHOP NOW</p>
            <p className='w-8 md:w-11 h-px bg-[#414141]'></p>
          </div>
        </div>
      </div>
      {/* Hero Right Side */}
      <img className='w-full sm:w-1/2 object-cover h-64 sm:h-auto' src={assets.hero_img} alt="Hero image" />
    </div>
  )
}

export default Hero
