

const Footer = () => {
  return (
    <footer className='bg-slate-50 text-slate-800 border-t border-slate-200'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <p className='prata-regular text-3xl tracking-widest text-slate-900 hover:text-black transition-all duration-300 cursor-default inline-block hover:scale-[1.02]'>VICTONY</p>
            <p className='text-sm leading-7 text-slate-600'>
              A modern ecommerce store offering curated fashion, fast delivery, and friendly support. Shop quality styles at competitive prices.
            </p>
          </div>

          <div>
            <h2 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-900'>Shop</h2>
            <ul className='mt-4 space-y-3 text-sm text-slate-600'>
              <li>
                <a href='/collection' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Collections</a>
              </li>
              <li>
                <a href='/about' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>About Us</a>
              </li>
              <li>
                <a href='/contact' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Contact</a>
              </li>
              <li>
                <a href='/cart' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Cart</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-900'>Customer Care</h2>
            <ul className='mt-4 space-y-3 text-sm text-slate-600'>
              <li>
                <a href='#' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Returns & Exchanges</a>
              </li>
              <li>
                <a href='#' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Shipping Info</a>
              </li>
              <li>
                <a href='#' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Privacy Policy</a>
              </li>
              <li>
                <a href='#' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Terms of Service</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-900'>Contact</h2>
            <div className='mt-4 space-y-3 text-sm text-slate-600'>
              <p>123 Style Avenue, Suite 400</p>
              <p>Cityville, ST 12345</p>
              <p>Email: <a href='mailto:support@yourecomm.com' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>support@yourecomm.com</a></p>
              <p>Phone: <a href='tel:+1234567890' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>+1 (234) 567-890</a></p>
              <p>Support Hours: Mon–Sat, 9am–6pm</p>
            </div>
          </div>
        </div>

        <div className='mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500'>
          <p>&copy; {new Date().getFullYear()} <span className='prata-regular'>VICTONY</span>. All rights reserved.</p>
          <div className='mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6'>
            <a href='#' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Privacy Policy</a>
            <a href='#' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Terms of Service</a>
            <a href='#' className='no-underline hover:underline decoration-slate-300 hover:decoration-slate-900 underline-offset-4 hover:text-slate-900 transition-colors duration-200'>Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
