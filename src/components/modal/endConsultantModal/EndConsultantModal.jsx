import React from 'react'
import "./endConsultantModal.scss"
import {Modal} from "react-bootstrap"

const EndConsultantModal = ({showEndedConsult, handleShowEndconsultantClose, handleOnlineSaveButton}) => {
    const handleMarkComplete = () => {
        handleOnlineSaveButton(); // Triggers save logic
        handleShowEndconsultantClose(); // Optional: close modal after save
      };
  return (
    <Modal show={showEndedConsult} onHide={handleShowEndconsultantClose} centered className="endConsultModal" backdrop="static">
                <Modal.Body>
                    <h2> Consultation Time Ended </h2>
                    <div className="wraper_btns tw-justify-center">
                        <button className="button2" onClick={handleMarkComplete}> Okay </button>
                    </div>
                </Modal.Body>
            </Modal>
  )
}

export default EndConsultantModal