import React from 'react'
import { Modal, Form, Row, Col } from 'react-bootstrap';
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import AddCircle from "../../../assets/images/svg/add_circle.svg"
import { Divider } from 'antd';
import "./groupMedicineModal.scss"

const GroupMedicineModal = ({ addGroup, handleGroupMedicineClose, handleAddMedicine, addMedicineMore }) => {
    return (
        <Modal className='group_medicine' show={addGroup} onHide={handleGroupMedicineClose}>
            <Modal.Header>
                <Modal.Title><button onClick={handleGroupMedicineClose}><img src={ArrowBack} alt="" /></button>Group Medicines</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="right_wrap">
                    <Row>
                        <Col lg={6}>
                            <div className="single">
                                <Form.Label htmlFor=""> Choose Medication* </Form.Label>
                                <Form.Select aria-label="Default select example" name='dataType'>
                                    <option selected="true" disabled="disabled">Search for medicine</option>
                                    <option value={2}>data demo</option>
                                    <option value={3}>data demo1</option>
                                </Form.Select>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <Form.Label for="duration">Duration*</Form.Label>
                            <Form.Group>
                                <div className="dropdown inline">
                                    <Form.Control type="text" placeholder='00' className="form-control" name="duration" id="duration" autocomplete="off" />
                                    <select id="duration_id" name="duration_id" required="">
                                        <option selected="true" disabled="disabled">Duration</option>
                                        <option value="3">mg</option>
                                        <option value="5">Ounce</option>
                                    </select>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <div className="single">
                                <div className='d-flex justify-content-between'>
                                    <Form.Label htmlFor=""> Instruction </Form.Label>
                                    <button className='custom'>Custom</button>
                                </div>
                                <Form.Control type="text" placeholder="" />
                            </div>
                        </Col>
                        <Col lg={6}>
                            <Form.Label for="dosage">Dosage*</Form.Label>
                            <Form.Group>
                                <div className="dropdown inline">
                                    <Form.Control type="text" placeholder='00' className="form-control" name="dosage" id="dosage" autocomplete="off" />
                                    <select id="dosage_id" name="dosage_id" required="">
                                        <option selected="true" disabled="disabled">Dosages</option>
                                        <option value="3">mg</option>
                                        <option value="5">Ounce</option>
                                    </select>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <div className="single">
                                <div className='d-flex justify-content-between'>
                                    <Form.Label htmlFor=""> Frequency </Form.Label>
                                    <button className='custom'>Custom</button>
                                </div>

                                <div className="custom-input">
                                    <div className="time">
                                        <Form.Label for="morning">Morning</Form.Label>
                                        <Form.Control type="number" className="form-control" id="morning" placeholder='00' />
                                    </div>
                                    <div className="time">
                                        <Form.Label for="afternoon">Afternoon</Form.Label>
                                        <Form.Control type="number" className="form-control" id="afternoon" placeholder='00' />
                                    </div>
                                    <div className="time">
                                        <Form.Label for="evening">Evening</Form.Label>
                                        <Form.Control type="number" className="form-control" id="evening" placeholder='00' />
                                    </div>
                                    <div className="time">
                                        <Form.Label for="night">Night</Form.Label>
                                        <Form.Control type="number" className="form-control" id="night" placeholder='00' />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className='add_group_medicine'>
                                <button onClick={handleAddMedicine}><img src={AddCircle} alt="" /> <span>Add Group Medicine</span></button>
                            </div>
                        </Col>
                    </Row>
                    {addMedicineMore?.map((item) => (
                        <div className='pt-3' key={item.id}>
                            <Divider />
                            <Row>
                                <Col lg={6}>
                                    <div className="single">
                                        <Form.Label htmlFor=""> Choose Medication* </Form.Label>
                                        <Form.Select aria-label="Default select example" name='dataType'>
                                            <option selected="true" disabled="disabled">Search for medicine</option>
                                            <option value={2}>data demo</option>
                                            <option value={3}>data demo1</option>
                                        </Form.Select>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <Form.Label for="duration">Duration*</Form.Label>
                                    <Form.Group>
                                        <div className="dropdown inline">
                                            <Form.Control type="text" className="form-control" name="duration" id="duration" autocomplete="off" />
                                            <select id="duration_id" name="duration_id" required="">
                                                <option selected="true" disabled="disabled">Duration</option>
                                                <option value="3">mg</option>
                                                <option value="5">Ounce</option>
                                            </select>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <div className="single">
                                        <div className='d-flex justify-content-between'>
                                            <Form.Label htmlFor=""> Instruction </Form.Label>
                                            <button className='custom'>Custom</button>
                                        </div>
                                        <Form.Control type="text" placeholder="" />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <Form.Label for="dosage">Dosage*</Form.Label>
                                    <Form.Group>
                                        <div className="dropdown inline">
                                            <Form.Control type="text" className="form-control" name="dosage" id="dosage" autocomplete="off" />
                                            <select id="dosage_id" name="dosage_id" required="">
                                                <option selected="true" disabled="disabled">Dosages</option>
                                                <option value="3">mg</option>
                                                <option value="5">Ounce</option>
                                            </select>
                                        </div>
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <div className="single">
                                        <div className='d-flex justify-content-between'>
                                            <Form.Label htmlFor=""> Frequency </Form.Label>
                                            <button className='custom'>Custom</button>
                                        </div>

                                        <div className="custom-input">
                                            <div className="time">
                                                <Form.Label for="morning">Morning</Form.Label>
                                                <Form.Control type="number" className="form-control" id="morning" />
                                            </div>
                                            <div className="time">
                                                <Form.Label for="afternoon">Afternoon</Form.Label>
                                                <Form.Control type="number" className="form-control" id="afternoon" />
                                            </div>
                                            <div className="time">
                                                <Form.Label for="evening">Evening</Form.Label>
                                                <Form.Control type="number" className="form-control" id="evening" />
                                            </div>
                                            <div className="time">
                                                <Form.Label for="night">Night</Form.Label>
                                                <Form.Control type="number" className="form-control" id="night" />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    ))}
                    <div className="form_btn box-fixed">
                        <button className='button2'>Save</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default GroupMedicineModal