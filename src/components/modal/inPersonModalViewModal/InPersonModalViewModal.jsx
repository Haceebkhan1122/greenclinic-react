import React, { useEffect, useState } from 'react'
import { Modal, Accordion } from 'react-bootstrap';
import ReminderMedical from "../../../assets/images/svg/reminder-medical.svg";
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import Cancel from "../../../assets/images/png/cancel_button.png";
import Schedule from "../../../assets/images/svg/schedule.svg";
import "./inPersonModalViewModal.scss"
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const InPersonModalViewModal = ({ inPersonViewShow, doctorDetails,setIndicationMessage, setInPersonEditModal, setIsLoading, doctorId, handleInPersonEditShow, handleInPersonViewClose, indicationMessage }) => {

    const [viewDetails, setViewDetails] = useState([])
    let clinicId = useSelector((state) => state.clinic.clinicDetails?.id);

    useEffect(() => {
        if (doctorId !== null) { 
            getInPersonDataOnline(doctorId)
        }
    }, [doctorId])

    const getInPersonDataOnline = async (id) => {
        try {
            setIsLoading(true);
            const response = await API.get(`/doctor-timings-in-person?doctorId=${id}&clinicId=${clinicId}`);
            if (response?.status == 200) {
                setViewDetails(response?.data?.data);
                setIsLoading(false);
            }
            else {
                setIsLoading(false)
                setIndicationMessage(response?.data?.message)
            }
        } catch (error) {
            console.log("errr", error)
            setIsLoading(false);
        }
    }

    const showUpdate = () => {
        setInPersonEditModal(true)
        handleInPersonViewClose();
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
        const apiTimings = viewDetails[0]?.clinic_timings || [];
        const formattedData = Object.entries(dayMap).map(([day_id, dayName]) => {
            const matchedDay = apiTimings.find((item) => item.day_id === parseInt(day_id));
            const hasTimings = matchedDay && matchedDay.timings && matchedDay.timings.length > 0;
            return {
                day: dayName,
                isVisible: hasTimings,
                timing: hasTimings
                    ? matchedDay.timings.map((t) => ({
                        start_time: t.start_time || "",
                        end_time: t.end_time || ""
                    }))
                    : [{ start_time: "", end_time: "" }]
            };
        });
        setTimingsData(formattedData);
    }, [viewDetails, inPersonViewShow])

    return (
        <Modal className="in_person" show={inPersonViewShow} onHide={handleInPersonViewClose} centered>
            <button className='cancel' onClick={handleInPersonViewClose} aria-label="Close"><img src={Cancel} alt='cancel' /></button>
            <Modal.Header className='d-md-none'>
                <Modal.Title><button onClick={handleInPersonViewClose}><img src={ArrowBack} alt="" /></button>{doctorDetails?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {indicationMessage !== "" && <div className="showPoup">
                    {indicationMessage}
                </div>}
                <div className='top-headerr'>
                    <h4 className='d-md-block d-none'>{doctorDetails?.name}</h4>
                    <div className='tw-flex'><img src={ReminderMedical} alt="" /> In-person Consultation</div>
                </div>

                <div className='overflow_scroll'>
                    <div className='inPersonItem'>
                        <div className='wrape_bot'>
                            <div className="singleee">
                                <span> Duration </span>
                                <span>{viewDetails[0]?.consultation_duration} {viewDetails[0]?.consultation_duration == 1 ? "mint" : "mints" } </span>
                            </div>
                            <div className="singleee">
                                <span> Fees </span>
                                <span>Rs. {viewDetails[0]?.consultation_fee}</span>
                            </div>
                        </div>
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
                </div>
                <div className='update'>
                    <button className='button1 d-none d-md-block' onClick={handleInPersonViewClose}>Done</button>
                    <button className='button2' onClick={showUpdate}>Update</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default InPersonModalViewModal