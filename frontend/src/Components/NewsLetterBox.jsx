import { useState } from 'react';

const NewsLetterBox = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const trimmedEmail = email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(trimmedEmail)) {
      setMessage('Please enter a valid email address.')
      return
    }

    localStorage.setItem('newsletterSubscriber', trimmedEmail)
    setMessage(`Thanks for subscribing, ${trimmedEmail}!`)
    setEmail('')
  }

  return (
    <div className='bg-gray-100 py-10 mt-10 text-center'>
      <p className='text-gray-500 text-sm mb-3'>SUBSCRIBE TO OUR NEWSLETTER</p>
      <h2 className='text-2xl font-semibold mb-5'>Get the latest updates and offers</h2>
      <div className='flex justify-center gap-2'>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-2'>
          <input
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            className='px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400'
          />
          <button type='submit' className='px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-300'>Subscribe</button>
        </form>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${message.includes('valid') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default NewsLetterBox
