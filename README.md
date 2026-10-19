# We Meet: Real-Time Video Conferencing

A modern, full-stack video conferencing platform delivering low-latency peer-to-peer audio and video streaming, live interactive chat, and comprehensive session history management. Built with a scalable WebRTC mesh architecture, Socket.IO signaling, and enterprise-grade authentication.

## Features

- **Real-time video & audio**: WebRTC peer-to-peer mesh architecture with ultra-low latency audio/video streaming
- **Cross-network connectivity**: Integrated STUN and Metered TURN relay support to guarantee seamless traversal across symmetric NATs and restrictive firewalls
- **In-meeting interactive controls**: Instant camera and microphone toggles, screen sharing via `getDisplayMedia`, and live active speaker indicators
- **Live in-room chat**: Real-time broadcast messaging during meetings with persistent chat history in PostgreSQL
- **Presence & roster tracking**: Real-time room participant rosters, join/leave tracking, and host-tiered room capacity enforcement
- **Session management & analytics**: Review past meetings, participant attendance logs, chat archives, and meeting metrics with per-user hide/delete controls
- **Secure access**: Clerk authentication with protected API middleware and cryptographically verified webhook synchronization

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router 7 |
| **Realtime & Streaming** | WebRTC (Mesh topology), Socket.IO (client & server), Metered TURN Relay |
| **Backend** | Node.js, Express 5, Cookie Parser, CORS |
| **Database** | PostgreSQL (Neon Serverless) |
| **Auth** | Clerk Express SDK, Clerk React SDK, Svix Webhooks |
| **Deployment** | Vercel (Client), Render / Railway / Node (Server) |

## Architecture

```text
client (React 19 + Vite)
  │
  ├── REST /api/* ─────────────────────────► server (Express 5)
  │                                           ├── clerkMiddleware ──────► Clerk (JWT & Webhooks)
  │                                           ├── meeting routes ───────► Neon PostgreSQL (users, meetings, sessions)
  │                                           └── error handler
  │
  ├── Socket.IO (join-room, offer, answer) ─► server (Socket.IO Hub)
  │                                           ├── room management ──────► Capacity & host verification
  │                                           ├── signaling relay ──────► Forward SDP & ICE candidates
  │                                           └── chat persistence ────► Neon PostgreSQL (messages, participants)
  │
  └── WebRTC (MediaStream tracks) ──────────► P2P Mesh (Peer-to-Peer Audio/Video)
                                              └── TURN Relay (Metered fallback for strict NATs)
```

## Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database ([Neon](https://neon.tech/) recommended)
- A [Clerk](https://clerk.com/) application account (Publishable Key and Secret Key)
- [Metered](https://www.metered.ca/) TURN credentials (optional for local, recommended for production/cross-network calls)

### Backend
```bash
cd server
npm install
# create server/.env with the variables listed below
npm run dev # start the API with nodemon (default port 3000)
```

### Frontend
```bash
cd client
npm install
# create client/.env with the variables listed below
npm run dev # start Vite dev server (default port 5173)
```

## Environment Variables

### Server (`server/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | API server port (default `3000`) |
| `ORIGINS` | Allowed frontend origins for CORS and Socket.IO (e.g. `http://localhost:5173,http://localhost:3000`) |
| `DATABASE_URL` | Neon PostgreSQL connection string with SSL mode |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key for authentication |
| `CLERK_SECRET_KEY` | Clerk backend secret key for user verification |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Secret key used to cryptographically verify Clerk webhook payloads |

### Client (`client/.env`)

| Variable | Purpose |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for client-side authentication |
| `VITE_BASE_URL` | Backend REST API & Socket.IO base URL (e.g. `http://localhost:3000`) |
| `VITE_METERED_USERNAME` | Metered TURN username for peer relay fallback |
| `VITE_METERED_CREDENTIAL` | Metered TURN credential password for peer relay fallback |

## API Overview

All `/api/meetings` routes require authentication via Clerk session token. Meeting status, host ownership, and participant associations are verified against the database.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API health and status check |
| `POST` | `/api/clerk` | Clerk webhook receiver for user lifecycle events (`user.created`, `user.updated`) |
| `POST` | `/api/meetings` | Create a new instant meeting session |
| `GET` | `/api/meetings/stats` | Retrieve user meeting statistics (total meetings, participants, total minutes) |
| `GET` | `/api/meetings/sessions` | Fetch user meeting history and past sessions |
| `GET` | `/api/meetings/sessions/:id` | Get detailed session metrics, attendee timeline, and chat history |
| `DELETE` | `/api/meetings/sessions/:id` | Hide or remove a session from the user's dashboard history |
| `GET` | `/api/meetings/:meetingId` | Fetch room status, validity, and host metadata |

## Realtime Events (Socket.IO)

Clients connect to the Socket.IO server upon entering a meeting room. The server orchestrates peer discovery, WebRTC media signaling, stream state synchronization, and live message persistence.

| Direction | Event | Description |
|---|---|---|
| Client → Server | `join-room` | Join a meeting room with user profile and initial media states |
| Client → Server | `offer` | Send WebRTC SDP offer to a specific target peer |
| Client → Server | `answer` | Send WebRTC SDP answer back to the offering peer |
| Client → Server | `ice-candidate` | Transmit ICE candidates to establish P2P connection |
| Client → Server | `toggle-audio` | Notify peers when microphone is muted or unmuted |
| Client → Server | `toggle-video` | Notify peers when camera stream is enabled or disabled |
| Client → Server | `send-message` | Send in-meeting chat message (persisted to database) |
| Client → Server | `end-meeting` | Host action to terminate the session for all participants |
| Server → Client | `all-users` | List of existing peers in the room sent to the newly joined client |
| Server → Client | `user-joined` | Broadcast to room when a new participant connects |
| Server → Client | `offer` | Forward SDP offer to target peer |
| Server → Client | `answer` | Forward SDP answer to initiator |
| Server → Client | `ice-candidate` | Forward ICE candidate to remote peer |
| Server → Client | `user-toggled-audio` | Broadcast updated microphone status of a peer |
| Server → Client | `user-toggled-video` | Broadcast updated camera status of a peer |
| Server → Client | `receive-message` | Broadcast newly sent chat message to all participants |
| Server → Client | `user-left` | Broadcast when a participant leaves or disconnects |
| Server → Client | `meeting-ended` | Notify participants when meeting is ended by host or capacity is reached |

## Database

The PostgreSQL database is hosted on **Neon Serverless**. Database tables are automatically initialized on server boot (`initDB`) and structured across 5 core relational models:

- `users`: Synchronized user accounts containing name, email, avatar, and subscription tier (`free` or `premium`)
- `meetings`: Meeting sessions storing unique meeting IDs, titles, host references, status, and start/end timestamps
- `meeting_participants`: Attendance records logging each participant's join time and leave time per meeting
- `meeting_messages`: Chat logs containing sender identity, message content, and timestamps
- `hidden_meetings`: Junction table allowing users to remove or hide specific meetings from their personal history view

## Project Structure

```text
client/
├── src/
│   ├── components/
│   │   ├── meeting/        # VideoGrid, VideoTile, ControlBar, ChatPanel, ParticipantList
│   │   ├── sessions/       # SessionCard, SessionDetailModal, SessionChatTab, DeleteModal
│   │   ├── Navbar.jsx      # Navigation bar with user profile & links
│   │   ├── Logo.jsx        # Branding logo component
│   │   └── ProtectedLayout.jsx
│   ├── hooks/
│   │   └── useWebRTC.js    # Core WebRTC peer lifecycle, signaling & media stream hook
│   ├── pages/
│   │   ├── Dashboard.jsx   # Meeting launchpad, quick join & user stats
│   │   ├── MeetingRoom.jsx # Live video conference room & controls
│   │   ├── Sessions.jsx    # Meeting history, analytics & chat archive
│   │   ├── Pricing.jsx     # Subscription plan overview
│   │   └── Login.jsx       # Authentication entry point
│   ├── index.css           # Tailwind CSS v4 design system
│   └── main.jsx            # React root & Clerk provider configuration
├── vercel.json             # SPA routing rewrite configuration
└── vite.config.js

server/
├── config/
│   └── db.js               # Neon PostgreSQL connection & auto-migration schema
├── controllers/
│   ├── meetingController.js # Meeting creation, stats, and session endpoints
│   └── webHookController.js # Clerk webhook handler for user sync
├── middleware/
│   └── auth.js             # Clerk session authentication verification
├── routes/
│   └── meetingRoutes.js    # Meeting API routes definition
├── socket.js               # Socket.IO signaling hub & WebRTC event handlers
├── server.js               # Express application entry point, CORS & middleware
└── .env.example            # Environment variables template
```

## Author

Farhad Nuri  
- [GitHub](https://github.com/FarhadNuri)  
- [LinkedIn](https://www.linkedin.com/in/farhadnuri/)