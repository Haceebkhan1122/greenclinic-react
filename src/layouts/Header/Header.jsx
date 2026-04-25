import { Row, Col, Container, Button, Tabs, Tab } from "react-bootstrap"
import { RightOutlined } from '@ant-design/icons';
import { Divider, Dropdown, theme } from 'antd';
import './header.scss';
import { useEffect, useRef, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import SearchResult from "./searchResult/SearchResult";
import { useClickAway, useLockBodyScroll } from "@uidotdev/usehooks";
import UpdatePopper from "../../components/updatePopper/UpdatePopper";
import { Link, useLocation, useNavigate, matchPath } from "react-router-dom";
import LogoutModal from '../../components/modal/logoutModal/LogoutModal';
import Search from '../../assets/images/svg/search.svg';
import SearchModal from "../../components/modal/searchModal/SearchModal";
import ThemeStyleModal from "../../components/modal/themeStyleModal/ThemeStyleModal";
import API from "../../services/httpInstance";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import Cross from "../../assets/images/png/cross.png"
import AddPatientModal from "../../components/modal/addPatientModal/AddPatientModal";
import { userLogout } from "../../redux/slices/userDetailsSlice";
import { clinicClose } from "../../redux/slices/clinicSlice";
import { logoutSuccess } from "../../redux/slices/loginSlice";
import BookAppointmentModal from "../../components/modal/bookAppointmentModal/BookAppointmentModal";

const Header = () => {
  const navigate = useNavigate();
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [filteredResults, setFilteredResults] = useState([]);
  const searchQuery = useRef(null)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [searchPopper, setSearchPopper] = useState(false)
  const [updatePopper, setUpdatePopper] = useState(false)
  const [logoutShow, setLogoutShow] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState('');
  const [allFeature, setAllFeature] = useState([]);
  const [unreadFeatures, setUnreadFeatures] = useState([]);
  const [userReadStatus, setUserReadStatus] = useState()
  const [patientAddShow, setPatientAddShow] = useState(false);
  const [mrNumber, setMrNumber] = useState(null);
  const [patientsListing, setPatientsListing] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const handleShowTheme = () => setShowThemeModal(true);
  const handleCloseTheme = () => setShowThemeModal(false);
  const [bookAppointmentShow, setBookAppointmentShow] = useState(false)
  const [doctors, setDoctors] = useState(null);
  const handleLogoutShow = () => setLogoutShow(true);
  const handleLogoutClose = () => setLogoutShow(false);
  const user = useSelector(state => state?.user?.user)
  const userName = useSelector(state => state?.userProfile?.userProfile?.user?.name)
  const [cities, setCities] = useState([]);
  const [filterGender, setFilterGender] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState("1");
  const [paginateCountData, setPaginateCountData] = useState(null);
  const [viewProfile, setViewProfile] = useState(false)
  const didFetchDoctors = useRef(false);

  const [allowedPermissionsAppointment, setAllowedPermissionsAppointment] = useState({});
  const [allowedPermissionsPatient, setAllowedPermissionsPatient] = useState({});

  const handleBookAppointmentClose = () => setBookAppointmentShow(false);
  const handleBookAppointmentShow = () => setBookAppointmentShow(true);

  let userPermissions = useSelector((state) => state.clinic.userPermissions);
  console.log(doctors,'doctors')
  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "appointments_view");
    const childPermissions = viewPermission?.child || [];
    const perms = {};
    childPermissions.forEach(child => {
      perms[child.slug] = true;
    });
    setAllowedPermissionsAppointment(perms);
  }, [userPermissions]);

  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "patients_view");
    const childPermissions = viewPermission?.child || [];
    const perms = {};
    childPermissions.forEach(child => {
      perms[child.slug] = true;
    });
    setAllowedPermissionsPatient(perms);
  }, [userPermissions]);

  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "update_user_profile");
    if (viewPermission && Object.keys(viewPermission).length > 0) {
      setViewProfile(true)
    }
    else {
      setViewProfile(false)
    }
  }, [userPermissions]);

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const handleLogout = () => {
    Cookies.remove('Authorization')
    Cookies.remove('appointmentType')
    Cookies.remove('previousAppointment')
    Cookies.remove('clinicAllowMedProtocol')
    Cookies.remove('message')
    dispatch(userLogout());
    dispatch(clinicClose());
    dispatch(logoutSuccess())
    setLogoutShow(false)
    window.location.href = "/login"
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

  useEffect(() => {
    if (bookAppointmentShow && !didFetchDoctors.current) {
      didFetchDoctors.current = true;
      getAllDoctors();
    }
  }, [bookAppointmentShow]);

  // const handleGender = (e) => {
  //   setFilterGender(e.target.value)
  // }

  // const handleDatePicker = (date, datestring) => {
  //   setSelectedDate(datestring)
  // }

  // const handleSearchFilter = (e) => {
  //   setSearchFilter(e.target.value)
  // }

  const handleSearchClose = () => setSearchShow(false);
  const handleSearchShow = () => setSearchShow(true);
  const [textQuery, setTextQuery] = useState("");

  const location = useLocation();
  const isDashboard = location.pathname === "/";

  const getMrNumber = async () => {
    try {
      const response = await API.get('/mr-number')
      if (response?.status == 200) {
        setMrNumber(response?.data?.data)
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

  const fetchAllPatientsListing = async () => {
    try {
      const params = new URLSearchParams();

      // Add filters only if they have values
      if (filterGender) params.append("gender", filterGender);
      if (searchFilter) params.append("name", searchFilter);
      if (selectedDate) params.append("date", selectedDate);

      params.append("page", currentPage); // Page should always be included

      const listing = await API.get(`/patients-listing-pagination?${params.toString()}`);

      if (listing?.status === 200) {
        const calculatedTotalPages = Math.ceil(
          listing?.data?.data?.pagination?.total / listing?.data?.data?.pagination?.per_page
        );
        setTotalPages(calculatedTotalPages);
        setPatientsListing(listing?.data?.data?.patients);
        setCurrentPage(listing?.data?.data?.pagination?.current_page);
        setPaginateCountData(listing?.data?.data?.pagination);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Cookies.get('toNotification')) {
      setUpdatePopper(false)
      Cookies.remove('toNotification')
    }
  }, [Cookies.get('toNotification')])

  const hidePopperOnNotification = () => {
    handleClose()
  };


  const routeConfig = [
    { path: '/', header: 'Dashboard' },
    { path: '/appointments', header: 'Appointment' },
    { path: '/settings', header: 'Settings' },
    { path: '/video-guide', header: 'Video Guide' },
    { path: '/manage-doctor', header: 'Settings' },
    { path: '/update-notification', header: 'Updates' },
    { path: '/patients', header: 'Patients' },
    { path: '/prescriptions', header: 'Prescriptions' },
    { path: '/reports', header: 'Report' },
    { path: '/invoices', header: 'Invoice' },
    { path: '/expenses', header: 'Expenses' },
    { path: '/prescription-profile/:id', header: 'Prescription' },
    { path: '/online-consultation', header: 'Prescription' },
    { path: '/patient-profile/:id', header: 'Patient' },
    { path: '/update-profile', header: 'Update Profile' },
    { path: '/view-history/:id', header: 'View History' },
    { path: '/consult-now', header: 'Prescription' },
    { path: '/audit-log', header: 'Audit Log' },
    { path: '/profile-update', header: 'My Profile' },
  ];

  let headerText = '';
  for (const route of routeConfig) {
    const match = matchPath(route.path, location.pathname);
    if (match) {
      headerText = route.header;
      break;
    }
  }
  const items = [
    ...(viewProfile) ? [{
      key: '1',
      label: (
        <Link className="dropdown-item" to="/profile-update">
          <div className="inline2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path d="M4.62 18.37C5.64 17.59 6.78 16.975 8.04 16.525C9.3 16.075 10.62 15.85 12 15.85C13.38 15.85 14.7 16.075 15.96 16.525C17.22 16.975 18.36 17.59 19.38 18.37C20.08 17.55 20.625 16.62 21.015 15.58C21.405 14.54 21.6 13.43 21.6 12.25C21.6 9.59 20.665 7.325 18.795 5.455C16.925 3.585 14.66 2.65 12 2.65C9.34 2.65 7.075 3.585 5.205 5.455C3.335 7.325 2.4 9.59 2.4 12.25C2.4 13.43 2.595 14.54 2.985 15.58C3.375 16.62 3.92 17.55 4.62 18.37ZM12 13.45C10.82 13.45 9.825 13.045 9.015 12.235C8.205 11.425 7.8 10.43 7.8 9.25C7.8 8.07 8.205 7.075 9.015 6.265C9.825 5.455 10.82 5.05 12 5.05C13.18 5.05 14.175 5.455 14.985 6.265C15.795 7.075 16.2 8.07 16.2 9.25C16.2 10.43 15.795 11.425 14.985 12.235C14.175 13.045 13.18 13.45 12 13.45ZM12 24.25C10.34 24.25 8.78 23.935 7.32 23.305C5.86 22.675 4.59 21.82 3.51 20.74C2.43 19.66 1.575 18.39 0.945 16.93C0.315 15.47 0 13.91 0 12.25C0 10.59 0.315 9.03 0.945 7.57C1.575 6.11 2.43 4.84 3.51 3.76C4.59 2.68 5.86 1.825 7.32 1.195C8.78 0.565 10.34 0.25 12 0.25C13.66 0.25 15.22 0.565 16.68 1.195C18.14 1.825 19.41 2.68 20.49 3.76C21.57 4.84 22.425 6.11 23.055 7.57C23.685 9.03 24 10.59 24 12.25C24 13.91 23.685 15.47 23.055 16.93C22.425 18.39 21.57 19.66 20.49 20.74C19.41 21.82 18.14 22.675 16.68 23.305C15.22 23.935 13.66 24.25 12 24.25ZM12 21.85C13.06 21.85 14.06 21.695 15 21.385C15.94 21.075 16.8 20.63 17.58 20.05C16.8 19.47 15.94 19.025 15 18.715C14.06 18.405 13.06 18.25 12 18.25C10.94 18.25 9.94 18.405 9 18.715C8.06 19.025 7.2 19.47 6.42 20.05C7.2 20.63 8.06 21.075 9 21.385C9.94 21.695 10.94 21.85 12 21.85ZM12 11.05C12.52 11.05 12.95 10.88 13.29 10.54C13.63 10.2 13.8 9.77 13.8 9.25C13.8 8.73 13.63 8.3 13.29 7.96C12.95 7.62 12.52 7.45 12 7.45C11.48 7.45 11.05 7.62 10.71 7.96C10.37 8.3 10.2 8.73 10.2 9.25C10.2 9.77 10.37 10.2 10.71 10.54C11.05 10.88 11.48 11.05 12 11.05Z" fill="#FDB836"></path>
            </svg>
            <p>Update Profile</p>
          </div>
          <RightOutlined />
        </Link>
      ),
    }] : [],
    {
      key: '2',
      label: (
        <button className="dropdown-item" onClick={handleShowTheme}>
          <div className="inline2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path d="M3.97559 20.5503L3.12559 20.2003C2.60892 19.9836 2.26309 19.6086 2.08809 19.0753C1.91309 18.5419 1.94225 18.0169 2.17559 17.5003L3.97559 13.6003V20.5503ZM7.97559 22.7503C7.42559 22.7503 6.95475 22.5544 6.56309 22.1628C6.17142 21.7711 5.97559 21.3003 5.97559 20.7503V14.7503L8.62559 22.1003C8.67559 22.2169 8.72559 22.3294 8.77559 22.4378C8.82559 22.5461 8.89225 22.6503 8.97559 22.7503H7.97559ZM13.1256 22.6503C12.5923 22.8503 12.0756 22.8253 11.5756 22.5753C11.0756 22.3253 10.7256 21.9336 10.5256 21.4003L6.07559 9.20025C5.87559 8.66692 5.89225 8.14609 6.12559 7.63775C6.35892 7.12942 6.74225 6.78359 7.27559 6.60025L14.8256 3.85025C15.3589 3.65025 15.8756 3.67525 16.3756 3.92525C16.8756 4.17525 17.2256 4.56692 17.4256 5.10025L21.8756 17.3003C22.0756 17.8336 22.0589 18.3544 21.8256 18.8628C21.5923 19.3711 21.2089 19.7169 20.6756 19.9003L13.1256 22.6503ZM10.9756 10.7503C11.2589 10.7503 11.4964 10.6544 11.6881 10.4628C11.8798 10.2711 11.9756 10.0336 11.9756 9.75025C11.9756 9.46692 11.8798 9.22942 11.6881 9.03775C11.4964 8.84609 11.2589 8.75025 10.9756 8.75025C10.6923 8.75025 10.4548 8.84609 10.2631 9.03775C10.0714 9.22942 9.97559 9.46692 9.97559 9.75025C9.97559 10.0336 10.0714 10.2711 10.2631 10.4628C10.4548 10.6544 10.6923 10.7503 10.9756 10.7503ZM12.4256 20.7503L19.9756 18.0003L15.5256 5.75025L7.97559 8.50025L12.4256 20.7503Z" fill="#0A8B8F"></path>
            </svg>
            <p >Theme Style</p>
          </div>
          <RightOutlined />
        </button>
      ),
    },
    {
      key: '3',
      label: (
        <Link className="dropdown-item" to="/settings">
          <div className="inline2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path d="M12 15.3291C13.6569 15.3291 15 13.986 15 12.3291C15 10.6722 13.6569 9.3291 12 9.3291C10.3431 9.3291 9 10.6722 9 12.3291C9 13.986 10.3431 15.3291 12 15.3291Z" stroke="#545454" stroke-width="1.3"></path>
              <path d="M13.763 2.48012C13.396 2.32812 12.93 2.32813 11.998 2.32813C11.066 2.32813 10.6 2.32812 10.233 2.48012C9.99019 2.58064 9.76956 2.72802 9.58373 2.91385C9.39791 3.09968 9.25052 3.32031 9.15001 3.56313C9.05801 3.78613 9.02101 4.04713 9.00701 4.42613C9.00078 4.70011 8.92501 4.96803 8.78682 5.2047C8.64863 5.44137 8.45256 5.63903 8.21701 5.77913C7.97791 5.91317 7.70865 5.98423 7.43454 5.98563C7.16043 5.98703 6.89047 5.91872 6.65001 5.78713C6.31401 5.60913 6.07101 5.51113 5.83001 5.47913C5.30433 5.41 4.77271 5.55243 4.35201 5.87513C4.03801 6.11813 3.80401 6.52113 3.33801 7.32813C2.87201 8.13513 2.63801 8.53813 2.58701 8.93313C2.55264 9.19358 2.56993 9.45825 2.63788 9.71202C2.70582 9.96579 2.8231 10.2037 2.98301 10.4121C3.13101 10.6041 3.33801 10.7651 3.65901 10.9671C4.13201 11.2641 4.43601 11.7701 4.43601 12.3281C4.43601 12.8861 4.13201 13.3921 3.65901 13.6881C3.33801 13.8911 3.13001 14.0521 2.98301 14.2441C2.8231 14.4526 2.70582 14.6905 2.63788 14.9442C2.56993 15.198 2.55264 15.4627 2.58701 15.7231C2.63901 16.1171 2.87201 16.5211 3.33701 17.3281C3.80401 18.1351 4.03701 18.5381 4.35201 18.7811C4.56045 18.941 4.79834 19.0583 5.05211 19.1263C5.30589 19.1942 5.57056 19.2115 5.83101 19.1771C6.07101 19.1451 6.31401 19.0471 6.65001 18.8691C6.89047 18.7375 7.16043 18.6692 7.43454 18.6706C7.70865 18.672 7.97791 18.7431 8.21701 18.8771C8.70001 19.1571 8.98701 19.6721 9.00701 20.2301C9.02101 20.6101 9.05701 20.8701 9.15001 21.0931C9.25052 21.3359 9.39791 21.5566 9.58373 21.7424C9.76956 21.9282 9.99019 22.0756 10.233 22.1761C10.6 22.3281 11.066 22.3281 11.998 22.3281C12.93 22.3281 13.396 22.3281 13.763 22.1761C14.0058 22.0756 14.2265 21.9282 14.4123 21.7424C14.5981 21.5566 14.7455 21.3359 14.846 21.0931C14.938 20.8701 14.975 20.6101 14.989 20.2301C15.009 19.6721 15.296 19.1561 15.779 18.8771C16.0181 18.7431 16.2874 18.672 16.5615 18.6706C16.8356 18.6692 17.1055 18.7375 17.346 18.8691C17.682 19.0471 17.925 19.1451 18.165 19.1771C18.4255 19.2115 18.6901 19.1942 18.9439 19.1263C19.1977 19.0583 19.4356 18.941 19.644 18.7811C19.959 18.5391 20.192 18.1351 20.658 17.3281C21.124 16.5211 21.358 16.1181 21.409 15.7231C21.4434 15.4627 21.4261 15.198 21.3581 14.9442C21.2902 14.6905 21.1729 14.4526 21.013 14.2441C20.865 14.0521 20.658 13.8911 20.337 13.6891C20.1027 13.5467 19.9085 13.3471 19.7726 13.109C19.6367 12.871 19.5635 12.6022 19.56 12.3281C19.56 11.7701 19.864 11.2641 20.337 10.9681C20.658 10.7651 20.866 10.6041 21.013 10.4121C21.1729 10.2037 21.2902 9.96579 21.3581 9.71202C21.4261 9.45825 21.4434 9.19358 21.409 8.93313C21.357 8.53913 21.124 8.13513 20.659 7.32813C20.192 6.52113 19.959 6.11813 19.644 5.87513C19.4356 5.71522 19.1977 5.59794 18.9439 5.52999C18.6901 5.46205 18.4255 5.44476 18.165 5.47913C17.925 5.51113 17.682 5.60913 17.345 5.78713C17.1047 5.91854 16.8349 5.98675 16.561 5.98535C16.2871 5.98395 16.018 5.91299 15.779 5.77913C15.5435 5.63903 15.3474 5.44137 15.2092 5.2047C15.071 4.96803 14.9952 4.70011 14.989 4.42613C14.975 4.04613 14.939 3.78613 14.846 3.56313C14.7455 3.32031 14.5981 3.09968 14.4123 2.91385C14.2265 2.72802 14.0058 2.58064 13.763 2.48012Z" stroke="#545454" stroke-width="1.3"></path>
            </svg>
            <p>Settings</p>
          </div>
          <RightOutlined />
        </Link>
      ),
    },
    {
      key: '4',
      label: (
        <Link className="dropdown-item" to="/audit-log">
          <div className="inline2">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path d="M23.8574 21.9531L20.9961 19.0918C21.6602 17.9688 22.0898 17.0313 22.0898 15.7227C22.0898 12.6074 19.5605 10.0781 16.4453 10.0781C13.3301 10.0781 10.8008 12.6074 10.8008 15.7227C10.8008 18.8379 13.3398 21.6699 16.4453 21.3672C17.7148 21.2402 18.8574 21.0156 19.8145 20.2734L22.6758 23.1348C22.9492 23.4082 23.4863 23.3203 23.7695 23.0469C24.043 22.7637 24.1309 22.2266 23.8574 21.9531ZM12.4609 15.7227C12.4609 13.5156 14.248 11.7285 16.4551 11.7285C18.6621 11.7285 20.4492 13.5156 20.4492 15.7227C20.4492 17.9297 18.6621 19.7168 16.4551 19.7168C14.248 19.7168 12.4609 17.9297 12.4609 15.7227Z" fill="#545454" />
              <path d="M18.5254 3.59375C18.5254 2.54883 17.6758 1.68945 16.6211 1.68945H2.88086C1.82617 1.69922 0.976562 2.54883 0.976562 3.59375V11.3574V11.6602V21.3965C0.976562 22.4414 1.82617 23.3008 2.88086 23.3008H4.26758L4.27734 23.291C4.32617 23.3008 4.375 23.3008 4.43359 23.3008H11.2598C11.7188 23.3008 12.0898 22.9297 12.0898 22.4707C12.0898 22.0117 11.7188 21.6406 11.2598 21.6406H5.66406H4.43359H3.59375C3.06641 21.6406 2.64648 21.2109 2.64648 20.6934V11.6699V11.3672V4.30664C2.64648 3.7793 3.07617 3.35938 3.59375 3.35938H15.918C16.4453 3.35938 16.8652 3.78906 16.8652 4.30664V7.66602C16.8652 8.125 17.2363 8.49609 17.6953 8.49609C18.1543 8.49609 18.5254 8.125 18.5254 7.66602V3.59375Z" fill="#545454" />
              <path d="M4.17969 6.8457C4.17969 7.30469 4.55078 7.67578 5.00977 7.67578H14.5117C14.9707 7.67578 15.3418 7.30469 15.3418 6.8457C15.3418 6.38672 14.9707 6.01562 14.5117 6.01562H5.00977C4.56055 6.01563 4.17969 6.38672 4.17969 6.8457Z" fill="#545454" />
              <path d="M4.17969 11.8848C4.17969 12.3438 4.55078 12.7148 5.00977 12.7148H9.64844C10.1074 12.7148 10.4785 12.3438 10.4785 11.8848C10.4785 11.4258 10.1074 11.0547 9.64844 11.0547H5.00977C4.56055 11.0547 4.17969 11.4258 4.17969 11.8848Z" fill="#545454" />
              <path d="M4.17969 16.7871C4.17969 17.2461 4.55078 17.6172 5.00977 17.6172H8.01758C8.47656 17.6172 8.84766 17.2461 8.84766 16.7871C8.84766 16.3281 8.47656 15.957 8.01758 15.957H5.00977C4.56055 15.957 4.17969 16.3281 4.17969 16.7871Z" fill="#545454" />
            </svg>
            <p>Audit Log</p>
          </div>
          <RightOutlined />
        </Link>
      ),
    },
    {
      key: '',
      label: (
        <button className="dropdown-item" onClick={handleLogoutShow}>
          <div className="inline2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
              <path d="M12.0002 4.14893C12.1992 4.14893 12.3899 4.22794 12.5306 4.3686C12.6712 4.50925 12.7502 4.70001 12.7502 4.89893C12.7502 5.09784 12.6712 5.2886 12.5306 5.42926C12.3899 5.56991 12.1992 5.64893 12.0002 5.64893C10.0774 5.64893 8.23336 6.41276 6.87372 7.7724C5.51408 9.13204 4.75024 10.9761 4.75024 12.8989C4.75024 14.8217 5.51408 16.6658 6.87372 18.0254C8.23336 19.3851 10.0774 20.1489 12.0002 20.1489C12.1992 20.1489 12.3899 20.2279 12.5306 20.3686C12.6712 20.5092 12.7502 20.7 12.7502 20.8989C12.7502 21.0978 12.6712 21.2886 12.5306 21.4293C12.3899 21.5699 12.1992 21.6489 12.0002 21.6489C9.6796 21.6489 7.454 20.7271 5.81306 19.0861C4.17212 17.4452 3.25024 15.2196 3.25024 12.8989C3.25024 10.5783 4.17212 8.35268 5.81306 6.71174C7.454 5.0708 9.6796 4.14893 12.0002 4.14893Z" fill="#FC5C5C"></path>
              <path d="M16.4698 10.4291C16.3373 10.287 16.2652 10.0989 16.2686 9.90462C16.272 9.71032 16.3507 9.52493 16.4881 9.38752C16.6255 9.2501 16.8109 9.17139 17.0052 9.16796C17.1995 9.16454 17.3876 9.23666 17.5298 9.36914L20.5298 12.3691C20.6702 12.5098 20.7491 12.7004 20.7491 12.8991C20.7491 13.0979 20.6702 13.2885 20.5298 13.4291L17.5298 16.4291C17.4611 16.5028 17.3783 16.5619 17.2863 16.6029C17.1943 16.6439 17.095 16.666 16.9943 16.6677C16.8936 16.6695 16.7935 16.651 16.7002 16.6133C16.6068 16.5755 16.5219 16.5194 16.4507 16.4482C16.3795 16.377 16.3234 16.2921 16.2856 16.1987C16.2479 16.1053 16.2294 16.0053 16.2312 15.9046C16.2329 15.8039 16.255 15.7046 16.296 15.6126C16.337 15.5206 16.3961 15.4378 16.4698 15.3691L18.1898 13.6491H9.99976C9.80084 13.6491 9.61008 13.5701 9.46943 13.4295C9.32877 13.2888 9.24976 13.0981 9.24976 12.8991C9.24976 12.7002 9.32877 12.5095 9.46943 12.3688C9.61008 12.2282 9.80084 12.1491 9.99976 12.1491H18.1898L16.4698 10.4291Z" fill="#FC5C5C"></path>
            </svg>

            <p>Log Out</p>
          </div>
          <RightOutlined />
        </button>
      ),
    },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ref = useClickAway(() => {
    setSearchPopper(false);
  });

  const updateRef = useClickAway(() => {
    setUpdatePopper(false);
  });


  const handleUpdateClick = () => {
    setUpdatePopper(true)
  }


  const getSearchedResult = async (textQuery) => {
    try {
      setSearchLoading(true);
      const response = await API.get(`main-search?search=${textQuery}`);
      if (response?.status === 200) {
        setFilteredResults(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
      setSearchPopper(false);
    }
  };

  const searchByText = (e) => {
    const value = e.target.value;
    setTextQuery(value);
    // if (value) {
    //   getSearchedResult(value);
    // }
  };

  useEffect(() => {
    if (textQuery) {
      getSearchedResult(textQuery);
    }
  }, [textQuery]);

  const navigatePrescription = () => {
    navigate('/consult-now')
  }

  const navigateAppointments = () => {
    navigate('/appointments')
  }

  const navigatePatients = () => {
    getMrNumber();
    getCitites();
    setPatientAddShow(true);
  }

  const getNotification = async () => {
    try {
      const response = await API.get("/get-unread-notification")
      if (response.status == 200) {
        setNotificationCount(response?.data?.data?.notification_count)
        setAllFeature(response?.data?.data?.all_features)
        setUnreadFeatures(response?.data?.data?.unread_features)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (isDashboard) {
      getNotification()
    }
  }, [isDashboard])

  const handleFocus = () => {
    if (searchQuery.current?.trim() !== "" || searchQuery.current?.trim() !== null) {
      setSearchPopper(true)
    }
    if (searchQuery.current?.trim() == "" || searchQuery.current?.trim() == null) {
      setSearchPopper(false)
    }
  }

  const handleRemoveSearch = () => {
    setTextQuery('')
    setFilteredResults([])
    setSearchPopper(false)
  }

  const navigateToAddConsultNow = async () => {
    Cookies.set('prescriptionsAdd', "1");
    Cookies.remove('itemId');
    Cookies.remove('patientId');
    Cookies.remove('doctorId');
    Cookies.remove('clinicId');
    Cookies.remove('appointmentCompleteDate');
    Cookies.remove('prescriptionsEdit');

    setTimeout(() => {
      navigate(`/consult-now`, {
        state: {
          addPrescriptions: true
        }
      });

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }, 1000);
  };


  function whatsappHandler() {
    let t = {
      welcomeMessage: "Hello",
      whatsAppNumber: '+9221111111111'
    }
    window.open(`https://wa.me/${t.whatsAppNumber}?text=` + encodeURIComponent(t?.welcomeMessage || "hello"), "_blank");
  }


  return (
    <header className={`header_main ${location.pathname == '/' ? 'padd' : 'hiddd'}`}>
      <Container fluid className='h-100'>
        <Row className='h-100'>
          <Col lg={6} className='h-100'>
            <div className="header_search">
              <h1 style={{ color: themeColor }}>
                {!isDashboard && (
                  <div className="d-lg-none d-block" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M7.81878 12.9994L13.4154 18.5961L11.9913 19.9952L3.99609 12L11.9913 4.00488L13.4154 5.40404L7.81878 11.0007H19.9864V12.9994H7.81878Z" fill={themeColor} />
                    </svg>
                  </div>
                )}
                {headerText}
              </h1>

              {isDashboard && (
                <button className="search-box" onClick={handleSearchShow}>
                  <img src={Search} alt="" />
                </button>
              )}

              <div className='h-100 align-items-center d-none d-md-flex hk_searchbar'>
                <div className={searchPopper ? "search-bar searcWithRes" : "search-bar"} ref={ref}>
                  <div className="cross_input">
                    <input
                      value={textQuery}
                      maxLength={50}
                      type="text"
                      placeholder='Search for patients (patient name, contact number)'
                      onChange={searchByText}
                      onFocus={handleFocus}
                      autoComplete="off"
                      name="search_input_random"
                    />
                    {textQuery && (
                      <>
                        <button onClick={handleRemoveSearch} className="cross"><img src={Cross} alt="" /></button>
                      </>
                    )}
                  </div>
                  <div
                    className={searchPopper ? "searchIconWraper searcWithRes" : 'searchIconWraper'}
                    style={{ background: themeStyle?.color ? themeStyle?.color : "#0F75BC" }}
                  >
                    <span className='arrow'></span>
                  </div>
                  {textQuery && (
                    <SearchResult
                      searchLoading={searchLoading}
                      filteredResults={filteredResults}
                      textQuery={textQuery}
                    />
                  )}
                </div>
              </div>
            </div>
          </Col>
          <Col lg={1} className='h-100 d-none d-md-block'></Col>
          <Col lg={5} className='h-100 d-none d-md-block'>
            <div className="wraper_icons">
              <div onClick={navigateToAddConsultNow} className="single_ico">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
                  <g clip-path="url(#clip0_6241_4128)">
                    <path d="M6.02 3.20312C5.57382 3.20312 5.14592 3.38037 4.83042 3.69587C4.51492 4.01136 4.33768 4.43927 4.33768 4.88545V18.344C4.33768 18.7902 4.51492 19.2181 4.83042 19.5336C5.14592 19.8491 5.57382 20.0264 6.02 20.0264C6.46618 20.0264 6.89408 19.8491 7.20958 19.5336C7.52508 19.2181 7.70232 18.7902 7.70232 18.344V13.2971H8.68816L15.4175 20.0264L11.5582 23.8822C11.2423 24.1981 11.0648 24.6266 11.0648 25.0733C11.0648 25.5201 11.2423 25.9485 11.5582 26.2644C11.8741 26.5803 12.3025 26.7578 12.7493 26.7578C13.196 26.7578 13.6245 26.5803 13.9404 26.2644L17.7963 22.4052L21.6521 26.2644C21.968 26.5803 22.3965 26.7578 22.8432 26.7578C23.29 26.7578 23.7184 26.5803 24.0343 26.2644C24.3502 25.9485 24.5277 25.5201 24.5277 25.0733C24.5277 24.6266 24.3502 24.1981 24.0343 23.8822L20.1751 20.0264L24.0343 16.1705C24.3502 15.8546 24.5277 15.4261 24.5277 14.9794C24.5277 14.5326 24.3502 14.1042 24.0343 13.7883C23.7184 13.4724 23.29 13.2949 22.8432 13.2949C22.3965 13.2949 21.968 13.4724 21.6521 13.7883L17.7963 17.6475L13.4054 13.2533C14.6747 13.0851 15.8327 12.4407 16.6447 11.4507C17.4567 10.4607 17.8621 9.19902 17.7787 7.92131C17.6952 6.64359 17.1293 5.44534 16.1955 4.56929C15.2616 3.69323 14.0297 3.20487 12.7493 3.20312H6.02ZM7.70232 6.56777H12.7493C13.1955 6.56777 13.6234 6.74501 13.9389 7.06051C14.2544 7.37601 14.4316 7.80391 14.4316 8.25009C14.4316 8.69627 14.2544 9.12418 13.9389 9.43967C13.6234 9.75517 13.1955 9.93242 12.7493 9.93242H7.70232V6.56777Z" stroke={themeColor} stroke-width="1.5" />
                    <path d="M27.8974 6.6005H25.2968V4H23.5632V6.6005H20.9627V8.33417H23.5632V10.9347H25.2968V8.33417H27.8974V6.6005Z" fill={themeColor} stroke={themeColor} stroke-width="0.288945" />
                  </g>
                  <defs>
                    <clipPath id="clip0_6241_4128">
                      <rect width="27.7387" height="27.7387" fill="white" transform="translate(0.630646 0.195312)" />
                    </clipPath>
                  </defs>
                </svg>
                <h4> Prescription </h4>
              </div>
              {allowedPermissionsAppointment["appointments_add"] && <div onClick={handleBookAppointmentShow} className="single_ico">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
                  <g clip-path="url(#clip0_5295_33529)">
                    <path d="M22.8478 18.2422H20.2473V15.6417H18.5136V18.2422H15.9131V19.9759H18.5136V22.5764H20.2473V19.9759H22.8478V18.2422Z" fill={themeColor} stroke={themeColor} stroke-width="0.288945" />
                    <path d="M19.3829 26.0423C15.5688 26.0423 12.4482 22.9217 12.4482 19.1076C12.4482 15.2936 15.5688 12.173 19.3829 12.173C23.197 12.173 26.3176 15.2936 26.3176 19.1076C26.3176 22.9217 23.197 26.0423 19.3829 26.0423ZM19.3829 13.9066C16.5224 13.9066 14.1819 16.2471 14.1819 19.1076C14.1819 21.9682 16.5224 24.3087 19.3829 24.3087C22.2435 24.3087 24.5839 21.9682 24.5839 19.1076C24.5839 16.2471 22.2435 13.9066 19.3829 13.9066Z" fill={themeColor} stroke={themeColor} stroke-width="0.288945" />
                    <path d="M24.5843 5.24187C24.5843 4.28836 23.8041 3.5082 22.8506 3.5082H19.3833V1.77454H17.6496V3.5082H10.7149V1.77454H8.98128V3.5082H5.51394C4.56042 3.5082 3.78027 4.28836 3.78027 5.24187V22.5786C3.78027 23.5321 4.56042 24.3122 5.51394 24.3122H10.7149V22.5786H5.51394V5.24187H8.98128V6.97554H10.7149V5.24187H17.6496V6.97554H19.3833V5.24187H22.8506V10.4429H24.5843V5.24187Z" fill={themeColor} stroke={themeColor} stroke-width="0.288945" />
                  </g>
                  <defs>
                    <clipPath id="clip0_5295_33529">
                      <rect width="27.7387" height="27.7387" fill="white" transform="translate(0.311523 0.0401611)" />
                    </clipPath>
                  </defs>
                </svg>
                <h4> Appt </h4>
              </div>}
              {allowedPermissionsPatient["patients_add"] && <div onClick={navigatePatients} className="single_ico">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
                  <g clip-path="url(#clip0_5295_33537)">
                    <path d="M27.0992 12.5242H23.709V9.13391H22.0138V12.5242H18.6235V14.2193H22.0138V17.6096H23.709V14.2193H27.0992V12.5242Z" fill={themeColor} stroke={themeColor} stroke-width="0.247208" />
                    <path d="M10.1464 4.0478C10.9845 4.0478 11.8039 4.29635 12.5008 4.76201C13.1977 5.22767 13.7409 5.88953 14.0616 6.6639C14.3824 7.43827 14.4663 8.29036 14.3028 9.11242C14.1393 9.93449 13.7357 10.6896 13.143 11.2823C12.5503 11.875 11.7952 12.2786 10.9731 12.4421C10.1511 12.6056 9.29899 12.5217 8.52462 12.2009C7.75026 11.8802 7.08839 11.337 6.62273 10.6401C6.15707 9.94317 5.90852 9.12383 5.90852 8.28566C5.90852 7.16171 6.35501 6.08379 7.14976 5.28904C7.94452 4.49429 9.02243 4.0478 10.1464 4.0478ZM10.1464 2.35266C8.97294 2.35266 7.82586 2.70063 6.85018 3.35255C5.87451 4.00448 5.11406 4.93109 4.665 6.0152C4.21595 7.09931 4.09846 8.29224 4.32738 9.44313C4.55631 10.594 5.12137 11.6512 5.95112 12.4809C6.78086 13.3107 7.83802 13.8757 8.98891 14.1047C10.1398 14.3336 11.3327 14.2161 12.4168 13.767C13.501 13.318 14.4276 12.5575 15.0795 11.5819C15.7314 10.6062 16.0794 9.4591 16.0794 8.28566C16.0794 6.71213 15.4543 5.20305 14.3416 4.0904C13.229 2.97774 11.7199 2.35266 10.1464 2.35266Z" fill={themeColor} stroke={themeColor} stroke-width="0.247208" />
                    <path d="M18.6218 26.0859H16.9267V21.848C16.9267 20.7241 16.4802 19.6462 15.6855 18.8514C14.8907 18.0567 13.8128 17.6102 12.6888 17.6102H7.60341C6.47946 17.6102 5.40154 18.0567 4.60679 18.8514C3.81204 19.6462 3.36555 20.7241 3.36555 21.848V26.0859H1.67041V21.848C1.67041 20.2745 2.29549 18.7654 3.40815 17.6528C4.5208 16.5401 6.02988 15.915 7.60341 15.915H12.6888C14.2624 15.915 15.7714 16.5401 16.8841 17.6528C17.9968 18.7654 18.6218 20.2745 18.6218 21.848V26.0859Z" fill={themeColor} stroke={themeColor} stroke-width="0.247208" />
                  </g>
                  <defs>
                    <clipPath id="clip0_5295_33537">
                      <rect width="27.7387" height="27.7387" fill="white" transform="translate(0.518066 0.0401611)" />
                    </clipPath>
                  </defs>
                </svg>

                <h4> Patient </h4>
              </div>}
              <div className="single_ico" ref={updateRef} onClick={handleUpdateClick}>
                <div className="positon-relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
                    <g clip-path="url(#clip0_5295_33546)">
                      <path d="M22.9686 12.5095C23.0156 12.5549 23.0801 12.5821 23.1508 12.5806L26.3016 12.5113C26.4433 12.5082 26.5564 12.3912 26.5546 12.2495C26.5529 12.1078 26.437 11.9958 26.2953 11.9989L23.1444 12.0681C23.0027 12.0712 22.8896 12.1883 22.8914 12.33C22.8923 12.4006 22.9217 12.4642 22.9686 12.5095Z" fill={themeColor} stroke={themeColor} stroke-width="1.36791" />
                      <path d="M22.0921 9.78172C22.1012 9.79439 22.1111 9.80578 22.1219 9.81623C22.2092 9.9006 22.3469 9.91225 22.4495 9.83804L24.7672 8.15992C24.8825 8.07654 24.9088 7.91609 24.8267 7.8017C24.7447 7.68696 24.5845 7.6622 24.4692 7.74558L22.1515 9.4237C22.0364 9.50689 22.0101 9.66734 22.0921 9.78172Z" fill={themeColor} stroke={themeColor} stroke-width="1.36791" />
                      <path d="M24.8696 16.4157L22.5117 14.8405C22.3946 14.7624 22.2353 14.7943 22.1557 14.9123C22.0851 15.0173 22.1017 15.1547 22.1888 15.2389C22.1996 15.2494 22.2113 15.2589 22.2243 15.2675L24.5822 16.8427C24.6993 16.9208 24.8586 16.8888 24.9381 16.7709C25.0173 16.653 24.9865 16.4947 24.8696 16.4157Z" fill="white" stroke={themeColor} stroke-width="1.15578" />
                      <path d="M19.3553 14.9186C19.3778 16.7406 19.4129 19.5843 19.4129 19.5843C19.4163 19.8374 19.3145 20.0757 19.1377 20.2472C19.0788 20.3045 19.0116 20.3542 18.9373 20.3948C18.6383 20.5578 18.2787 20.5412 17.9985 20.3522C17.7644 20.194 17.5288 20.0409 17.2926 19.8912C17.2265 19.8491 17.1604 19.8092 17.0945 19.7681C16.9221 19.6609 16.7495 19.5551 16.5766 19.4525C16.4997 19.4068 16.4229 19.3623 16.346 19.3178C16.1854 19.2245 16.0246 19.1336 15.8638 19.0445C15.7787 18.9974 15.6939 18.9506 15.6087 18.9048C15.4611 18.8252 15.3135 18.7488 15.1661 18.673C13.1986 17.6637 11.2294 16.9832 9.27716 16.64C9.04577 16.5998 8.81714 16.5636 8.59293 16.5329C8.58603 16.5319 8.57932 16.5308 8.57242 16.5299C8.4477 16.5128 8.32867 16.5017 8.20706 16.4877L8.25864 20.6171C8.26335 20.9966 8.11921 21.3572 7.85294 21.6328C7.58632 21.9087 7.23104 22.065 6.85181 22.0731C6.47241 22.0815 6.11345 21.9409 5.84031 21.677C5.56718 21.4131 5.41435 21.0592 5.40983 20.6799L5.35805 16.5048L5.21237 16.508C4.16746 16.5311 3.21421 16.1265 2.51936 15.4551C1.82432 14.7836 1.38732 13.8454 1.37454 12.8C1.36198 11.7873 1.74443 10.8266 2.4516 10.0947C2.6284 9.91172 2.82012 9.74854 3.02424 9.6063C3.63624 9.17957 4.35896 8.94183 5.1185 8.92514L7.79646 8.86629C8.01972 8.83528 8.24907 8.79834 8.48234 8.75624C8.49338 8.75436 8.5044 8.75176 8.51543 8.74989C8.73351 8.70993 8.95479 8.66519 9.17855 8.61605C11.1194 8.18767 13.0687 7.4216 15.0083 6.3282C15.1561 6.24466 15.3036 6.16057 15.4515 6.07322C15.5345 6.02445 15.6174 5.97423 15.7003 5.92401C15.8601 5.82733 16.0196 5.72866 16.1789 5.62764C16.2534 5.58033 16.328 5.53319 16.4024 5.48515C16.5747 5.3737 16.7469 5.25898 16.9185 5.14265C16.9812 5.10012 17.0442 5.05886 17.1069 5.01561C17.3398 4.85533 17.5721 4.69162 17.8031 4.52269C17.9753 4.39691 18.1801 4.33731 18.3834 4.3468C18.5052 4.35246 18.6269 4.38296 18.7403 4.43919C19.0417 4.58827 19.2314 4.89116 19.2351 5.22914C19.2351 5.22914 19.2697 8.84741 19.2919 10.6419M19.2985 10.3419C19.3083 11.1345 19.3237 12.3715 19.3237 12.3715L19.3488 14.8753M14.6776 7.09115L14.8119 17.9226C13.0742 17.0884 11.3347 16.5052 9.60564 16.1782L9.51702 9.06267C11.2372 8.65999 12.9613 8.0011 14.6776 7.09115ZM1.88693 12.7887C1.87607 11.9131 2.20685 11.0818 2.81829 10.449C2.97111 10.2908 3.137 10.1496 3.31363 10.0266C3.84316 9.65773 4.46787 9.45204 5.12468 9.43779L7.81767 9.37843L7.84718 9.37615C8.03861 9.34983 8.23414 9.31925 8.43253 9.28462C8.5991 9.25613 8.76579 9.22346 8.93212 9.19008C8.95688 9.18501 8.98112 9.18121 9.00607 9.17595L9.0918 16.0878C9.06256 16.0832 9.03424 16.0794 9.005 16.0748C8.90114 16.0586 8.79727 16.0428 8.69325 16.0286C8.5284 16.0057 8.36521 15.9848 8.20496 15.9671C8.19733 15.9662 8.18953 15.9651 8.1819 15.9642L8.18528 15.9299L5.20619 15.9953C3.39848 16.0352 1.90936 14.5968 1.88693 12.7887ZM7.48589 21.2782C7.31518 21.4548 7.0877 21.5552 6.84528 21.5605C6.3606 21.5713 5.92824 21.1536 5.92204 20.6685L5.87008 16.4935L7.69392 16.4535L7.74588 20.6284C7.74889 20.8709 7.6566 21.1015 7.48589 21.2782ZM18.6954 19.9452C18.564 20.0169 18.412 20.0098 18.2883 19.9264C18.0569 19.7701 17.8254 19.6195 17.5936 19.4722C17.5325 19.4333 17.4714 19.3964 17.41 19.3582C17.2378 19.2505 17.0654 19.1445 16.8928 19.0415C16.8189 18.9972 16.7448 18.9546 16.6706 18.9113C16.5124 18.8189 16.3541 18.7283 16.1959 18.6403C16.1119 18.5935 16.028 18.5472 15.944 18.5015C15.7988 18.4228 15.6536 18.3458 15.5082 18.2706C15.448 18.2392 15.3874 18.2054 15.3272 18.1745L15.1865 6.81696C15.2449 6.78414 15.3033 6.74823 15.3616 6.71505C15.4943 6.63945 15.627 6.56221 15.7596 6.48335C15.8514 6.42877 15.943 6.37437 16.0347 6.31834C16.1856 6.22639 16.3365 6.13189 16.4872 6.03614C16.5656 5.9862 16.644 5.93735 16.7224 5.88632C16.8889 5.77826 17.0551 5.66675 17.2212 5.55398C17.2861 5.50996 17.351 5.46739 17.4157 5.42283C17.6416 5.26687 17.867 5.1073 18.0924 4.94266C18.0959 4.94022 18.0991 4.93798 18.1023 4.93573C18.1936 4.8692 18.3018 4.84489 18.4065 4.8647C18.4413 4.87119 18.4759 4.88275 18.5091 4.89942C18.624 4.95672 18.6958 5.0619 18.7146 5.18565C18.7173 5.20408 18.7224 5.22155 18.7225 5.24058L18.7792 9.81185L18.843 14.9539L18.9005 19.5955C18.9024 19.7434 18.8257 19.8741 18.6954 19.9452Z" stroke={themeColor} stroke-width="1.36791" />
                    </g>
                    <defs>
                      <clipPath id="clip0_5295_33546">
                        <rect width="27.7387" height="27.7387" fill="white" transform="translate(0.593506)" />
                      </clipPath>
                    </defs>
                  </svg>
                  {notificationCount > 0 ? (<div className="notification_span_tag">{notificationCount}</div>) : null}
                </div>

                <h4> Updates </h4>
                {updatePopper &&
                  <UpdatePopper allFeature={allFeature} unreadFeatures={unreadFeatures} notificationCount={notificationCount} setNotificationCount={setNotificationCount} getNotification={getNotification} />
                }
              </div>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                className="p-0"
              >
                <div className="single_ico">
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="24" viewBox="0 0 26 24" fill="none">
                    <path d="M11.8475 23.6154V21.0487H22.1143V11.9369C22.1143 9.43442 21.2427 7.31154 19.4995 5.56833C17.7563 3.82511 15.6334 2.9535 13.1309 2.9535C10.6283 2.9535 8.50545 3.82511 6.76224 5.56833C5.01902 7.31154 4.14741 9.43442 4.14741 11.9369V19.7654H2.86406C2.15822 19.7654 1.55398 19.5141 1.05133 19.0114C0.548686 18.5088 0.297363 17.9045 0.297363 17.1987V14.632C0.297363 14.1828 0.409656 13.7604 0.634243 13.3647C0.858829 12.969 1.17432 12.6535 1.58071 12.4182L1.67696 10.7178C1.84808 9.2633 2.27051 7.91579 2.94427 6.67522C3.61803 5.43464 4.4629 4.35449 5.47889 3.43476C6.49487 2.51502 7.66058 1.79849 8.97602 1.28515C10.2914 0.771807 11.6764 0.515137 13.1309 0.515137C14.5853 0.515137 15.9649 0.771807 17.2697 1.28515C18.5744 1.79849 19.7401 2.50968 20.7668 3.41872C21.7935 4.32775 22.6383 5.40256 23.3014 6.64313C23.9645 7.8837 24.3923 9.23122 24.5848 10.6857L24.681 12.354C25.0874 12.5465 25.4029 12.8353 25.6275 13.2203C25.8521 13.6053 25.9644 14.0117 25.9644 14.4395V17.3912C25.9644 17.819 25.8521 18.2254 25.6275 18.6104C25.4029 18.9954 25.0874 19.2841 24.681 19.4766V21.0487C24.681 21.7546 24.4297 22.3588 23.927 22.8615C23.4244 23.3641 22.8201 23.6154 22.1143 23.6154H11.8475Z" fill={themeColor} />
                    <path d="M12.1421 14.4273C12.1421 13.5154 12.2274 12.8597 12.3981 12.4601C12.5689 12.0604 12.9309 11.6242 13.4843 11.1514C13.967 10.7461 14.3349 10.3943 14.5881 10.096C14.8412 9.79767 14.9678 9.45713 14.9678 9.07438C14.9678 8.61282 14.8059 8.23007 14.4821 7.92612C14.1583 7.62217 13.708 7.47019 13.1311 7.47019C12.5306 7.47019 12.0744 7.64468 11.7623 7.99366C11.4503 8.34264 11.2296 8.69725 11.1001 9.05749L9.28101 8.3145C9.52826 7.59402 9.98155 6.96924 10.6409 6.44013C11.3002 5.91103 12.1303 5.64648 13.1311 5.64648C14.3673 5.64648 15.318 5.97576 15.9833 6.63433C16.6485 7.29289 16.9811 8.08372 16.9811 9.00683C16.9811 9.56971 16.8545 10.051 16.6014 10.4506C16.3483 10.8502 15.9509 11.3034 15.4093 11.8099C14.8324 12.339 14.4821 12.7415 14.3585 13.0173C14.2349 13.2931 14.173 13.7631 14.173 14.4273H12.1421ZM13.1311 18.48C12.7425 18.48 12.4099 18.3477 12.1332 18.0832C11.8565 17.8186 11.7182 17.5006 11.7182 17.1291C11.7182 16.7576 11.8565 16.4396 12.1332 16.175C12.4099 15.9105 12.7425 15.7782 13.1311 15.7782C13.5196 15.7782 13.8522 15.9105 14.1289 16.175C14.4056 16.4396 14.5439 16.7576 14.5439 17.1291C14.5439 17.5006 14.4056 17.8186 14.1289 18.0832C13.8522 18.3477 13.5196 18.48 13.1311 18.48Z" fill={themeColor} />
                  </svg>
                  <h4> Help </h4>
                </div>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                className="menu_help"
              >
                <MenuItem onClick={handleClose}>
                  <div className="wrape_help_call">
                    <span>  </span>
                    <a href="tel:922111222333"> Call Us (+92) 2 111 222 333  </a>
                  </div>
                </MenuItem>
                <MenuItem>
                  <div onClick={whatsappHandler} className="wrape_whatsapp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <g clip-path="url(#clip0_859_9225)">
                        <path d="M0 19.9999C0.214115 19.2224 0.418184 18.4812 0.621625 17.7403C0.869647 16.8372 1.12018 15.9347 1.35941 15.029C1.38453 14.9344 1.37071 14.8053 1.32394 14.7198C-0.717067 10.9795 -0.234208 6.52078 2.60455 3.3305C4.33317 1.38795 6.51859 0.272419 9.11968 0.0415439C13.5131 -0.348783 17.489 2.03829 19.2261 6.06811C20.8838 9.91342 19.8129 14.5792 16.6448 17.3284C14.6895 19.025 12.4171 19.8689 9.82419 19.8288C8.26573 19.8047 6.79455 19.4166 5.41002 18.6998C5.32871 18.6579 5.20721 18.6522 5.11648 18.6757C3.48455 19.0955 1.85451 19.5222 0.224162 19.9473C0.164197 19.9629 0.103604 19.9758 0.000313952 20.0002L0 19.9999ZM2.39043 17.651C3.37027 17.3938 4.30742 17.1533 5.2408 16.8989C5.43702 16.8453 5.59117 16.8672 5.7673 16.9709C7.73295 18.1278 9.83486 18.4505 12.0498 17.9076C16.2492 16.8779 18.9275 12.7409 18.1951 8.49465C17.4708 4.29566 13.467 1.049 8.76334 1.76606C6.87272 2.05426 5.26184 2.91292 3.97087 4.31947C2.26077 6.18339 1.55438 8.3919 1.82438 10.8996C1.96189 12.1761 2.40895 13.3521 3.11503 14.4269C3.19948 14.5554 3.21675 14.6672 3.17123 14.8126C3.0761 15.117 2.99856 15.4269 2.9141 15.7348C2.74268 16.3613 2.57127 16.9882 2.39012 17.651H2.39043Z" fill="#7CC14B" />
                        <path d="M2.39022 17.6515C2.57137 16.9887 2.74279 16.3618 2.91421 15.7353C2.99835 15.4274 3.07621 15.1175 3.17133 14.813C3.21654 14.6677 3.19959 14.5559 3.11514 14.4274C2.40906 13.3526 1.96199 12.1769 1.82448 10.9001C1.55448 8.39271 2.26087 6.1842 3.97097 4.31997C5.26163 2.9131 6.87283 2.05444 8.76345 1.76655C13.4671 1.04981 17.4709 4.29647 18.1952 8.49514C18.9276 12.7414 16.2496 16.8784 12.0499 17.9081C9.83496 18.4513 7.73306 18.1286 5.7674 16.9714C5.59096 16.8677 5.43712 16.8458 5.24091 16.8994C4.30753 17.1537 3.37038 17.3943 2.39053 17.6515H2.39022ZM6.79968 5.34904C6.31023 5.25443 5.97524 5.47278 5.67887 5.82019C4.99822 6.61775 4.84124 7.52152 5.09963 8.51206C5.3128 9.32905 5.78938 10.006 6.28605 10.6711C7.6687 12.5228 9.39041 13.9027 11.6593 14.532C12.5629 14.7827 13.4131 14.7288 14.2234 14.2066C14.8868 13.7793 15.1006 13.1609 15.0798 12.4247C15.0773 12.3386 15.0076 12.2126 14.9339 12.1763C14.2297 11.828 13.5195 11.4909 12.8068 11.1594C12.6012 11.0639 12.4408 11.1369 12.3026 11.3211C12.065 11.6378 11.8053 11.9385 11.557 12.2471C11.4198 12.4178 11.2578 12.447 11.0553 12.3665C9.57627 11.7794 8.44384 10.7939 7.63259 9.43399C7.52585 9.25481 7.53087 9.10663 7.6665 8.94123C7.87779 8.68341 8.07181 8.41119 8.27243 8.1446C8.4024 7.97199 8.40397 7.79563 8.31795 7.59702C8.07244 7.03032 7.8285 6.46269 7.60591 5.88691C7.45678 5.50128 7.25616 5.23031 6.79999 5.34872L6.79968 5.34904Z" fill="white" fill-opacity="0.2" />
                        <path d="M6.80032 5.35045C7.25681 5.23173 7.45711 5.5027 7.60623 5.88864C7.82883 6.46442 8.07277 7.03237 8.31828 7.59875C8.4043 7.79735 8.40273 7.97341 8.27275 8.14633C8.07214 8.41292 7.87843 8.68514 7.66683 8.94296C7.53151 9.10805 7.52618 9.25654 7.63292 9.43572C8.44417 10.7959 9.5766 11.7811 11.0556 12.3682C11.2581 12.4487 11.4198 12.4192 11.5573 12.2488C11.8057 11.94 12.0653 11.6395 12.303 11.3228C12.4411 11.1386 12.6015 11.0656 12.8072 11.1612C13.5198 11.4926 14.23 11.8297 14.9342 12.178C15.008 12.2147 15.078 12.3403 15.0802 12.4265C15.1009 13.1626 14.8871 13.781 14.2237 14.2083C13.4131 14.7305 12.5632 14.7844 11.6597 14.5338C9.39074 13.9044 7.66902 12.5245 6.28638 10.6728C5.78971 10.0077 5.31313 9.33047 5.09995 8.51379C4.84157 7.52325 4.99823 6.61948 5.6792 5.82191C5.97557 5.47451 6.31055 5.25616 6.80001 5.35077L6.80032 5.35045Z" fill="#7CC14B" />
                      </g>
                      <defs>
                        <clipPath id="clip0_859_9225">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p>Whatsapp Now</p>
                  </div>
                </MenuItem>
                <MenuItem>
                  <Link to="/video-guide" className="wrape_tutorial" onClick={() => hidePopperOnNotification()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
                      <path d="M8.5 15.5L15.5 11L8.5 6.5V15.5ZM11 21C9.61667 21 8.31667 20.7375 7.1 20.2125C5.88333 19.6875 4.825 18.975 3.925 18.075C3.025 17.175 2.3125 16.1167 1.7875 14.9C1.2625 13.6833 1 12.3833 1 11C1 9.61667 1.2625 8.31667 1.7875 7.1C2.3125 5.88333 3.025 4.825 3.925 3.925C4.825 3.025 5.88333 2.3125 7.1 1.7875C8.31667 1.2625 9.61667 1 11 1C12.3833 1 13.6833 1.2625 14.9 1.7875C16.1167 2.3125 17.175 3.025 18.075 3.925C18.975 4.825 19.6875 5.88333 20.2125 7.1C20.7375 8.31667 21 9.61667 21 11C21 12.3833 20.7375 13.6833 20.2125 14.9C19.6875 16.1167 18.975 17.175 18.075 18.075C17.175 18.975 16.1167 19.6875 14.9 20.2125C13.6833 20.7375 12.3833 21 11 21ZM11 19C13.2333 19 15.125 18.225 16.675 16.675C18.225 15.125 19 13.2333 19 11C19 8.76667 18.225 6.875 16.675 5.325C15.125 3.775 13.2333 3 11 3C8.76667 3 6.875 3.775 5.325 5.325C3.775 6.875 3 8.76667 3 11C3 13.2333 3.775 15.125 5.325 16.675C6.875 18.225 8.76667 19 11 19Z" fill="#FFB400" />
                    </svg>
                    <p>Tutorial Guide</p>
                  </Link>
                </MenuItem>
              </Menu>
              <Divider type='vertical' className="hr" />
              <Dropdown
                menu={{
                  items,
                }}
              >
                <a onClick={(e) => e.preventDefault()} className='anchorsNav'>
                  <div className="drop-content">
                    <div className="drop-info">
                      <h3> Dr. {user ? user?.first_name : user?.name} </h3>
                      <span> Role: Doctor </span>
                    </div>
                    <span className='arrow-down'>  </span>
                  </div>
                </a>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Container >
      <LogoutModal handleLogoutClose={handleLogoutClose} handleLogout={handleLogout} logoutShow={logoutShow} />
      <SearchModal handleSearchClose={handleSearchClose} searchShow={searchShow} />
      <BookAppointmentModal bookAppointmentShow={bookAppointmentShow} setBookAppointmentShow={setBookAppointmentShow} handleBookAppointmentClose={handleBookAppointmentClose} doctors={doctors} />
      <ThemeStyleModal handleCloseTheme={handleCloseTheme} showThemeModal={showThemeModal} />
      <AddPatientModal setPatientAddShow={setPatientAddShow} cities={cities} patientAddShow={patientAddShow} mrNumber={mrNumber} fetchAllPatientsListing={fetchAllPatientsListing} />

    </header >
  )
}

export default Header;