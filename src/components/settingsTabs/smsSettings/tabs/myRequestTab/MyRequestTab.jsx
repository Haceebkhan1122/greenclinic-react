import { DatePicker, Divider } from 'antd'
import { Col, Form, Row, Modal, Table } from 'react-bootstrap'
import ReqUpgradeModal from '../../../../modal/reqUpgradeModal/ReqUpgradeModal'
import { useEffect, useState } from 'react'
import PaginatedDatatable from '../../../../datatablePagination/DatatablePagination'
import { isMobile } from 'react-device-detect'
import dayjs from 'dayjs'
import API from '../../../../../services/httpInstance'
import './myRequestTab.scss'
import DeleteMyRequestModal from '../../../../modal/deleteMyRequestModal/DeleteMyRequestModal'
import ViewReqUpgradeModal from '../../../../modal/viewReqUpgradeModal/ViewReqUpgradeModal'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify'

const MyRequestTab = () => {

    const [showUpgrade, setShowUpgrade] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestData, setRequestData] = useState([]);
    const [templateFor, setTemplateFor] = useState([]);
    const [templateType, setTemplateType] = useState([]);
    const [selectedTemplateFor, setSelectedTemplateFor] = useState("")
    const [selectedTemplateType, setSelectedTemplateType] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [singleEditItem, setSingleEditItem] = useState({})
    const [filePath, setFilePath] = useState("")
    const [status, setStatus] = useState(null)
    const [showViewUpgrade, setShowViewUpgrade] = useState(false)
    const [viewSingleItem, setViewSingleItem] = useState("")
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

    

    const handleExport = () => {
        if (!sortedData || sortedData.length === 0) {
            toast.error ("No data available to export!");
            return;
        }
    
        const tableData = [
            ["Date", "Time", "Status", "Plan"], 
            ...sortedData.map(item => [item?.date, item?.time, item?.status, item?.plan])
        ];
    
        const ws = XLSX.utils.aoa_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "Exported_Data.xlsx");
    };

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...requestData]?.sort((a, b) => {
        if (!sortConfig.key) return 0; 
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? <span className='arrowUpSort'></span> : <span className='arrowDownSort'></span>;
        }
        return <span className='arrowDownSort'></span>;
    };


    const handleViewCloseUpgrade = () => {
        setShowViewUpgrade(false);
    }

    const handleViewShowUpgrade = (item) => {
        setViewSingleItem(item)
        setShowViewUpgrade(true);
    }

    const handleCloseUpgrade = () => setShowUpgrade(false);
    const handleShowUpgrade = () => setShowUpgrade(true);

    const [deleteRequest, setDeleteRequest] = useState(false);
    const handleCloseRequest = () => setDeleteRequest(false);
    const handleShowRequest = () => setDeleteRequest(true);

    useEffect(() => {
        getRequestLogs();
    }, [selectedDate, status ]);

    const getRequestLogs = async () => {
            try {
                setIsLoading(true);
                const queryParams = new URLSearchParams();
                if (status) queryParams.append("status", status);
                if (selectedDate) {
                    queryParams.append("startDate", selectedDate);
                }
                const queryString = decodeURIComponent(queryParams.toString());
                const url = queryString ? `/listing-requested-plans?${queryString}` : `/listing-requested-plans`;
                const response = await API.get(url);
                if (response?.status === 200 && response?.data?.data) {
                    setRequestData(response.data.data?.data);
                } else {
                    console.warn("Unexpected API response:", response);
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setIsLoading(false);
            }
        };

    const handleDateChange = async (date, dateString) => {
        if(date) {
            let formattedDate = dayjs(date).format("DD/MM/YYYY");
            setSelectedDate(formattedDate)
        }
    }



    const handleChange = (e) => {
        const { value, checked, name } = e.target;

        if(name == "selectstatus") {
            setStatus(value);
        }
    }

    const handleShowDelete = (item) => {
        setSingleEditItem(item?.id);
        setDeleteRequest(true)   
    }

    const handleView = (item) => {
        setFilePath(item?.file_path)
    }

    return (
        <div className='myRequsetWrapper'>
            <div className="dates_wrapers">
                <Row className="gx-0 p-0 h-100 align-items-center">
                    <Col lg={6}>
                        <Row className='p-0'>
                            <Col lg={4}>
                                <div className="wraper_date">
                                    <span className='left_arrow'></span>
                                    <DatePicker 
                                        onChange={handleDateChange}
                                        defaultValue={dayjs()}
                                        format="YYYY-MM-DD"
                                    />
                                    <span className='right_arrow'></span>
                                </div>
                            </Col>
                            {!isMobile && (<><Col lg={4}>
                                <Form.Select aria-label="Default select example" name='selectstatus' value={status} onChange={handleChange} className='selectSty'  >
                                    <option value={""} >Select Status </option>
                                    <option value={0} >Pending Approval </option>
                                    <option value={1} >Active </option>
                                    <option value={2} >Rejected </option>
                                </Form.Select>
                            </Col></>)}
                        </Row>
                    </Col>
                    <Col lg={1}></Col>
                    <Col lg={5} className=''>
                        <div className='wraperBtnn'>
                            <button className='reqBtnRe hovering_btn' onClick={handleShowUpgrade}>
                                Request Upgrade
                            </button>
                            <button className='exportBtnn' onClick={handleExport}>
                                Export
                            </button>
                        </div>
                    </Col>
                </Row>
            </div>
            {!isMobile && <Divider />}
            <div className="balanceWraper">
                <h3> Bucket Balance: <span> 300 </span></h3>
                <h3> Remaining Balance: <span> 260 </span> </h3>
            </div>
            {isMobile ?
                <div className="wraperCardsSms">
                    <div className="cardSmsSingle">
                        <h5>Patient </h5>
                        <p> 18/10/2024 I 11:00 AM </p>
                        <div className='wrapeActionMyReq'>
                            <span> Payment Pending  </span>
                            <div className="ico">
                                <span className="editIco"></span>
                                <span className="deleteIco" ></span>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="table__wrape">
                    <Table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("date")}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Date Sent
                                        <span>
                                            {getSortIcon("date")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("time")}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Time
                                        <span>
                                            {getSortIcon("time")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("status")}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Request Status
                                        <span>
                                            {getSortIcon("status")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("plan")}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Request Plan
                                        <span>
                                            {getSortIcon("plan")}
                                        </span>
                                    </div>
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData?.map((item) => {
                                return (<>
                                    <tr>
                                        <td> {item?.date}</td>
                                        <td> {item?.time} </td>
                                        <td> {item?.status}</td>
                                        <td> {item?.plan}</td>
                                        <td> 
                                            <div className='wrapeActionMyReq'>
                                                <span className="deleteIco" onClick={()=> {handleShowDelete(item)}}></span>
                                                <span className="viewIco" onClick={()=> {handleViewShowUpgrade(item)}}></span>
                                            </div>
                                        </td>
                                    </tr>
                                </>)
                            })}
                        </tbody>
                    </Table>
                </div>
            }
            <ReqUpgradeModal showUpgrade={showUpgrade} handleCloseUpgrade={handleCloseUpgrade} />
            <DeleteMyRequestModal handleCloseRequest={handleCloseRequest} singleEditItem={singleEditItem} deleteRequest={deleteRequest} getRequestLogs={getRequestLogs} /> 
            <ViewReqUpgradeModal showViewUpgrade={showViewUpgrade} handleViewCloseUpgrade={handleViewCloseUpgrade} viewSingleItem={viewSingleItem}  />
            <div className="bottomBarBtnMobile">
                <button> REQUEST UPGRADE </button>
            </div>
            
        </div>
    )
}

export default MyRequestTab;
