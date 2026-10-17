import React from 'react'
import { GitBranch } from 'lucide-react'
import Logo from './Logo'
const Footer = () => <footer className="flex items-center justify-between border-t border-border px-5 py-5 md:px-8"><div><Logo size="sm" /><p className="mt-1 text-[11px] text-muted-foreground">Built by Farhad Nuri · © 2026 We Meet. All rights reserved.</p></div><a href="https://github.com/FarhadNuri/We-Meet-Video-Meeting" target="_blank" rel="noreferrer" className="text-muted-foreground transition hover:text-foreground" aria-label="GitHub"><GitBranch className="size-4" /></a></footer>
export default Footer
