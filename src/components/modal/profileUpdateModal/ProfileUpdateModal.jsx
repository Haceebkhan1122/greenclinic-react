import React from 'react'
import { Modal } from "react-bootstrap"
import UndrawAuthentication from "../../../assets/images/png/undraw_authentication.png"
import "./profileUpdateModal.scss"

const ProfileUpdateModal = ({ profileUpdateShow, handleProfileUpdateClose }) => {
    return (
        <Modal className='profile-update' show={profileUpdateShow} onHide={handleProfileUpdateClose} centered>
            <Modal.Body>
                <img src={UndrawAuthentication} alt="" />
                <h4>Your profile has been submitted successfully!</h4>
                <p>Our team will verify your information to ensure authenticity. We will notify you once your profile is live.</p>
                <button className='button2'>Okay</button>
            </Modal.Body>
        </Modal>
    )
}

export default ProfileUpdateModal