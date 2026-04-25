import React, { useEffect, useState } from 'react'
import { Modal } from "react-bootstrap"
import API from '../../../services/httpInstance'
import "./deleteExpenseModal.scss"
import { toast } from 'react-toastify'

const DeleteExpenseModal = ({ showDelete, handleDeleteClose, singleDeleteItem, getExpenses }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [id, setId] = useState(null)

    useEffect(() => {
        if (singleDeleteItem) {
            setId(singleDeleteItem?.id)
        }
    }, [showDelete])

    const handleDeleteFn = async () => {
        try {
            setIsLoading(true)
            const response = await API.delete(`/delete-expense?id=${id}`);
            if (response?.status == 200) {
                handleDeleteClose();
                getExpenses();
                setIsLoading(false)
                toast.success(response?.data?.message)
            }
            else {
                setIsLoading(false)
                toast.error(response?.data?.message)
            }
        } catch (error) {
            toast.error("error in deleting")
            setIsLoading(false)
        }
    }

    return (
        <Modal show={showDelete} onHide={handleDeleteClose} centered className="modalDeleteLab">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleDeleteClose}></span>
                <h2> Are you sure you want to delete this ? </h2>
                <div className="wraper_btns">
                    <button className='button1' onClick={handleDeleteClose}> NO </button>
                    <button className='button2' onClick={handleDeleteFn}> YES </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteExpenseModal;