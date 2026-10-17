import { ArrowRight, Calendar } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const EmptySessions = () => {
  return (
    <div
      className="w-full rounded-[12px] border border-dashed p-12 text-center flex flex-col items-center justify-center gap-3"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div
        className="w-12 h-12 rounded-full border flex items-center justify-center mb-1"
        style={{
          backgroundColor: 'var(--bg-section)',
          borderColor: 'var(--border)',
        }}
      >
        <Calendar className="w-5 h-5" strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
      </div>

      <h3 className="text-[18px] font-semibold" style={{ color: 'var(--text-primary)' }}>
        No meeting sessions yet
      </h3>

      <p className="text-[14px] max-w-sm" style={{ color: 'var(--text-muted)' }}>
        Meetings you host or participate in will appear here with chat transcripts and participant logs.
      </p>

      <Link
        to="/dashboard"
        className="mt-2 h-10 px-5 rounded-lg text-[14px] font-medium text-white flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
        style={{ backgroundColor: '#2B5CF0' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3A6AF5'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B5CF0'}
      >
        Start a Meeting
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
      </Link>
    </div>
  )
}

export default EmptySessions
