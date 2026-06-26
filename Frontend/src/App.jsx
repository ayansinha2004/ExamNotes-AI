import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import Auth from './Pages/Auth'
import { getCurrentUser } from '../src/services/api'
import { useDispatch, useSelector } from 'react-redux'
import History from './Pages/History'
import Notes from './Pages/Notes'
import Pricing from './Pages/Pricing'
import PaymentSuccess from './Pages/PaymentSuccess'
import PaymentFailed from './Pages/PaymentFailed'

export const serverUrl = import.meta.env.VITE_API_URL;

const App = () => {
  const dispatch = useDispatch()
  const [initialCheckDone, setInitialCheckDone] = useState(false)
  const { userData } = useSelector((state) => state.user)

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await getCurrentUser(dispatch)
      } catch (err) {
        console.error(err)
      } finally {
        setInitialCheckDone(true)
      }
    }

    verifyUser()
  }, [dispatch])

  // If we haven't finished the API call, AND Redux has no user, 
  if (!initialCheckDone && !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Connecting to session...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/' element={userData ? <Home /> : <Navigate to='/auth' replace />} />
      <Route path='/auth' element={userData ? <Navigate to='/' replace /> : <Auth />} />
      <Route path='/history' element={userData ? <History /> : <Navigate to='/auth' replace />} />
      <Route path='/notes' element={userData ? <Notes /> : <Navigate to='/auth' replace />} />
      <Route path='/pricing' element={userData ? <Pricing /> : <Navigate to='/auth' replace />} />
      <Route path='*' element={<Navigate to={userData ? "/" : "/auth"} replace />} />
      <Route path='/payment-success' element={<PaymentSuccess />} />
      <Route path='/payment-failed' element={<PaymentFailed />} />
    </Routes>
  )
}

export default App