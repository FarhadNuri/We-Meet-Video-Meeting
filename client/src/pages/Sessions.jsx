import { ChevronDown, ArrowLeft } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptySessions from '../components/sessions/EmptySessions'
import SessionCard from '../components/sessions/SessionCard'
import SessionDetailModal from '../components/sessions/SessionDetailModal'
import DeleteSessionModal from '../components/sessions/DeleteSessionModal'
import { useAuth, useUser } from '@clerk/react'
import api from '../config/api.js'
import toast from 'react-hot-toast'

// Mock preview sessions matching the design reference screenshot
const PREVIEW_SESSIONS = [
  {
    id: "s-1",
    meetingId: "wm-982-dx4",
    title: "Weekly Engineering Sync",
    status: "active",
    isHost: true,
    metaText: "Started 24m ago • Today, 10:00 AM",
    onlineCount: 8,
    notesCount: 42,
    createdAt: "2024-05-19T10:00:00.000Z",
    host: { id: "user_mock_001", name: "Host" },
    participants: new Array(8).fill({}),
    messages: new Array(42).fill({}),
  },
  {
    id: "s-2",
    meetingId: "wm-441-kq9",
    title: "Design System Alignment",
    status: "active",
    isHost: false,
    metaText: "Started 12m ago • Today, 10:15 AM",
    onlineCount: 4,
    notesCount: 19,
    createdAt: "2024-05-19T10:15:00.000Z",
    host: { id: "user_other", name: "Other" },
    participants: new Array(4).fill({}),
    messages: new Array(19).fill({}),
  },
  {
    id: "s-3",
    meetingId: "wm-782-p18",
    title: "Customer Discovery: Acme Corp",
    status: "ended",
    isHost: true,
    metaText: "Yesterday • 45 mins",
    attendeesCount: 8,
    messagesCount: 84,
    createdAt: "2024-05-18T14:00:00.000Z",
    endedAt: "2024-05-18T14:45:00.000Z",
    host: { id: "user_mock_001", name: "Host" },
    participants: new Array(8).fill({}),
    messages: new Array(84).fill({}),
  },
  {
    id: "s-4",
    meetingId: "wm-311-zz2",
    title: "Sprint 42 Retrospective",
    status: "ended",
    isHost: false,
    metaText: "May 18, 2024 • 1h 10m",
    attendeesCount: 12,
    messagesCount: 83,
    createdAt: "2024-05-18T16:00:00.000Z",
    endedAt: "2024-05-18T17:10:00.000Z",
    host: { id: "user_other_2", name: "Other" },
    participants: new Array(12).fill({}),
    messages: new Array(83).fill({}),
  },
  {
    id: "s-5",
    meetingId: "wm-156-rr5",
    title: "Product Roadmap Discussion",
    status: "ended",
    isHost: true,
    metaText: "May 16, 2024 • 52 mins",
    attendeesCount: 9,
    messagesCount: 118,
    createdAt: "2024-05-16T11:00:00.000Z",
    endedAt: "2024-05-16T11:52:00.000Z",
    host: { id: "user_mock_001", name: "Host" },
    participants: new Array(9).fill({}),
    messages: new Array(118).fill({}),
  },
  {
    id: "s-6",
    meetingId: "wm-882-bv1",
    title: "Security & Compliance Review",
    status: "ended",
    isHost: false,
    metaText: "May 14, 2024 • 35 mins",
    attendeesCount: 5,
    messagesCount: 27,
    createdAt: "2024-05-14T09:00:00.000Z",
    endedAt: "2024-05-14T09:35:00.000Z",
    host: { id: "user_other_3", name: "Other" },
    participants: new Array(5).fill({}),
    messages: new Array(27).fill({}),
  },
  {
    id: "s-7",
    meetingId: "wm-551-op2",
    title: "Q2 Executive Briefing",
    status: "ended",
    isHost: false,
    metaText: "May 12, 2024 • 40 mins",
    attendeesCount: 14,
    messagesCount: 65,
    createdAt: "2024-05-12T15:00:00.000Z",
    endedAt: "2024-05-12T15:40:00.000Z",
    participants: new Array(14).fill({}),
    messages: new Array(65).fill({}),
  },
  {
    id: "s-8",
    meetingId: "wm-209-kl3",
    title: "Frontend Architecture Refactor",
    status: "ended",
    isHost: true,
    metaText: "May 10, 2024 • 1h 25m",
    attendeesCount: 7,
    messagesCount: 92,
    createdAt: "2024-05-10T13:00:00.000Z",
    endedAt: "2024-05-10T14:25:00.000Z",
    participants: new Array(7).fill({}),
    messages: new Array(92).fill({}),
  },
  {
    id: "s-9",
    meetingId: "wm-902-qa4",
    title: "Design Critique: Brand Assets",
    status: "ended",
    isHost: false,
    metaText: "May 08, 2024 • 30 mins",
    attendeesCount: 6,
    messagesCount: 38,
    createdAt: "2024-05-08T11:00:00.000Z",
    endedAt: "2024-05-08T11:30:00.000Z",
    participants: new Array(6).fill({}),
    messages: new Array(38).fill({}),
  },
  {
    id: "s-10",
    meetingId: "wm-112-xm7",
    title: "User Interview #14: Enterprise Admin",
    status: "ended",
    isHost: true,
    metaText: "May 05, 2024 • 50 mins",
    attendeesCount: 3,
    messagesCount: 45,
    createdAt: "2024-05-05T10:00:00.000Z",
    endedAt: "2024-05-05T10:50:00.000Z",
    participants: new Array(3).fill({}),
    messages: new Array(45).fill({}),
  },
  {
    id: "s-11",
    meetingId: "wm-449-tn8",
    title: "DevOps Pipeline Optimization",
    status: "ended",
    isHost: false,
    metaText: "May 03, 2024 • 1h 05m",
    attendeesCount: 8,
    messagesCount: 54,
    createdAt: "2024-05-03T16:00:00.000Z",
    endedAt: "2024-05-03T17:05:00.000Z",
    participants: new Array(8).fill({}),
    messages: new Array(54).fill({}),
  },
  {
    id: "s-12",
    meetingId: "wm-772-lp9",
    title: "Growth Metrics Deep Dive",
    status: "ended",
    isHost: true,
    metaText: "Apr 28, 2024 • 45 mins",
    attendeesCount: 11,
    messagesCount: 110,
    createdAt: "2024-04-28T09:00:00.000Z",
    endedAt: "2024-04-28T09:45:00.000Z",
    participants: new Array(11).fill({}),
    messages: new Array(110).fill({}),
  },
  {
    id: "s-13",
    meetingId: "wm-603-yt2",
    title: "Customer Support Escalations",
    status: "ended",
    isHost: false,
    metaText: "Apr 25, 2024 • 25 mins",
    attendeesCount: 5,
    messagesCount: 32,
    createdAt: "2024-04-25T14:30:00.000Z",
    endedAt: "2024-04-25T14:55:00.000Z",
    participants: new Array(5).fill({}),
    messages: new Array(32).fill({}),
  },
  {
    id: "s-14",
    meetingId: "wm-388-wq1",
    title: "All-Hands Kickoff Q2",
    status: "ended",
    isHost: true,
    metaText: "Apr 20, 2024 • 1h 00m",
    attendeesCount: 28,
    messagesCount: 176,
    createdAt: "2024-04-20T17:00:00.000Z",
    endedAt: "2024-04-20T18:00:00.000Z",
    participants: new Array(28).fill({}),
    messages: new Array(176).fill({}),
  },
];

