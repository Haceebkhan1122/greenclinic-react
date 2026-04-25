import React from 'react'
import "./prescriptionFilterModal.scss"
import {Modal, Row, Col, Form} from 'react-bootstrap'
import { DatePicker } from 'antd'

const PrescriptionFilterModal = ({handlPrescriptionFilterClose, doctors, handleDoctorId, prescriptionFilterShow, handleDateChange, prescriptionList}) => {
    const handleApplyFilter = () => {
        prescriptionList();
        handlPrescriptionFilterClose();
      };
  return (
    <Modal show={prescriptionFilterShow} onHide={handlPrescriptionFilterClose} centered className="mobileFilterReportModal">
    <Modal.Body>
        <span className="crossBtnModal" onClick={handlPrescriptionFilterClose}></span>
        <h2> <span className="filterIcoo"></span> Filter </h2>
        <div className="wraper_add_modal">
            <div className="wrape_cl">
                <Row>
                    <Col xs={12}>
                        <div className="custom_date_report">
                            <label htmlFor="openDate">Date</label>
                            <DatePicker name='dob' onChange={handleDateChange} />
                        </div>
                    </Col>

                    <Col xs={12}>

                        <div className="single_field customSelect">
                            <label htmlFor="openDate">Doctor</label>
                            <Form.Select onChange={handleDoctorId} aria-label="Default select example" name='dataType'>
                                <option value={""} disabled selected>Select Doctor</option>
                                {doctors?.map((item) => {
                                    return (<>
                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                    </>)
                                })}
                            </Form.Select>
                        </div>
                    </Col>
                </Row>
            </div>
            <button className='saveBtn' onClick={handleApplyFilter}> Apply Filter </button>
        </div>
    </Modal.Body>
</Modal>
  )
}

export default PrescriptionFilterModal