import React, { useEffect, useState } from 'react'
import { Modal } from "react-bootstrap"
import API from '../../../services/httpInstance'
import "./deleteMyRequestModal.scss"
import { toast } from 'react-toastify'

const DeleteMyRequestModal = ({ deleteRequest, handleCloseRequest, singleEditItem, getRequestLogs }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteFn = async () => {
        try {
            setIsLoading(true)
            const response = await API.delete(`/delete-lab-test?lab_test_id=${labTestId}`);
            if (response?.status == 200) {
                handleCloseRequest();
                getRequestLogs();
                setIsLoading(false)
                toast.success(response?.data?.message, {
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
            else {
                setIsLoading(false)
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
            setIsLoading(false)
            toast.error("error", {
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
    }

    return (
        <Modal show={deleteRequest} onHide={handleCloseRequest} centered className="deleteMyRequestModal">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseRequest}></span>
                <h2> Are you sure you want to delete this? </h2>
                <div className="wraper_btns">
                    <button className='button1' onClick={handleCloseRequest}> NO </button>
                    <button className='button2' onClick={handleDeleteFn}> YES </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteMyRequestModal