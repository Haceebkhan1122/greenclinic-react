import React from 'react'
import { Tab, Tabs } from 'react-bootstrap';
import SummaryTabFinancial from './summaryTabFinanical/SummaryTabFinanical';
import ReportSubFinancialTab from './reportSubFinanicalTab/ReportSubFinanicalTab';
import "./financialTabReport.scss"
import { useMediaQuery } from '@mui/material'

const FinancialTabReport = () => {
  const isMobile = useMediaQuery('(max-width:767px)');

  return (
    <div className='financialTabReportMain'>
      <div className="tabSumarry">
        <Tabs
          defaultActiveKey="Summary"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Summary" title="Summary">
            <SummaryTabFinancial />
          </Tab>
          <Tab eventKey="Report" title="Report">
            <ReportSubFinancialTab />
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default FinancialTabReport