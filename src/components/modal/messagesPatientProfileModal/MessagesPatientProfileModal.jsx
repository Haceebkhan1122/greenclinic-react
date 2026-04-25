import React from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png"
import "./messagesPatientProfileModal.scss"

const MessagesPatientProfileModal = ({ messagesPatientProfile, messagesPatientProfileClose, messages }) => {
    return (
        <Modal className='messagesPatientProfile' show={messagesPatientProfile} onHide={messagesPatientProfileClose}>
            <Modal.Body>
                <h2><img src={ArrowBack} alt="" onClick={messagesPatientProfileClose} />Message</h2>
                <Row>
                    {messages?.map((item) => (
                        <Col xs={12} key={item?.id}>
                            <div className="card">
                                <div className="timer">
                                    <p>{item?.date}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M12.7037 3.80012C12.8707 3.80012 13.0308 3.86334 13.1489 3.97586C13.267 4.08838 13.3333 4.24099 13.3333 4.40012C13.3333 4.55925 13.267 4.71186 13.1489 4.82439C13.0308 4.93691 12.8707 5.00012 12.7037 5.00012H12.0741L12.0722 5.04272L11.4847 12.8853C11.4621 13.1881 11.32 13.4714 11.0869 13.6783C10.8538 13.8851 10.5471 14.0001 10.2286 14.0001H5.10407C4.78557 14.0001 4.47889 13.8851 4.24582 13.6783C4.01274 13.4714 3.87058 13.1881 3.84796 12.8853L3.26052 5.04332C3.25956 5.02894 3.25914 5.01453 3.25926 5.00012H2.62963C2.46264 5.00012 2.30249 4.93691 2.18441 4.82439C2.06634 4.71186 2 4.55925 2 4.40012C2 4.24099 2.06634 4.08838 2.18441 3.97586C2.30249 3.86334 2.46264 3.80012 2.62963 3.80012H12.7037ZM10.8129 5.00012H4.52041L5.1047 12.8001H10.2286L10.8129 5.00012ZM8.92593 2.00012C9.09291 2.00012 9.25306 2.06334 9.37114 2.17586C9.48922 2.28838 9.55556 2.44099 9.55556 2.60012C9.55556 2.75925 9.48922 2.91186 9.37114 3.02439C9.25306 3.13691 9.09291 3.20012 8.92593 3.20012H6.40741C6.24042 3.20012 6.08027 3.13691 5.96219 3.02439C5.84411 2.91186 5.77778 2.75925 5.77778 2.60012C5.77778 2.44099 5.84411 2.28838 5.96219 2.17586C6.08027 2.06334 6.24042 2.00012 6.40741 2.00012H8.92593Z" fill="#FC5C5C" />
                                    </svg>
                                </div>
                                <h4>{item?.message}</h4>
                            </div>
                        </Col>
                    ))}
                </Row>
                <div className="box-fixed">
                    <button className='button2'>Add Health Record</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MessagesPatientProfileModal