import React from 'react'
import { Modal } from "react-bootstrap"
import Close from "../../../assets/images/svg/close_search.svg";
import "./deleteHealthRecordModal.scss"

const DeleteHealthRecordModal = ({ handleGeneralDeleteClose, generalDeleteModal, appointmentId,deleteHealthRecords }) => {

  return (
    <Modal className='deleteHealthRecord' show={generalDeleteModal} onHide={handleGeneralDeleteClose} centered>
      <Modal.Body>
        <button className='close' onClick={handleGeneralDeleteClose}>
          <img src={Close} alt="" />
        </button>
        <h4>Are you sure you want to delete this Health Record?</h4>
        <div className='button_wrap'>
          <button onClick={() => deleteHealthRecords(appointmentId)} className='button3'>Yes</button>
          <button className='button2' onClick={handleGeneralDeleteClose}>No</button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteHealthRecordModal