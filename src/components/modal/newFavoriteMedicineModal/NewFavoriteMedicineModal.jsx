import React from 'react'
import { Modal, Form, Row, Col } from 'react-bootstrap';
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import "./newFavoriteMedicineModal.scss"
import { Select } from 'antd';
import { useMediaQuery } from '@mui/material'

const NewFavoriteMedicineModal = ({
    handleMedicineClose,
    addMedicine,
    frequency_title,
    mealId,
    handleChangeFrequency,
    favoriteInstruction,
    handleChangeMeal,
    medicineId,
    handlePopupScroll,
    handleChangeMedicineId,
    duration_id,
    dosage_id,
    handleChangeDurationId,
    handleChangeDuration,
    favoriteDosage,
    duration,
    favoriteDuration,
    medicinesList,
    handleChangeDosageId,
    handleChangeDosage,
    dosage,
    favoriteFrequency,
    addFavoriteMedicine
}) => {
    const isMobile = useMediaQuery('(max-width:767px)');

    const { Option } = Select;

    return (
        <Modal className='new_medicine' show={addMedicine} onHide={handleMedicineClose}>
            <Modal.Header>
                <Modal.Title><button onClick={handleMedicineClose}><img src={ArrowBack} alt="" /></button>
                    {isMobile ? " Favourite  Medication" : " New Medication"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="right_wrap">
                    <Row>
                        <Col lg={6}>
                            <div className="single">
                                <Form.Label htmlFor=""> Choose Medication* </Form.Label>
                                <Select
                                    showSearch
                                    className='form-select'
                                    placeholder="Select Medicines"
                                    value={medicineId}
                                    onChange={handleChangeMedicineId}
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    filterOption={(input, option) =>
                                        option?.children?.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {medicinesList?.map((item) => (
                                        <Option value={item?.id} key={item?.id}>
                                            {item?.title}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <Form.Label for="duration">Duration*</Form.Label>
                            <Form.Group>
                                <div className="dropdown inline">
                                    <Form.Control type="number" placeholder='00' maxLength="3" className="form-control" name="duration" id="duration" onChange={handleChangeDuration} value={duration} autoComplete="off" />
                                    <Select
                                        id="duration_id"
                                        name="duration_id"
                                        placeholder="Select the Duration"
                                        className="form-select"
                                        value={duration_id}
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        onChange={handleChangeDurationId}
                                    >
                                        {favoriteDuration?.map((item) => (
                                            <Option key={item?.id} value={item?.id}>
                                                {item?.title}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <div className="single">
                                <div className='d-flex justify-content-between'>
                                    <Form.Label htmlFor=""> Instruction </Form.Label>
                                    <button className='custom'>Custom</button>
                                </div>
                                {/* <Form.Control type="text" placeholder="" /> */}
                                <Select
                                    id="instruction_id"
                                    name="instruction_id"
                                    placeholder="Select the Instruction"
                                    className="form-select"
                                    value={mealId}
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    onChange={handleChangeMeal}
                                >
                                    {favoriteInstruction?.map((item) => (
                                        <Option value={item?.id} key={item?.id}>
                                            {item?.title}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <Form.Label for="dosage">Dosage*</Form.Label>
                            <Form.Group>
                                <div className="dropdown inline">
                                    <Form.Control type="text" placeholder='00' maxLength="7" className="form-control" value={dosage} onChange={handleChangeDosage} name="dosage" id="dosage" autoComplete="off" />
                                    <Select
                                        id="dosage_id"
                                        name="dosage_id"
                                        placeholder="Select the Dosage"
                                        className="form-select"
                                        value={dosage_id}
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}

                                        onChange={handleChangeDosageId}
                                    >
                                        {favoriteDosage?.map((item) => (
                                            <Option key={item?.id} value={item?.id}>
                                                {item?.title}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col lg={6}>
                            <div className="single">
                                <div className='d-flex justify-content-between'>
                                    <Form.Label htmlFor=""> Frequency </Form.Label>
                                    <button className='custom'>Custom</button>
                                </div>
                                <Select
                                    id="frequency_id"
                                    name="frequency_id"
                                    placeholder="Select the Frequency"
                                    className="form-select"
                                    value={frequency_title}
                                    onPopupScroll={handlePopupScroll}
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    onChange={handleChangeFrequency}
                                >
                                    {favoriteFrequency?.map((item) => (
                                        <Option key={item?.id} value={item?.id}>
                                            {item?.title}
                                        </Option>
                                    ))}
                                </Select>

                                {/* <div className="custom-input">
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
                                </div> */}
                            </div>
                        </Col>
                    </Row>
                    <div className="form_btn box-fixed">
                        <button className='button2' onClick={addFavoriteMedicine}>Save</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default NewFavoriteMedicineModal