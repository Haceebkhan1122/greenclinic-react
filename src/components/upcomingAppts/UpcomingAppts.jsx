import React, { useEffect, useState } from 'react'
import './upcomingAppts.scss';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { customers } from '../../services/data/index';
import { Dropdown } from 'react-bootstrap';
import Stethoscope from "../../assets/images/svg/stethoscope.svg"
import Checkmark from "../../assets/images/svg/checkmark_icon.svg"
import Email from "../../assets/images/svg/email.svg"
import Schedule from "../../assets/images/svg/schedule.svg"
import Refund from "../../assets/images/svg/refund.svg"
import EditInvoice from "../../assets/images/svg/edit.svg"
import PrintInvoice from "../../assets/images/svg/printer.svg"
import PrintToken from "../../assets/images/svg/ticket.svg"
import Reschedule from "../../assets/images/svg/reschedule.svg"
import Delete from "../../assets/images/svg/delete_icon.svg"
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import Cookies from 'js-cookie';
import CheckInModal from '../checkInModal/CheckInModal';
import DeletePastApptsModal from '../modal/deletePastApptsModal/DeletePastApptsModal';
import RefundModalShow from '../modal/refundModalShow/RefundModalShow';
import API, { API_MS } from '../../services/httpInstance';
import MessagePrescModal from '../modal/messagePrescModal/MessagePrescModal';
import BookAppointmentModal from '../modal/bookAppointmentModal/BookAppointmentModal';
import moment from 'moment';
import { useSelector } from 'react-redux';
import AgoraRTM from "agora-rtm-sdk";


