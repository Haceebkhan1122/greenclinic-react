import React, { useEffect, useState } from 'react'
import './prescriptionSettings.scss'
import { Col, Container, Row, Form, Table, Tab, Tabs } from 'react-bootstrap'
import { Divider } from 'antd';
import { isMobile } from 'react-device-detect';
import LabsReading from '../../labsReading/LabsReading';
import Diagnosis from '../../diagnosis/Diagnosis';
import API from '../../../services/httpInstance';
import Loader from '../../loader/Loader';
import { toast } from 'react-toastify';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const PrescriptionSettings = () => {
  const [prescriptionData, setPrescriptionData] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [indicationMessage, setIndicationMessage] = useState("");
  const [statusVal, setStatusVal] = useState(null)
  const [showDiagnosis, setShowDiagnosis] = useState(null)
  const [showLab, setShowLab] = useState(null);


  useEffect(() => {
    getPrescriptions();
  }, []);

useEffect(() => {
  if(prescriptionData) {
    setShowDiagnosis(prescriptionData?.showDiagonis?.status)
    setShowLab(prescriptionData?.showlab?.status)
  }
}, [prescriptionData])

useEffect(() => {
  if(prescriptionData?.length) {
    setShowDiagnosis(prescriptionData?.showDiagonis?.status)
    setShowLab(prescriptionData?.showlab?.status)
  }
}, [])


  const getPrescriptions = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/prescription`);
      if (response?.status == 200) {
        setPrescriptionData(response?.data?.data);
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  const handleCheckChangeLab = async (e, item) => {
    const { value, checked } = e.target;
    if (checked) {
      setStatusVal(1);
      setIsLoading(true)
      const response = await API.post('/show-lab-custom', {
        id : item?.id,
        status: "1",
      })
      if (response?.status == 200) {
        setIsLoading(false);
        getPrescriptions();
        toast.success(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
      else {
        setIsLoading(false);
        toast.error(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
    }
    else {
      setStatusVal(0);
      const response = await API.post('/show-lab-custom', {
        id : item?.id,
        status: "0",
      })
      if (response?.status == 200) {
        setIsLoading(false);
        getPrescriptions();
        toast.success(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
      else {
        setIsLoading(false);
        toast.error(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
    }
  }

  const handleCheckChangeDiagnosis = async (e, index, id) => {
    const { value, checked } = e.target;
    if (checked) {
      setStatusVal(1);
      setIsLoading(true)
      const response = await API.post('/diagnosis-access', {
        id,
        status: 1
      })
      if (response?.status == 200) {
        setIsLoading(false);
        getPrescriptions();
        toast.success(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
      else {
        setIsLoading(false);
        toast.error(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
    }
    else {
      setStatusVal(0);
      const response = await API.post('/diagnosis-access', {
        id,
        status: 0,
      })
      if (response?.status == 200) {
        setIsLoading(false);
        getPrescriptions();
        toast.success(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
      else {
        setIsLoading(false);
        toast.error(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
    }
  }
  
  const handleChange = async (e) => {
    const { value, checked, name } = e.target;
    if (name == "showDiagnosis") {
      if (checked) {
        setShowDiagnosis(1)
        setIsLoading(true)
        const response = await API.post('/show-diagnosis', {
          status: 1
        })
        if (response?.status == 200) {
          setIsLoading(false);
          getPrescriptions();
          toast.success(response?.data?.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
        else {
          toast.error(response?.data?.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
      }
      else {
        setShowDiagnosis(0)
        setIsLoading(true);
        const response = await API.post('/show-diagnosis', {
          status: 0,
        })
        if (response?.status == 200) {
          getPrescriptions();
          setIsLoading(false);
          setIndicationMessage(response?.data?.message)
        }
      }
    }

    if (name == "showLab") {
      if (checked) {
        setShowLab(1);
        setIsLoading(true)
        const response = await API.post('/show-labreading', {
          status: 1
        })
        if (response?.status == 200) {
          setIsLoading(false);
          getPrescriptions();
          toast.success(response?.data?.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
        else {
          toast.error(response?.data?.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
      }
      else {
        setShowLab(0)
        setIsLoading(true);
        const response = await API.post('/show-labreading', {
          status: 0,
        })
        if (response?.status == 200) {
          getPrescriptions();
          setIsLoading(false);
          setIndicationMessage(response?.data?.message)
        }
      }
    }
  } 

  return (
    <>
      {isLoading ? <Loader />
        :
        <div className='prescription_setting'>
          {!isMobile ? (
            <Container className="px-lg-0">
              <Row>
                <Col lg={6}>
                  <div className="single customCheck">
                    <label htmlFor=""> Show Lab Readings during consultation  </label>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      name='showLab'
                      onChange={handleChange}
                      value={showLab}
                      checked={(showLab == 1 || showLab == "1")}
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="single customCheck">
                    <label htmlFor=""> Show Diagnosis </label>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      name='showDiagnosis'
                      onChange={handleChange}
                      value={showDiagnosis}
                      checked={(showDiagnosis == 1 || showDiagnosis == "1")}
                    />
                  </div>
                </Col>
              </Row>
              <div className="prescription_wrap">
                <Row>
                  <Col lg={6} className='pt-lg-4 pe-lg-4'>
                    <h4>Lab Reading</h4>
                    <Divider />
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th colSpan={2}>Lab Reading</th>
                          <th className='text-center'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptionData?.labReading?.map((item, index) => {
                          return (<>
                            <tr>
                              <td>{item?.id}</td>
                              <td colSpan={2}>{item?.title}</td>
                              <td className='text-center'>
                                <Form.Check
                                  type="switch"
                                  id="custom-switch"
                                  name="checkLab"
                                  onChange={(e) => handleCheckChangeLab(e, item)}
                                  checked={item?.status == "1" ? true : false} 
                                />
                              </td>
                            </tr>
                          </>)
                        })}
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={6} className='border_left pt-lg-4 ps-lg-4'>
                    <h4>Diagnosis</h4>
                    <Divider />
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th colSpan={2}>Consult Now</th>
                          <th className='text-center'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptionData?.diagnosisAccess?.map((item, index) => {
                          return (<>
                            <tr>
                              <td>{item?.id}</td>
                              <td colSpan={2}>{item?.title}</td>
                              <td className='text-center'>
                                <Form.Check
                                  type="switch"
                                  id="custom-switch"
                                  onChange={(e) => handleCheckChangeDiagnosis(e, index, item?.id)}
                                  defaultChecked={item?.status}
                                />
                              </td>
                            </tr>
                          </>)
                        })}
                        {/* <tr>
                          <td>1234</td>
                          <td colSpan={2}>Blood Sugar</td>
                          <td className='text-center'>
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>1234</td>
                          <td colSpan={2}>Blood Sugar</td>
                          <td className='text-center'>
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>1234</td>
                          <td colSpan={2}>Blood Sugar</td>
                          <td className='text-center'>
                            <Form.Check
                              type="switch"
                              id="custom-switch"
                            />
                          </td>
                        </tr> */}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </div>
            </Container>
          ) : (
            <div className="wrap-tab">
              <Tabs
                defaultActiveKey="labs_reading"
                id="uncontrolled-tab-example"
              >
                <Tab eventKey="labs_reading" title="Labs Reading">
                  <LabsReading />
                </Tab>
                <Tab eventKey="diagnosis" title="Diagnosis">
                  <Diagnosis />
                </Tab>
              </Tabs>
            </div>
          )}
        </div>}
    </>
  )
}

export default PrescriptionSettings