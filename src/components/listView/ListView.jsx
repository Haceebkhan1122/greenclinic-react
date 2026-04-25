/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from 'react'
import ClinicAppointments from '../../components/clinicAppointments/ClinicAppointments';
import OnlineAppointments from '../../components/onlineAppointments/OnlineAppointments';
import Stethoscope from "../../assets/images/svg/stethoscope.svg"
import Search from "../../assets/images/svg/search.svg"
import EventSchedule from "../../assets/images/svg/eventschedule.svg";
import CheckMark from "../../assets/images/svg/checkmark.svg";
import Setting from "../../assets/images/png/setting_icon.png"
import { Row, Col, Form, Dropdown, Accordion, Tab, Tabs, Tooltip, OverlayTrigger } from "react-bootstrap"
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment/moment';
import BookAppointmentModal from '../modal/bookAppointmentModal/BookAppointmentModal';
import OutOfficeModal from '../modal/outOfficeModal/OutOfficeModal';
import API from '../../services/httpInstance';
import { toast } from "react-toastify";
import { useSelector } from 'react-redux';

import "./listView.scss"
import { isMobile } from 'react-device-detect';

const ListView = ({ doctors, consultNowPermission, showAppointmentsPerm, showClinicTabAppointments, allowedPermissions, setIndicationMessage }) => {
    let doctorData = useSelector((state) => state?.user?.user);
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
     let clinicDetails = useSelector((state) => state.clinic.clinicDetails);
    const [activeTab, setActiveTab] = useState("clinicAppointments");
    const [bookAppointmentShow, setBookAppointmentShow] = useState(false);
    const [currentPage, setCurrentPage] = useState("1");
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [outOfficeShow, setOutOfficeShow] = useState(false);
    const [doctorsId, setDoctorsId] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [appointmentsList, setAppointmentsList] = useState([]);
    const [onlineAppointmentsList, setOnlineAppointmentsList] = useState([]);
    const [appointmentsFilterList, setAppointmentsFilterList] = useState([]);
    const [appointmentsFilter, setAppointmentsFilter] = useState("all");
    const [checked, setChecked] = useState({});
    const [onlineChecked, setOnlineChecked] = useState({});
    const [isDate, setIsDate] = useState(moment().format(null))
    const [searchQuery, setSearchQuery] = useState('')
    const [startDate, setStartDate] = useState(moment().format(''))
    const [endDate, setEndDate] = useState(moment().format(''))
    const [isDeclined, setIsDeclined] = useState(0);
    const [onlyNewAppt, setOnlyNewAppt] = useState(1);
    const [leftDoctorId, setLeftDoctorId] = useState(doctors?.length == 1 ? doctors[0].id : null);
    const [newAndExistingAppt, setNewAndExistingAppt] = useState(0);
    const [leaveMessage, setLeaveMessage] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [formattedStartDate, setFormattedStartDate] = useState('')
    const [formattedEndDate, setFormattedEndDate] = useState('')
    const [isTimeSlotChecked, setIsTimeSlotChecked] = useState(true);
    const [isMrChecked, setMrChecked] = useState(true);
    const [isPatientNameChecked, setIsPatientNameChecked] = useState(true);
    const [isNumberChecked, setIsNumberChecked] = useState(true);
    const [isAppointmentTypeChecked, setIsAppointmentTypeChecked] = useState(true);
    const [isSourceChecked, setIsSourceChecked] = useState(true);
    const [isTimeChecked, setIsTimeChecked] = useState(true);
    const [isLastVisitChecked, setIsLastVisitChecked] = useState(true);
    const [isAmountChecked, setIsAmountChecked] = useState(true);
    const [isStatusChecked, setIsStatusChecked] = useState(true);
    const [isCheckInChecked, setIsCheckInChecked] = useState(true);
    const [appointmentStatusChecked, setAppointmentStatusChecked] = useState("");
    const [appointmentTypeChecked, setAppointmentTypeChecked] = useState("");
    const [locationChecked, setLocationChecked] = useState("");
    const [doctorError, setDoctorError] = useState(false);
    const [locationArr, setLocationArr] = useState([])
    const [locationUpdatedVals, setLocationUpdatedVals] = useState("")
    const [isPatientJoin, setIsPatientJoin] = useState(false)

    const handleBookAppointmentClose = () => setBookAppointmentShow(false);
    const handleBookAppointmentShow = () => setBookAppointmentShow(true);
    const handleOutOfficeClose = () => setOutOfficeShow(false);
    const handleOutOfficeShow = () => setOutOfficeShow(true);

    const handleCheckBoxChange = (e) => {
        setIsTimeSlotChecked(e.target.checked);
    };


    const handleCheckBoxChangeMR = (e) => {
        setMrChecked(e.target.checked);
    };

    const handleCheckBoxChangePatientName = (e) => {
        setIsPatientNameChecked(e.target.checked);
    };

    const handleCheckBoxChangeNumber = (e) => {
        setIsNumberChecked(e.target.checked);
    };

    const handleCheckBoxChangeAppointmentType = (e) => {
        setIsAppointmentTypeChecked(e.target.checked);
    };

    const handleCheckBoxChangeSource = (e) => {
        setIsSourceChecked(e.target.checked);
    };

    const handleCheckBoxChangeTime = (e) => {
        setIsTimeChecked(e.target.checked);
    };

    const handleCheckBoxChangeLastVisit = (e) => {
        setIsLastVisitChecked(e.target.checked);
    };

    const handleCheckBoxChangeAmount = (e) => {
        setIsAmountChecked(e.target.checked);
    };

    const handleCheckBoxChangeStatus = (e) => {
        setIsStatusChecked(e.target.checked);
    };
    const handleCheckBoxChangeCheckIn = (e) => {
        setIsCheckInChecked(e.target.checked);
    };

    const appointmentFilerListing = async () => {
        try {
            const response = await API.get(`/appointment-filters-list-online`)
            if (response?.status == 200) {
                setAppointmentsFilterList(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const patientJoin = async () => {
        try {
            const response = await API.get(`/check-patient-connect?date=${moment(isDate).format("YYYY-MM-DD")}&clinic=${clinicDetails?.clinic_name}&doctor_id=${doctorData?.id}`);
            if (response?.status == 200) {
                setIsPatientJoin(response?.data?.data)
                // if (Array.isArray(response?.data?.data)) {
                //     response?.data?.data.forEach((status) => {
                //         console.log('Received status:', status);
                //     });
                // }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    useEffect(() => {
        let interval;
        const todayFormatted = dayjs().format("YYYY/MM/DD");
        if (activeTab == "clinicAppointments") {
            setIsDate(todayFormatted);
            setDoctorsId("")
            setTotalPages(1);
            setCurrentPage(1)
            setPaginateCountData(null)
            setAppointmentStatusChecked("")
            setAppointmentTypeChecked("")
            setLocationChecked("")
            getClinicAppointmentsListing();
        } else {
            setIsDate(todayFormatted);
            setDoctorsId("")
            setTotalPages(1);
            setCurrentPage(1)
            setPaginateCountData(null)
            setAppointmentStatusChecked("")
            setAppointmentTypeChecked("")
            setLocationChecked("")
            getOnlineAppointmentsListing();
            patientJoin();
            interval = setInterval(patientJoin, 50000);
        }
    }, [activeTab])

    // get clinic list appointments
    const getClinicAppointmentsListing = async (pageNumber = 1) => {
        try {
            const filterString = appointmentsFilter?.trim() ? appointmentsFilter.replace(/\s+/g, "") : null;
            const isDashboard = "0"
            const params = {};
            if (isDate) {
                const formattedDate = moment(isDate).format("YYYY-MM-DD");
                params.date = formattedDate;
            }
            let locationAll;
            if (locationArr.length > 0) {
                locationAll = locationArr.join(",")
            }
            params.location = locationAll;
            if (filterString) params.filter = filterString;
            if (isDashboard) params.is_dashboard = isDashboard;
            if (doctorsId) params.doctor_id = doctorsId;
            if (pageNumber) params.page = currentPage;

            const response = await API.get(`/appointment-listing-filter`, { params });
            if (response?.status === 200) {
                const { pagination, appointments } = response?.data?.data;
                const calculatedTotalPages = Math.ceil(pagination?.total / pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setCurrentPage(pagination?.current_page)
                setPaginateCountData(pagination)
                setAppointmentsList(appointments);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const getOnlineAppointmentsListing = async (pageNumber = 1) => {
        try {
            const params = {};
            if (isDate) {
                const formattedDate = moment(isDate).format("YYYY-MM-DD"); // Ensure correct format
                params.date = formattedDate;
            }
            params.appointment_status = appointmentStatusChecked || "all";
            if (appointmentTypeChecked) params.appointment_type = appointmentTypeChecked;
            if (locationChecked) params.location = locationChecked;
            if (doctorsId) params.doctor_id = doctorsId;
            if (pageNumber) params.page = currentPage;

            const response = await API.get(`/appointment-listing-online`, { params });
            if (response?.status === 200) {
                const { pagination, appointments } = response?.data?.data;
                const calculatedTotalPages = Math.ceil(pagination?.total / pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setCurrentPage(pagination?.current_page)
                setPaginateCountData(pagination)

                const currentTime = new Date().getTime();

                const updatedAppointments = appointments.map((appt) => {
                    const appointmentTime = new Date(`${appt.appointment_date} ${appt.time}`).getTime();
                    const timeDiff = appointmentTime - currentTime;

                    return {
                        ...appt,
                        isWithinFiveMinutes: timeDiff <= 5 * 60 * 1000 && timeDiff > 0,
                        remainingTime: timeDiff > 0 ? Math.ceil(timeDiff / 1000) : 0, // Convert to seconds
                    };
                });

                setOnlineAppointmentsList(updatedAppointments);
                startCountdownTimer(updatedAppointments);
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    // Function to update countdown timer every second
    const startCountdownTimer = (appointments) => {
        const interval = setInterval(() => {
            setOnlineAppointmentsList((prevAppointments) =>
                prevAppointments.map((appt) => {
                    if (appt.remainingTime > 0) {
                        return { ...appt, remainingTime: appt.remainingTime - 1 };
                    }
                    return appt;
                })
            );
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    };

    useEffect(() => {
        getClinicAppointmentsListing();
        appointmentFilerListing();
    }, []);

    const handleDoctorId = (e) => {
        const value = e.target.value;
        setDoctorsId(value)
    }

    const handleDateChange = (date) => {
        if (!date) {
            setIsDate(null); // Clear the state when the date is removed
            return;
        }

        let formatDate = dayjs(date).format("YYYY/MM/DD");
        setIsDate(formatDate);
    };

    // Function to go to the previous date
    const handlePrevDate = () => {
        if (isDate) {
            setIsDate(dayjs(isDate, "YYYY/MM/DD").subtract(1, "day").format("YYYY/MM/DD"));
        }
    };

    // Function to go to the next date
    const handleNextDate = () => {
        if (isDate) {
            setIsDate(dayjs(isDate, "YYYY/MM/DD").add(1, "day").format("YYYY/MM/DD"));
        }
    };


    const handleCheckBox = (e, type) => {
        const { id, checked: isChecked, value } = e.target;

        setChecked((prev) => {
            const updatedChecked = { ...prev };

            if (isChecked) {
                updatedChecked[id] = true;
            } else {
                delete updatedChecked[id];
            }

            if (type !== undefined && type == "location") {
                if (isChecked) {
                    setLocationArr([...locationArr, Number(value)]);
                    let vals = locationArr.join(",");
                    setLocationUpdatedVals(vals);
                } else {
                    let location = locationArr.filter((item) => item !== Number(value));
                    setLocationArr(location);
                    setLocationUpdatedVals((prev) => prev !== value);
                }
            }
            const selectedFilters = Object.keys(updatedChecked).join(",");
            setAppointmentsFilter(selectedFilters);
            return updatedChecked;
        });
    };

    const handleCheckBoxOnline = (type, e) => {
        const { id, checked: isChecked } = e.target;

        const updateState = (prevState) => {
            let updatedChecked = prevState ? prevState.split(",") : [];

            if (isChecked) {
                updatedChecked.push(id);
            } else {
                updatedChecked = updatedChecked.filter((item) => item !== id);
            }

            return updatedChecked.join(",");
        };

        if (type === "appointmentStatus") {
            setAppointmentStatusChecked((prev) => updateState(prev));
        } else if (type === "appointmentType") {
            setAppointmentTypeChecked((prev) => updateState(prev));
        } else if (type === "location") {
            setLocationChecked((prev) => updateState(prev));
        }
    };

    const handleRemoveCheckbox = () => {
        setAppointmentStatusChecked("");
        setAppointmentTypeChecked("");
        setLocationChecked("");
        setAppointmentsFilter("all")
        setLocationArr([]);
        setLocationUpdatedVals("");
        setChecked({})
    };

    useEffect(() => {
        if (activeTab === "clinicAppointments") {
            getClinicAppointmentsListing();
        }
    }, [appointmentsFilter, currentPage, doctorsId, isDate, locationUpdatedVals])

    useEffect(() => {
        if (activeTab !== "clinicAppointments") {
            getOnlineAppointmentsListing();
        }
    }, [appointmentTypeChecked, appointmentStatusChecked, locationChecked, currentPage, doctorsId, isDate])

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);
    };

    const saveLeftDoctor = async () => {
        if (!leftDoctorId) {
            setDoctorError(true);
            return;
        }
        if ((isDeclined && onlyNewAppt == 0 && newAndExistingAppt == 0) || leftDoctorId == null) {
            setButtonDisabled(false)
        }
        else {
            const payload = {
                doctorId: leftDoctorId,
                startDate: moment(formattedStartDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
                endDate: moment(formattedEndDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
                automaticallyDeclineAllAppt: isDeclined,
                onlyNewAppt: onlyNewAppt,
                newAndExistingAppt: newAndExistingAppt,
                absenceReason: leaveMessage
            };
            try {
                const response = await API.post(`/doctor-out-off-office`, payload)
                if (response?.status == 200) {
                    handleOutOfficeClose()
                    setIndicationMessage(response?.data?.message)
                } else if (response?.status === 422) {
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
                }

            } catch (error) {
                console.log(error);
                toast.error(error?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }


        }
    };

    const filteredData = searchTerm
        ? appointmentsList?.filter((item) =>
            item?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.patient_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.patient_mr_no?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : appointmentsList;

    const filteredDataOnline = searchTerm
        ? onlineAppointmentsList?.filter((item) =>
            item?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.patient_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.patient_mr_no?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : onlineAppointmentsList;

        useEffect(() => {
            if(!showClinicTabAppointments) {
                setActiveTab("clinicAppointments")
            }
        }, [showClinicTabAppointments])

    return (
        <>
            <div className="top_wrap dd">
                <Row className="align-items-center">
                    {isMobile && (
                        <>
                            <Col lg={12}>
                                <div className="search__bar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="11.5" cy="10.5" r="6.5" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M16 16L20 20" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <input type="text"
                                        placeholder='Search'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </>
                    )}
                    <Col lg={8}>
                        <Row className="align-items-center">
                            <Col lg={4}>
                                <div className="wraper_date d-lg-flex d-none">
                                    <div className='calender_icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                            <path d="M2.57649 20.0047C2.0264 20.0047 1.5555 19.8088 1.16377 19.4171C0.772037 19.0254 0.576172 18.5544 0.576172 18.0044V4.00211C0.576172 3.45202 0.772037 2.98111 1.16377 2.58938C1.5555 2.19765 2.0264 2.00179 2.57649 2.00179H3.57665V0.00146484H5.57698V2.00179H13.5783V0.00146484H15.5786V2.00179H16.5787C17.1288 2.00179 17.5997 2.19765 17.9915 2.58938C18.3832 2.98111 18.5791 3.45202 18.5791 4.00211V18.0044C18.5791 18.5544 18.3832 19.0254 17.9915 19.4171C17.5997 19.8088 17.1288 20.0047 16.5787 20.0047H2.57649ZM2.57649 18.0044H16.5787V8.00275H2.57649V18.0044ZM2.57649 6.00243H16.5787V4.00211H2.57649V6.00243ZM9.57762 12.0034C9.29424 12.0034 9.0567 11.9075 8.865 11.7158C8.67331 11.5241 8.57746 11.2866 8.57746 11.0032C8.57746 10.7199 8.67331 10.4823 8.865 10.2906C9.0567 10.0989 9.29424 10.0031 9.57762 10.0031C9.861 10.0031 10.0985 10.0989 10.2902 10.2906C10.4819 10.4823 10.5778 10.7199 10.5778 11.0032C10.5778 11.2866 10.4819 11.5241 10.2902 11.7158C10.0985 11.9075 9.861 12.0034 9.57762 12.0034ZM5.57698 12.0034C5.2936 12.0034 5.05606 11.9075 4.86436 11.7158C4.67266 11.5241 4.57681 11.2866 4.57681 11.0032C4.57681 10.7199 4.67266 10.4823 4.86436 10.2906C5.05606 10.0989 5.2936 10.0031 5.57698 10.0031C5.86035 10.0031 6.09789 10.0989 6.28959 10.2906C6.48129 10.4823 6.57714 10.7199 6.57714 11.0032C6.57714 11.2866 6.48129 11.5241 6.28959 11.7158C6.09789 11.9075 5.86035 12.0034 5.57698 12.0034ZM13.5783 12.0034C13.2949 12.0034 13.0573 11.9075 12.8656 11.7158C12.6739 11.5241 12.5781 11.2866 12.5781 11.0032C12.5781 10.7199 12.6739 10.4823 12.8656 10.2906C13.0573 10.0989 13.2949 10.0031 13.5783 10.0031C13.8616 10.0031 14.0992 10.0989 14.2909 10.2906C14.4826 10.4823 14.5784 10.7199 14.5784 11.0032C14.5784 11.2866 14.4826 11.5241 14.2909 11.7158C14.0992 11.9075 13.8616 12.0034 13.5783 12.0034ZM9.57762 16.004C9.29424 16.004 9.0567 15.9082 8.865 15.7165C8.67331 15.5248 8.57746 15.2873 8.57746 15.0039C8.57746 14.7205 8.67331 14.483 8.865 14.2913C9.0567 14.0996 9.29424 14.0037 9.57762 14.0037C9.861 14.0037 10.0985 14.0996 10.2902 14.2913C10.4819 14.483 10.5778 14.7205 10.5778 15.0039C10.5778 15.2873 10.4819 15.5248 10.2902 15.7165C10.0985 15.9082 9.861 16.004 9.57762 16.004ZM5.57698 16.004C5.2936 16.004 5.05606 15.9082 4.86436 15.7165C4.67266 15.5248 4.57681 15.2873 4.57681 15.0039C4.57681 14.7205 4.67266 14.483 4.86436 14.2913C5.05606 14.0996 5.2936 14.0037 5.57698 14.0037C5.86035 14.0037 6.09789 14.0996 6.28959 14.2913C6.48129 14.483 6.57714 14.7205 6.57714 15.0039C6.57714 15.2873 6.48129 15.5248 6.28959 15.7165C6.09789 15.9082 5.86035 16.004 5.57698 16.004ZM13.5783 16.004C13.2949 16.004 13.0573 15.9082 12.8656 15.7165C12.6739 15.5248 12.5781 15.2873 12.5781 15.0039C12.5781 14.7205 12.6739 14.483 12.8656 14.2913C13.0573 14.0996 13.2949 14.0037 13.5783 14.0037C13.8616 14.0037 14.0992 14.0996 14.2909 14.2913C14.4826 14.483 14.5784 14.7205 14.5784 15.0039C14.5784 15.2873 14.4826 15.5248 14.2909 15.7165C14.0992 15.9082 13.8616 16.004 13.5783 16.004Z" fill={themeColor} />
                                        </svg>
                                    </div>
                                    <a onClick={handlePrevDate}>
                                        <span className='left_arrow'></span>
                                    </a>
                                    <a onClick={handleNextDate}>
                                        <span className='right_arrow'></span>
                                    </a>
                                    {/* <DatePicker
                                        value={isDate ? dayjs(isDate, "YYYY/MM/DD") : null} // Convert string back to dayjs object
                                        allowClear={true}
                                        name="dob"
                                        onChange={handleDateChange}
                                        inputReadOnly={true} // Prevent manual typing
                                    /> */}
                                    <DatePicker
                                        value={isDate ? dayjs(isDate, "YYYY/MM/DD") : null}
                                        format="MMMM D, YYYY"
                                        allowClear={true}
                                        name="dob"
                                        className="px-0"
                                        onChange={handleDateChange}
                                        inputReadOnly={true}
                                    />

                                </div>
                            </Col>
                            <Col lg={3} className='or3'>
                                <div className="search">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                        <path d="M13 0.25V1.5H14.25V5.25C14.25 5.91304 13.9866 6.54893 13.5178 7.01777C13.0489 7.48661 12.413 7.75 11.75 7.75C11.087 7.75 10.4511 7.48661 9.98224 7.01777C9.5134 6.54893 9.25001 5.91304 9.25001 5.25V1.5H10.5V0.25H8.00001V5.25C8.00154 6.13538 8.31602 6.9917 8.88787 7.66763C9.45972 8.34356 10.2521 8.79556 11.125 8.94375V12.75C11.125 13.7446 10.7299 14.6984 10.0267 15.4017C9.3234 16.1049 8.36957 16.5 7.37501 16.5C6.38044 16.5 5.42662 16.1049 4.72336 15.4017C4.02009 14.6984 3.62501 13.7446 3.62501 12.75V8.91119C4.21417 8.75907 4.72762 8.39729 5.06913 7.89368C5.41064 7.39007 5.55675 6.7792 5.48008 6.17556C5.40341 5.57193 5.10922 5.01698 4.65265 4.61474C4.19609 4.21249 3.60849 3.99057 3.00001 3.99057C2.39152 3.99057 1.80393 4.21249 1.34736 4.61474C0.890794 5.01698 0.596603 5.57193 0.519932 6.17556C0.44326 6.7792 0.589372 7.39007 0.93088 7.89368C1.27239 8.39729 1.78584 8.75907 2.37501 8.91119V12.75C2.37501 14.0761 2.90179 15.3479 3.83947 16.2855C4.77715 17.2232 6.04892 17.75 7.37501 17.75C8.70109 17.75 9.97286 17.2232 10.9105 16.2855C11.8482 15.3479 12.375 14.0761 12.375 12.75V8.94375C13.2479 8.79556 14.0403 8.34356 14.6121 7.66763C15.184 6.9917 15.4985 6.13538 15.5 5.25V0.25H13ZM1.75001 6.5C1.75001 6.25277 1.82332 6.0111 1.96067 5.80554C2.09802 5.59998 2.29324 5.43976 2.52165 5.34515C2.75006 5.25054 3.00139 5.22579 3.24387 5.27402C3.48635 5.32225 3.70907 5.4413 3.88389 5.61612C4.0587 5.79093 4.17776 6.01366 4.22599 6.25614C4.27422 6.49861 4.24946 6.74995 4.15486 6.97835C4.06025 7.20676 3.90003 7.40199 3.69447 7.53934C3.48891 7.67669 3.24723 7.75 3.00001 7.75C2.6686 7.74962 2.35088 7.6178 2.11654 7.38346C1.8822 7.14913 1.75039 6.8314 1.75001 6.5Z" fill={themeColor} />
                                    </svg>
                                    <Form.Select onChange={(e) => handleDoctorId(e)} name='' className='selectSty'>
                                        <option value="" key="All Doctors">All Doctors</option>
                                        {doctors?.length > 0 && doctors?.map((item) => (
                                            <option value={item?.id} key={item?.id} >{item?.name} </option>
                                        ))}
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col lg={4} className='or2'>
                                <div className="filter-by-div">
                                    <p className="filterHeading d">Filter by</p>
                                    {activeTab === "clinicAppointments" ? (
                                        <Dropdown className='filter'>
                                            <Dropdown.Toggle id="dropdown-basic">
                                                Select
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Accordion>
                                                    <Accordion.Item eventKey="0">
                                                        <Accordion.Header>Appointment Status</Accordion.Header>
                                                        <Accordion.Body>
                                                            {appointmentsFilterList?.offline_filters &&
                                                                appointmentsFilterList?.offline_filters?.appointment_status?.map((item) => {
                                                                    return (
                                                                        <Form.Check
                                                                            key={item?.value}
                                                                            type="checkbox"
                                                                            label={item?.title}
                                                                            id={item?.value}
                                                                            checked={checked[item?.value] || false} // ✅ Corrected: Use object key lookup
                                                                            onChange={handleCheckBox}
                                                                        />
                                                                    );
                                                                })}
                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    {/* <Accordion.Item eventKey="1">
                                                        <Accordion.Header>Appointment Type</Accordion.Header>
                                                        <Accordion.Body>
                                                            {appointmentsFilterList?.online_filters?.consultation_type?.map((item) => (
                                                                <Form.Check
                                                                    key={item?.value}
                                                                    type="checkbox"
                                                                    label={item?.title}
                                                                    id={item?.value}
                                                                    checked={checked[item?.value] || false}
                                                                    // onChange={(e) => handleCheckBoxOnline("appointmentType", e)}
                                                                    onChange={handleCheckBox}
                                                                />
                                                            ))}
                                                        </Accordion.Body>
                                                    </Accordion.Item> */}

                                                    <Accordion.Item eventKey="2">
                                                        <Accordion.Header>Location</Accordion.Header>
                                                        <Accordion.Body>
                                                            {appointmentsFilterList?.online_filters?.location?.map((item) => {
                                                                return (<>
                                                                    <Form.Check
                                                                        key={item?.id}
                                                                        type="checkbox"
                                                                        label={item?.name}
                                                                        id={item?.id}
                                                                        checked={locationArr.includes(item?.id)}
                                                                        value={item?.id}
                                                                        onChange={(e) => { handleCheckBox(e, "location") }}
                                                                    />
                                                                </>)
                                                            })}
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                                <button className='clear_all' onClick={handleRemoveCheckbox}>Clear all filters</button>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    ) : (
                                        <Dropdown className='filter'>
                                            <Dropdown.Toggle id="dropdown-basic">Select</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Accordion>
                                                    <Accordion.Item eventKey="0">
                                                        <Accordion.Header>Appointment Status</Accordion.Header>
                                                        <Accordion.Body>
                                                            {appointmentsFilterList?.online_filters?.appointment_status?.map((item) => (
                                                                <Form.Check
                                                                    key={item?.value}
                                                                    type="checkbox"
                                                                    label={item?.title}
                                                                    id={item?.value}
                                                                    checked={appointmentStatusChecked.includes(item?.value)}
                                                                    onChange={(e) => handleCheckBoxOnline("appointmentStatus", e)}
                                                                />
                                                            ))}
                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    <Accordion.Item eventKey="1">
                                                        <Accordion.Header>Appointment Type</Accordion.Header>
                                                        <Accordion.Body>
                                                            {appointmentsFilterList?.online_filters?.consultation_type?.map((item) => (
                                                                <Form.Check
                                                                    key={item?.value}
                                                                    type="checkbox"
                                                                    label={item?.title}
                                                                    id={item?.value}
                                                                    checked={appointmentTypeChecked.includes(item?.value)}
                                                                    onChange={(e) => handleCheckBoxOnline("appointmentType", e)}
                                                                />
                                                            ))}
                                                        </Accordion.Body>
                                                    </Accordion.Item>

                                                    <Accordion.Item eventKey="2">
                                                        <Accordion.Header>Location</Accordion.Header>
                                                        <Accordion.Body>
                                                            {appointmentsFilterList?.online_filters?.location?.map((item) => (
                                                                <Form.Check
                                                                    key={item?.id}
                                                                    type="checkbox"
                                                                    label={item?.name}
                                                                    id={item?.id}
                                                                    checked={locationChecked.includes(item?.id)}
                                                                    onChange={(e) => handleCheckBoxOnline("location", e)}
                                                                />
                                                            ))}
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                                <button className='clear_all' onClick={handleRemoveCheckbox}>Clear all filters</button>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    )}
                                </div>
                            </Col>
                            <Col className='ps-0'>
                                <Dropdown className='setting'>
                                    <Dropdown.Toggle id="dropdown-basic">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                            <path d="M7.90833 21.8332L7.475 18.3665C7.24028 18.2762 7.0191 18.1679 6.81146 18.0415C6.60382 17.9151 6.40069 17.7797 6.20208 17.6353L2.97917 18.9894L0 13.8436L2.78958 11.7311C2.77153 11.6047 2.7625 11.4828 2.7625 11.3655V10.6342C2.7625 10.5169 2.77153 10.395 2.78958 10.2686L0 8.15609L2.97917 3.01025L6.20208 4.36442C6.40069 4.21998 6.60833 4.08456 6.825 3.95817C7.04167 3.83178 7.25833 3.72345 7.475 3.63317L7.90833 0.166504H13.8667L14.3 3.63317C14.5347 3.72345 14.7559 3.83178 14.9635 3.95817C15.1712 4.08456 15.3743 4.21998 15.5729 4.36442L18.7958 3.01025L21.775 8.15609L18.9854 10.2686C19.0035 10.395 19.0125 10.5169 19.0125 10.6342V11.3655C19.0125 11.4828 18.9944 11.6047 18.9583 11.7311L21.7479 13.8436L18.7687 18.9894L15.5729 17.6353C15.3743 17.7797 15.1667 17.9151 14.95 18.0415C14.7333 18.1679 14.5167 18.2762 14.3 18.3665L13.8667 21.8332H7.90833ZM10.9417 14.7915C11.9889 14.7915 12.8826 14.4214 13.6229 13.6811C14.3632 12.9408 14.7333 12.0471 14.7333 10.9998C14.7333 9.95261 14.3632 9.05886 13.6229 8.31859C12.8826 7.57831 11.9889 7.20817 10.9417 7.20817C9.87639 7.20817 8.97812 7.57831 8.24687 8.31859C7.51562 9.05886 7.15 9.95261 7.15 10.9998C7.15 12.0471 7.51562 12.9408 8.24687 13.6811C8.97812 14.4214 9.87639 14.7915 10.9417 14.7915Z" fill={themeColor} />
                                        </svg>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Form.Check
                                            type="checkbox"
                                            id="timeSlot"
                                            label="Time Slot"
                                            checked={isTimeSlotChecked}
                                            onChange={handleCheckBoxChange}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="mr"
                                            label="MR #"
                                            checked={isMrChecked}
                                            onChange={handleCheckBoxChangeMR}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="patienName"
                                            label="Patient Name"
                                            checked={isPatientNameChecked}
                                            onChange={handleCheckBoxChangePatientName}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="number"
                                            label="Number"
                                            checked={isNumberChecked}
                                            onChange={handleCheckBoxChangeNumber}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="appointmentType"
                                            label="Appointment Type"
                                            checked={isAppointmentTypeChecked}
                                            onChange={handleCheckBoxChangeAppointmentType}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="source"
                                            label="Source"
                                            checked={isSourceChecked}
                                            onChange={handleCheckBoxChangeSource}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="time"
                                            label="Time"
                                            checked={isTimeChecked}
                                            onChange={handleCheckBoxChangeTime}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="lastVisit"
                                            label="Last Visit"
                                            checked={isLastVisitChecked}
                                            onChange={handleCheckBoxChangeLastVisit}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="amount"
                                            label="Amount"
                                            checked={isAmountChecked}
                                            onChange={handleCheckBoxChangeAmount}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="status"
                                            label="Status"
                                            checked={isStatusChecked}
                                            onChange={handleCheckBoxChangeStatus}
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="checkin"
                                            label="Check In"
                                            checked={isCheckInChecked}
                                            onChange={handleCheckBoxChangeCheckIn}
                                        />
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={4} className='or1'>
                        <Row className='justify-content-end'>
                            {!isMobile && (
                                <>
                                    <Col lg={6}>
                                        <div className="search__bar">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <circle cx="11.5" cy="10.5" r="6.5" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M16 16L20 20" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <input type="text"
                                                placeholder='Search'
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                </>
                            )}
                            <Col lg={3}>
                                <Dropdown className='create'>
                                    <Dropdown.Toggle id="dropdown-basic">
                                        <span>Create</span> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                            <path d="M13.1673 7.3335L8.50065 12.0002L3.83398 7.3335" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {allowedPermissions["appointments_add"] && <Dropdown.Item onClick={handleBookAppointmentShow}><img src={EventSchedule} /> Book an Appointment</Dropdown.Item>}
                                        <Dropdown.Item onClick={handleOutOfficeShow}><img src={CheckMark} /> Out of office</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col lg={3}>

                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div className={`bottom_wrap`}>
                <Tabs
                    // defaultActiveKey={showClinicTabAppointments ? "clinicAppointments" :  "onlineAppointments"}
                    id="uncontrolled-tab-example"
                    // activeKey={showClinicTabAppointments ? "clinicAppointments" :  "onlineAppointments"}
                    onSelect={(k) => {
                        setActiveTab(k)
                    }}
                    className={activeTab}
                >
                    {showClinicTabAppointments && <Tab eventKey="clinicAppointments" title={
                        <div className='info_tab'>
                            {`${isMobile ? 'Clinical Appts' : 'Clinic Appointments'}`}
                            <OverlayTrigger
                                overlay={
                                    <Tooltip id="info_tab_wrap">
                                        Shows all appointments made in person at the clinic
                                    </Tooltip>
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                                    <path d="M6.72891 3L5.52891 3L5.52891 6.6L6.72891 6.6L6.72891 3ZM6.12891 7.8C5.95891 7.8 5.81641 7.8575 5.70141 7.9725C5.58641 8.0875 5.52891 8.23 5.52891 8.4C5.52891 8.57 5.58641 8.7125 5.70141 8.8275C5.81641 8.9425 5.95891 9 6.12891 9C6.29891 9 6.44141 8.9425 6.55641 8.8275C6.67141 8.7125 6.72891 8.57 6.72891 8.4C6.72891 8.23 6.67141 8.0875 6.55641 7.9725C6.44141 7.8575 6.29891 7.8 6.12891 7.8ZM6.12891 -4.29138e-07C6.95891 -5.01699e-07 7.73891 0.157499 8.46891 0.472499C9.19891 0.787499 9.83391 1.215 10.3739 1.755C10.9139 2.295 11.3414 2.93 11.6564 3.66C11.9714 4.39 12.1289 5.17 12.1289 6C12.1289 6.83 11.9714 7.61 11.6564 8.34C11.3414 9.07 10.9139 9.705 10.3739 10.245C9.83391 10.785 9.19891 11.2125 8.46891 11.5275C7.73891 11.8425 6.95891 12 6.12891 12C5.29891 12 4.51891 11.8425 3.78891 11.5275C3.05891 11.2125 2.42391 10.785 1.88391 10.245C1.34391 9.705 0.916407 9.07 0.601407 8.34C0.286407 7.61 0.128907 6.83 0.128907 6C0.128907 5.17 0.286407 4.39 0.601406 3.66C0.916407 2.93 1.34391 2.295 1.88391 1.755C2.42391 1.215 3.05891 0.787499 3.78891 0.4725C4.51891 0.157499 5.29891 -3.56577e-07 6.12891 -4.29138e-07ZM6.12891 1.2C4.78891 1.2 3.65391 1.665 2.72391 2.595C1.79391 3.525 1.32891 4.66 1.32891 6C1.32891 7.34 1.79391 8.475 2.72391 9.405C3.65391 10.335 4.78891 10.8 6.12891 10.8C7.46891 10.8 8.60391 10.335 9.53391 9.405C10.4639 8.475 10.9289 7.34 10.9289 6C10.9289 4.66 10.4639 3.525 9.53391 2.595C8.60391 1.665 7.46891 1.2 6.12891 1.2Z" />
                                </svg>
                            </OverlayTrigger>
                        </div>
                    }>
                        <ClinicAppointments isCheckInChecked={isCheckInChecked} isStatusChecked={isStatusChecked} consultNowPermission={consultNowPermission} setIndicationMessage={setIndicationMessage} getClinicAppointmentsListing={getClinicAppointmentsListing} isAmountChecked={isAmountChecked} allowedPermissions={allowedPermissions} isLastVisitChecked={isLastVisitChecked} isTimeChecked={isTimeChecked} isSourceChecked={isSourceChecked} isAppointmentTypeChecked={isAppointmentTypeChecked} isTimeSlotChecked={isTimeSlotChecked} isMrChecked={isMrChecked} isPatientNameChecked={isPatientNameChecked} isNumberChecked={isNumberChecked} totalPages={totalPages} handlePageClick={handlePageClick} currentPage={currentPage} paginateCountData={paginateCountData} filteredData={filteredData} />
                    </Tab>}
                    {showAppointmentsPerm && <Tab eventKey="onlineAppointments" title={
                        <div className='info_tab'>
                            {`${isMobile ? 'Online Appts' : 'Online Appointments'}`}
                            <OverlayTrigger
                                overlay={
                                    <Tooltip id="info_tab_wrap">
                                        Shows all appointments booked through the Meri Sehat app, including both in person and online consultations
                                    </Tooltip>
                                }
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                                    <path d="M6.72891 3L5.52891 3L5.52891 6.6L6.72891 6.6L6.72891 3ZM6.12891 7.8C5.95891 7.8 5.81641 7.8575 5.70141 7.9725C5.58641 8.0875 5.52891 8.23 5.52891 8.4C5.52891 8.57 5.58641 8.7125 5.70141 8.8275C5.81641 8.9425 5.95891 9 6.12891 9C6.29891 9 6.44141 8.9425 6.55641 8.8275C6.67141 8.7125 6.72891 8.57 6.72891 8.4C6.72891 8.23 6.67141 8.0875 6.55641 7.9725C6.44141 7.8575 6.29891 7.8 6.12891 7.8ZM6.12891 -4.29138e-07C6.95891 -5.01699e-07 7.73891 0.157499 8.46891 0.472499C9.19891 0.787499 9.83391 1.215 10.3739 1.755C10.9139 2.295 11.3414 2.93 11.6564 3.66C11.9714 4.39 12.1289 5.17 12.1289 6C12.1289 6.83 11.9714 7.61 11.6564 8.34C11.3414 9.07 10.9139 9.705 10.3739 10.245C9.83391 10.785 9.19891 11.2125 8.46891 11.5275C7.73891 11.8425 6.95891 12 6.12891 12C5.29891 12 4.51891 11.8425 3.78891 11.5275C3.05891 11.2125 2.42391 10.785 1.88391 10.245C1.34391 9.705 0.916407 9.07 0.601407 8.34C0.286407 7.61 0.128907 6.83 0.128907 6C0.128907 5.17 0.286407 4.39 0.601406 3.66C0.916407 2.93 1.34391 2.295 1.88391 1.755C2.42391 1.215 3.05891 0.787499 3.78891 0.4725C4.51891 0.157499 5.29891 -3.56577e-07 6.12891 -4.29138e-07ZM6.12891 1.2C4.78891 1.2 3.65391 1.665 2.72391 2.595C1.79391 3.525 1.32891 4.66 1.32891 6C1.32891 7.34 1.79391 8.475 2.72391 9.405C3.65391 10.335 4.78891 10.8 6.12891 10.8C7.46891 10.8 8.60391 10.335 9.53391 9.405C10.4639 8.475 10.9289 7.34 10.9289 6C10.9289 4.66 10.4639 3.525 9.53391 2.595C8.60391 1.665 7.46891 1.2 6.12891 1.2Z" />
                                </svg>
                            </OverlayTrigger>
                        </div>
                    }>
                        <OnlineAppointments isPatientJoin={isPatientJoin} getOnlineAppointmentsListing={getOnlineAppointmentsListing} isStatusChecked={isStatusChecked} isAmountChecked={isAmountChecked} isLastVisitChecked={isLastVisitChecked} isTimeChecked={isTimeChecked} isSourceChecked={isSourceChecked} isAppointmentTypeChecked={isAppointmentTypeChecked} isTimeSlotChecked={isTimeSlotChecked} isMrChecked={isMrChecked} isPatientNameChecked={isPatientNameChecked} isNumberChecked={isNumberChecked} totalPages={totalPages} handlePageClick={handlePageClick} currentPage={currentPage} paginateCountData={paginateCountData} filteredDataOnline={filteredDataOnline} />
                    </Tab>}
                </Tabs>
            </div>
            <BookAppointmentModal getClinicAppointmentsListing={getClinicAppointmentsListing} doctors={doctors} bookAppointmentShow={bookAppointmentShow} handleBookAppointmentClose={handleBookAppointmentClose} setBookAppointmentShow={setBookAppointmentShow} />
            <OutOfficeModal
                formattedEndDate={formattedEndDate}
                setFormattedEndDate={setFormattedEndDate}
                formattedStartDate={formattedStartDate}
                setFormattedStartDate={setFormattedStartDate}
                buttonDisabled={buttonDisabled}
                saveLeftDoctor={saveLeftDoctor}
                setLeaveMessage={setLeaveMessage}
                leaveMessage={leaveMessage}
                setNewAndExistingAppt={setNewAndExistingAppt}
                newAndExistingAppt={newAndExistingAppt}
                onlyNewAppt={onlyNewAppt}
                setOnlyNewAppt={setOnlyNewAppt}
                setIsDeclined={setIsDeclined}
                isDeclined={isDeclined}
                endDate={endDate}
                setDoctorError={setDoctorError}
                doctorError={doctorError}
                startDate={startDate}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                setLeftDoctorId={setLeftDoctorId}
                doctors={doctors}
                outOfficeShow={outOfficeShow}
                handleOutOfficeClose={handleOutOfficeClose} />
        </>
    )
}

export default ListView

