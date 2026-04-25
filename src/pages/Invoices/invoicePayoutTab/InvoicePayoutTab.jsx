import { DatePicker } from 'antd';
import { Col, Form, Row, Table } from 'react-bootstrap';
import Search from "../../../assets/images/svg/search.svg"
import WraperLayout from '../../../components/wraperLayout/WraperLayout';
import { customers } from '../../../services/data';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import './invoicePayoutTab.scss';
import InvoicePayoutDetailsModal from '../../../components/modal/invoicePayoutDetailsModal/InvoicePayoutDetailsModal';
import { useSelector } from 'react-redux';
import API from '../../../services/httpInstance';
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loader from '../../../components/loader/Loader';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/fontawesome-free-solid';
import { isMobile } from 'react-device-detect';
import ViewpayoutInvoiceModal from '../../../components/modal/viewpayoutInvoiceModal/ViewpayoutInvoiceModal';

const InvoicePayoutTab = () => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [selectedDate, setSelectedDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [invoicePayoutShow, setInvoicePayoutShow] = useState(false);
    const [payoutData, setPayoutData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [singleEditItem, setSingleEditItem] = useState({})
    const [receiptData, setReceiptData] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState("1");
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [addLabshow, setAddLabshow] = useState(false);
    const [viewItem, setViewItem] = useState(false);

    const handleAddLabClose = () => setAddLabshow(false);
    const handleAddLabshow = (item) => {
        setViewItem(item);
        setAddLabshow(true);
    }

    let userId = useSelector((state) => state.user.user.id);

    const handleClosePayout = () => setInvoicePayoutShow(false);

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

    useEffect(() => {
        if (currentPage !== 1) {
            getPayouts(currentPage);
        }
    }, [currentPage]);

    const getPayouts = async (pageNumber) => {
        try {
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                queryParams.append("start_date", selectedDate);
            }
            if (userId) {
                queryParams.append("doctor_id", userId);
            }
            queryParams.append("page", pageNumber)
            const queryString = decodeURIComponent(queryParams.toString());
            const url = queryString ? `/reports/payouts?${queryString}` : `/reports/payouts?doctor_id=${userId}`;
            setIsLoading(true);
            const response = await API.get(url);
            if (response?.status === 200 && response?.data?.data) {
                const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
                setTotalPages(calculatedTotalPages);
                setPayoutData(response.data?.data);
                setFilteredData(response.data.data?.data);
                setPaginateCountData(response?.data?.data?.pagination)
                setIsLoading(false);
            } else {
                console.warn("Unexpected API response:", response);
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

    useEffect(() => {
        getPayouts(currentPage);
    }, [currentPage, selectedDate]);

    const getPayoutDetails = async (item) => {
        try {
            setIsLoading(true)
            const response = await API.get(`/reports/payouts-details?id=${item?.id}&type=${item?.type}&doctor_id=${userId}`)
            if (response?.status == 200) {
                setReceiptData(() => ({
                    id: item?.id,
                    response: response?.data?.data,
                    date: item?.transaction_date,
                    transactionId: item?.transaction_id,
                    type: item?.type,
                }));
                setIsLoading(false)
            }
            else {
                setIsLoading(false);
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.log("error", error)
            setIsLoading(false)
        }
    }

    const viewReceiptFn = async (item) => {
        setInvoicePayoutShow(true);
        getPayoutDetails(item);
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        let examData = [...payoutData?.data];
        if (value !== "") {
            let lower = value.toLowerCase();
            let trimed = lower.replace(/\s/g, '');
            examData = examData.filter((item) => {
                return item?.transaction_date.includes(trimed);
            })
        }
        else {
            examData = [...payoutData];
        }
        setFilteredData(examData);
    }

    return (
        <>
            {isLoading ?
                <Loader />
                :
                <WraperLayout className="invoiceClinicMainTab bgMobile">
                    <Row className=''>
                        <div className='col-lg-12'>
                            <div className='mobilebgColor'>
                                <div className="top_wrap top_wrap_invoice">
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
                                                    <span className='left_arrow'></span>
                                                </a>
                                                <a>
                                                    <span className='right_arrow'></span>
                                                </a>
                                                {/* <DatePicker name='dob' /> */}
                                                <input type="text" value={selectedDate} disabled readOnly className='inputSelectedDate' />
                                            </div>
                                        </Col>
                                        <Col lg={3}>
                                            <div className="search__bar">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <circle cx="11.5" cy="10.5" r="6.5" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M16 16L20 20" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <input type="text" placeholder='Search' onChange={handleSearch} />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                {isMobile
                                    ?
                                    <div className="wrape_cards_mobile_listing">
                                        {filteredData?.map((item) => {
                                            return (<>
                                                <div className="single__card_mobile" onClick={() => { handleAddLabshow(item) }}>
                                                    <div className='left'>
                                                        <p > ID {item?.transaction_id} </p>
                                                        <h5> {item?.transaction_date} </h5>
                                                    </div>
                                                    <div className='rightt'>
                                                        <span className='priceCard'> Rs.{item?.amount}  </span>
                                                        <span className="iconDotArrow"></span>
                                                    </div>
                                                </div>
                                            </>)
                                        })}
                                    </div> :
                                    <div className="table__wrape ">
                                        <Table responsive className=''>
                                            <thead>
                                                <tr>
                                                    <th> Date of Transaction </th>
                                                    <th>Amount </th>
                                                    <th>Transaction ID</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            {filteredData?.length > 0 && filteredData?.map((item, idx) => {
                                                return (<>
                                                    <tr>
                                                        <td> {item?.transaction_date} </td>
                                                        <td> {item?.amount}  </td>
                                                        <td> {item?.transaction_id} </td>
                                                        <td> <button className="viewReceiptBtn" onClick={() => viewReceiptFn(item)}> View Receipt </button> </td>
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
                    <InvoicePayoutDetailsModal userId={userId} receiptData={receiptData} singleEditItem={singleEditItem} setIsLoading={setIsLoading} isLoading={isLoading} handleClosePayout={handleClosePayout} currentPage={currentPage} invoicePayoutShow={invoicePayoutShow} />
                    <ViewpayoutInvoiceModal addLabshow={addLabshow} viewItem={viewItem} handleAddLabClose={handleAddLabClose} />
                </WraperLayout>
            }
        </>
    )
}

export default InvoicePayoutTab;
