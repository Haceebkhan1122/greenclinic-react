import { Form, Table, Col, Row, Modal } from 'react-bootstrap';
import { DatePicker } from 'antd';
import './reportSubClinicTabPatient.scss';
import { useEffect, useState } from 'react';
import API from '../../../../services/httpInstance/index';
import dayjs from 'dayjs';
import moment from "moment";
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material'

import Search from "../../../../assets/images/svg/search.svg"

const ReportSubClinicTabPatient = () => {
    const isMobile = useMediaQuery('(max-width:767px)');
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
    const [reportfilterShow, setReportfilterShow] = useState(false);
    const [clinicDoctors, setClinicDoctors] = useState([])

  let clinicDetails = useSelector((state) => state.clinic.clinicDetails);


    useEffect(() => {
        getDoctorsByClinic();
    }, [])

    const getDoctorsByClinic = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-all-doctors-by-clinic_id?clinicId=${clinicDetails?.id}`)
            if (response?.status == 200) {
                setClinicDoctors(response?.data?.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log("errr", error)
            setIsLoading(false);
        }
    }


    const handlereportfilterClose = () => setReportfilterShow(false);
    const handlereportfilterShow = () => setReportfilterShow(true);
    const formatPhoneNumber = (phone) => {
        if (!phone) return ""; // Handle empty or undefined phone numbers
        const cleaned = phone.replace(/\D/g, ""); // Remove non-numeric characters
        return cleaned.replace(/(\d{4})(\d+)/, "$1-$2"); // Add hyphen after the first 4 digits
    };

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
                setCurrentPage(response?.data?.data?.pagination?.current_page)
                setsummaryTabPatientData(response?.data?.data);
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
            const response = await API.get(`/get-all-doctors`);
            if (response?.status == 200) {
                setAllDoctors(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const ageRanges = [
        { value: "", label: "Select Age", disabled: true },
        { value: "10-30", label: "10-30" },
        { value: "30-60", label: "30-60" },
        { value: "60-90", label: "60-90" },
        { value: "90+", label: "90+" }
    ];

    const genderOptions = [
        { value: "", label: "Select Gender", disabled: true },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" }
    ];

    const handleAgeChange = (e) => {
        setSelectedAge(e.target.value);
        setCurrentPage(1);
    };
    
    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
        setCurrentPage(1);
    };
    
    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = searchTerm
        ? summaryTabPatientData?.data?.filter((item) =>
            item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.phone?.toLowerCase().includes(searchTerm.toLowerCase()))

        : summaryTabPatientData?.data;

    return (
        <div className='reportSubClinicTabPatient'>
            <div className='bgMobile'>
                {isMobile && (<>
                    <div className="wrapePrint " onClick={handlereportfilterShow}>
                        <div className="printIcoBtn">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="#506DE2" />
                                <path d="M27 10H13C12.2044 10 11.4413 10.3161 10.8787 10.8787C10.3161 11.4413 10 12.2044 10 13V14.17C9.99986 14.5829 10.085 14.9915 10.25 15.37V15.43C10.3913 15.751 10.5914 16.0427 10.84 16.29L17 22.41V29C16.9997 29.1699 17.0426 29.3372 17.1249 29.4859C17.2071 29.6346 17.3259 29.7599 17.47 29.85C17.6291 29.9486 17.8128 30.0006 18 30C18.1565 29.9991 18.3107 29.9614 18.45 29.89L22.45 27.89C22.6149 27.8069 22.7536 27.6798 22.8507 27.5227C22.9478 27.3656 22.9994 27.1847 23 27V22.41L29.12 16.29C29.3686 16.0427 29.5687 15.751 29.71 15.43V15.37C29.8888 14.9944 29.9876 14.5858 30 14.17V13C30 12.2044 29.6839 11.4413 29.1213 10.8787C28.5587 10.3161 27.7956 10 27 10ZM21.29 21.29C21.1973 21.3834 21.124 21.4943 21.0742 21.6161C21.0245 21.7379 20.9992 21.8684 21 22V26.38L19 27.38V22C19.0008 21.8684 18.9755 21.7379 18.9258 21.6161C18.876 21.4943 18.8027 21.3834 18.71 21.29L13.41 16H26.59L21.29 21.29ZM28 14H12V13C12 12.7348 12.1054 12.4804 12.2929 12.2929C12.4804 12.1054 12.7348 12 13 12H27C27.2652 12 27.5196 12.1054 27.7071 12.2929C27.8946 12.4804 28 12.7348 28 13V14Z" fill="#DEE5FE" />
                            </svg>
                        </div>
                    </div>
                </>)}
                {!isMobile && <button className='downloadBttn'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.5 13.3333L6.33334 9.16665L7.50001 7.95831L9.66668 10.125V3.33331H11.3333V10.125L13.5 7.95831L14.6667 9.16665L10.5 13.3333ZM5.50001 16.6666C5.04168 16.6666 4.64932 16.5035 4.32293 16.1771C3.99654 15.8507 3.83334 15.4583 3.83334 15V12.5H5.50001V15H15.5V12.5H17.1667V15C17.1667 15.4583 17.0035 15.8507 16.6771 16.1771C16.3507 16.5035 15.9583 16.6666 15.5 16.6666H5.50001Z" fill={themeColor} />
                    </svg>
                    Download
                </button>
                }



                {isMobile ?
                    (<>
                        <div className='mob row'>
                            <Col lg={3} xs={8} className='pe-0'>
                                <div className="search__bar">
                                    <img src={Search} alt="" />
                                    <input type="text" placeholder='Search by name, number'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                            </Col>
                            <Col lg={2} xs={4}>
                                <button className="btnDownMobile"  >
                                    <span className='downloadIcon'>  </span>
                                    Download </button>
                            </Col>
                        </div>
                    </>)
                    :
                    (<>
                        <div className="top-bar-filter">
                            <span> Filter by </span>
                            <div className="single_field customSelect">
                                <Form.Select onChange={handleDoctorChange} aria-label="Default select example" name='dataType'>
                                    <option value={""}>Select Doctor</option>
                                    {clinicDoctors?.map((item) => {
                                        return (<>
                                            <option value={item?.id}>{item?.name}</option>
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
                                    onChange={handleAgeChange}
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
                                    onChange={handleGenderChange}
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
                            <div className="custom_search_bar_report  ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M20.9489 19.5L17.0885 15.6396M17.0885 15.6396C17.7489 14.9793 18.2727 14.1953 18.6301 13.3326C18.9874 12.4698 19.1714 11.5451 19.1714 10.6112C19.1714 9.67735 18.9874 8.75264 18.6301 7.88987C18.2727 7.0271 17.7489 6.24316 17.0885 5.58283C16.4282 4.92249 15.6443 4.39868 14.7815 4.04131C13.9187 3.68394 12.994 3.5 12.0602 3.5C11.1263 3.5 10.2016 3.68394 9.33881 4.04131C8.47604 4.39868 7.69211 4.92249 7.03177 5.58283C5.69816 6.91644 4.94894 8.7252 4.94894 10.6112C4.94894 12.4972 5.69816 14.306 7.03177 15.6396C8.36538 16.9732 10.1741 17.7224 12.0602 17.7224C13.9462 17.7224 15.7549 16.9732 17.0885 15.6396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <input type="text" placeholder='Search by name, number'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                        </div>
                    </>)

                }
                <div className="cardsWraperSummary">
                    {patientsReport?.tiles?.map((item, index) => {
                        return (<>
                            <div className='singleCardSummary'>
                                <h3> {item.title} </h3>
                                <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                    <h5> {item.count} </h5>
                                    {index == 0 && (
                                        <span className='icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                                <path d="M22.7931 7.87012V9.87012H23.7997V13.8701C23.7997 14.6658 23.4815 15.4288 22.9152 15.9914C22.3489 16.554 21.5809 16.8701 20.78 16.8701C19.9792 16.8701 19.2111 16.554 18.6448 15.9914C18.0785 15.4288 17.7604 14.6658 17.7604 13.8701V9.87012H18.7669V7.87012H15.7473V13.8701C15.7488 15.0222 16.1502 16.1385 16.8836 17.0308C17.617 17.9232 18.6376 18.5371 19.7735 18.769V19.8701C19.7735 20.931 19.3493 21.9484 18.5942 22.6985C17.8392 23.4487 16.8151 23.8701 15.7473 23.8701C14.6794 23.8701 13.6554 23.4487 12.9003 22.6985C12.1452 21.9484 11.721 20.931 11.721 19.8701V17.6858C12.3926 17.4499 12.9587 16.9857 13.3191 16.3753C13.6795 15.7649 13.8111 15.0476 13.6907 14.3501C13.5702 13.6526 13.2054 13.0199 12.6608 12.5637C12.1162 12.1076 11.4268 11.8574 10.7145 11.8574C10.0022 11.8574 9.31277 12.1076 8.76816 12.5637C8.22354 13.0199 7.85877 13.6526 7.73832 14.3501C7.61786 15.0476 7.74948 15.7649 8.1099 16.3753C8.47033 16.9857 9.03635 17.4499 9.70794 17.6858V19.8701C9.70794 21.4614 10.3442 22.9875 11.4768 24.1128C12.6094 25.238 14.1455 25.8701 15.7473 25.8701C17.349 25.8701 18.8851 25.238 20.0177 24.1128C21.1503 22.9875 21.7866 21.4614 21.7866 19.8701V18.769C22.9224 18.5371 23.9431 17.9232 24.6765 17.0308C25.4099 16.1385 25.8112 15.0222 25.8128 13.8701V7.87012H22.7931ZM10.7145 13.8701C10.9136 13.8701 11.1082 13.9288 11.2737 14.0386C11.4392 14.1485 11.5682 14.3047 11.6444 14.4874C11.7206 14.6702 11.7405 14.8712 11.7017 15.0652C11.6629 15.2592 11.567 15.4374 11.4262 15.5772C11.2855 15.7171 11.1061 15.8123 10.9109 15.8509C10.7156 15.8895 10.5132 15.8697 10.3293 15.794C10.1454 15.7183 9.98817 15.5901 9.87757 15.4257C9.76697 15.2612 9.70794 15.0679 9.70794 14.8701C9.70818 14.605 9.8143 14.3508 10.003 14.1633C10.1917 13.9758 10.4476 13.8704 10.7145 13.8701Z" fill="#0F75BC" />
                                            </svg>
                                        </span>
                                    )}
                                    {index == 1 && (
                                        <span className='icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M11.9999 12.8701C10.8999 12.8701 9.95821 12.4785 9.17488 11.6951C8.39154 10.9118 7.99988 9.97012 7.99988 8.87012C7.99988 7.77012 8.39154 6.82845 9.17488 6.04512C9.95821 5.26178 10.8999 4.87012 11.9999 4.87012C13.0999 4.87012 14.0415 5.26178 14.8249 6.04512C15.6082 6.82845 15.9999 7.77012 15.9999 8.87012C15.9999 9.97012 15.6082 10.9118 14.8249 11.6951C14.0415 12.4785 13.0999 12.8701 11.9999 12.8701ZM3.99988 20.8701V18.0701C3.99988 17.5035 4.14571 16.9826 4.43738 16.5076C4.72904 16.0326 5.11654 15.6701 5.59988 15.4201C6.63321 14.9035 7.68321 14.516 8.74988 14.2576C9.81654 13.9993 10.8999 13.8701 11.9999 13.8701C13.0999 13.8701 14.1832 13.9993 15.2499 14.2576C16.3165 14.516 17.3665 14.9035 18.3999 15.4201C18.8832 15.6701 19.2707 16.0326 19.5624 16.5076C19.854 16.9826 19.9999 17.5035 19.9999 18.0701V20.8701H3.99988ZM5.99988 18.8701H17.9999V18.0701C17.9999 17.8868 17.954 17.7201 17.8624 17.5701C17.7707 17.4201 17.6499 17.3035 17.4999 17.2201C16.5999 16.7701 15.6915 16.4326 14.7749 16.2076C13.8582 15.9826 12.9332 15.8701 11.9999 15.8701C11.0665 15.8701 10.1415 15.9826 9.22488 16.2076C8.30821 16.4326 7.39988 16.7701 6.49988 17.2201C6.34988 17.3035 6.22904 17.4201 6.13738 17.5701C6.04571 17.7201 5.99988 17.8868 5.99988 18.0701V18.8701ZM11.9999 10.8701C12.5499 10.8701 13.0207 10.6743 13.4124 10.2826C13.804 9.89095 13.9999 9.42012 13.9999 8.87012C13.9999 8.32012 13.804 7.84928 13.4124 7.45762C13.0207 7.06595 12.5499 6.87012 11.9999 6.87012C11.4499 6.87012 10.979 7.06595 10.5874 7.45762C10.1957 7.84928 9.99988 8.32012 9.99988 8.87012C9.99988 9.42012 10.1957 9.89095 10.5874 10.2826C10.979 10.6743 11.4499 10.8701 11.9999 10.8701Z" fill="#0F75BC" />
                                            </svg>
                                        </span>
                                    )}
                                    {index == 2 && (
                                        <span className='icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                                <path d="M15.8152 18.2201L20.7652 13.2701L19.3402 11.8451L15.8152 15.3701L14.4152 13.9701L12.9902 15.3951L15.8152 18.2201ZM16.8652 24.2201C18.8986 22.3535 20.4069 20.6576 21.3902 19.1326C22.3736 17.6076 22.8652 16.2535 22.8652 15.0701C22.8652 13.2535 22.2861 11.766 21.1277 10.6076C19.9694 9.44928 18.5486 8.87012 16.8652 8.87012C15.1819 8.87012 13.7611 9.44928 12.6027 10.6076C11.4444 11.766 10.8652 13.2535 10.8652 15.0701C10.8652 16.2535 11.3569 17.6076 12.3402 19.1326C13.3236 20.6576 14.8319 22.3535 16.8652 24.2201ZM16.8652 26.8701C14.1819 24.5868 12.1777 22.466 10.8527 20.5076C9.52773 18.5493 8.86523 16.7368 8.86523 15.0701C8.86523 12.5701 9.6694 10.5785 11.2777 9.09512C12.8861 7.61178 14.7486 6.87012 16.8652 6.87012C18.9819 6.87012 20.8444 7.61178 22.4527 9.09512C24.0611 10.5785 24.8652 12.5701 24.8652 15.0701C24.8652 16.7368 24.2027 18.5493 22.8777 20.5076C21.5527 22.466 19.5486 24.5868 16.8652 26.8701Z" fill="#0F75BC" />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>)
                    })}
                </div>


                {isMobile ?
                    (<>
                        <div className='boxMobileScroll'>
                            {filteredData?.map((item) => {
                                return (<>


                                    <div className='boxMobilePat'>
                                        <div className='headBox'>
                                            <div className='box1'>
                                                <h5> Dr. {item?.doctor_name}</h5>
                                                <h5> {item?.name}</h5>
                                            </div>
                                            <div className='box2'>
                                                <p>{item?.mr_no} </p>
                                                <h5>{item?.total_visit} Visit (s)</h5>

                                            </div>

                                        </div>
                                        <div className='bodyBox'>
                                            <div>
                                                <h5>{formatPhoneNumber(item?.phone)} </h5>

                                            </div>
                                            <div>
                                                <h5>{item?.created_at}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                            })}
                        </div>
                    </>)
                    :
                    (<>
                        <div className="table__wrape">
                            <Table responsive className=''>
                                <thead>
                                    <tr>
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
                                            <td> {item?.mr_no} </td>
                                            <td> {item?.created_at} </td>
                                            <td> {item?.name} </td>
                                            <td>Dr. {item?.doctor_name} </td>
                                            <td> {item?.age ? `${item.age}Y` : ""} </td>
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
                    </>)
                }
            </div>


            <Modal handleDateChange={handleDateChange} show={reportfilterShow} onHide={handlereportfilterClose} centered className="mobileFilterReportModal">
                <Modal.Body>
                    <span className="crossBtnModal" onClick={handlereportfilterClose}></span>
                    <h2> <span className="filterIcoo"></span> Filter </h2>
                    <div className="wraper_add_modal">
                        <div className="wrape_cl">

                            <Row>
                                <Col xs={12}>
                                    <div className="single_field customSelect">
                                        <label htmlFor="openDate">Doctor</label>

                                        <Form.Select onChange={handleDoctorChange} aria-label="Default select example" name='dataType'>
                                            <option value={""}>Select Doctor</option>
                                            {clinicDoctors?.map((item) => {
                                                return (<>
                                                    <option value={item?.id}>{item?.name}</option>
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
    )
}

export default ReportSubClinicTabPatient;
