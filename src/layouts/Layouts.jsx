import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header/Header';
import SideBar from './SideBar/Sidebar';
import Toast from './toast/Toast';
import AddButton from '../assets/images/png/add-icon-mobile.png'
import AddPrescription from '../assets/images/svg/add_prescription.svg'
import AddAppointment from '../assets/images/svg/add_appointment.svg'
import AddPatient from '../assets/images/svg/add_patient.svg'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import Loader from '../components/loader/Loader';
import API from "../services/httpInstance";
import { useDispatch } from 'react-redux';
import { userDetailsSuccess } from '../redux/slices/userDetailsSlice';
import Cookies from 'js-cookie';
import BookAppointmentModal from '../components/modal/bookAppointmentModal/BookAppointmentModal';
import AddPatientModal from '../components/modal/addPatientModal/AddPatientModal';
import { useNavigate } from 'react-router-dom';

const Layouts = ({ children, className }) => {
    let cookiesGet = Cookies.get('Authorization')
    const dispatch = useDispatch();
    const [hideLayout, setHideLayout] = useState(false);
    const [doctors, setDoctors] = useState(null);
    const [cities, setCities] = useState([]);
    const [patientAddShow, setPatientAddShow] = useState(false);
    const [mrNumber, setMrNumber] = useState(null);
    const [bookAppointmentShow, setBookAppointmentShow] = useState(false);
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showBack, setShowback] = useState('')
    const dropdownRef = useRef(null)
    const navigate = useNavigate();

    const handleBookAppointmentClose = () => setBookAppointmentShow(false);

    // const getAllDoctors = async () => {
    //     try {
    //         const response = await API.get(`/doctor`)
    //         if (response?.status == 200) {
    //             setDoctors(response?.data?.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    
    // useEffect(() => {
    //     getAllDoctors()
    // }, [])

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

      const handlePatientAddShow = () => {
        getMrNumber();
        getCitites();
        setPatientAddShow(true);
      }

    useEffect(() => {
        if (location.pathname == "/register" || location.pathname == "/login" || location.pathname == "/select-clinic" || location.pathname == "/theme-setting") {
            setHideLayout(true);
        }
        else {
            setHideLayout(false);
        }
    }, [location])

    useEffect(() => {
        const handleOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowback(false)
            }
        }
        document.addEventListener("click", handleOutside)

        return () => { document.removeEventListener("click", handleOutside) }
    }, [])

    const handleDropdown = () => {
        setShowback(!showBack)
    }

    useEffect(() => {
        setLoading(true); // Start loading when route changes

        // Simulate loading delay (remove if API call needed)
        const timer = setTimeout(() => {
            setLoading(false); // Hide loader when route change completes
        }, 800);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    const getUser = async () => {
        try {
            const response = await API.get(`/user`)
            if (response?.status == 200) {
                dispatch(userDetailsSuccess(response?.data));
            }
        } catch (error) {
            console.log(error)
        }
    }

    const navigateToAddConsultNow = async () => {
        Cookies.set('prescriptionsAdd', "1");
        Cookies.remove('prescriptionsEdit');
        Cookies.remove('patientClose');
        navigate(`/consult-now`, {
            state: {
                addPrescriptions: true,
            }
        })
    }


    useEffect(() => {
        if (cookiesGet) {
            getUser();
        }
    }, [])

    const handleBookAppointmentShow = () => {
        setBookAppointmentShow(true);
    }

    const {pathname} = useLocation();

    return (
        <Fragment>
            {hideLayout ?
                children
                :
                <section className={'layoutMain'}>
                    {loading && <Loader />} {/* Show loader when navigating */}
                    <SideBar />
                    <div className={`bottom__layout ${showBack ? "bg_color" : ''}`}>
                        <Toast />
                        <Header />
                        <section className={`bodyWraperLayout`}>
                            {children}
                        </section>
                        {(isMobile && pathname == "/") && <DropdownButton ref={dropdownRef} className='dropdown_plus' id="dropdown-basic-button" title={<img src={AddButton} alt="Add" />} onClick={handleDropdown}>
                            <Dropdown.Item onClick={navigateToAddConsultNow}>Add Prescription <img src={AddPrescription} alt="" /></Dropdown.Item>
                            <Dropdown.Item onClick={handleBookAppointmentShow}>Add Appointment <img src={AddAppointment} alt="" /></Dropdown.Item>
                            <Dropdown.Item onClick={handlePatientAddShow} >Add Patient <img src={AddPatient} alt="" /></Dropdown.Item>
                        </DropdownButton>
                        }
                    </div>
                </section>}
            {(isMobile && pathname == "/") &&
                (<>
                    <BookAppointmentModal doctors={doctors} bookAppointmentShow={bookAppointmentShow} handleBookAppointmentClose={handleBookAppointmentClose} setBookAppointmentShow={setBookAppointmentShow} />
                    <AddPatientModal setPatientAddShow={setPatientAddShow} cities={cities} patientAddShow={patientAddShow} mrNumber={mrNumber} />
                </>)}
        </Fragment>
    )
}

export default Layouts;