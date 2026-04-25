import React from 'react'
import { Modal } from "react-bootstrap"
import Close from "../../../assets/images/svg/close_search.svg";
import "./deletePrescriptionsModal.scss"
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';

const DeletePrescriptionsModal = ({ handlePrescriptionsDeleteClose, prescriptionsDeleteShow, prescriptionsDelete, prescriptionList }) => {

    const handleDeletePrescription = async () => {
        if (prescriptionsDelete) {
            try {
                const response = await API?.delete(`/del-pres/${prescriptionsDelete}`)
                if (response.status == 200) {
                    prescriptionList()
                    toast.success(response?.data?.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    })
                    handlePrescriptionsDeleteClose(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    return (
        <Modal className="deleteModal" show={prescriptionsDeleteShow} onHide={handlePrescriptionsDeleteClose} centered>
            <Modal.Body>
                <button className='close_btn' onClick={handlePrescriptionsDeleteClose}><img src={Close} alt="" /></button>
                <h4>Are you sure you want to Delete?</h4>
                <div className='button_wrap'>
                    <button onClick={handleDeletePrescription} className='button2' type='button' >
                        Yes
                    </button>
                    <button className='button1' type='button' onClick={handlePrescriptionsDeleteClose}>
                        No
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeletePrescriptionsModal