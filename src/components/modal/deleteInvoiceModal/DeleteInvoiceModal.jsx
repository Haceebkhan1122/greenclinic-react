import React from 'react'
import { Modal } from "react-bootstrap"
import Close from "../../../assets/images/svg/close_search.svg";
import "./deleteInvoiceModal.scss";

const DeleteInvoiceModal = ({ handleGeneralDeleteClose, generalDeleteModal,deleteInvoice,handleGeneralDeleteCloseUpdated,generalDeleteModalUpdated,appointmentId }) => {
    return (
        <Modal show={generalDeleteModalUpdated == "invoice" ? true : false} onHide={handleGeneralDeleteCloseUpdated} className="deleteInvoice" centered>
            <Modal.Body>
                <button className='close' onClick={handleGeneralDeleteCloseUpdated}>
                    <img src={Close} alt="" />
                </button>
                <h4>Are you sure you want to delete this Invoice?</h4>
                <div className='button_wrap'>
                    <button onClick={() => deleteInvoice(appointmentId)} className='button3'>Yes</button>
                    <button className='button2' onClick={handleGeneralDeleteCloseUpdated}>No</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteInvoiceModal;