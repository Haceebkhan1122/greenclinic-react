import React from 'react'
import { Modal, Accordion } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import "./medicalHistoryMobileModal.scss"

const MedicalHistoryMobileModal = ({ medicalHistoryMobileShow, handleMedicalHistoryMobileClose, medicalHistoryApi }) => {
    return (
        <Modal className='medicalHistoryMobile' show={medicalHistoryMobileShow} onHide={handleMedicalHistoryMobileClose}>
            <button onClick={handleMedicalHistoryMobileClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <h3><img src={ArrowBack} alt="" onClick={handleMedicalHistoryMobileClose} /> Medical History</h3>
                <div className="box">
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Indication</Accordion.Header>
                            <Accordion.Body>
                                {medicalHistoryApi[0]?.list?.map((item) => (
                                    <div className='card' key={item.id}>
                                        <span>{item?.date_web}</span>
                                        <p>{item?.title}</p>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Past Medical History</Accordion.Header>
                            <Accordion.Body>
                                {medicalHistoryApi[1]?.list?.map((item) => (
                                    <div className='card' key={item.id}>
                                        <span>{item?.date_web}</span>
                                        <p>{item?.title}</p>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Allergies</Accordion.Header>
                            <Accordion.Body>
                                {medicalHistoryApi[2]?.list?.map((item) => (
                                    <div className='card' key={item.id}>
                                        <span>{item?.date_web}</span>
                                        <p>{item?.title}</p>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Family History</Accordion.Header>
                            <Accordion.Body>
                                {medicalHistoryApi[3]?.list?.map((item) => (
                                    <div className='card' key={item.id}>
                                        <span>{item?.date_web}</span>
                                        <p>{item?.title}</p>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="4">
                            <Accordion.Header>Surgical History</Accordion.Header>
                            <Accordion.Body>
                                {medicalHistoryApi[4]?.list?.map((item) => (
                                    <div className='card' key={item.id}>
                                        <span>{item?.date_web}</span>
                                        <p>{item?.title}</p>
                                    </div>
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MedicalHistoryMobileModal