import React, { useEffect, useState } from 'react'
import { Col, Row, Table } from 'react-bootstrap';
import WraperLayout from '../../components/wraperLayout/WraperLayout';
import { Tabs, Tab } from '@mui/material';
import TabPanel from '../../components/tabPanel/TabPanel';
import { Avatar } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import DeletePrescModal from '../modal/deletePrescModal/DeletePrescModal';
import MessagePrescModal from '../modal/messagePrescModal/MessagePrescModal';
import { Link } from 'react-router-dom';
import API from '../../services/httpInstance';
import { RightOutlined } from "@ant-design/icons"
import Cookies from 'js-cookie';
import PrintPrescriptionModal from '../modal/printPrescriptionModal/PrintPrescriptionModal';
import { useMediaQuery } from '@mui/material'
import HealthRecordsViewModal from '../modal/healthRecordsViewModal/HealthRecordsViewModal';
import ExaminationMobileModal from '../modal/examinationMobileModal/ExaminationMobileModal';
import './prescriptionProfile.scss';
import PrescriptionMobileModal from '../modal/prescriptionMobileModal/PrescriptionMobileModal';
import HealthRecordsMobileModal from '../modal/healthRecordsMobileModal/HealthRecordsMobileModal';
import InvoiceMobileModal from '../modal/invoiceMobileModal/InvoiceMobileModal';
import MedicalHistoryMobileModal from '../modal/medicalHistoryMobileModal/MedicalHistoryMobileModal';
import PrintInvoiceModal from '../modal/printInvoiceModal/PrintInvoiceModal';

