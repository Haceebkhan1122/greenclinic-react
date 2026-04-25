import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Form, Container } from 'react-bootstrap'
import { Divider } from 'antd';
import "./addInvoiceModal.scss";

const AddInvoiceModal = ({ handleAddInvoiceClose,
    hanldeCloseInvoice,
    addInvoice,
    consultationFees,
    doctorProcedures,
    totalAmountReceivedError,
    doctorProceduresQuantity,
    consultationDiscount,
    setConsultationDiscount,
    totalAmountReceived,
    setTotalAmountReceived,
    setProcedureRows,
    procedureRows,
    setAppliedConsultationDiscount,
    appliedConsultationDiscount,
    setTotalAmount,
    totalAmount,
    setTotalDiscount,
    totalDiscount,
    setTotalValueBeforeDiscount,
    totalValueBeforeDiscount,
    getOnlineAppointmentsListing,
    setTotalConsultation,
    totalConsultation,
    setPaymentMethods,
    postBookAnAppointment }) => {
    const [optionsMore, setOptionsMore] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const total = procedureRows.reduce((sum, row) => {
            const hasValidDiscount = typeof row.finalDiscount === 'number' && !isNaN(row.finalDiscount);
            const value = hasValidDiscount ? row.finalDiscount : (row.calculatonValue || 0);
            return sum + value;
        }, 0);
        setTotalAmount(total);
    }, [procedureRows]);


    useEffect(() => {
        const totalBeforeDiscount = procedureRows.reduce((sum, row) => {
            return sum + (row.calculatonValue || 0);
        }, 0);

        setTotalValueBeforeDiscount(totalBeforeDiscount);
    }, [procedureRows]);

    useEffect(() => {
        const totalDisc = procedureRows.reduce((sum, row) => {
            const discount = row.finalDiscount !== '' ? row.calculatonValue - row.finalDiscount : 0;
            return sum + discount;
        }, 0);
        setTotalDiscount(totalDisc);
    }, [procedureRows]);

    const handlePaymentMethods = (e) => {
        const value = e.target.value;
        setPaymentMethods(value)
    }

    const addMoreBtn = () => {
        const newRow = {
            id: Date.now(), // Unique ID for the new row
            selectedProcedure: null,
            selectedQuantity: '',
            procedureAmount: '',
            discountProcedure: '',
            finalDiscount: '',
            calculatonValue: ''
        };
        setProcedureRows([...procedureRows, newRow]);
    };
    const handleMedicineCloseOption = (rowId) => {
        const updatedRows = procedureRows.filter(row => row.id !== rowId);
        setProcedureRows(updatedRows);
    };

    const handleProcedures = (selectedId, rowId) => {
        setProcedureRows(prevRows =>
            prevRows.map(row =>
                row.id == rowId
                    ? {
                        ...row,
                        selectedProcedure: selectedId,
                        procedureAmount: doctorProcedures.find(proc => proc.id == selectedId)?.price || '',
                        calculatonValue: doctorProcedures.find(proc => proc.id == selectedId)?.price || ''
                    }
                    : row
            )
        );
    };
    const handleProcedureCalculation = (quantity, rowId) => {
        setProcedureRows(prevRows =>
            prevRows.map(row =>
                row.id == rowId
                    ? {
                        ...row,
                        selectedQuantity: quantity,
                        calculatonValue: quantity * row.procedureAmount,
                        finalDiscount: '',
                        discountProcedure: ''
                    }
                    : row
            )
        );
    };

    const handleProcedureDiscount = (e, rowId) => {
        const value = e.target.value.replace(/[^0-9]/g, "").replace(/^0+(\d)/, "$1");
        const numericValue = Number(value);

        setProcedureRows(prevRows =>
            prevRows.map(row =>
                row.id === rowId
                    ? {
                        ...row,
                        discountProcedure: numericValue >= 100 ? "100" : value,
                        finalDiscount:
                            numericValue >= 100
                                ? 0
                                : row.calculatonValue - (row.calculatonValue * numericValue) / 100
                    }
                    : row
            )
        );
    };

    const handleConsultationDiscount = (e) => {
        const discountValue = e.target.value.replace(/[^0-9]/g, '');
        setTotalAmountReceived('')
        setConsultationDiscount(discountValue);

        if (discountValue > 100) {
            setConsultationDiscount('100');
            setTotalConsultation('0');
            setAppliedConsultationDiscount(consultationFees);
        } else {
            const discountAmount = (consultationFees * discountValue) / 100;
            const exampleFees = consultationFees - discountAmount;
            setTotalConsultation(exampleFees);
            setAppliedConsultationDiscount(discountAmount);
        }
    };


    const handleTotalAmountReceived = (e) => {
        let enteredAmount = Number(e.target.value.replace(/[^0-9]/g, ''));
        const sumOfTotal = totalAmount + totalConsultation;
        const grandTotal = Number(grandTotalAmount)
        const updatedRemainingAmount = grandTotal - enteredAmount;
        if (enteredAmount > grandTotal) {
            enteredAmount = grandTotal;
        }

        // Preserve sumOfTotal condition
        if (grandTotal && grandTotal < enteredAmount) {
            setTotalAmountReceived(grandTotal);
        } else {
            setTotalAmountReceived(enteredAmount);
        }
    };

    const subTotal = Number(totalValueBeforeDiscount) + Number(consultationFees);

    // Total discount including procedure and consultation discounts
    const grandDiscount = Number(totalDiscount) + Number(appliedConsultationDiscount);

    // Effective consultation fee (use `totalConsultation` if available, otherwise `consultationFees`)
    const effectiveConsultation = totalConsultation !== null ? Number(totalConsultation) : Number(consultationFees);
    const grandTotalAmount = Math.max(
        Number(totalAmount) + effectiveConsultation,
        0
    );
    const remainingAmount = grandTotalAmount - Number(totalAmountReceived);

    return (
        <Modal className='modal_appointment' show={addInvoice} onHide={handleAddInvoiceClose}>
            <button onClick={handleAddInvoiceClose} className="close d-none d-lg-block "  >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <h4>Invoice</h4>
                <Container>
                    <Row>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Consultation Fees</Form.Label>
                            <Form.Control value={consultationFees} type="text" disabled />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Discount in %</Form.Label>
                            <Form.Control onChange={(e) => handleConsultationDiscount(e)} maxLength={3} type="text" placeholder="%" value={consultationDiscount} />
                        </Form.Group>

                        <Col lg={12} className="mb-3">
                            <div className="addMoreBtn" onClick={addMoreBtn}>
                                <span className="addMoreIcon"></span>
                                <h3> Add Procedure </h3>
                            </div>
                        </Col>
                        <div className="wraper_fielddsOptions">
                            {procedureRows.map((row) => (
                                <Row key={row.id} className="mt-0 position-relative">
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Procedure</Form.Label>
                                        <Form.Select
                                            onChange={(e) => handleProcedures(e.target.value, row.id)}
                                            aria-label="Default select example"
                                        >
                                            <option>Select Procedure</option>
                                            {doctorProcedures?.map((procedure) => (
                                                <option key={procedure.id} value={procedure.id}>
                                                    {procedure.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Select
                                            onChange={(e) => handleProcedureCalculation(e.target.value, row.id)}
                                            aria-label="Default select example"
                                            value={row.selectedQuantity}
                                        >
                                            <option value="">Select Quantity</option>
                                            {doctorProceduresQuantity?.map((quantity) => (
                                                <option key={quantity} value={quantity}>
                                                    {quantity}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" className="mb-3">
                                        <div className="d-flex tw-gap-6">
                                            <div>
                                                <Form.Label>Amount</Form.Label>
                                                <Form.Control
                                                    value={row.finalDiscount !== '' ? row.finalDiscount : row.calculatonValue}
                                                    type="text"
                                                    placeholder="Rs"
                                                    readOnly
                                                />
                                            </div>
                                            <div>
                                                <Form.Label>Discount</Form.Label>
                                                <Form.Control
                                                    maxLength={3}
                                                    onChange={(e) => handleProcedureDiscount(e, row.id)}
                                                    value={row.discountProcedure}
                                                    type="text"
                                                    placeholder="Rs"
                                                />
                                            </div>
                                        </div>
                                    </Form.Group>
                                    {row.id !== 1 && (
                                        <span
                                            className="crossOptionIcon"
                                            onClick={() => handleMedicineCloseOption(row.id)}
                                        ></span>
                                    )}
                                </Row>
                            ))}
                        </div>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Total Amount Received</Form.Label>
                            <Form.Control onChange={(e) => handleTotalAmountReceived(e)} type="text" value={totalAmountReceived} />
                            {totalAmountReceivedError && (<p style={{ color: 'red', position: "absolute", fontSize: "12px" }}>{totalAmountReceivedError}</p>)}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Mode of Payment</Form.Label>
                            <Form.Select onChange={(e) => handlePaymentMethods(e)} aria-label="Default select example">
                                <option>Payment methods</option>
                                <option value="cash">cash</option>
                                <option value="bankTransfer">Bank transfer</option>
                                <option value="credit/debit">credit/debit card</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="col-lg-12">
                            <div className="box-value">
                                <ul>
                                    <li><span>Subtotal</span>{subTotal}</li>
                                    <li><span>Discount</span> {grandDiscount}</li>
                                    <li><span>Grand Total</span> {grandTotalAmount}</li>
                                    <li><span>Remaining Amount</span> {remainingAmount}</li>
                                </ul>
                            </div>
                        </div>
                    </Row>
                    <div className="btn_wrap ">
                        <button onClick={() => postBookAnAppointment('1')} className='button1'>Print</button>
                        <button onClick={() => postBookAnAppointment('0')} className='button2'>Save</button>
                    </div>
                </Container>
            </Modal.Body>
        </Modal>
    )
}

export default AddInvoiceModal