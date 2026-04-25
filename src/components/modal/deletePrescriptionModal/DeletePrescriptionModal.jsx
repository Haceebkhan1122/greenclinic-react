import React from 'react'
import { Modal } from "react-bootstrap"
import Close from "../../../assets/images/svg/close_search.svg";
import "./deletePrescriptionModal.scss";

const DeletePrescriptionModal = ({handleGeneralDeleteClose, deletePrescription,appointmentId,generalDeleteModal}) => {
    return (
        <Modal show={generalDeleteModal} onHide={handleGeneralDeleteClose} className="deletePrescription" centered>
            <Modal.Body>
                <button className='close' onClick={handleGeneralDeleteClose}>
                    <img src={Close} alt="" />
                </button>
                <h4>Are you sure you want to delete this Prescription?</h4>
                <div className='button_wrap'>
                    <button onClick={() => deletePrescription(appointmentId)} className='button3'>Yes</button>
                    <button className='button2' onClick={handleGeneralDeleteClose}>No</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeletePrescriptionModal