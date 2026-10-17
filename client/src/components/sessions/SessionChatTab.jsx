import { MessageSquare } from 'lucide-react'
import React from 'react'

const SessionChatTab = ({ messages = [] }) => {

  if (!messages || messages.length === 0) {
    return (
      <div className="h-full min-h-[220px] flex flex-col items-center justify-center py-12 gap-2 text-center" style={{ color: 'var(--text-muted)' }}>
        <div
          className="w-10 h-10 rounded-full border flex items-center justify-center mb-1"
          style={{ backgroundColor: 'var(--bg-section)', borderColor: 'var(--border)' }}
        >
          <MessageSquare className="w-5 h-5" strokeWidth={1.5} />
        </div>
        <p className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          No messages were sent in this meeting.
        </p>
        <p className="text-[13px] max-w-xs">
          Chat messages and real-time transcripts sent by meeting participants will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((msg, idx) => {
        const prevMsg = idx > 0 ? messages[idx - 1] : null;
        const isFirstInGroup = !prevMsg || (prevMsg.senderId !== msg.senderId && prevMsg.senderName !== msg.senderName);

        const timeStr = msg.time || (msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");

        return (
          <div key={msg.id || idx} className={isFirstInGroup ? "pt-1" : ""}>
            {isFirstInGroup ? (
              <div className="flex items-start gap-2.5">
                {/* Initials avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 mt-0.5"
                  style={{
                    backgroundColor: 'rgba(43,92,240,0.12)',
                    color: '#2B5CF0',
                    border: '1px solid rgba(43,92,240,0.2)',
                  }}
                >
                  {msg.senderName ? msg.senderName.charAt(0).toUpperCase() : "?"}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {msg.senderName || "Participant"}
                    </span>
                    {timeStr && (
                      <span className="text-[12px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        {timeStr}
                      </span>
                    )}
                  </div>
                  <div
                    className="rounded-lg p-2.5 text-[14px] leading-relaxed inline-block max-w-full"
                    style={{
                      backgroundColor: 'var(--bg-section)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pl-[42px] space-y-1 mt-1">
                <div
                  className="rounded-lg p-2.5 text-[14px] leading-relaxed inline-block max-w-full"
                  style={{
                    backgroundColor: 'var(--bg-section)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SessionChatTab
