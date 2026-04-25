import { Tab, Tabs } from 'react-bootstrap';
import './patientTabReport.scss';
import SummaryTabPatient from './summaryTab/SummaryTabPatient';
import ReportSubClinicTabPatient from './reportSubClinicTabPatient/ReportSubClinicTabPatient';

const PatientTabReport = () => {
    return (
        <div className='patientTabReportMain'>
            <div className="tabSumarry">
                <Tabs
                    defaultActiveKey="Summary"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="Summary" title="Summary">
                        <SummaryTabPatient />
                    </Tab>
                    <Tab eventKey="Report" title="Report">
                        <ReportSubClinicTabPatient />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default PatientTabReport;
