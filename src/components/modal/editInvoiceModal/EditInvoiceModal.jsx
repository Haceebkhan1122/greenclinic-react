import React, { useState } from 'react'
import { Modal, Row, Col, Form } from "react-bootstrap"
import Close from "../../../assets/images/svg/close_search.svg";
import { Divider } from 'antd';
import AddIconMobile from "../../../assets/images/png/add-icon-mobile.png";
import "./editInvoiceModal.scss";

const EditInvoiceModal = ({ handleEditInvoiceClose, editInvoiceShow }) => {
    const [addProcedureMore, setAddProcedureMore] = useState([])
    const [countMore, setCountMore] = useState(0)
    const handleAddProcedure = () => {
        setCountMore(countMore + 1)
        setAddProcedureMore([...addProcedureMore, countMore + 1]);
    }
    return (
        <Modal className='editInovice' show={editInvoiceShow} onHide={handleEditInvoiceClose} centered>
            <Modal.Body>
                <button className='close' onClick={handleEditInvoiceClose}>
                    <img src={Close} alt="" />
                </button>
                <h4>Edit Invoice</h4>
                <Row>
                    <Col lg={7} className='pt-3'>
                        <Row>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Consultation Fees</Form.Label>
                                <Form.Control type="text" placeholder="Rs. 1,000" disabled />
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Discount in Rs</Form.Label>
                                <Form.Control type="text" placeholder="Rs." disabled />
                            </Form.Group>
                            <Col><Divider /></Col>
                            <Col lg="12">
                                <a href="javascript:void(0);" className='add_procedure' onClick={handleAddProcedure}><img src={AddIconMobile} alt="" />Add Procedure</a>
                            </Col>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Procedure</Form.Label>
                                <Form.Select aria-label="Default select example">
                                    <option>Select Procedure</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Select aria-label="Default select example">
                                    <option>Select Quantity</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <div className='d-flex tw-gap-6'>
                                    <div>
                                        <Form.Label>Amount</Form.Label>
                                        <Form.Control type="text" placeholder="Rs." />
                                    </div>
                                    <div>
                                        <Form.Label>Discount</Form.Label>
                                        <Form.Control type="text" placeholder="Rs." />
                                    </div>
                                </div>
                            </Form.Group>
                            {addProcedureMore?.map((item) => (
                                <>
                                    <Col lg={12}></Col>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Procedure</Form.Label>
                                        <Form.Select aria-label="Default select example">
                                            <option>Select Procedure</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Select aria-label="Default select example">
                                            <option>Select Quantity</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <div className='d-flex tw-gap-6'>
                                            <div>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control type="text" placeholder="Rs." />
                                            </div>
                                            <div>
                                                <Form.Label>Discount</Form.Label>
                                                <Form.Control type="text" placeholder="Rs." />
                                            </div>
                                        </div>
                                    </Form.Group>
                                </>
                            ))}
                        </Row>
                    </Col>
                    <Col lg={5}>
                        <div className="border-left py-3">
                            <Form.Group as={Col} md="12" className="mb-3">
                                <Form.Label>Total Amount Received</Form.Label>
                                <Form.Control type="text" placeholder="Rs." />
                            </Form.Group>
                            <Form.Group as={Col} md="12" className="mb-3">
                                <Form.Label>Mode of Payment</Form.Label>
                                <Form.Select aria-label="Default select example">
                                    <option value="1">Cash Payment</option>
                                    <option value="2">Credit Card</option>
                                    <option value="3">Debit Card</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="box-value">
                                <ul>
                                    <li><span>Subtotal</span> 1,000</li>
                                    <li><span>Discount</span> 0</li>
                                    <li><span>Grand Total</span> 1,000</li>
                                    <li><span>Remaining Amount</span> 1,000</li>
                                </ul>
                            </div>
                            <div className='button_wrap'>
                                <button onClick={handleEditInvoiceClose} className='button1'>Print</button>
                                <button className='button2'>Save</button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default EditInvoiceModal