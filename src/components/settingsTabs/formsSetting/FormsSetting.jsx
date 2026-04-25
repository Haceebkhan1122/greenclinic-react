import { Tab, Tabs } from 'react-bootstrap'
import AppointmentFormSetting from './appointmentFormSetting/AppointmentFormSetting'
import { Divider } from 'antd'
import './formsSetting.scss';
import ExaminationFormSetting from './examinationFormSetting/ExaminationFormSetting';
import VitalFormSetting from './vitalFormSetting/VitalFormSetting';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import API from '../../../services/httpInstance';

const FormsSetting = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);

  return (
    <div className='mainContainerForm'>
      <Tabs
        defaultActiveKey="appointmentForm"
        id="uncontrolled-tab-example"
        className="settingsTab"
      >
        <Tab eventKey="appointmentForm" title={isMobile ? "Appointment" : "Appointment Form"}>
          <Divider />
          <AppointmentFormSetting show={show} setShow={setShow} setIsLoading={setIsLoading} handleClose={handleClose} handleShow={handleShow} isLoading={isLoading}  />
        </Tab>
        <Tab eventKey="examination" title="Examination">
          <ExaminationFormSetting show={show} setShow={setShow} handleClose={handleClose} handleShow={handleShow} showDelete={showDelete} handleCloseDelete={handleCloseDelete} handleShowDelete={handleShowDelete} isLoading={isLoading} />
        </Tab>
        <Tab eventKey="vitals" title="Vitals">
          <VitalFormSetting show={show} setShow={setShow} handleClose={handleClose} handleShow={handleShow} showDelete={showDelete} handleCloseDelete={handleCloseDelete} handleShowDelete={handleShowDelete} isLoading={isLoading} />
        </Tab>
      </Tabs>
    </div>
  )
}

export default FormsSetting;