const PrescriptionProfile = () => {
  const location = useLocation();
  const { appointmentId, doctorId, patientId, clinicId, appointmentDate } = location.state || {};
  const [prescriptionProfile, setPrescriptionProfile] = useState([])
  const [examinationApi, setExaminationApi] = useState([])
  const [vitalApi, setVitalApi] = useState([])
  const [healthRecordsApi, setHealthRecordsApi] = useState([])
  const [medicalHistoryApi, setMedicalHistoryApi] = useState('')
  const [prescriptionMedApi, setPrescriptionMedApi] = useState()
  const [invoiceApi, setInvoiceApi] = useState({})
  const [smsMessageApi, setSmsMessageApi] = useState()
  const [downloadPrescriptionShow, setDownloadPrescriptionShow] = useState()
  const [pastAppointment, setPastAppointment] = useState(null)
  const [removeEmail, setRemoveEmail] = useState(false)
  const [invoiceShow, setInvoiceShow] = useState(false)
  const isMobile = useMediaQuery('(max-width:767px)');
  const [showDelete, setShowDelete] = useState(false);
  const [clinicid, setClinicId] = useState(null);
  const [patientid, setPatientId] = useState(null);
  const [doctorid, setDoctorId] = useState(null);
  const [number, setNumber] = useState(null);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [healthRecordsView, setHealthRecordsView] = useState(false)
  const [examinationMobileShow, setExaminationMobileShow] = useState(false)
  const [prescriptionMobileShow, setPrescriptionMobileShow] = useState(false)
  const [healthRecordsMobileShow, setHealthRecordsMobileShow] = useState(false)
  const [invoiceMobileShow, setInvoiceMobileShow] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [medicalHistoryMobileShow, setMedicalHistoryMobileShow] = useState(false)
  const navigate = useNavigate();

  const { id } = useParams()

  const handleInvoiceShow = () => setInvoiceShow(true)
  const handleInvoiceClose = () => setInvoiceShow(false)

  // get prescription API
  const getPrescriptionProfile = async () => {
    try {
      const response = await API.get(`/appointment-details/${id}`)
      if (response?.status == 200) {
        setPrescriptionProfile(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // get Examination API
  // const getExamination = async () => {
  //   try {
  //     const response = await API.get(`/pres-exam-details/${appointmentId}`)
  //     if (response.status == 200) {
  //       setVitalApi(response?.data?.data?.Vital)
  //       setExaminationApi(response?.data?.data?.Examination)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // get Health Records API
  const getHealthRecords = async () => {
    try {
      const response = await API.get(`/pres-health-details/${appointmentId}`);
      if (response.status === 200) {
        setHealthRecordsApi(response.data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // get Medical History API
  const getMedicalHistory = async () => {
    try {
      const response = await API.get(`/pres-patient-data?appt_id=${appointmentId}&patient_id=${patientId}`)
      if (response.status == 200) {
        setMedicalHistoryApi(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const prescriptionDownloadInvoice = async () => {
    try {
      const response = await API.get(`/download-invoice-print/${appointmentId}`)
      if (response?.status == 200) {
        const pdfUrl = response.data?.data?.url;
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      console.log(error)
    }
  }

  // get invoice API
  const getInvoice = async () => {
    try {
      const response = await API.get(`/pres-invoice-details/${appointmentId}`)
      if (response.status == 200) {
        setInvoiceApi(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // get Prescription Med API
  // const getPrescriptionMed = async () => {
  //   try {
  //     const response = await API.get(`/pres-med-details/${appointmentId}`)
  //     if (response.status == 200) {
  //       setPrescriptionMedApi(response?.data?.data)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    if (appointmentId) {
      // getPrescriptionMed()
      // getExamination()
      getHealthRecords()
      getMedicalHistory()
      getInvoice()
    }
  }, [appointmentId])


  useEffect(() => {
    if (id) {
      getPrescriptionProfile()
    }
  }, [])

  const isDeleteEnabled = (
    examinationApi.length > 0 &&
    prescriptionMedApi?.length > 0 &&
    healthRecordsApi.length > 0 &&
    medicalHistoryApi.length > 0 &&
    invoiceApi?.amount
  );
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleHealthRecordsViewShow = (imageUrl) => {
    console.log(imageUrl)
    setSelectedImage(imageUrl)
    setHealthRecordsView(true)
  }
  const handleHealthRecordsViewClose = () => setHealthRecordsView(false)

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  const [showMessage, setShowMessage] = useState(false);
  const handleCloseMessage = () => setShowMessage(false);

  const handleShowMessage = (clinic, patient, doctor, number, prescriptionId) => {
    setClinicId(clinic)
    setPatientId(patient)
    setDoctorId(doctor)
    setNumber(number)
    setPrescriptionId(prescriptionId)
    setRemoveEmail(true)
    setShowMessage(true)
  };

  const navigateToPrescription = async ({ appointmentId, patientId, clinicId, doctorId, appointmentDate }) => {
    try {
      const response = await API.get(`/consult-now-detail/${appointmentId}`);
      if (response?.status == 200) {
        Cookies.set('prescriptionsEdit', "1");
        Cookies.set("patientId", id);
        Cookies.remove('prescriptionsAdd');
        Cookies.remove('patientClose');

        navigate(`/consult-now-edit`, {
          state: {
            fromPrescriptions: true,
            appointmentId,
            patientId,
            clinicId,
            doctorId,
            appointmentDate
          }
        });
      } else {
        console.error("Error fetching consult-now details:", response?.data);
      }
    } catch (error) {
      console.error('Error during API call or navigation:', error);
    }
  };

  const handleDownloadPrescriptionClose = () => setDownloadPrescriptionShow(false);
  const handleDownloadPrescriptionShow = () => setDownloadPrescriptionShow(true);

  const handleExaminationMobileShow = () => setExaminationMobileShow(true)
  const handleExaminationMobileClose = () => setExaminationMobileShow(false)

  const handlePrescriptionMobileShow = () => setPrescriptionMobileShow(true)
  const handlePrescriptionMobileClose = () => setPrescriptionMobileShow(false)

  const handleHealthRecordsMobileShow = () => setHealthRecordsMobileShow(true)
  const handleHealthRecordsMobileClose = () => setHealthRecordsMobileShow(false)

  const handleInvoiceMobileShow = () => setInvoiceMobileShow(true)
  const handleInvoiceMobileClose = () => setInvoiceMobileShow(false)

  const handleMedicalHistoryMobileShow = () => setMedicalHistoryMobileShow(true)
  const handleMedicalHistoryMobileClose = () => setMedicalHistoryMobileShow(false)

  return (
    <WraperLayout>
      {!isMobile ? (
        <div className='prescriptionProfile'>
          <div className="topBarPresc">
            <Row className='w-100 h-100'>
              <Col lg={1} className='p-0 my-auto'>
                <div className='tw-w-full tw-flex tw-items-center tw-gap-5'>
                  <Link to="/prescriptions"><span className='backIcon'></span></Link>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </div>
              </Col>
              <Col lg={9} className='p-0 my-auto'>
                <div className='details tw-w-full tw-flex tw-flex-col tw-ps-5 gap-1'>
                  <h3> {prescriptionProfile?.patient?.name} </h3>
                  <div className='tw-flex tw-items-center tw-gap-6'>
                    <h4>MR#: {prescriptionProfile?.patient?.mr_no} </h4>
                    <h4>Gender: {prescriptionProfile?.patient?.gender}  </h4>
                    <h4>Age: {`${prescriptionProfile?.patient?.age} years`} </h4>
                    <h4>Contact: {prescriptionProfile?.patient?.phone} </h4>
                    <h4>Address: {prescriptionProfile?.patient?.address} </h4>
                  </div>
                </div>
              </Col>
              <Col lg={2} className='p-0 my-auto'>
                <div className='details tw-w-full tw-flex tw-flex-col tw-justify-center tw-items-end tw-gap-3'>
                  <button> {prescriptionProfile?.patient?.appointment_count} Visits </button>
                  <div className='actions tw-flex tw-items-center tw-gap-3 '>
                    <span
                      className='deleteIcon'
                      onClick={isDeleteEnabled ? handleShowDelete : null}
                      style={{ cursor: isDeleteEnabled ? 'pointer' : 'not-allowed', opacity: isDeleteEnabled ? 1 : 0.5 }}
                    ></span>
                    <button
                      className='editIcon'
                      onClick={() => navigateToPrescription({
                        appointmentId: prescriptionProfile?.appointment_id,
                        patientId: prescriptionProfile?.appointment?.patient_id,
                        clinicId: prescriptionProfile?.appointment?.clinic_id,
                        doctorId: prescriptionProfile?.appointment?.doctor_id,
                        appointmentDate: prescriptionProfile?.appointment?.appointment_date
                      })}
                    />
                    <span className='messageIcon' onClick={() => { handleShowMessage(prescriptionProfile?.clinic_id, prescriptionProfile?.id, prescriptionProfile?.doctor_id, prescriptionProfile?.phone, prescriptionProfile?.prescription_id) }}></span>
                    <button className='printIcon' onClick={handleDownloadPrescriptionShow}></button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="bottom_barContent">
            <Row>
              <Col lg={4}>
                <div className="examPresc">
                  <div className='examPrescHead tw-w-full tw-flex tw-items-center tw-justify-between'>
                    <h4> Examination </h4>
                    <span> Added by: Dr. {prescriptionProfile?.appointment?.doctors?.first_name} </span>
                  </div>
                  <ul className='tw-w-full tw-flex tw-flex-col'>
                    {prescriptionProfile?.consultations_and_vitals
                      ?.filter(item => item?.vitals_key && item?.vitals_value)
                      ?.map((item) => (
                        <li className='lii tw-w-full tw-flex tw-items-center tw-justify-between' key={`vital-${item?.id}`}>
                          <h5>{item?.vitals_key}</h5>
                          <span>{item?.vitals_value} °F</span>
                        </li>
                      ))}
                  </ul>

                  <div className="wrapeCompl tw-w-full tw-flex tw-items-center">
                    {prescriptionProfile?.consultations_and_vitals
                      ?.filter(item => item?.examination_key && item?.examination_value)
                      ?.map((item) => (
                        <div className="singleTextArea" key={`exam-${item?.id}`}>
                          <label htmlFor="">{item?.examination_key}</label>
                          <div className='textBox'><p>{item?.examination_value}</p></div>
                        </div>
                      ))}
                  </div>
                </div>

              </Col>
              <Col lg={5}>
                <div className='prescSCards tw-flex tw-flex-col'>
                  <div className="cardSingle">
                    <h3> Prescription </h3>
                    <div className="table__wrape">
                      <Table responsive className=''>
                        <thead>
                          <tr>
                            <th>Medicine </th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Instruction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptionProfile?.prescribed_medicines?.map((item) => (
                            <tr>
                              <td>{item?.medicinetitle || item?.medicineTitle}</td>
                              <td>{item?.dosage || item?.dosage_value}</td>
                              <td>{item?.frequency}</td>
                              <td>{item?.duration ||  item?.duration_value}</td>
                              <td>{item?.mealTitle || item?.meal}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className="cardSingle mb-md-0">
                    <h3> Medical History </h3>
                    <div className="wraper_tabs_prescription">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable tabs example"
                      >
                        <Tab label="Indications" />
                        <Tab label="Past Medical" />
                        <Tab label="Family History" />
                        <Tab label="Surgical History" />
                        <Tab label="Allergies" />
                      </Tabs>
                      <TabPanel value={value} index={0}>
                        <div className="table__wrape">
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Indications</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicalHistoryApi[0]?.list?.map((item) => (
                                <tr key={item.id}>
                                  <td>{item?.date_web}</td>
                                  <td>{item?.title}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <div className="table__wrape">
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Past Medical</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicalHistoryApi[1]?.list?.map((item) => (
                                <tr key={item.id}>
                                  <td>{item?.date_web}</td>
                                  <td>{item?.title}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <div className="table__wrape">
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Past Appointment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicalHistoryApi[2]?.list?.map((item) => (
                                <tr key={item.id}>
                                  <td>{item?.date_web}</td>
                                  <td>{item?.title}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={3}>
                        <div className="table__wrape">
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Surgical History</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicalHistoryApi[4]?.list?.map((item) => (
                                <tr key={item.id}>
                                  <td>{item?.date_web}</td>
                                  <td>{item?.title}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={4}>
                        <div className="table__wrape">
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Allergies</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicalHistoryApi[3]?.list?.map((item) => (
                                <tr key={item.id}>
                                  <td>{item?.date_web}</td>
                                  <td>{item?.title}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </TabPanel>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={3}>
                <div className='healthSCards tw-flex tw-flex-col tw-gap-5'>
                  <div className="cardSingleHealth">
                    <h3> Health Records </h3>
                    <div className="table__wrape">
                      <Table responsive className=''>
                        <thead>
                          <tr>
                            <th>Lab Test </th>
                            <th> </th>
                          </tr>
                        </thead>
                        <tbody>
                          {healthRecordsApi?.length > 0 ? (
                            healthRecordsApi.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.lab_tests}</td>
                                <td>
                                  <h4 className='tw-cursor-pointer' onClick={() => handleHealthRecordsViewShow(item?.image)}> View </h4>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="2" className='text-center'>No health records available.</td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className="cardSingleHealth">
                    <div className='invoceDe tw-w-full tw-flex tw-items-center tw-justify-between '>
                      <h3> Invoice </h3>
                      <button onClick={prescriptionDownloadInvoice}><span className='printSvg'>  </span></button>
                    </div>
                    <div className="wrape_bi">
                      <ul className='listInvoice'>
                        <li>
                          <span> Amount </span>
                          <span>Rs. {
                            invoiceApi?.consultation_fee
                          } </span>
                        </li>
                        <li>
                          <span> Total Discount </span>
                          <span>Rs. {prescriptionProfile?.appointment?.invoice?.discount} </span>
                        </li>
                        <li>
                          <span> Total Amount </span>
                          <span>Rs. {prescriptionProfile?.appointment?.invoice?.total} </span>
                        </li>
                        <li>
                          <span> Amount Paid </span>
                          <span>Rs. {prescriptionProfile?.appointment?.invoice?.amount_recieve} </span>
                        </li>
                        <li>
                          <span> Remaining Balance </span>
                          <span>
                            Rs. {
                              (prescriptionProfile?.appointment?.invoice?.total) -
                              (prescriptionProfile?.appointment?.invoice?.amount_recieve)
                            }
                          </span>
                        </li>
                      </ul>
                      <div className="viewHistoryBtn">
                        <a href="javascript:void(0);" onClick={handleInvoiceShow}>View Details</a>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ) : (<div className='prescriptionProfile-mobile'>
        <div className="topBarPresc">
          <Row>
            <Col className=''>
              <div className='details'>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <div>
                  <h3> {prescriptionProfile?.name} </h3>
                  <div className='details_wrap'>
                    <h4>MR#: {prescriptionProfile?.mr_no} </h4>
                    <h4>Gender: {prescriptionProfile?.gender}  </h4>
                    <h4>Age: {`${prescriptionProfile?.age} years`} </h4>
                    <h4>Contact: {prescriptionProfile?.phone} </h4>
                    <h4>Address: {prescriptionProfile?.address} </h4>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={2} className='mb-3'>
              <div className='details tw-justify-between mb-0'>
                <div className='actions tw-flex tw-items-center tw-gap-6'>
                  <span className='deleteIcon' onClick={handleShowDelete}></span>
                  <button className='editIcon' onClick={() => navigateToConsultNow(prescriptionProfile)}></button>
                  <span className='messageIcon' onClick={() => { handleShowMessage(prescriptionProfile?.clinic_id, prescriptionProfile?.id, prescriptionProfile?.doctor_id, prescriptionProfile?.number, prescriptionProfile?.prescription_id) }}></span>
                  <button className='printIcon' onClick={handleDownloadPrescriptionShow}></button>
                </div>
                <button> {prescriptionProfile?.appointment_count} Visits </button>
              </div>
            </Col>
            <Col xs={12} className='mb-3'>
              <button className='box_modal'>
                <span>Examination</span>
                <RightOutlined onClick={handleExaminationMobileShow} />
              </button>
            </Col>
            <Col xs={12} className='mb-3'>
              <button className='box_modal'>
                <span>Prescription</span>
                <RightOutlined onClick={handlePrescriptionMobileShow} />
              </button>
            </Col>
            <Col xs={12} className='mb-3'>
              <button className='box_modal'>
                <span>Health Records</span>
                <RightOutlined onClick={handleHealthRecordsMobileShow} />
              </button>
            </Col>
            <Col xs={12} className='mb-3'>
              <button className='box_modal'>
                <span>Medical History</span>
                <RightOutlined onClick={handleMedicalHistoryMobileShow} />
              </button>
            </Col>
            <Col xs={12} className='mb-3'>
              <button className='box_modal'>
                <span>Invoice</span>
                <RightOutlined onClick={handleInvoiceMobileShow} />
              </button>
            </Col>
          </Row>
        </div>
      </div>)}
      <DeletePrescModal showDelete={showDelete} handleCloseDelete={handleCloseDelete} />
      <HealthRecordsViewModal imageUrl={selectedImage} healthRecordsView={healthRecordsView} handleHealthRecordsViewClose={handleHealthRecordsViewClose} prescriptionProfile={prescriptionProfile} healthRecordsApi={healthRecordsApi} />
      <MessagePrescModal removeEmail={removeEmail} showMessage={showMessage} handleCloseMessage={handleCloseMessage} smsMessageApi={smsMessageApi} prescriptionProfile={prescriptionProfile} patientId={patientId} clinicId={clinicId} number={number} doctorId={doctorId} prescriptionId={prescriptionId} />
      <PrintPrescriptionModal prescriptionProfile={prescriptionProfile} handleDownloadPrescriptionClose={handleDownloadPrescriptionClose} downloadPrescriptionShow={downloadPrescriptionShow} />
      <PrintInvoiceModal handleInvoiceClose={handleInvoiceClose} invoiceShow={invoiceShow} prescriptionDownloadInvoice={prescriptionDownloadInvoice} />
      <ExaminationMobileModal handleExaminationMobileClose={handleExaminationMobileClose} examinationMobileShow={examinationMobileShow} vitalApi={vitalApi} examinationApi={examinationApi} />
      <PrescriptionMobileModal handlePrescriptionMobileClose={handlePrescriptionMobileClose} prescriptionMobileShow={prescriptionMobileShow} prescriptionMedApi={prescriptionMedApi} />
      <HealthRecordsMobileModal handleHealthRecordsViewShow={handleHealthRecordsViewShow} handleHealthRecordsMobileClose={handleHealthRecordsMobileClose} healthRecordsMobileShow={healthRecordsMobileShow} healthRecordsApi={healthRecordsApi} setHealthRecordsView={setHealthRecordsView} />
      <InvoiceMobileModal invoiceMobileShow={invoiceMobileShow} handleInvoiceMobileClose={handleInvoiceMobileClose} invoiceApi={invoiceApi} prescriptionDownloadInvoice={prescriptionDownloadInvoice} />
      <MedicalHistoryMobileModal medicalHistoryApi={medicalHistoryApi} medicalHistoryMobileShow={medicalHistoryMobileShow} handleMedicalHistoryMobileClose={handleMedicalHistoryMobileClose} />
    </WraperLayout>
  )
}

export default PrescriptionProfile;
