import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Keyboard, ShieldCheck, Gauge, LockKeyhole, Captions, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth, useUser } from '@clerk/react'
import api from '../config/api.js'

const Dashboard = () => {
  const { user } = useUser()
  const { isLoaded, isSignedIn, getToken } = useAuth()
  const navigate = useNavigate()
  const [isCreating, setIsCreating] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [joinId, setJoinId] = useState('')
  const [joinError, setJoinError] = useState('')
  const [stats, setStats] = useState(null)
  const userName = user?.fullName || user?.firstName || 'Farhad'

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer) }, [])
  useEffect(() => { if (!isLoaded || !isSignedIn) return; getToken().then(token => api.get('/api/meetings/stats', { headers: { Authorization: `Bearer ${token}` } })).then(({ data }) => setStats(data)).catch(() => {}) }, [isLoaded, isSignedIn, getToken])

  const handleCreateMeeting = async () => {
    if (!isLoaded || !isSignedIn) return
    setIsCreating(true)
    try { const token = await getToken(); const res = await api.post('/api/meetings', { title: `${userName}'s Meeting` }, { headers: { Authorization: `Bearer ${token}` } }); navigate(`/meeting/${res.data.meeting.meetingId}`) }
    catch (error) { toast.error(error.response?.data?.error || error.message) } finally { setIsCreating(false) }
  }
  const handleJoinMeeting = async (event) => {
    event.preventDefault(); const cleanId = joinId.trim().toLowerCase()
    if (!/^[a-z]{3}(?:-[a-z]{3}){2}$/.test(cleanId)) { setJoinError('Enter a valid meeting code, such as abc-def-ghi.'); return }
    setJoinError('')
    try { const token = await getToken(); await api.get(`/api/meetings/${cleanId}`, { headers: { Authorization: `Bearer ${token}` } }); navigate(`/meeting/${cleanId}`) } catch { setJoinError('Meeting not found. Check the code and try again.') }
  }
  const plan = stats?.plan || 'free'; const limit = stats?.monthlyLimit || 30; const count = stats?.monthlyCount ?? 4; const percent = Math.min((count / limit) * 100, 100)
  const hour = currentTime.getHours(); const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return <main className="flex-1 w-full">
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-7 px-5 py-9 md:px-8 md:py-10">
      <header className="flex flex-col gap-2"><h1 className="text-2xl font-semibold tracking-tight">{greeting}, {userName}</h1><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>{currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span><span className="size-1 rounded-full bg-muted-foreground/50" /><span className="font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span><span className="size-1 rounded-full bg-muted-foreground/50" /><span className="rounded-md border border-border bg-muted/40 px-2 py-0.5 font-medium">{plan === 'premium' ? 'Premium plan' : 'Free plan'}</span></div></header>
      <section className="grid gap-3 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-5"><h2 className="text-sm font-semibold">New meeting</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">Create an instant video call and share the invite link with your team.</p><button onClick={handleCreateMeeting} disabled={isCreating} className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60">{isCreating ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}{isCreating ? 'Creating...' : 'Start meeting'}</button></article>
        <article className="rounded-xl border border-border bg-card p-5"><h2 className="text-sm font-semibold">Join meeting</h2><p className="mt-2 text-xs leading-5 text-muted-foreground">Enter a code or link provided by the meeting host.</p><form onSubmit={handleJoinMeeting} className="mt-5 flex gap-2"><div className="min-w-0 flex-1"><div className="relative"><Keyboard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={joinId} onChange={e => { setJoinId(e.target.value); setJoinError('') }} placeholder="abc-def-ghi" className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 font-mono text-xs outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" aria-invalid={!!joinError} /></div>{joinError && <p className="mt-2 text-xs text-destructive">{joinError}</p>}</div><button className="h-9 rounded-md border border-border bg-muted/30 px-4 text-xs font-medium transition hover:bg-muted active:scale-[.98]">Join</button></form></article>
      </section>
      <section className="rounded-xl border border-border bg-card p-5"><div className="flex items-center justify-between gap-3 text-xs"><strong>{count} / {limit} meetings this month</strong><span className="text-muted-foreground">{plan === 'premium' ? '100' : '10'} participants max</span></div><div className="mt-4 h-1 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${percent > 80 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${percent}%` }} /></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"><span>{percent > 80 ? 'You are nearing your monthly quota.' : 'Quota resets on Nov 1, 2024'}</span><a href="/pricing" className="font-medium text-primary hover:underline">Upgrade plan</a></div></section>
      <section className="grid grid-cols-2 gap-x-5 gap-y-6 pt-1 md:grid-cols-4">{[[Video, 'HD video', '720p & 1080p high definition streams'], [Gauge, 'Low latency', 'Peer-to-peer WebRTC connection'], [LockKeyhole, 'Secure signaling', 'Encrypted signaling and rooms'], [Captions, 'Transcripts', 'Automatic in-call text logs']].map(([Icon, title, description]) => <div key={title} className="flex gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div><h3 className="text-xs font-semibold">{title}</h3><p className="mt-1 text-xs leading-4 text-muted-foreground">{description}</p></div></div>)}</section>
    </div>
  </main>
}
export default Dashboard
