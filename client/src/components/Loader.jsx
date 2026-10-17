import React from 'react'
import Logo from './Logo'
const Loader = ({ text = 'Loading...' }) => <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground"><div className="relative flex size-10 items-center justify-center rounded-full border-2 border-border border-t-primary animate-spin"><Logo size="sm" iconOnly className="text-primary" /></div><p className="mt-4 text-xs font-medium text-muted-foreground animate-pulse">{text}</p><Logo size="sm" iconOnly className="sr-only" /></div>
export default Loader
