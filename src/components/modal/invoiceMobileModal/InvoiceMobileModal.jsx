import React from 'react'
import { Modal } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import "./invoiceMobileModal.scss"

const InvoiceMobileModal = ({ invoiceMobileShow, handleInvoiceMobileClose, invoiceApi, prescriptionDownloadInvoice }) => {
    return (
        <Modal className="invoiceMobileModal" show={invoiceMobileShow} onHide={handleInvoiceMobileClose}>
            <button onClick={handleInvoiceMobileClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <h2><img src={ArrowBack} alt="" onClick={handleInvoiceMobileClose} /> Invoice</h2>
                <div className="box">
                    <ul className='listInvoice'>
                        <li>
                            <span> Amount </span>
                            <span>Rs. {invoiceApi?.amount} </span>
                        </li>
                        <li>
                            <span> Total Discount </span>
                            <span>Rs. {invoiceApi?.total_discount} </span>
                        </li>
                        <li>
                            <span> Total Amount </span>
                            <span>Rs. {invoiceApi?.total_amount} </span>
                        </li>
                        <li>
                            <span> Amount Paid </span>
                            <span>Rs. {invoiceApi?.paid_amount} </span>
                        </li>
                        <li>
                            <span> Remaining Balance </span>
                            <span>Rs. {invoiceApi?.remaining_amount} </span>
                        </li>
                    </ul>
                </div>
                <div>
                    <button onClick={prescriptionDownloadInvoice}>Print</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default InvoiceMobileModal