import WraperLayout from '../../components/wraperLayout/WraperLayout';
import ClinicTabReport from '../../components/reports/clinicTabReport/ClinicTabReport';
import { Tabs } from 'antd';
import "./report.scss"
import PatientTabReport from '../../components/reports/patientTabReport/PatientTabReport';
import AppointmentsTabReport from '../../components/reports/appointmentTabReport/AppointmentTabReport';
import FinancialTabReport from '../../components/reports/financialTabReport/FinancialTabReport';
import VitalsTabReport from '../../components/reports/vitalsTabReport/VitalsTabReport';
import ExpenseTabReport from '../../components/reports/expenseTabReport/ExpenseTabReport';
import HealthTabReport from "../../components/reports/healthTabReport/HealthTabReport"

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const isMobileDevice = () => window.innerWidth <= 768; // adjust if needed  
import { useMediaQuery } from '@mui/material'

const Reports = () => {
  const isMobile = useMediaQuery('(max-width:767px)');


  const navigate = useNavigate();
  const location = useLocation();
  const onChange = (key) => {
    console.log(key);
  };
  const [activeTab, setActiveTab] = useState(isMobileDevice() ? null : "1");
  useEffect(() => {
    if (!isMobileDevice()) {
      if (location.state?.activeTab) {
        setActiveTab(location.state.activeTab);
      } else {
        setActiveTab("1");
      }
    } else {
      setActiveTab(null); // No tab active by default on mobile
    }
  }, [location.state?.activeTab]);

  useEffect(() => {
    if (activeTab !== null) {
      localStorage.setItem("activeTab", activeTab);
    }
  }, [activeTab]);



  const HeaderWithBack = ({ title, onBack }) => (
    <div className="headerTabs">
      <button onClick={onBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7.51184 12.96L12.8878 18.336L11.5198 19.68L3.83984 12L11.5198 4.32001L12.8878 5.66401L7.51184 11.04H19.1998V12.96H7.51184Z" fill="#0F75BC" />
        </svg>
      </button>
      {title}
    </div>
  );



  const items = [
    {
      key: '1',
      label: 'Clinics',
      children: (
        <>
          {isMobile && (<><HeaderWithBack title="Clinics" onBack={() => setActiveTab(null)} /></>)}
          <ClinicTabReport />
        </>
      ),
    },
    {
      key: '2',
      label: 'Patients',
      children: (
        <>
          {isMobile && (<><HeaderWithBack title="Patients" onBack={() => setActiveTab(null)} /></>)}
          <PatientTabReport />
        </>
      ),
    },
    {
      key: '3',
      label: 'Appointments',
      children: (
        <>
          {isMobile && (<><HeaderWithBack title="Appointments" onBack={() => setActiveTab(null)} /></>)}
          <AppointmentsTabReport />
        </>
      ),
    },
    {
      key: '4',
      label: 'Financial',
      children: (
        <>
          {isMobile && (<><HeaderWithBack title="Financial" onBack={() => setActiveTab(null)} /></>)}
          <FinancialTabReport />
        </>
      ),
    },
    {
      key: '5',
      label: 'Health Records',
      children: (
        <>
          {isMobile && (<><HeaderWithBack title="Health Records" onBack={() => setActiveTab(null)} /></>)}
          <HealthTabReport navigate={navigate} />
        </>
      ),
    },
    {
      key: '6',
      label: 'Vitals',
      children: (
        <>
          {isMobile && (<><HeaderWithBack title="Vitals" onBack={() => setActiveTab(null)} /></>)}
          <VitalsTabReport />
        </>
      ),
    },
    {
      key: '7',
      label: 'Expense',
      children: (
        <>
          {isMobile && (<><HeaderWithBack title="Expense" onBack={() => setActiveTab(null)} /></>)}
          <ExpenseTabReport />
        </>
      ),
    },
  ];

  return (
    <WraperLayout className="report">
      <div className="report-wrap">
        <Tabs defaultActiveKey="1" activeKey={activeTab}
          onChange={(key) => setActiveTab(key)} items={items} />
      </div>
    </WraperLayout>
  )
}

export default Reports;