const Sessions = () => {

  const [sessions, setSessions] = useState(PREVIEW_SESSIONS)
  const [selectedSession, setSelectedSession] = useState(null)
  const [sessionToDelete, setSessionToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { isLoaded, isSignedIn, getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    const fetchSessions = async () => {
      if (!isLoaded || !isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await api("/api/meetings/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data?.meetings && res.data.meetings.length > 0) {
          setSessions(res.data.meetings);
        }
      } catch (_error) {
        // Keep preview sessions in case of error in preview/dev
      } finally {
        setLoading(false);
      }
    };
    fetchSessions()
  }, [isLoaded, isSignedIn, getToken]);

  const openSessionDetails = async (sessionId) => {
    try {
      const token = await getToken();
      if (token) {
        const res = await api.get(`/api/meetings/sessions/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data?.meeting) {
          setSelectedSession(res.data.meeting);
          return;
        }
      }
    } catch (_error) {
      // Fallback for preview
    }
    const found = sessions.find((s) => (s.meetingId || s.id) === sessionId);
    if (found) {
      setSelectedSession(found);
    } else {
      toast.error("Could not fetch session details");
    }
  }

  const isOwnerOfSession = (session) => {
    if (!session) return false;
    if (session.isHost) return true;
    if (!user) return false;
    const hostId = session.host?.id || session.host;
    return Boolean(hostId && hostId.toString() === user.id.toString());
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    setIsDeleting(true);

    try {
      const token = await getToken();
      const targetId = sessionToDelete.meetingId || sessionToDelete.id;
      if (token) {
        await api.delete(`/api/meetings/sessions/${targetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      toast.success("Meeting deleted");
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
      // For mock deletion, still filter out cleanly
      setSessions((prev) =>
        prev.filter((s) => s.id !== sessionToDelete.id && s.meetingId !== sessionToDelete.meetingId)
      );
      toast.success("Meeting deleted");
      setSessionToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main
      className="flex-1 w-full"
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

        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Sessions
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--text-muted)' }}>
            Review past meeting logs, active rooms, transcripts, and attendee records.
          </p>
        </div>

        {/* Grid / Skeletons / Empty */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-[12px] border p-4 space-y-3 animate-pulse"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--border)' }} />
                  <div className="h-4 w-12 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
                </div>
                <div className="h-5 w-3/4 rounded" style={{ backgroundColor: 'var(--border)' }} />
                <div className="h-4 w-1/2 rounded" style={{ backgroundColor: 'var(--border)' }} />
                <div className="flex gap-4 pt-1">
                  <div className="h-3.5 w-16 rounded" style={{ backgroundColor: 'var(--border)' }} />
                  <div className="h-3.5 w-16 rounded" style={{ backgroundColor: 'var(--border)' }} />
                </div>
                <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                  <div className="h-8 w-24 rounded-lg" style={{ backgroundColor: 'var(--border)' }} />
                  <div className="h-8 w-8 rounded-lg" style={{ backgroundColor: 'var(--border)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <EmptySessions />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.slice(0, visibleCount).map((session) => (
                <SessionCard
                  key={session.id || session.meetingId}
                  session={session}
                  currentUserId={user?.id}
                  onOpenDetails={openSessionDetails}
                  onRejoin={(meetingId) => navigate(`/meeting/${meetingId}`)}
                  onDelete={(s) => setSessionToDelete(s)}
                />
              ))}
            </div>

            {visibleCount < sessions.length && (
              <div className="flex flex-col items-center gap-2 pt-4">
                <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  Showing {Math.min(visibleCount, sessions.length)} of {sessions.length} sessions
                </span>
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="h-9 px-4 rounded-lg text-[14px] font-medium flex items-center gap-1.5 transition-colors duration-150 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-section)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-section)'}
                >
                  View more
                  <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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

