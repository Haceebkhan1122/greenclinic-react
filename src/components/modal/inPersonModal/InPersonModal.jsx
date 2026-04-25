import React from 'react'
import { Modal, Accordion } from 'react-bootstrap';
import ReminderMedical from "../../../assets/images/svg/reminder-medical.svg";
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import Cancel from "../../../assets/images/png/cancel_button.png";
import Schedule from "../../../assets/images/svg/schedule.svg";
import "./inPersonModal.scss"

const InPersonModal = ({ handleInPersonClose, inPersonShow }) => {

    return (
        <Modal className="in_person" show={inPersonShow} onHide={handleInPersonClose} centered>
            <button className='cancel' onClick={handleInPersonClose} aria-label="Close"><img src={Cancel} alt='cancel' /></button>
            <Modal.Header className='d-md-none'>
                <Modal.Title><button onClick={handleInPersonClose}><img src={ArrowBack} alt="" /></button>Dr. Maheen Afzal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='mx-md-5 mx-3'>
                    <h4 className='d-md-block d-none'>Dr. Maheen Afzal</h4>
                    <p><img src={ReminderMedical} alt="" /> In-person Consultation</p>
                </div>
                <div className='overflow_scroll'>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <div>
                                    <h5>Aga Khan University Hospital</h5>
                                    <span>15 mins</span>
                                </div>
                                <p>Rs.1500</p>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    <li>
                                        <img src={Schedule} alt="" />
                                        <div>
                                            <h6>Monday</h6>
                                            <p>10:00 AM - 12:00 PM</p>
                                            <p>10:00 AM - 12:00 PM</p>
                                        </div>
                                    </li>
                                    <li>
                                        <img src={Schedule} alt="" />
                                        <div>
                                            <h6>Tuesday</h6>
                                            <p>10:00 AM - 12:00 PM</p>
                                            <p>10:00 AM - 12:00 PM</p>
                                        </div>
                                    </li>
                                    <li>
                                        <img src={Schedule} alt="" />
                                        <div>
                                            <h6>Wednesday</h6>
                                            <p>10:00 AM - 12:00 PM</p>
                                            <p>10:00 AM - 12:00 PM</p>
                                        </div>
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>
                                <div>
                                    <h5>Aga Khan University Hospital</h5>
                                    <span>15 mins</span>
                                </div>
                                <p>Rs.1500</p>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ul>
                                    <li>
                                        <img src={Schedule} alt="" />
                                        <div>
                                            <h6>Monday</h6>
                                            <p>10:00 AM - 12:00 PM</p>
                                            <p>10:00 AM - 12:00 PM</p>
                                        </div>
                                    </li>
                                    <li>
                                        <img src={Schedule} alt="" />
                                        <div>
                                            <h6>Tuesday</h6>
                                            <p>10:00 AM - 12:00 PM</p>
                                            <p>10:00 AM - 12:00 PM</p>
                                        </div>
                                    </li>
                                    <li>
                                        <img src={Schedule} alt="" />
                                        <div>
                                            <h6>Wednesday</h6>
                                            <p>10:00 AM - 12:00 PM</p>
                                            <p>10:00 AM - 12:00 PM</p>
                                        </div>
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <div className='update'>
                    <button className='button1 d-none d-md-block'>Done</button>
                    <button className='button2'>Update</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default InPersonModal