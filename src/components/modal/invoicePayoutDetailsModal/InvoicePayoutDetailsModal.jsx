/* eslint-disable react/prop-types */
import { Col, Form, Modal, Row, Table } from "react-bootstrap"
import { Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './invoicePayoutDetailsModal.scss';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import API from "../../../services/httpInstance";

const InvoicePayoutDetailsModal = ({ invoicePayoutShow, setIsLoading, isLoading, receiptData, userId, handleClosePayout, currentPage, singleEditItem }) => {

    const downloadBtn = async () => {
        try {
            const response = await API.get(`/reports/payouts-details?id=${receiptData?.id}&type=${receiptData?.type}&doctor_id=${userId}&is_download=true`)
            if (response.status === 200) {
                const pdfUrl = response.data?.data;
                window.open(pdfUrl, "_blank");
            } else {
                toast.error("File URL not found", {
                    position: "top-center",
                    autoClose: 5000,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal show={invoicePayoutShow} onHide={handleClosePayout} centered className="invoicePayoutDetailsModal">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleClosePayout}></span>
                <div className="wrape_all_payoutModal">
                    <div className="headTitle">
                        <h2> {receiptData?.type} Details </h2>
                        <div className="btnDown tw-cursor-pointer" onClick={downloadBtn}>
                            <span></span>
                            <h5> DOWNLOAD  </h5>
                        </div>
                    </div>
                    <div className="listItemPay">
                        <div className="singleItemPay">
                            <span className="iconCalen"></span>
                            <span className="tw-pt-1 tw-pl-1">  {receiptData?.date} </span>
                        </div>
                        <div className="singleItemPay">
                            <h5>Transaction ID:</h5>
                            <span>   {receiptData?.transactionId}  </span>
                        </div>
                    </div>
                    <div className="detailsAccount">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>To Account/IBAN</th>
                                    <th>From Account/IBAN</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{receiptData?.response?.to_account_name}</td>
                                    <td>{receiptData?.response?.from_account_name}</td>
                                </tr>
                                <tr>
                                    <td>{receiptData?.response?.to_account_no}</td>
                                    <td>{receiptData?.response?.from_account_no}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="bottom__accords">
                        <Accordion defaultActiveKey="0">
                            {receiptData?.response?.data?.map((item) => {
                                return (<>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            <div className='tw-w-full tw-flex tw-items-center tw-justify-between'>
                                                <div className='tw-flex tw-flex-col tw-justify-center'>
                                                    <div className='accordHeader tw-flex tw-items-center tw-gap-1'>
                                                        <h5> Appointment ID: </h5>
                                                        <span> {item?.appointment_id} </span>
                                                    </div>
                                                    <span className="dateee"> {receiptData?.date} </span>
                                                </div>
                                                <span className="priceTex"> Rs.{item?.amount} </span>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ul className="amountsTotalsAccord">
                                                <li>
                                                    <span className="keyTitle"> Amount </span>
                                                    <h5> Rs. {item?.amount} </h5>
                                                </li>
                                                <li>
                                                    <h3 className="total"> Total </h3>
                                                    <p className="">
                                                        Rs.{receiptData?.response?.total_amount || 0}
                                                    </p>
                                                </li>
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </>)
                            })}
                        </Accordion>
                    </div>
                    <div className="bottom_bar_payout">
                        <ul className="amountsTotals">
                            <li>
                                <span className="keyTitle"> Amount </span>
                                <h5> Rs. {parseFloat(receiptData?.response?.data[0]?.amount)?.toFixed(2) || 0}</h5>
                            </li>
                            <li>
                                <span className="keyTitle"> Platform Fee </span>
                                <h5> Rs. {receiptData?.response?.platform_fee || 0}</h5>
                            </li>

                            <li>
                                <h3 className="total"> Total </h3>
                                <p className="totalPrice">
                                    PKR {receiptData?.response?.total_amount || 0}
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default InvoicePayoutDetailsModal;
