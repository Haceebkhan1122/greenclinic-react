import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import './pateintProfile.scss';
import ProfileCard from '../../components/profileCard/ProfileCard';
import VitalCard from '../../components/vitalCard/VitalCard';
import PatientTabCard from '../../components/patientTabCard/PatientTabCard';
import { useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';
import API, { API_MERISEHAT } from '../../services/httpInstance';
import moment from 'moment';
import Loader from '../../components/loader/Loader';
import { useSelector } from 'react-redux';

const PateintProfile = () => {
    const { id } = useParams();
    const [vitalsCurrentDate,setVitalsCurrentDate] = useState([])
    const [vitalsLastDate,setVitalsLastDate] = useState([])
    const [vitalsData, setVitalsData] = useState([]);
    const [patientData,setPatientData] = useState({})
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [doctors, setDoctors] = useState(null);
    const [bookAppointmentShow, setBookAppointmentShow] = useState(false);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [consultNowPermission, setConsultNowPermission] = useState(false);
    const [medicalPermission, setMedicalPermission] = useState(false);
    const [patientPermissions, setPatientPermissions] = useState({});
    const [allowedPermissions, setAllowedPermissions] = useState({});

    let userPermissions = useSelector((state) => state.clinic.userPermissions);

    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "appointments_view");
        const viewPermissionPatients = userPermissions?.find((item) => item.slug === "patients_view");
        const childPermissions = viewPermission?.child || [];
        const childPermissionsPatient = viewPermissionPatients?.child || [];
        const perms = {};
        const perms2 = {};
        childPermissions.forEach(child => {
            perms[child.slug] = true;
        });
        childPermissionsPatient.forEach(child => {
            perms2[child.slug] = true;
        });
        setPatientPermissions(perms2)
        setAllowedPermissions(perms);

    }, [userPermissions]);

    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "consult_now");
        const viewPermissionMedical = userPermissions?.find((item) => item.slug === "medical_history_view");
        if (viewPermission && Object.keys(viewPermission)?.length > 0) {
            setConsultNowPermission(true)
        }
        if (viewPermissionMedical && Object.keys(viewPermissionMedical)?.length > 0) {
            setMedicalPermission(true)
        }
    }, [userPermissions]);

    const getPatientProfile = async () => {
        try {
            setIsLoading(true)
            const response = await API.get(`/patients-profile/${id}`)
            if(response?.status == 200){
            setIsLoading(false)
            setPatientData(response?.data?.data)
            }
            else {
            setIsLoading(false)
            }
            console.log(response)
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
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

    const getAppointments = async (page = 1) => {
        try {
            const response = await API.get(`/patient-upcoming-appointment?patient_id=${id}?page=${page}`)
            if (response?.status == 200) {
                setUpcomingAppointments(response?.data?.data?.upcoming_appointment)
                setPagination(response?.data?.data?.pagination)
            }
        } catch (error) {
            console.log(error)
        }
    }

     const getPastAppointments = async (page = 1) => {
        try {
            const response = await API.get(`/patient-past-appointment?patient_id=${id}?page=${page}`)
            if (response?.status == 200) {
                setPastAppointments(response?.data?.data?.past_appointment)
                setPagination(response?.data?.data?.pagination)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getVitalsData = async () => {
        try {
            const response = await API.get(`/patient-vital-history?patientId=${id}&vitalDate=${moment().format('YYYY-MM-DD')}`)
            if (response?.status === 200 && response.data?.data?.length > 0){
                setVitalsCurrentDate(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCurrentVitalsData = async () => {
        const appointmentId = pastAppointments?.[pastAppointments.length - 1]?.id;
        if (!appointmentId) {
          return;
        }
        try {
          const response = await API_MERISEHAT.get(`/scans?appt_id=${appointmentId}`);
          if (response?.status == 200) {
            setVitalsData(response?.data?.data);
          }
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        if(id){
            getPatientProfile()
            getVitalsData()
            getAppointments()
            getPastAppointments()
        }
    }, [])

    useEffect(() => {
        if(pastAppointments){
            getCurrentVitalsData() 

        }
    }, [pastAppointments])
    

    useEffect(() => {
        getAllDoctors()
    }, [])

    const handleBookAppointmentClose = () => setBookAppointmentShow(false);
    
    return (
        <>
            {isLoading
                ? <Loader />
                :
                <section className='patientProfileMain'>
                    <Container>
                        <Col lg={12}>
                            <Row>
                                <Col lg={3}>
                                    <div className='tw-flex tw-flex-col tw-gap-6'>
                                        <ProfileCard patientPermissions={patientPermissions} allowedPermissions={allowedPermissions} consultNowPermission={consultNowPermission} handleBookAppointmentClose={handleBookAppointmentClose} getPatientProfile={getPatientProfile} setBookAppointmentShow={setBookAppointmentShow} bookAppointmentShow={bookAppointmentShow} doctors={doctors} upcomingAppointments={upcomingAppointments} patientData={patientData} />
                                        <VitalCard vitalsCurrentDate={vitalsCurrentDate} patientData={patientData} vitalsData={vitalsData} />
                                    </div>
                                </Col>
                                <Col lg={9}>
                                    <PatientTabCard medicalPermission={medicalPermission} getPatientProfile={getPatientProfile} getPastAppointments={getPastAppointments} pastAppointments={pastAppointments} setPastAppointments={setPastAppointments} setPagination={setPagination} pagination={pagination} setUpcomingAppointments={setUpcomingAppointments} upcomingAppointments={upcomingAppointments} getAppointments={getAppointments} patientData={patientData} id={id} />
                                </Col>
                            </Row>
                        </Col>
                    </Container>
                </section>
            }
        </>
    )
}

export default PateintProfile;
