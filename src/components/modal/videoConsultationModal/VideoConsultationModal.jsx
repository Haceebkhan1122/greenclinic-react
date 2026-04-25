import React, { useState, useEffect } from 'react'
import { Modal, Row, Col } from 'react-bootstrap';
import VideoCam from "../../../assets/images/svg/videocam.svg";
import Cancel from "../../../assets/images/png/cancel_button.png";
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import Schedule from "../../../assets/images/svg/schedule.svg";
import "./videoConsultationModal.scss"
import API, { API_MS } from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Loader from '../../loader/Loader';

const VideoConsultationModal = ({ handleVideoConsultationClose, setIndicationMessage, setVideoConsultEditShow, videoConsultationShow, doctorDetails }) => {
    const [viewDetails, setViewDetails] = useState([])
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    let clinicId = useSelector((state) => state.clinic.clinicDetails?.id);

    useEffect(() => {
        getTimingsDoctor();
    }, [videoConsultationShow, doctorDetails?.id])

    const daysInPerson = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


    const getTimingsDoctor = async () => {
        if (doctorDetails?.id) {
            try {
                setIsLoading(true);
                const response = await API_MS.get(`clinic-timings-fee?gc_user_id=${doctorDetails?.id}&clinic_id=${clinicId}&type=video`)
                if (response?.status == 200) {
                    setViewDetails(response?.data?.data);
                    setIsLoading(false);
                }
                else {
                    setMessage(response?.data?.message);
                    setIsLoading(false);
                    setViewDetails([]);
                }
            } catch (error) {
                setIsLoading(false);
                console.log("errr", error);
            }
        }
    }

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [message])


    const showUpdate = () => {
        setVideoConsultEditShow(true)
        handleVideoConsultationClose();
    }

    const [timingsData, setTimingsData] = useState([]);

    const dayMap = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday"
    };

    useEffect(() => {
        const apiTimings = viewDetails?.timings || [];
        const formattedData = daysInPerson.map((dayName) => {
            const apiDayTimings = apiTimings.filter(item => item?.day === dayName.toLowerCase());
            const hasTimings = apiDayTimings.length > 0;

            return {
                day: dayName,
                isVisible: hasTimings,
                timing: hasTimings
                    ? apiDayTimings.map(item => ({
                        start_time: item.start_time || "",
                        end_time: item.end_time || ""
                    }))
                    : [{ start_time: "", end_time: "" }]
            };
        });
        setTimingsData(formattedData);
    }, [viewDetails, videoConsultationShow])

    return (
        <>

            <Modal className="video_consultation" show={videoConsultationShow} onHide={handleVideoConsultationClose} centered>
                {isLoading ? <Loader />
                    :
                    (<>
                        <button className='cancel' onClick={handleVideoConsultationClose} aria-label="Close"><img src={Cancel} alt='cancel' /></button>
                        <Modal.Header className='d-md-none'>
                            <Modal.Title><button onClick={handleVideoConsultationClose}><img src={ArrowBack} alt="" /></button>Dr. Maheen Afzal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {message !== "" && <div className="showPoup">
                                {message}
                            </div>}
                            <div className='head '>
                                <h4 className='d-md-block d-none'>{doctorDetails?.name}</h4>
                                <p className='tw-flex'><img src={VideoCam} alt="" /> Video Consultation</p>
                            </div>
                            <div className='overflow_scroll'>
                                <Row>
                                    <Col lg={3} xs={5}>
                                        <h5>Duration</h5>
                                        <span>{viewDetails?.fee?.consultation_duration} mints</span>
                                    </Col>
                                    <Col lg={3} xs={5}>
                                        <h5>Fees</h5>
                                        <span>Rs.{viewDetails?.fee?.consultation_fee}</span>
                                    </Col>
                                </Row>
                                <ul>
                                    {timingsData?.map((item) => {
                                        return (<>
                                            <li>
                                                <img src={Schedule} alt="" />
                                                <div>
                                                    <h6>{item?.day}</h6>
                                                    <div>
                                                        {item?.timing?.map((time) => {
                                                            return (<>
                                                                <p> {time?.start_time} - {time?.end_time}</p>
                                                            </>)
                                                        })}
                                                    </div>
                                                </div>
                                            </li>
                                        </>)
                                    })}
                                </ul>
                            </div>
                            <div className='update'>
                                <button className='button1 d-none d-md-block' onClick={handleVideoConsultationClose} >Done</button>
                                <button className='button2' onClick={showUpdate} >Update</button>
                            </div>
                        </Modal.Body>
                    </>)}
            </Modal>
        </>
    )
}

export default VideoConsultationModal