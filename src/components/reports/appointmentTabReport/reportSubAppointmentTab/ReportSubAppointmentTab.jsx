import { Form, Table, Modal, Row, Col, Accordion } from 'react-bootstrap';

import { DatePicker, Divider } from 'antd';

import './reportSubAppointmentTab.scss';
import { useEffect, useState } from 'react';
import API from '../../../../services/httpInstance';
import dayjs from 'dayjs';
import moment from "moment";
import { toast, ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import { useMediaQuery } from '@mui/material'
import Search from "../../../../assets/images/svg/search.svg"

const ReportSubAppointmentTab = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [statusData, setStatusData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState("")
    const [selectedDate, setSelectedDate] = useState('')
    const [allDoctors, setAllDoctors] = useState([]);
    const [selectedYear, setSelectedYear] = useState("")
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [allProcedures, setAllProcedures] = useState([]);
    const [selectedProcedure, setSelectedProcedure] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState("1");
    const [totalPages, setTotalPages] = useState(1);
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [genderList, setGenderList] = useState([]);
    const [statusDataList, setStatusDataList] = useState([])
    const isMobile = useMediaQuery('(max-width:767px)');
    const [summryfilterShow, setSummryFilterShow] = useState(false);

    const handleSummryFilterClose = () => setSummryFilterShow(false);
    const handleSummryFilterShow = () => setSummryFilterShow(true);

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

    const getStatusList = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/reports/status-list`);
            if (response?.status == 200) {
                setStatusDataList(response?.data?.data);
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
    };

    useEffect(() => {
        getReports();
        getDoctors();
        getProcedures();
        getGenderList();
        getStatusList();
    }, []);

    useEffect(() => {
        getStatus();
    }, [selectedDoctor, selectedGender, selectedDate, selectedYear, selectedStatus, selectedProcedure]);

    const getDoctors = async () => {
        try {
            const response = await API.get(`/get-all-doctors-by-clinic`);
            if (response?.status == 200) {
                setAllDoctors(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getReports = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/reports/clinic-list`);
            if (response?.status == 200) {
                setReportData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getStatus();
    }, [currentPage]);

    const getStatus = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) queryParams.append("year", selectedYear);
            if (selectedGender) queryParams.append("gender", selectedGender);
            if (selectedStatus) queryParams.append("appointment_status", selectedStatus);
            if (selectedProcedure) queryParams.append("procedure", selectedProcedure);
            if (selectedDoctor) queryParams.append("doctor_id", selectedDoctor);

            const url = queryParams.toString()
                ? `/reports/appointment-all?page=${currentPage}&${queryParams.toString()}`
                : `/reports/appointment-all?page=${currentPage}`;

            const response = await API.get(url);
            if (response?.status == 200) {
                console.log(response)
                const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setStatusData(response?.data?.data)
                setCurrentPage(response?.data?.data?.pagination?.current_page)
                setPaginateCountData(response?.data?.data?.pagination)
                setIsLoading(false);
            } else {
                setStatusData([])
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        setSelectedStatus(e.target.value);
        setCurrentPage(1);
    }

    const handleYearChange = (date, dateString) => {
        setSelectedYear(dateString)
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value)
        setCurrentPage(1);
    };

    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value)
        setCurrentPage(1);
    }

    const getProcedures = async () => {
        try {
            const response = await API.get(`/get-procedures`);
            if (response?.status == 200) {
                setAllProcedures(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleProcedureChange = (e) => {
        setSelectedProcedure(e.target.value)
        setCurrentPage(1);
    };

    const filteredData = searchTerm
        ? statusData?.data?.filter((item) =>
            item?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.number?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : statusData?.data;


    async function downloadAPI() {
        fetch(`${baseUrl}/reports/appointment-download`, {
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
                a.download = "appointments.csv"; // Ensure CSV format
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

    const handleApplyFilter = () => {
        getStatus()
        handleSummryFilterClose(false)
    }

    return (
        <div className='reportSubAppointmentTab'>
            <div className='bgMobile'>
                {!isMobile && (<>
                    <button className='downloadBttn' onClick={() => downloadAPI()}> <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.5 13.3333L6.33331 9.16658L7.49998 7.95825L9.66665 10.1249V3.33325H11.3333V10.1249L13.5 7.95825L14.6666 9.16658L10.5 13.3333ZM5.49998 16.6666C5.04165 16.6666 4.64929 16.5034 4.3229 16.177C3.99651 15.8506 3.83331 15.4583 3.83331 14.9999V12.4999H5.49998V14.9999H15.5V12.4999H17.1666V14.9999C17.1666 15.4583 17.0035 15.8506 16.6771 16.177C16.3507 16.5034 15.9583 16.6666 15.5 16.6666H5.49998Z" fill={themeColor} />
                    </svg>
                        Download
                    </button>
                </>)}



                {isMobile && (<>
                    <div className="wrapePrint" onClick={handleSummryFilterShow}>
                        <div className="printIcoBtn">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="20" fill="#506DE2" />
                                <path d="M27 10H13C12.2044 10 11.4413 10.3161 10.8787 10.8787C10.3161 11.4413 10 12.2044 10 13V14.17C9.99986 14.5829 10.085 14.9915 10.25 15.37V15.43C10.3913 15.751 10.5914 16.0427 10.84 16.29L17 22.41V29C16.9997 29.1699 17.0426 29.3372 17.1249 29.4859C17.2071 29.6346 17.3259 29.7599 17.47 29.85C17.6291 29.9486 17.8128 30.0006 18 30C18.1565 29.9991 18.3107 29.9614 18.45 29.89L22.45 27.89C22.6149 27.8069 22.7536 27.6798 22.8507 27.5227C22.9478 27.3656 22.9994 27.1847 23 27V22.41L29.12 16.29C29.3686 16.0427 29.5687 15.751 29.71 15.43V15.37C29.8888 14.9944 29.9876 14.5858 30 14.17V13C30 12.2044 29.6839 11.4413 29.1213 10.8787C28.5587 10.3161 27.7956 10 27 10ZM21.29 21.29C21.1973 21.3834 21.124 21.4943 21.0742 21.6161C21.0245 21.7379 20.9992 21.8684 21 22V26.38L19 27.38V22C19.0008 21.8684 18.9755 21.7379 18.9258 21.6161C18.876 21.4943 18.8027 21.3834 18.71 21.29L13.41 16H26.59L21.29 21.29ZM28 14H12V13C12 12.7348 12.1054 12.4804 12.2929 12.2929C12.4804 12.1054 12.7348 12 13 12H27C27.2652 12 27.5196 12.1054 27.7071 12.2929C27.8946 12.4804 28 12.7348 28 13V14Z" fill="#DEE5FE" />
                            </svg>
                        </div>
                    </div>
                </>)}

                {isMobile ?
                    (<>
                        <div className='mob row m-0'>
                            <Col lg={3} xs={8} className='ps-0 '>
                                <div className="search__bar  ">
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
                    </>)
                    :
                    (<>
                        <div className="top-bar-filter">

                            <span> Filter by </span>
                            <div className="custom_date_report">
                                <DatePicker name='dob' onChange={handleDateChange} />
                            </div>
                            <div className="single_field customSelect">
                                <Form.Select aria-label="Default select example" name='appointment_status' value={selectedStatus} onChange={handleChange}>
                                    <option value="" disabled>Select Status</option>
                                    <option value="refunded">Refunded</option>
                                    <option value="booked">Booked</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="complete">Complete</option>
                                    <option value="missed">Missed</option>
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
                                    <option value={""} disabled selected>Select Gender</option>
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
                            <div className="single_field customSelect">
                                <Form.Select onChange={handleDoctorChange} aria-label="Default select example" name='dataType'>
                                    <option value={""} disabled selected>Select Doctor</option>
                                    {allDoctors.map((item) => {
                                        return (<>
                                            <option key={item?.id} value={item?.id}>{item?.name}</option>
                                        </>)
                                    })}
                                </Form.Select>
                            </div>
                            <div className="single_field customSelect">
                                <Form.Select onChange={handleProcedureChange} defaultValue="">
                                    <option value="" disabled>Select procedure</option>
                                    {allProcedures.map((item) => (
                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                    ))}
                                </Form.Select>
                            </div>

                            <div className="custom_search_bar_report">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                    <path d="M20.9489 19.5L17.0885 15.6396M17.0885 15.6396C17.7489 14.9793 18.2727 14.1953 18.6301 13.3326C18.9874 12.4698 19.1714 11.5451 19.1714 10.6112C19.1714 9.67735 18.9874 8.75264 18.6301 7.88987C18.2727 7.0271 17.7489 6.24316 17.0885 5.58283C16.4282 4.92249 15.6443 4.39868 14.7815 4.04131C13.9187 3.68394 12.994 3.5 12.0602 3.5C11.1263 3.5 10.2016 3.68394 9.33881 4.04131C8.47604 4.39868 7.69211 4.92249 7.03177 5.58283C5.69816 6.91644 4.94894 8.7252 4.94894 10.6112C4.94894 12.4972 5.69816 14.306 7.03177 15.6396C8.36538 16.9732 10.1741 17.7224 12.0602 17.7224C13.9462 17.7224 15.7549 16.9732 17.0885 15.6396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <input type="text" placeholder='Search by name'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </>)
                }
                {isMobile ?
                    <> <Accordion defaultActiveKey="0" className='reportAccordianMobile'>
                        {filteredData?.map((item, idx) => {
                            return (<>
                                <Accordion.Item eventKey={idx}>
                                    <Accordion.Header>

                                        <div className='accordHeader tw-w-full tw-flex tw-items-center tw-justify-between'>
                                            <div className='tw-flex tw-w-full  tw-flex-col tw-justify-center'>
                                                <div className=' tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-1'>
                                                    <h5>  Dr.{item?.doctor_name}</h5>
                                                    <span className="priceTag"> ID {item?.id}</span>
                                                </div>
                                                <h6>  {item?.patient_name} {item?.age}   |  {item?.gender} </h6>
                                                <div className='d-flex justify-content-between mt-2'><h6> Visit No  {item?.visit}  </h6> <h6> {item?.date} </h6></div>

                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul className="servicesTotal">
                                            <li className='appointmetList'>
                                                <h5 className='keyTitle'> Reason to Visit </h5>
                                                <span className="keyBody"> {item?.reason_for_visit}   </span>
                                            </li>

                                            <li className='appointmetList'>
                                                <h5 className='keyTitle'> Status </h5>
                                                <span className="keyBody"> {item?.status} </span>
                                            </li>
                                            <li className='appointmetList'>
                                                <h5 className='keyTitle'> Procedure </h5>
                                                <span className="keyBody"> {item?.procedure_name} </span>
                                            </li>
                                            <li>
                                                <h5 className='keyTitle'> Total Amount </h5>
                                                <span className="keyBody"> {item?.total_amount} </span>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </>)
                        })}
                    </Accordion>
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
                        {!filteredData?.length > 0 && (
                            <div className='d-flex align-items-center justify-content-center w-100'>
                                No records found
                            </div>
                        )}
                    </>
                    :
                    <div className="table__wrape">
                        <Table responsive className=''>
                            <thead>
                                <tr>
                                    <th> MR. No. </th>
                                    <th>Date </th>
                                    <th>Patient Name</th>
                                    <th>Age</th>
                                    <th>Gender</th>
                                    <th>Visit No.</th>
                                    <th>Status </th>
                                    <th>Doctor</th>
                                    <th>Appointment Fee</th>
                                    <th>Procedure</th>
                                </tr>
                            </thead>
                            {filteredData?.map((item) => {
                                return (<>
                                    <tr>
                                        <td>{item?.mr_no}</td>
                                        <td> {item?.date} </td>
                                        <td> {item?.patient_name} </td>
                                        <td> {item?.age} </td>
                                        <td> {item?.gender} </td>
                                        <td> {item?.visit} </td>
                                        <td> {item?.status} </td>
                                        <td> {item?.doctor_name} </td>
                                        <td>Rs. {item?.total_amount} </td>
                                        <td>{item?.procedure_name}  </td>
                                    </tr>
                                </>)
                            })}
                            <tbody>
                            </tbody>
                        </Table>
                        {!filteredData?.length > 0 && (
                            <div className='d-flex align-items-center justify-content-center w-100'>
                                No records found
                            </div>
                        )}
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
                }



                <ToastContainer />

                <Modal handleDateChange={handleDateChange} show={summryfilterShow} onHide={handleSummryFilterClose} centered className="mobileFilterReportModal">
                    <Modal.Body>
                        <span className="crossBtnModal" onClick={handleSummryFilterClose}></span>
                        <h2> <span className="filterIcoo"></span> Filter </h2>
                        <div className="wraper_add_modal">
                            <div className="wrape_cl">


                                <Row>
                                    <Col xs={12}>


                                        <div className="custom_date_report">
                                            <label htmlFor="openDate">Date</label>
                                            <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true} />
                                        </div>
                                    </Col>
                                    <Col xs={6}>

                                        <div className="single_field customSelect">
                                            <label htmlFor="openDate">Status</label>
                                            <Form.Select aria-label="Default select example" name='appointment_status' value={selectedStatus} onChange={handleChange}>
                                                <option value="" disabled>Select Status</option>
                                                <option value="refunded">Refunded</option>
                                                <option value="booked">Booked</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="complete">Complete</option>
                                                <option value="missed">Missed</option>
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
                                                onChange={handleGenderChange}
                                            >
                                                {/* Static First Option */}
                                                <option value={""} disabled selected>Select Gender</option>
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

                                    <Col xs={12}>

                                        <div className="single_field customSelect">
                                            <label htmlFor="openDate">Doctor</label>
                                            <Form.Select onChange={handleDoctorChange} aria-label="Default select example" name='dataType'>
                                                <option value={""} disabled selected>Select Doctor</option>
                                                {allDoctors.map((item) => {
                                                    return (<>
                                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                    </>)
                                                })}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col xs={12}>

                                        <div className="single_field customSelect">
                                            <label htmlFor="openDate">Procedure</label>
                                            <Form.Select onChange={handleProcedureChange} defaultValue="">
                                                <option value="" disabled>Select procedure</option>
                                                {allProcedures.map((item) => (
                                                    <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                ))}
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
                            <button className='saveBtn' onClick={handleApplyFilter}> Apply Filter </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}

export default ReportSubAppointmentTab;
