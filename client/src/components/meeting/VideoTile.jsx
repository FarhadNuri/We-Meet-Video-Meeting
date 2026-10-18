import React, { useEffect, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'

const VideoTile = ({ stream, name, isLocal = false, audioEnabled = false, videoEnabled = false, isSpeaking = false }) => {

    const videoRef = useRef(null)
    const audioRef = useRef(null)

    // Bind video stream
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream])

    // Bind remote audio stream cleanly with browser autoplay unlocking
    useEffect(() => {
        if (isLocal || !stream) return;

        const attachAndPlayAudio = () => {
            if (audioRef.current) {
                audioRef.current.srcObject = stream;
                audioRef.current.play().catch((err) => {
                    console.warn("Audio autoplay blocked, waiting for user gesture:", err);
                    const unlock = () => {
                        audioRef.current?.play().catch(() => {});
                        window.removeEventListener('click', unlock);
                        window.removeEventListener('touchstart', unlock);
                        window.removeEventListener('keydown', unlock);
                    };
                    window.addEventListener('click', unlock, { once: true });
                    window.addEventListener('touchstart', unlock, { once: true });
                    window.addEventListener('keydown', unlock, { once: true });
                });
            }
        };

        attachAndPlayAudio();

        // Listen for new tracks added to this stream (e.g. audio arriving after video)
        const handleAddTrack = () => {
            attachAndPlayAudio();
        };

        stream.addEventListener('addtrack', handleAddTrack);

        return () => {
            stream.removeEventListener('addtrack', handleAddTrack);
        };
    }, [stream, isLocal])

    return (
        <div
            className={`relative w-full h-full min-h-[140px] sm:min-h-0 rounded-[12px] overflow-hidden border flex items-center justify-center transition-all duration-150 ${
                isSpeaking ? 'outline outline-2 outline-[#2B5CF0]' : ''
            }`}
            style={{
                backgroundColor: '#12141A',
                borderColor: isSpeaking ? '#2B5CF0' : 'var(--border)',
            }}
        >
            {/* Dedicated Remote Audio Element (never throttled or muted by video visibility) */}
            {!isLocal && (
                <audio
                    ref={audioRef}
                    autoPlay
                    playsInline
                />
            )}

            {/* Video Element (always muted so browser never blocks it and video visibility doesn't kill audio) */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={true}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                    videoEnabled ? "opacity-100" : "opacity-0 pointer-events-none absolute"
                } ${isLocal ? "scale-x-[-1]" : ""}`}
            />

            {/* Camera Off Placeholder: centered circular avatar with initials on muted background */}
            {!videoEnabled && (
                <div
                    className="absolute inset-0 flex items-center justify-center z-10"
                    style={{ backgroundColor: '#12141A' }}
                >
                    <div
                        className="w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-base sm:text-2xl font-semibold uppercase select-none"
                        style={{
                            backgroundColor: 'var(--bg-section)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                        }}
                    >
                        {name ? name.charAt(0).toUpperCase() : "?"}
                    </div>
                </div>
            )}

            {/* Bottom-left floating label: participant name + Mic/MicOff on semi-transparent dark chip (bg-black/50, no blur) */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-black/60 text-[11px] sm:text-[13px] font-medium text-white z-20 pointer-events-none">
                <span className="truncate max-w-[100px] xs:max-w-[140px] sm:max-w-[220px]">
                    {name} {isLocal ? "(You)" : ""}
                </span>
                {audioEnabled ? (
                    <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-200 shrink-0" strokeWidth={1.5} />
                ) : (
                    <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#EF4444] shrink-0" strokeWidth={1.5} />
                )}
            </div>
        </div>
    )
}

export default VideoTile