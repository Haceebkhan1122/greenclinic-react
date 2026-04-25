import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer.jsx';
import { useParams } from "react-router-dom";
import Controls from './controls.jsx';

const client = AgoraRTC.createClient({
    mode: 'rtc',
    codec: 'vp8',
});

function Agora({ renderer, timeRem, agoraToken, agoraChannelName, setCancelAppointment, isAnonymous }) {
    const params = useParams();
    const [localCameraEnabled, setLocalCameraEnabled] = useState(true);
    const [localMicEnabled, setLocalMicEnabled] = useState(true);
    const [videoQuality, setVideoQuality] = useState(null);
    const [config, setConfig] = useState({
        token: "",
        channel: "",
        mode: 'rtc',
        codec: 'vp8',
        appId: 'e00a7e089f7145e89fb4959caf816626',
        role: 'host'
    });
    const [users, setUsers] = useState([]);
    const [localTracks, setLocalTracks] = useState([]);

    const appointmentToken = agoraToken;


    useEffect(() => {
        if (appointmentToken) {
            const obj = {
                token: appointmentToken,
                channel: agoraChannelName,
                mode: 'rtc',
                codec: 'vp8',
                appId: 'e00a7e089f7145e89fb4959caf816626',
                role: 'host'
            }
            setConfig(obj);
        }
    }, [appointmentToken]);

    const handleUserJoined = async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
            // setRemoteTrack(client.remoteUsers);
        }

        if (mediaType === 'audio') {
            user.audioTrack.play()
        }
    };

    const handleUserLeft = (user) => {
        setUsers((previousUsers) =>
            previousUsers.filter((u) => u.uid !== user.uid)
        );
    };

    useEffect(() => {

        if (config.token && config.appId && config.channel) {
            client.on('user-published', handleUserJoined);
            client.on('user-left', handleUserLeft);
            client.on('user-unpublished', (user, mediaType) => {
                if (mediaType !== "audio") {
                    setUsers((previousUsers) =>
                        previousUsers.filter((u) => u.uid !== user.uid)
                    );
                }
            });

            client.on('network-quality', async (stats) => {
                try {
                    setVideoQuality(stats);
                    if (stats.uplinkNetworkQuality >= 1 && stats.uplinkNetworkQuality <= 2) {
                        await localTracks[1]?.setEncoderConfiguration("360p_1")
                    }

                    else if (stats.uplinkNetworkQuality >= 3 && stats.uplinkNetworkQuality <= 4) {
                        await localTracks[1]?.setEncoderConfiguration("360p_3");
                    }

                    else if (stats.uplinkNetworkQuality >= 5 && stats.uplinkNetworkQuality <= 6) {
                        await localTracks[1]?.setEncoderConfiguration("240p_3");
                    }
                } catch (error) {
                    console.log(error);
                }
            })

            client
                .join(config.appId, config.channel, config.token, null)
                .then((uid) =>
                    Promise.all([
                        AgoraRTC.createMicrophoneAndCameraTracks(),
                        uid,
                    ])
                )
                .then(([tracks, uid]) => {
                    const [audioTrack, videoTrack] = tracks;
                    setLocalTracks(tracks);
                    setUsers((previousUsers) => [
                        ...previousUsers,
                        {
                            uid,
                            videoTrack,
                            audioTrack,
                        },
                    ]);
                    client.publish(tracks);
                });

            return () => {
                for (let localTrack of localTracks) {
                    localTrack.stop();
                    localTrack.close();
                }
                client.off('user-published', handleUserJoined);
                client.off('user-left', handleUserLeft);
                client.unpublish(localTracks).then(() => client.leave());
            };
        }

    }, [config.token, config.channel]);

    return (
        <div className='rtx_video_container'>
            <div className='video_cons_hk'>
                <div className='videoContainer'>
                    {users.map((user) => (
                        <VideoPlayer
                            isAnonymous={isAnonymous}
                            localTracks={localTracks}
                            setVideoQuality={setVideoQuality}
                            videoQuality={videoQuality}
                            client={client}
                            key={user.uid}
                            user={user}
                            users={users}
                            localCameraEnabled={localCameraEnabled} />
                    ))}
                    <Controls
                        renderer={renderer}
                        timeRem={timeRem}
                        client={client}
                        localTracks={localTracks}
                        setVideoQuality={setVideoQuality}
                        videoQuality={videoQuality}
                        setLocalMicEnabled={setLocalMicEnabled}
                        localMicEnabled={localMicEnabled}
                        setLocalCameraEnabled={setLocalCameraEnabled}
                        localCameraEnabled={localCameraEnabled}
                        setCancelAppointment={setCancelAppointment}
                    />
                </div>
            </div>
        </div>
    )
}

export default Agora