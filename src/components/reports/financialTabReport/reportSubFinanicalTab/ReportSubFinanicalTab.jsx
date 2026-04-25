import { Form, Table, Col, Row, Accordion, Modal } from 'react-bootstrap';
import { DatePicker } from 'antd';
import { Button } from 'primereact/button';
import './reportSubFinanicalTab.scss';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import moment from "moment";
import API from '../../../../services/httpInstance/index';
import { toast, ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useMediaQuery } from '@mui/material'
import Search from "../../../../assets/images/svg/search.svg"


const ReportSubFinancialTab = () => {
    const isMobile = useMediaQuery('(max-width:767px)');

    const baseUrl = import.meta.env.VITE_BASE_URL;
    let loggedInClinic = useSelector((state) => state.clinic);
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [isLoading, setIsLoading] = useState(false);
    const [allDoctors, setAllDoctors] = useState([]);
    const [allProcedures, setAllProcedures] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedProcedure, setSelectedProcedure] = useState("");
    const [summaryData, setSummaryData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState("1");
    const [totalPages, setTotalPages] = useState(1);
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [summryfilterShow, setSummryFilterShow] = useState(false);
    const [tempDate, setTempDate] = useState(null);
    const [clearAll, setClearAll] = useState(false);

    const handleSummryFilterClose = () => setSummryFilterShow(false);
    const handleSummryFilterShow = () => setSummryFilterShow(true);
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);
    };

    const onChange = (date, dateString) => {
        setSelectedYear(dateString)
    };

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

    useEffect(() => {
        getDoctors();
        getProcedures();
    }, [])

    const handleDateChange = (date) => {
        if (!date) return; // Prevent errors if date is null
        let formatDate = dayjs(date).format("YYYY/MM/DD");
        setSelectedDate(formatDate);
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value)
    };

    const handleProcedureChange = (e) => {
        setSelectedProcedure(e.target.value)
    };


    useEffect(() => {
        getFinancialsList();
    }, [currentPage]);

    const getFinancialsList = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) queryParams.append("year", selectedYear);
            if (selectedDoctor) queryParams.append("doctor_id", selectedDoctor);
            if (selectedProcedure) queryParams.append("procedure", selectedProcedure);

            const url = queryParams.toString()
                ? `/reports/financials-list?page=${currentPage}&${queryParams.toString()}`
                : `/reports/financials-list?page=${currentPage}`;

            const response = await API.get(url);
            if (response?.status == 200) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setCurrentPage(response?.data?.data?.pagination?.current_page)
                setPaginateCountData(response?.data?.data?.pagination)
                setSummaryData(response?.data?.data);
                setIsLoading(false);
            } else {
                setSummaryData([]);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getFinancialsList();
    }, [selectedDate, selectedYear, selectedDoctor, selectedProcedure]);

    const filteredData = searchTerm
        ? summaryData?.data?.filter((item) =>
            item?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.patients_no?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : summaryData?.data;


    async function downloadAPI() {
        fetch(`${baseUrl}/reports/financials-download`, {
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
                a.download = "financials-reports.csv"; // Ensure CSV format
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

    const handleApplyFilters = () => {
        if (clearAll) {
            // Clear all filters
            setSelectedDate("");
            setSelectedDoctor("");
            setSelectedProcedure("");
            setTempDate(null);
            setClearAll(false);
        } else {
            // Apply filters if not cleared
            if (tempDate) {
                const formatted = dayjs(tempDate).format("YYYY/MM/DD");
                setSelectedDate(formatted);
            }
        }
    
        handleSummryFilterClose(); // Close the modal
    };

    useEffect(() => {
        if (summryfilterShow) {
            setTempDate(selectedDate ? dayjs(selectedDate, "YYYY/MM/DD") : null);
            setClearAll(false);
        }
    }, [summryfilterShow]);

    return (
        <div className='reportSubFinancialTab'>
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
            <div className='bgMobile'>
                {!isMobile && <> <button className='downloadBttn' onClick={() => downloadAPI()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.5 13.3333L6.33334 9.16665L7.50001 7.95831L9.66668 10.125V3.33331H11.3333V10.125L13.5 7.95831L14.6667 9.16665L10.5 13.3333ZM5.50001 16.6666C5.04168 16.6666 4.64932 16.5035 4.32293 16.1771C3.99654 15.8507 3.83334 15.4583 3.83334 15V12.5H5.50001V15H15.5V12.5H17.1667V15C17.1667 15.4583 17.0035 15.8507 16.6771 16.1771C16.3507 16.5035 15.9583 16.6666 15.5 16.6666H5.50001Z" fill={themeColor} />
                    </svg>
                    Download </button>
                    <div className="top-bar-filter">
                        <span> Filter by </span>
                        <div className="single_field customSelect">
                            <Form.Select onChange={handleDoctorChange} >
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
                        {/* <div className="custom_date_reportYear">
                    <DatePicker onChange={onChange} picker="year" />
                </div> */}

                        <div className="single_field customSelect">
                            <Form.Select onChange={handleProcedureChange} >
                                <option selected disabled> Select Procedure</option>
                                {allProcedures.map((item) => {
                                    return (<>
                                        <option key={item?.id} value={item?.id}>{item?.name}</option>
                                    </>)
                                })}
                            </Form.Select>
                        </div>
                        <div className="custom_search_bar_report">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path d="M20.9489 19.5L17.0885 15.6396M17.0885 15.6396C17.7489 14.9793 18.2727 14.1953 18.6301 13.3326C18.9874 12.4698 19.1714 11.5451 19.1714 10.6112C19.1714 9.67735 18.9874 8.75264 18.6301 7.88987C18.2727 7.0271 17.7489 6.24316 17.0885 5.58283C16.4282 4.92249 15.6443 4.39868 14.7815 4.04131C13.9187 3.68394 12.994 3.5 12.0602 3.5C11.1263 3.5 10.2016 3.68394 9.33881 4.04131C8.47604 4.39868 7.69211 4.92249 7.03177 5.58283C5.69816 6.91644 4.94894 8.7252 4.94894 10.6112C4.94894 12.4972 5.69816 14.306 7.03177 15.6396C8.36538 16.9732 10.1741 17.7224 12.0602 17.7224C13.9462 17.7224 15.7549 16.9732 17.0885 15.6396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <input type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder='Search by name, number' />
                        </div>
                    </div> </>}
                {isMobile && <div className='mob row m-0'>
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
                </div>}

                {isMobile ?
                    <>
                        <Accordion defaultActiveKey="0" className='reportAccordianMobile'>
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
                                                    <div className='d-flex justify-content-between '>    <h6> Payment: {item?.payment_mode} </h6>  <h6> Status: {item?.status} </h6></div>
                                                    <div className='d-flex justify-content-between  '><h6 className='d-flex justify-content-between mt-2'>Appt ID : <span className="priceTag"> ID {item?.id}</span>  </h6> <h6 className='date'>  {item?.time} </h6></div>

                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ul className="servicesTotal">
                                                <li className='appointmetList totalAm'>
                                                    <h5 className='keyTitle '> Total Amount </h5>
                                                    <span className="keyBody">  {item?.total_amount}   </span>
                                                </li>

                                                <li className='appointmetList'>
                                                    <h5 className='keyTitle'> Consultation Fees </h5>
                                                    <span className="keyBody"> {item?.total_amount} </span>
                                                </li>
                                                <li className='appointmetList'>
                                                    <h5 className='keyTitle'> Discount  </h5>
                                                    <span className="keyBody"> {item?.discount} </span>
                                                </li>
                                                <hr></hr>

                                                {item?.invoice_item?.map((item) => {

                                                    return (<>
                                                        <li>
                                                            <h5 className='keyTitle'> {item?.item_name} </h5>
                                                            <span className="keyBody"> Rs.{item?.item_amount} </span>
                                                        </li>
                                                        <li>
                                                            <h5 className='keyTitle'> Discount </h5>
                                                            <span className="keyBody"> Rs.{item?.item_discount} </span>
                                                        </li>
                                                    </>)
                                                })}

                                                <li className='appointmetList totalAm'>
                                                    <h5 className='keyTitle  '> Amount Received </h5>
                                                    <span className="keyBody"> {item?.total_amount} </span>
                                                </li>
                                                <li className='appointmetList'>
                                                    <h5 className='keyTitle'> Remaining Balance </h5>
                                                    <span className="keyBody"> {item?.remaining_amount} </span>
                                                </li>
                                                <li className='appointmetList'>
                                                    <h5 className='keyTitle colorBlue'> Clinic Share   </h5>
                                                    <span className="keyBody"> {item?.clinic_share} </span>
                                                </li>
                                                <li className='appointmetList'>
                                                    <h5 className='keyTitle colorBlue'> Doctor Share   </h5>
                                                    <span className="keyBody"> {item?.doctor_share} </span>
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
                    <><div className="table__wrape tablePrime tablefinancal">
                        <Table responsive className=''>
                            <thead>
                                <tr>
                                    <th>Appt ID</th>
                                    <th>Date</th>
                                    <th>MR. No.</th>
                                    <th>Name</th>
                                    <th>Number</th>
                                    <th>Payment Mode</th>
                                    <th>Doctor</th>
                                    <th>Total Amount</th>
                                    <th>Invoice Items</th>
                                    <th>Discount</th>
                                    <th>Amount Received</th>
                                    <th>Status</th>
                                    <th>Remaining Balance</th>
                                    <th>Clinic Share</th>
                                    <th>Doctor Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item?.id}>
                                            <td>{item?.id}</td>
                                            <td>{item?.time}</td>
                                            <td>{item?.mr_nos}</td>
                                            <td>{item?.patient_name}</td>
                                            <td>{item?.patients_no}</td>
                                            <td>{item?.payment_mode}</td>
                                            <td>{item?.doctor_name}</td>
                                            <td>RS. {item?.total_amount}</td>
                                            <td>{item?.invoice_item?.length}</td>
                                            <td>{item?.discount}</td>
                                            <td>{item?.amount_received}</td>
                                            <td>{item?.status}</td>
                                            <td>{item?.remaining_amount}</td>
                                            <td>{item?.clinic_share}</td>
                                            <td>{item?.doctor_share}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="15" className="text-center">No data found.</td>
                                    </tr>
                                )}
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
                    </div></>}

                <ToastContainer />
            </div>

            <Modal handleDateChange={handleDateChange} show={summryfilterShow} onHide={handleSummryFilterClose} centered className="mobileFilterReportModal">
                <Modal.Body>
                    <span className="crossBtnModal" onClick={handleSummryFilterClose}></span>
                    <h2> <span className="filterIcoo"></span> Filter </h2>
                    <div className="wraper_add_modal">
                        <div className="wrape_cl">


                            <Row>

                                <Col xs={12}>


                                    <div className="single_field customSelect">
                                        <label htmlFor="openDate">Dr</label>
                                        <Form.Select onChange={handleDoctorChange} >
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
                                        <DatePicker name='dob' onChange={(date) => setTempDate(date)} inputReadOnly={true} allowClear={false} />
                                    </div>
                                </Col>
                                <Col xs={12}>

                                    <div className="single_field customSelect">
                                        <label htmlFor="openDate">Procedure</label>
                                        <Form.Select onChange={handleProcedureChange} >
                                            <option selected disabled> Select Procedure</option>
                                            {allProcedures.map((item) => {
                                                return (<>
                                                    <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                </>)
                                            })}
                                        </Form.Select>
                                    </div>
                                </Col>

                            </Row>
                        </div>

                        <div className="wrape__radios">
                            <div className="single customRadioo">
                                <div className="wrapeInp">
                                    <input
                                        type="radio"
                                        id="Clear All"
                                        value={"clearAll"}
                                        name="status"
                                        onChange={() => setClearAll(true)}
                                    />
                                    <span></span>
                                </div>
                                <label htmlFor="Clear All" className='mb-0'> Clear All </label>
                            </div>
                        </div>
                        <button className='saveBtn' onClick={handleApplyFilters}> Apply Filter </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ReportSubFinancialTab;
