/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import './profileCard.scss';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import deleteicon from '../../assets/images/svg/delete_icon.svg'
import ic1 from '../../assets/images/svg/ic1.svg'
import ic3 from '../../assets/images/svg/c3.svg'
import DeletePatientModal from '../modal/deletePatientModal/DeletePatientModal';
import { useNavigate } from 'react-router-dom';
import BookAppointmentModal from '../modal/bookAppointmentModal/BookAppointmentModal';
import API from '../../services/httpInstance';
import EditPatientModal from '../modal/editPatientModal/EditPatientModal';
import { useMediaQuery } from '@mui/material'

const ProfileCard = ({ patientData, consultNowPermission, patientPermissions, allowedPermissions, upcomingAppointments, doctors,getPatientProfile, bookAppointmentShow, setBookAppointmentShow, handleBookAppointmentClose, fetchAllPatientsListing }) => {

    const navigate = useNavigate();
    const [patientDeleteShow, setPatientDeleteShow] = useState(false)
    const [patientDelete, setPatientDelete] = useState(false)
    const [editPatient, setEditPatient] = useState(false)
    const [cities, setCities] = useState([]);
    const [patientEditShow, setPatientEditShow] = useState(false);
    const [comingFromPatientProfile, setComingFromPatientProfile] = useState(false)
    const handlePatientDeleteClose = () => setPatientDeleteShow(false);
    const handlePatientEditClose = () => setPatientEditShow(false);
    const isMobile = useMediaQuery('(max-width:767px)');

    const openDeletePatient = (id) => {
        setPatientDelete(id)
        setComingFromPatientProfile(true)
        setPatientDeleteShow(true)
    }

    const [appointmentData, setAppointmentData] = useState({});
    const [appointmentClicked, setAppointmentClicked] = useState(false);

    const openbookAppointment = (data) => {
        setAppointmentData(data)
        setAppointmentClicked(true);
        setBookAppointmentShow(true)
    }

    const goForConsultation = async (appointmentId) => {
        try {
            const response = await API.get(`/consult-now/${appointmentId}`)
            if (response?.status == 200) {
                navigate('/consult-now', {
                    state: {
                        appointmentId,
                        patientId: response?.data?.data?.patient_id,
                        clinicId: response?.data?.data?.clinic_id,
                        doctorId: response?.data?.data?.doctor_id,
                        appointmentDate: response?.data?.data?.appointment_completed_at
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getCitites = async () => {
        try {
            const response = await API.get('/cities-list/2')
            if (response?.status == 200) {
                setCities(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePatientEditShow = (item) => {
        setEditPatient(item)
        getCitites();
        setPatientEditShow(true);
    }

    return (
        <div className='profileCardMain tw-p-[20px] tw-flex tw-flex-col tw-justify-between tw-items-start'>
            <div className='tw-w-full tw-flex tw-justify-between tw-items-center '>
                <div className='tw-flex tw-gap-3'>
                    <Link to="/patients"><span className='backIcon'></span></Link>
                    <h4> Patient Profile </h4>
                </div>
                <div className='tw-flex tw-items-center'>
                    <button> {patientData?.appointment_count} Visits  </button>
                    <Dropdown className='editPatientDrop' align="end">
                        <Dropdown.Toggle id="dropdown-basic">
                            <span className='togglerIcon'>  </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {patientPermissions["patients_update"] && <Dropdown.Item onClick={() => handlePatientEditShow(patientData)}><img src={ic1} className='icon01' ></img>Edit</Dropdown.Item>}
                            {patientPermissions["patients_delete"] && <Dropdown.Item onClick={() => openDeletePatient(patientData?.id)} src={deleteicon} ><img src={ic3} className='icon03' ></img>   Delete</Dropdown.Item>}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className='tw-flex tw-items-center gap13 '>
                <div className="avatarWrap">
                {patientData?.image ? (
                    <img src={patientData?.image} />
                ) : (
                    <span className='avatarSvg'> </span>
                )}
                </div>
                <div className='userDeta tw-flex tw-flex-col'>
                    <h4> {patientData?.name} </h4>
                    <h5>{isMobile && <span> MR# {patientData?.mr_no} |</span>}  {isMobile ? patientData?.gender?.charAt(0).toUpperCase() : patientData?.gender} | {patientData?.age} years </h5>
                    {!isMobile && <span> MR# {patientData?.mr_no} </span>}
                </div>
            </div>
            <ul>
                <li> <i>Number:</i> <span> {patientData?.phone} </span> </li>
                <li> <i>Email:</i> <span> {patientData?.email} </span> </li>
                <li> <i>Address:</i> <span> {patientData?.address} </span> </li>
                <li> <i>City:</i> <span> {patientData?.city} </span> </li>
            </ul>
            <div className='btnsWraper box-fixed'>
                {allowedPermissions["appointments_add"] && <button onClick={()=> openbookAppointment(patientData)} className='bookApp'>Book Appointment</button>}
                {/* <button onClick={() => navigateToPatient()}>Consult Now</button> */}
                {consultNowPermission && <button onClick={() => goForConsultation(patientData?.appointment_id)} disabled={upcomingAppointments?.length == 0} className={upcomingAppointments?.length > 0 ? 'consultNow' : "disableConsultNow"}>Consult Now</button>}
            </div>
            {/* <div style={{ gap: '12px' }} className='d-flex justify-content-end w-100'>
                <img onClick={() => openDeletePatient(patientData?.id)} src={deleteicon} className='' />
                <img src={edit} className='' />
            </div> */}
            <DeletePatientModal patientDelete={patientDelete} comingFromPatientProfile={comingFromPatientProfile} handlePatientDeleteClose={handlePatientDeleteClose} patientDeleteShow={patientDeleteShow} />
            <BookAppointmentModal appointmentClicked={appointmentClicked} setAppointmentClicked={setAppointmentClicked} appointmentData={appointmentData} setAppointmentData={setAppointmentData} doctors={doctors} bookAppointmentShow={bookAppointmentShow} handleBookAppointmentClose={handleBookAppointmentClose} setBookAppointmentShow={setBookAppointmentShow} />
            <EditPatientModal getPatientProfile={getPatientProfile} cities={cities} editPatient={editPatient} handlePatientEditClose={handlePatientEditClose} patientEditShow={patientEditShow} />
        </div>
    )
}

export default ProfileCard;
