import React, { useEffect, useRef } from 'react';
// import heartLogo from '../../assets/images/png/heartLogo.png'

export const VideoPlayer = ({ user, localCameraEnabled, client, users, isAnonymous }) => {
    const ref = useRef();

    useEffect(() => {
        user.videoTrack.play(ref.current);

        if (user.uid === client.uid) {
            ref.current.classList.add('doctor_frame');
        } else {
            ref.current.classList.add('rtx_video_player');

            if (isAnonymous == 1) {
                ref.current.classList.add('blurry');
            } else {
                ref.current.classList.remove('blurry');
            }
        }
    }, [user, isAnonymous]);


    return (
        <>
            <div className='ng_agora_new'>
                {!localCameraEnabled ? (
                    <>
                        <div className='emptttt_mini_frame'>
                            Cam Off
                        </div>
                    </>
                ) : null}
                {users?.length === 1 ? (
                    <>
                        <div className='emptttt'>
                            Cam Off
                        </div>
                    </>
                ) : null}
                <div ref={ref}></div>
            </div>
        </>
    );
};