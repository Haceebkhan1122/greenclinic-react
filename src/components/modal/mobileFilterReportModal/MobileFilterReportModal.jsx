import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { DatePicker, Divider } from "antd";
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "./mobileFilterReportModal.scss"

const MobileFilterReportModal = ({ filterShow, setStatus, status, setSelectedDate, selectedDate, handleFilterClose, getLabTests }) => {

    const [labTestTypesAll, setLabTestTypesAll] = useState([]);
    const [dataType, setDataType] = useState(null);
    const [fieldName, setFieldName] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [stateFilter, setStateFilter] = useState("")
    const [dateFilter, setDateFilter] = useState(null);

    useEffect(() => {
        getLabTestsTypes();
    }, [])

    const getLabTestsTypes = async () => {
        try {
            const response = await API.get(`/get-lab-test-types`);
            if (response?.status == 200) {
                setLabTestTypesAll(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { value, name } = e.target;

        if (name == "status") {
            setStateFilter(value);
        }

    }

    const handleSave = async (e) => {
        e.preventDefault();
        if(!stateFilter && !dateFilter) {
            toast.error("Please select atleast one filter")
            return;
        }
        if(stateFilter) {
            setStatus(stateFilter);
        }
        if(dateFilter) {
            setSelectedDate(dateFilter);
        }
        handleFilterClose();
    }

    const handleDateChange = (date, dateString) => {
        let formatDate = dayjs(date).format('YYYY/MM/DD')
        setDateFilter(formatDate);
    }

    return (
        <Modal show={filterShow} onHide={handleFilterClose} centered className="mobileFilterReportModal">
                <Modal.Body>
                <span className="crossBtnModal" onClick={handleFilterClose}></span>
                <h2> <span className="filterIcoo"></span> Filter </h2>
                    <div className="wraper_add_modal">
                    <div className="wrape_cl">
                        <label htmlFor="openDate"> Date </label>
                        <div className="wraper_dateExpense">
                            <span className='calenderIcon'> </span>
                            <DatePicker id={"openDate"} placeholder="Select Start"  name='dob' onChange={handleDateChange} />
                        </div>
                    </div>
                    <h5 className="sta"> Status </h5>
                    <div className="wrape__radios">
                        <div className="single customRadioo">
                            <div className="wrapeInp">
                                <input type="radio" id="indications" value={"indications"} checked={stateFilter == "indications"} name="status"  onChange={handleChange} />
                                <span></span>
                            </div>
                            <label htmlFor="indications" className='mb-0'> Indications </label>
                        </div>
                        <div className="single customRadioo">
                            <div className="wrapeInp">
                                <input type="radio" id="Refunded" name="status" checked={stateFilter == "refunded"} value={"refunded"}  onChange={handleChange} />
                                <span></span>
                            </div>
                            <label htmlFor="Refunded" className='mb-0'> Refunded </label>
                        </div>
                        <div className="single customRadioo">
                            <div className="wrapeInp">
                                <input type="radio" id="Pending" value={"pending"} checked={stateFilter == "pending"} name="status"  onChange={handleChange} />
                                <span></span>
                            </div>
                            <label htmlFor="Pending" className='mb-0'> Pending </label>
                        </div>
                        <div className="single customRadioo">
                            <div className="wrapeInp">
                                <input type="radio" id="Clear All" value={"clearAll"} checked={stateFilter == "clearAll"} name="status"  onChange={handleChange} />
                                <span></span>
                            </div>
                            <label htmlFor="Clear All" className='mb-0'> Clear All </label>
                        </div>
                    </div>
                    <button className='saveBtn' onClick={handleSave}> Apply Filter </button>
                    </div>
                </Modal.Body>
        </Modal>
    )
}

export default MobileFilterReportModal;