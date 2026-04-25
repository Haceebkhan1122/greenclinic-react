import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { Divider } from 'antd'
import './printSettings.scss';
import PrescriptionSetting from './prescriptionPrintSetting/PrescriptionPrintSetting';
import InvoiceSetting from './invoicePrintSetting/InvoicePrintSetting';
import TokenPrintSetting from './tokenPrintSetting/TokenPrintSetting';
import InvoicePrintSetting2 from './invoicePrintSetting/InvoicePrintSetting';
import InvoicePrintSetting from './invoicePrintSetting/InvoicePrintSetting';

const PrintSettings = () => {
  return (
    <div className='wrap-tab print_setting'>
      <Tabs
        defaultActiveKey="prescription"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="prescription" title="Prescription">
          <PrescriptionSetting />
        </Tab>
        <Tab eventKey="invoice" title="Invoice">
          <InvoicePrintSetting />
        </Tab>
        <Tab eventKey="token" title="Token">
          <TokenPrintSetting />
        </Tab>
      </Tabs>
    </div>
  )
}

export default PrintSettings