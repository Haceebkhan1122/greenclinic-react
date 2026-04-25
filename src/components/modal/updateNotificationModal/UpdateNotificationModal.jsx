import React from 'react'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import { Link } from 'react-router-dom';
import {Modal} from 'react-bootstrap';
import './updateNotificationModal.scss';

const UpdateNotificationModal = ({ updateShow, handleUpdateclose }) => {
    return (
        <Modal className='updateModal' show={updateShow} onHide={handleUpdateclose}>
            <Modal.Header>
                <Modal.Title><img src={ArrowBack} alt=""  onClick={handleUpdateclose} /> Updates</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="updates">
                    <ul>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                        <li>
                            <Link to="/update-notification" onClick={handleUpdateclose}>
                                <div>
                                    <h5>New Expense feature</h5>
                                    <span>Aug 25, 2023</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
                                    <path d="M1.20996 1L8.20996 8L1.20996 15" stroke="#313131" stroke-opacity="0.7" stroke-width="1.3903" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateNotificationModal