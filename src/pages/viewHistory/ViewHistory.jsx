import React, { useEffect, useState } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import { Row, Col, } from "react-bootstrap"
import Search from "../../assets/images/svg/search.svg"
import { DatePicker } from 'antd';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import dayjs from 'dayjs';
import moment from 'moment/moment';
import API from '../../services/httpInstance';
import "./viewHistory.scss"
import { useLocation, useParams } from "react-router-dom";

const ViewHistory = () => {
    const { id } = useParams()
    const location = useLocation();
    const vitals = location.state?.vitals;

    const [isDate, setIsDate] = useState(moment().format(null))
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [isVital, setIsVital] = useState([])
    const [filteredAllVital, setFilteredAllVital] = useState([]);
    const [apiErrorMessage, setApiErrorMessage] = useState("");
    const [allVital, setAllVital] = useState([])

    // Extract unique vitals_key for column headers
    const vitalsKeys = [...new Set(filteredResults?.map(item => item.vitals_key))];

    const groupedData = filteredResults?.reduce((acc, item) => {
        const existing = acc.find(row => row.date === item.date);
        if (existing) {
            existing[item.vitals_key] = item.vitals_value;
        } else {
            acc.push({ date: item.date, [item.vitals_key]: item.vitals_value });
        }
        return acc;
    }, []);

    const searchViewHistory = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (isVital?.length > 0) {
            const results = isVital.filter(item =>
                Object.values(item).some(val =>
                    val?.toString().toLowerCase().includes(value)
                )
            );
            setFilteredResults(value ? results : isVital);
        }

        if (allVital?.length > 0) {
            const results = allVital.filter(item =>
                Object.values(item).some(val =>
                    val?.toString().toLowerCase().includes(value)
                )
            );
            setFilteredAllVital(value ? results : allVital);
        }
    };

    const handleDateChange = (date) => {
        if (!date) {
            setIsDate(null);
            return;
        }
        let formatDate = dayjs(date).format("YYYY/MM/DD");
        setIsDate(formatDate);
    };

    const getViewHistory = async () => {
        try {
            const formattedDate = moment(isDate).format("YYYY-MM-DD");
            const response = await API.get(`/patient-vital-history?patientId=${id}&vitalDate=${formattedDate}`);
            if (response?.status == 200) {
                setIsVital(response.data.data);
                setFilteredResults(response.data.data);
                setApiErrorMessage(""); // Clear any previous errors
            } else {
                setApiErrorMessage(response.data.message || "No data available");
            }
        } catch (error) {
            setApiErrorMessage(error.response?.data?.message || "An error occurred while fetching data");
        }
    };

    const getAllVital = async () => {
        try {
            const formattedDate = moment(isDate).format("YYYY-MM-DD");
            const response = await API_MS.get(`/all-vital?patient_id=${id}&vitalDate=${formattedDate}`)
            setAllVital(response?.data?.data)
            setFilteredAllVital(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLeftArrowClick = () => {
        const newDate = moment(isDate).subtract(1, 'day').format('YYYY/MM/DD');
        setIsDate(newDate);
    };

    const handleRightArrowClick = () => {
        const newDate = moment(isDate).add(1, 'day').format('YYYY/MM/DD');
        setIsDate(newDate);
    };

    useEffect(() => {
        if (id) {
            getViewHistory();
            getAllVital();
        }
    }, [isDate, id]);


    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    return (
        <WraperLayout className="view-history">
            <div className="box-white">
                <div className="top_wrap">
                    <Row className="align-items-center">
                        <Col lg={3}>
                            <div className="wraper_date">
                                <a onClick={handleLeftArrowClick}>
                                    <span className='left_arrow'></span>
                                </a>
                                <a onClick={handleRightArrowClick}>
                                    <span className='right_arrow'></span>
                                </a>
                                <DatePicker name='dob'
                                    value={isDate ? dayjs(isDate, "YYYY/MM/DD") : null}
                                    allowClear={true}
                                    onChange={handleDateChange}
                                />
                            </div>
                        </Col>
                        <Col lg={1}>
                        </Col>
                        <Col lg={2}></Col>
                        <Col lg={6}>
                            <Row className='justify-content-end'>
                                <Col lg={7}>
                                    <div className="search__bar">
                                        <img src={Search} alt="" />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={searchViewHistory}
                                            placeholder="Search..."
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
                <div className="bottom_wrap">
                    <div className="table__wrape tablePrime">
                        {groupedData?.length > 0 ? (
                            <DataTable
                                value={groupedData}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                tableStyle={{ minWidth: '50rem' }}
                                paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
                                emptyMessage="No data available"
                                currentPageReportTemplate="{first} - {last} of {totalRecords}"
                            >
                                <Column field="date" header="Date" style={{ width: "15%" }} sortable />
                                {vitalsKeys?.map((key, index) => (
                                    <Column
                                        key={index}
                                        field={key}
                                        header={key}
                                        style={{ width: "15%" }}
                                        sortable
                                    />
                                ))}
                            </DataTable>
                        ) : filteredAllVital?.length > 0 ? (
                            <DataTable
                                value={filteredAllVital}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                tableStyle={{ minWidth: '50rem' }}
                                currentPageReportTemplate="{first} - {last} of {totalRecords}"
                                emptyMessage="No data available"
                            >
                                <Column field="created_at" header="Date" sortable body={(rowData) => moment(rowData.created_at).format("DD/MM/YYYY")} />
                                <Column field="blood_pressure" header="Blood Pressure" sortable />
                                <Column field="heart_rate" header="Heart Rate" sortable />
                                <Column field="respiratory_rate" header="Respiratory Rate" sortable />
                                <Column field="stress_level" header="Stress Level" sortable />
                            </DataTable>
                        ) : (
                            <div className="error-message text-center">
                                {apiErrorMessage ? apiErrorMessage : "No data available"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WraperLayout>
    )
}

export default ViewHistory