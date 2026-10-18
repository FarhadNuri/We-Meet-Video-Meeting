import React, { useState } from 'react'
import { X, MessageSquare, Users } from 'lucide-react';
import SessionChatTab from './SessionChatTab';
import SessionParticipantsTab from './SessionParticipantsTab';

const SessionDetailModal = ({ session, onClose }) => {

    if (!session) return null;
    const [activeTab, setActiveTab] = useState('chat')

    const isEnded = session.status === "ended";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60">
            <div
                className="rounded-[12px] max-w-2xl w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-modal-in"
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}
            >
                {/* Header */}
                <div className="px-4 py-3.5 sm:px-6 sm:py-5 flex items-start justify-between border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="space-y-1.5 pr-3 sm:pr-4 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Monospace ID chip */}
                            <span
                                className="text-[11px] sm:text-[12px] font-mono px-2 py-0.5 rounded border"
                                style={{
                                    backgroundColor: 'var(--bg-section)',
                                    color: 'var(--text-muted)',
                                    borderColor: 'var(--border)',
                                }}
                            >
                                ID: {session.meetingId || session.id}
                            </span>

                            {/* Status badge */}
                            <span
                                className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: isEnded ? 'rgba(107,114,128,0.08)' : 'rgba(34,197,94,0.08)',
                                    color: isEnded ? '#6B7280' : '#22C55E',
                                }}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full inline-block ${!isEnded ? 'animate-live-pulse bg-[#22C55E]' : 'bg-[#6B7280]'}`}
                                />
                                {isEnded ? 'Ended' : 'Active'}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-[17px] sm:text-[20px] font-semibold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
                            {session.title || "Meeting Details"}
                        </h2>

                        {/* Muted host metadata line */}
                        <p className="text-[12px] sm:text-[13px] flex items-center gap-1.5 flex-wrap" style={{ color: 'var(--text-muted)' }}>
                            <span>Host: <strong className="font-medium" style={{ color: 'var(--text-secondary)' }}>{session.host?.name || "Host"}</strong></span>
                            {session.host?.email && <span className="hidden xs:inline">({session.host.email})</span>}
                            <span>•</span>
                            <span>{new Date(session.createdAt || Date.now()).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-section)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                        aria-label="Close session details"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Tab bar (underline style, not pills) */}
                <div className="flex px-4 sm:px-6 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--border)' }}>
                    <button
                        type="button"
                        onClick={() => setActiveTab('chat')}
                        className="flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-1 mr-4 sm:mr-6 text-[12px] sm:text-[14px] font-medium border-b-2 transition-colors duration-150 cursor-pointer shrink-0"
                        style={{
                            borderBottomColor: activeTab === 'chat' ? '#2B5CF0' : 'transparent',
                            color: activeTab === 'chat' ? 'var(--text-primary)' : 'var(--text-muted)',
                            marginBottom: '-1px',
                        }}
                    >
                        <MessageSquare className="w-4 h-4" strokeWidth={1.5} style={{ color: activeTab === 'chat' ? '#2B5CF0' : 'var(--text-muted)' }} />
                        <span>Chat Transcript ({session.messages?.length || 0})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('participants')}
                        className="flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-1 text-[12px] sm:text-[14px] font-medium border-b-2 transition-colors duration-150 cursor-pointer shrink-0"
                        style={{
                            borderBottomColor: activeTab === 'participants' ? '#2B5CF0' : 'transparent',
                            color: activeTab === 'participants' ? 'var(--text-primary)' : 'var(--text-muted)',
                            marginBottom: '-1px',
                        }}
                    >
                        <Users className="w-4 h-4" strokeWidth={1.5} style={{ color: activeTab === 'participants' ? '#2B5CF0' : 'var(--text-muted)' }} />
                        <span>Participant Logs ({session.participants?.length || 0})</span>
                    </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto min-h-[220px] sm:min-h-[280px]">
                    {activeTab === 'chat'
                        ? <SessionChatTab messages={session.messages} />
                        : <SessionParticipantsTab participants={session.participants} host={session.host} />
                    }
                </div>
            </div>
        </div>
    )
}

export default SessionDetailModal

