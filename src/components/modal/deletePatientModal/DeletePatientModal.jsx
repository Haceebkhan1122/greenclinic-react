import React from 'react'
import { Modal } from "react-bootstrap"
import Close from "../../../assets/images/svg/close_search.svg";
import "./deletePatientModal.scss"
import API from '../../../services/httpInstance';
import { useNavigate } from 'react-router-dom';

const DeletePatientModal = ({ handlePatientDeleteClose, patientDeleteShow,patientDelete,fetchAllPatientsListing,comingFromPatientProfile }) => {

    const navigate = useNavigate();

    const deletePatient = async () => {
     if(patientDelete){
        try {
            const response = await API.delete(`patient-delete/${patientDelete}`)
            if(response?.status == 200){
                if(comingFromPatientProfile == true){
                    handlePatientDeleteClose()
                    navigate('/patients')
                }
                else {
                    fetchAllPatientsListing()
                    handlePatientDeleteClose()
                }

            }
        } catch (error) {
            console.log(error)
        }
     }
    }

    return (
        <Modal className="deleteModal" show={patientDeleteShow} onHide={handlePatientDeleteClose} centered>
            <Modal.Body>
                <button className='close_btn' onClick={handlePatientDeleteClose}><img src={Close} alt="" /></button>
                <h4>Are you sure you want to delete this patient?</h4>
                <p>This includes Health Records, Invoices, Appointments, medical record, messages, etc. All data of the patient and its associated data will be removed and will be irrecoverable once deleted</p>
                <div className='button_wrap'>
                    <button onClick={deletePatient} className='button3' type='button' >
                        Yes 
                    </button>
                    <button className='button2' type='button' onClick={handlePatientDeleteClose}>
                        No
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeletePatientModal