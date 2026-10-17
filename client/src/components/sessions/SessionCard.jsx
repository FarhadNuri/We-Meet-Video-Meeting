import React from 'react'
import { CalendarIcon, UsersIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'

const SessionCard = ({ session, onOpenDetails, onRejoin, onDelete, currentUserId }) => {

    const isEnded = session.status === "ended"
    const hostId = session.host?.id || session.host;
    const isOwner = Boolean(currentUserId && hostId && hostId.toString() === currentUserId.toString());

    return (
        <div className="bg-white/70 backdrop-blur rounded-3xl p-6 transition-all flex flex-col justify-between space-y-5 border border-slate-100/60 shadow-xs hover:shadow-md">
            <div className="space-y-3">
                <div className='flex items-center justify-between'>
                    <div className="flex items-center gap-2">
                        <span className='text-xs font-mono text-slate-500 font-medium bg-slate-500/5 px-2.5 py-1 rounded-md'>ID: {session.meetingId}</span>
                        {isOwner && (
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                Host
                            </span>
                        )}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${isEnded ? "bg-slate-500/5 text-slate-500" : "bg-emerald-500/5 text-emerald-500"}`}>
                        <span className={`size-1.25 rounded-full ${isEnded ? "bg-slate-400" : "bg-emerald-500"}`}></span>
                        {isEnded ? "Ended" : "Active"}
                    </span>
                </div>
                <h3 className="text-xl font-medium text-slate-900 truncate">{session.title ||
                    "Instant Meeting"}</h3>

                <p className='text-xs text-slate-400 flex items-center gap-1.5'>
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(session.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
            <div className='grid grid-cols-2 gap-3 pt-3 border-t border-slate-300/30'>
                <div className='flex items-center gap-2 text-xs bg-slate-500/5 p-2.5 rounded-xl'>
                    <UsersIcon className="w-4 h-4 text-primary" />
                    <span>
                        <strong className='font-semibold text-slate-900'>{session.participants?.length || 0}</strong> Participants
                    </span>
                </div>
                <div className='flex items-center gap-2 text-xs bg-slate-500/5 p-2.5 rounded-xl'>
                    <MessageSquareIcon className="w-4 h-4 text-primary" />
                    <span>
                        <strong className='font-semibold text-slate-900'>{session.messages?.length || 0}</strong> Messages
                    </span>
                </div>
            </div>
            {/* Actions */}
            <div className="flex items-center justify-between gap-2.5 pt-2">
                <button onClick={() => onOpenDetails(session.meetingId)}
                    className='w-full bg-slate-400/10 hover:bg-slate-400/20 text-slate-800 font-medium py-2.5 px-4 rounded-full text-xs transition-all cursor-pointer text-center'>
                    View Details
                </button>
                {!isEnded && (
                    <button onClick={() => onRejoin(session.meetingId)}
                        className='w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-4 rounded-full text-xs transition-all shadow-xs cursor-pointer text-center'>
                        Re-join
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(session)}
                        title={isOwner ? "Delete meeting permanently" : "Remove meeting from history"}
                        className='size-9.5 shrink-0 flex items-center justify-center rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-600 transition-all cursor-pointer hover:scale-105 active:scale-95'
                        aria-label="Delete session"
                    >
                        <Trash2Icon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default SessionCard