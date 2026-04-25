import React, { useEffect, useState } from 'react'
import { Col, Modal, Row, Tab, Tabs, Dropdown } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import Rx from "../../../assets/images/svg/rx_icon.svg"
import PrintInvoice from "../../../assets/images/svg/printer.svg"
import Delete from "../../../assets/images/svg/delete_icon.svg"
import Stethoscope from "../../../assets/images/svg/stethoscope.svg"
import Checkmark from "../../../assets/images/svg/checkmark_icon.svg"
import Email from "../../../assets/images/svg/email.svg"
import Refund from "../../../assets/images/svg/refund.svg"
import PrintToken from "../../../assets/images/svg/ticket.svg"
import Reschedule from "../../../assets/images/svg/reschedule.svg"
import CheckInModal from '../../checkInModal/CheckInModal';
import DeletePastApptsModal from '../deletePastApptsModal/DeletePastApptsModal';
import RefundModalShow from '../refundModalShow/RefundModalShow';
import MessagePrescModal from '../messagePrescModal/MessagePrescModal';
import BookAppointmentModal from '../bookAppointmentModal/BookAppointmentModal';
import "./appointmentPatientProfileModal.scss"
import API from '../../../services/httpInstance';

const AppointmentsPatientProfileModal = ({ pastAppointments, appointmentsPatientProfileClose, appointmentsPatientProfile, checkInpastAppointments, upcomingAppointments, checkInModal, setCheckInModal, deleteAppointment, generalDeleteModal, setGeneralDeleteModal, handleGeneralDeleteClose, patientData }) => {
    const [confirmId, setConfirmId] = useState(false)
    const [refundShow, setRefundShow] = useState(false)
    const [refundAmount, setRefundAmount] = useState('')
    const [amountReceived, setAmountReceived] = useState('')
    const [refundReason, setRefundReason] = useState('')
    const [showMessage, setShowMessage] = useState(false)
    const [upcomingDataSingle, setUpcomingDataSingle] = useState({})
    const [removeEmail, setRemoveEmail] = useState(false)
    const [bookAppointmentShow, setBookAppointmentShow] = useState(false)
    const [prefilledData, setPrefilledData] = useState(false)
    const [doctors, setDoctors] = useState(null);
    const [appointmentId, setAppointmentId] = useState();

    const handleCloseMessage = () => setShowMessage(false)
    const handleBookAppointmentClose = () => setBookAppointmentShow(false)

    const handleRefundShow = (rowData) => {
        setAmountReceived(rowData?.amount_recieve)
        setConfirmId(rowData?.id)
        setRefundShow(true)
    }

    const getAllDoctors = async () => {
        try {
            const response = await API.get(`/doctor`)
            if (response?.status == 200) {
                setDoctors(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllDoctors()
    }, [])

    const navigateToConsult = (item) => {
        navigate(`/consult-now/${item?.id}`)
    }

    const navigateToPrescription = (list) => {
        navigate(`/prescription-profile/${list?.id}`)
    }

    const showMessageBox = (item) => {
        setRemoveEmail(false)
        setUpcomingDataSingle(item)
        setShowMessage(true)
    }

    const handleReshedule = (data) => {
        setBookAppointmentShow(true)
        setPrefilledData(data)
    }

    const handleRefundClose = () => {
        setConfirmId(null)
        setRefundShow(false)
    }

    const handleDeletePastApptsShow = (appId) => {
        setConfirmId(appId)
        setGeneralDeleteModal(true)
    }

    const openCheckIn = (id) => {
        setCheckInModal(true)
        setConfirmId(id)
    }

    const RefundFunc = async () => {
        const data = {
            refundID: confirmId,
            refund_amount: refundAmount,
            amount_received: amountReceived,
            refund_reason: refundReason
        }
        try {
            const response = await API.post(`/refund`, data)
            if (response?.status == 200) {
                handleRefundClose()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal className='appointmentPatientProfile' show={appointmentsPatientProfile} onHide={appointmentsPatientProfileClose}>
                <Modal.Body>
                    <h2><img src={ArrowBack} alt="" onClick={appointmentsPatientProfileClose} />Appointment</h2>
                    <Tabs
                        defaultActiveKey="upcoming"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="upcoming" title="Upcoming">
                            <Row>
                                {upcomingAppointments?.map((item) => (
                                    <Col xs={12}>
                                        <div className="card">
                                            <div className="token">
                                                <p>{item?.token}</p>
                                                <div className="mr_no">
                                                    <h6>{item?.mr_no}</h6>
                                                    <Dropdown className="dropdownUpcoming">
                                                        <Dropdown.Toggle id="dropdown-basic">
                                                            <span className="menuIcon"></span>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item onClick={() => navigateToConsult(id)} className="ancLink">
                                                                <img src={Stethoscope} alt="" className="tw-w-[16px]" />
                                                                Consult Now
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => openCheckIn(id)} className="ancLink">
                                                                <img src={Checkmark} alt="" className="tw-w-[16px]" />
                                                                Check In
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleReshedule()} className="ancLink">
                                                                <img src={Reschedule} alt="" className="tw-w-[16px]" />
                                                                Reschedule
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => showMessageBox()} className="ancLink">
                                                                <img src={Email} alt="" className="tw-w-[16px]" />
                                                                Message
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleRefundShow()} className="ancLink">
                                                                <img src={Refund} alt="" className="tw-w-[16px]" />
                                                                Refund
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => printInvoice(id)} className="ancLink">
                                                                <img src={PrintInvoice} alt="" className="tw-w-[16px]" />
                                                                Print Invoice
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => printToken(id)} className="ancLink">
                                                                <img src={PrintToken} alt="" className="tw-w-[16px]" />
                                                                Print Token
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleDeletePastApptsShow(id)} className="ancLink">
                                                                <img src={Delete} alt="" className="tw-w-[16px]" />
                                                                Delete
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            <h4>{item?.doctor_name}</h4>
                                            <p>{item?.source}</p>
                                            <div className="time">
                                                <span>{item?.time}</span>
                                                <p>{item?.web_appointment_date}</p>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Tab>
                        <Tab eventKey="past" title="Past">
                            <Row>
                                {pastAppointments?.map((item) => (
                                    <Col xs={12}>
                                        <div className="card">
                                            <div className="token">
                                                <p>{item?.token}</p>
                                                <div className="mr_no">
                                                    <h6>{item?.mr_no}</h6>
                                                    <Dropdown className='dropdownUpcoming'>
                                                        <Dropdown.Toggle id="dropdown-basic">
                                                            <span className='menuIcon'></span>
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            <Dropdown.Item href="javascript:void(0);" className='ancLink'>
                                                                <img src={PrintInvoice} alt="" className='tw-w-[16px]' />
                                                                Print Invoice
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => navigateToPrescription(id)} className='ancLink'>
                                                                <img src={Rx} alt="" className='tw-w-[16px]' />
                                                                View Prescription
                                                            </Dropdown.Item>
                                                            <Dropdown.Item href="javascript:void(0);" className='ancLink' onClick={() => handleDeletePastApptsShow(id)}>
                                                                <img src={Delete} alt="" className='tw-w-[16px]' />
                                                                Delete
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            <h4>{item?.doctor_name}</h4>
                                            <p>{item?.source}</p>
                                            <div className="time">
                                                <span>{item?.time}</span>
                                                <p>{item?.web_appointment_date}</p>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>
            <CheckInModal checkInpastAppointments={checkInpastAppointments} confirmId={confirmId} setCheckInModal={setCheckInModal} checkInModal={checkInModal} />
            <DeletePastApptsModal appointmentType={"Upcoming"} appointmentId={confirmId} deleteAppointment={deleteAppointment} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />
            <RefundModalShow confirmId={confirmId} RefundFunc={RefundFunc} setRefundAmount={setRefundAmount} refundAmount={refundAmount} setAmountReceived={setAmountReceived} amountReceived={amountReceived} setRefundReason={setRefundReason} refundReason={refundReason} handleRefundClose={handleRefundClose} refundShow={refundShow} />
            <MessagePrescModal handleCloseMessage={handleCloseMessage} showMessage={showMessage} prescriptionProfile={upcomingDataSingle} clinicId={patientData?.clinic_id} patientId={patientData?.id} doctorId={patientData?.doctor_id} number={upcomingDataSingle?.patient_phone} prescriptionId={patientData?.appointment_id} removeEmail={removeEmail} />
            <BookAppointmentModal
                bookAppointmentShow={bookAppointmentShow}
                setBookAppointmentShow={setBookAppointmentShow}
                handleBookAppointmentClose={handleBookAppointmentClose}
                prefilledData={prefilledData}
                doctors={doctors} />
        </>
    )
}

export default AppointmentsPatientProfileModal