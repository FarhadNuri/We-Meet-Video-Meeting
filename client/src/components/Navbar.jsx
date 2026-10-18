import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, History, CreditCard } from 'lucide-react'
import { UserButton, useUser } from '@clerk/react'
import Logo from './Logo'

const Navbar = () => {
  const { isSignedIn, user } = useUser()
  const location = useLocation()
  const userName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split("@")[0] || "User";

  // Ensure pure white mode is active by ensuring no dark class remains
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { to: '/sessions',  label: 'Sessions',  Icon: History },
    { to: '/pricing',   label: 'Pricing',   Icon: CreditCard },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header
      className="w-full sticky top-0 z-40 bg-card border-b border-token transition-theme"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottomColor: 'var(--border)',
        height: '56px',
      }}
    >
      <div className="max-w-[1100px] mx-auto h-full px-3 sm:px-5 flex items-center justify-between">

        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-2 sm:gap-5">
          <Link to="/dashboard" className="flex items-center text-token-primary" aria-label="We Meet home">
            <Logo size={22} className="text-token-primary" />
          </Link>

          {isSignedIn && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[14px] font-medium transition-colors duration-150 ${
                    isActive(to)
                      ? 'bg-[#2B5CF0]/10 text-[#2B5CF0]'
                      : 'text-token-secondary hover:bg-[var(--bg-section)] hover:text-token-primary'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right: user navigation */}
        <div className="flex items-center gap-2 sm:gap-3">

          {isSignedIn && (
            <>
              {/* Mobile icon-only nav links */}
              <div className="md:hidden flex items-center gap-0.5 sm:gap-1">
                {navItems.map(({ to, label, Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    aria-label={label}
                    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-md transition-colors duration-150 ${
                      isActive(to)
                        ? 'bg-[#2B5CF0]/10 text-[#2B5CF0]'
                        : 'text-token-secondary hover:bg-[var(--bg-section)]'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                  </Link>
                ))}
              </div>

              {/* User display name */}
              <span className="hidden sm:inline text-[14px] text-token-secondary font-medium select-none">
                {userName}
              </span>

              {/* Clerk UserButton */}
              <div className="shrink-0">
                <UserButton afterSignOutUrl="/login" />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar