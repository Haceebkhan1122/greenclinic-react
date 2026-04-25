import { useState, useEffect } from 'react';
import { Col, Row, Modal, Form } from 'react-bootstrap';
import './summaryTabFinancial.scss';
import { DatePicker } from 'antd';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import moment from "moment";
import API from '../../../../services/httpInstance/index';
import parse from 'html-react-parser';
import { useMediaQuery } from '@mui/material'

const SummaryTabFinancial = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [summaryData, setSummaryData] = useState([]);
    const onChange = (date, dateString) => {
        setSelectedYear(dateString);
    };
    const isMobile = useMediaQuery('(max-width:767px)');

    const handleDateChange = (date) => {
        if (!date) return; // Prevent errors if date is null
        let formatDate = dayjs(date).format("YYYY/MM/DD");
        setSelectedDate(formatDate);
    };
    const [summryfilterShow, setSummryFilterShow] = useState(false);

    const handleSummryFilterClose = () => setSummryFilterShow(false);
    const handleSummryFilterShow = () => setSummryFilterShow(true);

    const [chartData, setChartData] = useState({
        series: [],
        options: {
            chart: {
                type: "bar",
                height: 400,
                toolbar: { show: true }, // Enable export buttons
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "50%", // Adjusted for clarity
                    borderRadius: 0,
                },
            },
            dataLabels: {
                enabled: true, // Show values on bars
            },
            xaxis: {
                categories: [],
                labels: {
                    style: {
                        colors: "#4F4F4F",
                        fontSize: "13px",
                        fontFamily: "Anek Malayalam",
                    },
                },

            },
            yaxis: {
                title: {
                    text: "Revenue (PKR)  ",
                    style: {
                        fontWeight: 400,
                        colors: "#4F4F4F",
                        fontSize: "13px",
                        fontFamily: "Anek Malayalam",
                    },
                },
                labels: {
                    // text: "Revenue (PKR) s ",

                    style: {
                        fontWeight: 400,
                        colors: "#4F4F4F",
                        fontSize: "13px",
                        fontFamily: "Anek Malayalam",
                    },
                },

            },
            grid: {
                show: true,
                borderColor: "#ECECEC",
                strokeDashArray: 0,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            legend: {
                position: "bottom", // Move legend below chart
                horizontalAlign: "center",
            },
            fill: { opacity: 1 },
            colors: [], // Will be set dynamically
        },
    });

    useEffect(() => {
        if (summaryData?.quarters?.length > 0) {
            const months = summaryData.quarters.flatMap((q) => q.months.map((m) => m.months)); // Extract month names
            const clinicRevenue = summaryData.quarters.flatMap((q) => q.months.map((m) => m.values.clinic_revenue));
            const doctorRevenue = summaryData.quarters.flatMap((q) => q.months.map((m) => m.values.doctor_revenue));

            const clinicColor = summaryData.quarters?.[0]?.revenue?.[0]?.color || "#118BE2";
            const doctorColor = summaryData.quarters?.[0]?.revenue?.[1]?.color || "#84D95B";

            const minRevenue = Math.min(...doctorRevenue, 0); // Minimum revenue
            const maxRevenue = Math.max(...clinicRevenue); // Maximum revenue

            setChartData({
                series: [
                    { name: "Clinic Revenue", data: clinicRevenue },
                    { name: "Doctor Revenue", data: doctorRevenue },
                ],
                options: {
                    ...chartData.options,
                    xaxis: { categories: months },
                    yaxis: {
                        title: {
                            text: "Revenue (PKR)",
                            style: {
                                fontWeight: 400,
                                colors: "#4F4F4F",
                                fontSize: "13px",
                                fontFamily: "Anek Malayalam",
                            },
                        },
                        min: minRevenue,
                        max: maxRevenue,
                    },
                    colors: [clinicColor, doctorColor], // Apply correct colors
                    legend: { show: true, position: "bottom" }, // Show legend at the bottom
                    dataLabels: { enabled: false }, // Hide numbers on bars
                    tooltip: { enabled: true }, // Show values on hover
                },
            });
        }
    }, [summaryData]);

    const getFinancialsList = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) {
                queryParams.append("year", selectedYear);
            }
            const url = queryParams.toString()
                ? `/reports/financials-graph?${queryParams.toString()}`
                : `/reports/financials-graph`;
            const response = await API.get(url);
            if (response?.status == 200) {
                setSummaryData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleApplyFilter = () => {
        handleSummryFilterClose();
        getFinancialsList();
    };

    useEffect(() => {
        getFinancialsList();
    }, [selectedDate]);

    return (
        <div className='summaryTabFinancial'>
            <div className='bgMobile'>
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
                {!isMobile && <div className="top-bar-filter">
                    <span> Filter by </span>
                    <div className="custom_date_report">
                        <DatePicker name='dob' onChange={handleDateChange} />
                    </div>
                </div>}

                <div className="wrape_bto">
                    <Col lg={12}>
                        <Row>
                            <Col lg={6}>
                                <div className='chartBox02'>
                                    <div id="chart">
                                        <ReactApexChart
                                            options={summaryData?.quarters?.length > 0 ? chartData.options : {
                                                ...chartData.options,
                                                xaxis: { categories: [] },
                                            }}
                                            series={summaryData?.quarters?.length > 0 ? chartData.series : []}
                                            type="bar"
                                            height={350}
                                        />
                                    </div>
                                </div>
                                <div id="html-dist"></div>
                            </Col>
                            <Col lg={5}>
                                <div className="wraperbarlines">
                                    {summaryData?.bottom?.length > 0 && summaryData?.bottom?.map((item) => {
                                        return (
                                            <>
                                                <div className="wraper_barSingle">
                                                    <div className="singleBar d">
                                                        <div className="vertiLine"></div>
                                                        <h3>{parse(item?.text)}</h3>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </div>
            </div>


            <Modal show={summryfilterShow} onHide={handleSummryFilterClose} centered className="mobileFilterReportModal">
                <Modal.Body>
                    <span className="crossBtnModal" onClick={handleSummryFilterClose}></span>
                    <h2> <span className="filterIcoo"></span> Filter </h2>
                    <div className="wraper_add_modal">
                        <div className="wrape_cl">
                            <Row>
                                <Col xs={12}>
                                    <div className="custom_date_report">
                                        <label htmlFor="openDate">Date</label>
                                        <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true} />
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <button className='saveBtn' onClick={handleApplyFilter} > Apply Filter </button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default SummaryTabFinancial;
