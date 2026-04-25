import { DatePicker, Divider } from 'antd'
import './smsLogTab.scss'
import { Col, Form, Row, Table } from 'react-bootstrap'
import PaginatedDatatable from '../../../../datatablePagination/DatatablePagination'
import { isMobile } from 'react-device-detect'
import { useEffect, useState } from 'react'
import API from '../../../../../services/httpInstance'
import dayjs from 'dayjs'
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from 'react-toastify'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

dayjs.extend(customParseFormat);

const SmsLogTab = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [smsLogData, setSmsLogData] = useState([]);
    const [templateFor, setTemplateFor] = useState([]);
    const [templateType, setTemplateType] = useState([]);
    const [selectedTemplateFor, setSelectedTemplateFor] = useState("")
    const [selectedTemplateType, setSelectedTemplateType] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [singleEditItem, setSingleEditItem] = useState({})
    const [filteredData, setFilteredData] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

    useEffect(() => {
        getTemplateType()
        getTemplateFor()
    }, []);

    useEffect(() => {
        getSmsLogs();
    }, [selectedDate, selectedTemplateFor, selectedTemplateType])

    const getSmsLogs = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedTemplateFor) queryParams.append("templateFor", selectedTemplateFor);
            if (selectedTemplateType) queryParams.append("templateType", selectedTemplateType);
            if (selectedDate) {
                queryParams.append("startDate", selectedDate);
            }
            const queryString = decodeURIComponent(queryParams.toString());
            const url = queryString ? `/get-sms-logs?${queryString}` : `/get-sms-logs`;
            const response = await API.get(url);
            if (response?.status === 200 && response?.data?.data) {
                setSmsLogData(response.data.data);
                setFilteredData(response.data.data?.logsData);
            } else {
                console.warn("Unexpected API response:", response);
            }

        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getTemplateType = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-sms-template-type`);
            if (response?.status == 200) {
                setTemplateType(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...filteredData]?.sort((a, b) => {
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

    const getTemplateFor = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-sms-template-for`);
            if (response?.status == 200) {
                setTemplateFor(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleDateChange = async (date, dateString) => {
        let formatedDate = date.format("YYYY-MM-DD")
        setSelectedDate(formatedDate)
        let datee = dayjs().format("YYYY-MM-DD");
        setSelectedDate(date.format("YYYY-MM-DD") || datee);
        if (date) {
            try {
                const response = await API.get(`/get-sms-logs`, {
                    params: {
                        startDate: formatedDate,
                    }
                });
                if (response?.status == 200) {
                    setSmsLogData(response?.data?.data);
                    setIsLoading(false);
                }
                else {
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
                console.log("error in api", error)
            }
        }
    }

    const handleChange = (e) => {
        const { value, checked, name } = e.target;

        if (name == "selectTemplateFor") {
            setSelectedTemplateFor(value)
        }

        if (name == "selectTemplateType") {
            setSelectedTemplateType(value)
        }
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        let examData = [...smsLogData?.logsData];
        if (value !== "") {
            let lower = value.toLowerCase();
            let trimed = lower.replace(/\s/g, '');
            examData = examData.filter((item) => {
                return item?.number.toLowerCase().replace(/\s/g, '').includes(trimed);
            })
        }
        else {
            examData = [...smsLogData?.logsData];
        }
        setFilteredData(examData);
    }

    const handleExport = () => {
        if (!filteredData || filteredData.length === 0) {
            toast.error("No data available to export!");
            return;
        }

        const headers = ["Date Sent", "Time", "Number", "Template For", "Template Type", "Template"];

        const tableData = filteredData.map(item => [
            item?.date_sent || "",
            item?.time || "",
            item?.number || "",
            item?.template_for || "",
            item?.template_type || "",
            item?.template || ""
        ]);

        const ws = XLSX.utils.aoa_to_sheet([headers, ...tableData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SMS_Log");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "SMS_Log.xlsx");
    };


    return (
        <div className='smsLogWrapper'>
            <div className="dates_wrapers">
                <Row className="gx-0 p-0 h-100 align-items-center">
                    <Col lg={6}>
                        <Row className='p-0'>
                            <Col lg={4}>
                                <div className="wraper_date">
                                    <span className='left_arrow'></span>
                                    <DatePicker
                                        onChange={handleDateChange}
                                    />
                                    <span className='right_arrow'></span>
                                </div>
                            </Col>
                            {!isMobile && (<><Col lg={4}>
                                <Form.Select aria-label="Default select example" name='selectTemplateFor' value={selectedTemplateFor} onChange={handleChange} className='selectSty'  >
                                    <option value=""> Select Template For </option>
                                    {templateFor?.map((item, index) => {
                                        return (<>
                                            <option value={item?.value}>{item?.key}</option>
                                        </>)
                                    })}
                                </Form.Select>
                            </Col>
                                <Col lg={4}>
                                    <Form.Select aria-label="Default select example" name='selectTemplateType' value={selectedTemplateType} onChange={handleChange} className='selectSty' >
                                        <option value=""> Select Template Type  </option>
                                        {templateType?.map((item, index) => {
                                            return (<>
                                                <option value={`${item}_${index}`}>{item}</option>
                                            </>)
                                        })}
                                    </Form.Select>
                                </Col></>)}
                        </Row>
                    </Col>
                    <Col lg={1}></Col>
                    <Col lg={5} className=''>
                        <Row className='wraperMobile gx-0 p-0 h-100 w-100 d-md-flex align-self-end justify-content-end'>
                            <Col lg={7}>
                                <div className="search__bar" >
                                    <span className='search_icon'>  </span>
                                    <input type="text" placeholder='Search by number' onChange={handleSearch} />
                                </div>
                            </Col>
                            <Col lg={2}>
                                <button className='exportBtnn hovering_btn' onClick={handleExport}>
                                    Export
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            {!isMobile && <Divider />}
            <div className="balanceWraper">
                <h3> Bucket Balance: <span> {smsLogData?.bucketBalance} </span></h3>
                <h3> Remaining Balance: <span>{smsLogData?.remainingSms} </span> </h3>
            </div>
            {isMobile ?
                <div className="wraperCardsSms">
                    <div className="cardSmsSingle">
                        <h5>Patient </h5>
                        <p> 18/10/2024 I 11:00 AM </p>
                        <span> 0345 2356789 </span>
                        <h4> custom_expire_clinic_sms </h4>
                        <h3> Your Appt with </h3>
                    </div>
                </div>
                :
                <div className="table__wrape">
                    <Table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("date_sent")} style={{ width: "7%" }} >
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Date Sent
                                        <span>
                                            {getSortIcon("date_sent")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("time")} style={{ width: "7%" }}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Time
                                        <span>
                                            {getSortIcon("time")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("number")} style={{ width: "7%" }}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Number
                                        <span>
                                            {getSortIcon("number")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("template_for")} style={{ width: "7%" }}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Template for
                                        <span>
                                            {getSortIcon("template_for")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("template_type")} style={{ width: "10%" }}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Template Type
                                        <span>
                                            {getSortIcon("template_type")}
                                        </span>
                                    </div>
                                </th>
                                <th onClick={() => handleSort("template")} style={{ width: "25%" }}>
                                    <div className='tw-flex tw-items-center tw-gap-4'>
                                        Template
                                        <span>
                                            {getSortIcon("template")}
                                        </span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData?.map((item) => {
                                return (<>
                                    <tr>
                                        <td> {item?.date_sent}</td>
                                        <td> {item?.time} </td>
                                        <td> {item?.number?.slice(0, 4)} {item?.number?.slice(4)}</td>
                                        <td> {item?.template_for}</td>
                                        <td> {item?.template_type}</td>
                                        <td> {item?.template} </td>
                                    </tr>
                                </>)
                            })}
                        </tbody>
                    </Table>
                </div>
            }
            <div className="editIconFilterMobile">
            </div>
        </div>
    )
}

export default SmsLogTab;
