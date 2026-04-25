import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import "./logoutModal.scss";

const LogoutModal = ({ handleLogout, logoutShow, handleLogoutClose }) => {

    return (
        <Modal className='logoutModal' show={logoutShow} onHide={handleLogoutClose} centered>
            <Modal.Body>
                <Modal.Title>Confirm</Modal.Title>
                <p>Are you sure want to logout?</p>
                <div className='button'>
                    <Button variant="secondary" onClick={() => handleLogoutClose()}>
                        No
                    </Button>
                    <Button variant="primary" onClick={() => handleLogout()}>
                        Yes
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LogoutModal