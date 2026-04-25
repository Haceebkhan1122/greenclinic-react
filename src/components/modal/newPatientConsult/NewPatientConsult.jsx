import React from 'react'
import "./newPatientConsult.scss"
import { Modal } from "react-bootstrap"

const NewPatientConsult = ({handleNewPatientConsultClose, newPatientConsult, NoPateintSelected}) => {
    return (
        <Modal show={newPatientConsult} onHide={handleNewPatientConsultClose} centered className="newPtaientConsult">
            <Modal.Body>
                <h2> Confirm </h2>
                <p>Are you sure want to remove this patient? All information in this prescription will be lost</p>
                <div className="wraper_btns">
                    <button className="button1" onClick={handleNewPatientConsultClose}> NO </button>
                    <button className="button2" onClick={NoPateintSelected}> Yes </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default NewPatientConsult