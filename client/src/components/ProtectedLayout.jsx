import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const ProtectedLayout = () => <div className="flex min-h-screen flex-col bg-background text-foreground"><Navbar /><div className="flex flex-1 flex-col"><Outlet /></div><Footer /></div>
export default ProtectedLayout
