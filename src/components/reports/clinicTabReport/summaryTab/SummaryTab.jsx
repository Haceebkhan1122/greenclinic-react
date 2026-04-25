import './summaryTab.scss';
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import API from '../../../../services/httpInstance/index';
import dayjs from 'dayjs';
import moment from "moment";

const SummaryTab = () => {
    const [summaryData, setSummaryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedYear, setSelectedYear] = useState("");


    const onChange = (date, dateString) => {
        setSelectedYear(dateString)
    };

    useEffect(() => {
        getReports();
    }, [selectedDate, selectedYear]);

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
                ? `/reports/clinics/summary?${queryParams.toString()}`
                : `/reports/clinics/summary`;

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

    const handleDateChange = (date) => {
        if (!date) return; // Prevent errors if date is null
        let formatDate = dayjs(date).format("YYYY/MM/DD");
        setSelectedDate(formatDate);
    };


    return (
        <div className='summaryTab d'>
            <div className="top-bar-filter">
                <span> Filter by </span>
                <div className="custom_date_report">
                    <DatePicker name='dob' onChange={handleDateChange} inputReadOnly={true} />
                </div>
                {/* <div className="custom_date_reportYear">
                    <DatePicker onChange={onChange} picker="year" inputReadOnly={true} />
                </div> */}

            </div>
            <div className="cardsWraperSummary">
                {summaryData && Object.entries(summaryData)[0]?.[1]?.map((item) => {
                    return (<>
                        <div className='singleCardSummary'>
                            <h3> {item?.text} </h3>
                            <div className='tw-w-full tw-flex tw-justify-between tw-items-center'>
                                <h5> {item?.number} </h5>
                                <img src={item.svg} alt="" />
                            </div>
                        </div>
                    </>)
                })}
            </div>
            <div className="wraperbarlines">
                {summaryData?.bottom?.map((item) => {
                    return (<>
                        <div className="wraper_barSingle">
                            <h4> {item?.percent} </h4>
                            <div className="singleBar">
                                <div className="vertiLine "></div>
                                <h3> {item?.text}  </h3>
                            </div>
                        </div>
                    </>)
                })}
                {/* <div className="wraper_barSingle">
                    <h4> 100% </h4>
                    <div className="singleBar">
                        <div className="vertiLine"></div>
                        <h3> Most Concerned Speciality: General Physician  </h3>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default SummaryTab;
