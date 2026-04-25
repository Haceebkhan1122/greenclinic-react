import React from 'react'
import { Modal } from "react-bootstrap"
import Close from "../../../assets/images/svg/close_search.svg";
import "./deleteListModal.scss"
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';

const DeleteListModal = ({ generalDeleteModal, handleGeneralDeleteClose, setIndicationMessage, confirmId, getClinicAppointmentsListing }) => {

    const deleteAppointment = async () => {
        try {
            const response = await API.delete(`/delete-appt?appt_id=${confirmId}`)
            if (response?.status == 200) {
                setIndicationMessage(response?.data?.message)
              handleGeneralDeleteClose()
              getClinicAppointmentsListing()
            } else{
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  })
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong. Please try again later.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }
    return (
        <Modal className="deletelistModal" show={generalDeleteModal} onHide={handleGeneralDeleteClose}>
            <Modal.Body>
                <button className='close_btn' onClick={handleGeneralDeleteClose}><img src={Close} alt="" /></button>
                <h4>Are you sure you want to Delete?</h4>
                <p>The appointment will be considered as canceled</p>
                <div className='button_wrap'>
                    <button className='button1' type='button' onClick={handleGeneralDeleteClose}>
                        No
                    </button>
                    <button onClick={deleteAppointment} className='button2' type='button' >
                        Yes
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteListModal