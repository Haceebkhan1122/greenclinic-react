import React, { useEffect, useState } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import ListView from '../../components/listView/ListView';
import CalendarView from '../../components/calendarView/CalendarView';
import ListIcon from "../../assets/images/svg/list_icon.svg"
import CalendarIcon from "../../assets/images/svg/calendar.svg"
import { Tabs } from 'antd';
import "./appointments.scss"
import API from '../../services/httpInstance';
import { useSelector } from 'react-redux';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [doctors, setDoctors] = useState(null);
  const [indicationMessage, setIndicationMessage] = useState("");
  const [showAppointmentsPerm, setShowAppointmentsPerm] = useState(false);
  const [showClinicTabAppointments, setShowClinicTabAppointments] = useState(false);
  const [onlinePermissions, setOnlinePermissions] = useState({});
  const [consultNowPermission, setConsultNowPermission] = useState(false);
  
    const [allowedPermissions, setAllowedPermissions] = useState({});
    let userPermissions = useSelector((state) => state.clinic.userPermissions);

    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "appointments_view");

        const childPermissions = viewPermission?.child || [];
        const perms = {};

        childPermissions.forEach(child => {
            perms[child.slug] = true;
        });
        setAllowedPermissions(perms);
    }, [userPermissions]);

  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "online-appointments");
    const viewPermissionClinic = userPermissions?.find((item) => item.slug === "appointments_view");
    const consultNowPerm = userPermissions?.find((item) => item.slug === "consult_now");
    if (viewPermission && Object.keys(viewPermission).length > 0) {
      setShowAppointmentsPerm(true)
    }
    if (consultNowPerm && Object.keys(consultNowPerm).length > 0) {
      setConsultNowPermission(true)
    }
    if (viewPermissionClinic && Object.keys(viewPermissionClinic).length > 0) {
      setShowClinicTabAppointments(true)
    }
  }, [userPermissions, showClinicTabAppointments]);

  
  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 2000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])

  const getAllDoctors = async () => {
    try {
      const response = await API.get(`/doctor`)
      if (response?.status == 200) {
        setDoctors(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  // get doctor list
  useEffect(() => {
    getAllDoctors()
  }, [])

  const tabitems = [
    {
      key: '1',
      label: <img src={ListIcon} />,
      children: <ListView doctors={doctors} setDoctors={setDoctors} consultNowPermission={consultNowPermission} showAppointmentsPerm={showAppointmentsPerm} showClinicTabAppointments={showClinicTabAppointments}  setIndicationMessage={setIndicationMessage} allowedPermissions={allowedPermissions} />,
    },
    {
      key: '2',
      label: <img src={CalendarIcon} />,
      children: <CalendarView doctors={doctors} showAppointmentsPerm={showAppointmentsPerm} setDoctors={setDoctors} />,
    },
  ];
  return (
    <WraperLayout className={`appointment ${activeTab === "2" ? "calendar-view" : "list-view"}`}>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      <div className='box-white'>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} defaultActiveKey={"1"} items={tabitems} className='view_appointment h-100' />
      </div>
    </WraperLayout>
  )
}

export default Appointments