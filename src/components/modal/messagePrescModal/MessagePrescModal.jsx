import { Form, Modal, Row } from "react-bootstrap"
import './messagePrescModal.scss';
import API from "../../../services/httpInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MessagePrescModal = ({ handleCloseMessage, showMessage, prescriptionProfile, clinicId, patientId, doctorId, number, prescriptionId, removeEmail }) => {
    const [sendingMode, setSendingMode] = useState("")
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("")
    const sendSms = [
        {
            id: "1",
            value: "sms",
            label: "Send via SMS",
        },
        {
            id: "2",
            value: "whatsapp",
            label: "Send via WhatsApp",
        },
        {
            id: "3",
            value: "Email",
            label: "Send via Email",
        },
    ]

    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    // get SMS API
    const sendSMSMessage = async () => {
        if (!sendingMode) {
            return;
        }
        if (sendingMode === "Email" && !isValidEmail(email)) {
            setEmailError("Please provide an email address.");
            return;
        } else {
            setEmailError(""); // Clear error if email is provided
        }
        const payload = {
            sending_mode: sendingMode,
            clinic_id: clinicId,
            prescription_id: prescriptionId,
            patient_id: patientId,
            doctor_id: doctorId,
            number: number,
        }
        try {
            const response = await API.post("/send-sms-pres", payload);
            if (response.status == 200) {
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                handleCloseMessage(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSendSms = (e) => {
        const mode = e.target.value;
        setSendingMode(mode); // Update sendingMode
        localStorage.setItem('sendingMode', mode); // Store the selected mode in localStorage
    };

    useEffect(() => {
        if (showMessage) {
            const savedSendingMode = localStorage.getItem('sendingMode');
            if (savedSendingMode) {
                setSendingMode(savedSendingMode);
            }
        }
    }, [showMessage]);
    return (
        <Modal show={showMessage} onHide={handleCloseMessage} centered className="messagePrescModal">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseMessage}></span>
                <h2> Send Message </h2>
                <div className="single customInp">
                    <label htmlFor=""> Number </label>
                    <input type="text" readOnly disabled value={prescriptionProfile?.patient?.phone || number} />
                </div>
                {removeEmail && (
                    <div className="single customInp">
                        <label htmlFor=""> Email </label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={sendingMode === "sms" || sendingMode === "whatsapp"} placeholder="ahmed.khan@gmail.com" />
                        {emailError && <span style={{color: "red", fontSize: "12px"}} >{emailError}</span>}
                    </div>
                )}
                <h5> Are you sure want to send this prescription to the patient? </h5>
                {sendSms.map((item) => (
                    <div className="singleTick customTickCheck">
                        <label htmlFor="sms">
                            <input type="radio" id={item?.id} onChange={handleSendSms} name="send" value={item?.value} checked={sendingMode === item?.value} />
                            <span></span>
                            {item?.label}
                        </label>
                    </div>
                ))}
                <div className="wraper_btns">
                    <button onClick={handleCloseMessage}> CANCEL </button>
                    <button onClick={sendSMSMessage}> SEND </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MessagePrescModal
