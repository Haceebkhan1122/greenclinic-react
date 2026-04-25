import React, { useState } from 'react'
import { Modal, Form, Row, Col } from 'react-bootstrap';
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import { DeleteOutlined } from '@ant-design/icons';
import "./medicineListModal.scss"

const MedicineListModal = ({ medicineList, handleMedicineListClose }) => {
    const [medicines, setMedicines] = useState([
        { id: 1, name: 'Lyta', dosage: '30mg', quantity: 10 },
        { id: 2, name: 'Vicodin', dosage: '25mg', quantity: 10 },
        { id: 3, name: 'Aspirin', dosage: '50mg', quantity: 20 },
    ]);
    const handleDelete = (id) => {
        const updatedMedicines = medicines.filter(item => item.id !== id);
        setMedicines(updatedMedicines);
    };
    return (
        <Modal className='medicine_list' show={medicineList} onHide={handleMedicineListClose}>
            <Modal.Header>
                <Modal.Title><button onClick={handleMedicineListClose}><img src={ArrowBack} alt="" /></button>COVID Regime</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="right_wrap">
                    <Row>
                        <Col lg={12}>
                            {medicines.length > 0 ? (
                                medicines.map((item) => (
                                    <div className="card" key={item?.id}>
                                        <div>
                                            <h5>{item.name}</h5>
                                            <p>{item?.dosage} - Twice daily</p>
                                            <p>Before meal (1 Day)</p>
                                        </div>
                                        <button onClick={() => handleDelete(item.id)}>
                                            <span className="delete"><DeleteOutlined /></span>
                                        </button>
                                    </div>
                                ))
                            ) : (<div className='no_medicine'>No Medinices</div>)}

                        </Col>
                    </Row>

                    <div className="form_btn box-fixed">
                        <button className='button1' onClick={() => setMedicines([])}>DELETE</button>
                        <button className='button2'>EDIT GROUP</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MedicineListModal