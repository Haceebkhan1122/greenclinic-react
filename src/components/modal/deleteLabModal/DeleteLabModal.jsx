import React, { useEffect, useState } from 'react'
import { Modal } from "react-bootstrap"
import "./deleteLabModal.scss"
import API from '../../../services/httpInstance'

const DeleteLabModal = ({ deleteLabshow, handleDeleteLabClose, singleEditItem, indicationMessage, setIndicationMessage, getLabTests }) => {
    const [labTestId, setLabTestId] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (singleEditItem) {
            setLabTestId(singleEditItem?.id)
        }
    }, [deleteLabshow])

    const handleDeleteFn = async () => {
        try {
            setIsLoading(true)
            const response = await API.delete(`/delete-lab-test?lab_test_id=${labTestId}`);
            if (response?.status == 200) {
                handleDeleteLabClose();
                getLabTests();
                setIsLoading(false)
                setTimeout(() => {
                    setIndicationMessage(response?.data?.message);
                }, 1000);
            }
            else {
                setIndicationMessage(response?.data?.message)
                setIsLoading(false)
            }
        } catch (error) {
            console.log("error in apii", error);
            setIsLoading(false)
        }
    }

    return (
        <Modal show={deleteLabshow} onHide={handleDeleteLabClose} centered className="modalDeleteLab">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleDeleteLabClose}></span>
                <h2> Are you sure you want to delete this lab test? </h2>
                <div className="wraper_btns">
                    <button className='button1' onClick={handleDeleteLabClose}> NO </button>
                    <button className='button2' onClick={handleDeleteFn}> YES </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteLabModal