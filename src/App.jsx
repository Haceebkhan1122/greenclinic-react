import './assets/css/global.scss';
import { Route, Routes } from 'react-router-dom';
import Appointments from "./pages/Appointments/Appointments";
import Patients from "./pages/Patients/Patients";
import Layouts from './layouts/Layouts';
import Prescriptions from './pages/Prescriptions/Prescriptions';
import Reports from './pages/Reports/Reports';
import Invoices from './pages/Invoices/Invoices';
import Login from './pages/Login/Login';
import SignupPage from './pages/signup/Signup';
import SelectClinic from './pages/selectClinic/SelectClinic';
import Dashboard from './components/dashboard/Dashboard';
import Settings from './pages/settings/Settings';
import ManageDoctor from './components/manageDoctor/ManageDoctor';
import UpdateNotification from './pages/updateNotification/UpdateNotification';
import VideoGuide from './pages/videoGuide/VideoGuide';
import PateintProfile from './pages/pateintProfile/PateintProfile';
import ViewHistory from './pages/viewHistory/ViewHistory';
import ConsultNowOffline from './pages/consultNowOffline/ConsultNowOffline';
import ConsultNowOnline from './pages/consultNowOnline/ConsultNowOnline';
import HealthReportMedications from './components/reports/healthTabReport/healthReportMedications/HealthReportMedications';
import HealthReportLab from './components/reports/healthTabReport/healthReportLab/HealthReportLab';
import HealthReportProcedures from './components/reports/healthTabReport/healthReportProcedures/HealthReportProcedures';
import HealthReportReasonVisit from './components/reports/healthTabReport/healthReportReasonVisit/HealthReportReasonVisit';
import HealthReportAllergies from './components/reports/healthTabReport/healthReportAllergies/HealthReportAllergies';
import HealthReportPastMedicalHistory from './components/reports/healthTabReport/healthReportPastMedicalHistory/HealthReportPastMedicalHistory';
import HealthReportIndications from './components/reports/healthTabReport/healthReportIndications/HealthReportIndications';
import PrescriptionProfile from './components/prescriptionProfile/PrescriptionProfile';
import Expenses from './pages/Expenses/Expenses';
import MyProfileUpdate from './pages/myProfileUpdate/MyProfileUpdate';
import MobileOnlineInvoiceView from './pages/mobileOnlineInvoiceView/MobileOnlineInvoiceView';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import { useSelector } from 'react-redux';
import Loader from './components/loader/Loader';
import ConsultNowEditOffline from './pages/consultNowEditOffline/ConsultNowEditOffline';
import AuditLog from './pages/auditLog/AuditLog';

function App() {
  const isPending = useSelector((state) => state.user.isPending);
  if (isPending) {
    return <Loader />;
  }
  return (
    <Layouts>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route exact path="/register" element={<SignupPage />} />
        <Route exact path="/select-clinic" element={<SelectClinic />} />
        <Route exact path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/appointments" element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute>
            <Patients />
          </ProtectedRoute>
        } />
        <Route path="/prescriptions" element={
          <ProtectedRoute>
            <Prescriptions />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/invoices" element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        } />
        <Route path="/expenses" element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        } />
        <Route exact path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/manage-doctor" element={
          <ProtectedRoute>
            <ManageDoctor />
          </ProtectedRoute>
        } />
        <Route path="/update-notification" element={
          <ProtectedRoute>
            <UpdateNotification />
          </ProtectedRoute>
        } />
        <Route path="/video-guide" element={
          <ProtectedRoute>
            <VideoGuide />
          </ProtectedRoute>
        } />
        <Route path="/patient-profile/:id" element={
          <ProtectedRoute>
            <PateintProfile />
          </ProtectedRoute>
        } />
        <Route path="/prescription-profile/:id" element={
          <ProtectedRoute>
            <PrescriptionProfile />
          </ProtectedRoute>
        } />
        <Route path="/view-history/:id" element={
          <ProtectedRoute>
            <ViewHistory />
          </ProtectedRoute>
        } />
        <Route path="/consult-now" element={
          <ProtectedRoute>
            <ConsultNowOffline />
          </ProtectedRoute>
        } />
        <Route path="/audit-log" element={
          <ProtectedRoute>
            <AuditLog />
          </ProtectedRoute>
        } />
        <Route path="/consult-now-edit" element={
          <ProtectedRoute>
            <ConsultNowEditOffline />
          </ProtectedRoute>
        } />
        <Route path="/online-consultation" element={
          <ProtectedRoute>
            <ConsultNowOnline />
          </ProtectedRoute>
        } />
        <Route path="/medications" element={
          <ProtectedRoute>
            <HealthReportMedications />
          </ProtectedRoute>
        } />
        <Route path="/labs" element={
          <ProtectedRoute>
            <HealthReportLab />
          </ProtectedRoute>
        } />
        <Route path="/procedures" element={
          <ProtectedRoute>
            <HealthReportProcedures />
          </ProtectedRoute>
        } />
        <Route path="/reason-visit" element={
          <ProtectedRoute>
            <HealthReportReasonVisit />
          </ProtectedRoute>
        } />
        <Route path="/allergies" element={
          <ProtectedRoute>
            <HealthReportAllergies />
          </ProtectedRoute>
        } />
        <Route path="/past-medical-history" element={
          <ProtectedRoute>
            <HealthReportPastMedicalHistory />
          </ProtectedRoute>
        } />
        <Route path="/indications" element={
          <ProtectedRoute>
            <HealthReportIndications />
          </ProtectedRoute>
        } />
        <Route path="/profile-update" element={
          <ProtectedRoute>
            <MyProfileUpdate />
          </ProtectedRoute>
        } />
        <Route path="/view-online-invoice" element={
          <ProtectedRoute>
            <MobileOnlineInvoiceView />
          </ProtectedRoute>
        } />
      </Routes>
    </Layouts>
  );
}

export default App;
