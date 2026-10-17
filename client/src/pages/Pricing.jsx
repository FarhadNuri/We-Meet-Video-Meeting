import React from 'react'
import { Link } from 'react-router-dom'
import { PricingTable } from "@clerk/react"
import { ArrowLeft, ShieldCheck } from 'lucide-react'

const Pricing = () => {
  const clerkAppearance = {
    variables: {
      colorPrimary: '#2B5CF0',
      fontFamily: 'Urbanist, sans-serif',
      borderRadius: '12px',
    },
    elements: {
      card: 'shadow-none border border-[var(--border)] rounded-[12px] bg-[var(--bg-card)]',
      pricingTable: 'shadow-none bg-transparent',
      loading: 'hidden',
      loadingBar: 'hidden',
      skeleton: 'hidden',
    }
  };

  return (
    <div
      className="flex-1 w-full min-h-[calc(100vh-140px)]"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="max-w-[1100px] mx-auto px-5 py-8 sm:py-10">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium mb-3 transition-colors duration-150"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Dashboard
        </Link>

        {/* Top-left header matching Sessions page */}
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Upgrade your plan
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--text-muted)' }}>
            Choose the plan that fits your meeting needs and collaborate with unlimited time and participants.
          </p>
        </div>

        {/* Wrapper around existing Clerk <PricingTable /> */}
        <div
          className="w-full rounded-[12px] border p-2 sm:p-6 transition-all"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
        >
          {/* fallback={null} suppresses Clerk's internal loading bar / skeleton */}
          <PricingTable fallback={null} appearance={clerkAppearance} />
        </div>

        {/* Muted note under the table */}
        <div
          className="mt-6 text-center text-[12px] flex items-center justify-center gap-1.5"
          style={{ color: 'var(--text-muted)' }}
        >
        </div>
      </div>
    </div>
  )
}

export default Pricing

