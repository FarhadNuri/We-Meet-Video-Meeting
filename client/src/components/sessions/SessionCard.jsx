import React from 'react'
import { Clock, Calendar, Users, MessageSquare, Trash2 } from 'lucide-react'

const SessionCard = ({ session, onOpenDetails, onRejoin, onDelete, currentUserId }) => {

    const isEnded = session.status === "ended"
    const hostId = session.host?.id || session.host;
    const isOwner = Boolean(session.isHost || (currentUserId && hostId && hostId.toString() === currentUserId.toString()));

    const formatMeta = () => {
        if (session.metaText) return session.metaText;
        if (!isEnded) {
            const timeStr = session.createdAt ? new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM';
            return `Started recently • Today, ${timeStr}`;
        }
        if (session.createdAt) {
            const d = new Date(session.createdAt);
            return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        }
        return 'Recently ended';
    };

    return (
        <div
            className="rounded-[12px] border p-4 flex flex-col justify-between space-y-3 transition-colors duration-150"
            style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
            <div className="space-y-2.5">
                {/* Top row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Monospace ID chip */}
                        <span
                            className="text-[12px] font-mono px-2 py-0.5 rounded border"
                            style={{
                                backgroundColor: 'var(--bg-section)',
                                color: 'var(--text-muted)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            {session.meetingId || session.id}
                        </span>

                        {/* Host badge */}
                        {isOwner && (
                            <span
                                className="text-[12px] font-medium px-2 py-0.5 rounded border"
                                style={{
                                    backgroundColor: 'rgba(245,158,11,0.12)',
                                    color: '#F59E0B',
                                    borderColor: 'rgba(245,158,11,0.25)',
                                }}
                            >
                                Host
                            </span>
                        )}
                    </div>

                    {/* Status indicator */}
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`w-2 h-2 rounded-full inline-block ${!isEnded ? 'bg-[#22C55E] animate-pulse' : 'bg-[#6B7280]'}`}
                        />
                        <span
                            className="text-[13px] font-medium"
                            style={{ color: isEnded ? 'var(--text-muted)' : '#22C55E' }}
                        >
                            {isEnded ? 'Ended' : 'Active'}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h3
                    className="text-[16px] font-semibold truncate"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {session.title || "Instant Meeting"}
                </h3>

                {/* Meta line */}
                <div className="flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    {!isEnded ? (
                        <Clock className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    ) : (
                        <Calendar className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    )}
                    <span className="truncate">{formatMeta()}</span>
                </div>

                {/* Stat chips row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[12px] sm:text-[13px] pt-1" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        <span>
                            {session.onlineCount !== undefined
                                ? `${session.onlineCount} online`
                                : !isEnded
                                ? `${session.participants?.length || 0} online`
                                : `${session.attendeesCount ?? session.participants?.length ?? 0} attendees`}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        <span>
                            {session.notesCount !== undefined
                                ? `${session.notesCount} notes`
                                : session.messagesCount !== undefined
                                ? `${session.messagesCount} messages`
                                : !isEnded
                                ? `${session.messages?.length || 0} notes`
                                : `${session.messages?.length || 0} messages`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div>
                <div className="border-t my-3" style={{ borderColor: 'var(--border)' }} />
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => onOpenDetails(session.meetingId || session.id)}
                        className="h-9 px-3.5 rounded-lg text-[13px] font-medium transition-colors duration-150 cursor-pointer"
                        style={{
                            backgroundColor: 'var(--bg-section)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-section)'}
                    >
                        View details
                    </button>

                    {!isEnded && (
                        <button
                            type="button"
                            onClick={() => onRejoin(session.meetingId || session.id)}
                            className="h-9 px-3.5 rounded-lg text-[13px] font-medium text-white transition-colors duration-150 cursor-pointer"
                            style={{ backgroundColor: '#2B5CF0' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3A6AF5'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2B5CF0'}
                        >
                            Re-join
                        </button>
                    )}

                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(session)}
                            title={isOwner ? "Delete meeting permanently" : "Remove meeting from history"}
                            className="ml-auto w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.color = '#EF4444';
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.color = 'var(--text-muted)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-label="Delete session"
                        >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SessionCard