const UpcomingAppts = ({ checkInpastAppointments,appointmentsPermissions,allowedPermissions, showMessageBtn, upcomingAppointments, getAppointments, pagination, checkInModal, setCheckInModal, deleteAppointment, generalDeleteModal, setGeneralDeleteModal, handleGeneralDeleteClose, patientData }) => {
  const [confirmId, setConfirmId] = useState(null)
  const [refundShow, setRefundShow] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [amountReceived, setAmountReceived] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [upcomingDataSingle, setUpcomingDataSingle] = useState({})
  const [removeEmail, setRemoveEmail] = useState(false)
  const [bookAppointmentShow, setBookAppointmentShow] = useState(false)
  const [prefilledData, setPrefilledData] = useState(false)
  const [fromUpcomingApp, setFromUpcomingApp] = useState(false)
  const [doctors, setDoctors] = useState(null);
  const handleCloseMessage = () => setShowMessage(false)
  const handleBookAppointmentClose = () => setBookAppointmentShow(false)
  const navigate = useNavigate()
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;
  let doctorData = useSelector((state) => state?.user?.user);

  const getAllDoctors = async () => {
    try {
      const response = await API.get(`/doctor`)
      if (response?.status == 200) {
        setDoctors(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllDoctors()
  }, [])

  const handleRefundShow = (rowData) => {
    setAmountReceived(rowData?.amount_recieve)
    setConfirmId(rowData?.id)
    setRefundShow(true)
  }

  const handleRefundClose = () => {
    setConfirmId(null)
    setRefundShow(false)
  }

  const onPageChange = (event) => {
    const selectedPage = event.page + 1;
    getAppointments(selectedPage);
  };
  const handleDeletePastApptsShow = (appId) => {
    setConfirmId(appId)
    setGeneralDeleteModal(true)
  }

  const openCheckIn = (id) => {
    setConfirmId(id)
    setCheckInModal(true)
  }

  const RefundFunc = async () => {
    const data = {
      refundID: confirmId,
      refund_amount: refundAmount,
      amount_received: amountReceived,
      refund_reason: refundReason
    }
    try {
      const response = await API.post(`/refund`, data)
      if (response?.status == 200) {
        handleRefundClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const printInvoice = async (id) => {
    try {
      const response = await API.get(`/download-invoice-print/${id}`)
      if (response?.status == 200) {
        const pdfUrl = response.data?.data?.url;
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const printToken = async (id) => {
    try {
      const response = await API.get(`/appointment-pdf/${id}`)
      if (response?.status == 200) {
        const pdfUrl = response.data?.data?.url;
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const navigateToConsult = (item) => {
    Cookies.set('itemId', item?.id);
    Cookies.set('patientId', item?.patient_id);
    Cookies.set('doctorId', item?.doctor_id);
    Cookies.set('clinicId', item?.clinic_id);
    Cookies.set('appointmentCompleteDate', item?.appointment_completed_at);
    Cookies.remove("prescriptionsAdd")
    Cookies.remove("prescriptionsEdit")
    navigate(`/consult-now`)
  }

  const showMessageBox = (item) => {
    setRemoveEmail(false)
    setUpcomingDataSingle(item)
    setShowMessage(true)
  }

  const handleReshedule = (item) => {
    setBookAppointmentShow(true)
    setFromUpcomingApp(true)
    setPrefilledData(item)
  }


  async function emitAppointmentStart(e, appt) {
    e.preventDefault();

    const appointmentId = appt?.id;

    // Handle In-Person Consult
    if (appt.consultation_type === "In Person") {
      Cookies.remove("prescriptionsAdd")
      Cookies.remove("prescriptionsEdit")
      Cookies.remove("patientClose")
      navigate("/consult-now", {
        state: {
          appointmentId: appointmentId,
          patientId: appt?.patient_id,
          doctorId: appt?.doctor_id,
          clinicId: appt?.clinic_id,
          appointmentDate: appt?.appointment_date,
        },
      });
      return;
    }

    let options = {
      uid: "",
      token: "",
    };
    const appID = import.meta.env.VITE_REACT_APP_AGORA_APP_ID;

    let token;
    let channelName = `${appointmentId}`;
    const response = await API_MS.get(`/generate-agora-rtm-token?user_id=${doctorData?.id}`);
    if (response?.status == 200) {
      token = response?.data?.data?.token;

      if (token) options.token = token;

      if (appID && channelName) {
        const client = AgoraRTM.createInstance(appID);

        await client.login({ token, uid: `${doctorData?.id}` });

        let channel = client.createChannel(channelName);

        await channel.join();

        await channel
          .sendMessage({ text: "appointment-started" })
          .then(() => {
            navigate(`/online-consultation`, {
              state: {
                appointmentId: appointmentId,
                patientId: appt?.patient_id,
                doctorId: appt?.doctor_id,
                clinicId: appt?.clinic_id,
                appointmentDate: appt?.appointment_date,
              },
            });
          });
      }
    }
  }


  const priceBodyTemplate = (rowData) => {
    console.log("row", rowData);
    return (
      <Dropdown className="dropdownUpcoming">
        <Dropdown.Toggle id="dropdown-basic">
          <span className="menuIcon"></span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item className="ancLink">
            <button className="button12" disabled={moment().isBefore(moment(rowData?.time, "h:mm a").subtract(5, "minutes"))} onClick={(e) => emitAppointmentStart(e, rowData)}>
              <img src={Stethoscope} alt="" className="tw-w-[16px]" />
              Consult Now
            </button>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => openCheckIn(rowData?.id)} className="ancLink">
            <img src={Checkmark} alt="" className="tw-w-[16px]" />
            Check In
          </Dropdown.Item>
          {appointmentsPermissions["appointments_add"] && <Dropdown.Item onClick={() => handleReshedule(rowData)} className="ancLink">
            <img src={Reschedule} alt="" className="tw-w-[16px]" />
            Reschedule
          </Dropdown.Item>}
          {showMessageBtn && <Dropdown.Item onClick={() => showMessageBox(rowData)} className="ancLink">
            <img src={Email} alt="" className="tw-w-[16px]" />
            Message
          </Dropdown.Item>}
          {allowedPermissions["refund_add"] && <Dropdown.Item onClick={() => handleRefundShow(rowData)} className="ancLink">
            <img src={Refund} alt="" className="tw-w-[16px]" />
            Refund
          </Dropdown.Item>}
          {appointmentsPermissions["appointments_update"] && <Dropdown.Item className="ancLink" >
            <img src={EditInvoice} alt="" className="tw-w-[16px]" />
            Edit Invoice
          </Dropdown.Item>}
          <Dropdown.Item onClick={() => printInvoice(rowData?.id)} className="ancLink">
            <img src={PrintInvoice} alt="" className="tw-w-[16px]" />
            Print Invoice
          </Dropdown.Item>
          <Dropdown.Item onClick={() => printToken(rowData?.id)} className="ancLink">
            <img src={PrintToken} alt="" className="tw-w-[16px]" />
            Print Token
          </Dropdown.Item>
          {appointmentsPermissions["appointments_delete"] && <Dropdown.Item onClick={() => handleDeletePastApptsShow(rowData.id)} className="ancLink">
            <img src={Delete} alt="" className="tw-w-[16px]" />
            Delete
          </Dropdown.Item>}
        </Dropdown.Menu>
      </Dropdown>
    );
  };


  return (
    <div className="upcomingApptsMain">
      <div className="table__wrape tablePrime">
        <DataTable
          value={upcomingAppointments}
          paginator
          rows={pagination?.per_page || 10}
          totalRecords={pagination?.total || 0}
          lazy
          onPage={onPageChange}
          first={(pagination?.current_page - 1) * pagination?.per_page || 0}
          paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
          currentPageReportTemplate="{first} - {last} of {totalRecords}"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="token" header="Token No." style={{ width: "15%" }}></Column>
          <Column field="mr_no" header="MR No." style={{ width: "15%" }}></Column>
          <Column field="doctor_name" header="Doctor" style={{ width: "20%" }}></Column>
          <Column field="web_appointment_date" header="Date" style={{ width: "20%" }}></Column>
          <Column field="time" header="Time" style={{ width: "15%" }}></Column>
          <Column field="source" header="Source" style={{ width: "15%" }}></Column>
          <Column field="" header="" style={{ width: "15%" }} body={priceBodyTemplate}></Column>
        </DataTable>
      </div>
      <CheckInModal checkInpastAppointments={checkInpastAppointments} confirmId={confirmId} setCheckInModal={setCheckInModal} checkInModal={checkInModal} />
      <DeletePastApptsModal appointmentType={"Upcoming"} appointmentId={confirmId} deleteAppointment={deleteAppointment} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />
      <RefundModalShow confirmId={confirmId} RefundFunc={RefundFunc} setRefundAmount={setRefundAmount} refundAmount={refundAmount} setAmountReceived={setAmountReceived} amountReceived={amountReceived} setRefundReason={setRefundReason} refundReason={refundReason} handleRefundClose={handleRefundClose} refundShow={refundShow} />
      <MessagePrescModal handleCloseMessage={handleCloseMessage} showMessage={showMessage} prescriptionProfile={upcomingDataSingle} clinicId={patientData?.clinic_id} patientId={patientData?.id} doctorId={patientData?.doctor_id} number={upcomingDataSingle?.patient_phone} prescriptionId={patientData?.appointment_id} removeEmail={removeEmail} />
      <BookAppointmentModal
        bookAppointmentShow={bookAppointmentShow}
        setBookAppointmentShow={setBookAppointmentShow}
        handleBookAppointmentClose={handleBookAppointmentClose}
        prefilledData={prefilledData}
        doctors={doctors}
        fromUpcomingApp={fromUpcomingApp} />
    </div>
  );
}

export default UpcomingAppts;
