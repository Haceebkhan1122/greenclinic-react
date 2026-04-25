import React, { useState, useRef } from 'react'
import { Row, Col, Modal } from 'react-bootstrap';
import VideoPop from "../../assets/images/png/popup-video.png";
import "./videoPlayer.scss"


const VideoPlayer = () => {
    const [show, setShow] = useState(false);
    const videoRef = useRef(null);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }
    return (
        <>
            <Row>
                <Col md={3}>
                    <button className="card" onClick={handleShow}>
                        <a className="popup-youtube" href="javascript:void(0);">
                            <img src={VideoPop} className="card-img-top" alt="..." />
                        </a>
                        <div className="card-body">
                            <h5 className="card-title">About Green Clinic</h5>
                            <p className="card-text">What is green clinic</p>
                        </div>
                    </button>
                </Col>
                <Col md={3}>
                    <button className="card" onClick={handleShow}>
                        <a className="popup-youtube" href="javascript:void(0);">
                            <img src={VideoPop} className="card-img-top" alt="..." />
                        </a>
                        <div className="card-body">
                            <h5 className="card-title">About Green Clinic</h5>
                            <p className="card-text">What is green clinic</p>
                        </div>
                    </button>
                </Col>
            </Row>

            <Modal show={show} centered onHide={handleClose} className='video_modal'>
                <Modal.Body>
                    <div className="wraper__modal">
                        <button onClick={handleClose} className='close'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M1.8 18L0 16.2L7.2 9L0 1.8L1.8 0L9 7.2L16.2 0L18 1.8L10.8 9L18 16.2L16.2 18L9 10.8L1.8 18Z" fill="#5F6368" />
                            </svg>
                        </button>
                        <video
                            controls
                            ref={videoRef}
                            src="https://muxed.s3.amazonaws.com/leds.mp4"
                            style={{ width: "100%", maxWidth: "752.814px", height: "422px" }}
                        />
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default VideoPlayer