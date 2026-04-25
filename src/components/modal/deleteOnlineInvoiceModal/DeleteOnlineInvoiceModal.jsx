/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Modal } from "react-bootstrap"
import API from '../../../services/httpInstance'
import "./deleteOnlineInvoiceModal.scss"
import Loader from '../../loader/Loader'

const DeleteOnlineInvoiceModal = ({ deleteLabshow,  handleDeleteLabClose, getOnlineInvoices, currentPage, singleEditItem }) => {
    const [labTestId, setLabTestId] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [indicationMessage, setIndicationMessage] = useState("");


    useEffect(() => {
        if (singleEditItem) {
            setLabTestId(singleEditItem?.invoice_id)
        }
    }, [deleteLabshow])

    const handleDeleteFn = async () => {
        try {
            setIsLoading(true)
            const response = await API.delete(`/delete-patient-invoice/${labTestId}`);
            if (response?.status == 200) {
                handleDeleteLabClose();
                getOnlineInvoices(currentPage);
                setIsLoading(false)
                setIndicationMessage(response?.data?.message);
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


    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);
        return (() => clearTimeout(timeOut));
    }, [indicationMessage])


    return (
        <>
            {isLoading ?
                <Loader />
                :
                <Modal show={deleteLabshow} onHide={handleDeleteLabClose} centered className="modalDeleteLab">
                    {indicationMessage !== "" && <div className="showPoup">
                        {indicationMessage}
                    </div>}
                    <Modal.Body>
                        <span className="crossBtnModal" onClick={handleDeleteLabClose}></span>
                        <h2> Are you sure you want to delete this? </h2>
                        <div className="wraper_btns">
                            <button className='button1' onClick={handleDeleteLabClose}> NO </button>
                            <button className='button2' onClick={handleDeleteFn}> YES </button>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default DeleteOnlineInvoiceModal