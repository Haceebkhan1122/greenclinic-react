import React from 'react'
import { Modal } from 'react-bootstrap'
import CheckIcon from "../../../assets/images/png/check_icon.png";
import "./appointmentCancelledModal.scss"

const AppointmentCancelledModal = ({ handleAppointmentCancelledClose, appointmentCancelledShow, patientName }) => {

  const redirectToAppointments = () => {
    handleAppointmentCancelledClose(false)
  }

  return (
    <Modal className='appointmentCancelled' show={appointmentCancelledShow} onHide={handleAppointmentCancelledClose} centered>
      <button onClick={handleAppointmentCancelledClose} className="close  ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
        </svg>
      </button>
      <Modal.Body>
        <img src={CheckIcon} alt="" />
        <h4>Appointment Cancelled</h4>
        <p>Your appointment with {patientName} has been cancelled successfully.</p>
        <span>For help or queries, call us at <a href="tel:021111111111">(021)-111-111-111</a></span>
        <div className="btn_wrap">
          <button className='button2' onClick={redirectToAppointments}>OKAY</button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AppointmentCancelledModal