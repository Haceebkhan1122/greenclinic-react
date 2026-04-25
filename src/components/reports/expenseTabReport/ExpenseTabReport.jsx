import React, { useState, useEffect } from 'react'
import './expenseTabReport.scss';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import moment from "moment";
import API from '../../../services/httpInstance';
import { toast, ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { useSelector } from 'react-redux';
import { Form, Modal, Col, Row, Accordion } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useMediaQuery } from '@mui/material'
import Search from "../../../assets/images/svg/search.svg"

const ExpenseTabReport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [selectedDate, setSelectedDate] = useState('')
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState("")
    const [expenseListing, setExpenseListing] = useState([]);
    const [expenseDetails, setExpenseDetails] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState("1");
    const [totalPages, setTotalPages] = useState(1);
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [categoriesData, setCategoriesData] = useState([])
    const [category, setCategory] = useState("");
    const [payment, setPayment] = useState("");
    const [paymentData, setPaymentData] = useState({})
    const isMobile = useMediaQuery('(max-width:767px)');






    const [expensefilterShow, setExpenseFilterShow] = useState(false);

    const handleExpenseFilterClose = () => setExpenseFilterShow(false);
    const handleExpenseFilterShow = () => setExpenseFilterShow(true);
    const handleDateChange = (date) => {
        let formatDate = dayjs(date).format('YYYY/MM/DD')
        setSelectedDate(formatDate)
    };

    const handleYearChange = (date, dateString) => {
        setSelectedYear(dateString)
    };

    const getPayment = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-payment-method`);
            if (response?.status == 200) {
                setPaymentData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getCategories = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`get-expense-categories`);
            if (response?.status == 200) {
                setCategoriesData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getExpenseListing();
    }, [currentPage]);

    useEffect(() => {
        getCategories();
        getPayment();
    }, []);

    const getExpenseListing = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) queryParams.append("year", selectedYear);
            if (payment) queryParams.append("payment method", payment);

            const url = queryParams.toString()
                ? `/reports/expense/detail?page=${currentPage}&${queryParams.toString()}`
                : `/reports/expense/detail?page=${currentPage}`;

            const response = await API.get(url);
            if (response?.status == 200) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setCurrentPage(response?.data?.data?.pagination?.current_page)
                setPaginateCountData(response?.data?.data?.pagination)
                setExpenseListing(response?.data?.data?.data);
                setIsLoading(false);
            } else {
                setExpenseListing([]);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getExpenseDetails = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) queryParams.append("year", selectedYear);

            const url = queryParams.toString()
                ? `/reports/expense/index?${queryParams.toString()}`
                : `/reports/expense/index`;

            const response = await API.get(url);
            if (response?.status == 200) {
                setExpenseDetails(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getExpenseDetails();
    }, [])

    useEffect(() => {
        getExpenseListing();
    }, [selectedDate, selectedYear])

    const filteredData = searchTerm
        ? expenseListing?.filter((item) =>
            item?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.number?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : expenseListing;

    async function downloadAPI() {
        fetch(`${baseUrl}/expense-download`, {
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
                a.download = "vitals.csv"; // Ensure CSV format
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

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "category") {
            setCategory(value)
        }
        if (name == "payment") {
            setPayment(value)
        }
    }

    return (
        <div className='expenseTab'>
            <div className='bgMobile'>
                {isMobile ?
                    <>
                        <div className="wrapePrint" onClick={handleExpenseFilterShow}>
                            <div className="printIcoBtn">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20" cy="20" r="20" fill="#506DE2" />
                                    <path d="M27 10H13C12.2044 10 11.4413 10.3161 10.8787 10.8787C10.3161 11.4413 10 12.2044 10 13V14.17C9.99986 14.5829 10.085 14.9915 10.25 15.37V15.43C10.3913 15.751 10.5914 16.0427 10.84 16.29L17 22.41V29C16.9997 29.1699 17.0426 29.3372 17.1249 29.4859C17.2071 29.6346 17.3259 29.7599 17.47 29.85C17.6291 29.9486 17.8128 30.0006 18 30C18.1565 29.9991 18.3107 29.9614 18.45 29.89L22.45 27.89C22.6149 27.8069 22.7536 27.6798 22.8507 27.5227C22.9478 27.3656 22.9994 27.1847 23 27V22.41L29.12 16.29C29.3686 16.0427 29.5687 15.751 29.71 15.43V15.37C29.8888 14.9944 29.9876 14.5858 30 14.17V13C30 12.2044 29.6839 11.4413 29.1213 10.8787C28.5587 10.3161 27.7956 10 27 10ZM21.29 21.29C21.1973 21.3834 21.124 21.4943 21.0742 21.6161C21.0245 21.7379 20.9992 21.8684 21 22V26.38L19 27.38V22C19.0008 21.8684 18.9755 21.7379 18.9258 21.6161C18.876 21.4943 18.8027 21.3834 18.71 21.29L13.41 16H26.59L21.29 21.29ZM28 14H12V13C12 12.7348 12.1054 12.4804 12.2929 12.2929C12.4804 12.1054 12.7348 12 13 12H27C27.2652 12 27.5196 12.1054 27.7071 12.2929C27.8946 12.4804 28 12.7348 28 13V14Z" fill="#DEE5FE" />
                                </svg>
                            </div>
                        </div>
                        <div className='mob row mx-0'>
                            <Col lg={3} xs={8} className='px-0 '>
                                <div className="search__bar">
                                    <img src={Search} alt="" />
                                    <input type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder='Search by name, number'
                                    />
                                </div>
                            </Col>
                            <Col lg={2} xs={4} className='pe-0'>
                                <button className="btnDownMobile" onClick={() => downloadAPI()}>
                                    <span className='downloadIcon'><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                        <path d="M10.4997 13.3333L6.33301 9.16658L7.49967 7.95825L9.66634 10.1249V3.33325H11.333V10.1249L13.4997 7.95825L14.6663 9.16658L10.4997 13.3333ZM5.49967 16.6666C5.04134 16.6666 4.64898 16.5034 4.32259 16.177C3.9962 15.8506 3.83301 15.4583 3.83301 14.9999V12.4999H5.49967V14.9999H15.4997V12.4999H17.1663V14.9999C17.1663 15.4583 17.0031 15.8506 16.6768 16.177C16.3504 16.5034 15.958 16.6666 15.4997 16.6666H5.49967Z" fill="#0F75BC" />
                                    </svg>  </span>
                                    Download </button>
                            </Col>
                        </div>
                        <div className="cardsWraperSummary">
                            {expenseDetails?.totalExpense && (
                                <div className='singleCardSummary'>
                                    <h3> Total Expense </h3>
                                    <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                        <h5> {expenseDetails?.totalExpense} </h5>
                                        <span className='box_right_bottom'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                                <ellipse cx="16.9325" cy="16.9352" rx="16.9325" ry="16.9352" fill="#DBF6FF" />
                                                <path d="M12.3813 11C13.4343 11 14.3021 11.127 14.9847 11.381C15.6726 11.635 16.1832 12.0186 16.5166 12.5319C16.85 13.0452 17.0166 13.6934 17.0166 14.4766C17.0166 15.0057 16.9161 15.4687 16.715 15.8656C16.514 16.2625 16.2494 16.5985 15.9213 16.8737C15.5932 17.1488 15.2387 17.3737 14.8577 17.5483L18.2707 22.6044H15.5403L12.7702 18.1516H11.4606V22.6044H9V11H12.3813ZM12.2067 13.0161H11.4606V16.1514H12.2543C13.0692 16.1514 13.6512 16.0164 14.0005 15.7466C14.355 15.4714 14.5323 15.0692 14.5323 14.5401C14.5323 13.9897 14.3418 13.5982 13.9608 13.3653C13.5851 13.1325 13.0004 13.0161 12.2067 13.0161ZM25.7318 19.9692C25.7318 20.5725 25.5889 21.0831 25.3032 21.5011C25.0227 21.9139 24.602 22.2287 24.0411 22.4457C23.4802 22.6574 22.7817 22.7632 21.9457 22.7632C21.3266 22.7632 20.7948 22.7235 20.3503 22.6441C19.9111 22.5648 19.4666 22.4325 19.0168 22.2473V20.247C19.4984 20.464 20.0143 20.6439 20.5646 20.7868C21.1202 20.9244 21.607 20.9932 22.0251 20.9932C22.496 20.9932 22.832 20.9244 23.0331 20.7868C23.2395 20.6439 23.3427 20.4587 23.3427 20.2312C23.3427 20.083 23.3003 19.9507 23.2157 19.8343C23.1363 19.7126 22.9617 19.5777 22.6918 19.4295C22.4219 19.276 21.9986 19.0776 21.4218 18.8342C20.8662 18.6014 20.4085 18.3659 20.0487 18.1278C19.6942 17.8896 19.4296 17.6092 19.255 17.2864C19.0856 16.9583 19.001 16.5429 19.001 16.0402C19.001 15.22 19.3185 14.6036 19.9534 14.1908C20.5937 13.7728 21.4483 13.5638 22.5172 13.5638C23.0675 13.5638 23.5914 13.6193 24.0888 13.7305C24.5914 13.8416 25.1074 14.0188 25.6365 14.2623L24.9063 16.0085C24.4671 15.818 24.0517 15.6619 23.6601 15.5402C23.2739 15.4185 22.8796 15.3576 22.4775 15.3576C22.123 15.3576 21.8557 15.4052 21.6758 15.5005C21.4959 15.5957 21.406 15.7413 21.406 15.937C21.406 16.0799 21.4509 16.2069 21.5409 16.318C21.6361 16.4292 21.816 16.5535 22.0806 16.6911C22.3505 16.8234 22.7447 16.9954 23.2633 17.207C23.766 17.4134 24.2025 17.6304 24.5729 17.8579C24.9433 18.0801 25.2291 18.3579 25.4302 18.6913C25.6312 19.0194 25.7318 19.4454 25.7318 19.9692Z" fill="#0F75BC" />
                                            </svg></span>
                                    </div>
                                </div>
                            )}
                            {expenseDetails?.totalExpense && (
                                <div className='singleCardSummary'>
                                    <h3> Total Profit / Loss </h3>
                                    <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                        <h5> {expenseDetails?.totalProfitLoss} </h5>
                                        <span className='box_right_bottom'>

                                            <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <ellipse cx="17.0675" cy="17.065" rx="16.9325" ry="16.9352" fill="#DBF6FF" />
                                                <path d="M11 20V10.8L7.4 14.4L6 13L12 7L18 13L16.6 14.4L13 10.8V20H11Z" fill="#0F75BC" />
                                                <path d="M24 11L24 20.2L27.6 16.6L29 18L23 24L17 18L18.4 16.6L22 20.2L22 11L24 11Z" fill="#0F75BC" />
                                            </svg>

                                        </span>
                                    </div>
                                </div>
                            )}
                            {expenseDetails?.totalExpense && (
                                <div className='singleCardSummary'>
                                    <h3> Total Revenue </h3>
                                    <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                        <h5> {expenseDetails?.totalRevenue} </h5>
                                        <span className='box_right_bottom'>

                                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <ellipse cx="17.0674" cy="17.065" rx="16.9325" ry="16.9352" fill="#DBF6FF" />
                                                <path d="M8 26V24L10 22V26H8ZM12 26V20L14 18V26H12ZM16 26V18L18 20.025V26H16ZM20 26V20.025L22 18.025V26H20ZM24 26V16L26 14V26H24ZM8 20.825V18L15 11L19 15L26 8V10.825L19 17.825L15 13.825L8 20.825Z" fill="#0F75BC" />
                                            </svg>

                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className='mobBoxes'>


                            <Accordion defaultActiveKey="0" className='reportAccordianMobile'>
                                {filteredData?.map((item, idx) => {
                                    return (<>

                                        {expenseListing?.length > 0 && expenseListing?.map((item) => {
                                            return (
                                                <>
                                                    <Accordion.Item eventKey={idx}>
                                                        <Accordion.Header>
                                                            <div className='accordHeader tw-w-full tw-flex tw-items-center tw-justify-between'>
                                                                <div className='tw-flex tw-w-full  tw-flex-col tw-justify-center'>
                                                                    <div className=' tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-1'>
                                                                        <h5>  Dr.{item?.doctor_name}</h5>
                                                                        <span className="priceTag"> ID {item?.patient_id}</span>
                                                                    </div>
                                                                    <h6>  {item?.patient_name} {item?.age}   |  {item?.gender} </h6>
                                                                    <div className='d-flex justify-content-between mt-2'><h6>   {item?.phone}  </h6> <h6> {item?.date} </h6></div>

                                                                </div>
                                                            </div>
                                                        </Accordion.Header>
                                                        <Accordion.Body>
                                                            <ul className="servicesTotal">
                                                                {expenseListing?.length > 0 && expenseListing?.map((item) => {
                                                                    return (
                                                                        <>
                                                                            <li className='appointmetList'>
                                                                                <h5>description</h5>
                                                                                <span className="keyBody vitalName"> {item?.description}  dd</span>
                                                                            </li>
                                                                            <li className='appointmetList'>
                                                                                <h5>Date</h5>
                                                                                <span className="keyBody vitalName"> {item?.deposit_date}  dd</span>
                                                                            </li>
                                                                            <li className='appointmetList'>
                                                                                <h5>Category</h5>
                                                                                <span className="keyBody vitalName"> {item?.expense_category || item?.expense_category_id} </span>
                                                                            </li>
                                                                            <li className='appointmetList'>
                                                                                <h5>Payment  Method</h5>
                                                                                <span className="keyBody vitalName"> {item?.payment_method} sd </span>
                                                                            </li>
                                                                            <li className='appointmetList'>
                                                                                <h5>Amount</h5>
                                                                                <span className="keyBody vitalName"> {item?.amount} dd</span>
                                                                            </li>
                                                                            <li className='appointmetList'>
                                                                                <h5>Action</h5>
                                                                                <span className="keyBody vitalName">{item?.action}dd </span>
                                                                            </li>

                                                                        </>
                                                                    )
                                                                })}





                                                            </ul>
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                    <tr>
                                                        <td>{item?.description}</td>
                                                        <td>{item?.deposit_date}</td>
                                                        <td>{item?.expense_category || item?.expense_category_id}</td>
                                                        <td>{item?.payment_method}</td>
                                                        <td>{item?.amount}</td>
                                                        <td>{item?.action}</td>
                                                    </tr>
                                                </>
                                            )
                                        })}

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

                        </div>

                    </>
                    :
                    <>
                        <button className='downloadBttn' onClick={() => downloadAPI()}>  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                            <path d="M10.5 13.3333L6.33331 9.16658L7.49998 7.95825L9.66665 10.1249V3.33325H11.3333V10.1249L13.5 7.95825L14.6666 9.16658L10.5 13.3333ZM5.49998 16.6666C5.04165 16.6666 4.64929 16.5034 4.3229 16.177C3.99651 15.8506 3.83331 15.4583 3.83331 14.9999V12.4999H5.49998V14.9999H15.5V12.4999H17.1666V14.9999C17.1666 15.4583 17.0035 15.8506 16.6771 16.177C16.3507 16.5034 15.9583 16.6666 15.5 16.6666H5.49998Z" fill={themeColor} />
                        </svg> Download </button>
                        <div className="top-bar-filter">
                            <span> Filter by </span>
                            <div className="single_field customSelect custom_date_report">
                                <Form.Select aria-label="Default select example" name="category" value={category} onChange={handleChange} className='filter'  >
                                    <option value={""}>  Select Category </option>
                                    {categoriesData?.map((item) => {
                                        return (<>
                                            <option value={item?.id} > {item?.category} </option>
                                        </>)
                                    })}
                                </Form.Select>
                            </div>

                            <div className="custom_date_report dd">
                                <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true}
                                    allowClear={false} />
                            </div>
                            {/* <div className="custom_date_reportYear">
                    <DatePicker onChange={handleYearChange} picker="year" inputReadOnly={true}
                        allowClear={false} />
                </div> */}

                            <div className="single_field customSelect selectOption">
                                <Form.Select aria-label="Default select example" name="payment" value={payment} onChange={handleChange} className='filter'  >
                                    <option value={""} >  Payment Method </option>
                                    {paymentData?.paymentMethod?.map((item, index) => (
                                        <option key={index} value={item?.id}>
                                            {item?.title}
                                        </option>
                                    ))}
                                </Form.Select>
                            </div>

                            <div className="custom_search_bar_report">
                                <span className='search_icon'>  </span>
                                <input type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder='Search by name, number'
                                />
                            </div>
                        </div>
                        <div className="cardsWraperSummary">
                            {expenseDetails?.totalExpense && (
                                <div className='singleCardSummary'>
                                    <h3> Total Expense </h3>
                                    <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                        <h5> {expenseDetails?.totalExpense} </h5>
                                        <span className='box_right_bottom'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                                <ellipse cx="16.9325" cy="16.9352" rx="16.9325" ry="16.9352" fill="#DBF6FF" />
                                                <path d="M12.3813 11C13.4343 11 14.3021 11.127 14.9847 11.381C15.6726 11.635 16.1832 12.0186 16.5166 12.5319C16.85 13.0452 17.0166 13.6934 17.0166 14.4766C17.0166 15.0057 16.9161 15.4687 16.715 15.8656C16.514 16.2625 16.2494 16.5985 15.9213 16.8737C15.5932 17.1488 15.2387 17.3737 14.8577 17.5483L18.2707 22.6044H15.5403L12.7702 18.1516H11.4606V22.6044H9V11H12.3813ZM12.2067 13.0161H11.4606V16.1514H12.2543C13.0692 16.1514 13.6512 16.0164 14.0005 15.7466C14.355 15.4714 14.5323 15.0692 14.5323 14.5401C14.5323 13.9897 14.3418 13.5982 13.9608 13.3653C13.5851 13.1325 13.0004 13.0161 12.2067 13.0161ZM25.7318 19.9692C25.7318 20.5725 25.5889 21.0831 25.3032 21.5011C25.0227 21.9139 24.602 22.2287 24.0411 22.4457C23.4802 22.6574 22.7817 22.7632 21.9457 22.7632C21.3266 22.7632 20.7948 22.7235 20.3503 22.6441C19.9111 22.5648 19.4666 22.4325 19.0168 22.2473V20.247C19.4984 20.464 20.0143 20.6439 20.5646 20.7868C21.1202 20.9244 21.607 20.9932 22.0251 20.9932C22.496 20.9932 22.832 20.9244 23.0331 20.7868C23.2395 20.6439 23.3427 20.4587 23.3427 20.2312C23.3427 20.083 23.3003 19.9507 23.2157 19.8343C23.1363 19.7126 22.9617 19.5777 22.6918 19.4295C22.4219 19.276 21.9986 19.0776 21.4218 18.8342C20.8662 18.6014 20.4085 18.3659 20.0487 18.1278C19.6942 17.8896 19.4296 17.6092 19.255 17.2864C19.0856 16.9583 19.001 16.5429 19.001 16.0402C19.001 15.22 19.3185 14.6036 19.9534 14.1908C20.5937 13.7728 21.4483 13.5638 22.5172 13.5638C23.0675 13.5638 23.5914 13.6193 24.0888 13.7305C24.5914 13.8416 25.1074 14.0188 25.6365 14.2623L24.9063 16.0085C24.4671 15.818 24.0517 15.6619 23.6601 15.5402C23.2739 15.4185 22.8796 15.3576 22.4775 15.3576C22.123 15.3576 21.8557 15.4052 21.6758 15.5005C21.4959 15.5957 21.406 15.7413 21.406 15.937C21.406 16.0799 21.4509 16.2069 21.5409 16.318C21.6361 16.4292 21.816 16.5535 22.0806 16.6911C22.3505 16.8234 22.7447 16.9954 23.2633 17.207C23.766 17.4134 24.2025 17.6304 24.5729 17.8579C24.9433 18.0801 25.2291 18.3579 25.4302 18.6913C25.6312 19.0194 25.7318 19.4454 25.7318 19.9692Z" fill="#0F75BC" />
                                            </svg></span>
                                    </div>
                                </div>
                            )}
                            {expenseDetails?.totalExpense && (
                                <div className='singleCardSummary'>
                                    <h3> Total Profit / Loss </h3>
                                    <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                        <h5> {expenseDetails?.totalProfitLoss} </h5>
                                        <span className='box_right_bottom'>

                                            <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <ellipse cx="17.0675" cy="17.065" rx="16.9325" ry="16.9352" fill="#DBF6FF" />
                                                <path d="M11 20V10.8L7.4 14.4L6 13L12 7L18 13L16.6 14.4L13 10.8V20H11Z" fill="#0F75BC" />
                                                <path d="M24 11L24 20.2L27.6 16.6L29 18L23 24L17 18L18.4 16.6L22 20.2L22 11L24 11Z" fill="#0F75BC" />
                                            </svg>

                                        </span>
                                    </div>
                                </div>
                            )}
                            {expenseDetails?.totalExpense && (
                                <div className='singleCardSummary'>
                                    <h3> Total Revenue </h3>
                                    <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                        <h5> {expenseDetails?.totalRevenue} </h5>
                                        <span className='box_right_bottom'>

                                            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <ellipse cx="17.0674" cy="17.065" rx="16.9325" ry="16.9352" fill="#DBF6FF" />
                                                <path d="M8 26V24L10 22V26H8ZM12 26V20L14 18V26H12ZM16 26V18L18 20.025V26H16ZM20 26V20.025L22 18.025V26H20ZM24 26V16L26 14V26H24ZM8 20.825V18L15 11L19 15L26 8V10.825L19 17.825L15 13.825L8 20.825Z" fill="#0F75BC" />
                                            </svg>

                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='tableWraper'>
                            <table className='table expenseTable'>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>Deposit Date</th>
                                        <th>Expense Category</th>
                                        <th>Payment Method</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!filteredData?.length > 0 ?
                                        <tr>
                                            <td colSpan={6} className='text-center noData'>No data available in table</td>
                                        </tr>
                                        :
                                        expenseListing?.length > 0 && expenseListing?.map((item) => {
                                            return (
                                                <>
                                                    <tr>
                                                        <td>{item?.description}</td>
                                                        <td>{item?.deposit_date}</td>
                                                        <td>{item?.expense_category || item?.expense_category_id}</td>
                                                        <td>{item?.payment_method}</td>
                                                        <td>{item?.amount}</td>
                                                        <td>{item?.action}</td>
                                                    </tr>
                                                </>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
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
                    </>
                }
            </div>

            <ToastContainer />
            <Modal handleDateChange={handleDateChange} show={expensefilterShow} onHide={handleExpenseFilterClose} centered className="mobileFilterReportModal">
                <Modal.Body>
                    <span className="crossBtnModal" onClick={handleExpenseFilterClose}></span>
                    <h2> <span className="filterIcoo"></span> Filter </h2>
                    <div className="wraper_add_modal">
                        <div className="wrape_cl">
                            <Row>

                                <Col xs={12}>

                                    <div className="single_field customSelect">
                                        <label htmlFor="openDate">Category</label>
                                        <Form.Select aria-label="Default select example" name="category" value={category} onChange={handleChange} className='filter'  >
                                            <option value={""}>  Select Category </option>
                                            {categoriesData?.map((item) => {
                                                return (<>
                                                    <option value={item?.id} > {item?.category} </option>
                                                </>)
                                            })}
                                        </Form.Select>
                                    </div>
                                </Col>
                                <Col xs={12}>
                                    <div className="custom_date_report">
                                        <label htmlFor="openDate">Date</label>
                                        <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true}
                                            allowClear={false} />
                                    </div>
                                </Col>

                                <Col xs={12}>
                                    <div className="single_field customSelect">
                                        <label htmlFor="openDate"> Payment Method </label>
                                        <Form.Select aria-label="Default select example" name="payment" value={payment} onChange={handleChange} className='filter'  >
                                            <option value={""} >  Payment Method </option>
                                            {paymentData?.paymentMethod?.map((item, index) => (
                                                <option key={index} value={item?.id}>
                                                    {item?.title}
                                                </option>
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
                        <button className='saveBtn'  > Apply Filter </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ExpenseTabReport