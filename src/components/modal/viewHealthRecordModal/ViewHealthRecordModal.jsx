import React from 'react'
import { Modal } from "react-bootstrap"

const ViewHealthRecordModal = ({ handleViewHealthClose, healthRecordsShow, healthView }) => {
  return (
    <Modal centered show={healthRecordsShow} onHide={handleViewHealthClose}>
        <Modal.Body>
            {healthView ? (
                <img 
                    src={healthView} 
                    alt="Health Record" 
                    style={{ maxWidth: '100%', height: 'auto', margin: "auto" }}
                />
            ) : (
                <p>No image available</p>
            )}
        </Modal.Body>
    </Modal>
  )
}

export default ViewHealthRecordModal