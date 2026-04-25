import { Col, Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import './addMedicinesModal.scss';
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";

const AddMedicinesModal = ({ medicineShow, handleMedicineClose, vendorList, medicineListApi, indicationMessage, setIndicationMessage }) => {
    const [medicineName, setMedicineName] = useState('')
    const [medicineNameError, setMedicineNameError] = useState('')
    const [vendorError, setEendorError] = useState('')
    const [vendor, setVendor] = useState([]);
    
    const handleVendorData = (e) => {
        setVendor(e.target.value)
    }

    const addMedicines = async () => {
        let hasError = false;

        if (!medicineName) {
            setMedicineNameError("The title field is required")
            hasError = true;
        } else {
            setMedicineNameError("")
        }
        if (!vendor) {
            setEendorError("The vendor id field is required")
            hasError = true;
        } else {
            setEendorError("")
        }
        const payload = {
            title: medicineName,
            vendor_id: vendor,
        }
        try {
            const response = await API.post("/add-med", payload)
            if (response.status == 200) {
                setMedicineName('')
                setVendor('')
                setIndicationMessage(response?.data?.message)
                medicineListApi()
                handleMedicineClose(false)
                
            }
            else {
                setIndicationMessage(response?.data?.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Modal show={medicineShow} onHide={handleMedicineClose} centered className="modalAddMedicine">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleMedicineClose}></span>
                <h2> Add Medicine </h2>
                <Divider />
                <div className="single customInp">
                    <label htmlFor=""> Medicine Name* </label>
                    <input type="text" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} placeholder="Enter field name" />
                    {medicineNameError && (
                        <p style={{ color: 'red' }}>{medicineNameError}</p>
                    )}
                </div>
                <div className="single_field customSelect">
                    <label htmlFor=""> Vendor* </label>
                    <Form.Select name='vendor_id' onChange={handleVendorData} id="vendor_id" value={vendor}>
                        <option value="" disabled>Select vendor</option>
                        {vendorList?.map((item) => (
                            <option value={item.id} key={item.id}>{item?.name}</option>
                        ))}
                    </Form.Select>
                    {vendorError && (
                        <p style={{ color: 'red' }}>{vendorError}</p>
                    )}
                </div>
                {/* <Col lg={12}>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <div className="single customInp">
                                <label htmlFor=""> Power </label>
                                <input type="text" value={power} onChange={(e) => setPower(e.target.value)} placeholder="Enter power" />
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="single_field customSelect">
                                <label htmlFor=""> Unit </label>
                                <Form.Select id="siUnit" name="siUnit" value={siUnit}>
                                    {siUnitList?.map((item) => (
                                        <option value={item.id} key={item.id}>{item?.title}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Col>
                    </Row>
                </Col> */}
                {/* <div className="addMoreBtn" onClick={addMoreBtn}>
                    <span className="addMoreIcon"></span>
                    <h3> Add Variant </h3>
                </div>
                <div className="wraper_fielddsOptions">
                    {optionsMore.length !== 0 && optionsMore.map((item, index) => {
                        return (<>
                            <Col lg={12}>
                                <Row className="align-items-center">
                                    <Col lg={6}>
                                        <div className="single customInp">
                                            <label htmlFor=""> Power </label>
                                            <input type="text" value={power} onChange={(e) => setPower(e.target.value)} placeholder="Enter power" />
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="single_field customSelect">
                                            <label htmlFor=""> Unit </label>
                                            <Form.Select id="siUnit" name="siUnit" value={siUnit}>
                                                {siUnitList?.map((item) => (
                                                    <option value={item.id} key={item.id}>{item?.title}</option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <span className="crossOptionIcon" onClick={() => handleMedicineCloseOption(item, index)}></span>
                                </Row>
                            </Col>
                        </>)
                    })}
                </div> */}
            </Modal.Body>
            <Modal.Footer>
                <div className="wraper_btns">
                    <button onClick={handleMedicineClose}> CANCEL </button>
                    <button onClick={addMedicines}> SAVE </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AddMedicinesModal;
