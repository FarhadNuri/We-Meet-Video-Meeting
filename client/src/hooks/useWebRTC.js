import { useState, useEffect, useRef, useCallback } from "react";
import { socket } from "../config/socket.js";
import toast from "react-hot-toast";

const METERED_USERNAME = import.meta.env.VITE_METERED_USERNAME;
const METERED_CREDENTIAL = import.meta.env.VITE_METERED_CREDENTIAL;

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun.cloudflare.com:3478" },
        { urls: "stun:stun.relay.metered.ca:80" },
        ...(METERED_USERNAME && METERED_CREDENTIAL
            ? [
                  {
                      urls: "turn:global.relay.metered.ca:80",
                      username: METERED_USERNAME,
                      credential: METERED_CREDENTIAL,
                  },
                  {
                      urls: "turn:global.relay.metered.ca:80?transport=tcp",
                      username: METERED_USERNAME,
                      credential: METERED_CREDENTIAL,
                  },
                  {
                      urls: "turn:global.relay.metered.ca:443",
                      username: METERED_USERNAME,
                      credential: METERED_CREDENTIAL,
                  },
                  {
                      urls: "turns:global.relay.metered.ca:443?transport=tcp",
                      username: METERED_USERNAME,
                      credential: METERED_CREDENTIAL,
                  },
              ]
            : []),
    ],
    bundlePolicy: "max-bundle",
};

export const useWebRTC = (roomId, user, onMeetingEnded, enabled = true) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteUsers, setRemoteUsers] = useState([]); // Array of { socketId, userId, userName, stream, audioEnabled, videoEnabled }
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [videoEnabled, setVideoEnabled] = useState(false);

    const peersRef = useRef(new Map()); // socketId -> RTCPeerConnection
    const localStreamRef = useRef(null);
    const remoteStreamsRef = useRef(new Map()); // socketId -> MediaStream
    const pendingCandidatesRef = useRef(new Map()); // socketId -> RTCIceCandidateInit[]

    // Process queued candidates after remote description is set
    const processPendingCandidates = async (peer, socketId) => {
        if (pendingCandidatesRef.current.has(socketId)) {
            const candidates = pendingCandidatesRef.current.get(socketId) || [];
            pendingCandidatesRef.current.delete(socketId);
            for (const candidate of candidates) {
                try {
                    await peer.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error("Error adding queued ICE candidate:", err);
                }
            }
        }
    };

    // Initialize local media stream
    const initLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = false;
            }
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = false;
            }
            localStreamRef.current = stream;
            setLocalStream(stream);
            setVideoEnabled(false);
            setAudioEnabled(false);
            return stream;
        } catch (error) {
            toast.error("Could not access camera/microphone");
            console.error("Media devices access error:", error);
            // Fallback: try audio only
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioTrack = audioStream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = false;
                }
                localStreamRef.current = audioStream;
                setLocalStream(audioStream);
                setVideoEnabled(false);
                setAudioEnabled(false);
                return audioStream;
            } catch (err) {
                console.error("Audio-only fallback error:", err);
                return null;
            }
        }
    }, []);

    // Create RTCPeerConnection for a target socket
    const createPeerConnection = useCallback((targetSocketId, targetUser) => {
        if (peersRef.current.has(targetSocketId)) {
            return peersRef.current.get(targetSocketId);
        }

        const peer = new RTCPeerConnection(ICE_SERVERS);

        // Add local tracks to peer connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                peer.addTrack(track, localStreamRef.current);
            });
        }

        // Handle ICE candidates
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    targetSocketId,
                    senderSocketId: socket.id,
                    candidate: event.candidate,
                });
            }
        };

        // Handle incoming remote stream tracks
        peer.ontrack = (event) => {
            let stream = remoteStreamsRef.current.get(targetSocketId);
            if (!stream) {
                stream = event.streams && event.streams[0] ? event.streams[0] : new MediaStream();
                remoteStreamsRef.current.set(targetSocketId, stream);
            }

            // Ensure the incoming track is in the persistent MediaStream
            if (!stream.getTracks().some((t) => t.id === event.track.id)) {
                stream.addTrack(event.track);
            }

            // Wrap in a new MediaStream instance so React state change is detected by VideoTile
            const streamToSet = new MediaStream(stream.getTracks());

            setRemoteUsers((prev) => {
                const existingIndex = prev.findIndex((u) => u.socketId === targetSocketId);
                if (existingIndex > -1) {
                    const updated = [...prev];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        stream: streamToSet,
                    };
                    return updated;
                } else {
                    return [
                        ...prev,
                        {
                            socketId: targetSocketId,
                            userId: targetUser?.userId,
                            userName: targetUser?.userName || "Participant",
                            stream: streamToSet,
                            audioEnabled: targetUser?.audioEnabled ?? false,
                            videoEnabled: targetUser?.videoEnabled ?? false,
                        },
                    ];
                }
            });
        };

        peersRef.current.set(targetSocketId, peer);
        return peer;
    }, []);

    // Main WebRTC & Socket signaling setup effect
    useEffect(() => {
        if (!roomId || !user || !enabled) return;

        let isMounted = true;

        const startSession = async () => {
            const stream = await initLocalStream();

            if (!isMounted) return;

            if (!socket.connected) {
                socket.connect();
            }

            // Emit join room
            socket.emit("join-room", {
                roomId,
                user,
                audioEnabled: false,
                videoEnabled: false,
            });

            // 1. Receive all existing users in room
            socket.on("all-users", (existingUsers) => {
                existingUsers.forEach((existingUser) => {
                    const peer = createPeerConnection(existingUser.socketId, existingUser);

                    // Create offer to existing user
                    peer.createOffer()
                        .then((offer) => peer.setLocalDescription(offer))
                        .then(() => {
                            socket.emit("offer", {
                                targetSocketId: existingUser.socketId,
                                callerSocketId: socket.id,
                                sdp: peer.localDescription,
                            });
                        })
                        .catch((err) => console.error("Error creating offer:", err));
                });
            });

            // 2. Someone new joined -> add to state
            socket.on("user-joined", (newUser) => {
                toast(`${newUser.userName} joined the meeting`, { icon: "👋" });
                createPeerConnection(newUser.socketId, newUser);
            });

            // 3. Receive offer from caller
            socket.on("offer", async ({ callerSocketId, sdp, callerUser }) => {
                const peer = createPeerConnection(callerSocketId, callerUser);
                try {
                    await peer.setRemoteDescription(new RTCSessionDescription(sdp));
                    await processPendingCandidates(peer, callerSocketId);

                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);

                    socket.emit("answer", {
                        targetSocketId: callerSocketId,
                        responderSocketId: socket.id,
                        sdp: peer.localDescription,
                    });
                } catch (err) {
                    console.error("Error handling offer:", err);
                }
            });

            // 4. Receive answer from responder
            socket.on("answer", async ({ responderSocketId, sdp }) => {
                const peer = peersRef.current.get(responderSocketId);
                if (peer) {
                    try {
                        await peer.setRemoteDescription(new RTCSessionDescription(sdp));
                        await processPendingCandidates(peer, responderSocketId);
                    } catch (err) {
                        console.error("Error setting remote description from answer:", err);
                    }
                }
            });

            // 5. Receive ICE candidate
            socket.on("ice-candidate", async ({ senderSocketId, candidate }) => {
                if (!candidate) return;
                const peer = peersRef.current.get(senderSocketId);
                if (peer && peer.remoteDescription && peer.remoteDescription.type) {
                    try {
                        await peer.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (err) {
                        console.error("Error adding ICE candidate:", err);
                    }
                } else {
                    if (!pendingCandidatesRef.current.has(senderSocketId)) {
                        pendingCandidatesRef.current.set(senderSocketId, []);
                    }
                    pendingCandidatesRef.current.get(senderSocketId).push(candidate);
                }
            });

            // 6. Handle peer audio toggle
            socket.on("user-toggled-audio", ({ socketId, audioEnabled }) => {
                setRemoteUsers((prev) => prev.map((u) => (u.socketId === socketId ? { ...u, audioEnabled } : u)));
            });

            // 7. Handle peer video toggle
            socket.on("user-toggled-video", ({ socketId, videoEnabled }) => {
                setRemoteUsers((prev) => prev.map((u) => (u.socketId === socketId ? { ...u, videoEnabled } : u)));
            });

            // 8. Handle peer left
            socket.on("user-left", ({ socketId, user: leftUser }) => {
                if (leftUser) {
                    toast(`${leftUser.userName} left the meeting`);
                }
                const peer = peersRef.current.get(socketId);
                if (peer) {
                    peer.close();
                    peersRef.current.delete(socketId);
                }
                remoteStreamsRef.current.delete(socketId);
                pendingCandidatesRef.current.delete(socketId);
                setRemoteUsers((prev) => prev.filter((u) => u.socketId !== socketId));
            });

            // 9. Handle meeting ended by host
            socket.on("meeting-ended", ({ message }) => {
                toast.error(message || "This meeting has ended");
                if (onMeetingEnded) {
                    onMeetingEnded(message);
                }
            });
        };

        startSession();

        // Cleanup on leave/unmount
        return () => {
            isMounted = false;

            // Stop local tracks
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }

            // Close all peer connections
            peersRef.current.forEach((peer) => peer.close());
            peersRef.current.clear();
            remoteStreamsRef.current.clear();
            pendingCandidatesRef.current.clear();

            // Off socket listeners
            socket.off("all-users");
            socket.off("user-joined");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
            socket.off("user-toggled-audio");
            socket.off("user-toggled-video");
            socket.off("user-left");
            socket.off("meeting-ended");

            socket.disconnect();
        };
    }, [roomId, user?.id, enabled, createPeerConnection, initLocalStream, onMeetingEnded]);

    // Toggle local mic
    const toggleAudio = async () => {
        if (!localStreamRef.current) return;
        let audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (!audioTrack) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const newTrack = newStream.getAudioTracks()[0];
                if (newTrack) {
                    localStreamRef.current.addTrack(newTrack);
                    peersRef.current.forEach((peer) => {
                        peer.addTrack(newTrack, localStreamRef.current);
                    });
                    audioTrack = newTrack;
                }
            } catch (err) {
                toast.error("Could not access microphone");
                console.error("Error enabling microphone:", err);
                return;
            }
        }

        if (audioTrack) {
            const newState = !audioEnabled;
            audioTrack.enabled = newState;
            setAudioEnabled(newState);
            socket.emit("toggle-audio", { roomId, audioEnabled: newState });
        }
    };

    // Toggle local camera
    const toggleVideo = async () => {
        if (!localStreamRef.current) return;
        let videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (!videoTrack) {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const newTrack = newStream.getVideoTracks()[0];
                if (newTrack) {
                    localStreamRef.current.addTrack(newTrack);
                    peersRef.current.forEach((peer) => {
                        peer.addTrack(newTrack, localStreamRef.current);
                    });
                    videoTrack = newTrack;
                }
            } catch (err) {
                toast.error("Could not access camera");
                console.error("Error enabling camera:", err);
                return;
            }
        }

        if (videoTrack) {
            const newState = !videoEnabled;
            videoTrack.enabled = newState;
            setVideoEnabled(newState);
            socket.emit("toggle-video", { roomId, videoEnabled: newState });
        }
    };

    // End meeting for everyone (Host action)
    const endMeeting = useCallback(() => {
        if (roomId) {
            socket.emit("end-meeting", { roomId });
        }
    }, [roomId]);

    return {
        localStream,
        remoteUsers,
        audioEnabled,
        videoEnabled,
        toggleAudio,
        toggleVideo,
        endMeeting,
    };
};
