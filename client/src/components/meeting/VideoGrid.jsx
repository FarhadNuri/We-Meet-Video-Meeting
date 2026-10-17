import React from 'react'
import VideoTile from './VideoTile'

const VideoGrid = ({ localStream, localUser, remoteUsers, audioEnabled, videoEnabled }) => {
    const totalParticipants = 1 + remoteUsers.length

    // Dynamic adaptive layout classes based on participant count:
    // 1 = single large centered tile, 2 = two side by side (stacked on mobile),
    // 3 = two on top and one below, 4 = 2x2, 5+ = auto-fit grid
    const getLayoutClasses = () => {
        if (totalParticipants === 1) {
            return "grid-cols-1 max-w-4xl max-h-[75vh]";
        }
        if (totalParticipants === 2) {
            return "grid-cols-1 md:grid-cols-2 max-w-5xl max-h-[75vh]";
        }
        if (totalParticipants === 3) {
            return "grid-cols-1 md:grid-cols-2 max-w-5xl max-h-[75vh] [&>*:last-child]:md:col-span-2 [&>*:last-child]:md:w-1/2 [&>*:last-child]:md:mx-auto";
        }
        if (totalParticipants === 4) {
            return "grid-cols-1 sm:grid-cols-2 max-w-5xl max-h-[75vh]";
        }
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl max-h-[80vh]";
    }

    return (
        <div className="flex-1 w-full h-full flex items-center justify-center p-3 sm:p-5 overflow-y-auto pb-24 sm:pb-28">
            <div className={`w-full grid gap-3 sm:gap-4 aspect-video ${getLayoutClasses()} transition-all duration-200`}>
                {/* Local User Tile */}
                <VideoTile
                    stream={localStream}
                    name={localUser?.name || "You"}
                    isLocal={true}
                    audioEnabled={audioEnabled}
                    videoEnabled={videoEnabled}
                />

                {/* Remote Users Tiles */}
                {remoteUsers.map((remote) => (
                    <VideoTile
                        key={remote.socketId}
                        stream={remote.stream}
                        name={remote.userName}
                        isLocal={false}
                        audioEnabled={remote.audioEnabled}
                        videoEnabled={remote.videoEnabled}
                    />
                ))}
            </div>
        </div>
    )
}

export default VideoGrid
