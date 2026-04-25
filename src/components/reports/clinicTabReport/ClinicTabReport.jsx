import { Tab, Tabs } from 'react-bootstrap';
import './clinicTabReport.scss';
import SummaryTab from './summaryTab/SummaryTab';
import ReportSubClinicTab from './reportSubClinicTab/ReportSubClinicTab';
import { useEffect, useState } from 'react';

const ClinicTabReport = () => {

    return (
        <div className='clinicTabReportMain'>
            <div className="tabSumarry">
                <Tabs
                    defaultActiveKey="Summary"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="Summary" title="Summary">
                        <SummaryTab />
                    </Tab>
                    <Tab eventKey="Report" title="Report">
                        <ReportSubClinicTab />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default ClinicTabReport;
