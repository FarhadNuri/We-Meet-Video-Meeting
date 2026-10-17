import React from 'react'

const Logo = ({ size = 'md', iconOnly = false, className = '' }) => {
  const sizes = {
    sm: { icon: 'size-5', text: 'text-sm', gap: 'gap-1.5' },
    md: { icon: 'size-6', text: 'text-base', gap: 'gap-2' },
    lg: { icon: 'size-8', text: 'text-xl', gap: 'gap-2.5' },
  }
  const selected = sizes[size] || sizes.md

  return (
    <span className={`inline-flex items-center ${selected.gap} text-foreground ${className}`} aria-label="We Meet">
      <img src="/logo.svg" alt="" className={`${selected.icon} logo-mark`} aria-hidden="true" />
      {!iconOnly && <span className={`${selected.text} font-semibold tracking-tight`}>We Meet<span className="text-primary">.</span></span>}
    </span>
  )
}

export default Logo
