import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, ArrowRight, ShieldCheck, Zap, FileText, Wifi } from "lucide-react"
import toast from 'react-hot-toast'
import { useAuth, useUser } from '@clerk/react'
import api from '../config/api.js'

const Dashboard = () => {
  const { user } = useUser()
  const userName = user.fullName;
  const userEmail = user.primaryEmailAddress.emailAddress;

  const { isLoaded, isSignedIn, getToken } = useAuth()

  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [stats, setStats] = useState(null)

  const [joinId, setJoinId] = useState("")
  const [joinError, setJoinError] = useState("")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();
        const { data } = await api.get("/api/meetings/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setStats(data)
      } catch (error) {
        toast.error(error.response?.data?.error || error.message)
      }
    }
    fetchStats()
  }, [isLoaded, isSignedIn, getToken])

  const handleCreateMeeting = async () => {
    if (!isLoaded || !isSignedIn) return;
    setIsCreating(true)

    try {
      const token = await getToken();
      const res = await api.post("/api/meetings", { title: `${userName}'s Meeting` }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const meetingId = res.data.meeting.meetingId;
      toast.success("Meeting created!");
      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    const cleanId = joinId.trim()
    setJoinError("")
    if (!/^[a-z]{3}(?:-[a-z]{3}){2}$/.test(cleanId)) {
      setJoinError("Enter a valid meeting code (e.g. abc-def-ghi)")
      toast.error("Please enter a valid Meeting ID");
      return;
    }

    try {
      const token = await getToken();
      await api.get(`/api/meetings/${cleanId}`, { headers: { Authorization: `Bearer ${token}` } })
      navigate(`/meeting/${cleanId}`);
    } catch (error) {
      const msg = "Meeting not found. Check the ID and try again."
      setJoinError(msg)
      toast.error(msg);
    }
  }

  // Greeting
  const hour = currentTime.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = user.firstName || userName?.split(' ')[0] || 'there'

  // Date + clock strings
  const dateStr = currentTime.toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  })
  const clockStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  // Plan badge
  const isPremium = stats?.plan === 'premium'
  const planLabel = isPremium ? 'Premium plan' : 'Free plan'

  // Usage
  const usageCount = stats?.monthlyCount ?? 0
  const usageLimit = isPremium ? null : (stats?.monthlyLimit ?? 30)
  const usagePct = usageLimit ? Math.min(100, (usageCount / usageLimit) * 100) : 0
  const nearLimit = Boolean(usageLimit && usageCount >= usageLimit * 0.8)

  const features = [
    { Icon: Video,      title: 'HD video',         desc: '720p & 1080p high definition streams' },
    { Icon: Zap,        title: 'Low latency',       desc: 'Peer-to-peer WebRTC connection' },
    { Icon: ShieldCheck,title: 'Secure signaling',  desc: 'Encrypted signaling and rooms' },
    { Icon: FileText,   title: 'Transcripts',       desc: 'Automatic in-call text logs' },
  ]

  return (
    <div
      className="flex-1 w-full"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <div className="max-w-[1100px] mx-auto px-5 py-10 space-y-8">

        {/* ── 1. Greeting block ── */}
        <div>
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            {greeting}, {firstName}
          </h1>
          <div
            className="mt-2 flex flex-wrap items-center gap-2 text-[14px]"
            style={{ color: 'var(--text-muted)' }}
          >
            <span>{dateStr}</span>
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: 'var(--text-muted)' }} />
            <span className="font-mono text-[13px]">{clockStr}</span>
            <span className="w-1 h-1 rounded-full inline-block" style={{ background: 'var(--text-muted)' }} />
            {/* Plan badge */}
            <span
              className="px-2.5 py-0.5 rounded text-[12px] font-medium"
              style={{
                backgroundColor: isPremium ? 'rgba(43,92,240,0.12)' : 'var(--bg-section)',
                color: isPremium ? '#2B5CF0' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              {planLabel}
            </span>
          </div>
        </div>

        {/* ── 2. Action cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* New Meeting card */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div>
              <h2 className="text-[16px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                New meeting
              </h2>
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                Create an instant video call and share the invite link with your team.
              </p>
            </div>
            <button
              onClick={handleCreateMeeting}
              disabled={isCreating}
              className="h-9 px-4 rounded-lg text-[14px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors duration-150 active:scale-[0.98] disabled:opacity-50"
              style={{ backgroundColor: '#2B5CF0', color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3A6AF5'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B5CF0'}
            >
              {isCreating ? (
                <>
                  <span className="w-4 h-4 rounded-full border border-white/30 border-t-white animate-wm-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" strokeWidth={1.5} />
                  Start meeting
                </>
              )}
            </button>
          </div>

          {/* Join Meeting card */}
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div>
              <h2 className="text-[16px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Join meeting
              </h2>
              <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                Enter a code or link provided by the meeting host.
              </p>
            </div>
            <form onSubmit={handleJoinMeeting} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="abc-def-ghi"
                  value={joinId}
                  onChange={(e) => { setJoinId(e.target.value); setJoinError("") }}
                  className="flex-1 h-9 px-3.5 rounded-lg text-[14px] font-mono outline-none transition-colors duration-150"
                  style={{
                    backgroundColor: 'var(--bg-section)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2B5CF0'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button
                  type="submit"
                  disabled={!joinId.trim()}
                  className="h-9 px-4 rounded-lg text-[14px] font-medium flex items-center gap-1.5 cursor-pointer transition-colors duration-150 active:scale-[0.98] disabled:opacity-40"
                  style={{
                    backgroundColor: 'var(--bg-section)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  Join
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
              {joinError && (
                <p className="text-[13px] font-medium" style={{ color: '#EF4444' }}>
                  {joinError}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* ── 3. Usage card ── */}
        {stats && (
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {usageLimit
                  ? `${usageCount} / ${usageLimit} meetings this month`
                  : `${usageCount} meetings this month (Unlimited)`}
              </span>
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {isPremium ? '100 participants max' : '10 participants max'}
              </span>
            </div>

            {/* Progress bar */}
            {usageLimit && (
              <div className="progress-track">
                <div
                  className={`progress-fill${nearLimit && !isPremium ? '-amber' : ''}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {isPremium
                  ? 'Unlimited meetings on Premium plan'
                  : stats.resetDate
                  ? `Quota resets on ${new Date(stats.resetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
                  : 'Monthly usage'}
              </span>
              {!isPremium && (
                <a
                  href="/pricing"
                  className="text-[13px] font-medium"
                  style={{ color: '#2B5CF0' }}
                >
                  Upgrade plan →
                </a>
              )}
            </div>

            {/* Amber upgrade prompt when near limit */}
            {!isPremium && nearLimit && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]"
                style={{
                  backgroundColor: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  color: '#F59E0B',
                }}
              >
                You're near your monthly limit. Consider upgrading to Premium.
              </div>
            )}
          </div>
        )}

        {/* ── 4. Feature highlights ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ Icon, title, desc }) => (
            <div key={title} className="space-y-2">
              <Icon
                className="w-4 h-4"
                strokeWidth={1.5}
                style={{ color: 'var(--text-muted)' }}
              />
              <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {title}
              </p>
              <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Dashboard
