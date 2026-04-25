import { Col, Row } from 'react-bootstrap';
import './summaryTabAppointment.scss';
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import API from '../../../../services/httpInstance/index';
import dayjs from 'dayjs';
import moment from "moment";
import { useSelector } from 'react-redux';
import SummaryFilter from './SummaryFilter';
import { useMediaQuery } from '@mui/material'

import Search from "../../../../assets/images/svg/search.svg"



const SummaryTabAppointment = () => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const isMobile = useMediaQuery('(max-width:767px)');
    const [summaryData, setSummaryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [appointmentNames, setAppointmentNames] = useState([])
    const [labels, setLabels] = useState([])
    const [series, setSeries] = useState([])
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedYear, setSelectedYear] = useState("");
    const [colors, setColors] = useState([]);
    const [summryfilterShow, setSummryFilterShow] = useState(false);

    const handleSummryFilterClose = () => setSummryFilterShow(false);
    const handleSummryFilterShow = () => setSummryFilterShow(true);

    const handleDateChange = (date) => {
        let formatDate = dayjs(date).format('YYYY/MM/DD')
        setSelectedDate(formatDate)
    }

    const onChange = (date, dateString) => {
        setSelectedYear(dateString)
    };

    useEffect(() => {
        getReports();
    }, [selectedDate, selectedYear])

    const getReports = async () => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams();
            if (selectedDate) {
                const formattedDate = moment(selectedDate).format("YYYY-MM-DD"); // Ensure correct format
                queryParams.append("date", formattedDate);
            }
            if (selectedYear) queryParams.append("year", selectedYear);

            const url = queryParams.toString()
                ? `/reports/appt-report?${queryParams.toString()}`
                : `/reports/appt-report`;

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

    useEffect(() => {
        let labels1 = summaryData["top "]?.map(item => item.text);
        let series1 = summaryData["top "]?.map(item => item.number);
        let colors1 = summaryData["top "]?.map(item => item.color); 
        setSeries(series1);
        setLabels(labels1);
        setColors(colors1); 
    }, [summaryData]);

    useEffect(() => {

        setState(prevState => ({
            ...prevState,
            series: series || [11, 11, 11, 11],

            options: {
                ...prevState.options,
                labels: labels,
                colors: colors, 
            }
        }));
    }, [labels, series, colors]);
    const today = moment().format('YYYY-MM-DD');


    const [state, setState] = useState({
        series: [11, 11, 11, 11],
        options: {
            labels: [],
            chart: {
                type: 'donut',
            },
            colors: [], // Empty initially
            stroke: {
                show: false, // Removes white border
            },
            dataLabels: {
                enabled: false, // Hides percentage labels
            },
            legend: {
                markers: {
                    shape: 'square' // Change legend markers to squares
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 260
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]

            ,
            noData: {
                text: undefined,
                align: 'center',
                verticalAlign: 'middle',
                offsetX: 0,
                offsetY: 0,
                style: {
                    color: "#ccc",
                    fontSize: '14px'
                }
            }
        },
    });

    return (
        <div className='summaryTabAppointment'>
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

                {isMobile ?
                    (<>
                        <div className='mob row m-0'>
                            <Col lg={3} xs={8} className='ps-0 '>
                                <div className="search__bar">
                                    <img src={Search} alt="" />
                                    <input type="text" placeholder='Search by name, number'

                                    // onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </Col>
                            <Col lg={2} xs={4} className='ps-0'>
                                <button className="btnDownMobile" onClick={() => downloadAPI()}>
                                    <span className='downloadIcon'><svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                        <path d="M10.4997 13.3333L6.33301 9.16658L7.49967 7.95825L9.66634 10.1249V3.33325H11.333V10.1249L13.4997 7.95825L14.6663 9.16658L10.4997 13.3333ZM5.49967 16.6666C5.04134 16.6666 4.64898 16.5034 4.32259 16.177C3.9962 15.8506 3.83301 15.4583 3.83301 14.9999V12.4999H5.49967V14.9999H15.4997V12.4999H17.1663V14.9999C17.1663 15.4583 17.0031 15.8506 16.6768 16.177C16.3504 16.5034 15.958 16.6666 15.4997 16.6666H5.49967Z" fill="#0F75BC" />
                                    </svg>  </span>
                                    Download </button>
                            </Col>
                        </div>

                    </>)
                    :
                    (<>
                        <div className="top-bar-filter">
                            <span> Filter by </span>
                            <div className="custom_date_report">
                                <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true}
                                    allowClear={false} />
                            </div>

                        </div>
                    </>)
                }

                <div className="wrape_bto">
                    <Col lg={12}>
                        <Row>
                            <Col lg={6}>
                                <div className='chartBox'>
                                    <div id="chart">
                                        <ReactApexChart options={state.options} series={state.series} type="donut" />
                                    </div>
                                    <div id="html-dist"></div>

                                </div>
                            </Col>
                            <Col lg={6}>
                                <div className="wraperbarlines">
                                    {summaryData?.bottom?.map((item) => {
                                        return (<>
                                            <div className="wraper_barSingle">
                                                <div className="singleBar">
                                                    <div className="vertiLine"></div>
                                                    <h3> {item?.text}  </h3>
                                                </div>
                                            </div>
                                        </>)
                                    })}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </div>
                <SummaryFilter handleDateChange={handleDateChange} handleSummryFilterClose={handleSummryFilterClose} handleSummryFilterShow={handleSummryFilterShow} summryfilterShow={summryfilterShow} />
            </div>
        </div>



    )
}

export default SummaryTabAppointment;
