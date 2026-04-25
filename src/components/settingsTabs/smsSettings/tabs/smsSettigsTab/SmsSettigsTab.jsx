/* eslint-disable no-empty */
import { Accordion, Col, Form, Row, Table } from 'react-bootstrap';
import './smsSettigsTab.scss';
import { Divider } from 'antd';
import EditSmsTemplateModal from '../../../../modal/editSmsTemplateModal/EditSmsTemplateModal';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import Loader from '../../../../loader/Loader';
import API from '../../../../../services/httpInstance';
import { toast } from 'react-toastify';

const SmsSettigsTab = ({ smsSettingsData, isLoading, setIsLoading, getSmsSettings }) => {
    const [deactiveSms, setDeactiveSms] = useState("")
    const [doctorSms, setDoctorSms] = useState("")
    const [patientSms, setPatientSms] = useState("")
    const [language, setLanguage] = useState("")
    const [summaryReportEnabled, setSummaryReportEnabled] = useState("")
    const [summaryReportTime, setSummaryReportTime] = useState("")
    const [smsReportEnabled, setSmsReportEnabled] = useState("")
    const [smsReportTime, setSmsReportTime] = useState("")
    const [smsThrough, setSmsThrough] = useState("")
    const [showEdit, setShowEdit] = useState(false);
    const [singleEditItem, setSingleEditItem] = useState({});
    const [indicationMessage, setIndicationMessage] = useState("")
    const [patientMorningCheck, setPatientMorningCheck] = useState("")
    const [patientAfternoonCheck, setPatientAfternoonCheck] = useState("")
    const [patientEveningCheck, setPatientEveningCheck] = useState("")
    const [patientNightCheck, setPatientNightCheck] = useState("")

    const [patientMorningTime, setPatientMorningTime] = useState("")
    const [patientAfternoonTime, setPatientAfternoonTime] = useState("")
    const [patientEveningTime, setPatientEveningTime] = useState("")
    const [patientNightTime, setPatientNightTime] = useState("")

    useEffect(() => {
        if (smsSettingsData?.sms_checking) {
            setDeactiveSms(smsSettingsData?.sms_checking?.[0]?.deactivate_sms)
            setDoctorSms(smsSettingsData?.sms_checking?.[0]?.deactivate_doctor_sms)
            setPatientSms(smsSettingsData?.sms_checking?.[0]?.deactivate_patient_sms)
            setLanguage(smsSettingsData?.sms_checking?.[0]?.language)
            setSummaryReportEnabled(smsSettingsData?.sms_checking?.summary_report?.isEnabled)
            setSummaryReportTime(smsSettingsData?.sms_checking?.summary_report?.schedule_time)
            setSmsReportEnabled(smsSettingsData?.sms_checking?.schedule_sms?.isEnabled)
            setSmsReportTime(smsSettingsData?.sms_checking?.schedule_sms?.schedule_time)
            setSmsThrough(smsSettingsData?.sms_checking?.[0]?.sms_selection_type)
        }
    }, [])

    

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "deactiveSms") {
            if (checked) {
                setDeactiveSms(1);
            }
            else {
                setDeactiveSms(0);
            }
        }

        if (name == "doctorSms") {
            if (checked) {
                setDoctorSms(1);
            }
            else {
                setDoctorSms(0);
            }
        }

        if (name == "patientSms") {
            if (checked) {
                setPatientSms(1);
            }
            else {
                setPatientSms(0);
            }
        }

        if (name == "langE") {
            setLanguage(value)
        }

        if (name == "summaryReportCheck") {
            if (checked) {
                setSummaryReportEnabled(1);
            }
            else {
                setSummaryReportEnabled(0);
            }
        }

        if (name == "summary_report") {
            setSummaryReportTime(value);
        }

        if (name == "smsScheduleCheck") {
            if (checked) {
                setSmsReportEnabled(1);
            }
            else {
                setSmsReportEnabled(0);
            }
        }

        if (name == "smsScheduleTime") {
            setSmsReportTime(value)
        }

        if (name == "smsThrough") {
            setSmsThrough(value)
        }

        if (name == "patientMorning") {
            if (checked) {
                setPatientMorningCheck(1);
            }
            else {
                setPatientMorningCheck(0);
            }
        }

        if (name == "patientMorningTime") {
            setPatientMorningTime(value)
        }

        if (name == "patientAfternoon") {
            if (checked) {
                setPatientAfternoonCheck(1);
            }
            else {
                setPatientAfternoonCheck(0);
            }
        }

        if (name == "patientAfternoonTime") {
            setPatientAfternoonTime(value)
        }

        if (name == "patientEvening") {
            if (checked) {
                setPatientEveningCheck(1);
            }
            else {
                setPatientEveningCheck(0);
            }
        }

        if (name == "patientEveningTime") {
            setPatientEveningTime(value)
        }

        if (name == "patientNight") {
            if (checked) {
                setPatientNightCheck(1);
            }
            else {
                setPatientNightCheck(0);
            }
        }

        if (name == "patientNightTime") {
            setPatientNightTime(value)
        }
    }


    const handleSwitch = async (e, id) => {
        const { value, checked } = e.target;
        if (checked) {
            setIsLoading(true)
            const response = await API.patch(`/change-status-sms-temp`, {
                id,
                status: 1,
            })
            if (response?.status == 200) {
                setIsLoading(false)
                getSmsSettings();
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            else {
                setIsLoading(false)
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        else {
            setIsLoading(true)
            const response = await API.patch(`/change-status-sms-temp`, {
                id,
                status: 0,
            })
            if (response?.status == 200) {
                setIsLoading(false)
                getSmsSettings();
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            else {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setIsLoading(false)
            }
        }
    }

    const handleSave = async () => {
        setIsLoading(true);
        const response = await API.post("/sms-setting-save", {
            deactivateAllSMS: deactiveSms,
            deactivateDoctorSMS: doctorSms,
            deactivatePatientSMS: patientSms,
            summary_report: summaryReportEnabled,
            time_summary_report: summaryReportTime,
            schedule_sms: smsReportEnabled,
            schedule_sms_time: smsReportTime,
            language,
            message: smsThrough,
        })
        if (response?.status == 200) {
            toast.success(response?.data?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: false,
                theme: "dark",
            });
            getSmsSettings();
            setIsLoading(false)
        }
        else {
            toast.error(response?.data?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: false,
                theme: "dark",
            });
            setIsLoading(false)
        }
    }

    const handleCloseEdit = () => setShowEdit(false);


    const handleShowEdit = (item) => {
        setShowEdit(true);
        setSingleEditItem(item)
    }

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            {!isMobile
                ?
                <div className="wraper_smsTab">
                    <Row className='gx-0'>
                        <Col lg={5}>
                            <div className="left">
                                <h3> SMS Settings </h3>
                                <Divider />
                                <div className="field_check customCheck">
                                    <label htmlFor=""> Deactivate All SMS </label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        defaultChecked={smsSettingsData?.sms_checking?.[0]?.deactivate_sms == 0 ? false : true}
                                        name='deactiveSms'
                                        onChange={handleChange}
                                        value={deactiveSms}
                                    />
                                </div>
                                <div className="field_check customCheck">
                                    <label htmlFor=""> Deactivate Doctor SMS </label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        defaultChecked={smsSettingsData?.sms_checking?.[0]?.deactivate_doctor_sms == 0 ? false : true}
                                        name='doctorSms'
                                        onChange={handleChange}
                                        value={doctorSms}
                                    />
                                </div>
                                <div className="field_check customCheck">
                                    <label htmlFor=""> Deactivate Patient SMS </label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        defaultChecked={smsSettingsData?.sms_checking?.[0]?.deactivate_patient_sms == 0 ? false : true}
                                        name='patientSms'
                                        onChange={handleChange}
                                        value={patientSms}
                                    />
                                </div>
                                <h5> SMS Language </h5>
                                <div className="wrape_langs">
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="english" name='langE' value={"english"} onChange={handleChange} defaultChecked={smsSettingsData?.sms_checking?.[0]?.language == "english" ? true : false} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="english"> English </label>
                                    </div>
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="urdu" name='langE' value={"urdu"} onChange={handleChange} defaultChecked={smsSettingsData?.sms_checking?.[0]?.language == "urdu" ? true : false} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="urdu"> Urdu </label>
                                    </div>
                                </div>
                                <Divider />
                                <div className="field_check customCheck scmSms">
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> SMS Summary Report Time </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                defaultChecked={smsSettingsData?.sms_checking?.summary_report?.isEnabled == 1 ? true : false}
                                                name='summaryReportCheck'
                                                onChange={handleChange}
                                                value={smsReportEnabled}
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='summary_report' onChange={handleChange} className='select_time' value={summaryReportTime}>
                                            <option value="01:00 pm" selected={smsSettingsData?.sms_checking?.summary_report?.schedule_time}>01:00 pm</option>
                                            <option value="02:00 pm">02:00 pm</option>
                                            <option value="03:00 pm">03:00 pm</option>
                                            <option value="04:00 pm">04:00 pm</option>
                                            <option value="05:00 pm">05:00 pm</option>
                                            <option value="06:00 pm">06:00 pm</option>
                                            <option value="07:00 pm">07:00 pm</option>
                                            <option value="08:00 pm">08:00 pm</option>
                                            <option value="09:00 pm">09:00 pm</option>
                                            <option value="10:00 pm">10:00 pm</option>
                                            <option value="11:00 pm">11:00 pm</option>
                                            <option value="12:00 pm">12:00 pm</option>
                                            <option value="01:00 am">01:00 am</option>
                                            <option value="02:00 am">02:00 am</option>
                                            <option value="03:00 am">03:00 am</option>
                                            <option value="04:00 am">04:00 am</option>
                                            <option value="05:00 am">05:00 am</option>
                                            <option value="06:00 am">06:00 am</option>
                                            <option value="07:00 am">07:00 am</option>
                                            <option value="08:00 am">08:00 am</option>
                                            <option value="09:00 am">09:00 am</option>
                                            <option value="10:00 am">10:00 am</option>
                                            <option value="11:00 am">11:00 am</option>
                                            <option value="12:00 am">12:00 am</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="field_check customCheck scmSms">
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> Schedule SMS (Pre-booked SMS) </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                defaultChecked={smsSettingsData?.sms_checking?.schedule_sms?.isEnabled == 1 ? true : false}
                                                name='smsScheduleCheck'
                                                onChange={handleChange}
                                                value={smsReportEnabled}
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='smsScheduleTime' onChange={handleChange} className='select_time' value={smsReportTime}>
                                            <option value="01:00 pm" selected={smsSettingsData?.sms_checking?.schedule_sms?.schedule_time}>01:00 pm</option>
                                            <option value="02:00 pm">02:00 pm</option>
                                            <option value="03:00 pm">03:00 pm</option>
                                            <option value="04:00 pm">04:00 pm</option>
                                            <option value="05:00 pm">05:00 pm</option>
                                            <option value="06:00 pm">06:00 pm</option>
                                            <option value="07:00 pm">07:00 pm</option>
                                            <option value="08:00 pm">08:00 pm</option>
                                            <option value="09:00 pm">09:00 pm</option>
                                            <option value="10:00 pm">10:00 pm</option>
                                            <option value="11:00 pm">11:00 pm</option>
                                            <option value="12:00 pm">12:00 pm</option>
                                            <option value="01:00 am">01:00 am</option>
                                            <option value="02:00 am">02:00 am</option>
                                            <option value="03:00 am">03:00 am</option>
                                            <option value="04:00 am">04:00 am</option>
                                            <option value="05:00 am">05:00 am</option>
                                            <option value="06:00 am">06:00 am</option>
                                            <option value="07:00 am">07:00 am</option>
                                            <option value="08:00 am">08:00 am</option>
                                            <option value="09:00 am">09:00 am</option>
                                            <option value="10:00 am">10:00 am</option>
                                            <option value="11:00 am">11:00 am</option>
                                            <option value="12:00 am">12:00 am</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <h5> Message through </h5>
                                <div className="wrape_langs">
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="smsThrough" name='smsThrough' value={1} onChange={handleChange} defaultChecked={smsSettingsData?.sms_checking?.[0]?.sms_selection_type == 1 ? true : false} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="custom"> WhatsApp </label>
                                    </div>
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="smsThrough" name='smsThrough' value={0} onChange={handleChange} defaultChecked={smsSettingsData?.sms_checking?.[0]?.sms_selection_type == 0 ? true : false} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="custom"> Anonymous number </label>
                                    </div>
                                </div>
                                <h3> Patient Reminder SMS </h3>
                                <Divider />
                                <div className="wraper_patientRemainder">
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> Morning </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                // defaultChecked={smsSettingsData?.sms_checking?.schedule_sms?.isEnabled == 1 ? true : false}
                                                name='patientMorning'
                                                onChange={handleChange}
                                                value={patientMorningCheck}
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='patientMorningTime' onChange={handleChange} className='select_time' value={patientMorningTime}>
                                            <option value="01:00 pm">01:00 pm</option>
                                            <option value="02:00 pm">02:00 pm</option>
                                            <option value="03:00 pm">03:00 pm</option>
                                            <option value="04:00 pm">04:00 pm</option>
                                            <option value="05:00 pm">05:00 pm</option>
                                            <option value="06:00 pm">06:00 pm</option>
                                            <option value="07:00 pm">07:00 pm</option>
                                            <option value="08:00 pm">08:00 pm</option>
                                            <option value="09:00 pm">09:00 pm</option>
                                            <option value="10:00 pm">10:00 pm</option>
                                            <option value="11:00 pm">11:00 pm</option>
                                            <option value="12:00 pm">12:00 pm</option>
                                            <option value="01:00 am">01:00 am</option>
                                            <option value="02:00 am">02:00 am</option>
                                            <option value="03:00 am">03:00 am</option>
                                            <option value="04:00 am">04:00 am</option>
                                            <option value="05:00 am">05:00 am</option>
                                            <option value="06:00 am">06:00 am</option>
                                            <option value="07:00 am">07:00 am</option>
                                            <option value="08:00 am">08:00 am</option>
                                            <option value="09:00 am">09:00 am</option>
                                            <option value="10:00 am">10:00 am</option>
                                            <option value="11:00 am">11:00 am</option>
                                            <option value="12:00 am">12:00 am</option>
                                        </Form.Select>
                                    </div>
                                    <Divider />
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> Afternoon </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                // defaultChecked={smsSettingsData?.sms_checking?.schedule_sms?.isEnabled == 1 ? true : false}
                                                name='patientAfternoon'
                                                onChange={handleChange}
                                                value={patientAfternoonCheck}
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='patientAfternoonTime' onChange={handleChange} className='select_time' value={patientAfternoonTime}>
                                            <option value="01:00 pm">01:00 pm</option>
                                            <option value="02:00 pm">02:00 pm</option>
                                            <option value="03:00 pm">03:00 pm</option>
                                            <option value="04:00 pm">04:00 pm</option>
                                            <option value="05:00 pm">05:00 pm</option>
                                            <option value="06:00 pm">06:00 pm</option>
                                            <option value="07:00 pm">07:00 pm</option>
                                            <option value="08:00 pm">08:00 pm</option>
                                            <option value="09:00 pm">09:00 pm</option>
                                            <option value="10:00 pm">10:00 pm</option>
                                            <option value="11:00 pm">11:00 pm</option>
                                            <option value="12:00 pm">12:00 pm</option>
                                            <option value="01:00 am">01:00 am</option>
                                            <option value="02:00 am">02:00 am</option>
                                            <option value="03:00 am">03:00 am</option>
                                            <option value="04:00 am">04:00 am</option>
                                            <option value="05:00 am">05:00 am</option>
                                            <option value="06:00 am">06:00 am</option>
                                            <option value="07:00 am">07:00 am</option>
                                            <option value="08:00 am">08:00 am</option>
                                            <option value="09:00 am">09:00 am</option>
                                            <option value="10:00 am">10:00 am</option>
                                            <option value="11:00 am">11:00 am</option>
                                            <option value="12:00 am">12:00 am</option>
                                        </Form.Select>
                                    </div>
                                    <Divider />
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> Evening </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                // defaultChecked={smsSettingsData?.sms_checking?.schedule_sms?.isEnabled == 1 ? true : false}
                                                name='patientEvening'
                                                onChange={handleChange}
                                                value={patientEveningCheck}
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='patientEveningTime' onChange={handleChange} className='select_time' value={patientEveningTime}>
                                            <option value="01:00 pm" selected={smsSettingsData?.sms_checking?.schedule_sms?.schedule_time}>01:00 pm</option>
                                            <option value="02:00 pm">02:00 pm</option>
                                            <option value="03:00 pm">03:00 pm</option>
                                            <option value="04:00 pm">04:00 pm</option>
                                            <option value="05:00 pm">05:00 pm</option>
                                            <option value="06:00 pm">06:00 pm</option>
                                            <option value="07:00 pm">07:00 pm</option>
                                            <option value="08:00 pm">08:00 pm</option>
                                            <option value="09:00 pm">09:00 pm</option>
                                            <option value="10:00 pm">10:00 pm</option>
                                            <option value="11:00 pm">11:00 pm</option>
                                            <option value="12:00 pm">12:00 pm</option>
                                            <option value="01:00 am">01:00 am</option>
                                            <option value="02:00 am">02:00 am</option>
                                            <option value="03:00 am">03:00 am</option>
                                            <option value="04:00 am">04:00 am</option>
                                            <option value="05:00 am">05:00 am</option>
                                            <option value="06:00 am">06:00 am</option>
                                            <option value="07:00 am">07:00 am</option>
                                            <option value="08:00 am">08:00 am</option>
                                            <option value="09:00 am">09:00 am</option>
                                            <option value="10:00 am">10:00 am</option>
                                            <option value="11:00 am">11:00 am</option>
                                            <option value="12:00 am">12:00 am</option>
                                        </Form.Select>
                                    </div>
                                    <Divider />
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> Night </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                // defaultChecked={smsSettingsData?.sms_checking?.schedule_sms?.isEnabled == 1 ? true : false}
                                                name='patientNight'
                                                onChange={handleChange}
                                                value={patientNightCheck}
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='patientNightTime' onChange={handleChange} className='select_time' value={patientNightTime}>
                                            <option value="01:00 pm" >01:00 pm</option>
                                            <option value="02:00 pm">02:00 pm</option>
                                            <option value="03:00 pm">03:00 pm</option>
                                            <option value="04:00 pm">04:00 pm</option>
                                            <option value="05:00 pm">05:00 pm</option>
                                            <option value="06:00 pm">06:00 pm</option>
                                            <option value="07:00 pm">07:00 pm</option>
                                            <option value="08:00 pm">08:00 pm</option>
                                            <option value="09:00 pm">09:00 pm</option>
                                            <option value="10:00 pm">10:00 pm</option>
                                            <option value="11:00 pm">11:00 pm</option>
                                            <option value="12:00 pm">12:00 pm</option>
                                            <option value="01:00 am">01:00 am</option>
                                            <option value="02:00 am">02:00 am</option>
                                            <option value="03:00 am">03:00 am</option>
                                            <option value="04:00 am">04:00 am</option>
                                            <option value="05:00 am">05:00 am</option>
                                            <option value="06:00 am">06:00 am</option>
                                            <option value="07:00 am">07:00 am</option>
                                            <option value="08:00 am">08:00 am</option>
                                            <option value="09:00 am">09:00 am</option>
                                            <option value="10:00 am">10:00 am</option>
                                            <option value="11:00 am">11:00 am</option>
                                            <option value="12:00 am">12:00 am</option>
                                        </Form.Select>
                                    </div>
                                    <Divider />
                                </div>
                            </div>
                        </Col>
                        <Col lg={7}>
                            <div className="right">
                                <h3> SMS Template </h3>
                                <Divider />
                                <div className="table__wrape">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Template for</th>
                                                <th>Template Type</th>
                                                <th>Template </th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {smsSettingsData?.sms_template?.map((item) => {
                                                return (<>
                                                    <tr>
                                                        <td> {item?.template_for}</td>
                                                        <td> {item?.title} </td>
                                                        <td> {item?.value}</td>
                                                        <td>
                                                            <div className="wrape_actions">
                                                                <span className="editIcon" onClick={() => { handleShowEdit(item) }}></span>
                                                                <td>
                                                                    <div className="single customCheck singleCm">
                                                                        <Form.Check
                                                                            type="switch"
                                                                            id="custom-switch"
                                                                            className=''
                                                                            defaultChecked={item?.status == 1 ? true : false}
                                                                            name='smsTemplateCheck'
                                                                            onChange={(e) => handleSwitch(e, item?.id)}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>)
                                            })}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className="bottomFixBar">
                        <button onClick={handleSave}> Save </button>
                    </div>
                    <EditSmsTemplateModal showEdit={showEdit} handleCloseEdit={handleCloseEdit} singleEditItem={singleEditItem} smsSettingsData={smsSettingsData?.smsFormats} setIndicationMessage={setIndicationMessage} indicationMessage={indicationMessage} />
                </div>
                :
                <Accordion defaultActiveKey="0" className="accordianSmsSettings">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Settings</Accordion.Header>
                        <Accordion.Body>
                            <div className="left">
                                <div className="field_check customCheck">
                                    <label htmlFor=""> Deactivate All SMS </label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                    />
                                </div>
                                <div className="field_check customCheck">
                                    <label htmlFor=""> Deactivate Doctor SMS </label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                    />
                                </div>
                                <div className="field_check customCheck">
                                    <label htmlFor=""> Deactivate Patient SMS </label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                    />
                                </div>
                                <h5> SMS Language </h5>
                                <div className="wrape_langs">
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="custom" />
                                            <span></span>
                                        </div>
                                        <label htmlFor="custom"> Male </label>
                                    </div>
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="custom" />
                                            <span></span>
                                        </div>
                                        <label htmlFor="custom"> Male </label>
                                    </div>
                                </div>
                                <Divider />
                                <div className="field_check customCheck scmSms">
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> SMS Summary Report Time </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='dataType' onChange={handleChange} className='select_time'>
                                            <option value={1}>4:00 PM</option>
                                            <option value={2}>data demo</option>
                                            <option value={3}>data demo1</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <div className="field_check customCheck scmSms">
                                    <div className="single_field customSelect">
                                        <div className='wrape_ti'>
                                            <label htmlFor=""> Schedule SMS (Pre-booked SMS) </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                            />
                                        </div>
                                        <Form.Select aria-label="Default select example" name='dataType' onChange={handleChange} className='select_time'>
                                            <option value={1}>4:00 PM</option>
                                            <option value={2}>data demo</option>
                                            <option value={3}>data demo1</option>
                                        </Form.Select>
                                    </div>
                                </div>
                                <h5> Message through </h5>
                                <div className="wrape_langs">
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="custom" />
                                            <span></span>
                                        </div>
                                        <label htmlFor="custom"> Male </label>
                                    </div>
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="custom" />
                                            <span></span>
                                        </div>
                                        <label htmlFor="custom"> Male </label>
                                    </div>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Patient Reminder SMS</Accordion.Header>
                        <Accordion.Body>
                            <div className="field_check customCheck wholesms">
                                <div className="single_field customSelect">
                                    <div className='wrape_ti'>
                                        <label htmlFor=""> Morning  </label>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                        />
                                    </div>
                                    <Form.Select aria-label="Default select example" name='dataType' onChange={handleChange} className='select_time'>
                                        <option value={1}>4:00 PM</option>
                                        <option value={2}>data demo</option>
                                        <option value={3}>data demo1</option>
                                    </Form.Select>
                                </div>
                            </div>
                            <div className="field_check customCheck wholesms">
                                <div className="single_field customSelect">
                                    <div className='wrape_ti'>
                                        <label htmlFor=""> Morning  </label>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                        />
                                    </div>
                                    <Form.Select aria-label="Default select example" name='dataType' onChange={handleChange} className='select_time'>
                                        <option value={1}>4:00 PM</option>
                                        <option value={2}>data demo</option>
                                        <option value={3}>data demo1</option>
                                    </Form.Select>
                                </div>
                            </div>
                            <div className="field_check customCheck wholesms">
                                <div className="single_field customSelect">
                                    <div className='wrape_ti'>
                                        <label htmlFor=""> Morning  </label>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                        />
                                    </div>
                                    <Form.Select aria-label="Default select example" name='dataType' onChange={handleChange} className='select_time'>
                                        <option value={1}>4:00 PM</option>
                                        <option value={2}>data demo</option>
                                        <option value={3}>data demo1</option>
                                    </Form.Select>
                                </div>
                            </div>
                            <div className="field_check customCheck wholesms">
                                <div className="single_field customSelect">
                                    <div className='wrape_ti'>
                                        <label htmlFor=""> Morning  </label>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                        />
                                    </div>
                                    <Form.Select aria-label="Default select example" name='dataType' onChange={handleChange} className='select_time'>
                                        <option value={1}>4:00 PM</option>
                                        <option value={2}>data demo</option>
                                        <option value={3}>data demo1</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>SMS Templates</Accordion.Header>
                        <Accordion.Body>
                            <div className="cardsTemplates">
                                <div className="singleCardTemplate">
                                    <h4>Patient  </h4>
                                    <span> Prescription Reminder </span>
                                    <p>Hi patient-name, time to take your prescription for medicine. Don't forget! - clinic-name!  </p>
                                    <div className="singleAction">
                                        <span className="editIcon"></span>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                        />
                                    </div>
                                </div>
                                <div className="singleCardTemplate">
                                    <h4>Patient  </h4>
                                    <span> Prescription Reminder </span>
                                    <p>Hi patient-name, time to take your prescription for medicine. Don't forget! - clinic-name!  </p>
                                    <div className="singleAction">
                                        <span className="editIcon"></span>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            }
        </>
    )
}

export default SmsSettigsTab;
