// import { Tab, Tabs } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import TabPanel from '../../components/tabPanel/TabPanel';
import MedicalHistoryTab from '../../components/medicalHistoryTab/MedicalHistoryTab';
import UpcomingAppts from '../../components/upcomingAppts/UpcomingAppts';
import './patientTabCard.scss';
import InvoiceTab from '../../components/patientInvoiceTab/InvoiceTab';
import PastAppts from '../../components/patientPastAppts/PastAppts';
import PrescriptionTab from '../../components/patientPrescriptionTab/PrescriptionTab';
import HealthRecordsTab from '../../components/healthRecordsTab/HealthRecordsTab';
import MessagesTab from '../../components/messagesTab/MessagesTab';
import LabReading from '../../components/labReadingTab/LabReading';
import {API} from '../../services/httpInstance';
import { useMediaQuery } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
import { RightOutlined } from "@ant-design/icons"
import MedicalHistoryPatientProfileModal from '../modal/medicalHistoryPatientProfileModal/MedicalHistoryPatientProfileModal';
import AppointmentsPatientProfileModal from '../modal/appointmentsPatientProfileModal/AppointmentsPatientProfileModal';
import PrescriptionPatientProfileModal from '../modal/prescriptionPatientProfileModal/PrescriptionPatientProfileModal';
import InvoicesPatientProfileModal from '../modal/invoicesPatientProfileModal/InvoicesPatientProfileModal';
import HealthRecordsPatientProfileModal from '../modal/healthRecordsPatientProfileModal/HealthRecordsPatientProfileModal';
import MessagesPatientProfileModal from '../modal/messagesPatientProfileModal/MessagesPatientProfileModal';
import LabReadingsPatientProfileModal from '../modal/labReadingsPatientProfileModal/LabReadingsPatientProfileModal';
import { useSelector } from 'react-redux';

