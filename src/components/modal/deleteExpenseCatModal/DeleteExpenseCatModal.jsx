import React, { useEffect, useState } from 'react'
import { Modal } from "react-bootstrap"
import "./deleteExpenseCatModal.scss"
import API from '../../../services/httpInstance'
import { toast } from 'react-toastify'

const DeleteExpenseCatModal = ({ deleteExpenseCatshow, handleDeleteExpenseCatClose, deleteId, getCategories }) => {
const [id, setId] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (deleteId) {
            setId(deleteId?.id)
        }
    }, [deleteExpenseCatshow])

    const handleDeleteFn = async () => {
            try {
                setIsLoading(true)
                const response = await API.delete(`/delete-expense-category?id=${id}`);
                if (response?.status == 200) {
                    handleDeleteExpenseCatClose();
                    getCategories();
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
        <Modal show={deleteExpenseCatshow} onHide={handleDeleteExpenseCatClose} centered className="modalExpenseCat">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleDeleteExpenseCatClose}></span>
                <h2> Are you sure you want to  <br />Delete this? </h2>
                <div className="wraper_btns">
                    <button className='button1' onClick={handleDeleteFn} > YES </button>
                    <button className='button2' onClick={handleDeleteExpenseCatClose}> NO </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteExpenseCatModal;