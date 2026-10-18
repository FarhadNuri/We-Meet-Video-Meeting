import React, { useCallback, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyUser } from '../assets/asset'
import { dummyMeetingDetails } from '../assets/asset'
import VideoGrid from '../components/meeting/VideoGrid'
import { useChat } from '../hooks/useChat.js'
import {useWebRTC} from '../hooks/useWebRTC.js'
import ChatPanel from '../components/meeting/ChatPanel'
import ParticipantList from '../components/meeting/ParticipantList'
import ControlBar from '../components/meeting/ControlBar'
import toast from 'react-hot-toast'
import { useAuth, useUser } from '@clerk/react'
import { useMemo } from 'react'
import Loader from "../components/Loader.jsx"
import api from '../config/api.js'
import Logo from '../components/Logo.jsx'

const MeetingRoom = () => {
  const { meetingId } = useParams()
  const navigate = useNavigate()
  const { user } = useUser()

  const { getToken } = useAuth()


  const userdata = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress?.split("@")[0] || "User",
      email: user.primaryEmailAddress?.emailAddress || "",
      image: user.imageUrl || "",
    };
  }, [user?.id, user?.fullName, user?.firstName, user?.primaryEmailAddress?.emailAddress, user?.imageUrl]);


  const [meeting, setMeeting] = useState(null)
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false)


  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const token = await getToken();
        const res = await api.get(`/api/meetings/${meetingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.meeting.status === "ended") {
          toast.error("This meeting has ended");
          navigate("/dashboard");
          return;
        }
        setMeeting(res.data.meeting);
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Meeting not found or has ended";
        toast.error(errorMsg);
        navigate("/dashboard");
      } finally {
        setLoadingMeeting(false);
      }
    };

    fetchMeeting();
  }, [meetingId, navigate]);


  const handleMeetingEnded = useCallback(() => {
    navigate('/dashboard')
  }, [navigate])

  // Initialize WebRTC
  const { localStream, remoteUsers, audioEnabled, videoEnabled, toggleAudio, toggleVideo,
    endMeeting } = useWebRTC(meetingId, userdata, handleMeetingEnded)

  const { messages, sendMessage, unreadCount, isChatOpen, toggleChat } = useChat(meetingId,
    userdata)

  const handleToggleParticipants = () => {
    setIsParticipantsOpen((prev) => {
      const next = !prev;
      if (next && isChatOpen) {
        toggleChat();
      }
      return next;
    });
  };

  const handleToggleChat = () => {
    if (!isChatOpen && isParticipantsOpen) {
      setIsParticipantsOpen(false);
    }
    toggleChat();
  };

  const hostId = meeting?.host?.id || meeting?.host;
  const isHost = Boolean(userdata?.id && hostId && hostId.toString() === userdata.id.toString())

  const handleLeave = () => {
    toast("You left the meeting");
    navigate("/dashboard")
  }

  const handleEndMeeting = () => {
    endMeeting();
    toast("Meeting ended for all participants");
    navigate("/dashboard")
  }

  if(loadingMeeting){
    return <Loader text="Joining meeting room..."/>
  }

  return (
    <div
      className="fixed inset-0 z-50 h-screen w-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      {/* Top Bar (48px-54px, solid background, bottom 1px border) */}
      <header
        className="w-full px-3 sm:px-5 flex items-center justify-between z-30 shrink-0"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          height: '52px',
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
          {/* Icon-only Logo */}
          <span className="shrink-0" style={{ color: 'var(--text-primary)' }}>
            <Logo size={20} iconOnly />
          </span>

          {/* Meeting title (15px-16px font) */}
          <h1
            className="text-[14px] sm:text-[16px] font-semibold truncate max-w-[150px] xs:max-w-[220px] sm:max-w-md"
            style={{ color: 'var(--text-primary)' }}
          >
            {meeting?.title || dummyMeetingDetails.title || "Meeting Room"}
          </h1>

          {/* Monospace meeting ID chip */}
          <span
            className="text-[11px] sm:text-[12px] font-mono px-2 py-0.5 rounded border shrink-0 hidden md:inline-block"
            style={{
              backgroundColor: 'var(--bg-section)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            {meetingId || dummyMeetingDetails.meetingId}
          </span>
        </div>

        {/* Right: Live indicator with gently pulsing green dot */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-medium"
            style={{ color: '#22C55E' }}
          >
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#22C55E] animate-live-pulse" />
            Live
          </span>
        </div>
      </header>

      {/* Main Content Area (Video Grid + Side Panels) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Video Grid Center */}
        <VideoGrid
          localStream={localStream}
          localUser={userdata}
          remoteUsers={remoteUsers}
          audioEnabled={audioEnabled}
          videoEnabled={videoEnabled} />

        {/* In-Meeting Chat Drawer */}
        <ChatPanel
          isOpen={isChatOpen}
          onClose={handleToggleChat}
          messages={messages}
          onSendMessage={sendMessage}
          currentUser={userdata}
        />
        {/* Participants Drawer */}
        <ParticipantList
          isOpen={isParticipantsOpen}
          onClose={() => setIsParticipantsOpen(false)}
          localUser={userdata}
          localAudio={audioEnabled}
          localVideo={videoEnabled}
          remoteUsers={remoteUsers}
          meetingHostId={dummyUser.id}
        />
      </div>
      {/* Bottom Floating Control Bar */}
      <ControlBar
        roomId={meetingId || dummyMeetingDetails.meetingId}
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleChat={handleToggleChat}
        onToggleParticipants={handleToggleParticipants}
        isChatOpen={isChatOpen}
        isParticipantsOpen={isParticipantsOpen}
        unreadCount={unreadCount}
        participantCount={1 + remoteUsers.length}
        isHost={isHost}
        onLeave={handleLeave}
        onEndMeeting={handleEndMeeting}
      />

    </div>
  )
}

export default MeetingRoom