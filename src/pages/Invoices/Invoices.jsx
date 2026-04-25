import { useEffect, useState } from 'react';

import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import InvoiceClinicTab from './invoiceClinicTab/InvoiceClinicTab';
import './invoices.scss';
import WraperLayout from '../../components/wraperLayout/WraperLayout';
import { DatePicker } from 'antd';
import Search from "../../assets/images/svg/search.svg"
import InvoiceOnlineTab from './invoiceOnlineTab/InvoiceOnlineTab';
import InvoicePayoutTab from './invoicePayoutTab/InvoicePayoutTab';
import { useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux';

const Invoices = () => {
  const isMobile = useMediaQuery('(max-width:767px)');

  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    // If screen width > 768px, show default tab
    if (window.innerWidth > 768) {
      setActiveTab('Clinic Appointments');
    }
  }, []);
  const handleBack = () => {
    setActiveTab('');
  };

  const [allowedPermissions, setAllowedPermissions] = useState({});
  const [viewBilling, setViewBilling] = useState(false);
  const [viewOnline, setViewOnline] = useState(false);
  const [viewPayout, setViewPayout] = useState(false);

  let userPermissions = useSelector((state) => state.clinic.userPermissions);

  useEffect(() => {
    let checkViewBiling = userPermissions?.find((item) => item.slug === "billing_view");
    let checkViewOnline = userPermissions?.find((item) => item.slug === "online-appointments");
    let checkPayout = userPermissions?.find((item) => item.slug === "online_payout_view");

    if (checkViewBiling && Object.keys(checkViewBiling)?.length > 0) {
      setViewBilling(true)
    }

    if (checkPayout && Object.keys(checkPayout)?.length > 0) {
      setViewPayout(true)
    }

    if (checkViewOnline && Object.keys(checkViewOnline)?.length > 0) {
      setViewOnline(true)
    }


  }, [userPermissions])

  const HeaderWithBack = ({ title }) => (
    <div className="headerTabs">
      <button onClick={handleBack} className="">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7.51184 12.96L12.8878 18.336L11.5198 19.68L3.83984 12L11.5198 4.32001L12.8878 5.66401L7.51184 11.04H19.1998V12.96H7.51184Z" fill="#0F75BC" />
        </svg>
      </button>
      {title}
    </div>
  );

  

  return (
    <WraperLayout className="patient">
      <div className="box-white invoice__main">
        <div className='wraper_tabs_invoices mobileDesignTabs'> 
          <Tabs
            // activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="consultNowOffilineTabViewTabs"
          >
            {viewBilling &&<Tab eventKey="Clinic Appointments" title="Clinic Appointments">
              {isMobile && (<><HeaderWithBack title="Clinic Appointments" /></>)}
              <InvoiceClinicTab /> 
            </Tab>}
            {viewOnline && <Tab eventKey="Online Appointments" title="Online Appointments">
              {isMobile && (<><HeaderWithBack title="Online Appointments" /></>)}
              <InvoiceOnlineTab />
            </Tab>}
            {viewPayout && <Tab eventKey="Payouts" title="Payouts">
              {isMobile && (<><HeaderWithBack title="Payouts" /></>)}
              <InvoicePayoutTab />
            </Tab>}
          </Tabs>
        </div>
      </div>
    </WraperLayout>
  )
}

export default Invoices;