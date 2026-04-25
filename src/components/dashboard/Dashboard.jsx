import { Col, Form, Row, Table } from 'react-bootstrap';
import WraperLayout from '../wraperLayout/WraperLayout';
import { DatePicker, Divider } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import API from '../../services/httpInstance';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import moment from "moment";
import BookAppointmentModal from '../modal/bookAppointmentModal/BookAppointmentModal';
import { useSelector } from 'react-redux';
import WelcomeUser from '../modal/welcomeModal/WelcomeModal';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './dashboard.scss';
import { clinicSuccess, savePermissions } from '../../redux/slices/clinicSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';

const Dashboard = () => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [dataTiles, setDataTiles] = useState([]);
    const [clinicList, setClinicList] = useState([]);
    const [appointmentsList, setAppointmentsList] = useState([]);
    const [userData, setUserData] = useState({});
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState("1");
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [showInvoiceNumber, setShowInvoiceNumber] = useState(true);
    const [doctors, setDoctors] = useState(null);
    const [doctorsId, setDoctorsId] = useState(null);
    const [clinicId, setClinicId] = useState(null);
    const [bookAppointmentShow, setBookAppointmentShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showWelcome, setShowWelcome] = useState(false)
    const [isDate, setIsDate] = useState(moment().format(null))
    let user = useSelector((state) => state.user.user);

    const [allowedPermissions, setAllowedPermissions] = useState({});
    const [viewStats, setViewStats] = useState(false);
    const [viewList, setViewList] = useState(false);
    let userPermissions = useSelector((state) => state.clinic.userPermissions);
    const dispatch = useDispatch();
    console.log({userPermissions})
    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "appointments_view");
        const childPermissions = viewPermission?.child || [];
        const perms = {};
        childPermissions.forEach(child => {
            perms[child.slug] = true;
        });
        setAllowedPermissions(perms);
    }, [userPermissions]);
 
    useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "dashboard");
    const viewPermission2 = userPermissions?.find((item) => item.slug === "appointments_view");

    if (viewPermission && Object.keys(viewPermission).length > 0) {
        setViewStats(true);
    }

    if (viewPermission2 && Object.keys(viewPermission2).length > 0) {
        setViewList(true);
    }
}, [userPermissions]);
    const handleBookAppointmentClose = () => setBookAppointmentShow(false);

    useEffect(() => {
        const todayFormatted = dayjs().format("YYYY/MM/DD");
        setIsDate(todayFormatted);
    }, [])

    const getDashboardTiles = async () => {
        try {
            const response = await API.get(`/dashboard`)
            if (response?.status == 200) {
                setDataTiles(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getClinicList = async () => {
        try {
            const response = await API.get(`/clinic-list`)
            if (response?.status == 200) {
                setClinicList(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDateChange = (date, dateString) => {
        // getListingAppointments(1, dateString)
        if (!date) {
            setIsDate(null); // Clear the state when the date is removed
            return;
        }
        let formatDate = dayjs(date).format("YYYY/MM/DD");
        setIsDate(formatDate);
    };

    const filteredData = searchTerm
        ? appointmentsList?.filter((item) =>
            item?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.patient_mr_no?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : appointmentsList;

    const getListingAppointments = async (pageNumber, dateString) => {
        try {
            const filterString = 'all'
            const isDashboard = "1"
            const params = {};
            if (isDate) {
                const formattedDate = moment(isDate).format("YYYY-MM-DD");
                params.date = formattedDate;
            }
            if (filterString) params.filter = filterString;
            if (isDashboard) params.is_dashboard = isDashboard;
            if (doctorsId) params.doctor_id = doctorsId;
            if (clinicId) params.clinic = clinicId;
            if (pageNumber) params.page = pageNumber;
            let endPointListing = `/appointment-listing-filter`;
            let endPointOnline = `/appointment-listing-online`;
            const response = await API.get(viewList ? endPointListing : endPointOnline, { params });
            if (response?.status == 200 && response?.data?.data?.appointments.length > 0) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setAppointmentsList(response?.data?.data?.appointments)
                setPaginateCountData(response?.data?.data?.pagination)
            }
            else {
                setTotalPages(null);
                setAppointmentsList(null)
                setPaginateCountData(null)
            }
        } catch (error) {
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

      const saveClinic = async (clinicId) => {
        try {
            const payload = {
            clinic_id: clinicId
            };
            const saveId = await API.post('/save-clinic', payload)
            if (saveId?.status == 200) {
            dispatch(clinicSuccess(clinicId));
            dispatch(savePermissions(saveId?.data?.data?.permissions))
            Cookies.set('appointmentType', saveId?.data?.data?.appointment_type)
            Cookies.set('previousAppointment', saveId?.data?.data?.previous_appointment_billing)
            Cookies.set('clinicAllowMedProtocol', saveId?.data?.data?.clinicAllowMedProtocol)
            Cookies.set('message', saveId?.data?.data?.message)
            } else {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
        
  }

useEffect(() => {
  if (Array.isArray(clinicList) && clinicList.length === 1) {
    const clinicId = clinicList[0]?.id;
    if (clinicId) {
      saveClinic(clinicId);
    }
  }
}, [clinicList.length]);

    useEffect(() => {
        getAllDoctors()
        getClinicList()
        getDashboardTiles()
    }, [])

    const router = useLocation();
    let pathname = router.pathname;
    const [userDataa, setUserDataa] = useState({});

    const getUser = async () => {
        try {
            const response = await API.get(`/user`);
            if (response?.status === 200) {
                setUserDataa(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        let timeoutId;
        const handleWelcome = async () => {
            if (userDataa?.is_welcome === 1) {
                setShowWelcome(true);
                timeoutId = setTimeout(async () => {
                    try {
                        await API.get("/update-user-welcome-notification");
                        setShowWelcome(false);
                        getUser();
                    } catch (err) {
                        console.error(err);
                    }
                }, 3000);
            } else {
                setShowWelcome(false);
            }
        };
        handleWelcome();
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [userDataa]);

    const handleBookAppointmentShow = () => {
        setBookAppointmentShow(true);
    }

    useEffect(() => {
        if (userData?.id) {
            getListingAppointments(currentPage);
        }
    }, [userData?.id, viewList, doctorsId]);

    useEffect(() => {
        if (userData?.id && currentPage !== 1) {
            getListingAppointments(currentPage);
        }
    }, [currentPage, doctorsId, clinicId, isDate]);

    useEffect(() => {
        getListingAppointments(currentPage);
    }, [currentPage, doctorsId, clinicId, isDate]);


    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };

    const handleDoctorId = (e) => {
        const value = e.target.value;
        setDoctorsId(value)
    }

    const handleClinicId = (e) => {
        const value = e.target.value;
        setClinicId(value)
    }

    const handleCloseWelcome = () => {
        setShowWelcome(false);
    }

    const handlePrevDate = () => {
        setIsDate((prev) => dayjs(prev).subtract(1, "day").format("YYYY-MM-DD"));
    };

    const handleNextDate = () => {
        setIsDate((prev) => dayjs(prev).add(1, "day").format("YYYY-MM-DD"));
    };

    return (
        <WraperLayout className='dashboard'>
            {viewStats && <div className="card_wraper">
                {dataTiles?.map((items, index) => (
                    <Link to={index == 0 ? "/appointments" : index == 1 ? "/appointments" : index == 2 ? "/invoices" : index == 3 ? "/patients" : index == 4 ? "/prescriptions" : ""} className="singleCard">
                        <h3> {items?.heading} </h3>
                        {index === 2 ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <h2 style={{ color: themeColor, margin: 0 }}>
                                    {showInvoiceNumber ? "*******" : items?.number?.toString().slice(0, 13)}
                                </h2>
                                <span style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowInvoiceNumber((prev) => !prev);
                                    }}
                                >
                                    {showInvoiceNumber ? (<EyeInvisibleOutlined />) : (<EyeOutlined />)}
                                </span>
                            </div>
                        ) :
                            <h2 style={{ color: themeColor }}> {items?.number?.toString().slice(0, 13)} </h2>
                        }
                        <div className="wrape">
                            <p> {items?.date} </p>
                            {index == 0 && (
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <path d="M4.30544 19.0028C3.85111 19.0028 3.46217 18.841 3.13863 18.5175C2.81509 18.194 2.65332 17.805 2.65332 17.3507V5.78582C2.65332 5.33148 2.81509 4.94254 3.13863 4.619C3.46217 4.29546 3.85111 4.13369 4.30544 4.13369H5.13151V2.48157H6.78363V4.13369H13.3921V2.48157H15.0442V4.13369H15.8703C16.3246 4.13369 16.7136 4.29546 17.0371 4.619C17.3607 4.94254 17.5224 5.33148 17.5224 5.78582V17.3507C17.5224 17.805 17.3607 18.194 17.0371 18.5175C16.7136 18.841 16.3246 19.0028 15.8703 19.0028H4.30544ZM4.30544 17.3507H15.8703V9.09006H4.30544V17.3507ZM4.30544 7.43794H15.8703V5.78582H4.30544V7.43794ZM10.0879 12.3943C9.85383 12.3943 9.65764 12.3151 9.49931 12.1568C9.34098 11.9985 9.26182 11.8023 9.26182 11.5682C9.26182 11.3342 9.34098 11.138 9.49931 10.9797C9.65764 10.8214 9.85383 10.7422 10.0879 10.7422C10.3219 10.7422 10.5181 10.8214 10.6764 10.9797C10.8348 11.138 10.9139 11.3342 10.9139 11.5682C10.9139 11.8023 10.8348 11.9985 10.6764 12.1568C10.5181 12.3151 10.3219 12.3943 10.0879 12.3943ZM6.78363 12.3943C6.54958 12.3943 6.35339 12.3151 6.19506 12.1568C6.03673 11.9985 5.95757 11.8023 5.95757 11.5682C5.95757 11.3342 6.03673 11.138 6.19506 10.9797C6.35339 10.8214 6.54958 10.7422 6.78363 10.7422C7.01768 10.7422 7.21387 10.8214 7.3722 10.9797C7.53053 11.138 7.60969 11.3342 7.60969 11.5682C7.60969 11.8023 7.53053 11.9985 7.3722 12.1568C7.21387 12.3151 7.01768 12.3943 6.78363 12.3943ZM13.3921 12.3943C13.1581 12.3943 12.9619 12.3151 12.8036 12.1568C12.6452 11.9985 12.5661 11.8023 12.5661 11.5682C12.5661 11.3342 12.6452 11.138 12.8036 10.9797C12.9619 10.8214 13.1581 10.7422 13.3921 10.7422C13.6262 10.7422 13.8224 10.8214 13.9807 10.9797C14.139 11.138 14.2182 11.3342 14.2182 11.5682C14.2182 11.8023 14.139 11.9985 13.9807 12.1568C13.8224 12.3151 13.6262 12.3943 13.3921 12.3943ZM10.0879 15.6986C9.85383 15.6986 9.65764 15.6194 9.49931 15.4611C9.34098 15.3027 9.26182 15.1065 9.26182 14.8725C9.26182 14.6384 9.34098 14.4423 9.49931 14.2839C9.65764 14.1256 9.85383 14.0464 10.0879 14.0464C10.3219 14.0464 10.5181 14.1256 10.6764 14.2839C10.8348 14.4423 10.9139 14.6384 10.9139 14.8725C10.9139 15.1065 10.8348 15.3027 10.6764 15.4611C10.5181 15.6194 10.3219 15.6986 10.0879 15.6986ZM6.78363 15.6986C6.54958 15.6986 6.35339 15.6194 6.19506 15.4611C6.03673 15.3027 5.95757 15.1065 5.95757 14.8725C5.95757 14.6384 6.03673 14.4423 6.19506 14.2839C6.35339 14.1256 6.54958 14.0464 6.78363 14.0464C7.01768 14.0464 7.21387 14.1256 7.3722 14.2839C7.53053 14.4423 7.60969 14.6384 7.60969 14.8725C7.60969 15.1065 7.53053 15.3027 7.3722 15.4611C7.21387 15.6194 7.01768 15.6986 6.78363 15.6986ZM13.3921 15.6986C13.1581 15.6986 12.9619 15.6194 12.8036 15.4611C12.6452 15.3027 12.5661 15.1065 12.5661 14.8725C12.5661 14.6384 12.6452 14.4423 12.8036 14.2839C12.9619 14.1256 13.1581 14.0464 13.3921 14.0464C13.6262 14.0464 13.8224 14.1256 13.9807 14.2839C14.139 14.4423 14.2182 14.6384 14.2182 14.8725C14.2182 15.1065 14.139 15.3027 13.9807 15.4611C13.8224 15.6194 13.6262 15.6986 13.3921 15.6986Z" fill={themeColor} />
                                    </svg>
                                </span>
                            )}
                            {index == 1 && (
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <path d="M4.30544 19.0028C3.85111 19.0028 3.46217 18.841 3.13863 18.5175C2.81509 18.194 2.65332 17.805 2.65332 17.3507V5.78582C2.65332 5.33148 2.81509 4.94254 3.13863 4.619C3.46217 4.29546 3.85111 4.13369 4.30544 4.13369H5.13151V2.48157H6.78363V4.13369H13.3921V2.48157H15.0442V4.13369H15.8703C16.3246 4.13369 16.7136 4.29546 17.0371 4.619C17.3607 4.94254 17.5224 5.33148 17.5224 5.78582V17.3507C17.5224 17.805 17.3607 18.194 17.0371 18.5175C16.7136 18.841 16.3246 19.0028 15.8703 19.0028H4.30544ZM4.30544 17.3507H15.8703V9.09006H4.30544V17.3507ZM4.30544 7.43794H15.8703V5.78582H4.30544V7.43794ZM10.0879 12.3943C9.85383 12.3943 9.65764 12.3151 9.49931 12.1568C9.34098 11.9985 9.26182 11.8023 9.26182 11.5682C9.26182 11.3342 9.34098 11.138 9.49931 10.9797C9.65764 10.8214 9.85383 10.7422 10.0879 10.7422C10.3219 10.7422 10.5181 10.8214 10.6764 10.9797C10.8348 11.138 10.9139 11.3342 10.9139 11.5682C10.9139 11.8023 10.8348 11.9985 10.6764 12.1568C10.5181 12.3151 10.3219 12.3943 10.0879 12.3943ZM6.78363 12.3943C6.54958 12.3943 6.35339 12.3151 6.19506 12.1568C6.03673 11.9985 5.95757 11.8023 5.95757 11.5682C5.95757 11.3342 6.03673 11.138 6.19506 10.9797C6.35339 10.8214 6.54958 10.7422 6.78363 10.7422C7.01768 10.7422 7.21387 10.8214 7.3722 10.9797C7.53053 11.138 7.60969 11.3342 7.60969 11.5682C7.60969 11.8023 7.53053 11.9985 7.3722 12.1568C7.21387 12.3151 7.01768 12.3943 6.78363 12.3943ZM13.3921 12.3943C13.1581 12.3943 12.9619 12.3151 12.8036 12.1568C12.6452 11.9985 12.5661 11.8023 12.5661 11.5682C12.5661 11.3342 12.6452 11.138 12.8036 10.9797C12.9619 10.8214 13.1581 10.7422 13.3921 10.7422C13.6262 10.7422 13.8224 10.8214 13.9807 10.9797C14.139 11.138 14.2182 11.3342 14.2182 11.5682C14.2182 11.8023 14.139 11.9985 13.9807 12.1568C13.8224 12.3151 13.6262 12.3943 13.3921 12.3943ZM10.0879 15.6986C9.85383 15.6986 9.65764 15.6194 9.49931 15.4611C9.34098 15.3027 9.26182 15.1065 9.26182 14.8725C9.26182 14.6384 9.34098 14.4423 9.49931 14.2839C9.65764 14.1256 9.85383 14.0464 10.0879 14.0464C10.3219 14.0464 10.5181 14.1256 10.6764 14.2839C10.8348 14.4423 10.9139 14.6384 10.9139 14.8725C10.9139 15.1065 10.8348 15.3027 10.6764 15.4611C10.5181 15.6194 10.3219 15.6986 10.0879 15.6986ZM6.78363 15.6986C6.54958 15.6986 6.35339 15.6194 6.19506 15.4611C6.03673 15.3027 5.95757 15.1065 5.95757 14.8725C5.95757 14.6384 6.03673 14.4423 6.19506 14.2839C6.35339 14.1256 6.54958 14.0464 6.78363 14.0464C7.01768 14.0464 7.21387 14.1256 7.3722 14.2839C7.53053 14.4423 7.60969 14.6384 7.60969 14.8725C7.60969 15.1065 7.53053 15.3027 7.3722 15.4611C7.21387 15.6194 7.01768 15.6986 6.78363 15.6986ZM13.3921 15.6986C13.1581 15.6986 12.9619 15.6194 12.8036 15.4611C12.6452 15.3027 12.5661 15.1065 12.5661 14.8725C12.5661 14.6384 12.6452 14.4423 12.8036 14.2839C12.9619 14.1256 13.1581 14.0464 13.3921 14.0464C13.6262 14.0464 13.8224 14.1256 13.9807 14.2839C14.139 14.4423 14.2182 14.6384 14.2182 14.8725C14.2182 15.1065 14.139 15.3027 13.9807 15.4611C13.8224 15.6194 13.6262 15.6986 13.3921 15.6986Z" fill={themeColor} />
                                    </svg>
                                </span>
                            )}
                            {index == 2 && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="34" viewBox="0 0 35 34" fill="none">
                                    <circle cx="17.3358" cy="16.8722" r="16.8517" fill="#DBF6FF" />
                                    <path d="M14.3416 12.8721C14.9801 12.8721 15.5064 12.9491 15.9203 13.1031C16.3375 13.2571 16.6471 13.4898 16.8493 13.801C17.0514 14.1123 17.1525 14.5054 17.1525 14.9803C17.1525 15.3012 17.0915 15.5819 16.9696 15.8226C16.8477 16.0633 16.6872 16.267 16.4883 16.4339C16.2893 16.6008 16.0743 16.7371 15.8433 16.843L17.913 19.9091H16.2572L14.5774 17.2088H13.7832V19.9091H12.2911V12.8721H14.3416ZM14.2357 14.0946H13.7832V15.9959H14.2646C14.7587 15.9959 15.1117 15.9141 15.3235 15.7504C15.5385 15.5836 15.646 15.3397 15.646 15.0188C15.646 14.6851 15.5304 14.4476 15.2994 14.3064C15.0716 14.1652 14.717 14.0946 14.2357 14.0946ZM22.4374 18.3111C22.4374 18.6769 22.3508 18.9865 22.1775 19.24C22.0074 19.4903 21.7523 19.6813 21.4122 19.8128C21.0721 19.9412 20.6485 20.0054 20.1415 20.0054C19.7661 20.0054 19.4436 19.9813 19.174 19.9332C18.9077 19.885 18.6382 19.8048 18.3654 19.6925V18.4795C18.6574 18.6111 18.9703 18.7202 19.304 18.8068C19.6409 18.8903 19.9361 18.932 20.1896 18.932C20.4752 18.932 20.679 18.8903 20.8009 18.8068C20.9261 18.7202 20.9886 18.6079 20.9886 18.4699C20.9886 18.3801 20.963 18.2998 20.9116 18.2293C20.8635 18.1555 20.7576 18.0736 20.5939 17.9838C20.4303 17.8907 20.1736 17.7704 19.8238 17.6228C19.4869 17.4816 19.2093 17.3388 18.9911 17.1944C18.7761 17.05 18.6157 16.8799 18.5098 16.6842C18.4071 16.4852 18.3558 16.2333 18.3558 15.9285C18.3558 15.4311 18.5483 15.0573 18.9334 14.807C19.3216 14.5535 19.8399 14.4268 20.4881 14.4268C20.8218 14.4268 21.1394 14.4605 21.4411 14.5278C21.7459 14.5952 22.0588 14.7027 22.3796 14.8503L21.9368 15.9093C21.6705 15.7937 21.4186 15.6991 21.1812 15.6253C20.9469 15.5515 20.7079 15.5146 20.464 15.5146C20.249 15.5146 20.0869 15.5434 19.9778 15.6012C19.8687 15.659 19.8142 15.7472 19.8142 15.8659C19.8142 15.9526 19.8415 16.0296 19.896 16.097C19.9538 16.1644 20.0629 16.2398 20.2233 16.3232C20.387 16.4034 20.626 16.5077 20.9405 16.6361C21.2453 16.7612 21.5101 16.8928 21.7347 17.0307C21.9593 17.1655 22.1326 17.334 22.2545 17.5361C22.3764 17.7351 22.4374 17.9934 22.4374 18.3111Z" fill={themeColor} />
                                    <circle cx="17.3485" cy="16.9173" r="9.2246" stroke={themeColor} stroke-width="1.77605" />
                                </svg>
                            )}
                            {index == 3 && (
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <path d="M3.32838 4.31233C2.99931 4.31233 2.68371 4.44305 2.45102 4.67574C2.21833 4.90843 2.08761 5.22403 2.08761 5.5531V17.3404C2.08761 17.6695 2.21833 17.9851 2.45102 18.2178C2.68371 18.4505 2.99931 18.5812 3.32838 18.5812H16.9769C17.3059 18.5812 17.6215 18.4505 17.8542 18.2178C18.0869 17.9851 18.2176 17.6695 18.2176 17.3404V5.5531C18.2176 5.22403 18.0869 4.90843 17.8542 4.67574C17.6215 4.44305 17.3059 4.31233 16.9769 4.31233H14.4953M5.80993 2.45117V6.17349M14.4953 2.45117V6.17349M5.80993 4.31233H12.0138" stroke={themeColor} stroke-width="2.06602" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.14324 7.49316C8.9787 7.49316 8.8209 7.55853 8.70456 7.67487C8.58821 7.79122 8.52285 7.94901 8.52285 8.11355V9.85808H6.77584C6.61131 9.85808 6.45351 9.92344 6.33716 10.0398C6.22082 10.1561 6.15546 10.3139 6.15546 10.4785V12.4947C6.15546 12.6593 6.22082 12.8171 6.33716 12.9334C6.45351 13.0497 6.61131 13.1151 6.77584 13.1151H8.52161V14.8596C8.52161 15.0242 8.58697 15.182 8.70332 15.2983C8.81966 15.4147 8.97746 15.48 9.14199 15.48H11.1582C11.2397 15.48 11.3204 15.464 11.3957 15.4328C11.4709 15.4016 11.5393 15.3559 11.5969 15.2983C11.6545 15.2407 11.7002 15.1723 11.7314 15.097C11.7626 15.0218 11.7786 14.9411 11.7786 14.8596V13.1151H13.5232C13.6877 13.1151 13.8455 13.0497 13.9618 12.9334C14.0782 12.8171 14.1435 12.6593 14.1435 12.4947V10.4785C14.1435 10.3139 14.0782 10.1561 13.9618 10.0398C13.8455 9.92344 13.6877 9.85808 13.5232 9.85808H11.7799V8.11355C11.7799 7.94901 11.7145 7.79122 11.5982 7.67487C11.4818 7.55853 11.324 7.49316 11.1595 7.49316H9.14324Z" stroke={themeColor} stroke-width="2.06602" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                            )}
                            {index == 4 && (
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
                                        <path d="M6.04454 3.46582C5.77501 3.46582 5.51652 3.5733 5.32593 3.76462C5.13535 3.95594 5.02827 4.21543 5.02827 4.48599V12.6474C5.02827 12.9179 5.13535 13.1774 5.32593 13.3687C5.51652 13.5601 5.77501 13.6675 6.04454 13.6675C6.31407 13.6675 6.57256 13.5601 6.76315 13.3687C6.95373 13.1774 7.0608 12.9179 7.0608 12.6474V9.58686H7.65633L11.7214 13.6675L9.39008 16.0058C9.19925 16.1973 9.09205 16.4572 9.09205 16.7281C9.09205 16.999 9.19925 17.2588 9.39008 17.4503C9.58091 17.6419 9.83973 17.7495 10.1096 17.7495C10.3795 17.7495 10.6383 17.6419 10.8291 17.4503L13.1584 15.1101L15.4877 17.4503C15.6785 17.6419 15.9373 17.7495 16.2072 17.7495C16.4771 17.7495 16.7359 17.6419 16.9267 17.4503C17.1175 17.2588 17.2247 16.999 17.2247 16.7281C17.2247 16.4572 17.1175 16.1973 16.9267 16.0058L14.5954 13.6675L16.9267 11.3293C17.1175 11.1378 17.2247 10.8779 17.2247 10.607C17.2247 10.3361 17.1175 10.0763 16.9267 9.88475C16.7359 9.69319 16.4771 9.58557 16.2072 9.58557C15.9373 9.58557 15.6785 9.69319 15.4877 9.88475L13.1584 12.225L10.5059 9.56033C11.2727 9.45833 11.9722 9.06758 12.4628 8.46722C12.9533 7.86685 13.1981 7.10178 13.1478 6.32696C13.0974 5.55214 12.7555 4.82552 12.1914 4.29427C11.6273 3.76303 10.8831 3.46688 10.1096 3.46582H6.04454ZM7.0608 5.50617H10.1096C10.3791 5.50617 10.6376 5.61365 10.8282 5.80497C11.0188 5.99629 11.1259 6.25577 11.1259 6.52634C11.1259 6.79691 11.0188 7.05639 10.8282 7.24771C10.6376 7.43903 10.3791 7.54651 10.1096 7.54651H7.0608V5.50617Z" fill={themeColor} />
                                    </svg>
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>}
            <div className="bottom">
                <div className="dates_wrapers">
                    <Row className="gx-0 p-0 h-100 align-items-center">
                        <Col lg={6}>
                            <Row className='p-0'>
                                <Col lg={4}>
                                    <div className="wraper_date">
                                        <span className='left_arrow' onClick={handlePrevDate}></span>
                                        <DatePicker
                                            value={dayjs(isDate, "YYYY-MM-DD")}
                                            inputReadOnly={true}
                                            format="YYYY-MM-DD"
                                            onChange={handleDateChange}
                                            name="dob"
                                        />
                                        <span className='right_arrow' onClick={handleNextDate}></span>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <Form.Select onChange={(e) => handleDoctorId(e)} aria-label="Default select example" name='practiceCity' className='selectSty' >
                                        {doctors?.map((item) => (
                                            <option value={item?.id} >Dr. {item?.name} </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col lg={4}>
                                    <Form.Select onChange={(e) => handleClinicId(e)} aria-label="Default select example" name='practiceCity' className='selectSty' >
                                        {clinicList?.map((item) => (
                                            <option value={item?.id} >Clinic: {item?.name} </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={1}></Col>
                        <Col lg={5}>
                            <Row className='gx-0 p-0 h-100'>
                                <Col lg={6}>
                                    <div className="search__bar">
                                        <span className='search_icon'>  </span>
                                        <input type="text" onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder='Search for appointment' />
                                    </div>
                                </Col>
                                <Col lg={1} style={{ position: 'relative', textAlign: "center" }}>
                                    <Divider type='vertical' />
                                </Col>
                                <Col lg={5}>
                                    {allowedPermissions["appointments_add"] && <button className='hovering_btn' onClick={handleBookAppointmentShow} style={{ background: themeColor }}>
                                        <span className='plusIcon'>  </span>
                                        Add New Appointment
                                    </button>}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="table__wrape">
                    <Table>
                        <thead>
                            <tr>
                                <th>Token No.</th>
                                <th>Time slot</th>
                                <th>MR No.</th>
                                <th>Patient Name</th>
                                <th> Number </th>
                                <th> Appointment Type </th>
                                <th> Last Visit </th>
                                <th> Paid </th>
                                <th> Status </th>
                                <th> Doctor </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((item) => (
                                <tr>
                                    <td>{item?.token_no}</td>
                                    <td>{item?.time}</td>
                                    <td>{item?.patient_mr_no}</td>
                                    <td>{item?.patient_name}</td>
                                    <td>{item?.patient_number}</td>
                                    <td>{item?.appointment_type}</td>
                                    <td>{item?.last_visit}</td>
                                    <td>Cash</td>
                                    <td>{item?.appointment_status}</td>
                                    <td>{item?.doctor_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <div className='boxBtn'>
                    {totalPages > 1 ? (
                        <>
                            <div className='countPagination'>
                                {paginateCountData?.from} - {paginateCountData?.to} of {paginateCountData?.total}
                                {paginateCountData?.total}
                            </div>
                            <ReactPaginate
                                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                                breakLabel={null}
                                pageCount={totalPages}
                                pageRangeDisplayed={0}
                                marginPagesDisplayed={0}
                                onPageChange={handlePageClick}
                                containerClassName="pagination_hk"
                                previousClassName="prev_item"
                                nextClassName="next_item"
                                previousLinkClassName="previousLink"
                                nextLinkClassName="medical_next_link"
                                forcePage={currentPage - 1}
                                renderOnZeroPageCount={null}
                            />
                        </>
                    ) : null}
                </div>
            </div>
            <BookAppointmentModal doctors={doctors} bookAppointmentShow={bookAppointmentShow} handleBookAppointmentClose={handleBookAppointmentClose} setBookAppointmentShow={setBookAppointmentShow} />
            <WelcomeUser userData={userData} setShowWelcome={setShowWelcome} showWelcome={showWelcome} handleCloseWelcome={handleCloseWelcome} />
        </WraperLayout>
    )
}

export default Dashboard;
