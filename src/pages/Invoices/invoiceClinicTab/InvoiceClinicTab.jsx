import { DatePicker } from 'antd';
import { Col, Form, Row, Table } from 'react-bootstrap';
import Search from "../../../assets/images/svg/search.svg"
import WraperLayout from '../../../components/wraperLayout/WraperLayout';
import { customers } from '../../../services/data';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './invoiceClinicTab.scss';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import InvoicePayoutDetailsModal from '../../../components/modal/invoicePayoutDetailsModal/InvoicePayoutDetailsModal';
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/fontawesome-free-solid';
import Loader from '../../../components/loader/Loader';
import { isMobile } from 'react-device-detect';
import MobileFilterInvoiceModal from '../../../components/modal/mobileFilterInvoiceModal/MobileFilterInvoiceModal';
import ViewOnlineInvoiceModal from '../../../components/modal/viewOnlineInvoiceModal/ViewOnlineInvoiceModal';
import { useSelector } from 'react-redux';
import CustomDropdown from '../../../components/customDropdown';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    FormControlLabel,
    Typography,
    Button,
    Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useClickAway } from '@uidotdev/usehooks';
import FilterIcon from '../../../assets/images/svg/FilterButton.svg';


const InvoiceClinicTab = () => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [invoiceData, setInvoiceData] = useState([])
    const [selectedDate, setSelectedDate] = useState(dayjs().format("DD/MM/YYYY"));
    const [isLoading, setIsLoading] = useState(false);
    const [filterBy, setFilterBy] = useState("");
    const [indexx, setIndexx] = useState(null)
    const [collapse, setCollapsed] = useState(false)
    const [doctorId, setdoctorId] = useState(null)
    const [allDoctors, setAllDoctors] = useState([]);
    const [filteredData, setFilteredData] = useState([])
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState("1");
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [filterShow, setFilterShow] = useState(false);
    const [status, setStatus] = useState("")
    const [addLabshow, setAddLabshow] = useState(false);
    const [viewItem, setViewItem] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [selected, setSelected] = useState({});
    const [shouldSkipApi, setShouldSkipApi] = useState(false);

    const filterOptions = {
        // Source: ["Physical", "Online"],
        "Payment Mode": ["cash", "card", "bank transfer"],
        status: ["Paid", "Unpaid"],
    };

    const ref = useClickAway(() => {
        setIsOpen(false);
    });

    const toggleMain = () => setIsOpen(!isOpen);

    const toggleExpand = (section) => {
        setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheckbox = (section, value) => {
        setSelected(prevSelected => {
            const currentValues = prevSelected[section] || [];

            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            return {
                ...prevSelected,
                [section]: newValues
            };
        });
    };


    const clearAll = () => {
        setSelected({});
        setExpanded({});
        setShouldSkipApi(true);
    };

    const handleAddLabClose = () => setAddLabshow(false);
    const handleAddLabshow = (item) => {
        setViewItem(item);
        setAddLabshow(true);
    }

    const handleFilterClose = () => setFilterShow(false);
    const handleFilterShow = () => setFilterShow(true);

    useEffect(() => {
        getDoctors();
    }, []);

    useEffect(() => {
        if (currentPage !== 1) {
            getInvoices(currentPage);
        }
    }, [currentPage]);

    useEffect(() => {
        getInvoices(currentPage);
    }, [selectedDoctor, selectedDate, status, selected]);

    const queryKeyMap = {
        "Payment Mode": "payment_mode",
        status: "status"
    };


    const handleDateChange = (date) => {
        if (date) {
            let formattedDate = dayjs(date).format("DD/MM/YYYY");
            setSelectedDate(formattedDate);
        } else {
            setSelectedDate(null);
        }
    };

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };

    const valueMap = {
        card: "credit_debit_card",
        "bank transfer" : "bank_transfer"
    };

    const getInvoices = async (pageNumber) => {
        if (shouldSkipApi) {
            setShouldSkipApi(false);
            return;
        }
        try {
            const queryParams = new URLSearchParams();
            if (selectedDoctor) queryParams.append("doctor", selectedDoctor);
            if (selectedDate) {
                queryParams.append("start_date", selectedDate);
            }
            Object.entries(selected).forEach(([section, values]) => {
                const queryKey = queryKeyMap[section] || section;
                values.forEach(value => {
                    const mappedValue = valueMap[value] || value;
                    queryParams.append(`${queryKey}[]`, mappedValue);
                });
            });
            queryParams.append("page", pageNumber)
            const queryString = decodeURIComponent(queryParams.toString());
            const url = queryString ? `/reports/billing-filter?${queryString}` : `/reports/billing-filter`;
            setIsLoading(true);
            const response = await API.get(url);
            if (response?.status === 200 && response?.data?.data) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.billing_data?.pagination?.total / response?.data?.data?.billing_data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setInvoiceData(response.data.data);
                setFilteredData(response.data.data?.billing_data?.invoices);
                setPaginateCountData(response?.data?.data?.billing_data?.pagination)
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setFilteredData([])
                setInvoiceData([]);
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRow = (item, idx) => {
        setCollapsed(true);
        setIndexx(idx)
    }

    const getDoctors = async () => {
        try {
            const response = await API.get(`/get-all-doctors-by-clinic_id`);
            if (response?.status == 200) {
                setAllDoctors(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCloseRow = (item, idx) => {
        setCollapsed(false);
        setIndexx(null)
    }

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "doctor") {
            setSelectedDoctor(value);
        }
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        let examData = [...invoiceData?.billing_data?.invoices];
        if (value !== "") {
            let lower = value.toLowerCase();
            let trimed = lower.replace(/\s/g, '');
            examData = examData.filter((item) => {
                return item?.patient_name.toLowerCase().replace(/\s/g, '').includes(trimed) || item?.patient_number.toLowerCase().replace(/\s/g, '').includes(trimed?.replace(/\s/g, ''));
            })
        }
        else {
            examData = [...invoiceData?.billing_data?.invoices];
        }
        setFilteredData(examData);
    }

    const downloadBtn = async () => {
        if (!selectedDoctor) {
            toast.error("Please Select Doctor first")
            return;
        }
        if (!selectedDate) {
            toast.error("Please Select Date first")
            return;
        }
        try {
            const response = await API.get(`/reports/clinic-billing-csv?start_date=${selectedDate}&doctor=${selectedDoctor}`);
            if (response?.status == 200) {
                const fileUrl = response?.data?.data;
                if (fileUrl) {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.setAttribute('download', 'invoice_reports.pdf');
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
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
                } else {
                    toast.error("File URL not found");
                }
            } else {
                toast.error("Download Failed");
            }
        }
        catch (error) {
            toast.error("Download Error", {
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
    };

    const handleNextDate = () => {
        setSelectedDate((prevDate) =>
            dayjs(prevDate, "DD/MM/YYYY").add(1, "day").format("DD/MM/YYYY")
        );
    };

    const handlePrevDate = () => {
        setSelectedDate((prevDate) =>
            dayjs(prevDate, "DD/MM/YYYY").subtract(1, "day").format("DD/MM/YYYY")
        );
    };

    return (
        <>
            {isLoading ?
                <Loader />
                :
                <WraperLayout className="invoiceClinicMainTab bgMobile">
                    <img src={FilterIcon} alt='' className='filterIcon' />
                    <Row className=''>
                        <div className='col-lg-12'>
                            <div className='mobilebgColor'>
                                <div className={isOpen ? `top_wrap top_wrap_invoice wrapeOpened` : `top_wrap top_wrap_invoice`}>
                                    <Row className="align-items-center">
                                        <Col lg={3}>
                                            <div className="wraper_date">
                                                <div className="calenderIconWrape">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                        <path d="M5.57649 22.0047C5.0264 22.0047 4.5555 21.8088 4.16377 21.4171C3.77204 21.0254 3.57617 20.5544 3.57617 20.0044V6.00211C3.57617 5.45202 3.77204 4.98111 4.16377 4.58938C4.5555 4.19765 5.0264 4.00179 5.57649 4.00179H6.57665V2.00146H8.57698V4.00179H16.5783V2.00146H18.5786V4.00179H19.5787C20.1288 4.00179 20.5997 4.19765 20.9915 4.58938C21.3832 4.98111 21.5791 5.45202 21.5791 6.00211V20.0044C21.5791 20.5544 21.3832 21.0254 20.9915 21.4171C20.5997 21.8088 20.1288 22.0047 19.5787 22.0047H5.57649ZM5.57649 20.0044H19.5787V10.0027H5.57649V20.0044ZM5.57649 8.00243H19.5787V6.00211H5.57649V8.00243ZM12.5776 14.0034C12.2942 14.0034 12.0567 13.9075 11.865 13.7158C11.6733 13.5241 11.5775 13.2866 11.5775 13.0032C11.5775 12.7199 11.6733 12.4823 11.865 12.2906C12.0567 12.0989 12.2942 12.0031 12.5776 12.0031C12.861 12.0031 13.0985 12.0989 13.2902 12.2906C13.4819 12.4823 13.5778 12.7199 13.5778 13.0032C13.5778 13.2866 13.4819 13.5241 13.2902 13.7158C13.0985 13.9075 12.861 14.0034 12.5776 14.0034ZM8.57698 14.0034C8.2936 14.0034 8.05606 13.9075 7.86436 13.7158C7.67266 13.5241 7.57681 13.2866 7.57681 13.0032C7.57681 12.7199 7.67266 12.4823 7.86436 12.2906C8.05606 12.0989 8.2936 12.0031 8.57698 12.0031C8.86035 12.0031 9.09789 12.0989 9.28959 12.2906C9.48129 12.4823 9.57714 12.7199 9.57714 13.0032C9.57714 13.2866 9.48129 13.5241 9.28959 13.7158C9.09789 13.9075 8.86035 14.0034 8.57698 14.0034ZM16.5783 14.0034C16.2949 14.0034 16.0573 13.9075 15.8656 13.7158C15.6739 13.5241 15.5781 13.2866 15.5781 13.0032C15.5781 12.7199 15.6739 12.4823 15.8656 12.2906C16.0573 12.0989 16.2949 12.0031 16.5783 12.0031C16.8616 12.0031 17.0992 12.0989 17.2909 12.2906C17.4826 12.4823 17.5784 12.7199 17.5784 13.0032C17.5784 13.2866 17.4826 13.5241 17.2909 13.7158C17.0992 13.9075 16.8616 14.0034 16.5783 14.0034ZM12.5776 18.004C12.2942 18.004 12.0567 17.9082 11.865 17.7165C11.6733 17.5248 11.5775 17.2873 11.5775 17.0039C11.5775 16.7205 11.6733 16.483 11.865 16.2913C12.0567 16.0996 12.2942 16.0037 12.5776 16.0037C12.861 16.0037 13.0985 16.0996 13.2902 16.2913C13.4819 16.483 13.5778 16.7205 13.5778 17.0039C13.5778 17.2873 13.4819 17.5248 13.2902 17.7165C13.0985 17.9082 12.861 18.004 12.5776 18.004ZM8.57698 18.004C8.2936 18.004 8.05606 17.9082 7.86436 17.7165C7.67266 17.5248 7.57681 17.2873 7.57681 17.0039C7.57681 16.7205 7.67266 16.483 7.86436 16.2913C8.05606 16.0996 8.2936 16.0037 8.57698 16.0037C8.86035 16.0037 9.09789 16.0996 9.28959 16.2913C9.48129 16.483 9.57714 16.7205 9.57714 17.0039C9.57714 17.2873 9.48129 17.5248 9.28959 17.7165C9.09789 17.9082 8.86035 18.004 8.57698 18.004ZM16.5783 18.004C16.2949 18.004 16.0573 17.9082 15.8656 17.7165C15.6739 17.5248 15.5781 17.2873 15.5781 17.0039C15.5781 16.7205 15.6739 16.483 15.8656 16.2913C16.0573 16.0996 16.2949 16.0037 16.5783 16.0037C16.8616 16.0037 17.0992 16.0996 17.2909 16.2913C17.4826 16.483 17.5784 16.7205 17.5784 17.0039C17.5784 17.2873 17.4826 17.5248 17.2909 17.7165C17.0992 17.9082 16.8616 18.004 16.5783 18.004Z" fill={themeColor} />
                                                    </svg>
                                                    <DatePicker name='dob' onChange={handleDateChange} />
                                                </div>
                                                <a>
                                                    <span className='left_arrow' onClick={handlePrevDate}></span>
                                                </a>
                                                <a>
                                                    <span className='right_arrow' onClick={handleNextDate}></span>
                                                </a>
                                                <input type="text" value={selectedDate} disabled readOnly className='inputSelectedDate' />
                                            </div>
                                        </Col>
                                        <Col lg={2}>
                                            {/* <div className="filter-by-div">
                                        <Form.Select aria-label="Default select example" name='practiceCity' className='filter'  >
                                            <option value={1} > <span className='linkIcon'>  </span> All Doctors </option>
                                        </Form.Select>
                                    </div> */}
                                            {/* <CustomDropdown /> */}
                                            <div className="search customDropSelect">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                                    <path d="M13 0.25V1.5H14.25V5.25C14.25 5.91304 13.9866 6.54893 13.5178 7.01777C13.0489 7.48661 12.413 7.75 11.75 7.75C11.087 7.75 10.4511 7.48661 9.98224 7.01777C9.5134 6.54893 9.25001 5.91304 9.25001 5.25V1.5H10.5V0.25H8.00001V5.25C8.00154 6.13538 8.31602 6.9917 8.88787 7.66763C9.45972 8.34356 10.2521 8.79556 11.125 8.94375V12.75C11.125 13.7446 10.7299 14.6984 10.0267 15.4017C9.3234 16.1049 8.36957 16.5 7.37501 16.5C6.38044 16.5 5.42662 16.1049 4.72336 15.4017C4.02009 14.6984 3.62501 13.7446 3.62501 12.75V8.91119C4.21417 8.75907 4.72762 8.39729 5.06913 7.89368C5.41064 7.39007 5.55675 6.7792 5.48008 6.17556C5.40341 5.57193 5.10922 5.01698 4.65265 4.61474C4.19609 4.21249 3.60849 3.99057 3.00001 3.99057C2.39152 3.99057 1.80393 4.21249 1.34736 4.61474C0.890794 5.01698 0.596603 5.57193 0.519932 6.17556C0.44326 6.7792 0.589372 7.39007 0.93088 7.89368C1.27239 8.39729 1.78584 8.75907 2.37501 8.91119V12.75C2.37501 14.0761 2.90179 15.3479 3.83947 16.2855C4.77715 17.2232 6.04892 17.75 7.37501 17.75C8.70109 17.75 9.97286 17.2232 10.9105 16.2855C11.8482 15.3479 12.375 14.0761 12.375 12.75V8.94375C13.2479 8.79556 14.0403 8.34356 14.6121 7.66763C15.184 6.9917 15.4985 6.13538 15.5 5.25V0.25H13ZM1.75001 6.5C1.75001 6.25277 1.82332 6.0111 1.96067 5.80554C2.09802 5.59998 2.29324 5.43976 2.52165 5.34515C2.75006 5.25054 3.00139 5.22579 3.24387 5.27402C3.48635 5.32225 3.70907 5.4413 3.88389 5.61612C4.0587 5.79093 4.17776 6.01366 4.22599 6.25614C4.27422 6.49861 4.24946 6.74995 4.15486 6.97835C4.06025 7.20676 3.90003 7.40199 3.69447 7.53934C3.48891 7.67669 3.24723 7.75 3.00001 7.75C2.6686 7.74962 2.35088 7.6178 2.11654 7.38346C1.8822 7.14913 1.75039 6.8314 1.75001 6.5Z" fill={themeColor} />
                                                </svg>
                                                <Form.Select className='selectSty' name='doctor' onChange={handleChange} value={selectedDoctor} >
                                                    <option value=""> All Doctors</option>
                                                    {allDoctors.map((item) => {
                                                        return (<>
                                                            <option key={item?.id} value={item?.id}>{item?.name}</option>
                                                        </>)
                                                    })}
                                                </Form.Select>
                                            </div>
                                        </Col>
                                        {!isMobile && <Col lg={2}>
                                            <div className="filter-container">
                                                <div className="filter-btn" >
                                                    Filter by
                                                </div>
                                                <div className="selectCustom" ref={ref}>
                                                    <div className='custSeleccc' onClick={toggleMain}>
                                                        <span className="labelSelect" >Select</span>
                                                        <span className='arrowRighttt arrowRightttDown' />
                                                    </div>
                                                    {isOpen && (
                                                        <div className="customDrop" >
                                                            {Object.entries(filterOptions).map(([section, options]) => (
                                                                <div key={section} className='dropdownOpt'>
                                                                    <div className="section-title" onClick={() => toggleExpand(section)}>
                                                                        {section} <span>{expanded[section] ? <span className='arrowRighttt arrowRightttDown' /> : <span className='arrowRighttt' />}</span>
                                                                    </div>
                                                                    {expanded[section] && (
                                                                        <div className="checkbox-group">
                                                                            {options.map((item) => {
                                                                                const inputId = `${section}-${item}`;
                                                                                return (
                                                                                    <div className="singleTick customTickCheck" key={item}>
                                                                                        <label htmlFor={inputId}>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                id={inputId}
                                                                                                checked={selected[section]?.includes(item) || false}
                                                                                                onChange={() => handleCheckbox(section, item)}
                                                                                            />
                                                                                            <span></span>
                                                                                            {item}
                                                                                        </label>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <div className="clear-btn" onClick={clearAll}>
                                                                Clear all filters
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>}
                                        {!isMobile && (<><Col lg={3}>
                                            <div className="search__bar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="11.5" cy="10.5" r="6.5" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M16 16L20 20" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <input type="text" placeholder='Search by Name or Number' onChange={handleSearch} />
                                            </div>
                                        </Col>
                                            <Col lg={2} className='tw-flex tw-justify-end' style={{ paddingRight: "24px" }}>
                                                <button className="button1Down" onClick={downloadBtn} >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                                        <path d="M10.5 13.3333L6.33337 9.16665L7.50004 7.95831L9.66671 10.125V3.33331H11.3334V10.125L13.5 7.95831L14.6667 9.16665L10.5 13.3333ZM5.50004 16.6666C5.04171 16.6666 4.64935 16.5035 4.32296 16.1771C3.99657 15.8507 3.83337 15.4583 3.83337 15V12.5H5.50004V15H15.5V12.5H17.1667V15C17.1667 15.4583 17.0035 15.8507 16.6771 16.1771C16.3507 16.5035 15.9584 16.6666 15.5 16.6666H5.50004Z" fill={themeColor} />
                                                    </svg>
                                                    Download </button>
                                            </Col></>)}
                                        {isMobile &&
                                            <div className='mobTopSearchDownload'>
                                                <div className="search__bar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20 19L16.1396 15.1396M16.1396 15.1396C16.7999 14.4793 17.3237 13.6953 17.6811 12.8326C18.0385 11.9698 18.2224 11.0451 18.2224 10.1112C18.2224 9.17735 18.0385 8.25264 17.6811 7.38987C17.3237 6.5271 16.7999 5.74316 16.1396 5.08283C15.4793 4.42249 14.6953 3.89868 13.8326 3.54131C12.9698 3.18394 12.0451 3 11.1112 3C10.1774 3 9.25264 3.18394 8.38987 3.54131C7.5271 3.89868 6.74316 4.42249 6.08283 5.08283C4.74921 6.41644 4 8.2252 4 10.1112C4 11.9972 4.74921 13.806 6.08283 15.1396C7.41644 16.4732 9.2252 17.2224 11.1112 17.2224C12.9972 17.2224 14.806 16.4732 16.1396 15.1396Z" stroke="#313131" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <input type="text" placeholder='Search here' onChange={handleSearch} />
                                                </div>
                                                <button className="button1Down" onClick={downloadBtn} >
                                                    <span className='downloadIcon'>  </span>
                                                    Download </button>
                                            </div>
                                        }
                                    </Row>
                                    <div className="clinicHeads">
                                        <span>  Total Clinic Share <span className='priceTe'> Rs. {invoiceData?.total_clinic_share || 0} </span>  </span>
                                        |
                                        <span> Total Doctor Share <span className='priceTe'> Rs. {invoiceData?.total_doctor_share || 0} </span>  </span>
                                    </div>
                                </div>
                                <div className="clinicHeadsMobile">
                                    <div className="singleShae">
                                        <span>  Total Clinic Share </span>
                                        <span className='priceTe'> Rs. {invoiceData?.total_clinic_share || 0} </span>
                                    </div>
                                    <div className="singleShae">
                                        <span>  Total Doctor Share </span>
                                        <span className='priceTe'> Rs. {invoiceData?.total_doctor_share || 0} </span>
                                    </div>
                                </div>
                                {isMobile
                                    ?
                                    <div className="wrape_cards_mobile_listing">

                                        {filteredData?.map((item) => {
                                            return (<>
                                                <div className="single__card_mobile">
                                                    <div className='left'>
                                                        <p> {item?.date} </p>
                                                        <h5> {item?.doctor_name} </h5>
                                                        <h3> {item?.patient_name} </h3>
                                                        <span className='mr'> mr num static </span>
                                                    </div>
                                                    <div className='rightt'>
                                                        <span className="iconDot" onClick={() => { handleAddLabshow(item) }}></span>
                                                        <span className='priceCard'> Rs.{item?.amount_received} </span>
                                                        <span className="paymentMode"> {item?.paid_status}  </span>
                                                    </div>
                                                </div>
                                            </>)
                                        })}
                                    </div>
                                    :
                                    <div className="table__wrape ">
                                        <Table responsive className=''>
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th> MR No. </th>
                                                    <th>Date </th>
                                                    <th>Source</th>
                                                    <th>Name</th>
                                                    <th>Number</th>
                                                    <th>Payment Mode</th>
                                                    <th>Doctor </th>
                                                    <th>Total Amount</th>
                                                    <th>Invoice Item</th>
                                                    <th>Discount</th>
                                                    <th>Amount Receive</th>
                                                    <th>Status</th>
                                                    <th>Remaining Balance </th>
                                                </tr>
                                            </thead>
                                            {filteredData.length > 0 && filteredData?.map((item, idx) => {
                                                return (<>
                                                    <tr>
                                                        <td
                                                        >
                                                            {(idx == indexx && collapse) ?
                                                                <span className='plusIcon' onClick={() => handleCloseRow(item, idx)}>  - </span>
                                                                :
                                                                <span className='plusIcon' onClick={() => handleRow(item, idx)}> + </span>
                                                            }
                                                        </td>
                                                        <td>  {item?.mr_nos} </td>
                                                        <td> {item?.date} </td>
                                                        <td> {item?.source} </td>
                                                        <td>
                                                            {item?.patient_name}
                                                            {(idx === indexx && collapse) && (
                                                                <div className="showMore tw-flex tw-flex-col tw-pb-1 tw-pt-1">
                                                                    {item?.invoice_item?.map((item, idx) => (
                                                                        <span key={idx}> {item?.item_name} </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td> {item?.patient_number} </td>
                                                        <td> {item?.payment_mode} </td>
                                                        <td> {item?.doctor_name} </td>
                                                        <td className={idx === indexx && collapse ? 'tw-pt-4' : ""}>
                                                            PKR {item?.total_amount}
                                                            {(idx === indexx && collapse) && (
                                                                <div className="showMore tw-flex tw-flex-col tw-pb-1 tw-pt-1">
                                                                    {item?.invoice_item?.map((item, idx) => (
                                                                        <span key={idx}> PKR {item?.item_amount} </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td> {item?.invoice_item_count} </td>
                                                        <td>
                                                            {item?.discount}
                                                            {(idx === indexx && collapse) && (
                                                                <div className="showMore tw-flex tw-flex-col tw-pb-1 tw-pt-1">
                                                                    {item?.invoice_item?.map((item, idx) => (
                                                                        <span key={idx}> {item?.item_discount}% </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td> Rs.{item?.amount_received} </td>
                                                        <td>{item?.paid_status} </td>
                                                        <td>Rs.{item?.remaining_amount} </td>
                                                    </tr>
                                                </>)
                                            })}
                                            <tbody>
                                            </tbody>
                                        </Table>
                                    </div>}
                                <div className='paginationAll'>
                                    {totalPages > 1 ? (
                                        <>
                                            <div className='countPagination'>
                                                {paginateCountData?.from} - {paginateCountData?.to} of {paginateCountData?.total}
                                                {paginateCountData?.total}
                                            </div>
                                            <ReactPaginate
                                                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                                                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                                                breakLabel={null}
                                                pageCount={totalPages}
                                                pageRangeDisplayed={0}
                                                marginPagesDisplayed={0}
                                                onPageChange={handlePageClick}
                                                containerClassName="pagination_hk"
                                                previousClassName="prev_item"
                                                nextClassName="next_item"
                                                previousLinkClassName="previousLink"
                                                nextLinkClassName="medical_next_link"
                                                forcePage={currentPage - 1}
                                                renderOnZeroPageCount={null}
                                            />
                                        </>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </Row>
                    <MobileFilterInvoiceModal status={status} setStatus={setStatus} selectedDate={selectedDate} setSelectedDate={setSelectedDate} handleFilterClose={handleFilterClose} filterShow={filterShow} />
                    <ViewOnlineInvoiceModal addLabshow={addLabshow} viewItem={viewItem} handleAddLabClose={handleAddLabClose} />
                </WraperLayout>
            }
        </>
    )
}

export default InvoiceClinicTab;

