import { Accordion, Col, Form, Table } from 'react-bootstrap';
import './reportSubClinicTab.scss';
import { DatePicker, Divider } from 'antd';
import { useEffect, useState } from 'react';
import API from '../../../../services/httpInstance/index';
import dayjs from 'dayjs';
import moment from "moment";
import { toast, ToastContainer } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { isMobile } from 'react-device-detect';
import Search from '../../../../assets/images/svg/search-light.svg'
import MobileFilterReportModal from '../../../modal/mobileFilterReportModal/MobileFilterReportModal';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { PrinterOutlined } from '@ant-design/icons';

const ReportSubClinicTab = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [specialityData, setSpecialityData] = useState([])
    const [statusData, setStatusData] = useState([])
    const [selectedSpeciality, setSelectedSpeciality] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [indexx, setIndexx] = useState(null)
    const [collapse, setCollapsed] = useState(false)
    const [selectedDate, setSelectedDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState("1");
    const [totalPages, setTotalPages] = useState(1);
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [filterShow, setFilterShow] = useState(false);
    const [indicationMessage, setIndicationMessage] = useState("");

    const handleDayEndReport = async () => {
        try {
            const response = await API.get("/reports/download-clinic-day-end-report");
            const pdfUrl = response?.data?.pdf_url;
            window.open(pdfUrl, "_blank");
        } catch (error) {
            console.log(error)
        }
    }

    const handleDayEndPrint = async (id) => {
        try {
            const response = await API.post(`/reports/download-day-end-report?doctor_id=${id}`)
            const pdfUrl = response?.data?.pdf_url;
            window.open(pdfUrl, "_blank");
        } catch (error) {
            setIndicationMessage(error)
        }
    }

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    useEffect(() => {
        getSpecialities();
        getStatus();
    }, []);

    useEffect(() => {
        getReports();
    }, [currentPage]);

    const getReports = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedStatus) queryParams.append("status", selectedStatus);
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }
            if (selectedSpeciality) queryParams.append("specialty_id", selectedSpeciality);

            const url = queryParams.toString() ? `/reports/clinic-list?page=${currentPage}&${queryParams.toString()}` : `/reports/clinic-list?page=${currentPage}`;

            const response = await API.get(url);

            if (response?.status === 200 && response?.data?.data) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setCurrentPage(response?.data?.data?.pagination?.current_page)
                setReportData(response.data.data);
                setPaginateCountData(response?.data?.data?.pagination)
            } else {
                console.warn("Unexpected API response:", response);
            }

        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getReports();
    }, [selectedStatus, selectedDate, selectedSpeciality])

    const getSpecialities = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/clinic-specality`);
            if (response?.status == 200) {
                setSpecialityData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getStatus = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/reports/status-list`);
            if (response?.status == 200) {
                setStatusData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const { value, name, checked } = e.target;

        if (name == "specialty") {
            setSelectedSpeciality(value);
        }

        if (name == "status") {
            setSelectedStatus(value);
        }
    }

    const handleRow = (item, idx) => {
        setCollapsed(true);
        setIndexx(idx)
    }

    const handleCloseRow = (item, idx) => {
        setCollapsed(false);
        setIndexx(null)
    }

    const handleDateChange = (date) => {
        let formatDate = dayjs(date).format('YYYY/MM/DD')
        setSelectedDate(formatDate)
    }

    const filteredData = searchTerm
        ? reportData?.data?.filter((item) =>
            item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : reportData?.data;

    async function downloadAPI() {
        fetch(`${baseUrl}/reports/clinic-download`, {
            method: 'GET',
            headers: {
                Authorization: Cookies.get('Authorization'),
                'Access-Control-Allow-Origin': '*'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const fileUrl = data?.data;
                if (!fileUrl) {
                    throw new Error("File URL not found in response");
                }

                const a = document.createElement('a');
                a.href = fileUrl;
                a.download = "clinic-reports.csv";
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

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);
    };

    const handleFilterClose = () => setFilterShow(false);
    const handleFilterShow = () => setFilterShow(true);

    return (
        <div className='reportSubClinicTab'>
            <div className='mobileBG'>
                <div className="wrapePrint" onClick={handleFilterShow}>
                    <div className="printIcoBtn">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="20" cy="20" r="20" fill="#506DE2" />
                            <path d="M27 10H13C12.2044 10 11.4413 10.3161 10.8787 10.8787C10.3161 11.4413 10 12.2044 10 13V14.17C9.99986 14.5829 10.085 14.9915 10.25 15.37V15.43C10.3913 15.751 10.5914 16.0427 10.84 16.29L17 22.41V29C16.9997 29.1699 17.0426 29.3372 17.1249 29.4859C17.2071 29.6346 17.3259 29.7599 17.47 29.85C17.6291 29.9486 17.8128 30.0006 18 30C18.1565 29.9991 18.3107 29.9614 18.45 29.89L22.45 27.89C22.6149 27.8069 22.7536 27.6798 22.8507 27.5227C22.9478 27.3656 22.9994 27.1847 23 27V22.41L29.12 16.29C29.3686 16.0427 29.5687 15.751 29.71 15.43V15.37C29.8888 14.9944 29.9876 14.5858 30 14.17V13C30 12.2044 29.6839 11.4413 29.1213 10.8787C28.5587 10.3161 27.7956 10 27 10ZM21.29 21.29C21.1973 21.3834 21.124 21.4943 21.0742 21.6161C21.0245 21.7379 20.9992 21.8684 21 22V26.38L19 27.38V22C19.0008 21.8684 18.9755 21.7379 18.9258 21.6161C18.876 21.4943 18.8027 21.3834 18.71 21.29L13.41 16H26.59L21.29 21.29ZM28 14H12V13C12 12.7348 12.1054 12.4804 12.2929 12.2929C12.4804 12.1054 12.7348 12 13 12H27C27.2652 12 27.5196 12.1054 27.7071 12.2929C27.8946 12.4804 28 12.7348 28 13V14Z" fill="#DEE5FE" />
                        </svg>
                    </div>
                </div>
                {!isMobile && <button className='downloadBttn' onClick={() => downloadAPI()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                        <path d="M10.5 13.3333L6.33334 9.16665L7.50001 7.95831L9.66668 10.125V3.33331H11.3333V10.125L13.5 7.95831L14.6667 9.16665L10.5 13.3333ZM5.50001 16.6666C5.04168 16.6666 4.64932 16.5035 4.32293 16.1771C3.99654 15.8507 3.83334 15.4583 3.83334 15V12.5H5.50001V15H15.5V12.5H17.1667V15C17.1667 15.4583 17.0035 15.8507 16.6771 16.1771C16.3507 16.5035 15.9583 16.6666 15.5 16.6666H5.50001Z" fill={themeColor} />
                    </svg>
                    Download </button>}
                {isMobile && <div className='mob'>
                    <Col lg={3}>
                        <div className="search__bar">
                            <img src={Search} alt="" />
                            <input
                                type="text"
                                placeholder='Search by name'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </Col>
                    <Col lg={2}>
                        <button className="btnDownMobile" onClick={() => downloadAPI()}>
                            <span className='downloadIcon'><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                <path d="M10.4997 13.3333L6.33301 9.16658L7.49967 7.95825L9.66634 10.1249V3.33325H11.333V10.1249L13.4997 7.95825L14.6663 9.16658L10.4997 13.3333ZM5.49967 16.6666C5.04134 16.6666 4.64898 16.5034 4.32259 16.177C3.9962 15.8506 3.83301 15.4583 3.83301 14.9999V12.4999H5.49967V14.9999H15.4997V12.4999H17.1663V14.9999C17.1663 15.4583 17.0031 15.8506 16.6768 16.177C16.3504 16.5034 15.958 16.6666 15.4997 16.6666H5.49967Z" fill="#0F75BC" />
                            </svg>  </span>
                            Download </button>
                    </Col>
                </div>}
                <div className="top-bar-filter">
                    <span> Filter by </span>
                    <div className="custom_date_report">
                        <DatePicker name='dob' onChange={handleDateChange} />
                    </div>
                    <div className="single_field customSelect">
                        <Form.Select aria-label="Default select example" name='status' value={selectedStatus} onChange={handleChange}>
                            <option value={""}>Select Status</option>
                            {statusData && Object.entries(statusData).map(([key, value]) => (
                                <option key={key} value={value}>{key}</option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="single_field customSelect">
                        <Form.Select aria-label="Default select example" name='specialty' onChange={handleChange} value={selectedSpeciality}  >
                            <option> Select specialty </option>
                            {specialityData?.map((item) => {
                                return (<>
                                    <option key={item?.id} value={item?.id}> {item.name} </option>
                                </>)
                            })}
                        </Form.Select>
                    </div>
                    <div className="custom_search_bar_report">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                            <path d="M20.949 19L17.0886 15.1396M17.0886 15.1396C17.7489 14.4793 18.2727 13.6953 18.6301 12.8326C18.9875 11.9698 19.1714 11.0451 19.1714 10.1112C19.1714 9.17735 18.9875 8.25264 18.6301 7.38987C18.2727 6.5271 17.7489 5.74316 17.0886 5.08283C16.4282 4.42249 15.6443 3.89868 14.7815 3.54131C13.9188 3.18394 12.994 3 12.0602 3C11.1263 3 10.2016 3.18394 9.33884 3.54131C8.47607 3.89868 7.69214 4.42249 7.0318 5.08283C5.69819 6.41644 4.94897 8.2252 4.94897 10.1112C4.94897 11.9972 5.69819 13.806 7.0318 15.1396C8.36541 16.4732 10.1742 17.2224 12.0602 17.2224C13.9462 17.2224 15.755 16.4732 17.0886 15.1396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder='Search by name, number'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className='reportBtn' onClick={handleDayEndReport}> Day End Report </button>
                </div>
                {isMobile ?
                    <Accordion defaultActiveKey="0" className='reportAccordianMobile'>
                        {filteredData?.map((item, idx) => {
                            return (<>
                                <Accordion.Item eventKey={idx}>
                                    <Accordion.Header>
                                        <div className='accordHeader tw-w-full tw-flex tw-items-center tw-justify-between'>
                                            <div className='tw-flex tw-w-full  tw-flex-col tw-justify-center'>
                                                <div className=' tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-1'>
                                                    <h5>  Dr.{item?.name}</h5>
                                                    <span className="priceTag"> ID {item?.id}</span>
                                                </div>
                                                <h6> Dermatologist</h6>
                                                <div className='accordHeader tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-1'>
                                                    <span className='keyMain'> Total Appointments</span>
                                                    <span className='keyMainBd'> {item?.total_appt}</span>
                                                </div>
                                                <div className='accordHeader tw-w-full tw-flex tw-items-center tw-justify-between tw-gap-1'>
                                                    <span className='keyMain'> Cancelled Appointments</span>
                                                    <span className='keyMainBd'> {item?.cancel_appt}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul className="servicesTotal">
                                            <li>
                                                <h5 className='keyTitle'> Services </h5>
                                                <span className="keyBody"> {item?.services?.length} Services </span>
                                            </li>
                                            {item?.services?.map((item) => {
                                                <li>
                                                    <h5 className='keyTitle'> Services </h5>
                                                    <span className="keyBody"> {item?.services?.length} </span>
                                                </li>
                                                return (<>
                                                    <li>
                                                        <h5 className='keyTitle'> {item?.name} </h5>
                                                        <span className="keyBody"> Rs.{item?.price} </span>
                                                    </li>
                                                </>)
                                            })}
                                            <Divider />
                                            <li>
                                                <h5 className='keyTitle'> Status </h5>
                                                <span className="keyBody"> {item?.status} </span>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </>)
                        })}
                    </Accordion>
                    :
                    <div className="table__wrape">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>  </th>
                                    <th>ID </th>
                                    <th>Date Created</th>
                                    <th>Doctor Name</th>
                                    <th>Speciality</th>
                                    <th>Total Appointments</th>
                                    <th>Cancelled Appointments </th>
                                    <th>Services</th>
                                    <th>Clinic Share</th>
                                    <th>Doctor Share</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            {(idx === indexx && collapse) ?
                                                <span className='plusIcon' onClick={() => handleCloseRow(item, idx)}> - </span>
                                                :
                                                <span className='plusIcon' onClick={() => handleRow(item, idx)}> + </span>
                                            }
                                        </td>
                                        <td> {item?.id} </td>
                                        <td> {item?.date} </td>
                                        <td> {item?.name} </td>
                                        <td> {item?.speciality} </td>
                                        <td> {item?.total_appt} </td>
                                        <td> {item?.cancel_appt} </td>
                                        <td>
                                            {item?.services?.length} Services
                                            {(idx === indexx && collapse) && (
                                                <div className="showMore tw-flex tw-flex-col tw-pb-1 tw-pt-1">
                                                    {item?.services?.map((service, serviceIdx) => (
                                                        <span key={serviceIdx}> {service?.services_name} </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {(idx === indexx && collapse) && (
                                                <div className="showMore tw-flex tw-flex-col tw-pb-1 tw-pt-1">
                                                    {item?.services?.map((service, serviceIdx) => (
                                                        <span key={serviceIdx}> {service?.clinic_share} </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td>  </td>
                                        <td> {item?.status} </td>
                                        <td>
                                            <button className='printer' onClick={() => handleDayEndPrint(item.id)}><PrinterOutlined /></button>
                                        </td>
                                    </tr>
                                ))}
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
                }
                <ToastContainer />
                <MobileFilterReportModal filterShow={filterShow} handleFilterClose={handleFilterClose} />
            </div>
        </div>
    )
}

export default ReportSubClinicTab;
