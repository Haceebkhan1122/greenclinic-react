import React, { useEffect, useState } from 'react'
import './partialPaymentModal.scss'
import { Container, Form, Modal, Row, Col } from 'react-bootstrap'
import { Divider } from 'antd'
import API from '../../../services/httpInstance'
import { toast, ToastContainer } from 'react-toastify'

const PartialPaymentModal = ({ handlePartialPaymentClose, getInvoices, getClinicAppointmentsListing, getOnlineAppointmentsListing, partialPaymentShow, getCalenderWiseApps, partialPaymentId }) => {
    const [optionsMore, setOptionsMore] = useState([]);
    const [amountError, setAmountError] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState({});
    const [amountReceived, setAmountReceived] = useState('');
    const [paymentMethods, setPaymentMethods] = useState('');

    const handleTotalAmount = (e) => {
        setAmountError(false);
        let value = e.target.value;
        if (value === '') {
            setAmountReceived('');
            return;
        }
        if (!/^\d*$/.test(value)) return;
        let numericValue = Number(value);
        let maxAmount = paymentDetails?.remaining_amount || 0;
        if (numericValue <= maxAmount) {
            setAmountReceived(value);
        }
    };

    const handleBlur = () => {
        let numericValue = Number(amountReceived);
        let maxAmount = paymentDetails?.remaining_amount || 0;

        if (numericValue > maxAmount) {
            setAmountReceived(maxAmount.toString());
        }
    };

    const getPartialPaymentDetails = async () => {
        try {
            const response = await API.get(`/partial-payment/${partialPaymentId}`)
            if (response?.status == 200) {
                setPaymentDetails(response?.data?.data)
                setPaymentMethods(response?.data?.data?.payment_method?.replace(/\s/g, '').toLowerCase());
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePaymentMethods = (e) => {
        const value = e.target.value;
        setPaymentMethods(value)
    }

    useEffect(() => {
        if (partialPaymentId) {
            getPartialPaymentDetails()
        }
    }, [partialPaymentId])

    const postMorePartial = async (type) => {
        if (!amountReceived) {
            setAmountError(true);
            return;
        }
        setAmountError(false);
        const payload = {
            appointment_id: paymentDetails?.appointment_id,
            receive_amount: amountReceived,
        };

        try {
            const response = await API.post(`/partial-payment-received`, payload);
            if (response?.status == 200) {
                if (typeof getClinicAppointmentsListing === 'function') {
                    getClinicAppointmentsListing();
                    getInvoices()
                }

                if (typeof getOnlineAppointmentsListing === 'function') {
                    getOnlineAppointmentsListing();
                }
                if (getCalenderWiseApps) getCalenderWiseApps();
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                handlePartialPaymentClose();
                if (type == 1) {
                    const pdfUrl = response.data?.data?.file_path;
                    window.open(pdfUrl, "_blank");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal className='partial_payment' show={partialPaymentShow} onHide={handlePartialPaymentClose}>
            <button className="close d-none d-lg-block" onClick={handlePartialPaymentClose}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <h4>Partial Payment</h4>
                <Container>
                    <Row>
                        <Col lg={7} style={{ borderRight: "1px solid #ccc", paddingTop: "20px", paddingBottom: "20px" }}>
                            <Row>
                                <Form.Group as={Col} md="6" className="mb-3">
                                    <Form.Label>Consultation Fees</Form.Label>
                                    <Form.Control value={paymentDetails?.consultation_fees} type="text" disabled />
                                </Form.Group>
                                <Form.Group as={Col} md="6" className="mb-3">
                                    <Form.Label>Discount in Rs</Form.Label>
                                    <Form.Control disabled maxLength={3} type="text" placeholder="Rs." value={paymentDetails?.discount_in_percent} />
                                </Form.Group>
                            </Row>
                            <Divider />
                            <div className="wraper_fielddsOptions">
                                {paymentDetails?.procedure?.map((items) => (
                                    <Row className="mt-0">
                                        <Form.Group as={Col} md="6" className="mb-3">
                                            <Form.Label>Procedure</Form.Label>
                                            <Form.Select
                                                aria-label="Default select example"
                                                disabled
                                            >
                                                <option>{items?.name}</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" className="mb-3">
                                            <Form.Label>Quantity</Form.Label>
                                            <Form.Select
                                                aria-label="Default select example"
                                                disabled
                                            >
                                                <option value="">Select Quantity</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group as={Col} md="6" className="mb-3">
                                            <div className="d-flex tw-gap-6">
                                                <div>
                                                    <Form.Label>Amount</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={items?.amount}
                                                        placeholder="Rs"
                                                        readOnly
                                                    />
                                                </div>
                                                <div>
                                                    <Form.Label>Discount</Form.Label>
                                                    <Form.Control
                                                        maxLength={3}
                                                        type="text"
                                                        value={items?.discount}
                                                        placeholder="Rs"
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </Form.Group>
                                    </Row>
                                ))}
                            </div>
                        </Col>
                        <Col lg={5} style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                            <Form.Group as={Col} md="12" className="mb-3">
                                <Form.Label>Total Amount Received</Form.Label>
                                <Form.Control onBlur={handleBlur} onChange={(e) => handleTotalAmount(e)} type="text" value={amountReceived} />
                                {amountError && <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>Please enter an amount</div>}
                            </Form.Group>
                            <Form.Group as={Col} md="12" className="mb-3">
                                <Form.Label>Mode of Payment</Form.Label>
                                <Form.Select value={paymentMethods} disabled aria-label="Default select example">
                                    <option disabled>Payment methods</option>
                                    <option value="cash">Cash</option>
                                    <option value="banktransfer">Bank Transfer</option>
                                    <option value="credit">Credit</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="col-lg-12">
                                <div className="box-value">
                                    <ul>
                                        <li><span>Subtotal</span>{paymentDetails?.sub_total}</li>
                                        <li><span className='w-100'>Last Payment
                                            <ul>
                                                {paymentDetails?.last_payments?.map((item) => (
                                                    <li><span>{item?.date}</span> {item?.amount}</li>
                                                ))}
                                            </ul>
                                        </span>
                                        </li>
                                        <li><span>Remaining Amount</span> {paymentDetails?.remaining_amount}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="btn_wrap">
                                <button onClick={() => postMorePartial('1')} className='button1'>Print</button>
                                <button onClick={() => postMorePartial('0')} className='button2'>Save</button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <ToastContainer />
        </Modal>
    )
}

export default PartialPaymentModal