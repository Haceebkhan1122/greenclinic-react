import React, { useState } from 'react'
import { Modal } from "react-bootstrap"
import "./cancelAppointmentModal.scss";
import User from "../../../assets/images/svg/userIcon.svg"
import Calendar from "../../../assets/images/svg/calendar.svg"
import ReminderMedical from "../../../assets/images/svg/reminder-medical.svg"
import Schedule from "../../../assets/images/svg/schedule.svg"
import SubmitModal from '../submitModal/SubmitModal';

const CancelAppointmentModal = ({ cancelAppointment, getOnlineAppointmentsListing, getCalenderWiseApps, handleCancelClose, patientName, appointmentDate, time, appointmentType, appointmentId }) => {
    const [submitShow, setSubmitShow] = useState(false)

    const handleSubmitShow = () => {
        setSubmitShow(true)
        handleCancelClose()
    }

    const handleSubmitClose = () => setSubmitShow(false)

    return (
        <>
            <Modal className='cancelAppointment' show={cancelAppointment} onHide={handleCancelClose} centered>
                <button onClick={handleCancelClose} className="close  ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                    </svg>
                </button>
                <Modal.Body>
                    <h4>Are you sure you want to cancel this appointment?</h4>
                    <p>Please note that this is a prepaid appointment, and you will be charged a penalty as per Meri Sehat's policies if applicable</p>
                    <div className="box_wrap">
                        <ul>
                            <li><p><img src={User} alt="" /> Patient</p> <span>{patientName}</span></li>
                            <li><p><img src={Calendar} alt="" /> Date</p> <span>{appointmentDate}</span></li>
                            <li><p><img src={Schedule} alt="" /> Time</p> <span>{time}</span></li>
                            <li><p><img src={ReminderMedical} alt="" /> Appointment Type</p> <span>{appointmentType}</span></li>
                        </ul>
                    </div>
                    <div className="btn_wrap">
                        <button className='button2' type='button' onClick={() => handleSubmitShow()}>Yes, Cancel</button>
                        <button className='button1' onClick={handleCancelClose}>No</button>
                    </div>
                </Modal.Body>
            </Modal>
            <SubmitModal getOnlineAppointmentsListing={getOnlineAppointmentsListing} getCalenderWiseApps={getCalenderWiseApps} patientName={patientName} handleSubmitClose={handleSubmitClose} submitShow={submitShow} appointmentId={appointmentId} />
        </>
    )
}

export default CancelAppointmentModal