import React, { useEffect, useState } from 'react'
import './updateNotification.scss'
import { Container, Row, Col, Tabs, Tab, Nav, Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import VideoPop from "../../assets/images/png/popup-video.png";
import Arrow from "../../assets/images/png/arrowright_blue.png"
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import API from '../../services/httpInstance';

const UpdateNotification = () => {
    const [activeTab, setActiveTab] = useState(null)
    const [show, setShow] = useState(false);
    const [fadeContent, setFadeContent] = useState(false);
    const [unreadfeatures, setUnreadfeatures] = useState([])
    const [allfeatures, setAllfeatures] = useState([])
    const [videoUrl, setVideoUrl] = useState([])
    const [currentVideoUrl, setCurrentVideoUrl] = useState('')

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = (videoUrl) => {
        setCurrentVideoUrl(videoUrl);
        setShow(true);
    };

    const handleTabClick = async (id) => {
        setFadeContent(true);
        setTimeout(async () => {
            setActiveTab(id);
            await fetchVideoForFeature(id)
            setFadeContent(false)
        }, 300);
    }

    const fetchVideoForFeature = async (id) => {
        try {
            const response = await API.get(`/get-feature-upload-videos/${id}`);

            if (response?.status == 200) {
                setVideoUrl(response?.data?.data);
            }
        } catch (error) {
            console.log("Error fetching video:", error);
        }
    }

    const getNotificationListTabWise = async () => {
        try {
            const response = await API.get("get-notification-list-tab-wise")
            if (response.status == 200) {
                setUnreadfeatures(response?.data?.data?.unread_features)
                setAllfeatures(response?.data?.data?.all_features)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getNotificationListTabWise()
    }, [])
    return (
        <section className='update-notification'>
            <Container>
                <Row>
                    <Col lg={12}>
                        <div className='boxed-bg'>
                            {!isMobile ? (
                                <Row>
                                    <Col lg={3}>
                                        <div className="tabs-li">
                                            <Tabs
                                                defaultActiveKey="all"
                                                id="justify-tab-example"
                                            >
                                                <Tab eventKey="all" title="All">
                                                    <Nav variant="pills" className="flex-column">
                                                        {allfeatures?.map((item) => (
                                                            <Nav.Item key={item?.id}>
                                                                <Nav.Link onClick={() => handleTabClick(item?.feature_upload_id)}>
                                                                    <div>
                                                                        <h5>{item?.feature_upload?.notification_text}</h5>
                                                                        <p>{moment(item?.feature_upload?.updated_at).format('D MMMM, YYYY')}</p>
                                                                    </div>
                                                                    <img src={Arrow} alt="" />
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        ))}
                                                    </Nav>
                                                </Tab>
                                                <Tab eventKey="unread" title="Unread">
                                                    <Nav variant="pills" className="flex-column">
                                                        {unreadfeatures?.map((item) => (
                                                            <Nav.Item>
                                                                <Nav.Link onClick={() => handleTabClick(item?.feature_upload_id)}>
                                                                    <div>
                                                                        <h5>{item?.feature_upload?.notification_text}</h5>
                                                                        <p>3 weeks ago</p>
                                                                    </div>
                                                                    <img src={Arrow} alt="" />
                                                                </Nav.Link>
                                                            </Nav.Item>
                                                        ))}
                                                    </Nav>
                                                </Tab>
                                            </Tabs>
                                        </div>
                                    </Col>
                                    <Col lg={9} className={`fade-content ${fadeContent ? 'fading' : ''}`}>
                                        {activeTab && (
                                            <div className='video-listing'>
                                                <h5>New Expense Features</h5>
                                                <Row>
                                                    {videoUrl?.map((item) => (
                                                        <Col md={4} key={item?.id}>
                                                            <button className="card" onClick={() => handleShow(item?.link)}>
                                                                <a className="popup-youtube" href="javascript:void(0);">
                                                                    <img src={item?.thumbnail} className="card-img-top" alt={item?.title} />
                                                                </a>
                                                                <div className="card-body">
                                                                    <h5 className="card-title">{item?.title ? item?.title : "Green Clinic"}</h5>
                                                                    <p className="card-text">{item?.description ? item?.title : "What is green clinic"}</p>
                                                                </div>
                                                            </button>
                                                        </Col>
                                                    ))}
                                                </Row>

                                                <Modal show={show} centered onHide={handleClose} className="video_modal">
                                                    <Modal.Body>
                                                        <div className="wraper__modal">
                                                            <button onClick={handleClose} className="close">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                                    <path d="M1.8 18L0 16.2L7.2 9L0 1.8L1.8 0L9 7.2L16.2 0L18 1.8L10.8 9L18 16.2L16.2 18L9 10.8L1.8 18Z" fill="#5F6368" />
                                                                </svg>
                                                            </button>
                                                            <ReactPlayer controls={true} url={currentVideoUrl} className="w-100" />
                                                        </div>
                                                    </Modal.Body>
                                                </Modal>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            ) : (
                                <>
                                    <Row>
                                        {videoUrl?.map((item) => (
                                            <Col md={4} key={item?.id}>
                                                <button className="card" onClick={() => handleShow(item?.link)}>
                                                    <a className="popup-youtube" href="javascript:void(0);">
                                                        <img src={item?.thumbnail} className="card-img-top" alt={item?.title} />
                                                    </a>
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item?.title ? item?.title : "Green Clinic"}</h5>
                                                        <p className="card-text">{item?.description ? item?.title : "What is green clinic"}</p>
                                                    </div>
                                                </button>
                                            </Col>
                                        ))}
                                    </Row>

                                    <Modal show={show} centered onHide={handleClose} className='video_modal'>
                                        <Modal.Body>
                                            <div className="wraper__modal">
                                                <button onClick={handleClose} className='close'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                        <path d="M1.8 18L0 16.2L7.2 9L0 1.8L1.8 0L9 7.2L16.2 0L18 1.8L10.8 9L18 16.2L16.2 18L9 10.8L1.8 18Z" fill="#5F6368" />
                                                    </svg>
                                                </button>
                                                <ReactPlayer controls={true} url={currentVideoUrl} className="w-100" />
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </>
                            )}

                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default UpdateNotification