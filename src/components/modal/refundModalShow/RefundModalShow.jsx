import React from 'react'
import "./refundModalShow.scss";
import Close from "../../../assets/images/svg/close_search.svg";
import { Modal, Row, Col, Form } from 'react-bootstrap';

const RefundModalShow = ({ refundShow,
    handleRefundClose,
    setRefundAmount,
    refundAmount,
    setAmountReceived,
    amountReceived,
    setRefundReason,
    refundReason,
    RefundFunc,
    confirmId,
}) => {

    // const handleReceivedAMount = (e) => {
    //     const value = e.target.value;
    //     setAmountReceived(value);
    // };

    const handleRefundReason = (e) => {
        const value = e.target.value;
        setRefundReason(value);
    };

    const handleRefundAmount = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (!isNaN(value) && Number(value) > amountReceived) {
            value = amountReceived;
        }
        setRefundAmount(value);
    };

    return (
        <Modal className="refund" show={refundShow} centered onHide={handleRefundClose}>
            <Modal.Body>
                <button className='close' onClick={handleRefundClose}>
                    <img src={Close} alt="" />
                </button>
                <h4>Refund</h4>
                <Row>
                    <Form.Group as={Col} md={6} xs={6} className="mb-3">
                        <Form.Label>Refund Amount</Form.Label>
                        <Form.Control onChange={(e) => handleRefundAmount(e)} value={refundAmount} type="text" placeholder='Rs. 1000' className='mobField' />
                    </Form.Group>
                    <Form.Group as={Col} md={6} xs={6} className="mb-3">
                        <Form.Label>Amount Received</Form.Label>
                        <Form.Control readOnly value={amountReceived} type="text" />
                    </Form.Group>
                    <Form.Group as={Col} md={12} className="mb-3">
                        <Form.Label>Reason for refund</Form.Label>
                        <Form.Control onChange={(e) => handleRefundReason(e)} value={refundReason} as="textarea" placeholder='Enter reason' />
                    </Form.Group>
                </Row>
                <div className='button_wrap'>
                    <button className='button2' onClick={() => RefundFunc(confirmId)}>Save</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default RefundModalShow