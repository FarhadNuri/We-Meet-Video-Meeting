import React from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

const DeleteSessionModal = ({ session, isOwner, isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen || !session) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <div
                className="rounded-[12px] max-w-md w-full p-5 sm:p-6 flex flex-col gap-4 animate-modal-in"
                style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                }}
            >
                {/* Top: 40px circular container with soft red tint + Trash2 icon & Close button */}
                <div className="flex items-start justify-between">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#EF4444' }}
                    >
                        <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-50"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-section)';
                            e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Title + Role pill */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[18px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {isOwner ? "Delete Meeting" : "Remove from Sessions"}
                        </h3>
                        {isOwner ? (
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
                        ) : (
                            <span
                                className="text-[12px] font-medium px-2 py-0.5 rounded border"
                                style={{
                                    backgroundColor: 'rgba(107,114,128,0.1)',
                                    color: 'var(--text-muted)',
                                    borderColor: 'var(--border)',
                                }}
                            >
                                Participant
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {isOwner
                            ? "Deleting this meeting will permanently delete the meeting, all messages, and participant records for everyone."
                            : "Removing this meeting only hides it from your private session history. Other participants are not affected."}
                    </p>
                </div>

                {/* Host only: red-tinted callout box */}
                {isOwner && (
                    <div
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium"
                        style={{
                            backgroundColor: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            color: '#EF4444',
                        }}
                    >
                        <AlertTriangle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                        <span>This action cannot be undone.</span>
                    </div>
                )}

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="h-10 px-4 rounded-lg text-[14px] font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50"
                        style={{
                            backgroundColor: 'var(--bg-section)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                        }}
                        onMouseEnter={e => !isDeleting && (e.currentTarget.style.backgroundColor = 'var(--bg-card)')}
                        onMouseLeave={e => !isDeleting && (e.currentTarget.style.backgroundColor = 'var(--bg-section)')}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="h-10 px-4 rounded-lg text-[14px] font-medium text-white transition-colors duration-150 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        style={{ backgroundColor: '#EF4444' }}
                        onMouseEnter={e => !isDeleting && (e.currentTarget.style.backgroundColor = '#DC2626')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#EF4444')}
                    >
                        {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isDeleting
                            ? "Deleting..."
                            : isOwner
                            ? "Delete Permanently"
                            : "Remove"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSessionModal;
