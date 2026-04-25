import { Col, Tab, Tabs } from 'react-bootstrap';
import WraperLayout from '../../wraperLayout/WraperLayout'
import SmsSettigsTab from './tabs/smsSettigsTab/SmsSettigsTab';
import SmsLogTab from './tabs/smsLogTab/SmsLogTab';
import './smsSettings.scss';
import MyRequestTab from './tabs/myRequestTab/MyRequestTab';
import { useEffect, useState } from 'react';
import API from '../../../services/httpInstance';
import Loader from '../../loader/Loader';
import { useMediaQuery } from '@mui/material';

const SmsSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [smsSettingsData, setSmsSettingsData] = useState([]);
  const isMobile = useMediaQuery('(max-width:767px)');
  const [activeTab, setActiveTab] = useState(isMobile ? '' : "settings");  

  useEffect(() => {
    getSmsSettings();
  }, []);

  const getSmsSettings = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/sms-setting-data`);
      if (response?.status == 200) {
        setSmsSettingsData(response?.data?.data);
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (window.innerWidth > 768) {
      setActiveTab('settings');
    }
  }, []);


  const handleBack = () => {
    setActiveTab('');
  };

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
    <>
      {isMobile
        ?
        <WraperLayout className="patient smsSettingsMainMobile">
          <div className="box-white invoice__main">
            <div className='wraper_tabs_invoices mobileDesignTabs'>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="consultNowOffilineTabViewTabs"
              >
                <Tab eventKey="Settings" title="Settings">
                  {isMobile && (<><HeaderWithBack title="Settings" /></>)}
                  <SmsSettigsTab smsSettingsData={smsSettingsData} getSmsSettings={getSmsSettings} isLoading={isLoading} setIsLoading={setIsLoading} />
                </Tab>
                <Tab eventKey="SMS Log" title="SMS Log">
                  {isMobile && (<><HeaderWithBack title="SMS Log" /></>)}
                  <SmsLogTab />
                </Tab>
                <Tab eventKey="My Request" title="My Request">
                  {isMobile && (<><HeaderWithBack title="My Request" /></>)}
                  <MyRequestTab />
                </Tab>
              </Tabs>
            </div>
          </div>
        </WraperLayout>
        :
        <WraperLayout>
          {isLoading ?
            <Loader />
            :
            (<>
              <div className={"smsSettingsMain"}>
                <Col lg={12}>
                  <Tabs
                    id="uncontrolled-tab-example"
                    className={"smsSettingsTab"}
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    defaultActiveKey={"settings"}
                  >
                    <Tab eventKey="settings" title="Settings">
                      <SmsSettigsTab smsSettingsData={smsSettingsData} getSmsSettings={getSmsSettings} isLoading={isLoading} setIsLoading={setIsLoading} />
                    </Tab>
                    <Tab eventKey="smsLog" title="SMS Log">
                      <SmsLogTab />
                    </Tab>
                    <Tab eventKey="myRequest" title="My Request">
                      <MyRequestTab />
                    </Tab>
                  </Tabs>
                </Col>
              </div>
            </>)}
        </WraperLayout>
      }
    </>
  )
}

export default SmsSettings


