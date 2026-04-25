
import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { DatePicker } from 'antd';

import "./sammaryFilter.scss"
function SummryFilter({ summryfilterShow, handleSummryFilterShow, handleSummryFilterClose, handleDateChange }) {
    return (
        <div>
            <Modal handleDateChange={handleDateChange} show={summryfilterShow} onHide={handleSummryFilterClose} centered className="mobileFilterReportModal">
                <Modal.Body>
                    <span className="crossBtnModal" onClick={handleSummryFilterClose}></span>
                    <h2> <span className="filterIcoo"></span> Filter </h2>
                    <div className="wraper_add_modal">
                        <div className="wrape_cl">
                            <label htmlFor="openDate">Date</label>
                            <div className="wraper_dateExpense onlyyear">
                                <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true}
                                    allowClear={false} />

                            </div>

                            <Row className="d-none">
                                <Col cs={12}> <label htmlFor="openDate"> Date </label></Col>
                                <Col cs={6}>
                                    <div className="wraper_dateExpense">
                                        <span className='calenderIcon'> </span>
                                        <DatePicker id={"openDate"} placeholder="Select Start" name='dob' />
                                    </div>
                                </Col>
                                <Col cs={6}>
                                    <div className="wraper_dateExpense">
                                        <span className='calenderIcon'> </span>
                                        <DatePicker id={"openDate"} placeholder="Select End" name='dob' />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="wrape__radios">
                            <div className="single customRadioo">
                                <div className="wrapeInp">
                                    <input type="radio" id="Clear All" value={"clearAll"} name="status" />
                                    <span></span>
                                </div>
                                <label htmlFor="Clear All" className='mb-0'> Clear All </label>
                            </div>
                        </div>
                        <button className='saveBtn'  > Apply Filter </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default SummryFilter
