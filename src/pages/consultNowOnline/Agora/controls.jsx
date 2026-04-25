import React from "react";
import { BsFillMicMuteFill, BsFillMicFill } from "react-icons/bs";
import { FiVideo, FiVideoOff } from "react-icons/fi";
import Dropdown from 'react-bootstrap/Dropdown';
import Countdown from "react-countdown";

const Controls = (props) => {
    const { client, videoQuality, localCameraEnabled, setLocalCameraEnabled, localMicEnabled, setLocalMicEnabled, localTracks, setCancelAppointment, renderer, timeRem } = props;

    async function toggleCamera() {
        if (client && localCameraEnabled) {
            await localTracks[1]?.setEnabled(false);
            setLocalCameraEnabled(false);
        }
        else if (client && !localCameraEnabled) {
            await localTracks[1]?.setEnabled(true);
            setLocalCameraEnabled(true);
        }
    }

    async function toggleMic() {
        if (client && localMicEnabled) {
            await localTracks[0]?.setEnabled(false);
            setLocalMicEnabled(false);
        }
        else if (client && !localMicEnabled) {
            try {
                await localTracks[0]?.setEnabled(true);
                setLocalMicEnabled(true);
            } catch (error) {
                console.log(error, "cambug")
            }
        }
    }
    return (
        <>
            <div className='btn-status d-block d-sm-none'>
                {videoQuality?.uplinkNetworkQuality <= 0 ? (
                    <>
                        <p className='call_status'><span class="circle red"></span>Disconnected</p>
                    </>
                ) : (
                    <>
                        <p className='call_status'>
                            <span class="circle green">
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                    <circle cx="9.42063" cy="9.81223" r="8.88742" fill="white" fill-opacity="0.8" />
                                    <circle cx="9.42027" cy="9.81236" r="4.44371" fill="#7CC14B" />
                                </svg>
                            </span>
                            Connected</p>
                    </>
                )}
            </div>
            <div className="controls">
                <div className='btn-status d-none d-sm-block'>
                    {videoQuality?.uplinkNetworkQuality <= 0 ? (
                        <>
                            <p className='call_status'><span class="circle red"></span>Disconnected</p>
                        </>
                    ) : (
                        <>
                            <p className='call_status'> <span class="circle green">
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                    <circle cx="9.42063" cy="9.81223" r="8.88742" fill="white" fill-opacity="0.8" />
                                    <circle cx="9.42027" cy="9.81236" r="4.44371" fill="#7CC14B" />
                                </svg>
                            </span>Connected</p>
                        </>
                    )}
                </div>

                <div className="wrapper_btn_cutt">
                    <span className="cuttt_of" onClick={(e) => setCancelAppointment(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <rect width="40" height="40" rx="20" fill="#EB5545" />
                            <path d="M12.4617 22.3956L11.0151 20.949C10.8803 20.8152 10.7749 20.6548 10.7056 20.478C10.6364 20.3011 10.6048 20.1117 10.613 19.922C10.6212 19.7322 10.6689 19.5463 10.7531 19.3761C10.8373 19.2058 10.9561 19.055 11.1019 18.9334C12.7469 17.6108 14.6793 16.6925 16.7436 16.2523C18.649 15.8276 20.6246 15.8276 22.53 16.2523C24.6028 16.6953 26.5422 17.6204 28.1909 18.9527C28.3363 19.074 28.4549 19.2242 28.539 19.3938C28.6232 19.5634 28.6711 19.7487 28.6797 19.9379C28.6883 20.127 28.6575 20.3159 28.5891 20.4925C28.5207 20.669 28.4163 20.8294 28.2826 20.9635L26.836 22.4101C26.6043 22.6464 26.2945 22.7904 25.9645 22.8152C25.6345 22.8401 25.3067 22.7441 25.0422 22.5451C24.5182 22.1432 23.9504 21.8019 23.3497 21.5276C23.1122 21.4199 22.9106 21.2464 22.7688 21.0276C22.6269 20.8088 22.5507 20.5539 22.5493 20.2932V19.0684C20.6556 18.5476 18.6565 18.5476 16.7629 19.0684L16.7629 20.2932C16.7614 20.5539 16.6853 20.8088 16.5434 21.0276C16.4015 21.2464 16.1999 21.4199 15.9625 21.5276C15.3617 21.8019 14.7939 22.1432 14.2699 22.5451C14.0027 22.7463 13.6708 22.8422 13.3374 22.8147C13.004 22.7871 12.6923 22.638 12.4617 22.3956Z" fill="white" />
                        </svg>
                    </span>
                    <span onClick={toggleCamera} className={localCameraEnabled ? 'on video_btn' : 'video_btn off'}>
                        {localCameraEnabled ? <FiVideo /> : <FiVideoOff />}
                    </span>

                    <span onClick={toggleMic} className={localMicEnabled ? 'on video_btn' : 'video_btn off'}>
                        {localMicEnabled ? <BsFillMicFill /> : <BsFillMicMuteFill />}
                    </span>
                </div>

                {/* <div className='connection_controller'>
                    <h5 className='your_connn'>
                        Your internet connection is
                    </h5>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className={`signals_hk ${videoQuality?.uplinkNetworkQuality == 1 && 'green__ ' || videoQuality?.uplinkNetworkQuality == 2 && 'yellow__ '}`}>
                            <span className="connections_controll">
                                {videoQuality?.uplinkNetworkQuality == 1 && 'Strong' || videoQuality?.uplinkNetworkQuality == 2 && 'Strong' || videoQuality?.uplinkNetworkQuality >= 4 && 'Weak' || videoQuality?.uplinkNetworkQuality == 0 && 'waiting...' || videoQuality?.uplinkNetworkQuality == null && 'waiting...'}
                            </span>
                        </Dropdown.Toggle>
                        <div className='hk_dropdown_controller'>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="1">HD</Dropdown.Item>
                                <Dropdown.Item eventKey="2">SD</Dropdown.Item>
                                <Dropdown.Item eventKey="3">Audio</Dropdown.Item>
                            </Dropdown.Menu>
                        </div>
                    </Dropdown>
                </div> */}
                <p className="time_remain">
                    <span className="time_remaining_text">Time Remaining</span>
                    {timeRem && (
                        <Countdown
                            className="time-rem"
                            date={timeRem}
                            renderer={renderer}
                        />
                    )}
                </p>

            </div >
        </>
    );
};
export default Controls;