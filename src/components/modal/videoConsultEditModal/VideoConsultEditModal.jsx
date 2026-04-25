/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap';
import { InfoCircleOutlined } from '@ant-design/icons';
import AddButton from "../../../assets/images/svg/add_button.svg"
import API, { API_MS } from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import './videoConsultEditModal.scss';
import { useSelector } from 'react-redux';
import Loader from '../../loader/Loader';
import { isMobile } from 'react-device-detect';

const VideoConsultEditModal = ({ videoConsultEditShow, setIndicationMessage, userId, getInPersonDataOnline, handleVideoEditConsultClose, doctorId, singleOnlineInPersonEditItem }) => {
    const [fees, setFees] = useState(null)
    const [duration, setDuration] = useState(null)
    const [clinicShare, setClinicShare] = useState(null)
    const [doctorShare, setDoctorShare] = useState(null)
    const [platformFee, setPlatformFee] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState(null)
    const [daysOfWeek, setDayOfWeek] = useState([]);
    const [count, setCount] = useState(0);
    const [inputs, setInputs] = useState([]);
    const [timingState, setTimingState] = useState({});
    const [inPersonData, setInPersonData] = useState([]);
    const [consultationDuration, setConsultationDuration] = useState([])


    useEffect(() => {
        getConsultationDuration();
    }, [])


    const getConsultationDuration = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/consultation-duration`);
            if (response?.status === 200) {
                setConsultationDuration(response?.data?.data);
            } else {
                setConsultationDuration([]);
                setIsLoading(false)
            }
        } catch (error) {
            setConsultationDuration([]);
            setIsLoading(false)
        } finally {
            setIsLoading(false);
        }
    };



    let clinicDetails = useSelector((state) => state.clinic.clinicDetails);
    let clinicId = useSelector((state) => state.clinic.clinicDetails?.id);

    const daysInPerson = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        let numValue = parseFloat(value);

        if (name == "fees") {
            setFees(value);
        }

        if (name == "duration") {
            setDuration(value);
        }

        if (name == "doctorShare") {
            if (!/^\d{0,3}$/.test(value)) return;
            let numValue = value === "" ? "" : Math.min(Math.max(parseFloat(value), 0), 100);
            setDoctorShare(numValue);
            setClinicShare(numValue === "" ? "" : 100 - numValue);
        }

        if (name == "clinic_share") {
            if (!/^\d{0,3}$/.test(value)) return;
            let numValue = value === "" ? "" : Math.min(Math.max(parseFloat(value), 0), 100);
            setClinicShare(numValue);
            setDoctorShare(numValue === "" ? "" : 100 - numValue);
        }

        if (name == "platformFee") {
            setPlatformFee(value);
        }
    }

    const convertTo12Hour = (time) => {
        if (!time) return "";
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };


    useEffect(() => {
        if (inPersonData?.fee || inPersonData?.timings) {
            setFees(inPersonData?.fee?.consultation_fee)
            setDuration(inPersonData?.fee?.consultation_duration)
            setClinicShare(inPersonData?.fee?.clinic_share_fee_percent)
            setDoctorShare(inPersonData?.fee?.doctor_share_fee_percent)
            const apiTimings = inPersonData?.timings || [];
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

            setDayOfWeek(formattedData);
            const timingData = {};
            formattedData.forEach((day) => {
                timingData[day.day] = day.timing;
            });
            setTimingState(timingData);
        }
        else {
            const defaultTimings = daysInPerson.map((dayName) => ({
                day: dayName,
                isVisible: false,
                timing: [{ start_time: "", end_time: "" }]
            }));

            setDayOfWeek(defaultTimings);
            const timingData = {};
            defaultTimings.forEach((day) => {
                timingData[day.day] = day.timing;
            });
            setTimingState(timingData);
        }
    }, [inPersonData, videoConsultEditShow]);


    useEffect(() => {
        if (doctorShare) {
            let calc = 100 - doctorShare;
            setClinicShare(calc);
        }
    }, [doctorShare])

    const handleSwitchToggle = (index) => {
        setDayOfWeek(prevDays => {
            const newDays = [...prevDays];
            newDays[index].isVisible = !newDays[index].isVisible;
            return newDays;
        });
    };

    const handleTimeChange = (dayIndex, timingIndex, type, value) => {
        const convertedTime = convertTo12Hour(value);
        setDayOfWeek(prevState => {
            const newDays = [...prevState];
            newDays[dayIndex].timing[timingIndex][type] = convertedTime;
            return [...newDays];
        });
    };

    const handleAddTiming = (index) => {
        setDayOfWeek(prevDays => {
            const newDays = [...prevDays];
            newDays[index].timing.push({ start_time: "", end_time: "" });
            return newDays;
        });
    };

    const convertTo24Hour = (time) => {
        if (!time) return "";

        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        } else if (modifier === "AM" && hours === 12) {
            hours = 0;
        }
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    const formattedTimings = daysOfWeek.map(item => ({
        day: item?.day,
        time: item?.timing.map(t => ({
            start_time: t.start_time,
            end_time: t.end_time
        }))
    }));

    const filteredTimings = daysOfWeek
        .filter(day => day.isVisible && day.timing.some(time => time.start_time && time.end_time))
        .map(day => ({
            day: day.day.toLowerCase(),
            time: day.timing.filter(time => time.start_time && time.end_time)
        }));

    const removedDays = daysOfWeek
        .filter(day => !day.isVisible)
        .map(day => day.day.toLowerCase());

    const payloadUpdate = {
        clinic_id: clinicId,
        clinic_timings: filteredTimings,
        consultation_fee: Number(fees),
        doctor_share_fee_percent: Number(doctorShare),
        clinic_share_fee_percent: Number(clinicShare),
        clinic_share: 100,
        remove_days: removedDays,
        doctor_share: 100,
        consultation_duration: Number(duration),
        clinic_name: clinicDetails?.clinic_name,
        clinic_address: clinicDetails?.address,
        user_id: userId,
        share_fee_percent: 0,
        is_video_consultancy: true,
    }

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const response = await API_MS.post("/clinic-timings-fee", payloadUpdate)
            if (response?.status == 200 || response?.status == 201) {
                setIsLoading(false)
                setIndicationMessage(response?.data?.message)
                getViewDetails(doctorId, "video");
                handleVideoEditConsultClose();
            }
            else {
                setIsLoading(false)
                setIndicationMessage(response?.data?.message)
            }
        } catch (error) {
            setIsLoading(false)
            console.log("error in api ", error)
        }
    }

    const getViewDetails = async (id, type) => {
        try {
            setIsLoading(true)
            const response = await API_MS.get(`clinic-timings-fee?gc_user_id=${id}&clinic_id=${clinicDetails?.id}&type=${type}`)
            if (response?.status == 200) {
                setInPersonData(response?.data?.data);
                setIsLoading(false)
            }
            else {
                setIndicationMessage(response?.data?.message)
                setIsLoading(false);
            }
        } catch (error) {
            console.log("errr", error);
            setIsLoading(false);
        }
    }

    const handleCloseOption = (dayIndex, timingIndex) => {
        setDayOfWeek(prev =>
            prev.map((day, i) => {
                if (i !== dayIndex) return day;  

                const timing = day.timing.filter((_, j) => j !== timingIndex);
                return {
                    ...day,
                    timing: timing.length ? timing : [{ start_time: "", end_time: "" }],
                };
            })
        );
    };

    useEffect(() => {
        if (userId !== "" && userId !== null && userId !== undefined) {
            getViewDetails(userId, "video")
        }
    }, [videoConsultEditShow])

    return (
        <>
            {isLoading ? <Loader />
                :
                <Modal show={videoConsultEditShow} onHide={handleVideoEditConsultClose} centered className="modalInPersonConsult">
                    <Modal.Body>
                        <span className='cross_icc' onClick={handleVideoEditConsultClose}></span>
                        <Row className='bg_from'>
                            <h2> <span className='back__ico' onClick={handleVideoEditConsultClose}></span> Video Consultation </h2>
                            <div className="mobile_wrapeee">
                                <Col lg={8} md={12} sm={12} className='px-md-3 px-0'>
                                    <Form>
                                        <Row>
                                            <h6> Fees </h6>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Consultation Fees*</Form.Label>
                                                    <Form.Control type="number" placeholder='Enter consultation fees' name='fees' onChange={handleChangeForm} value={fees} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Consultation Duration*</Form.Label>
                                                    <select name='duration' onChange={handleChangeForm} value={duration}>
                                                        <option hidden>Select duration</option>
                                                        {consultationDuration?.map((item, idx) => {
                                                            return (<>
                                                                <option key={idx} value={item}> {item} </option>
                                                            </>)
                                                        })}
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Share Price of Doctor (%)*</Form.Label>
                                                    <Form.Control type="text" placeholder='Enter share price in percentage' name='doctorShare' onChange={handleChangeForm} value={doctorShare} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Clinic Share (%)</Form.Label>
                                                    <Form.Control className='clinicShareInp' disabled type="text" placeholder='Auto calculate based on doctor share' name='clinic_share' onChange={handleChangeForm} value={clinicShare} />
                                                </Form.Group>
                                            </Col>
                                            {/* <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Platform fee (%)</Form.Label>
                                                    <Form.Control type="number" placeholder='20%' name='platformFee' onChange={handleChangeForm} value={platformFee} />
                                                </Form.Group>
                                                <p className='platform_fee'><InfoCircleOutlined /> Platform fee is only applicable for Meri sehat appointments</p>
                                            </Col> */}
                                        </Row>
                                    </Form>
                                </Col>
                                <Col lg={4} md={12} sm={12} className='scheduleInPerson'>
                                    <h3>Schedule</h3>
                                    <ul>
                                        {daysOfWeek.map((days, index) => (
                                            <li key={index}>
                                                <div className='days'>
                                                    <span>{days.day}</span>
                                                    <Form.Check
                                                        type="switch"
                                                        id={`custom-switch-${index}`}
                                                        checked={days.isVisible}
                                                        onChange={() => handleSwitchToggle(index)}
                                                    />
                                                </div>
                                                {days.isVisible && (
                                                    <div className='timing'>
                                                        {days?.timing.map((time, timingIndex) => {
                                                            return (<>
                                                                <div key={timingIndex} className="timing-inputs">
                                                                    <div>
                                                                        <label>Start Time</label>
                                                                        <input
                                                                            type="time"
                                                                            value={convertTo24Hour(time?.start_time)}
                                                                            onChange={(e) =>
                                                                                handleTimeChange(index, timingIndex, 'start_time', e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label>End Time</label>
                                                                        <input
                                                                            type="time"
                                                                            value={convertTo24Hour(time?.end_time)}
                                                                            onChange={(e) =>
                                                                                handleTimeChange(index, timingIndex, 'end_time', e.target.value)
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <span className="crossOptionIcon" onClick={() => handleCloseOption(index, timingIndex)}></span>
                                                                </div>
                                                            </>)
                                                        })}
                                                        <button onClick={() => handleAddTiming(index)}>
                                                            <img src={AddButton} alt="add button" />
                                                        </button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                            </div>
                        </Row>
                        {isMobile ?
                            <div className="bottom_bar_btn">
                                <button className='' onClick={handleVideoEditConsultClose}>Cancel</button>
                                <button className='' onClick={handleUpdate}>Next to Online Slots</button>
                            </div>
                            :
                            <button className='button12' onClick={handleUpdate}>Save</button>
                        }
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default VideoConsultEditModal;
