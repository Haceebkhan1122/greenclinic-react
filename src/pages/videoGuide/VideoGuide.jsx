import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import './videoGuide.scss'; 

const VideoGuide = () => {
    return (
        <div className='video-guide'>
            <Container>
                <Row>
                    <Col lg={12}>
                        <div className='boxed-bg'>
                            <Row>
                                <Col md={12}>
                                    <VideoPlayer />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default VideoGuide