const PatientTabCard = ({ id, patientData, medicalPermission, getPatientProfile, getAppointments, upcomingAppointments, setPagination, pagination, getPastAppointments, pastAppointments, setPastAppointments }) => {
    const [value, setValue] = useState(0);
    const [generalDeleteModal, setGeneralDeleteModal] = useState(false)
    const [generalDeleteModalUpdated, setGeneralDeleteModalUpdated] = useState("")
    const [medicalHistory, setMedicalHistory] = useState([]);
    const [doctors, setDoctors] = useState(null);
    const [bookAppointmentShow, setBookAppointmentShow] = useState(false);
    const [prescriptionData, setPrescriptionData] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [patientHealthRecord, setPatientHealthRecord] = useState([]);
    const [labReadings, setLabReadings] = useState([]);
    const [checkInModal, setCheckInModal] = useState(false)
    const [messages, setMessages] = useState([]);
    const [medicalHistoryPatientProfile, setMedicalHistoryPatientProfile] = useState(false)
    const [appointmentsPatientProfile, setAppointmentsPatientProfile] = useState(false)
    const [prescriptionPatientProfile, setPrescriptionPatientProfile] = useState(false)
    const [invoicesPatientProfile, setInvoicesPatientProfile] = useState(false)
    const [healthRecordsPatientProfile, setHealthRecordsPatientProfile] = useState(false)
    const [messagesPatientProfile, setMessagesPatientProfile] = useState(false)
    const [labReadingsPatientProfile, setLabReadingsPatientProfile] = useState(false)
    const isMobile = useMediaQuery('(max-width:767px)');
    const handleBookAppointmentClose = () => setBookAppointmentShow(false);

    const medicalHistoryPatientProfileShow = () => {
        setMedicalHistoryPatientProfile(true)
    }
    const medicalHistoryPatientProfileClose = () => setMedicalHistoryPatientProfile(false)

    const appointmentsPatientProfileShow = () => setAppointmentsPatientProfile(true)
    const appointmentsPatientProfileClose = () => setAppointmentsPatientProfile(false)

    const prescriptionPatientProfileShow = () => setPrescriptionPatientProfile(true)
    const prescriptionPatientProfileClose = () => setPrescriptionPatientProfile(false)

    const invoicesPatientProfileShow = () => setInvoicesPatientProfile(true)
    const invoicesPatientProfileClose = () => setInvoicesPatientProfile(false)

    const healthRecordsPatientProfileShow = () => setHealthRecordsPatientProfile(true)
    const healthRecordsPatientProfileClose = () => setHealthRecordsPatientProfile(false)

    const messagesPatientProfileShow = () => setMessagesPatientProfile(true)
    const messagesPatientProfileClose = () => setMessagesPatientProfile(false)

    const labReadingsPatientProfileShow = () => setLabReadingsPatientProfile(true)
    const labReadingsPatientProfileClose = () => setLabReadingsPatientProfile(false)

    const handleGeneralDeleteClose = () => setGeneralDeleteModal(false);
    const handleGeneralDeleteCloseUpdated = () => setGeneralDeleteModalUpdated("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    const getMedicalHistory = async () => {
        try {
            const response = await API.get(`/patient-data?patientId=${id}`)
            if (response?.status == 200) {
                setMedicalHistory(response?.data?.data)
            }

        } catch (error) {
            console.log(error)
        }
    }


    const getPrescription = async (page = 1) => {
        try {
            const response = await API.get(`/patient-pres/${id}?page=${page}`)
            if (response?.status == 200) {
                setPrescriptionData(response?.data?.data?.patient_prescriptions)
                setPagination(response?.data?.data?.pagination)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteAppointment = async (appId) => {
        try {
            const response = await API.delete(`/delete-appt?appt_id=${appId}`)
            if (response?.status == 200) {
                handleGeneralDeleteCloseUpdated();
                getAppointments()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getInvoices = async (page = 1) => {
        try {
            const response = await API.get(`/patient-invoice-data-pagination/${id}?page=${page}`)
            if (response?.status == 200) {
                setInvoices(response?.data?.data?.patient_invoices)
                setPagination(response?.data?.data?.pagination)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getLabReports = async () => {
        try {
            const response = await API.get(`/patient-lab-reading?patient_id=${id}`)
            if (response?.status == 200) {
                setLabReadings(response?.data?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const getPatientHealthRecords = async (page = 1) => {
        try {
            const [healthRecordRes, otherApiRes] = await Promise.all([
                API.get(`/patient-health-record/${id}?page=${page}`),
                // API_MS.get(`/patient-health-record?user_id=${id}`)
            ])
            // const response = await API_MS.get(`/patient-health-record?user_id=${id}`)
            if (healthRecordRes?.status == 200) {
                setPatientHealthRecord(healthRecordRes?.data?.data?.records)
                setPagination(healthRecordRes?.data?.data?.pagination)
            }
            if (otherApiRes?.status === 200) {
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteHealthRecords = async (appId) => {
        try {
            const response = await API.delete(`/del-health-rec/${appId}`)
            if (response?.status == 200) {
                handleGeneralDeleteClose()
                await getPatientHealthRecords()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteInvoice = async (appId) => {
        try {
            const response = await API.delete(`/delete-appt?appt_id=${appId}`)
            if (response?.status == 200) {
                handleGeneralDeleteClose()
                handleGeneralDeleteCloseUpdated()
                getInvoices()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const deletePrescription = async (appId) => {
        try {
            const response = await API.delete(`/patient-prescription-delete/${appId}`)
            if (response?.status == 200) {
                handleGeneralDeleteClose()
                getInvoices()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const checkInpastAppointments = async (id) => {
        const data = { appointment_id: id }
        if (id) {
            try {
                const response = await API.post('/check-in', data)
                if (response?.status == 200) {
                    getAppointments()
                    setCheckInModal(false)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const getMessages = async (page = 1) => {
        try {
            const response = await API.get(`/get-patient-messages?patientId=${id}?page=${page}`)
            if (response?.status == 200) {
                setMessages(response?.data?.data?.patientSMS)
                setPagination(response?.data?.data?.pagination)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllDoctors()
    }, [])

    useEffect(() => {
        if (id) {
            getMedicalHistory()
            getAppointments()
            getPrescription()
            getInvoices()
            getPatientHealthRecords()
            getLabReports()
            getMessages()
        }
    }, []);

    const [allowedPermissions, setAllowedPermissions] = useState({});
    const [appointmentsPermissions, setAppointmentsPermissions] = useState({});
    const [viewBilling, setViewBilling] = useState(false);
    const [viewOnline, setViewOnline] = useState(false);

    let userPermissions = useSelector((state) => state.clinic.userPermissions);

    useEffect(() => {
    let checkViewBiling = userPermissions?.find((item) => item.slug === "billing_view");
    let checkViewOnline = userPermissions?.find((item) => item.slug === "online-appointments");

        if (checkViewBiling && Object.keys(checkViewBiling)?.length > 0) {
            setViewBilling(true)
        }

        if (checkViewOnline && Object.keys(checkViewOnline)?.length > 0) {
            setViewOnline(true)
        }

        else {
            setViewBilling(false);
            setViewOnline(false);
        }
    }, [userPermissions]);

    const [showMessageBtn, setShowMessageBtn] = useState(false);

    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "sms");

        if (viewPermission && Object.keys(viewPermission).length > 0) {
            setShowMessageBtn(true)
        }

    }, [userPermissions]);

    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "billing_view");
        const childPermissions = viewPermission?.child || [];
        const perms = {};
        childPermissions.forEach(child => {
            perms[child.slug] = true;
        });
        setAllowedPermissions(perms);
    }, [userPermissions]);

    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "appointments_view");
        const childPermissions = viewPermission?.child || [];
        const perms = {};
        childPermissions.forEach(child => {
            perms[child.slug] = true;
        });
        setAppointmentsPermissions(perms);
    }, [userPermissions]);

    return (
        <>
            {!isMobile ? (
                <div className='patientTabCardMain'>
                    <div className="wraper_tabs_patient">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable tabs example"
                        >
                            {medicalPermission && <Tab label="Medical History" />}
                            <Tab label="Upcoming Appts." />
                            <Tab label="Past Appts." />
                            <Tab label="Prescription" />
                            <Tab label="Invoices" />
                            <Tab label="Health Records" />
                            <Tab label="Message" />
                            <Tab label="Lab Reading" />
                        </Tabs>

                        <TabPanel value={value} index={0}>
                            <MedicalHistoryTab getMedicalHistory={getMedicalHistory} patientData={patientData} patientId={id} medicalHistory={medicalHistory} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <UpcomingAppts showMessageBtn={showMessageBtn} appointmentsPermissions={appointmentsPermissions} patientData={patientData} allowedPermissions={allowedPermissions} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} deleteAppointment={deleteAppointment} checkInModal={checkInModal} setCheckInModal={setCheckInModal} pagination={pagination} getAppointments={getAppointments} upcomingAppointments={upcomingAppointments} checkInpastAppointments={checkInpastAppointments} handleGeneralDeleteClose={handleGeneralDeleteClose} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <PastAppts getPastAppointments={getPastAppointments} pagination={pagination} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} deleteAppointment={deleteAppointment} pastAppointments={pastAppointments} handleGeneralDeleteClose={handleGeneralDeleteClose} />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <PrescriptionTab getPrescription={getPrescription} pagination={pagination} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} deletePrescription={deletePrescription} prescriptionData={prescriptionData} handleGeneralDeleteClose={handleGeneralDeleteClose} />
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            <InvoiceTab allowedPermissions={allowedPermissions} getInvoices={getInvoices} handleGeneralDeleteCloseUpdated={handleGeneralDeleteCloseUpdated} pagination={pagination} deleteInvoice={deleteInvoice} generalDeleteModalUpdated={generalDeleteModalUpdated} setGeneralDeleteModalUpdated={setGeneralDeleteModalUpdated} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} handleGeneralDeleteClose={handleGeneralDeleteClose} invoices={invoices} />
                        </TabPanel>
                        <TabPanel value={value} index={5}>
                            <HealthRecordsTab patientId={id} getPatientHealthRecords={getPatientHealthRecords} pagination={pagination} deleteHealthRecords={deleteHealthRecords} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} patientHealthRecord={patientHealthRecord} patientData={patientData} />
                        </TabPanel>
                        <TabPanel value={value} index={6}>
                            <MessagesTab messages={messages} pagination={pagination} getMessages={getMessages} />
                        </TabPanel>
                        <TabPanel value={value} index={7}>
                            <LabReading labReadings={labReadings} />
                        </TabPanel>
                    </div>
                </div>
            ) : (<Row>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal dd'>
                        <span>Medical History</span>
                        <RightOutlined onClick={medicalHistoryPatientProfileShow} />
                    </button>
                </Col>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal'>
                        <span>Appointments</span>
                        <RightOutlined onClick={appointmentsPatientProfileShow} />
                    </button>
                </Col>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal'>
                        <span>Prescription</span>
                        <RightOutlined onClick={prescriptionPatientProfileShow} />
                    </button>
                </Col>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal'>
                        <span>Invoices</span>
                        <RightOutlined onClick={invoicesPatientProfileShow} />
                    </button>
                </Col>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal'>
                        <span>Health Records</span>
                        <RightOutlined onClick={healthRecordsPatientProfileShow} />
                    </button>
                </Col>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal'>
                        <span>Messages</span>
                        <RightOutlined onClick={messagesPatientProfileShow} />
                    </button>
                </Col>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal'>
                        <span>Lab Readings</span>
                        <RightOutlined onClick={labReadingsPatientProfileShow} />
                    </button>
                </Col>
            </Row>)}

            <MedicalHistoryPatientProfileModal getMedicalHistory={getMedicalHistory} patientData={patientData} patientId={id} medicalHistory={medicalHistory} medicalHistoryPatientProfile={medicalHistoryPatientProfile} medicalHistoryPatientProfileClose={medicalHistoryPatientProfileClose} />
            {isMobile && (
                <>
                    {checkInModal == false && (
                        <AppointmentsPatientProfileModal pastAppointments={pastAppointments} patientData={patientData} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} deleteAppointment={deleteAppointment} checkInModal={checkInModal} setCheckInModal={setCheckInModal} getAppointments={getAppointments} upcomingAppointments={upcomingAppointments} checkInpastAppointments={checkInpastAppointments} handleGeneralDeleteClose={handleGeneralDeleteClose} appointmentsPatientProfileClose={appointmentsPatientProfileClose} appointmentsPatientProfile={appointmentsPatientProfile} />
                    )}
                    <PrescriptionPatientProfileModal getPrescription={getPrescription} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} deletePrescription={deletePrescription} prescriptionData={prescriptionData} handleGeneralDeleteClose={handleGeneralDeleteClose} prescriptionPatientProfileClose={prescriptionPatientProfileClose} prescriptionPatientProfile={prescriptionPatientProfile} />
                    <InvoicesPatientProfileModal handleBookAppointmentClose={handleBookAppointmentClose} setBookAppointmentShow={setBookAppointmentShow} bookAppointmentShow={bookAppointmentShow} doctors={doctors} invoicesPatientProfileClose={invoicesPatientProfileClose} invoicesPatientProfile={invoicesPatientProfile} getInvoices={getInvoices} deleteInvoice={deleteInvoice} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} handleGeneralDeleteClose={handleGeneralDeleteClose} invoices={invoices} />
                    <HealthRecordsPatientProfileModal healthRecordsPatientProfileClose={healthRecordsPatientProfileClose} healthRecordsPatientProfile={healthRecordsPatientProfile} getPatientHealthRecords={getPatientHealthRecords} deleteHealthRecords={deleteHealthRecords} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} setGeneralDeleteModal={setGeneralDeleteModal} patientHealthRecord={patientHealthRecord} patientData={patientData} />
                    <MessagesPatientProfileModal messagesPatientProfile={messagesPatientProfile} messagesPatientProfileClose={messagesPatientProfileClose} messages={messages} />
                    <LabReadingsPatientProfileModal labReadings={labReadings} labReadingsPatientProfileClose={labReadingsPatientProfileClose} labReadingsPatientProfile={labReadingsPatientProfile} />
                </>
            )}
        </>
    )
}

export default PatientTabCard;
