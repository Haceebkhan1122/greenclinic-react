import { DatePicker, Divider } from 'antd';
import { Col, Form, Row, Table } from 'react-bootstrap';
import Search from "../../../assets/images/svg/search.svg"
import WraperLayout from '../../../components/wraperLayout/WraperLayout';
import './invoiceOnlineTab.scss';
import { customers } from '../../../services/data';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import DeleteOnlineInvoiceModal from '../../../components/modal/deleteOnlineInvoiceModal/DeleteOnlineInvoiceModal';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import Loader from '../../../components/loader/Loader';
import { isMobile } from 'react-device-detect';
import MobileFilterInvoiceOnlineTabModal from '../../../components/modal/mobileFilterInvoiceOnlineTabModal /MobileFilterInvoiceOnlineTabModal';
import { useNavigate } from 'react-router-dom';
import ViewOnlineInvoiceModal from '../../../components/modal/viewOnlineInvoiceModal/ViewOnlineInvoiceModal';
import { useSelector } from 'react-redux';
import CustomDropdown from '../../../components/customDropdown';
import { useClickAway } from '@uidotdev/usehooks';

const InvoiceOnlineTab = () => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [onlineInvoiceData, setOnlineInvoiceData] = useState([])
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
    const [deleteLabshow, setDeleteLabshow] = useState(false);
    const [singleEditItem, setSingleEditItem] = useState({})
    const [filterShow, setFilterShow] = useState(false);
    const [status, setStatus] = useState("")
    const [addLabshow, setAddLabshow] = useState(false);
    const [viewItem, setViewItem] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [selected, setSelected] = useState({});
    const [shouldSkipApi, setShouldSkipApi] = useState(false);

    const handleAddLabClose = () => setAddLabshow(false);
    const handleAddLabshow = (item) => {
        setViewItem(item);
        setAddLabshow(true);
    }

    const ref = useClickAway(() => {
            setIsOpen(false);
        });


        
    const toggleMain = () => setIsOpen(!isOpen);

    const toggleExpand = (section) => {
        setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
    };


    const filterOptions = {
        Source: ["Physical", "Online"],
        "Payment Mode": ["Cash", "Card", "Bank Transfer"],
        Status: ["Paid", "Unpaid"],
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


    const handleFilterClose = () => setFilterShow(false);
    const handleFilterShow = () => setFilterShow(true);


    const handleDeleteLabshow = (item) => {
        setSingleEditItem(item);
        setDeleteLabshow(true);
    }

    const handleDeleteLabClose = () => setDeleteLabshow(false);

    const handlePageClick = (data) => {
        const selectedPage = data.selected + 1;
        setCurrentPage(selectedPage);
    };

    useEffect(() => {
        getDoctors();
    }, []);

    useEffect(() => {
        getOnlineInvoices(currentPage);
    }, [currentPage, selectedDoctor, selectedDate, status, selected]);


    const getOnlineInvoices = async (pageNumber) => {
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
            if (status) {
                queryParams.append("status", status);
            }
            Object.entries(selected).forEach(([section, values]) => {
                values.forEach(value => {
                    queryParams.append(section, value);
                });
            });
            queryParams.append("page", pageNumber)
            const queryString = decodeURIComponent(queryParams.toString());
            const url = queryString ? `/reports/billing-filter-online?${queryString}` : `/reports/billing-filter-online`;
            setIsLoading(true);
            const response = await API.get(url);
            if (response?.status === 200 && response?.data?.data) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.billing_data?.pagination?.total / response?.data?.data?.billing_data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setOnlineInvoiceData(response.data.data);
                setFilteredData(response.data.data?.billing_data?.invoices);
                setPaginateCountData(response?.data?.data?.billing_data?.pagination)
                setIsLoading(false);
            } else {
                console.warn("Unexpected API response:", response);
                setOnlineInvoiceData([]);
                setIsLoading(false);
                setFilteredData([])
            }
        } catch (error) {
            console.error("Error fetching reports:", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

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

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "selectDoctor") {
            setSelectedDoctor(value);
        }
    }

    const handleDateChange = (date) => {
        if (date) {
            let formattedDate = dayjs(date).format("DD/MM/YYYY");
            setSelectedDate(formattedDate);
        } else {
            setSelectedDate(null);
        }
    };

    useEffect(() => {
        if (currentPage !== 1) {
            getOnlineInvoices(currentPage);
        }
    }, [currentPage]);

    const handleSearch = (e) => {
        const { value } = e.target;
        let examData = [...onlineInvoiceData?.billing_data?.invoices];
        if (value !== "") {
            let lower = value.toLowerCase();
            let trimed = lower.replace(/\s/g, '');
            examData = examData.filter((item) => {
                return item?.patient_name.toLowerCase().replace(/\s/g, '').includes(trimed) || item?.patient_number.includes(value);
            })
        }
        else {
            examData = [...onlineInvoiceData?.billing_data?.invoices];
        }
        setFilteredData(examData);
    }

    const downloadBtn = async (item) => {
        try {
            const response = await API.get(`/download-invoice-print/${item?.id}`);
            if (response?.status === 200) {
                const fileUrl = response?.data?.data?.url;
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
                    toast.error(response?.data?.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    throw new Error("File URL not found");
                }
            } else {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                throw new Error("Download Failed");
                
            }
        } catch (error) {
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

    const handlePrint = (item) => {
        downloadBtn(item)
    }

    const navigate = useNavigate();

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
                <WraperLayout className="invoiceOnlineData bgMobile">
                    <div className="wrapePrint" onClick={handleFilterShow}><div className="printIcoBtn"></div></div>
                    <Row className=''>
                        <div className='col-lg-12'>
                            <div className='mobilebgColor'>

                                <div className={isOpen ? "top_wrap top_wrap_invoice top_wrap_invoice_online wrapeOpened" : "top_wrap top_wrap_invoice top_wrap_invoice_online"}>
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
                                                {/* <DatePicker name='dob' /> */}
                                                <input type="text" value={selectedDate} disabled readOnly className='inputSelectedDate' />
                                            </div>
                                        </Col>
                                        <Col lg={2}>
                                            <CustomDropdown />
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
                                        <Col lg={3}>
                                            <div className="search__bar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="11.5" cy="10.5" r="6.5" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M16 16L20 20" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <input type="text" placeholder='Search by Name or Number' onChange={handleSearch} />
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="clinicHeads">
                                        <span>  Total Earning <span className='priceTe'> Rs.{onlineInvoiceData?.total || 0} </span>  </span>
                                        |
                                        <span> Video Calls <span className='priceTe'> Rs. {onlineInvoiceData?.total_video_call || 0} </span>  </span>
                                        |
                                        <span> In-Person Appointment <span className='priceTe'> Rs. {onlineInvoiceData?.total_in_person || 0} </span>  </span>
                                    </div>
                                </div>
                                <div className="clinicHeadsMobile">
                                    <div className="singleShae">
                                        <span>  Total Clinic Share </span>
                                        <span className='priceTe'> Rs. </span>
                                    </div>
                                    <div className="singleShae">
                                        <span>  Total Doctor Share </span>
                                        <span className='priceTe'> Rs.as </span>
                                    </div>
                                    <Divider />
                                    <div className="singleShae">
                                        <span>  Video Calls </span>
                                        <span className='priceTe'> Rs.{onlineInvoiceData?.total_video_call} </span>
                                    </div>
                                    <div className="singleShae">
                                        <span>  In-Person Appointment </span>
                                        <span className='priceTe'> Rs.{onlineInvoiceData?.total_in_person} </span>
                                    </div>
                                    <div className="singleShae">
                                        <span>  Total Earning </span>
                                        <span className='priceTe'> Rs.{onlineInvoiceData?.total} </span>
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
                                                        <span className='mr'> {item?.mr_nos} </span>
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
                                    <div className="table__wrape table__wrapeInn">
                                        <Table responsive className=''>
                                            <thead>
                                                <tr>
                                                    <th> MR No. </th>
                                                    <th>Consultation Type </th>
                                                    <th>Patient Name</th>
                                                    <th>Time</th>
                                                    <th>Date</th>
                                                    <th>Number</th>
                                                    <th>Doctor</th>
                                                    <th>Location </th>
                                                    <th>Total Amount</th>
                                                    <th>Payment Type</th>
                                                    <th>Discount</th>
                                                    <th>Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.length > 0
                                                    ?
                                                    filteredData?.map((item, idx) => {
                                                        return (<>
                                                            <tr>
                                                                <td> {item?.mr_nos} </td>
                                                                <td> {item?.consultation_type} </td>
                                                                <td> {item?.patient_name} </td>
                                                                <td> {item?.time || "-"} </td>
                                                                <td> {item?.date || "-"} </td>
                                                                <td> {item?.patient_number} </td>
                                                                <td> {item?.doctor_name} </td>
                                                                <td> {item?.location} </td>
                                                                <td> Rs.{item?.total_amount} </td>
                                                                <td> {item?.payment_mode} </td>
                                                                <td> {item?.discount} </td>
                                                                <td>
                                                                    <div className="icoInvoice">
                                                                        <span className="deleteIco" onClick={() => handleDeleteLabshow(item)} ></span>
                                                                        <span className="printIco" onClick={() => handlePrint(item)} ></span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>)
                                                    })
                                                    :
                                                    <tr>
                                                        <td colSpan="12" className="text-center">No data available</td>
                                                    </tr>
                                                }
                                            </tbody>
                                        </Table>
                                    </div>}
                            </div>
                        </div>
                    </Row>
                    <DeleteOnlineInvoiceModal deleteLabshow={deleteLabshow} handleDeleteLabClose={handleDeleteLabClose} currentPage={currentPage} getOnlineInvoices={getOnlineInvoices} singleEditItem={singleEditItem} />
                    <MobileFilterInvoiceOnlineTabModal status={status} setStatus={setStatus} selectedDate={selectedDate} setSelectedDate={setSelectedDate} handleFilterClose={handleFilterClose} filterShow={filterShow} />
                    <ViewOnlineInvoiceModal currentPage={currentPage} getOnlineInvoices={getOnlineInvoices} handleDeleteLabshow={handleDeleteLabshow} addLabshow={addLabshow} viewItem={viewItem} handleAddLabClose={handleAddLabClose} />
                </WraperLayout>
            }
        </>
    )
}

export default InvoiceOnlineTab;
