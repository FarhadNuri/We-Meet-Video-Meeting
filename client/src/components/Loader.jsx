import { VideoIcon } from 'lucide-react'
import React from 'react'

const Loader = ({ text = "Loading..." }) => {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* Spinning ring with camera icon centered */}
      <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
        {/* Ring */}
        <div
          className="absolute inset-0 rounded-full animate-wm-spin"
          style={{
            border: '2px solid var(--border)',
            borderTopColor: '#2B5CF0',
          }}
        />
        {/* Camera icon */}
        <VideoIcon
          className="w-4 h-4 relative z-10"
          style={{ color: '#2B5CF0' }}
          strokeWidth={1.5}
        />
      </div>

      {/* Label */}
      <p
        className="mt-4 text-[13px] font-medium animate-pulse"
        style={{ color: 'var(--text-muted)' }}
      >
        {text}
      </p>
    </div>
  )
}

export default Loader