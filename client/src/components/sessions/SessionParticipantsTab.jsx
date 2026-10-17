import { Users, Crown } from 'lucide-react'
import React from 'react'

const SessionParticipantsTab = ({ participants = [], host }) => {

  if (!participants || participants.length === 0) {
    return (
      <div className="h-full min-h-[220px] flex flex-col items-center justify-center py-12 gap-2 text-center" style={{ color: 'var(--text-muted)' }}>
        <div
          className="w-10 h-10 rounded-full border flex items-center justify-center mb-1"
          style={{ backgroundColor: 'var(--bg-section)', borderColor: 'var(--border)' }}
        >
          <Users className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          No participant logs recorded.
        </p>
        <p className="text-[13px] max-w-xs">
          Participants who join this meeting session will be recorded here with timestamps and duration.
        </p>
      </div>
    )
  }

  const hostId = host?.id || host;

  const calculateDuration = (joinedAt, leftAt) => {
    if (!joinedAt) return "-";
    const start = new Date(joinedAt).getTime();
    const end = leftAt ? new Date(leftAt).getTime() : Date.now();
    const diffMins = Math.max(1, Math.round((end - start) / 60000));
    if (diffMins >= 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
    return `${diffMins} mins`;
  };

  const formatTime = (iso) => {
    if (!iso) return "Active now";
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full">
      {/* Desktop table header */}
      <div
        className="hidden sm:grid sm:grid-cols-12 gap-3 px-3 py-2 text-[12px] font-semibold uppercase tracking-wider border-b"
        style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
      >
        <div className="col-span-5">Participant</div>
        <div className="col-span-2">Joined</div>
        <div className="col-span-3">Left</div>
        <div className="col-span-2 text-right">Duration</div>
      </div>

      {/* Rows */}
      <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
        {participants.map((p, idx) => {
          const participantUserId = p.user?.id || p.user || p.id;
          const isHost = Boolean(
            p.isHost || (hostId && participantUserId && participantUserId.toString() === hostId.toString())
          );
          const duration = calculateDuration(p.joinedAt, p.leftAt);

          return (
            <div
              key={idx}
              className="p-3 sm:py-3 sm:px-3 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-start sm:items-center text-[14px] rounded-lg transition-colors hover:bg-[var(--bg-section)]"
            >
              {/* Participant */}
              <div className="col-span-5 flex items-center gap-2.5 w-full">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                  style={{
                    backgroundColor: isHost ? 'rgba(245,158,11,0.12)' : 'rgba(43,92,240,0.12)',
                    color: isHost ? '#F59E0B' : '#2B5CF0',
                    border: `1px solid ${isHost ? 'rgba(245,158,11,0.25)' : 'rgba(43,92,240,0.2)'}`,
                  }}
                >
                  {p.name ? p.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold truncate text-[14px]" style={{ color: 'var(--text-primary)' }}>
                      {p.name || "Participant"}
                    </span>
                    {isHost && (
                      <Crown className="w-4 h-4 shrink-0" strokeWidth={1.5} style={{ color: '#F59E0B' }} title="Host" />
                    )}
                  </div>
                  {p.user?.email && (
                    <p className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {p.user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Joined */}
              <div className="col-span-2 text-[13px] font-mono flex sm:block items-center justify-between w-full sm:w-auto" style={{ color: 'var(--text-secondary)' }}>
                <span className="sm:hidden text-[12px] uppercase tracking-wider text-muted font-sans mr-2">Joined:</span>
                <span>{formatTime(p.joinedAt)}</span>
              </div>

              {/* Left */}
              <div className="col-span-3 text-[13px] font-mono flex sm:block items-center justify-between w-full sm:w-auto" style={{ color: 'var(--text-secondary)' }}>
                <span className="sm:hidden text-[12px] uppercase tracking-wider text-muted font-sans mr-2">Left:</span>
                <span>{formatTime(p.leftAt)}</span>
              </div>

              {/* Duration */}
              <div className="col-span-2 sm:text-right text-[13px] font-medium flex sm:block items-center justify-between w-full sm:w-auto" style={{ color: 'var(--text-primary)' }}>
                <span className="sm:hidden text-[12px] uppercase tracking-wider text-muted font-sans mr-2">Duration:</span>
                <span>{duration}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SessionParticipantsTab