import React, { useEffect, useState } from 'react'
import { Row, Col, Tab, Tabs } from "react-bootstrap"
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './consultNowEditOffline.scss'
import Cookies from 'js-cookie';
import ConsultNowEditOffilineTabView from '../../components/consultNowEditOffilineTabView/ConsultNowEditOffilineTabView'
import API from '../../services/httpInstance'
import moment from "moment";
import { isMobile } from 'react-device-detect'
import { useSelector } from 'react-redux';

const ConsultNowEditOffline = () => {
    const location = useLocation();
    const { appointmentId, patientId, clinicId, doctorId, appointmentDate } = location.state || {};
    const navigate = useNavigate();
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [template, setTemplate] = useState([])
    // const appointmentId = Cookies.get('itemId');
    // const patientId = Cookies.get('patientId');
    // const doctorId = Cookies.get('doctorId');
    // const clinicId = Cookies.get('clinicId');
    // const appointmentDate = Cookies.get('appointmentDate');
    const completeAppointmentDate = Cookies.get('appointmentCompleteDate');
    const prescriptionsEdit = Cookies.get('prescriptionsEdit');
    const [isFromPrescriptions, setIsFromPrescriptions] = useState(false);
    const [isShowLabReading, setIsShowlabReading] = useState(0)
    const [isDiagnosis, setIsDiagnosis] = useState(0)
    const { state } = useLocation();
    var formattedDate;
    if (completeAppointmentDate) {
        formattedDate = moment(completeAppointmentDate, ["YYYY-MM-DD hh:mm a", "YYYY-MM-DD HH:mm:ss"]).format("YYYY-MM-DD");
        if (!moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
            console.error("Invalid date format:", formattedDate);
            formattedDate = moment().format("YYYY-MM-DD"); // Fallback to today
        }
    } else {
        formattedDate = moment().format("YYYY-MM-DD"); // Fallback to today
    }
    const [patientData, setPatientData] = useState({
        name: state?.name || '',
        age: state?.age || '',
        gender: state?.gender || '',
        visitCount: state?.visitCount || ''
    });

    useEffect(() => {
        if (state?.fromPrescriptions) {
            setIsFromPrescriptions(true);
        }
    }, [state]);

    const getPatientData = async () => {
        try {
            const response = await API.get(`/consult-now/${appointmentId}`);
            setPatientData({
                name: response?.data?.data?.patient_name,
                age: response?.data?.data?.patient_age,
                gender: response?.data?.data?.patient_gender,
                visitCount: response?.data?.data?.visit_count
            });
            setIsShowlabReading(response?.data?.data?.showLabReading)
            setIsDiagnosis(response?.data?.data?.diagnosis)
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        return () => {
            Cookies.remove('prescriptionsEdit');
        };
    }, [navigate]);

    const handleVisitprofile = (patientId) => {
        navigate(`/patient-profile/${patientId}`);
    }

    useEffect(() => {
            getPatientData()
    }, [])
    return (
        <WraperLayout>
            <section className={`consult_now_edit consult_offline ${isFromPrescriptions ? 'from-prescriptions' : ''}`}>
                <div className="patient_detial">
                    <div className="patient">
                        <h3>
                            <span>{patientData.name}</span> {!isMobile && "|"} {patientData.gender} | {patientData.age} Yrs | Visit No: {patientData.visitCount}
                        </h3>
                        <div className='d-lg-none d-block'> <button onClick={() => handleVisitprofile(patientId)} className='visit'>Visit Profile</button></div>
                    </div>
                </div>
                <button onClick={() => handleVisitprofile(patientId)} className='visit d-lg-block d-none'>Visit Profile</button>
                <Row>
                    <Col lg={12}>
                        <div className="wraperOfflineTabs">
                            <Tabs
                                defaultActiveKey="tabView"
                                id="uncontrolled-tab-example"
                                className="tabs_offline"
                            >
                                <Tab eventKey="tabView" title="Tab View">
                                    <ConsultNowEditOffilineTabView setTemplate={setTemplate} isDiagnosis={isDiagnosis} isShowLabReading={isShowLabReading} prescriptionsEdit={prescriptionsEdit} formattedDate={formattedDate} patientName={patientData?.name} template={template} appointmentDate={appointmentDate} appointmentId={appointmentId} patientId={patientId} doctorId={doctorId} clinicId={clinicId} />
                                </Tab>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
            </section>
        </WraperLayout>
    )
}

export default ConsultNowEditOffline