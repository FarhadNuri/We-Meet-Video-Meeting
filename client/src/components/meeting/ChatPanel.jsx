import React, { useEffect, useRef, useState } from 'react'
import { X, Send } from 'lucide-react'

const ChatPanel = ({ isOpen, onClose, messages = [], onSendMessage, currentUser }) => {
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isOpen])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSendMessage(text);
            setText("")
        }
    }

    if (!isOpen) return null;

    return (
        <aside
            className="fixed sm:absolute right-0 bottom-0 sm:top-0 z-50 w-full sm:w-[380px] h-[75vh] sm:h-full rounded-t-2xl sm:rounded-none flex flex-col border-t sm:border-t-0 sm:border-l transition-transform duration-200 ease-out shadow-2xl"
            style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
            }}
        >
            {/* Header: "In-call messages" + X close button */}
            <div
                className="px-5 py-3.5 border-b flex items-center justify-between shrink-0"
                style={{ borderColor: 'var(--border)' }}
            >
                <h3 className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                    In-call messages
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
                    aria-label="Close chat"
                >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
            </div>

            {/* Muted notice */}
            <div
                className="px-4 py-2.5 border-b text-[13px] leading-relaxed"
                style={{
                    backgroundColor: 'var(--bg-section)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                }}
            >
                Messages can only be seen by people in the call and disappear when the call ends.
            </div>

            {/* Scrollable feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                    <div className="h-full min-h-[180px] flex flex-col items-center justify-center text-center p-4">
                        <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                            No messages yet.
                        </p>
                        <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
                            Send a message to start chatting with participants.
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === currentUser?.id;
                        const timeStr = msg.time || (msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");

                        return (
                            <div key={msg.id || index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                                {!isMe && (
                                    <div className="flex items-center gap-2 mb-1 pl-1">
                                        <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold"
                                            style={{
                                                backgroundColor: 'rgba(43,92,240,0.12)',
                                                color: '#2B5CF0',
                                            }}
                                        >
                                            {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : "?"}
                                        </div>
                                        <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            {msg.senderName}
                                        </span>
                                        {timeStr && (
                                            <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                                                {timeStr}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div
                                    className={`px-3.5 py-2.5 rounded-2xl max-w-[85%] text-[14px] leading-relaxed ${
                                        isMe
                                            ? "bg-[#2B5CF0] text-white rounded-tr-xs"
                                            : "border rounded-tl-xs"
                                    }`}
                                    style={
                                        !isMe
                                            ? {
                                                  backgroundColor: 'var(--bg-section)',
                                                  borderColor: 'var(--border)',
                                                  color: 'var(--text-secondary)',
                                              }
                                            : undefined
                                    }
                                >
                                    {msg.text}
                                </div>

                                {isMe && timeStr && (
                                    <span className="text-[11px] font-mono mt-1 pr-1" style={{ color: 'var(--text-muted)' }}>
                                        {timeStr}
                                    </span>
                                )}
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Bottom input dock: rounded input "Send a message..." + Send icon button (turns blue when text is entered) */}
            <form
                onSubmit={handleSubmit}
                className="p-3 border-t flex items-center gap-2 shrink-0"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}
            >
                <input
                    type="text"
                    placeholder="Send a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 rounded-full px-4 py-2.5 text-[14px] outline-none transition-colors border"
                    style={{
                        backgroundColor: 'var(--bg-section)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                    }}
                />

                <button
                    type="submit"
                    disabled={!text.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        text.trim()
                            ? "bg-[#2B5CF0] text-white hover:bg-[#3A6AF5]"
                            : "opacity-40 cursor-not-allowed"
                    }`}
                    style={
                        !text.trim()
                            ? {
                                  backgroundColor: 'var(--bg-section)',
                                  color: 'var(--text-muted)',
                              }
                            : undefined
                    }
                    title="Send message"
                >
                    <Send className="w-4 h-4" strokeWidth={1.5} />
                </button>
            </form>
        </aside>
    )
}

export default ChatPanel
