
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-10 px-6 py-10 sm:px-10 sm:py-20'>
      <div className='flex flex-col items-center text-center sm:text-left max-w-xs space-y-4'>
        <img src={assets.exchange_icon} className='w-12 mb-4' alt="Exchange icon" />
        <p className='font-medium text-lg'>Easy Exchange Policy</p>
        <p className='text-gray-500 leading-7'>We offer a hassle-free exchange policy. If you're not satisfied with your purchase, you can easily exchange it within 30 days.</p>
      </div>
      <div className='flex flex-col items-center text-center sm:text-left max-w-xs space-y-4'>
        <img src={assets.quality_icon} className='w-12 mb-4' alt="Quality icon" />
        <p className='font-medium text-lg'>Easy Return Policy</p>
        <p className='text-gray-500 leading-7'>If you're not satisfied with your purchase, you can return it within 30 days for a full refund.</p>
      </div>
      <div className='flex flex-col items-center text-center sm:text-left max-w-xs space-y-4'>
        <img src={assets.support_img} className='w-12 mb-4' alt="Support icon" />
        <p className='font-medium text-lg'>24/7 Customer Support</p>
        <p className='text-gray-500 leading-7'>Our customer support team is available 24/7 to assist you with any questions or concerns you may have.</p>
      </div>
    </div>
  )
}

export default OurPolicy
