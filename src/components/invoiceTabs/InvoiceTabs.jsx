import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Container } from "react-bootstrap"
import { Divider } from 'antd';
import "./invoiceTabs.scss";

const InvoiceTabs = ({ prefilledData,
  consultationFees,
  isDisabled,
  doctorProcedures,
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
  setTotalConsultation,
  totalConsultation,
  setPaymentMethods,
  postBookAnAppointment,
}) => {
  const [optionsMore, setOptionsMore] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (prefilledData) {

    }
  }, [prefilledData])

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
  const handleMedicineCloseOption = (val, i) => {
    let remove = optionsMore.filter((item) => item !== val)
    setCount((prev) => prev - 1)
    return setOptionsMore(remove);
  }

  const handleProcedures = (selectedId, rowId) => {
    const selectedProcedure = doctorProcedures.find(proc => proc.id == selectedId);

    setProcedureRows(prevRows =>
      prevRows.map(row =>
        row.id == rowId
          ? {
            ...row,
            selectedProcedure: selectedId,
            procedureAmount: selectedProcedure?.price || '',
            calculatonValue: selectedProcedure?.price || '',
            finalDiscount: '', // clear on procedure change
            discountProcedure: '', // clear on procedure change
            selectedQuantity: '', // clear quantity on procedure change
          }
          : row
      )
    );
    setTotalAmountReceived(0)
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

  const handleProcedureAmount = (e, rowId) => {
    const updatedAmount = e.target.value.replace(/[^0-9]/g, "");
    setProcedureRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? {
            ...row,
            calculatonValue: Number(updatedAmount),
            finalDiscount: '',
            discountProcedure: '',
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

  const handlePaymentMethods = (e) => {
    const value = e.target.value;
    setPaymentMethods(value)
  }

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

  // Grand total calculation (ensuring it doesn't go negative)
  const grandTotalAmount = Math.max(
    Number(totalAmount) + effectiveConsultation,
    0
  );
  // Remaining amount calculation (ensuring it doesn't go negative)
  const remainingAmount = grandTotalAmount - Number(totalAmountReceived);



  return (
    <Container>
      <div className="overflow_wrap">
        <Row>
          <Form.Group as={Col} md="6" className="mb-3">
            <Form.Label>Consultation Fees</Form.Label>
            <Form.Control value={consultationFees} type="text" disabled />
          </Form.Group>
          <Form.Group as={Col} md="6" className="mb-3">
            <Form.Label>Discount in %</Form.Label>
            <Form.Control onChange={(e) => handleConsultationDiscount(e)} maxLength={3} type="text" placeholder="%" value={consultationDiscount} />
          </Form.Group>
          <Col lg={12} className="mb-2">
            <div className="addMoreBtn mt-1" onClick={addMoreBtn}>
              <span className="addMoreIcon"></span>
              <h3> Add Procedure </h3>
            </div>
          </Col>
          <div className="wraper_fielddsOptions">
            {procedureRows.map((row) => (
              <Row key={row.id} className="mt-0">
                <Form.Group as={Col} md="6" className="mb-3">
                  <Form.Label>Procedure</Form.Label>
                  <Form.Select
                    onChange={(e) => handleProcedures(e.target.value, row.id)}
                    aria-label="Default select example"
                  >
                    <option disabled selected>Select Procedure</option>
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
                    value={row.selectedQuantity} // Use the row's state
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
                        onChange={(e) => handleProcedureAmount(e, row.id)}
                      />
                    </div>
                    <div>
                      <Form.Label>Discount</Form.Label>
                      <Form.Control
                        maxLength={3}
                        onChange={(e) => handleProcedureDiscount(e, row.id)}
                        value={row.discountProcedure} // Use the row's state
                        type="text"
                        placeholder="%"
                      />
                    </div>
                  </div>
                </Form.Group>
                {row.id !== 1 && ( // Only show the delete button for non-default rows
                  <span
                    className="crossOptionIcon"
                    onClick={() => handleMedicineCloseOption(row.id)} // Pass the row ID
                  ></span>
                )}
              </Row>
            ))}
          </div>
          <Form.Group as={Col} md="6" className="mb-3">
            <Form.Label>Total Amount Received</Form.Label>
            <Form.Control onChange={(e) => handleTotalAmountReceived(e)} type="text" placeholder='Rs.' value={totalAmountReceived} />
          </Form.Group>
          <Form.Group as={Col} md="6" className="mb-3">
            <Form.Label>Mode of Payment</Form.Label>
            <Form.Select onChange={(e) => handlePaymentMethods(e)} aria-label="Default select example">
              <option>Payment methods</option>
              <option value="cash">Cash</option>
              <option value="bankTransfer">Bank transfer</option>
              <option value="credit">Credit</option>
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
      </div>
      <Divider />
      <div className="btn_wrap">
        <button onClick={() => postBookAnAppointment('1')} disabled={isDisabled} className='button1 mobBtn'>Print</button>
        <button className='button1' disabled={isDisabled} onClick={() => postBookAnAppointment('0')}>Save</button>
        {/* <button className='button2'>Next</button> */}
      </div>
    </Container>
  )
}

export default InvoiceTabs