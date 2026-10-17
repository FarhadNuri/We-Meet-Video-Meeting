import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const ProtectedLayout = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default ProtectedLayout