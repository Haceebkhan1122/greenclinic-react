import { Tab, Tabs } from 'react-bootstrap';
import './appointmentTabReport.scss';
import SummaryTabAppointment from './summaryTabAppointment/SummaryTabAppointment';
import ReportSubAppointmentTab from './reportSubAppointmentTab/ReportSubAppointmentTab';

const AppointmentTabReport = () => {
    return (
        <div className='appointmentTabReportMain'>
            <div className="tabSumarry">
                <Tabs
                    defaultActiveKey="Summary"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="Summary" title="Summary">
                        <SummaryTabAppointment />
                    </Tab>
                    <Tab eventKey="Report" title="Report">
                        <ReportSubAppointmentTab />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default AppointmentTabReport;
