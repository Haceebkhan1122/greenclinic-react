import React, { useState } from 'react'
import "./submitModal.scss";
import { Form, Modal } from "react-bootstrap"
import AppointmentCancelledModal from '../appointmentCancelled/AppointmentCancelledModal';
import API from '../../../services/httpInstance';

const SubmitModal = ({ handleSubmitClose, submitShow, getCalenderWiseApps, getOnlineAppointmentsListing, appointmentId, patientName }) => {
    const [appointmentCancelledShow, setAppointmentCancelledShow] = useState(false)
    const [selectedReason, setSelectedReason] = useState('')
    const [textareaValue, setTextareaValue] = useState('')
    const [errorMessage, setErrorMessage] = useState('');

    const handleAppointmentCancelledClose = () => setAppointmentCancelledShow(false)

    const handleRadioChange = (e) => {
        setSelectedReason(e.target.value)
        setErrorMessage('');
        if (e.target.value !== "Other") {
            setTextareaValue('');
        }
    }

    const handleTextareaChange = (e) => {
        setTextareaValue(e.target.value);
    }

    const handleCancelButton = async () => {
        if (!selectedReason) {
            setErrorMessage("Please select a cancellation reason.");
            return;
        }
        const reason = selectedReason === "Other" ? textareaValue : selectedReason;
        try {
            const response = await API.patch("/cancel-fad-appointment", {
                appointmentId: appointmentId,
                status: "cancelled",
                cancelReason: reason,
            });

            if (response.status === 200) {
                handleSubmitClose('')
                setAppointmentCancelledShow(true)
                if (getCalenderWiseApps) {
                    await getCalenderWiseApps();
                } else{
                    await getOnlineAppointmentsListing()
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal className='submitModal' show={submitShow} onHide={handleSubmitClose} centered>
                <button onClick={handleSubmitClose} className="close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                    </svg>
                </button>
                <Modal.Body>
                    <h4>Please let us know why you want to cancel this appointment:</h4>
                    <Form.Group>
                        <Form.Check
                            type="radio"
                            id="personal_reasons"
                            label="Personal reasons"
                            name='cancel'
                            value="Personal reasons"
                            onChange={handleRadioChange}
                        />
                        <Form.Check
                            type="radio"
                            id="Scheduling_error"
                            label="Scheduling error"
                            name='cancel'
                            value="Scheduling error"
                            onChange={handleRadioChange}
                        />
                        <Form.Check
                            type="radio"
                            id="other"
                            label="Other"
                            name='cancel'
                            value="Other"
                            onChange={handleRadioChange}
                        />
                    </Form.Group>
                    {selectedReason === "Other" && (
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                value={textareaValue}
                                onChange={handleTextareaChange}
                            />
                        </Form.Group>
                    )}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <div className="btn_wrap">
                        <button className='button2' onClick={handleCancelButton}>Submit</button>
                    </div>
                </Modal.Body>
            </Modal>
            <AppointmentCancelledModal
                handleAppointmentCancelledClose={handleAppointmentCancelledClose}
                appointmentCancelledShow={appointmentCancelledShow}
                patientName={patientName}
            />
        </>
    )
}

export default SubmitModal