import { useState } from "react";
import { Form, Modal, Row } from "react-bootstrap"
import './deletePrescModal.scss';
import API from "../../../services/httpInstance";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DeletePrescModal = ({ handleCloseDelete, showDelete }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    // get Delete API
    const deletePrescription = async () => {
        try {
            const response = await API.delete(`/del-pres/${id}`)
            if (response.status == 200) {
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
                handleCloseDelete(false)
                navigate("/prescriptions")
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Modal show={showDelete} onHide={handleCloseDelete} centered className="modalDeletePresc">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseDelete}></span>
                <h2> Are you sure you want to <br /> delete </h2>
                <div className="wraper_btns">
                    <button className="button2" onClick={deletePrescription}> YES </button>
                    <button className="button1" onClick={handleCloseDelete}> NO </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeletePrescModal
