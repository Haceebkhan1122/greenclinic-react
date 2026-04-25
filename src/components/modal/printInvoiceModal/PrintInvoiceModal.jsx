import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import CancelButton from "../../../assets/images/png/cancel_button.png"
import "./printInvoiceModal.scss"
import API from '../../../services/httpInstance'

const PrintInvoiceModal = ({ handleInvoiceClose, invoiceShow, prescriptionDownloadInvoice }) => {
    const [invoicePrint, setInvoicePrint] = useState(null)

    const getPrescriptionPrint = async () => {
        try {
            const response = await API.get("/get-clinic-selected-invoice")
            if (response.status == 200) {
                setInvoicePrint(response?.data?.data[0])
            }
        } catch (error) {
            consolelog(error)
        }
    }
    useEffect(() => {
        getPrescriptionPrint()
    }, {})
    return (
        <Modal className='printInovice' show={invoiceShow} onHide={handleInvoiceClose} centered>
            <button className='close' onClick={handleInvoiceClose}><img src={CancelButton} alt="" /></button>
            <Modal.Body>
                <img src={invoicePrint?.thumbnail} alt="InvoiceTemplate" />
                <div className='text-center'>
                    <button className='button2' onClick={prescriptionDownloadInvoice}>PRINT</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PrintInvoiceModal