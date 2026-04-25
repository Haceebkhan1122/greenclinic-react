import { Divider } from 'antd'
import React from 'react'
import { Col, Form, Row } from 'react-bootstrap';
import "./labsReading.scss"

const LabsReading = () => {
    return (
        <div className='lab_reading'>
            <Row>
                <Col lg={12}>
                    <div className="single customCheck">
                        <label htmlFor=""> Show Lab Readings during consultation </label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                        />
                    </div>
                </Col>
                <Col lg={12}>
                    <h4>Lab Reading</h4>
                    <Divider />
                    <div className="card customCheck">
                        <div>
                            <p>1014</p>
                            <p>Blood Sugar</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                        />
                    </div>
                    <div className="card customCheck">
                        <div>
                            <p>HBA1c</p>
                            <p>Blood Sugar</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                        />
                    </div>
                    <div className="card customCheck">
                        <div>
                            <p>Platelets</p>
                            <p>Blood Sugar</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                        />
                    </div>
                    <div className="card customCheck">
                        <div>
                            <p>Platelets</p>
                            <p>Blood Sugar</p>
                        </div>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                        />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default LabsReading