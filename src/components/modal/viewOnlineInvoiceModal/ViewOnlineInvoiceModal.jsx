import { useEffect, useRef, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";
import "./viewOnlineInvoiceModal.scss"
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print';
import DeleteOnlineInvoiceModal from "../deleteOnlineInvoiceModal/DeleteOnlineInvoiceModal";
import DeleteOnlineInvoiceModalMobile from "../deleteOnlineInvoiceModalMobile/DeleteOnlineInvoiceModalMobile";


const ViewOnlineInvoiceModal = ({ addLabshow, handleAddLabClose, viewItem,currentPage, getOnlineInvoices }) => {
    const [deleteLabshowDel, setDeleteLabshowDel] = useState(false);

    const navigate = () => {
        handleAddLabClose();
    }

    const handleDeleteLabshow = () => {
        setDeleteLabshowDel(true);
    }

    const handleDeleteLabClose = () => setDeleteLabshowDel(false);



    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef : componentRef,
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

    return (
        <Modal show={addLabshow} onHide={handleAddLabClose} centered className="viewOnlineInvoiceModal">
            <Modal.Body className="content_wraper" ref={componentRef}>
                <div className='heading' >
                    <button className='back' onClick={navigate}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M12.7383 5.09521L7.64286 10.1906L12.7383 15.2861" stroke="#0F75BC" stroke-width="1.69847" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <div className="tw-flex tw-flex-col">
                        <h4>{viewItem?.patient_name} | {viewItem?.age} | {viewItem?.gender} </h4>
                        <p> {viewItem?.mr_nos} </p>
                    </div>
                    <span className="deleteIcon" onClick={()=> handleDeleteLabshow(viewItem)} ></span>
                </div>
                <div className="bg__white_card">
                    <div className="tw-flex tw-gap-3">
                        <div className="tw-flex tw-gap-3">
                            <span className="calenderIcoo"></span>
                            <h5 className="date"> {viewItem?.date} </h5>
                        </div>
                        <div className="tw-flex tw-gap-3">
                            <span className="timeIcoo"></span>
                            <h5 className="date"> {viewItem?.time} </h5>
                        </div>
                    </div>
                    <div className="tw-flex tw-flex-col">
                        <span className="consultPa"> Consulted by </span>
                        <div className="tw-flex tw-justify-between tw-items-center">
                            <span className="doctorName"> {viewItem?.doctor_name} </span>
                            <div className="wrape_logo">
                                <span className="meriSehatLogo"></span>
                                {viewItem?.appointment_type}
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div className="tw-flex tw-flex-col">
                        <span className="consultPa"> Payment Type </span>
                        <div className="tw-flex tw-justify-between tw-items-center">
                            <span className="cashPa"> {viewItem?.payment_mode} </span>
                            <div className="wrape_logo wrape_pce">
                                Rs.{viewItem?.amount_received}
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <sapn className="apppt">
                        Appt ID: need
                    </sapn>
                    <Divider />
                    <div className="tw-flex tw-justify-between">
                        <h4 className="total"> Total Amount </h4>
                        <span className="pricc"> Rs.{viewItem?.total_amount} </span>
                    </div>
                    <Divider />
                    <ul>
                        
                        <li className="tw-flex tw-items-center tw-justify-between">
                            <span> Consultation Fees </span>
                            <span className="pricc" > Rs.{viewItem?.invoice_item?.[0]?.item_amount} </span>
                        </li>
                        {viewItem?.invoice_item?.map((item) => {
                            return (<>
                                <li className="tw-flex tw-items-center tw-justify-between">
                                    <span> {item?.item_name} </span>
                                    <span className="pricc" > Rs.{item?.item_amount} </span>
                                </li>
                            </>)
                        })}
                    </ul>
                    <Divider />
                    <div className="amountReceived">
                        <h4>Amount Recieved</h4>
                        <h5> Rs. {viewItem?.amount_received} </h5>
                    </div>
                    <div className="tw-flex tw-gap-3 tw-justify-between tw-items-center tw-mb-3 tw-mt-3">
                        <span> Remaining Balance </span>
                        <span className="pricc"> Rs. {viewItem?.remaining_amount} </span>
                    </div>
                    <div className="tw-flex tw-gap-3 tw-justify-between tw-items-center tw-mb-1">
                        <span> Clinic Share </span>
                        <span className="pricc"> Rs. {viewItem?.clinic_share} </span>
                    </div>
                    <div className="tw-flex tw-gap-3 tw-justify-between tw-items-center tw-mb-1">
                        <span> Doctor Share </span>
                        <span className="pricc"> Rs. {viewItem?.doctor_share} </span>
                    </div>
                    <div className="wrape__btnn">
                        <button className="printBttn" onClick={handlePrint}> Print receipt </button>
                    </div>
                <Divider />
                </div> 
            </Modal.Body>
            <DeleteOnlineInvoiceModalMobile handleAddLabClose={handleAddLabClose} deleteLabshow={deleteLabshowDel} handleDeleteLabClose={handleDeleteLabClose} currentPage={currentPage} getOnlineInvoices={getOnlineInvoices} singleEditItem={viewItem} />
        </Modal>
    )
}

export default ViewOnlineInvoiceModal;