import { ArrowLeftIcon, ChevronDownIcon } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { dummySessions } from '../assets/asset'
import EmptySessions from '../components/sessions/EmptySessions'
import SessionCard from '../components/sessions/SessionCard'
import SessionDetailModal from '../components/sessions/SessionDetailModal'
import DeleteSessionModal from '../components/sessions/DeleteSessionModal'
import { useAuth, useUser } from '@clerk/react'
import api from '../config/api.js'
import toast from 'react-hot-toast'

const Sessions = () => {

  const [sessions, setSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    const fetchSessions = async () => {
      if (!isLoaded || !isSignedIn) return;

      try {
        const token = await getToken();
        if (!token) return;
        const res = await api("/api/meetings/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(res.data.meetings || []);
      } catch (_error) {
        toast.error("Failed to load meeting sessions");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions()
  }, [isLoaded, isSignedIn, getToken]);

  const openSessionDetails = async (sessionId) => {
    try {
      const token = await getToken();
      const res = await api.get(`/api/meetings/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSelectedSession(res.data.meeting);
    } catch (_error) {
      toast.error("Could not fetch session details");
    }
  }

  const isOwnerOfSession = (session) => {
    if (!session || !user) return false;
    const hostId = session.host?.id || session.host;
    return Boolean(hostId && hostId.toString() === user.id.toString());
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    setIsDeleting(true);

    try {
      const token = await getToken();
      const targetId = sessionToDelete.meetingId || sessionToDelete.id;
      const res = await api.delete(`/api/meetings/sessions/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data?.message || "Meeting deleted");
      setSessions((prev) =>
        prev.filter((s) => s.id !== sessionToDelete.id && s.meetingId !== sessionToDelete.meetingId)
      );

      if (
        selectedSession &&
        (selectedSession.id === sessionToDelete.id || selectedSession.meetingId === sessionToDelete.meetingId)
      ) {
        setSelectedSession(null);
      }

      setSessionToDelete(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete meeting");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
      {/* Page Title & Navigation Header */}
      <Link to="/dashboard" className="flex items-center text-sm gap-1 mb-4 text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeftIcon size={14} /> Go to Dashboard
      </Link>
      <div className='mb-8'>
        <h1 className='text-3xl font-medium tracking-tight text-slate-900'>Meeting sessions.</h1>
        <p className='text-sm text-slate-500 mt-1'>Review your past and active meeting history, participant logs, and chat transcripts.</p>
      </div>

      {/* Sessions Grid / Loading Skeletons / Empty State */}
      {
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur rounded-3xl p-6 flex flex-col justify-between space-y-5 border border-slate-100/60 shadow-xs animate-pulse min-h-[250px]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-slate-200/70 rounded-md" />
                    <div className="h-5 w-16 bg-slate-200/70 rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-slate-200/70 rounded-md" />
                  <div className="h-4 w-1/2 bg-slate-200/50 rounded-md" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/40">
                  <div className="h-9 bg-slate-200/50 rounded-xl" />
                  <div className="h-9 bg-slate-200/50 rounded-xl" />
                </div>
                <div className="flex items-center justify-between gap-2.5 pt-2">
                  <div className="h-9 flex-1 bg-slate-200/60 rounded-full" />
                  <div className="size-9.5 shrink-0 bg-slate-200/60 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <EmptySessions />
        ) : (
          <div className="space-y-10">
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {sessions.slice(0, visibleCount).map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  currentUserId={user?.id}
                  onOpenDetails={openSessionDetails}
                  onRejoin={(meetingId) => navigate(`/meeting/${meetingId}`)}
                  onDelete={(s) => setSessionToDelete(s)}
                />
              ))}
            </div>

            {/* View More Button */}
            {visibleCount < sessions.length && (
              <div className="flex flex-col items-center justify-center pt-2 pb-4 gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>View More</span>
                  <ChevronDownIcon className="w-4 h-4 text-slate-500" />
                </button>
                <span className="text-xs text-slate-400 font-mono">
                  Showing {Math.min(visibleCount, sessions.length)} of {sessions.length} sessions
                </span>
              </div>
            )}
          </div>
        )
      }

      {/* Session Detail Modal */}
      <SessionDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} />

      {/* Delete / Hide Session Confirmation Modal */}
      <DeleteSessionModal
        isOpen={Boolean(sessionToDelete)}
        session={sessionToDelete}
        isOwner={isOwnerOfSession(sessionToDelete)}
        onClose={() => !isDeleting && setSessionToDelete(null)}
        onConfirm={confirmDeleteSession}
        isDeleting={isDeleting}
      />
    </main>
  )
}

export default Sessions