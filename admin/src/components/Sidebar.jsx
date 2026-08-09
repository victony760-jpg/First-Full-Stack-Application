import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-full md:w-[18%] min-h-full md:min-h-screen border-b-2 md:border-b-0 md:border-r-2 border-gray-200'>
      <div className='flex flex-row md:flex-col items-center md:items-start gap-4 pt-4 px-4 md:px-0 md:pl-[20%] text-[15px]'>

        <NavLink
          to='/add'
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? 'bg-[#ffebef] border-[#C586A5]' : ''}`
          }
        >
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block prata-regular'>Add Items</p>
        </NavLink>

        <NavLink
          to='/list'
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? 'bg-[#ffebef] border-[#C586A5]' : ''}`
          }
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block prata-regular'>List Items</p>
        </NavLink>

        <NavLink
          to='/orders'
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l ${isActive ? 'bg-[#ffebef] border-[#C586A5]' : ''}`
          }
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block prata-regular'>Orders</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar