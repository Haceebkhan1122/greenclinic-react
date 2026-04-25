import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print';
import "./viewpayoutInvoiceModal.scss"
import ViewAppointmentInvoiceModal from "../viewAppointmentInvoiceModal/ViewAppointmentInvoiceModal";


const ViewpayoutInvoiceModal = ({ addLabshow, handleAddLabClose, viewItem }) => {
    const [labTestTypesAll, setLabTestTypesAll] = useState([]);
    const [dataType, setDataType] = useState(null);
    const [fieldName, setFieldName] = useState("");

    const navigate = () => {
        handleAddLabClose();
    }

    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: 'Receipt',
        pageStyle: `
        @page {
            size: auto;
            margin: 10mm;
        }
        body {
            font-family: Arial, sans-serif;
        }
        `,
    });

    const [show, setShow] = useState(false)
    const [showItem, setShowItem] = useState(null)


    const handleShow = (item) => {
        setShowItem(item);
        setShow(true)
    }

    const handleClose = () => setShow(false);

    return (
        <Modal show={addLabshow} onHide={handleAddLabClose} centered className="viewpayoutInvoiceModal">
            <Modal.Body className="content_wraper" ref={componentRef}>
                <div className='heading' >
                    <button className='back' onClick={navigate}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M12.7383 5.09521L7.64286 10.1906L12.7383 15.2861" stroke="#0F75BC" stroke-width="1.69847" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <div className="tw-flex tw-flex-col">
                        <h4> {viewItem?.transaction_id || "ID"} | {viewItem?.transaction_date} </h4>
                        <p> {viewItem?.mr_nos} </p>
                    </div>
                </div>
                <div className="bankDeta tw-flex tw-justify-between tw-items-center tw-bg-[#FFFF] tw-gap-2">
                    <div className="tw-flex tw-flex-col">
                        <span className="toAcc"> To Account IBAN </span>
                        <h5 className="titleName"> Madeeha Asad</h5>
                        <h4 className="accNum"> 122019029304499911 </h4>
                    </div>
                    <div className="tw-flex tw-flex-col">
                        <span className="toAcc"> From Account IBAN </span>
                        <h5 className="titleName"> Madeeha Asad</h5>
                        <h4 className="accNum"> 122019029304499911 </h4>
                    </div>
                </div>
                <div className="wrape_cards_mobile_listing">
                    <div className="single__card_mobile" onClick={handleShow} >
                        <div className='left'>
                            <p> Appointment ID: 123456 (static) </p>
                            <h5> date need </h5>
                        </div>
                        <div className='rightt'>
                            <span className='priceCard'> Rs.1500 static </span>
                            <span className="iconDotArrow"></span>
                        </div>
                    </div>
                    <div className="wrape__btnn">
                        <div className="tw-p-3 tw-gap-1 tw-w-full tw-h-full tw-flex tw-flex-col">
                            <div className="singleee tw-flex tw-justify-between tw-items-center">
                                <span className="cashPa"> Amount </span>
                                <div className="wrape_pce"> Rs. 6000 </div>
                            </div>
                            <div className="singleee tw-flex tw-justify-between tw-items-center">
                                <span className="cashPa"> Deduction </span>
                                <div className="wrape_pce"> Rs. 6000 </div>
                            </div>
                            <div className="singleee tw-flex tw-justify-between tw-items-center">
                                <span className="cashPa"> Platform Fee </span>
                                <div className="wrape_pce"> Rs. 6000 </div>
                            </div>
                            <div className="singleee tw-flex tw-justify-between tw-items-center">
                                <span className="totall"> Total </span>
                                <div className="totallPrice"> Rs. 6000 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <ViewAppointmentInvoiceModal handleClose={handleClose} showItem={showItem} show={show} />
        </Modal>
    )
}

export default ViewpayoutInvoiceModal;