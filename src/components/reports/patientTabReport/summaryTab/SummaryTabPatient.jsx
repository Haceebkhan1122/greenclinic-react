/* eslint-disable no-unused-vars */
import { Form, Modal, Row, Col } from 'react-bootstrap';
import { DatePicker } from 'antd';
import './summaryTabPatient.scss';
import { Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import API from '../../../../services/httpInstance/index';
import dayjs from 'dayjs';
import moment from "moment";
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { useMediaQuery } from '@mui/material'
import Search from "../../../../assets/images/svg/search.svg"

const SummaryTabPatient = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    let loggedInClinic = useSelector((state) => state.clinic);
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [summaryTabPatientData, setsummaryTabPatientData] = useState([]);
    const [patientsReport, setPatientsReport] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allDoctors, setAllDoctors] = useState([]);
    const [selectedAge, setSelectedAge] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [currentPage, setCurrentPage] = useState("1");
    const [totalPages, setTotalPages] = useState(1);
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [ageList, setAgeList] = useState([]);
    const [genderList, setGenderList] = useState([]);
    const isMobile = useMediaQuery('(max-width:767px)');
    const [summryfilterShow, setSummryFilterShow] = useState(false);

    const handleSummryFilterClose = () => setSummryFilterShow(false);
    const handleSummryFilterShow = () => setSummryFilterShow(true);

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);
    };

    const handleDateChange = (date) => {
        let formatDate = dayjs(date).format('YYYY/MM/DD')
        setSelectedDate(formatDate)
    }

    const onChange = (date, dateString) => {
        setSelectedYear(dateString)
    };
    const formatPhoneNumber = (phone) => {
        if (!phone) return ""; // Handle empty or undefined phone numbers
        const cleaned = phone.replace(/\D/g, ""); // Remove non-numeric characters
        return cleaned.replace(/(\d{4})(\d+)/, "$1-$2"); // Add hyphen after the first 4 digits
    };
    useEffect(() => {
        getDoctors();
        getAgeList();
        getGenderList();
    }, []);

    useEffect(() => {
        getReports();
    }, [currentPage]);

    useEffect(() => {
        totalPatients();
        getReports();
    }, [selectedAge, selectedDate, selectedYear, selectedDoctor, selectedGender])

    const getReports = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) queryParams.append("year", selectedYear);
            if (selectedDoctor) queryParams.append("doctor_id", selectedDoctor);
            if (selectedGender) queryParams.append("gender", selectedGender);
            if (selectedAge) queryParams.append("age", selectedAge);

            const url = queryParams.toString()
                ? `/reports/patient-clinic-listing?page=${currentPage}&${queryParams.toString()}`
                : `/reports/patient-clinic-listing?page=${currentPage}`;

            const response = await API.get(url);
            if (response?.status == 200) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setsummaryTabPatientData(response?.data?.data);
                setCurrentPage(response?.data?.data?.pagination?.current_page)
                setPaginateCountData(response?.data?.data?.pagination)
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const totalPatients = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) queryParams.append("year", selectedYear);
            if (selectedDoctor) queryParams.append("doctor_id", selectedDoctor);
            if (selectedGender) queryParams.append("gender", selectedGender);
            if (selectedAge) queryParams.append("age", selectedAge);

            const url = queryParams.toString()
                ? `/reports/patient-clinic-report?${queryParams.toString()}`
                : `/reports/patient-clinic-report`;

            const response = await API.get(url);
            if (response?.status == 200) {
                setPatientsReport(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getDoctors = async () => {
        try {
            const response = await API.get(`/get-all-doctors-by-clinic_id?clinicId=${loggedInClinic?.clinicDetails?.id}`);
            if (response?.status == 200) {
                setAllDoctors(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getAgeList = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/reports/age-list`);
            if (response?.status == 200) {
                setAgeList(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getGenderList = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/reports/gender-list`);
            if (response?.status == 200) {
                setGenderList(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value)
    };

    const filteredData = searchTerm
        ? summaryTabPatientData?.data?.filter((item) =>
            item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.phone?.toLowerCase().includes(searchTerm.toLowerCase()))

        : summaryTabPatientData?.data;

    async function downloadAPI() {
        fetch(`${baseUrl}/reports/patient-clinic-download`, {
            method: 'GET',
            headers: {
                Authorization: Cookies.get('Authorization'),
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json()) // Convert response to JSON
            .then((data) => {
                const fileUrl = data?.data; // Extract file URL
                if (!fileUrl) {
                    throw new Error("File URL not found in response");
                }

                // Create download link
                const a = document.createElement('a');
                a.href = fileUrl;
                a.download = "patient-summary.csv"; // Ensure CSV format
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                toast.success("Download Successful!", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            })
            .catch((error) => {
                console.error("Download Error:", error);

                toast.error(error.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            });
    }


    return (
        <div className='summaryTabPatient'>
            <div className='bgMobile'>
                {isMobile && (<>
                    <div className="wrapePrint d-none" onClick={handleSummryFilterShow}>
                        <div className="printIcoBtn">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="#506DE2" />
                                <path d="M27 10H13C12.2044 10 11.4413 10.3161 10.8787 10.8787C10.3161 11.4413 10 12.2044 10 13V14.17C9.99986 14.5829 10.085 14.9915 10.25 15.37V15.43C10.3913 15.751 10.5914 16.0427 10.84 16.29L17 22.41V29C16.9997 29.1699 17.0426 29.3372 17.1249 29.4859C17.2071 29.6346 17.3259 29.7599 17.47 29.85C17.6291 29.9486 17.8128 30.0006 18 30C18.1565 29.9991 18.3107 29.9614 18.45 29.89L22.45 27.89C22.6149 27.8069 22.7536 27.6798 22.8507 27.5227C22.9478 27.3656 22.9994 27.1847 23 27V22.41L29.12 16.29C29.3686 16.0427 29.5687 15.751 29.71 15.43V15.37C29.8888 14.9944 29.9876 14.5858 30 14.17V13C30 12.2044 29.6839 11.4413 29.1213 10.8787C28.5587 10.3161 27.7956 10 27 10ZM21.29 21.29C21.1973 21.3834 21.124 21.4943 21.0742 21.6161C21.0245 21.7379 20.9992 21.8684 21 22V26.38L19 27.38V22C19.0008 21.8684 18.9755 21.7379 18.9258 21.6161C18.876 21.4943 18.8027 21.3834 18.71 21.29L13.41 16H26.59L21.29 21.29ZM28 14H12V13C12 12.7348 12.1054 12.4804 12.2929 12.2929C12.4804 12.1054 12.7348 12 13 12H27C27.2652 12 27.5196 12.1054 27.7071 12.2929C27.8946 12.4804 28 12.7348 28 13V14Z" fill="#DEE5FE" />
                            </svg>
                        </div>
                    </div>
                </>)}
                {!isMobile && <button className='downloadBttn' onClick={() => downloadAPI()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.5 13.3333L6.33334 9.16665L7.50001 7.95831L9.66668 10.125V3.33331H11.3333V10.125L13.5 7.95831L14.6667 9.16665L10.5 13.3333ZM5.50001 16.6666C5.04168 16.6666 4.64932 16.5035 4.32293 16.1771C3.99654 15.8507 3.83334 15.4583 3.83334 15V12.5H5.50001V15H15.5V12.5H17.1667V15C17.1667 15.4583 17.0035 15.8507 16.6771 16.1771C16.3507 16.5035 15.9583 16.6666 15.5 16.6666H5.50001Z" fill={themeColor} />
                    </svg> Download </button>}


                {isMobile ? (<>
                    <div className='mob row m-0'>
                        <Col lg={3} xs={8} className='ps-0 '>
                            <div className="search__bar">
                                <img src={Search} alt="" />
                                <input type="text" placeholder='Search by name, number'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col lg={2} xs={4} className='ps-0'>
                            <button className="btnDownMobile" onClick={() => downloadAPI()}>
                                <span className='downloadIcon'><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path d="M10.4997 13.3333L6.33301 9.16658L7.49967 7.95825L9.66634 10.1249V3.33325H11.333V10.1249L13.4997 7.95825L14.6663 9.16658L10.4997 13.3333ZM5.49967 16.6666C5.04134 16.6666 4.64898 16.5034 4.32259 16.177C3.9962 15.8506 3.83301 15.4583 3.83301 14.9999V12.4999H5.49967V14.9999H15.4997V12.4999H17.1663V14.9999C17.1663 15.4583 17.0031 15.8506 16.6768 16.177C16.3504 16.5034 15.958 16.6666 15.4997 16.6666H5.49967Z" fill="#0F75BC" />
                                </svg>  </span>
                                Download </button>
                        </Col>
                    </div>
                </>) : (<>
                    <div className="top-bar-filter">
                        <span> Filter by </span>
                        <div className="single_field customSelect">
                            <Form.Select onChange={handleDoctorChange} aria-label="Default select example" name='dataType'>
                                <option value={""}>Select Doctor</option>
                                {allDoctors.map((item) => {
                                    return (<>
                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                    </>)
                                })}
                            </Form.Select>
                        </div>
                        <div className="custom_date_report">
                            <DatePicker name='dob' onChange={handleDateChange} />
                        </div>
                        <div className="single_field customSelect">
                            <Form.Select
                                aria-label="Default select example"
                                name="dataType"
                                value={selectedAge}
                                onChange={(e) => setSelectedAge(e.target.value)}
                            >
                                {/* Static First Option */}
                                <option value={""}>Select Age</option>
                                {/* Dynamic Options from API */}
                                {ageList &&
                                    Object.entries(ageList).map(([key, value]) => (
                                        <option key={key} value={value}>
                                            {value}
                                        </option>
                                    ))
                                }
                            </Form.Select>
                        </div>
                        <div className="single_field customSelect">
                            <Form.Select
                                aria-label="Default select example"
                                name="dataType"
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                            >
                                {/* Static First Option */}
                                <option value={""}>Select Gender</option>
                                {/* Dynamic Options from API */}
                                {genderList &&
                                    Object.entries(genderList).map(([key, value]) => (
                                        <option key={key} value={value}>
                                            {value}
                                        </option>
                                    ))
                                }
                            </Form.Select>
                        </div>
                        {/* <div className="custom_date_reportYear">
                    <DatePicker onChange={onChange} picker="year" />
                </div> */}
                        <div className="custom_search_bar_report">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                <path d="M20.949 19L17.0886 15.1396M17.0886 15.1396C17.7489 14.4793 18.2727 13.6953 18.6301 12.8326C18.9875 11.9698 19.1714 11.0451 19.1714 10.1112C19.1714 9.17735 18.9875 8.25264 18.6301 7.38987C18.2727 6.5271 17.7489 5.74316 17.0886 5.08283C16.4282 4.42249 15.6443 3.89868 14.7815 3.54131C13.9188 3.18394 12.994 3 12.0602 3C11.1263 3 10.2016 3.18394 9.33884 3.54131C8.47607 3.89868 7.69214 4.42249 7.0318 5.08283C5.69819 6.41644 4.94897 8.2252 4.94897 10.1112C4.94897 11.9972 5.69819 13.806 7.0318 15.1396C8.36541 16.4732 10.1742 17.2224 12.0602 17.2224C13.9462 17.2224 15.755 16.4732 17.0886 15.1396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <input type="text" placeholder='Search by name, number'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </>)}

                <div className="cardsWraperSummary">
                    <div className='singleCardSummary'>
                        <h3> {patientsReport?.tiles?.[0]?.title}  </h3>
                        <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                            <h5> {patientsReport?.tiles?.[0]?.count} </h5>
                            <span className='icon'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                <path d="M11.9999 12.8701C10.8999 12.8701 9.95821 12.4785 9.17488 11.6951C8.39154 10.9118 7.99988 9.97012 7.99988 8.87012C7.99988 7.77012 8.39154 6.82845 9.17488 6.04512C9.95821 5.26178 10.8999 4.87012 11.9999 4.87012C13.0999 4.87012 14.0415 5.26178 14.8249 6.04512C15.6082 6.82845 15.9999 7.77012 15.9999 8.87012C15.9999 9.97012 15.6082 10.9118 14.8249 11.6951C14.0415 12.4785 13.0999 12.8701 11.9999 12.8701ZM3.99988 20.8701V18.0701C3.99988 17.5035 4.14571 16.9826 4.43738 16.5076C4.72904 16.0326 5.11654 15.6701 5.59988 15.4201C6.63321 14.9035 7.68321 14.516 8.74988 14.2576C9.81654 13.9993 10.8999 13.8701 11.9999 13.8701C13.0999 13.8701 14.1832 13.9993 15.2499 14.2576C16.3165 14.516 17.3665 14.9035 18.3999 15.4201C18.8832 15.6701 19.2707 16.0326 19.5624 16.5076C19.854 16.9826 19.9999 17.5035 19.9999 18.0701V20.8701H3.99988ZM5.99988 18.8701H17.9999V18.0701C17.9999 17.8868 17.954 17.7201 17.8624 17.5701C17.7707 17.4201 17.6499 17.3035 17.4999 17.2201C16.5999 16.7701 15.6915 16.4326 14.7749 16.2076C13.8582 15.9826 12.9332 15.8701 11.9999 15.8701C11.0665 15.8701 10.1415 15.9826 9.22488 16.2076C8.30821 16.4326 7.39988 16.7701 6.49988 17.2201C6.34988 17.3035 6.22904 17.4201 6.13738 17.5701C6.04571 17.7201 5.99988 17.8868 5.99988 18.0701V18.8701ZM11.9999 10.8701C12.5499 10.8701 13.0207 10.6743 13.4124 10.2826C13.804 9.89095 13.9999 9.42012 13.9999 8.87012C13.9999 8.32012 13.804 7.84928 13.4124 7.45762C13.0207 7.06595 12.5499 6.87012 11.9999 6.87012C11.4499 6.87012 10.979 7.06595 10.5874 7.45762C10.1957 7.84928 9.99988 8.32012 9.99988 8.87012C9.99988 9.42012 10.1957 9.89095 10.5874 10.2826C10.979 10.6743 11.4499 10.8701 11.9999 10.8701Z" fill="#0F75BC" />
                            </svg></span>
                        </div>
                    </div>
                    <div className="line-chart">
                        <div className="row align-items-center">
                            <div className="col-md-6 position-relative">
                                <label className="body-text semi-bold">Gender</label>
                                <div className="progress" style={{ width: "100%;" }}>
                                    <div className="progress-bar bg_blue" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[0]?.items?.[0]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[0]?.items?.[0]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[0]?.items?.[0]?.percentage} Male`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[0]?.items?.[0]?.percentage}% Male`}
                                    >
                                    </div>
                                    <div className="progress-bar bg_pink" role="progressbar "
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[0]?.items?.[1]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[0]?.items?.[1]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[0]?.items?.[0]?.percentage} Female`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[0]?.items?.[1]?.percentage}% Female`}>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <div className="circleWithLabelContainer">
                                    {patientsReport?.progress_bar?.[0]?.items?.map((label) => {
                                        return (
                                            <>
                                                <label
                                                    className="circleWithLabel dot_blue"
                                                    style={{ "--dot-color": label?.color }}
                                                >
                                                    {label?.title}
                                                </label>
                                            </>
                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 align-items-center">
                            <div className="col-md-6 position-relative">
                                <label className="body-text semi-bold">Age</label>
                                <div className="progress" style={{ width: "100%;" }}>
                                    <div className="progress-bar dot_red" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[1]?.items?.[0]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[1]?.items?.[0]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[1]?.items?.[0]?.percentage}`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[1]?.items?.[0]?.percentage}`}
                                    >
                                    </div>
                                    <div className="progress-bar dot_green" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[1]?.items?.[1]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[1]?.items?.[1]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[1]?.items?.[1]?.percentage}`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[1]?.items?.[1]?.percentage}`}
                                    >
                                    </div>
                                    <div className="progress-bar dot_yellow" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[1]?.items?.[2]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[1]?.items?.[2]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[1]?.items?.[2]?.percentage}`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[1]?.items?.[2]?.percentage}`}
                                    >
                                    </div>
                                    <div className="progress-bar dot_purple" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[1]?.items?.[4]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[1]?.items?.[4]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[1]?.items?.[4]?.percentage}`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[1]?.items?.[4]?.percentage}`}
                                    >
                                    </div>
                                    <div className="progress-bar dot_purple" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[1]?.items?.[5]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[1]?.items?.[5]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[1]?.items?.[5]?.percentage}`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[1]?.items?.[5]?.percentage}`}
                                    >
                                    </div>
                                    <div className="progress-bar dot_purple" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[1]?.items?.[6]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[1]?.items?.[6]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[1]?.items?.[6]?.percentage}`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[1]?.items?.[6]?.percentage}`}
                                    >
                                    </div>
                                    <div className="progress-bar dot_purple" role="progressbar"
                                        style={{
                                            width: `${patientsReport?.progress_bar?.[1]?.items?.[7]?.percentage}%`,
                                            backgroundColor: patientsReport?.progress_bar?.[1]?.items?.[7]?.color
                                        }}
                                        value={`${patientsReport?.progress_bar?.[1]?.items?.[7]?.percentage}`}
                                        data-tooltip={`${patientsReport?.progress_bar?.[1]?.items?.[7]?.percentage}`}
                                    >
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="circleWithLabelContainer">
                                    {Array.isArray(patientsReport?.progress_bar?.[1]?.items) ||
                                        Object.values(patientsReport?.progress_bar?.[1]?.items || {}).length > 0 ? (
                                        Object.values(patientsReport?.progress_bar?.[1]?.items || {}).map((item, index) => {
                                            return (
                                                <label
                                                    key={index}
                                                    className="circleWithLabel dot_red"
                                                    style={{ "--dot-color": item?.color }}
                                                >
                                                    {item?.title}
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <p></p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {isMobile ?
                    (<>

                    </>)
                    :
                    (<>
                        <div className="table__wrape">
                            <Table responsive className=''>
                                <thead>
                                    <tr>
                                        <th> User ID </th>
                                        <th>MR. No. </th>
                                        <th>Date</th>
                                        <th>Patient Name</th>
                                        <th>Doctor Name</th>
                                        <th>Age</th>
                                        <th>Gender </th>
                                        <th>Phone No.</th>
                                        <th>No. of Visists</th>
                                    </tr>
                                </thead>
                                {filteredData?.map((item) => {
                                    return (<>
                                        <tr>
                                            <td> {item?.id} </td>
                                            <td> {item?.mr_no} </td>
                                            <td>{item?.created_at}</td>
                                            <td> {item?.name} </td>
                                            <td>Dr. {item?.doctor_name} </td>
                                            <td>{item?.age ? `${item.age}Y` : ""} </td>
                                            <td> {item?.gender} </td>
                                            <td> {formatPhoneNumber(item?.phone)} </td>
                                            <td> {item?.total_visit} </td>
                                        </tr>
                                    </>)
                                })}
                                <tbody>
                                </tbody>
                            </Table>
                            <div className='pagination_hk'>
                                {totalPages > 1 ? (
                                    <>
                                        <div className='countPagination'>
                                            {paginateCountData?.from} - {paginateCountData?.to} of {paginateCountData?.total}
                                        </div>
                                        <ReactPaginate
                                            previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                                            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                                            breakLabel={null} // No break label
                                            pageCount={totalPages} // Total number of pages
                                            pageRangeDisplayed={0} // No page numbers displayed
                                            marginPagesDisplayed={0} // No margins around current page
                                            onPageChange={handlePageClick} // Handle page change
                                            containerClassName={"pagination_hk"} // Styling for the container
                                            previousClassName={"prev_item"} // Styling for the previous button
                                            nextClassName={"next_item"} // Styling for the next button
                                            previousLinkClassName={"previousLink"} // Styling for the previous link
                                            nextLinkClassName={"medical_next_link"} // Styling for the next link
                                            forcePage={currentPage - 1} // Force the current page
                                            renderOnZeroPageCount={null} // Hide pagination if there are no pages
                                        />
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </>)}

                <ToastContainer />

                <Modal handleDateChange={handleDateChange} show={summryfilterShow} onHide={handleSummryFilterClose} centered className="mobileFilterReportModal">
                    <Modal.Body>
                        <span className="crossBtnModal" onClick={handleSummryFilterClose}></span>
                        <h2> <span className="filterIcoo"></span> Filter </h2>
                        <div className="wraper_add_modal">
                            <div className="wrape_cl">




                                <Row>
                                    <Col xs={12}>
                                        <div className="single_field customSelect">
                                            <label htmlFor="openDate">Doctor</label>

                                            <Form.Select onChange={handleDoctorChange} aria-label="Default select example" name='dataType'>
                                                <option value={""}>Select Doctor</option>
                                                {allDoctors.map((item) => {
                                                    return (<>
                                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                    </>)
                                                })}
                                            </Form.Select>
                                        </div>

                                    </Col>
                                    <Col xs={12}>
                                        <div className="custom_date_report">
                                            <label htmlFor="openDate">Date</label>
                                            <DatePicker name='dob' onChange={handleDateChange} />
                                        </div>

                                    </Col>
                                    <Col xs={6}>
                                        <div className="single_field customSelect">
                                            <label htmlFor="openDate">Age</label>

                                            <Form.Select
                                                aria-label="Default select example"
                                                name="dataType"
                                                value={selectedAge}
                                                onChange={(e) => setSelectedAge(e.target.value)}
                                            >
                                                {/* Static First Option */}
                                                <option value={""}>Select Age</option>
                                                {/* Dynamic Options from API */}
                                                {ageList &&
                                                    Object.entries(ageList).map(([key, value]) => (
                                                        <option key={key} value={value}>
                                                            {value}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </div>

                                    </Col>
                                    <Col xs={6}>
                                        <div className="single_field customSelect">
                                            <label htmlFor="openDate">Gender</label>

                                            <Form.Select
                                                aria-label="Default select example"
                                                name="dataType"
                                                value={selectedGender}
                                                onChange={(e) => setSelectedGender(e.target.value)}
                                            >
                                                {/* Static First Option */}
                                                <option value={""}>Select Gender</option>
                                                {/* Dynamic Options from API */}
                                                {genderList &&
                                                    Object.entries(genderList).map(([key, value]) => (
                                                        <option key={key} value={value}>
                                                            {value}
                                                        </option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </div>
                                    </Col>

                                </Row>
                            </div>

                            <div className="wrape__radios">
                                <div className="single customRadioo">
                                    <div className="wrapeInp">
                                        <input type="radio" id="Clear All" value={"clearAll"} name="status" />
                                        <span></span>
                                    </div>
                                    <label htmlFor="Clear All" className='mb-0'> Clear All </label>
                                </div>
                            </div>
                            <button className='saveBtn'  > Apply Filter </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>

        </div>
    )
}

export default SummaryTabPatient;
