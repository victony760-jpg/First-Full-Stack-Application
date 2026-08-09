import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import Collection from './Pages/Collection'
import Product from './Pages/Product'
import PlaceOrder from './Pages/PlaceOrder'
import Careers from './Pages/Careers'
import OrderDetails from './Pages/OrderDetails'
import JobApply from './Pages/JobApply'
import Order from './Pages/Order'
import Login from './Pages/Login'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SearchBar from './Components/SearchBar'
import Verify from './Pages/Verify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/order' element={<Order />} />
        <Route path='/orders' element={<Order />} />
        <Route path='/order/:orderId' element={<OrderDetails />} />
        <Route path='/apply/:jobTitle' element={<JobApply />} />
        <Route path='/careers' element={<Careers />} />
        <Route path='/login' element={<Login />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='*' element={<Home />} />
        <Route path='/verify' element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
