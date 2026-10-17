import React from 'react';
import { XIcon, Trash2Icon, AlertTriangleIcon } from 'lucide-react';

const DeleteSessionModal = ({ session, isOwner, isOpen, onClose, onConfirm, isDeleting }) => {
    if (!isOpen || !session) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col space-y-5 animate-in fade-in zoom-in duration-150">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="size-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                        <Trash2Icon className="w-5 h-5" />
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                        aria-label="Close"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-medium text-slate-900">
                            {isOwner ? "Delete Meeting" : "Remove from Sessions"}
                        </h3>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${isOwner ? "bg-amber-500/10 text-amber-600" : "bg-slate-500/10 text-slate-600"
                            }`}>
                            {isOwner ? "Host" : "Participant"}
                        </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        {isOwner ? (
                            <>
                                As the owner of this meeting, deleting it will permanently remove the meeting for all participants.
                            </>
                        ) : (
                            <>
                                This will remove this meeting from your session history.
                            </>
                        )}
                    </p>
                </div>

                {/* Warning note if owner */}
                {isOwner && (
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-50/70 border border-red-100/80 text-xs text-red-700">
                        <AlertTriangleIcon className="w-4 h-4 shrink-0" />
                        <span>This action cannot be undone. All messages and logs will be lost.</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-5 py-2.5 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-5 py-2.5 rounded-full text-xs font-medium text-white bg-red-600 hover:bg-red-700 shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting ? "Deleting..." : isOwner ? "Delete Permanently" : "Delete Meeting"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSessionModal;
