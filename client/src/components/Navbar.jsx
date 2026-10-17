import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, History, CreditCard, Moon, Sun } from 'lucide-react'
import { UserButton, useUser } from '@clerk/react'
import Logo from './Logo'

const Navbar = () => {
  const { isSignedIn, user } = useUser(); const location = useLocation(); const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])
  const items = [[LayoutDashboard, 'Dashboard', '/dashboard'], [History, 'Sessions', '/sessions'], [CreditCard, 'Pricing', '/pricing']]
  return <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-5 md:px-8"><div className="flex items-center gap-6"><Link to="/dashboard" aria-label="We Meet home"><Logo size="md" /></Link>{isSignedIn && <nav className="hidden items-center gap-1 md:flex">{items.map(([Icon, label, path]) => <Link key={path} to={path} className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition ${location.pathname === path ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}><Icon className="size-4" />{label}</Link>)}</nav>}</div>{isSignedIn && <div className="flex items-center gap-3"><button onClick={() => setDark(value => !value)} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Toggle theme">{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</button><span className="hidden text-xs text-muted-foreground sm:inline">{user?.fullName || 'Farhad Nuri'}</span><UserButton afterSignOutUrl="/login" /></div>}</header>
}
export default Navbar
