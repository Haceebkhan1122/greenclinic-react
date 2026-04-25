/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Form, Modal, Row } from 'react-bootstrap';
import { InfoCircleOutlined } from '@ant-design/icons';
import AddButton from "../../../assets/images/svg/add_button.svg"
import API from '../../../services/httpInstance';
import './inPersonEditModal.scss';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';

const InPersonEditModal = ({ inPersonEditModal, setIndicationMessage, handleInPersonEditClose, doctorId }) => {
    const [fees, setFees] = useState(null)
    const [duration, setDuration] = useState(null)
    const [clinicShare, setClinicShare] = useState(null)
    const [doctorShare, setDoctorShare] = useState(null)
    const [platformFee, setPlatformFee] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [id, setId] = useState(null)
    const [daysOfWeek, setDayOfWeek] = useState([]);
    const [timingState, setTimingState] = useState({});
    const [inPersonData, setInPersonData] = useState([]);
    const [consultationDuration, setConsultationDuration] = useState([])


    let clinicId = useSelector((state) => state.clinic.clinicDetails?.id);

    const daysInPerson = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleChangeForm = (e) => {
        const { name, value } = e.target;

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

    const formattedTimings = daysOfWeek
    .filter(item => item?.isVisible)
    .map(item => ({
        day: item?.day,
        start_time: item?.timing.map(t => t.start_time),
        end_time: item?.timing.map(t => t.end_time)
    }));

    const removedDays = daysOfWeek
    .filter(day => !day.isVisible) 
    .map(day => day.day.toLowerCase());

    const payloadUpdate = {
        doctor_id: doctorId,
        clinic_id: clinicId,
        doctor_timings: formattedTimings,
        consultation_fee: Number(fees),
        doctor_share: Number(doctorShare),
        clinic_share: Number(clinicShare),
        consultation_duration: Number(duration), 
    }

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const response = await API.put("/update-doctor-timing", payloadUpdate)
            if (response?.status == 200) {
                setIsLoading(false)
                setIndicationMessage(response?.data?.message)
                handleInPersonEditClose();
                getInPersonDataOnline(doctorId);
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

    const convertTo12Hour = (time24) => {
        if (!time24) return "";
        const [hour, minute] = time24.split(":");
        const h = parseInt(hour, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minute} ${ampm}`;
    };
    
    const convertTo24Hour = (time12) => {
        if (!time12) return "";
        const [time, modifier] = time12.split(" ");
        let [hours, minutes] = time.split(":");
        hours = parseInt(hours, 10);
    
        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }
    
        return `${String(hours).padStart(2, "0")}:${minutes}`;
    };

    const getInPersonDataOnline = async (doctorId) => {
        try {
            setIsLoading(true);
            const response = await API.get(`/doctor-timings-in-person?doctorId=${doctorId}&clinicId=${clinicId}`);
            if (response?.status === 200 && response?.data?.data?.length > 0) {
                setInPersonData(response?.data?.data);
            } else {
                setInPersonData([]); 
                setIndicationMessage(response?.data?.message || "No data available");
            }
        } catch (error) {
            console.log("Error:", error);
            setInPersonData([]); 
            setIndicationMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

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
    
    useEffect(() => {
        if (doctorId !== null) {
            getInPersonDataOnline(doctorId);
        }
    }, [doctorId, inPersonEditModal]);


    const daySlugToIdMap = {
        sunday: 7,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6
    };

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
        if (inPersonData?.length > 0) {
            setFees(inPersonData?.[0]?.consultation_fee || "");
            setDuration(inPersonData?.[0]?.consultation_duration || "");
            setClinicShare(inPersonData?.[0]?.clinic_share_fee_percent || "");
            setDoctorShare(inPersonData?.[0]?.doctor_share_fee_percent || "");
            const apiTimings = inPersonData[0]?.clinic_timings || [];
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

            setDayOfWeek(formattedData);
            const timingData = {};
            formattedData.forEach((day) => {
                timingData[day.day] = day.timing;
            });
            setTimingState(timingData);
        } else {
            setFees("");
            setDuration("");
            setClinicShare("");
            setDoctorShare("");
    
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
    }, [inPersonData, inPersonEditModal]);

    useEffect(() => {
        getConsultationDuration();
    }, [])

    return (
        <Modal show={inPersonEditModal} onHide={handleInPersonEditClose} centered className="modalInPersonConsult">
            <Modal.Body>
                <span className='cross_icc' onClick={handleInPersonEditClose}></span>
                <Row className='bg_from'>
                    <h2> <span className='back__ico' onClick={handleInPersonEditClose}></span>   In-person Consultation </h2>
                    <div className="mobile_wrapeee">
                        <Col lg={8} sm={12} className='px-md-3 px-0'>
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
                                            <Form.Control type="text" min="0" max="100" placeholder='Enter share price in percentage' name='doctorShare' onChange={handleChangeForm} value={doctorShare} />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Clinic Share (%)</Form.Label>
                                            <Form.Control disabled type="text" className='clinicShareInp' min="0" max="100" placeholder='Auto calculate based on doctor share' name='clinic_share' onChange={handleChangeForm} value={clinicShare} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                        <Col lg={4} sm={12} className='scheduleInPerson'>
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
                                                                    // className='custom-time'
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
                                                                    // className='custom-time'
                                                                />
                                                            </div>
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
                            <button className='' onClick={handleInPersonEditClose}>Cancel</button>
                            <button className='' onClick={handleUpdate}>Next to Online Slots</button>
                        </div>
                        :
                        <button className='button12' onClick={handleUpdate}>Save</button>
                    }
            </Modal.Body>
        </Modal>
    )
}

export default InPersonEditModal;
