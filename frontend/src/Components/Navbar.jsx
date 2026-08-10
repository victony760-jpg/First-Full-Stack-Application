import { useContext, useState, useRef, useEffect } from 'react';
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // NEW
  const { setShowSearch, getCartCount, navigate, setToken, setCart, token } = useContext(ShopContext);
  const dropdownRef = useRef(null); // NEW

  const toggleMenu = () => { setIsMenuOpen(!isMenuOpen); };

  // NEW: Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setCart({});
    localStorage.removeItem('cart');
    setShowProfileDropdown(false); // NEW
    navigate('/login');
  }

  const handleCartClick = () => {
    if (!token) {
      toast.error("Please login to view cart");
      navigate('/login');
    } else {
      navigate('/cart');
    }
  }

  return (
    <div className='container mx-auto px-4 md:px-8 flex items-center justify-between p-4 bg-white text-gray-800'>
      <Link to="/">
        <p className='prata-regular text-2xl tracking-widest text-slate-900 hover:text-black transition-all duration-300 hover:scale-[1.02]'>VICTONY</p>
      </Link>

      <ul className='hidden md:flex items-center space-x-3 text-sm font-medium'>
        <li className='group'>
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-all duration-300 ${isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'}`}>
            <p className='text-sm'>HOME</p>
            <hr className='w-8 border-none h-0.5 rounded-full bg-blue-600 origin-left transition-transform duration-300 ease-out scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100' />
          </NavLink>
        </li>
        <li className='group'>
          <NavLink to="/collection" className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-all duration-300 ${isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'}`}>
            <p className='text-sm'>COLLECTION</p>
            <hr className='w-8 border-none h-0.5 rounded-full bg-blue-600 origin-left transition-transform duration-300 ease-out scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100' />
          </NavLink>
        </li>
        <li className='group'>
          <NavLink to="/about" className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-all duration-300 ${isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'}`}>
            <p className='text-sm'>ABOUT</p>
            <hr className='w-8 border-none h-0.5 rounded-full bg-blue-600 origin-left transition-transform duration-300 ease-out scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100' />
          </NavLink>
        </li>
        <li className='group'>
          <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-all duration-300 ${isActive ? 'text-black font-semibold' : 'text-gray-600 hover:text-black'}`}>
            <p className='text-sm'>CONTACT</p>
            <hr className='w-8 border-none h-0.5 rounded-full bg-blue-600 origin-left transition-transform duration-300 ease-out scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100' />
          </NavLink>
        </li>
      </ul>

      <div className='flex items-center gap-6'>
        <img onClick={() => { setShowSearch(true); navigate('/collection'); }} src={assets.search_icon} alt="Search" className='w-5 cursor-pointer hover:scale-110 transition-all' />

        {/* FIXED PROFILE DROPDOWN */}
        <div
          className='relative py-2'
          ref={dropdownRef}
          onMouseEnter={() => token && setShowProfileDropdown(true)} // desktop hover
          onMouseLeave={() => token && setShowProfileDropdown(false)} // desktop hover
        >
          <img
            onClick={() => token ? setShowProfileDropdown(!showProfileDropdown) : navigate('/login')} // mobile tap
            src={assets.profile_icon}
            alt="User"
            className='w-5 cursor-pointer hover:scale-110 transition-all'
          />
          {token && showProfileDropdown && (
            <div className='absolute right-0 pt-2 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg z-10'>
              <Link to="/profile" onClick={() => setShowProfileDropdown(false)} className='block px-4 py-2 text-gray-700 hover:bg-gray-100'>My Profile</Link>
              <Link to="/order" onClick={() => setShowProfileDropdown(false)} className='block px-4 py-2 text-gray-700 hover:bg-gray-100'>Orders</Link>
              <button onClick={logout} className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'>Logout</button>
            </div>
          )}
        </div>

        <div onClick={handleCartClick} className='relative cursor-pointer'>
          <img src={assets.cart_icon} alt="Cart" className='w-5 hover:scale-110 transition-all' />
          <p className='absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>{getCartCount()}</p>
        </div>

        <img onClick={toggleMenu} src={assets.menu_icon} alt="Menu" className='w-6 md:hidden cursor-pointer hover:scale-110 transition-all' />
      </div>

      {isMenuOpen && (
        <div className='fixed inset-0 bg-white z-50 flex-col items-center justify-center md:hidden'>
          <button onClick={toggleMenu} className='absolute top-4 right-4 text-gray-800 text-2xl'>&times;</button>
          <ul className='flex flex-col items-center space-y-6 text-lg font-medium'>
            <li><NavLink to="/" onClick={toggleMenu}>HOME</NavLink></li>
            <li><NavLink to="/collection" onClick={toggleMenu}>COLLECTION</NavLink></li>
            <li><NavLink to="/about" onClick={toggleMenu}>ABOUT</NavLink></li>
            <li><NavLink to="/contact" onClick={toggleMenu}>CONTACT</NavLink></li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar;