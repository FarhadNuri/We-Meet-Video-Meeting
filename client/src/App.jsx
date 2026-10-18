import React from 'react'
import { Route,Routes } from 'react-router-dom'
import ProtectedLayout from './components/ProtectedLayout'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Pricing from './pages/Pricing'
import { Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import MeetingRoom from './pages/MeetingRoom'

const App = () => {
  return (
    <div>
      <Toaster />

      <Routes>
        {/* Public Routes */}
        <Route path='/login/*' element={<Login mode="login" />} />
        <Route path='/register/*' element={<Login mode="register" />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
            <Route path='/sessions' element={<Sessions />} />
            <Route path='/pricing' element={<Pricing />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to='/dashboard' replace/>} />
      </Routes>

    </div>
  )
}

export default App