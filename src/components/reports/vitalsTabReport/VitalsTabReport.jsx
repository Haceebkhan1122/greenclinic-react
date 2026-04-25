import React, { useState, useEffect } from 'react'
import { Table, Form, Modal, Col, Row, Accordion } from 'react-bootstrap';
import { DatePicker } from 'antd';
import './vitalsTabReport.scss';
import dayjs from 'dayjs';
import moment from "moment";
import API from '../../../services/httpInstance';
import { toast, ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useMediaQuery } from '@mui/material'
import Search from "../../../assets/images/svg/search.svg"

const VitalsTabReport = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [selectedDate, setSelectedDate] = useState('')
    const [searchTerm, setSearchTerm] = useState("");
    const [vitalListing, setVitalListing] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState("1");
    const [totalPages, setTotalPages] = useState(1);
    const [paginateCountData, setPaginateCountData] = useState(null);
    const isMobile = useMediaQuery('(max-width:767px)');
    const [vitalsfilterShow, setVitalsFilterShow] = useState(false);

    const handlevitalsFilterClose = () => setVitalsFilterShow(false);
    const handlevitalsFilterShow = () => setVitalsFilterShow(true);
    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);
    };

    const handleDateChange = (date) => {
        let formatDate = dayjs(date).format('YYYY/MM/DD')
        setSelectedDate(formatDate)
    };

    useEffect(() => {
        getVitals();
    }, [currentPage]);

    const getVitals = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY/MM/DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }

            const url = queryParams.toString()
                ? `/reports/vital-list?page=${currentPage}&${queryParams.toString()}`
                : `/reports/vital-list?page=${currentPage}`;

            const response = await API.get(url);
            if (response?.status == 200) {
                setVitalListing(response?.data?.data);
                setIsLoading(false);
            } else {
                setVitalListing([]);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getVitals();
    }, [selectedDate])

    const filteredData = searchTerm
        ? vitalListing?.data?.filter((item) =>
            item?.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.number?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : vitalListing?.data;


    async function downloadAPI() {
        try {
            const queryParams = new URLSearchParams();

            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY/MM/DD");
                queryParams.append("date", formattedDate);
            }

            const url = `${baseUrl}/reports/download-vital${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: Cookies.get('Authorization'),
                    'Access-Control-Allow-Origin': '*'
                }
            });

            const data = await response.json();
            const fileUrl = data?.data;
            if (!fileUrl) {
                throw new Error("File URL not found in response");
            }

            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = "vitals.csv";
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

        } catch (error) {
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
        }
    }


    const parseVitalData = (vitalDataString) => {
        if (!vitalDataString) return {};

        return vitalDataString.split(", ").reduce((acc, pair) => {
            const [key, value] = pair.split(": ");
            acc[key] = value;
            return acc;
        }, {});
    };

    return (
        <div className='reportVitalsTab'>
            {isMobile ?
                <>
                    <div className='bgMobile'>
                        <div className="wrapePrint" onClick={handlevitalsFilterShow}>
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
                                    <input type="text" placeholder='Search by name'
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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


                        <div className='mobBoxes'>
                            <Accordion defaultActiveKey="0" className='reportAccordianMobile'>
                                {filteredData?.map((item, idx) => {
                                    return (<>
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
                                                    <li className='appointmetList'>
                                                        <h5 className='keyTitle vitalsHeading'>Vitals </h5>
                                                    </li>
                                                    {filteredData?.length > 0 && filteredData?.map((item) => (
                                                        <>
                                                            <li className='appointmetList'>
                                                                <span className="keyBody vitalName"> {item?.vitals_value} </span>
                                                            </li>
                                                        </>
                                                    ))}
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

                        </div>
                    </div>




                    <Modal handleDateChange={handleDateChange} show={vitalsfilterShow} onHide={handlevitalsFilterClose} centered className="mobileFilterReportModal">
                        <Modal.Body>
                            <span className="crossBtnModal" onClick={handlevitalsFilterClose}></span>
                            <h2> <span className="filterIcoo"></span> Filter </h2>
                            <div className="wraper_add_modal">
                                <div className="wrape_cl">


                                    <Row>
                                        <Col xs={12}>


                                            <div className="custom_date_report">
                                                <label htmlFor="openDate">Date</label>
                                                <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true}
                                                    allowClear={false} />
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
                </>
                :
                <>
                    <button className='downloadBttn' onClick={() => downloadAPI()}>  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.5 13.3333L6.33331 9.16658L7.49998 7.95825L9.66665 10.1249V3.33325H11.3333V10.1249L13.5 7.95825L14.6666 9.16658L10.5 13.3333ZM5.49998 16.6666C5.04165 16.6666 4.64929 16.5034 4.3229 16.177C3.99651 15.8506 3.83331 15.4583 3.83331 14.9999V12.4999H5.49998V14.9999H15.5V12.4999H17.1666V14.9999C17.1666 15.4583 17.0035 15.8506 16.6771 16.177C16.3507 16.5034 15.9583 16.6666 15.5 16.6666H5.49998Z" fill={themeColor} />
                    </svg> Download </button>
                    <div className="top-bar-filter">
                        <span> Filter by </span>

                        <div className="single_field customSelect d-none">

                            <Form.Select>

                                <option>
                                    Select Vendor
                                </option>
                                <option>
                                    Select Vendor
                                </option>

                            </Form.Select>
                        </div>


                        <div className="custom_date_report">
                            <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true}
                                allowClear={false} />
                        </div>
                        <div className="custom_search_bar_report">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path d="M20.9489 19.5L17.0885 15.6396M17.0885 15.6396C17.7489 14.9793 18.2727 14.1953 18.6301 13.3326C18.9874 12.4698 19.1714 11.5451 19.1714 10.6112C19.1714 9.67735 18.9874 8.75264 18.6301 7.88987C18.2727 7.0271 17.7489 6.24316 17.0885 5.58283C16.4282 4.92249 15.6443 4.39868 14.7815 4.04131C13.9187 3.68394 12.994 3.5 12.0602 3.5C11.1263 3.5 10.2016 3.68394 9.33881 4.04131C8.47604 4.39868 7.69211 4.92249 7.03177 5.58283C5.69816 6.91644 4.94894 8.7252 4.94894 10.6112C4.94894 12.4972 5.69816 14.306 7.03177 15.6396C8.36538 16.9732 10.1741 17.7224 12.0602 17.7224C13.9462 17.7224 15.7549 16.9732 17.0885 15.6396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <input type="text" placeholder='Search by name'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="table__wrape tablePrime">
                        <Table responsive className=''>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Date</th>
                                    {filteredData?.length > 0 &&
                                        [...new Set(filteredData.flatMap(item => item.vitals.map(v => v.key)))].map((key, idx) => (
                                            <th key={idx}>{key}</th>
                                        ))}
                                </tr>

                            </thead>
                            {filteredData?.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item?.patient_name || '-'}</td>
                                    <td>{item?.gender || '-'}</td>
                                    <td>{item?.age !== null && item?.age !== undefined ? item.age : '-'}</td>
                                    <td>{item?.date || '-'}</td>

                                    {[...new Set(filteredData.flatMap(i => i.vitals.map(v => v.key)))].map((key, i) => (
                                        <td key={i}>{item.vitals.find(v => v.key === key)?.value || '-'}</td>
                                    ))}
                                </tr>
                            ))}

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
                </>
            }


            <ToastContainer />
        </div>
    )
}

export default VitalsTabReport