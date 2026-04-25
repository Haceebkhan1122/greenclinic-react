/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import './appointmentFormSetting.scss';
import { Col, Form, Table } from 'react-bootstrap';
import ModalAddCustomField from './modalAddCustomField/ModalAddCustomField';
import ModalEditCustomField from '../../../modal/modalEditCustomField/ModalEditCustomField';
import ModalDeleteCustomField from '../../../modal/modalDeleteCustomField/ModalDeleteCustomField';
import Loader from '../../../loader/Loader';
import API from '../../../../services/httpInstance';
import { toast } from 'react-toastify';
import {  useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';

const AppointmentFormSetting = ({ show, setShow,isLoading, handleShow, handleClose, setIsLoading }) => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [appointmentType, setAppointmentType] = useState(null)
    const [singleEditItem, setSingleEditItem] = useState({})
    const [billingAppoinment, setBillingAppoinment] = useState(null)
    const [titleCustomArr, setTitleCustomArr] = useState([]);
    const [appointmentData, setAppointmentData] = useState({});

    const handleCloseEdit = () => setShowEdit(false);
    const handleCloseDelete = () => setShowDelete(false);

    useEffect(() => {
        if (appointmentData?.appointment_details?.appointment_type_id) {
            setAppointmentType(appointmentData?.appointment_details?.appointment_type_id)
        }
    }, [appointmentData]);

    const handleShowEdit = (item) => {
        setSingleEditItem(item);
        setShowEdit(true);
    }

    const handleShowDelete = (item) => {
        setSingleEditItem(item);
        setShowDelete(true);
    }

    const handleChange = (e)=> {
        const {value,checked,name} = e.target;
        if(name == "billingAppointment" ){
            if(checked) {
                setBillingAppoinment(1)
            }
            else {
                setBillingAppoinment(0)
            }
        }
    }

    useEffect(() => {
        setBillingAppoinment(appointmentData?.appointment_details?.billing);
    }, [appointmentData])

    const appointment_detailsObj = {
        appointment_type_id : Number(appointmentType),
        billing : billingAppoinment,
    } 

    
    let dataaa = appointmentData?.appointment_settings?.map((item) => {
        return {
            id: item?.id,
            show : item?.show,
            required : item?.required,
            print : item?.print,
        }
    });

    const payloadAppointmentSettings = {
        appointment_details : appointment_detailsObj,
        appointment_settings : dataaa,

    }

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await API.post("/appointment-settings", payloadAppointmentSettings) 
            if(response?.status == 200) {
                setIsLoading(false);
                toast.success(response?.data?.message)
            }
            else {
                setIsLoading(false);
                toast.error(response?.data?.message)
            }
        } catch (error) {
            setIsLoading(false);
        }
    }


    const handleCustomOptions = async (e, item) => {
        const { name, checked, value } = e.target;
        let val = checked ? 1 : 0;
        let id = item.id;
        let updated = [...titleCustomArr];
        let idx = updated.findIndex(item => item.id == id);
        const payload = {};
        if (name == "customFieldShow") { 
            updated[idx]["show"] = val;
            payload.appointment_setting = updated;  
            const response = await API.put("/update-appointment-form-fields-data", payload);
            if(response?.status == 200) {
                setIsLoading(false)
                getAppointments();
            }
            else {
                setIsLoading(false)
                toast.error(response?.data?.message)
            }
        }
        if (name == "customFieldRequired") {
            updated[idx]["required"] = val;
            payload.appointment_setting = updated;  
            const response = await API.put("/update-appointment-form-fields-data", payload);
            if(response?.status == 200) {
                setIsLoading(false)
                getAppointments();
            }
            else {
                setIsLoading(false)
                toast.error(response?.data?.message)
            }
        }
        if (name == "customFieldPrint") {
            updated[idx]["print"] = val;
            payload.appointment_setting = updated;  
            const response = await API.put("/update-appointment-form-fields-data", payload);
            if(response?.status == 200) {
                setIsLoading(false)
                getAppointments();
            }
            else {
                setIsLoading(false)
                toast.error(response?.data?.message)
            }
        }
        setTitleCustomArr(updated);
    }

    useEffect(() => {
        let filterAllIds = appointmentData?.appointment_settings?.map((item) => ({
            title : item?.title,
            id : item?.id,
            show : item?.show,
            required : item?.required,
            print : item?.print,
        }));
        setTitleCustomArr(filterAllIds);
    }, [appointmentData])

    useEffect(() => {
        getAppointments();
    }, [])

    async function getAppointments(){
        try {
            setIsLoading(true);
            const response = await API.get(`/appointment-form-data`);
            if (response?.status == 200) {
                setAppointmentData(response?.data?.data);
                setIsLoading(false);
            }
            else {
                setIsLoading(false);
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading ? <Loader />
            :
            <div className='appointmentFormContainer'>
                <div className="top">
                    <Col lg={2} xs={12}>
                        <div className="single customCheck">
                            <label htmlFor=""> Billing on Appointment </label>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                checked={billingAppoinment == 1 ? true : false}
                                name='billingAppointment'
                                onChange={handleChange}
                            />
                        </div>
                    </Col>
                    <Col lg={7} xs={12}>
                        <div className="consultRadios">
                            <span> Consultation Type </span>
                            <div className="single customRadioo">
                                <div className="wrapeInp">
                                    <input type="radio" id="Appointment" name="consultType" value={1} onChange={(e) => setAppointmentType(Number(e.target.value))} checked={appointmentType == 1 || appointmentType == "1" } />
                                    <span></span>
                                </div>
                                <label htmlFor="Appointment"> Appointment </label>
                            </div>
                            <div className="single customRadioo">
                                <div className="wrapeInp">
                                    <input type="radio" id="Token" name="consultType" value={2} onChange={(e) => setAppointmentType(Number(e.target.value))} checked={appointmentType == 2 || appointmentType == "2"} />
                                    <span></span>
                                </div>
                                <label htmlFor="Token"> Token </label>
                            </div>
                        {!isMobile && <div className="single customRadioo">
                                <div className="wrapeInp">
                                    <input type="radio" id="Shift" name="consultType" value={3} onChange={(e) => setAppointmentType(Number(e.target.value))} checked={appointmentType == 3 || appointmentType == "3"} />
                                    <span></span>
                                </div>
                                <label htmlFor="Shift"> Shift base token </label>
                            </div>}
                        </div>
                    </Col>
                    <Col lg={2}>
                            <button onClick={handleShow}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                <path d="M11.1911 13.0096H4.33398V10.7238H11.1911V3.8667H13.4768V10.7238H20.334V13.0096H13.4768V19.8667H11.1911V13.0096Z" fill={themeColor} />
                            </svg> Add Custom Field </button>
                    </Col>
                </div>
                <div className="table__wrape">
                    <Table responsive className=''>
                        <thead>
                            <tr>
                                <th>Default Fields</th>
                                <th>Show</th>
                                <th>Required</th>
                                <th>Print</th>
                                <th> Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {titleCustomArr?.map((item) => {
                                return (<>
                                    <tr>
                                        <td> {item?.title} </td>
                                        <td>
                                            <div className="single customCheck">
                                                <Form.Check
                                                    type="switch"
                                                    id={`${item.key}_custom_check`}
                                                    defaultChecked={item?.show == 1}
                                                    value={item?.id}
                                                    onChange={(e)=> handleCustomOptions(e,item)}
                                                    name='customFieldShow'
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="single customCheck">
                                                <Form.Check
                                                    type="switch"
                                                    id={`${item.key}_custom_check`}
                                                    defaultChecked={item.required == 1 ? true : false}
                                                    onChange={(e)=> handleCustomOptions(e,item)}
                                                    name='customFieldRequired'
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="single customCheck">
                                                <Form.Check
                                                    type="switch"
                                                    id={`${item.key}_custom_check`}
                                                    defaultChecked={item.print == 1 ? true : false}
                                                    onChange={(e)=> handleCustomOptions(e,item)}
                                                    name='customFieldPrint'
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="wrape_actions">
                                                <span className="deleteIcon" onClick={() => handleShowDelete(item)}></span>
                                                <span className="editIcon" onClick={() => { handleShowEdit(item) }}></span>
                                            </div>
                                        </td>
                                    </tr>
                                </>)
                            })}
                        </tbody>
                    </Table>
                
                </div>
                <ModalAddCustomField show={show} setShow={setShow} setAppointmentData={setAppointmentData} getAppointmentsFn={getAppointments} handleClose={handleClose} handleShow={handleShow} />
                <ModalEditCustomField getAppointments={getAppointments} handleCloseEdit={handleCloseEdit} showEdit={showEdit} handleShowEdit={handleShowEdit} singleEditItem={singleEditItem} />
                <ModalDeleteCustomField showDelete={showDelete} getAppointments={getAppointments} handleCloseDelete={handleCloseDelete} handleShowDelete={handleShowDelete} text="Field" singleEditItem={singleEditItem} />
                <div className="bottom-bar-content">
                    <button onClick={handleShow} className='mobileAddCustomBtn' > Add Custom Field </button>
                    <button className='saveBtn' onClick={handleSave}> Save </button>
                </div>
            </div>}
        </>
    )
}

export default AppointmentFormSetting;
