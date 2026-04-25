import React from 'react'
import { Modal, Accordion } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import moment from 'moment';
import "./vitalPatientProfileModal.scss"

const VitalPatientProfileModal = ({ vitalPatientProfile, vitalPatientProfileClose, vitalsCurrentDate }) => {

    return (
        <Modal className='vitalPatientProfile' show={vitalPatientProfile} onHide={vitalPatientProfileClose}>
            <Modal.Body>
                <h2><img src={ArrowBack} alt="" onClick={vitalPatientProfileClose} /> Vitals</h2>
                <div className="wrapeAccords">
                    <Accordion defaultActiveKey="0">
                        {vitalsCurrentDate?.vitals?.map((vitals, index) => (
                            <Accordion.Item eventKey={index}>
                                <Accordion.Header>
                                    <div className='tw-flex tw-flex-col'>
                                        <div className='accordHeader tw-flex tw-items-center'>
                                            <h5> Vitals </h5>
                                            <span> | </span>
                                            <img src="https://images.pexels.com/photos/29718283/pexels-photo-29718283/free-photo-of-rustic-blue-wooden-door-with-metal-lock.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" />
                                            <span> Powered by Sehat Scan </span>
                                        </div>
                                        <p> {moment().format("MMM D, YYYY | h:mm A")}</p>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ul className='accordianListing'>
                                        {vitals?.Vitals?.map((items) => (
                                            <li>
                                                <p> {items?.vitals_key}</p>
                                                <h4>{items?.vitals_value} <span> bpm</span> </h4>
                                            </li>
                                        ))}
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default VitalPatientProfileModal