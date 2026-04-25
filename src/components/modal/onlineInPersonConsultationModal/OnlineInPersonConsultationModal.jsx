/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Modal, Accordion } from 'react-bootstrap';
import ReminderMedical from "../../../assets/images/svg/reminder-medical.svg";
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import Cancel from "../../../assets/images/png/cancel_button.png";
import Schedule from "../../../assets/images/svg/schedule.svg";
import "./onlineInPersonConsultationModal.scss";
import API, { API_MS } from '../../../services/httpInstance';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../../loader/Loader';

const OnlineInPersonConsultationModal = ({ handleOnlineInPersonClose, doctorDetails, setOnlineInPersonEdit, onlineInPersonConsultationShow, singleViewItem, clinicId }) => {
    const [timingsData, setTimingsData] = useState([]);
    let clinicDetails = useSelector((state) => state.clinic.clinicDetails);
    
    const [isLoading, setIsLoading] = useState(false)

    const getTimingsDoctor = async () => {
        if (singleViewItem?.id) {
            try {
                setIsLoading(true)
                const response = await API_MS.get(`clinic-timings-fee?gc_user_id=${singleViewItem?.id}&clinic_id=${clinicDetails?.id}&type=in-person`)
                if (response?.status == 200) {
                    setTimingsData(response?.data?.data);
                    setIsLoading(false)

                }
                else {
                    toast.error(response?.data?.message)
                    setIsLoading(false)
                }
            } catch (error) {
                console.log("errr", error);
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        if(singleViewItem !== "" && singleViewItem !== null && singleViewItem !== undefined ) {
            getTimingsDoctor();
        }
    }, [singleViewItem?.id])

    
    const showUpdate = () => {
        setOnlineInPersonEdit(true)
        handleOnlineInPersonClose();
    }


    const [timingsArr, setTimingsArr] = useState([]);

    const daysInPerson = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        
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
        const apiTimings = timingsData?.timings || [];
        const formattedData = daysInPerson.map((dayName) => {
            const apiDayTimings = apiTimings.filter(
                (item) => item?.day?.toLowerCase() === dayName.toLowerCase()
            );

            const hasTimings = apiDayTimings.length > 0;

            return {
                day: dayName,
                isVisible: hasTimings,
                timing: hasTimings
                    ? apiDayTimings.map((item) => ({
                        start_time: item.start_time || "",
                        end_time: item.end_time || ""
                    }))
                    : [{ start_time: "", end_time: "" }]
            };
        });

        setTimingsArr(formattedData);
    }, [timingsData, onlineInPersonConsultationShow])

    return (
        <>
            {isLoading ? <Loader />
                :
                <Modal className="in_person" show={onlineInPersonConsultationShow} onHide={handleOnlineInPersonClose} centered>
                    <button className='cancel' onClick={handleOnlineInPersonClose} aria-label="Close"><img src={Cancel} alt='cancel' /></button>
                    <Modal.Header className='d-md-none'>
                        <Modal.Title><button onClick={handleOnlineInPersonClose}><img src={ArrowBack} alt="" /></button>{doctorDetails?.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='top-headerr'>
                            <h4 className='d-md-block d-none'>{singleViewItem?.name}</h4>
                            <div className='tw-flex tw-items-center tw-gap-2'><img src={ReminderMedical} alt="" /> In-person Consultation</div>
                        </div>
                        <div className='overflow_scroll'>
                            <div className='inPersonItem'>
                                <div className='wrape_bot'>
                                    <div className="singleee">
                                        <span> Duration </span>
                                        <span>{timingsData?.fee?.consultation_duration} {timingsData?.fee?.consultation_duration == 1 ? "mint" : "mints"} </span>
                                    </div>
                                    <div className="singleee">
                                        <span> Fees </span>
                                        <span>Rs. {timingsData?.fee?.consultation_fee}</span>
                                    </div>
                                </div>
                                <ul>
                                    {timingsArr?.map((item) => {
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
                            <button className='button1 d-none d-md-block' onClick={handleOnlineInPersonClose} >Done</button>
                            <button className='button2' onClick={showUpdate}>Update</button>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default OnlineInPersonConsultationModal