import React, { useEffect, useState } from 'react'
import { Modal } from "react-bootstrap"
import "./deleteRoleModal.scss"
import API from '../../../services/httpInstance'

const DeleteRoleModal = ({ deleteLabShow, handleDeleteLabClose, singleEditItem, indicationMessage, setIndicationMessage, getRoleSettings, getRoleListing }) => {
    const [labTestId, setLabTestId] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (singleEditItem) {
            setLabTestId(singleEditItem?.id)
        }
    }, [deleteLabShow])

    useEffect(() => {
            let timeOut = setTimeout(() => {
                setIndicationMessage("");
            }, 2000);
    
            return (() => clearTimeout(timeOut));
        }, [indicationMessage])

    const handleDeleteFn = async () => {
        try {
            setIsLoading(true)
            const response = await API.delete(`/delete-role-setting?id=${labTestId}`);
            if (response?.status == 200) {
                handleDeleteLabClose();
                setIsLoading(false)
                setIndicationMessage(response?.data?.message);
                getRoleSettings()
                getRoleListing();
            }
            else {
                setIndicationMessage(response?.data?.message)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
        }
    }

    return (
        <Modal show={deleteLabShow} onHide={handleDeleteLabClose} centered className="modalDeleteLab">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleDeleteLabClose}></span>
                <h2> Are you sure you want to delete this Role? </h2>
                <div className="wraper_btns">
                    <button className='button1' onClick={handleDeleteLabClose}> NO </button>
                    <button className='button2' onClick={handleDeleteFn}> YES </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteRoleModal