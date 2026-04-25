import { useEffect, useState } from 'react';
import './clinicConfiguration.scss'
import { Container, Row, Col, Form } from "react-bootstrap"
import { Button, Tooltip } from 'antd';
import ClinicModal from "../../modal/clinicModal/ClinicModal"
import { Link, useNavigate } from 'react-router-dom';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import EditClinicModal from '../../modal/editClinicModal/EditClinicModal';
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import Loader from '../../loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { clinicSuccess } from '../../../redux/slices/clinicSlice';

const ClinicConfiguration = (props) => {
    const [clinicShow, setClinicShow] = useState(false);
    const [EditClinicShow, setEditClinicShow] = useState(false);
    const [clinicToggle, setClinicToggle] = useState(false);
    const [appointmentData, setAppointmentData] = useState({});
    const [updatemessage, setUpdateMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [clinicData, setClinicData] = useState([]);
    const [singleEditItem, setSingleEditItem] = useState({})
    const [doctorId, setDoctorId] = useState(null)
    const [indicationMessage, setIndicationMessage] = useState("");
    const [showTool, setShowTool] = useState(false)
    const [showmr, setShowmr] = useState(false)
    const [index, setIindex] = useState(null)
    const [prefix, setPrefix] = useState(null)
    const [suffix, setSuffix] = useState(null);
    const [userData, setUserData] = useState({})

    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let user = useSelector((state) => state.user.user);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const navigate = useNavigate();

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
        setUserData(user);
    }, [userData, clinicData]);

    useEffect(() => {
        getAppointments();
    }, [])

    useEffect(() => {
        getClinics();
    }, [])

    const getAppointments = async () => {
        try {
            setIsLoading(true)
            const response = await API.get(`/appointment-form-data`);
            if (response?.status == 200) {
                setAppointmentData(response?.data?.data);
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(true)

            console.log(error)
        }
    }


    const updateMr = async () => {
        try {
            if (prefix && suffix) {
                setIsLoading(true)
                const response = await API.put(`/update-mr-num`, {
                    prefix,
                    suffix,
                });
                if (response?.status == 200) {
                    setIsLoading(false)
                    setIndicationMessage(response?.data?.message);
                }
                else {
                    setIsLoading(false)
                    setIndicationMessage(response?.data?.message);
                }
            }
            else {
                setIndicationMessage("Please fill all the required fields");
            }
        } catch (error) {
            setIndicationMessage(error?.response?.message);
        }
    }

    const handleClinicClose = () => setClinicShow(false);
    const handleClinicShow = () => setClinicShow(true);
    const handleEditClinicClose = () => setEditClinicShow(false);

    const handleEditClinicShow = (item) => {
        setEditClinicShow(true);
        setSingleEditItem(item);
    }

    const getClinics = async () => {
        try {
            const response = await API.get(`/get-all-clinics`);
            if (response?.status == 200) {
                setClinicData(response?.data?.data)
                console.log(response.data.data, "getClinics")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setPrefix(appointmentData?.appointment_details?.patient_mr_number_prefix)
        setSuffix(appointmentData?.appointment_details?.patient_mr_number_suffix)
    }, [appointmentData])

    const handleChange = (e) => {
        const { value, checked, name } = e.target;
        if (name == "prefix") {
            let val = value.slice(0, 3)
            setPrefix(val)
        }

        if (name == "suffix") {
            setSuffix(value)
        }
    }

    const dispatch = useDispatch();

    const handleUpdate = (item) => {
        try {
            // navigate("/manage-doctor", {state : {singleClinicDetails : item}})
            dispatch(clinicSuccess(item));
            navigate("/manage-doctor")
        } catch (error) {
            console.log("errror", error);
        }
    }

    const handleOnlyNumber = (e) => {
        e.target.value = e.target.value.replace(/[eE+-]/g, "");
    };

    // const handleShowTool = (idx) => {
    //     setIindex(idx)
    //     setShowTool(!showTool)
    // }

    const handleShowMr = (idx) => {
        setShowmr(!showmr)
    }

    const handleShowToolEnter = (idx) => {
        setIindex(idx);
    };

    const handleShowToolLeave = () => {
        setIindex(null);
    };

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])


    const handleClinicStatus = async (e, item) => {
        const { checked } = e.target;
        const payload = {
            clinic_id: item?.id
        }
        checked ? payload.status = 1 : payload.status = 0;
        setIsLoading(true)
        const response = await API.patch("/update-clinic-status", payload);
        if (response?.status == 200) {
            getClinics();
            setIsLoading(false)
            setIndicationMessage(response?.data?.message)
        }
        else {
            setIsLoading(false)

            setIndicationMessage(response?.data?.message)
        }
    }

    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            {isLoading ?
                <Loader />
                :
                <div className='clinic_Configuration'>
                    <div className="top_wrap">
                        <Container>
                            <Row>
                                <Col lg={9}>
                                    <div className="update">
                                        <div className="customTool">
                                            <span onClick={handleShowMr} onMouseEnter={handleShowMr} onMouseLeave={handleShowMr}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="red">
                                                    <path d="M8.16602 13.1665H9.83268V8.1665H8.16602V13.1665ZM8.99935 6.49984C9.23546 6.49984 9.43338 6.41998 9.5931 6.26025C9.75282 6.10053 9.83268 5.90261 9.83268 5.6665C9.83268 5.43039 9.75282 5.23248 9.5931 5.07275C9.43338 4.91303 9.23546 4.83317 8.99935 4.83317C8.76324 4.83317 8.56532 4.91303 8.4056 5.07275C8.24588 5.23248 8.16602 5.43039 8.16602 5.6665C8.16602 5.90261 8.24588 6.10053 8.4056 6.26025C8.56532 6.41998 8.76324 6.49984 8.99935 6.49984ZM8.99935 17.3332C7.84657 17.3332 6.76324 17.1144 5.74935 16.6769C4.73546 16.2394 3.85352 15.6457 3.10352 14.8957C2.35352 14.1457 1.75977 13.2637 1.32227 12.2498C0.884766 11.2359 0.666016 10.1526 0.666016 8.99984C0.666016 7.84706 0.884766 6.76373 1.32227 5.74984C1.75977 4.73595 2.35352 3.854 3.10352 3.104C3.85352 2.354 4.73546 1.76025 5.74935 1.32275C6.76324 0.885254 7.84657 0.666504 8.99935 0.666504C10.1521 0.666504 11.2355 0.885254 12.2493 1.32275C13.2632 1.76025 14.1452 2.354 14.8952 3.104C15.6452 3.854 16.2389 4.73595 16.6764 5.74984C17.1139 6.76373 17.3327 7.84706 17.3327 8.99984C17.3327 10.1526 17.1139 11.2359 16.6764 12.2498C16.2389 13.2637 15.6452 14.1457 14.8952 14.8957C14.1452 15.6457 13.2632 16.2394 12.2493 16.6769C11.2355 17.1144 10.1521 17.3332 8.99935 17.3332ZM8.99935 15.6665C10.8605 15.6665 12.4368 15.0207 13.7285 13.729C15.0202 12.4373 15.666 10.8609 15.666 8.99984C15.666 7.13873 15.0202 5.56234 13.7285 4.27067C12.4368 2.979 10.8605 2.33317 8.99935 2.33317C7.13824 2.33317 5.56185 2.979 4.27018 4.27067C2.97852 5.56234 2.33268 7.13873 2.33268 8.99984C2.33268 10.8609 2.97852 12.4373 4.27018 13.729C5.56185 15.0207 7.13824 15.6665 8.99935 15.6665Z" fill={themeColor} />
                                                </svg>
                                            </span>
                                            {showmr && <div className="contentToolMr">
                                                <p> MR number can only be changed 3 times in year </p>
                                            </div>}
                                        </div>
                                        <div className="mr_number">
                                            <h6>MR Number</h6>
                                            <input type="text" value={prefix} name='prefix' onChange={handleChange} />
                                            <input type="number" value={suffix} name='suffix' onInput={handleOnlyNumber} onChange={handleChange} />
                                            <Button onClick={updateMr} disabled={allowedPermissions["clinic_configuration_update"] || isLoading} >Update</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3} className='text-md-end box-fixed'>
                                    {allowedPermissions["clinic_configuration_add"] && <Button className="hovering_btn" onClick={handleClinicShow}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                            <path d="M11.1911 13.0096H4.33398V10.7238H11.1911V3.8667H13.4768V10.7238H20.334V13.0096H13.4768V19.8667H11.1911V13.0096Z" fill={themeColor} />
                                        </svg>
                                        <span>Add New Clinic</span>
                                    </Button>}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <div className="bottom-wrap">
                        <Container>
                            <Row>
                                {clinicData?.map((item, idx) => {
                                    return (<>
                                        <Col lg={3}>
                                            <div className="box">
                                                <div className='edit'>
                                                    <div className='tw-flex tw-items-center'>
                                                        {/* <div className="customTool">
                                                            <span onClick={() => handleShowTool(idx)} onMouseEnter={handleShowTool} onMouseLeave={handleShowTool}> <InfoCircleOutlined style={{ color: "red" }} /> </span>
                                                            {(showTool && idx == index) && <div className="contentTool">
                                                                <p> Your clinic is pending approval from the Meri Sehat Admin for online appointments. However, you can still run your clinic manually by booking in-person appointments. </p>
                                                            </div>}
                                                        </div> */}
                                                        <div className="customTool">
                                                            <span
                                                                onMouseEnter={() => handleShowToolEnter(idx)}
                                                                onMouseLeave={handleShowToolLeave}
                                                            >
                                                                <InfoCircleOutlined style={{ color: "red" }} />
                                                            </span>
                                                            {index === idx && (
                                                                <div className="contentTool">
                                                                    <p>Your clinic is pending approval from the Meri Sehat Admin for online appointments. However, you can still run your clinic manually by booking in-person appointments.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <h6>{item?.clinic_name}</h6>
                                                    </div>
                                                    <div>
                                                        {allowedPermissions["clinic_configuration_update"] && <button onClick={() => handleEditClinicShow(item)}><EditOutlined /></button>}
                                                        {user?.is_clinic_admin == 1 && user?.id !== item?.id ? (<Form.Check
                                                            type="switch"
                                                            id="custom-switch"
                                                            disabled={item?.is_clinic_admin == 1}
                                                            checked={item?.clinic_status == 1}
                                                            onChange={(e) => handleClinicStatus(e, item)}
                                                        />) : null}
                                                    </div>
                                                </div>
                                                <span> {item?.address} </span>
                                                <div className="box-wrap">
                                                    <p>Manage Doctors</p>
                                                    {(allowedPermissions["clinic_configuration_add"] && allowedPermissions["clinic_configuration_update"]) &&  <span onClick={() => { handleUpdate(item) }}>
                                                        Add/Update
                                                    </span>}
                                                </div>
                                            </div>
                                        </Col>
                                    </>)
                                })}
                            </Row>
                        </Container>
                    </div>
                    <ClinicModal indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} handleClinicClose={handleClinicClose} clinicShow={clinicShow} getClinics={getClinics} />
                    <EditClinicModal handleEditClinicClose={handleEditClinicClose} EditClinicShow={EditClinicShow} getClinics={getClinics} singleEditItem={singleEditItem} />
                </div>
            }
        </>
    )
}

export default ClinicConfiguration;