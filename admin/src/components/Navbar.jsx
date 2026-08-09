import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // clear from storage too
    setToken('');
    navigate('/login');
  };

  return (
    <nav className='sticky top-0 z-50 w-full px-4 md:px-8 flex items-center justify-between py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 text-gray-800 shadow-sm' aria-label="Main navigation">
      <Link
        to='/'
        aria-label="VICTONY Home"
        className='prata-regular text-2xl tracking-widest text-slate-900 hover:tracking-wider transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
      >
        VICTONY
      </Link>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLogout}
          className='prata-regular border-black px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-300 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-95'
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;