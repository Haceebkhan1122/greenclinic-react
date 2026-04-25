import { useEffect, useRef, useState } from "react";
import { Accordion, Col, Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print';
import "./viewAppointmentInvoiceModal.scss"
import moment from "moment";


const ViewAppointmentInvoiceModal = ({ show, handleClose }) => {
const [filteredData, setFilteredData] = useState([])

    const handleSearch = (e) => {
        // const { value } = e.target;
        // let examData = [...examinationData?.examinations];
        // if (value !== "") {
        //     let lower = value.toLowerCase();
        //     let trimed = lower.replace(/\s/g, '');
        //     examData = examData.filter((item) => {
        //         return item?.name.toLowerCase().replace(/\s/g, '').includes(trimed);
        //     })
        // }
        // else {
        //     examData = [...examinationData?.examinations];
        // }
        // setFilteredData(examData);
    }

    const navigate = () => {
        handleClose();
    }

    let viewItem = [];


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

    return (
        <Modal show={show} onHide={handleClose} centered className="viewAppointmentInvoiceModal">
            <Modal.Body className="content_wraper" ref={componentRef}>
                <div className='heading' >
                    <button className='back' onClick={navigate}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                            <path d="M12.7383 5.09521L7.64286 10.1906L12.7383 15.2861" stroke="#0F75BC" stroke-width="1.69847" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <div className="tw-flex tw-flex-col">
                        <h4>Payout </h4>
                    </div>
                </div>
                <div className="bg__white_card">
                    <div className="search-bar">
                        <span className="search_icon"></span>
                        <input type="text" placeholder='Search for default fields' onChange={handleSearch} />
                    </div>
                    <div className='sd tw-w-full tw-flex tw-justify-between tw-items-center'>
                        <h6> Deduction Details </h6>
                        <button className="downloadBtnn"> 
                            <div className="downloadWrape">
                                <span className="downloadIcon"></span> 
                            </div>
                            DOWNLOAD  
                        </button>
                    </div>
                    <div className="raping tw-flex tw-gap-3">
                        <div className="tw-flex tw-gap-3 tw-items-center">
                            <span className="calenderIcoo"></span>
                            <h5 className="date"> 20/09/2023 </h5>
                        </div>
                        <h4> Transaction ID: <span> 123456 </span> </h4>
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
                    <Accordion defaultActiveKey="0" className="accordViewAppoint">
                        <Accordion.Item eventKey={0}>
                            <Accordion.Header>
                                <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                    <div className='accordHeader tw-flex tw-flex-col'>
                                        <h5> Appointment ID: <span> 123456 </span>  </h5>
                                        <p> 04/05/2023 </p>
                                    </div>
                                    <span className="priceAccord"> Rs. 1200 </span>
                                </div>
                            </Accordion.Header> 
                            <Accordion.Body>
                                <ul className='accordianListing'>
                                    <li className="tw-flex tw-w-full tw-justify-between tw-items-center">
                                        <p> Amount </p>
                                        <h4> Rs. </h4>
                                    </li>
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
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
        </Modal>
    )
}

export default ViewAppointmentInvoiceModal;