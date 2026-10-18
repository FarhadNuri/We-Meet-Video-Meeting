import { Mic, MicOff, Video, VideoOff, MessageSquare, Users, Copy, Check, LogOut, PhoneOff } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

const ControlBar = ({
    roomId,
    audioEnabled,
    videoEnabled,
    onToggleAudio,
    onToggleVideo,
    onToggleChat,
    onToggleParticipants,
    isChatOpen,
    isParticipantsOpen,
    unreadCount,
    participantCount,
    isHost,
    onLeave,
    onEndMeeting
}) => {
    const [copied, setCopied] = useState(false)

    const copyMeetingId = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        toast.success("Meeting link copied!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-16px)] xs:w-[calc(100vw-32px)] sm:w-auto max-w-lg">
            <div
                className="w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 rounded-full flex items-center justify-between sm:justify-center gap-1 xs:gap-1.5 sm:gap-2.5 transition-all overflow-x-auto no-scrollbar"
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
                }}
            >
                {/* Mic toggle */}
                <button
                    type="button"
                    onClick={onToggleAudio}
                    title={audioEnabled ? "Turn off microphone" : "Turn on microphone"}
                    className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    style={{
                        backgroundColor: audioEnabled ? 'var(--bg-section)' : 'rgba(239, 68, 68, 0.15)',
                        color: audioEnabled ? 'var(--text-primary)' : '#EF4444',
                        border: `1px solid ${audioEnabled ? 'var(--border)' : 'rgba(239, 68, 68, 0.3)'}`,
                    }}
                >
                    {audioEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />}
                </button>

                {/* Camera toggle */}
                <button
                    type="button"
                    onClick={onToggleVideo}
                    title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                    className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    style={{
                        backgroundColor: videoEnabled ? 'var(--bg-section)' : 'rgba(239, 68, 68, 0.15)',
                        color: videoEnabled ? 'var(--text-primary)' : '#EF4444',
                        border: `1px solid ${videoEnabled ? 'var(--border)' : 'rgba(239, 68, 68, 0.3)'}`,
                    }}
                >
                    {videoEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />}
                </button>

                {/* Participants toggle (Users icon + live count badge) */}
                <button
                    type="button"
                    onClick={onToggleParticipants}
                    title="Participants"
                    className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer relative shrink-0"
                    style={{
                        backgroundColor: isParticipantsOpen ? '#2B5CF0' : 'var(--bg-section)',
                        color: isParticipantsOpen ? '#FFFFFF' : 'var(--text-primary)',
                        border: `1px solid ${isParticipantsOpen ? '#2B5CF0' : 'var(--border)'}`,
                    }}
                >
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                    {participantCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1 min-w-[17px] h-[17px] sm:min-w-[20px] sm:h-[20px] px-1 rounded-full text-[10px] sm:text-[11px] font-semibold flex items-center justify-center border"
                            style={{
                                backgroundColor: isParticipantsOpen ? '#1D4ED8' : 'var(--bg-card)',
                                color: isParticipantsOpen ? '#FFFFFF' : 'var(--text-primary)',
                                borderColor: 'var(--border)',
                            }}
                        >
                            {participantCount}
                        </span>
                    )}
                </button>

                {/* Chat toggle (MessageSquare icon + red unread-count badge) */}
                <button
                    type="button"
                    onClick={onToggleChat}
                    title="In-call chat"
                    className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer relative shrink-0"
                    style={{
                        backgroundColor: isChatOpen ? '#2B5CF0' : 'var(--bg-section)',
                        color: isChatOpen ? '#FFFFFF' : 'var(--text-primary)',
                        border: `1px solid ${isChatOpen ? '#2B5CF0' : 'var(--border)'}`,
                    }}
                >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
                    {unreadCount > 0 && !isChatOpen && (
                        <span
                            className="absolute -top-1 -right-1 min-w-[17px] h-[17px] sm:min-w-[20px] sm:h-[20px] px-1 rounded-full text-[10px] sm:text-[11px] font-semibold flex items-center justify-center bg-[#EF4444] text-white border-2"
                            style={{ borderColor: 'var(--bg-elevated)' }}
                        >
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Copy link button */}
                <button
                    type="button"
                    onClick={copyMeetingId}
                    title="Copy meeting link"
                    className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    style={{
                        backgroundColor: 'var(--bg-section)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border)',
                    }}
                >
                    {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" strokeWidth={1.5} /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />}
                </button>

                {/* Thin vertical divider */}
                <div className="w-[1px] h-6 sm:h-7 my-auto shrink-0" style={{ backgroundColor: 'var(--border)' }} />

                {/* Leave / End buttons */}
                {isHost ? (
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        <button
                            type="button"
                            onClick={onLeave}
                            title="Leave meeting"
                            className="h-9 xs:h-10 sm:h-11 px-2.5 xs:px-3 sm:px-4 rounded-full text-[12px] sm:text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                            style={{
                                backgroundColor: 'var(--bg-section)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                            <span className="hidden md:inline">Leave</span>
                        </button>
                        <button
                            type="button"
                            onClick={onEndMeeting}
                            title="End meeting for all participants"
                            className="h-9 xs:h-10 sm:h-11 px-2.5 xs:px-3.5 sm:px-5 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-[12px] sm:text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                            <PhoneOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                            <span className="hidden sm:inline">End for all</span>
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={onLeave}
                        title="Leave meeting"
                        className="h-9 xs:h-10 sm:h-11 px-3 sm:px-4 rounded-full bg-[#EF4444] hover:bg-[#DC2626] text-white text-[12px] sm:text-[14px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
                    >
                        <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
                        <span className="hidden sm:inline">Leave</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default ControlBar
