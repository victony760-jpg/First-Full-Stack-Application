import { useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders' // FIXED: Capital O
import { Navigate, Route, Routes } from 'react-router-dom'

const App = () => {
  const [token, setToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken') || ''
    }
    return ''
  })

  const updateToken = (newToken) => {
    setToken(newToken)
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('adminToken', newToken)
      } else {
        localStorage.removeItem('adminToken')
      }
    }
  }

  return (
    <div className='bg-gray-50 min-h-screen'>
      {token === '' ? (
        <Login setToken={updateToken} />
      ) : (
        <div className='flex flex-col min-h-screen'>
          <Navbar setToken={updateToken} />
          <hr className='border-gray-300' />
          <div className='flex flex-col md:flex-row w-full gap-6 p-4 md:p-6'>
            <Sidebar />
            <main className='flex-1 bg-white rounded-xl shadow-sm p-4 md:p-6'>
              <Routes>
                <Route index element={<Navigate to='/list' replace />} />
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='*' element={<Navigate to='/list' replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
      <ToastContainer position='top-right' />
    </div>
  )
}

export default App