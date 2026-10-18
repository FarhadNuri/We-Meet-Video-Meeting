import React from 'react'
import { X, Mic, MicOff, Video, VideoOff } from 'lucide-react'

const ParticipantList = ({
    isOpen,
    onClose,
    localUser,
    localAudio,
    localVideo,
    remoteUsers = [],
    meetingHostId
}) => {
    if (!isOpen) return null;

    const allParticipants = [
        {
            socketId: "local",
            userId: localUser?.id,
            userName: localUser?.name || "You",
            image: localUser?.image,
            audioEnabled: localAudio,
            videoEnabled: localVideo,
            isLocal: true,
        },
        ...remoteUsers,
    ];

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity"
                onClick={onClose}
            />
            <aside
                className="fixed sm:absolute right-0 bottom-0 sm:top-0 z-50 w-full sm:w-[380px] h-[82vh] sm:h-full rounded-t-2xl sm:rounded-none flex flex-col border-t sm:border-t-0 sm:border-l transition-transform duration-200 ease-out shadow-2xl"
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                }}
            >
                {/* Header: "Participants (count)" + X close button */}
                <div
                    className="px-4 sm:px-5 py-3 sm:py-3.5 border-b flex items-center justify-between shrink-0"
                    style={{ borderColor: 'var(--border)' }}
                >
                    <h3 className="text-[15px] sm:text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Participants ({allParticipants.length})
                    </h3>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'var(--bg-section)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                    aria-label="Close participants"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-1.5">
                {allParticipants.map((p) => {
                    const isHost = Boolean(meetingHostId && p.userId && p.userId.toString() === meetingHostId.toString());

                    return (
                        <div
                            key={p.socketId || p.userId}
                            className="flex items-center justify-between p-3 rounded-lg transition-colors"
                            style={{
                                backgroundColor: 'var(--bg-section)',
                                border: '1px solid var(--border)',
                            }}
                        >
                            {/* Avatar + Name + Host pill */}
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                {p.image ? (
                                    <img
                                        src={p.image}
                                        alt={p.userName}
                                        className="w-9 h-9 rounded-full object-cover shrink-0 border"
                                        style={{ borderColor: 'var(--border)' }}
                                    />
                                ) : (
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
                                        style={{
                                            backgroundColor: isHost ? 'rgba(245,158,11,0.12)' : 'rgba(43,92,240,0.12)',
                                            color: isHost ? '#F59E0B' : '#2B5CF0',
                                            border: `1px solid ${isHost ? 'rgba(245,158,11,0.25)' : 'rgba(43,92,240,0.2)'}`,
                                        }}
                                    >
                                        {p.userName ? p.userName.charAt(0).toUpperCase() : "?"}
                                    </div>
                                )}

                                <div className="min-w-0 flex items-center gap-1.5">
                                    <span
                                        className="text-[14px] font-medium truncate"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        {p.userName} {p.isLocal ? "(You)" : ""}
                                    </span>

                                    {isHost && (
                                        <span
                                            className="text-[11px] font-medium px-1.5 py-0.5 rounded border shrink-0"
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
                            </div>

                            {/* Status Icons: Mic & Video (red when muted/off, muted gray when on) */}
                            <div className="flex items-center gap-2 shrink-0">
                                {p.audioEnabled ? (
                                    <Mic className="w-4 h-4" strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                                ) : (
                                    <MicOff className="w-4 h-4 text-[#EF4444]" strokeWidth={1.5} />
                                )}
                                {p.videoEnabled ? (
                                    <Video className="w-4 h-4" strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                                ) : (
                                    <VideoOff className="w-4 h-4 text-[#EF4444]" strokeWidth={1.5} />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </aside>
        </>
    )
}

export default ParticipantList