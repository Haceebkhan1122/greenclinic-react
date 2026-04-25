import React, { useEffect, useState } from 'react'
import WraperLayout from '../wraperLayout/WraperLayout'
import "./manageDoctor.scss";
import Edit from "../../assets/images/svg/edit_blue.svg";
import { Col, Container, Row, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoCam from '../../assets/images/svg/videocam.svg'
import ReminderMedical from '../../assets/images/svg/reminder-medical.svg'
import { ConsoleSqlOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import AssignDoctorModal from '../../components/modal/assignDoctorModal/AssignDoctorModal'
import DoctorModal from '../../components/modal/doctorModal/DoctorModal'
import InPersonModal from '../modal/inPersonModal/InPersonModal';
import VideoConsultationModal from '../modal/videoConsultationModal/VideoConsultationModal';
import API, { API_MS } from '../../services/httpInstance/index';
import Loader from '../loader/Loader';
import NewDoctorModal from '../modal/newDoctorModal/NewDoctorModal';
import OnlineInPersonConsultationModal from '../modal/onlineInPersonConsultationModal/OnlineInPersonConsultationModal';
import OnlineInPersonEditModal from '../modal/onlineInPersonEditModal/OnlineInPersonEditModal';
import { toast } from 'react-toastify';
import InPersonEditModal from '../modal/inPersonEditModal/InPersonEditModal';
import InPersonModalViewModal from '../modal/inPersonModalViewModal/InPersonModalViewModal';
import VideoConsultEditModal from '../modal/videoConsultEditModal/VideoConsultEditModal';
import { useSelector } from 'react-redux';
import EditDoctorModal from '../modal/editDoctorModal/EditDoctorModal';
import { Api } from '@mui/icons-material';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { addDoctorsPerm, manageDoctorsPerm, updateDoctorPerm } from '../../utils/variablesPermissions';

const ManageDoctor = () => {
    const [assignDoctorShow, setAssignDoctorShow] = useState(false);
    const [doctorShow, setDoctorShow] = useState(false);
    const [inPersonShow, setInPersonShow] = useState(false);
    const [videoConsultationShow, setVideoConsultationShow] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [doctorId, setDoctorId] = useState(null);
    const [clinicId, setClinicId] = useState(null);
    const [clinicDoctors, setClinicDoctors] = useState([]);
    const [inPersonConsultationShow, setInPersonConsultationShow] = useState(false);
    const [onlineInPersonConsultationShow, setOnlineInPersonConsultationShow] = useState(false);
    const [onlineConsultations, setOnlineConsultations] = useState(false);
    const [singleViewItem, setSingleViewItem] = useState({})
    const [onlineInPersonEdit, setOnlineInPersonEdit] = useState(false);
    const [singleOnlineInPersonEditItem, setSingleOnlineInPersonEditItem] = useState({})
    const [inPersonData, setInPersonData] = useState([]);
    const [inPersonEditModal, setInPersonEditModal] = useState(false)
    const [singleViewItemVideo, setSingleViewItemVideo] = useState({})
    const [inPersonViewShow, setInPersonViewShow] = useState(false)
    const [inPersonViewData, setInPersonViewData] = useState([])
    const [videoConsultEditShow, setVideoConsultEditShow] = useState(false)
    const [singleVideoEditItem, setSingleVideoEditItem] = useState({})
    const [userId, setUserId] = useState(null)
    const [statusDoctor, setStatusDoctor] = useState(null)
    const [editDoctorShow, setEditDoctorShow] = useState(false)
    const [doctorDetails, setDoctorDetails] = useState({})
    const [indicationMessage, setIndicationMessage] = useState("");
    const [showmr, setShowmr] = useState(false)
    const [isPendingSlot, setIsPendingSlot] = useState("")
    const [mrId, setMrId] = useState(null)
    const [idsEdit, setIdsEdit] = useState([]);
    const [editIdUser, setEditIdUser] = useState(null);
    const [viewDoctorsPage, setViewDoctorsPage] = useState(false)
    
    const [allowedPermissions, setAllowedPermissions] = useState({});
    let userPermissions = useSelector((state) => state.clinic.userPermissions);
    
        useEffect(() => {
            const viewPermission = userPermissions?.find((item) => item.slug === "clinic_configuration_view");
            const childPermissions = viewPermission?.child || [];
            const perms = {};
            childPermissions.forEach(child => {
                perms[child.slug] = true;
            });
            setAllowedPermissions(perms);
        }, [userPermissions]);

    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "doctors_view");
        if (viewPermission && Object.keys(viewPermission).length > 0) {
            setViewDoctorsPage(true)
        }
        else {
            setViewDoctorsPage(false)
            window.location.href = "/settings"; 
        }
    }, [userPermissions]);

    const handleShowMr = (item) => {
        setShowmr(!showmr)
        setMrId(item?.id);
    }

    let clinicDetails = useSelector((state) => state.clinic.clinicDetails);
    let user = useSelector((state) => state.user.user);
    const navigate = useNavigate()

    useEffect(() => {
        getDoctorsByClinic();
    }, [])

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    const handleOnlineInPersonEditShow = (item) => {
        setUserId(item?.id)
        setOnlineInPersonEdit(true);
    }

    const handleAssignDoctorClose = (e) => {
        e.preventDefault();
        setAssignDoctorShow(false);
    };

    const handleVideoEditConsultClose = () => {
        setVideoConsultEditShow(false)
    }

    const checkPending = async (id) => {
        const response = await API.get(`/get-ms-doctor-timing-status?doctor_id=${id}&clinic_id=${clinicDetails?.id}`)
        if (response?.data?.data?.result == 0) {
            setIdsEdit([...idsEdit, id])
        }
    }

    useEffect(() => {
        if(editIdUser !== null) {
            checkPending(editIdUser);
        }
    }, [editIdUser, videoConsultEditShow]);

    const handleVideoConsultationShowEdit = (item) => {
        setEditIdUser(item?.id);
        checkPending(item?.id)
        setUserId(item?.id)
        setVideoConsultEditShow(true);
    }

    const handleOnlineInPersonShow = (item) => {
        setDoctorDetails(item);
        setSingleViewItem(item)
        setOnlineInPersonConsultationShow(true);
    }

    const handleDoctorShow = (step) => {
        setDoctorShow(true)
        setCurrentStep(step);
    };

    const getDoctorsByClinic = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-all-doctors-by-clinic_id?clinicId=${clinicDetails?.id}`)
            if (response?.status == 200) {
                setClinicDoctors(response?.data?.data);
                setIsLoading(false);
            }
            else {
                setIsLoading(false)
                toast.error(response?.data?.message)
            }
        } catch (error) {
            console.log("errr", error)
            setIsLoading(false);
        }
    }

    const handleInPersonEditClose = () => {
        setInPersonEditModal(false)
    }

    const handleInPersonEditShow = (item) => {
        setDoctorId(item?.id);
        setInPersonEditModal(true);
    }


    const handleInPersonViewShow = (item) => {
        setDoctorDetails(item)
        setDoctorId(item?.id)
        setInPersonViewShow(true);
    }

    const handleInPersonViewClose = () => {
        setInPersonViewShow(false)
    }

    const handleEditDoctorShow = (item) => {
        setDoctorId(item?.id);
        setSingleVideoEditItem(item);
        setEditDoctorShow(true);
    }

    const handleEditDoctorClose = () => {
        setEditDoctorShow(false)
    }

    const handleVideoConsultationViewShow = (item) => {
        setDoctorDetails(item)
        setVideoConsultationShow(true);
    }

    const location1 = useLocation();

    let detailsClinic = location1?.state?.singleClinicDetails;

    const handleChange = (e, item) => {
        const { value, name, checked } = e.target;
        if (name == "statusDoctor") {
            if (checked) {
                setStatusDoctor(1);
                try {
                    setIsLoading(true)
                    const response = API.patch(`/update-doctor-status`, {
                        doctorId: item?.id,
                        status: 1,
                    })
                    if (response?.status == 200) {
                        setIndicationMessage(response?.data?.message)
                        getDoctorsByClinic();
                        setIsLoading(false)
                    }
                    else {
                        toast.error(response?.data?.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        })
                        setIsLoading(false)
                    }
                } catch (error) {
                    console.log("error")
                    setIsLoading(false);
                }
            } else {
                setStatusDoctor(0);
                try {
                    setIsLoading(true)
                    const response = API.patch(`/update-doctor-status`, {
                        doctorId: item?.id,
                        status: 0,
                    })
                    if (response?.status == 200) {
                        setIndicationMessage(response?.data?.message);
                        getDoctorsByClinic();
                        setIsLoading(false)
                    }
                    else {
                        toast.error(response?.data?.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        })
                        setIsLoading(false)
                    }
                } catch (error) {
                    console.log("error")
                    setIsLoading(false);
                }
            }
        }
    }

    const handleAssignDoctorShow = () => setAssignDoctorShow(true);

    const handleDoctorClose = () => setDoctorShow(false);
    const handleInPersonClose = () => setInPersonShow(false);
    const handleOnlineInPersonClose = () => setOnlineInPersonConsultationShow(false);
    const handleVideoConsultationClose = () => setVideoConsultationShow(false);
    const handleOnlineInPersonEditClose = () => setOnlineInPersonEdit(false);

    return (
        <WraperLayout>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            {isLoading ? <Loader />
                :
                <div className="manage_doctor">
                    <div className="top-wrap">
                        <Container>
                            <Row className='align-items-center'>
                                <Col lg={8}>
                                    <div className='heading'>
                                        <button className='back' onClick={() => navigate("/settings")}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                <path d="M12.7383 5.09521L7.64286 10.1906L12.7383 15.2861" stroke="#0F75BC" stroke-width="1.69847" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </button>
                                        <h4>{clinicDetails?.clinic_name}</h4>
                                        <img src={Edit} alt="" />   
                                    </div>
                                </Col>
                                <Col lg={4} className="text-end box-fixed tw-flex tw-justify-end tw-items-center">
                                    <button className='button1' onClick={handleAssignDoctorShow}>Assign Doctor</button>
                                    {allowedPermissions[`${addDoctorsPerm}`] && <button className='button1 d-flex' onClick={() => handleDoctorShow(1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                            <path d="M11.1911 13.0432H4.33398V10.7575H11.1911V3.90039H13.4768V10.7575H20.334V13.0432H13.4768V19.9004H11.1911V13.0432Z" fill="#0F75BC" />
                                        </svg> Add New Doctor
                                    </button>}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <div className='bottom__wrap'>
                        <Col lg={12}>
                            <Row className={"tw-px-4"}>
                                {clinicDoctors?.map((item, idx) => {
                                    return (<>
                                        <Col lg={3}>
                                            <div className="box" key={item?.id}>
                                                <div className='doctor_head'>
                                                    <h5>{item?.name}</h5>
                                                    {(item?.isClinicAdmin == 1 && allowedPermissions[`${updateDoctorPerm}`]) && <div>
                                                        <button><EditOutlined onClick={() => { handleEditDoctorShow(item) }} /></button>
                                                        <Form.Check
                                                            type="switch"
                                                            id="custom-switch"
                                                            name="statusDoctor"
                                                            onChange={(e) => handleChange(e, item)}
                                                            defaultChecked={item?.status == 1 ? true : false}
                                                        />
                                                    </div>}
                                                    {(item?.isClinicAdmin == 0 && item?.id == user?.id) && <div>
                                                        <button><EditOutlined onClick={() => { handleEditDoctorShow(item) }} /></button>
                                                        <Form.Check
                                                            type="switch"
                                                            id="custom-switch"
                                                            name="statusDoctor"
                                                            onChange={(e) => handleChange(e, item)}
                                                            defaultChecked={item?.status == 1 ? true : false}
                                                        />
                                                    </div>}
                                                </div>
                                                <div className="box-wrap">
                                                    <h6><img src={ReminderMedical} alt="" />In-person Consultation</h6>
                                                    <div>
                                                        <button onClick={() => handleInPersonEditShow(item)}><EditOutlined /></button>
                                                        <button onClick={() => { handleInPersonViewShow(item) }}><EyeOutlined /></button>
                                                    </div>
                                                </div>
                                                <div className="box-wrap">
                                                    <h6><img src={ReminderMedical} alt="" /> Online In-person Consultation</h6>
                                                    <div>
                                                        <button onClick={() => { handleOnlineInPersonEditShow(item) }}><EditOutlined /></button>
                                                        <button onClick={() => handleOnlineInPersonShow(item)}><EyeOutlined /></button>
                                                    </div>
                                                </div>
                                                <div className="box-wrap">
                                                    <div className='tw-flex tw-gap-[6px] tw-items-center'>
                                                        <img src={VideoCam} alt="" />
                                                        <h6> Video Consultation </h6>
                                                        {/* {idsEdit.includes(item?.id) && <div className="customTool">
                                                            <span onClick={()=> handleShowMr(item)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="red">
                                                                    <path d="M8.16602 13.1665H9.83268V8.1665H8.16602V13.1665ZM8.99935 6.49984C9.23546 6.49984 9.43338 6.41998 9.5931 6.26025C9.75282 6.10053 9.83268 5.90261 9.83268 5.6665C9.83268 5.43039 9.75282 5.23248 9.5931 5.07275C9.43338 4.91303 9.23546 4.83317 8.99935 4.83317C8.76324 4.83317 8.56532 4.91303 8.4056 5.07275C8.24588 5.23248 8.16602 5.43039 8.16602 5.6665C8.16602 5.90261 8.24588 6.10053 8.4056 6.26025C8.56532 6.41998 8.76324 6.49984 8.99935 6.49984ZM8.99935 17.3332C7.84657 17.3332 6.76324 17.1144 5.74935 16.6769C4.73546 16.2394 3.85352 15.6457 3.10352 14.8957C2.35352 14.1457 1.75977 13.2637 1.32227 12.2498C0.884766 11.2359 0.666016 10.1526 0.666016 8.99984C0.666016 7.84706 0.884766 6.76373 1.32227 5.74984C1.75977 4.73595 2.35352 3.854 3.10352 3.104C3.85352 2.354 4.73546 1.76025 5.74935 1.32275C6.76324 0.885254 7.84657 0.666504 8.99935 0.666504C10.1521 0.666504 11.2355 0.885254 12.2493 1.32275C13.2632 1.76025 14.1452 2.354 14.8952 3.104C15.6452 3.854 16.2389 4.73595 16.6764 5.74984C17.1139 6.76373 17.3327 7.84706 17.3327 8.99984C17.3327 10.1526 17.1139 11.2359 16.6764 12.2498C16.2389 13.2637 15.6452 14.1457 14.8952 14.8957C14.1452 15.6457 13.2632 16.2394 12.2493 16.6769C11.2355 17.1144 10.1521 17.3332 8.99935 17.3332ZM8.99935 15.6665C10.8605 15.6665 12.4368 15.0207 13.7285 13.729C15.0202 12.4373 15.666 10.8609 15.666 8.99984C15.666 7.13873 15.0202 5.56234 13.7285 4.27067C12.4368 2.979 10.8605 2.33317 8.99935 2.33317C7.13824 2.33317 5.56185 2.979 4.27018 4.27067C2.97852 5.56234 2.33268 7.13873 2.33268 8.99984C2.33268 10.8609 2.97852 12.4373 4.27018 13.729C5.56185 15.0207 7.13824 15.6665 8.99935 15.6665Z" fill={""} />
                                                                </svg>
                                                            </span>
                                                            {(showmr && mrId == item?.id) && <div className="contentToolMr cntent_manage">
                                                                <p> Your newly added slots are pending approval from the Meri Sehat Admin. We will notify you once they are approved and live on the website. </p>
                                                            </div>}
                                                        </div> } */}
                                                    </div>
                                                    <div>
                                                        <button onClick={() => handleVideoConsultationShowEdit(item)}><EditOutlined /></button>
                                                        <button onClick={() => handleVideoConsultationViewShow(item)}><EyeOutlined /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </>)
                                })}
                            </Row>
                        </Col>
                    </div>
                </div>
            }
            <AssignDoctorModal indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} setAssignDoctorShow={setAssignDoctorShow} getDoctorsByClinic={getDoctorsByClinic} handleAssignDoctorClose={handleAssignDoctorClose} assignDoctorShow={assignDoctorShow} clinicId={clinicId} />
            <NewDoctorModal indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} clinicId={clinicId} getDoctorsByClinic={getDoctorsByClinic} handleDoctorClose={handleDoctorClose} doctorShow={doctorShow} setCurrentStep={setCurrentStep} isLoading={isLoading} setIsLoading={setIsLoading} />
            <InPersonModal setIndicationMessage={setIndicationMessage} doctorId={doctorId} handleInPersonClose={handleInPersonClose} inPersonShow={inPersonShow} />
            <VideoConsultationModal setIndicationMessage={setIndicationMessage} setVideoConsultEditShow={setVideoConsultEditShow} doctorDetails={doctorDetails} handleVideoConsultationClose={handleVideoConsultationClose} videoConsultationShow={videoConsultationShow} clinicId={clinicId} doctorId={doctorId} inPersonViewData={inPersonViewData} singleViewItemVideo={singleViewItemVideo} />
            <OnlineInPersonConsultationModal  setOnlineInPersonEdit={setOnlineInPersonEdit} doctorDetails={doctorDetails} onlineInPersonConsultationShow={onlineInPersonConsultationShow} handleOnlineInPersonClose={handleOnlineInPersonClose} clinicId={clinicId} doctorId={doctorId} singleViewItem={singleViewItem} />
            <OnlineInPersonEditModal setIndicationMessage={setIndicationMessage} userId={userId} indicationMessage={indicationMessage} doctorId={doctorId} onlineInPersonEdit={onlineInPersonEdit} handleOnlineInPersonEditClose={handleOnlineInPersonEditClose} singleOnlineInPersonEditItem={singleOnlineInPersonEditItem} inPersonData={inPersonData} />
            <InPersonEditModal setIndicationMessage={setIndicationMessage} doctorId={doctorId} inPersonEditModal={inPersonEditModal} handleInPersonEditClose={handleInPersonEditClose} inPersonData={inPersonData} clinicId={clinicId} />
            <VideoConsultEditModal setIndicationMessage={setIndicationMessage} setVideoConsultEditShow={setVideoConsultEditShow} userId={userId} doctorId={doctorId} videoConsultEditShow={videoConsultEditShow} handleVideoEditConsultClose={handleVideoEditConsultClose} inPersonData={inPersonData} clinicId={clinicId} />
            <InPersonModalViewModal setIndicationMessage={setIndicationMessage} setInPersonEditModal={setInPersonEditModal} handleInPersonEditShow={handleInPersonEditShow} indicationMessage={indicationMessage} doctorDetails={doctorDetails} doctorId={doctorId} isLoading={isLoading} setIsLoading={setIsLoading} inPersonViewData={inPersonViewData} handleInPersonViewClose={handleInPersonViewClose} inPersonViewShow={inPersonViewShow} />
            <EditDoctorModal editDoctorShow={editDoctorShow} handleEditDoctorClose={handleEditDoctorClose} singleVideoEditItem={singleVideoEditItem} getDoctorsByClinic={getDoctorsByClinic} handleDoctorClose={handleDoctorClose} isLoading={isLoading} setIsLoading={setIsLoading} />
        </WraperLayout>
    )
}

export default ManageDoctor;