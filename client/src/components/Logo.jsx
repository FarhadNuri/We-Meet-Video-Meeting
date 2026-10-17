import React from 'react'

/**
 * Reusable Logo component.
 * Uses currentColor so it renders white in dark mode and dark in light mode.
 * Props:
 *   size     – icon height in px (default 24)
 *   iconOnly – when true, renders the camera/scissor icon only, no wordmark
 *   className – extra classes applied to the wrapper
 */
const Logo = ({ size = 24, iconOnly = false, className = '' }) => {
  // Scale the wordmark proportionally; original SVG is 54x70 (icon only)
  const iconH = size
  const iconW = Math.round((54 / 70) * iconH)

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* Camera icon SVG — fills replaced with currentColor */}
      <svg
        width={iconW}
        height={iconH}
        viewBox="0 0 54 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M24.386 8.817c4.972-4.868 12.948-4.785 17.816.186 4.869 4.971 4.785 12.948-.186 17.816q-.506.494-.987.867L23.508 9.794q.372-.481.878-.977M11.97 42.611c-4.941 4.9-4.974 12.877-.075 17.817 4.9 4.94 12.877 4.974 17.817.074q.502-.5.88-.975L12.96 41.747a10 10 0 0 0-.99.864"
          fill="currentColor"
        />
        <rect
          y="22.652"
          width="21.312"
          height="55.056"
          rx="10.656"
          transform="rotate(-45 0 22.652)"
          fill="currentColor"
        />
      </svg>

      {/* Wordmark */}
      {!iconOnly && (
        <span
          style={{ fontSize: Math.round(size * 0.9), lineHeight: 1 }}
          className="font-semibold tracking-tight select-none"
        >
          We Meet<span className="text-accent">.</span>
        </span>
      )}
    </span>
  )
}

export default Logo

