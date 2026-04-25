import { Divider } from 'antd'
import { Col, Form, Row } from 'react-bootstrap';
import "./diagnosis.scss"

const Diagnosis = () => {
  return (
    <div className='diagnosis'>
      <Row>
        <Col lg={12}>
          <div className="single customCheck">
            <label htmlFor=""> Show Diagnosis </label>
            <Form.Check
              type="switch"
              id="custom-switch"
            />
          </div>
        </Col>
        <Col lg={12}>
          <h4>Diagnosis</h4>
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

export default Diagnosis;