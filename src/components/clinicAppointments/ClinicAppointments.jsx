/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Table, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import More from "../../assets/images/svg/more.svg"
import Checkmark from "../../assets/images/svg/checkmark_icon.svg"
import Email from "../../assets/images/svg/email.svg"
import Reschedule from "../../assets/images/svg/reschedule.svg"
import Schedule from "../../assets/images/svg/schedule.svg"
import Refund from "../../assets/images/svg/refund.svg"
import Printer from "../../assets/images/svg/printer.svg"
import Ticket from "../../assets/images/svg/ticket.svg"
import Delete from "../../assets/images/svg/delete.svg"
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import AddInvoiceModal from '../modal/addInvoiceModal/AddInvoiceModal'
import API from '../../services/httpInstance';
import CheckInModal from '../checkInModal/CheckInModal';
import RefundModalShow from '../modal/refundModalShow/RefundModalShow';
import MessagePrescModal from '../modal/messagePrescModal/MessagePrescModal';
import Cookies from 'js-cookie';
import BookAppointmentModal from '../modal/bookAppointmentModal/BookAppointmentModal';
import { toast, ToastContainer } from 'react-toastify';
import DeleteListModal from "../modal/deleteListModal/DeleteListModal"
import UploadFileCalendar from '../modal/uploadFileCalendar/uploadFileCalendar';
import PartialPaymentModal from '../modal/partialpaymentModal/PartialPaymentModal';
import EditInvoiceModal from '../modal/editInvoiceModal/EditInvoiceModal';
import ViewInvoiceModal from '../modal/viewInvoiceModal/ViewInvoiceModal';

const ClinicAppointments = ({
  isStatusChecked,
  isAmountChecked,
  isLastVisitChecked,
  isTimeChecked,
  isSourceChecked,
  isAppointmentTypeChecked,
  isTimeSlotChecked,
  isCheckInChecked,
  isMrChecked,
  isPatientNameChecked,
  isNumberChecked,
  filteredData,
  paginateCountData,
  currentPage,
  handlePageClick,
  totalPages,
  patientData,
  getClinicAppointmentsListing,
  setIndicationMessage,
  allowedPermissions,
  consultNowPermission,
}) => {
  const [addInvoice, setAddInvoice] = useState(false);
  const [consultationFees, setConsultationFees] = useState('');
  const [doctorId, setDoctorId] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [doctorProcedures, setDoctorProcedures] = useState([]);
  const [doctorProceduresQuantity, setDoctorProceduresQuantity] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [consultationDiscount, setConsultationDiscount] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState('');
  const [totalAmountReceivedError, setTotalAmountReceivedError] = useState('');
  const [totalConsultation, setTotalConsultation] = useState(null);
  const [totalValueBeforeDiscount, setTotalValueBeforeDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [appliedConsultationDiscount, setAppliedConsultationDiscount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState('');
  const [removeEmail, setRemoveEmail] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [viewInvoice, setViewInvoice] = useState(false)
  const [upcomingDataSingle, setUpcomingDataSingle] = useState({})
  const [doctors, setDoctors] = useState(null);
  const [uploadRecord, setUploadRecord] = useState();
  const [partialPaymentShow, setPartialPaymentShow] = useState(false)
  const navigate = useNavigate()
  const [procedureRows, setProcedureRows] = useState([
    {
      id: 1,
      selectedProcedure: null,
      selectedQuantity: '',
      procedureAmount: '',
      discountProcedure: '',
      finalDiscount: '',
      calculatonValue: ''
    }
  ]);

  useEffect(() => {

  }, [filteredData])

  const [checkInModal, setCheckInModal] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [refundShow, setRefundShow] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [amountReceived, setAmountReceived] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [messages, setMessages] = useState([]);
  const [generalDeleteModal, setGeneralDeleteModal] = useState(false)
  const [prefilledData, setPrefilledData] = useState(false)
  const [showHealthRecord, setShowHealthRecord] = useState(false);
  const [bookAppointmentShow, setBookAppointmentShow] = useState(false)
  const [editInvoiceShow, setEditInvoiceShow] = useState(false)
  const [partialPaymentId, setPartialPaymentId] = useState(false)
  const handleCloseMessage = () => setShowMessage(false)

  const handleCloseHealthModal = () => setShowHealthRecord(false)

  const handleGeneralDeleteClose = () => setGeneralDeleteModal(false)
  const handleBookAppointmentClose = () => setBookAppointmentShow(false)

  const handlePartialPaymentClose = () => setPartialPaymentShow(false)
  const [isRescheduling, setIsRescheduling] = useState(false);

  const handleEditInvoiceShow = () => setEditInvoiceShow(true)
  const handleEditInvoiceClose = () => setEditInvoiceShow(false)

  const openCheckIn = (id) => {
    setCheckInModal(true)
    setConfirmId(id)
  }

  const handleDeleteShow = (id) => {
    setConfirmId(id)
    setGeneralDeleteModal(true)
  }

  const handleRefundShow = (id) => {
    setConfirmId(id)
    const selectedItem = filteredData.find(item => item.id === id);
    if (selectedItem) {
      setAmountReceived(selectedItem?.amount_recieve);
    }
    setRefundShow(true)
  }

  const handleRefundClose = () => {
    setConfirmId(null)
    setRefundShow(false)
  }

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

  const handlePartialPaymentShow = (item) => {
    setPartialPaymentId(item?.id)
    setPartialPaymentShow(true)
  }

  useEffect(() => {
    getClinicAppointmentsListing();
  }, [partialPaymentId, partialPaymentShow])


  const deleteAppointment = async (id) => {
    try {
      const response = await API.delete(`/delete-appt?appt_id=${id}`)
      if (response?.status == 200) {
        setIndicationMessage(response?.data?.message)
        handleGeneralDeleteClose()
        getClinicAppointmentsListing()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkInpastAppointments = async (id) => {
    const data = { appointment_id: id }
    if (id) {
      try {
        const response = await API.post('/check-in', data)
        if (response?.status == 200) {
          getClinicAppointmentsListing()
          setCheckInModal(false)
        } else {
          setCheckInModal(false)
          toast.error(response?.data?.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getMessages = async () => {
    try {
      const response = await API.get(`/get-patient-messages?patientId=${id}`)
      if (response?.status == 200) {
        setMessages(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const showMessageBox = (item) => {
    setRemoveEmail(true)
    setUpcomingDataSingle(item)
    setShowMessage(true)
  }

  const RefundFunc = async () => {
    const data = {
      refundID: confirmId,
      refund_amount: refundAmount,
      amount_received: amountReceived,
      refund_reason: refundReason
    }
    if (!refundAmount) {
      toast.error("Refund amount is required", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      getClinicAppointmentsListing()
    }
    else if (!refundReason) {
      toast.error("Refund reason is required", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    } else {
      try {
        const response = await API.post(`/refund`, data)
        if (response?.status == 200) {
          setRefundShow(false)
          setRefundAmount("")
          setAmountReceived("")
          setRefundReason("")
          setIndicationMessage(response?.data?.message)
          setRefundReason('')
          handleRefundClose()
        } else {
          toast.error(response?.data?.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
      } catch (error) {
        console.log(error)
      }
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

  const printPrecscription = async (id) => {
    try {
      const response = await API.get(`/patient-presc-download/${id}`)
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
  useEffect((id) => {
    if (id) {
      getMessages()
    }
  }, [])

  const handleOpenInvoice = (item) => {
    getClinicAppointmentsListing();
    setDoctorId(item?.doctor_id)
    setAppointmentId(item?.id)
    setAddInvoice(true)
  }

  const handleAddInvoiceClose = () => setAddInvoice(false)

  const handleConsultationFees = async () => {
    try {
      const response = await API.get(`/consulation-fee/${doctorId}`)
      if (response?.status == 200) {
        setConsultationFees(response?.data?.data?.consultation_fee)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleProcedure = async () => {
    try {
      const response = await API.get(`/procedures/${doctorId}`)
      if (response?.status == 200) {
        setDoctorProcedures(response?.data?.data?.data)
        setDoctorProceduresQuantity(response?.data?.data?.quantity)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowHealthModal = (item) => {
    setShowHealthRecord(true)
  }

  const handleViewInvoiceShow = (item) => {
    setSelectedAppointment(item)
    setViewInvoice(true)
  }

  const handleViewInvoiceClose = () => setViewInvoice(false)

  useEffect(() => {
    if (doctorId) {
      handleConsultationFees()
      handleProcedure()
    }
  }, [doctorId])

  const subTotal = Number(totalValueBeforeDiscount) + Number(consultationFees);
  const grandDiscount = Number(totalDiscount) + Number(appliedConsultationDiscount);
  const effectiveConsultation = totalConsultation !== null ? Number(totalConsultation) : Number(consultationFees);
  const grandTotalAmount = Math.max(
    Number(totalAmount) + effectiveConsultation,
    0
  )
  const remainingAmount = grandTotalAmount - Number(totalAmountReceived);

  const postBookAnAppointment = async (print) => {
    let hasError = false;

    if (!totalAmountReceived) {
      setTotalAmountReceivedError("Enter amount recived")
      hasError = true;
    } else {
      setTotalAmountReceivedError("")
    }
    const payload = {
      appointment_id: appointmentId,
      invoicecheck: totalAmountReceived ? '1' : '0',
      consultation_fees: consultationFees,
      fee_discount: appliedConsultationDiscount,
      procedure: procedureRows?.map((item) => ({
        amount: Number(item?.procedureAmount) || 0,
        id: item?.selectedProcedure || null,
        discount: item?.finalDiscount !== '' && item?.finalDiscount !== null
          ? Number(item?.finalDiscount)
          : 0,
      })),
      payment_mode: paymentMethods,
      amount_rec: totalAmountReceived,
      sub_total: subTotal,
      discount: grandDiscount,
      grand_total: grandTotalAmount,
      remaining_amount: remainingAmount,
      is_print_new: print == 1 ? '1' : '0',
    }
    try {
      const response = await API.post(`/add-patient-invoices`, payload)
      if (response?.status == 200) {
        getClinicAppointmentsListing();
        if (print == '1') {
          downloadAppointment(response?.data?.data)
        }
        setAddInvoice(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const downloadAppointment = async () => {
    try {
      const response = await API.get(`/download-appointment-pdf/${appointmentId}`)
      if (response?.status == 200) {
        const pdfUrl = response.data?.data?.url;
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleConsultNowOffline = (item) => {
    const { id: appointmentId, patient_id, clinic_id, doctor_id, appointment_completed_at } = item;
    Cookies.remove("prescriptionsAdd")
    Cookies.remove("prescriptionsEdit")
    Cookies.remove("patientClose")
    navigate('/consult-now', {
      state: {
        appointmentId,
        patientId: patient_id,
        clinicId: clinic_id,
        doctorId: doctor_id,
        appointmentDate: appointment_completed_at
      }
    });
  }

  const handleReshedule = (data) => {
    setBookAppointmentShow(true)
    setPrefilledData(data)
    setIsRescheduling(true);
  }
  return (
    <>
      <div className='d-lg-none d-block mobBox'>
        {filteredData?.length > 0 && filteredData?.map((item) => {
          return (
            <div className='appointmentBox'>
              <div className='headerAppointment'>
                <h5> {isTimeChecked == true && (
                  <span>
                    {item?.last_visit} | {item?.time}
                  </span>
                )}</h5>
                <div className='rightBox'>
                  <div className='buttons'>
                    {item?.appointment_status && (
                      <Link className='button2 completed'>
                        {item?.appointment_status == 'confirmed' ?
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                            <path d="M0 7.5C0 3.63401 3.13401 0.5 7 0.5C10.866 0.5 14 3.63401 14 7.5C14 11.366 10.866 14.5 7 14.5C3.13401 14.5 0 11.366 0 7.5Z" fill="#7CC14B" />
                            <path d="M6.18073 10.1832L10.2932 6.07067L9.47656 5.254L6.18073 8.54984L4.51823 6.88734L3.70156 7.704L6.18073 10.1832ZM6.9974 13.3332C6.19045 13.3332 5.43212 13.18 4.7224 12.8738C4.01267 12.5675 3.39531 12.1519 2.87031 11.6269C2.34531 11.1019 1.92969 10.4846 1.62344 9.77484C1.31719 9.06512 1.16406 8.30678 1.16406 7.49984C1.16406 6.69289 1.31719 5.93456 1.62344 5.22484C1.92969 4.51512 2.34531 3.89775 2.87031 3.37275C3.39531 2.84775 4.01267 2.43213 4.7224 2.12588C5.43212 1.81963 6.19045 1.6665 6.9974 1.6665C7.80434 1.6665 8.56267 1.81963 9.2724 2.12588C9.98212 2.43213 10.5995 2.84775 11.1245 3.37275C11.6495 3.89775 12.0651 4.51512 12.3714 5.22484C12.6776 5.93456 12.8307 6.69289 12.8307 7.49984C12.8307 8.30678 12.6776 9.06512 12.3714 9.77484C12.0651 10.4846 11.6495 11.1019 11.1245 11.6269C10.5995 12.1519 9.98212 12.5675 9.2724 12.8738C8.56267 13.18 7.80434 13.3332 6.9974 13.3332ZM6.9974 12.1665C8.30017 12.1665 9.40365 11.7144 10.3078 10.8103C11.212 9.90609 11.6641 8.80262 11.6641 7.49984C11.6641 6.19706 11.212 5.09359 10.3078 4.18942C9.40365 3.28525 8.30017 2.83317 6.9974 2.83317C5.69462 2.83317 4.59115 3.28525 3.68698 4.18942C2.78281 5.09359 2.33073 6.19706 2.33073 7.49984C2.33073 8.80262 2.78281 9.90609 3.68698 10.8103C4.59115 11.7144 5.69462 12.1665 6.9974 12.1665Z" fill="white" />
                          </svg> : ''}
                        {item?.appointment_status}</Link>
                    )}
                    {/* <button disabled={item?.is_invoice === 0} onClick={() => handleOpenInvoice(item)} className='button1'>ADD INVOICE</button> */}
                    {/* <Link to={`/consult-now/${item?.id}`} className='button2'>CONSULT</Link> */}
                    <Dropdown className='dropdownUpcoming'>
                      <Dropdown.Toggle id="dropdown-basic">
                        <img src={More} alt="" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item disabled={item?.is_checkin == 1} onClick={() => openCheckIn(item?.id)} className="ancLink">
                          <img src={Checkmark} alt="" className="tw-w-[16px]" />
                          Check In
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleReshedule(item)} className="ancLink">
                          <img src={Schedule} alt="" className="tw-w-[16px]" />
                          Reschedule
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleShowHealthModal(item)} className="ancLink">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <g clip-path="url(#clip0_156_5459)">
                              <path d="M5.5 10.4868L6.205 11.1918L7.5 9.90182V13.9868H8.5V9.90182L9.795 11.1918L10.5 10.4868L8 7.98682L5.5 10.4868Z" fill="#0F75BC" />
                              <path d="M11.7509 12.4866H11.5009V11.4866H11.7509C12.3476 11.5105 12.9294 11.2963 13.3683 10.8912C13.8071 10.4862 14.067 9.92334 14.0909 9.3266C14.1148 8.72987 13.9006 8.14809 13.4955 7.70925C13.0905 7.27042 12.5276 7.01047 11.9309 6.9866H11.5009L11.4509 6.5766C11.34 5.73483 10.9268 4.96207 10.2885 4.40229C9.65006 3.84251 8.82996 3.53388 7.98091 3.53388C7.13185 3.53388 6.31175 3.84251 5.67336 4.40229C5.03497 4.96207 4.62183 5.73483 4.51091 6.5766L4.50091 6.9866H4.07091C3.47417 7.01047 2.91135 7.27042 2.50628 7.70925C2.1012 8.14809 1.88704 8.72987 1.91091 9.3266C1.93478 9.92334 2.19472 10.4862 2.63356 10.8912C3.07239 11.2963 3.65417 11.5105 4.25091 11.4866H4.50091V12.4866H4.25091C3.44911 12.4815 2.67749 12.1802 2.0844 11.6406C1.49131 11.1011 1.11861 10.3613 1.03797 9.56354C0.957328 8.76579 1.17443 7.96639 1.64753 7.31903C2.12064 6.67167 2.81635 6.22204 3.60091 6.0566C3.81676 5.04986 4.37132 4.14759 5.17206 3.50034C5.9728 2.85308 6.97128 2.5 8.00091 2.5C9.03053 2.5 10.029 2.85308 10.8297 3.50034C11.6305 4.14759 12.1851 5.04986 12.4009 6.0566C13.1855 6.22204 13.8812 6.67167 14.3543 7.31903C14.8274 7.96639 15.0445 8.76579 14.9638 9.56354C14.8832 10.3613 14.5105 11.1011 13.9174 11.6406C13.3243 12.1802 12.5527 12.4815 11.7509 12.4866Z" fill="#0F75BC" />
                            </g>
                            <defs>
                              <clipPath id="clip0_156_5459">
                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                              </clipPath>
                            </defs>
                          </svg>
                          Upload File
                        </Dropdown.Item>
                        <Dropdown.Item href="/" className="ancLink">
                          <img src={Email} alt="" className="tw-w-[16px]" />
                          Message
                        </Dropdown.Item>
                        <Dropdown.Item disabled={item?.is_refund_enable == 0} onClick={() => handleRefundShow(item?.id)} className="ancLink">
                          <img src={Refund} alt="" className="tw-w-[16px]" />
                          Refund
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleEditInvoiceShow} className="ancLink">
                          <img src={Printer} alt="" className="tw-w-[16px]" />
                          Edit Invoice
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => printInvoice(item?.id)} className="ancLink">
                          <img src={Printer} alt="" className="tw-w-[16px]" />
                          Print Invoice
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => printToken(item?.id)} className="ancLink">
                          <img src={Ticket} alt="" className="tw-w-[16px]" />
                          Print Token
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeleteShow(item?.id)} className="ancLink">
                          <img src={Delete} alt="" className="tw-w-[16px]" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div className='boxUserApp'>
                <h3>{isPatientNameChecked == true && (
                  <span>{item?.patient_name}</span>
                )}
                  {isMrChecked == true && (
                    <span className='number'>{item?.patient_number}</span>
                  )}</h3>
                <h5>
                  {isAmountChecked == true && (
                    <span>PKR {item?.amount_recieve}</span>
                  )}
                  <button onClick={() => handleConsultNowOffline(item)} className='consult'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6.87891 15.2368L11.8789 10.2368L6.87891 5.23682" stroke="#5E6366" stroke-width="1.69847" stroke-linecap="round" stroke-linejoin="round" />
                  </svg></button>
                </h5>
              </div>
            </div>
          )
        })}
      </div>
      <div className='d-none d-lg-block h-100'>
        <Table responsive >
          <thead>
            <tr>
              <th className='yellow-bg text-center'>Token #</th>
              {isMrChecked == true && (
                <th>MR #</th>
              )}
              {isPatientNameChecked == true && (
                <th>Patient Name</th>
              )}
              {isNumberChecked == true && (
                <th>Number</th>
              )}
              {isAppointmentTypeChecked == true && (
                <th>Appointment Type</th>
              )}
              {isSourceChecked == true && (
                <th>Source</th>
              )}
              {isTimeChecked == true && (
                <th>Time</th>
              )}
              {isLastVisitChecked == true && (
                <th>Last Visit</th>
              )}
              {isAmountChecked == true && (
                <th>Amount</th>
              )}
              {isStatusChecked == true && (
                <th>Status</th>
              )}
              {isCheckInChecked == true && (
                <th>Check In</th>
              )}
              <th className='text-center'>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.length > 0 && filteredData?.map((item) => {
              return (
                <>
                  <tr>
                    <td className='text-center'>{item?.token_no}</td>
                    {isMrChecked == true && (
                      <td>{item?.patient_mr_no}</td>
                    )}
                    {isPatientNameChecked == true && (
                      <td>{item?.patient_name}</td>
                    )}
                    {isMrChecked == true && (
                      <td>{item?.patient_number ? item?.patient_number.replace(/^(\d{4})/, "$1 ") : ""}</td>
                    )}
                    {isAppointmentTypeChecked == true && (
                      <td>{item?.appointment_type}</td>
                    )}
                    {isSourceChecked == true && (
                      <td>{item?.source ? item?.source : 'Physical'}</td>
                    )}
                    {isTimeChecked == true && (
                      <td>{item?.time}</td>
                    )}
                    {isLastVisitChecked == true && (
                      <td>{item?.last_visit}</td>
                    )}
                    {isAmountChecked == true && (
                      <td>{item?.amount_recieve}</td>
                    )}
                    {isStatusChecked == true && (
                      <td style={{ color: item?.appointment_status == "Cancelled" && '#FC5C5C' }}>{item?.appointment_status}</td>
                    )}
                    {isCheckInChecked == true && (
                      <td className='text-center'>{item?.is_checkin == 0 ? '-' : item?.check_in_time}</td>
                    )}
                    <td>
                      <div className='buttons'>
                        {item?.appointment_status === "Completed" && (
                          <button className='button1' onClick={() => handleViewInvoiceShow(item)}>VIEW INVOICE</button>
                        )}
                        {["Confirmed", "Booked"].includes(item?.appointment_status) && item?.is_partial == 1 ? (
                          <button disabled={item?.is_addInvoice_enable == "0"} onClick={() => handlePartialPaymentShow(item)} className='button1'>
                            ADD INVOICE
                          </button>
                        ) : (item?.appointment_status !== "Completed" && <button disabled={item?.is_addInvoice_enable == "0"} onClick={() => handleOpenInvoice(item)} className='button1'>
                          ADD INVOICE
                        </button>)}
                        {["Confirmed", "Booked", "missed", "Check-in", "Refunded"].includes(item?.appointment_status) && (
                          consultNowPermission && <button className='button2' disabled={item?.is_cosnultNow_enable == 0 && item?.is_partial == 0 || item?.appointment_status == "Refunded" || item?.is_addInvoice_enable == 1 || item?.is_partial == 1} onClick={() => handleConsultNowOffline(item)}>
                            CONSULT
                          </button>
                        )}
                        {item?.appointment_status === "Completed" && (
                          <Link className='button2 completed'>COMPLETED</Link>
                        )}
                        {item?.appointment_status === "Cancelled" && (
                          <Link className='button2 completed'>CONSULT</Link>
                        )}
                      </div>
                    </td>
                    <td>
                      {["Booked", "Confirmed", "missed", "Check-in"].includes(item?.appointment_status) && (
                        <Dropdown className='dropdownUpcoming'>
                          <Dropdown.Toggle id="dropdown-basic">
                            <img src={More} alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item disabled={item?.is_checkin == 1} onClick={() => openCheckIn(item?.id)} className="ancLink">
                              <img src={Checkmark} alt="" className="tw-w-[16px]" />
                              Check In
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleReshedule(item)} className={`ancLink ${0 == item?.is_cosnultNow_enable ? "d-none" : "d-flex"}`}>
                              <img src={Reschedule} alt="" className="tw-w-[16px]" />
                              Reschedule
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleShowHealthModal(item)} className="ancLink">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                <g clip-path="url(#clip0_156_5459)">
                                  <path d="M5.5 10.4868L6.205 11.1918L7.5 9.90182V13.9868H8.5V9.90182L9.795 11.1918L10.5 10.4868L8 7.98682L5.5 10.4868Z" fill="#0F75BC" />
                                  <path d="M11.7509 12.4866H11.5009V11.4866H11.7509C12.3476 11.5105 12.9294 11.2963 13.3683 10.8912C13.8071 10.4862 14.067 9.92334 14.0909 9.3266C14.1148 8.72987 13.9006 8.14809 13.4955 7.70925C13.0905 7.27042 12.5276 7.01047 11.9309 6.9866H11.5009L11.4509 6.5766C11.34 5.73483 10.9268 4.96207 10.2885 4.40229C9.65006 3.84251 8.82996 3.53388 7.98091 3.53388C7.13185 3.53388 6.31175 3.84251 5.67336 4.40229C5.03497 4.96207 4.62183 5.73483 4.51091 6.5766L4.50091 6.9866H4.07091C3.47417 7.01047 2.91135 7.27042 2.50628 7.70925C2.1012 8.14809 1.88704 8.72987 1.91091 9.3266C1.93478 9.92334 2.19472 10.4862 2.63356 10.8912C3.07239 11.2963 3.65417 11.5105 4.25091 11.4866H4.50091V12.4866H4.25091C3.44911 12.4815 2.67749 12.1802 2.0844 11.6406C1.49131 11.1011 1.11861 10.3613 1.03797 9.56354C0.957328 8.76579 1.17443 7.96639 1.64753 7.31903C2.12064 6.67167 2.81635 6.22204 3.60091 6.0566C3.81676 5.04986 4.37132 4.14759 5.17206 3.50034C5.9728 2.85308 6.97128 2.5 8.00091 2.5C9.03053 2.5 10.029 2.85308 10.8297 3.50034C11.6305 4.14759 12.1851 5.04986 12.4009 6.0566C13.1855 6.22204 13.8812 6.67167 14.3543 7.31903C14.8274 7.96639 15.0445 8.76579 14.9638 9.56354C14.8832 10.3613 14.5105 11.1011 13.9174 11.6406C13.3243 12.1802 12.5527 12.4815 11.7509 12.4866Z" fill="#0F75BC" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_156_5459">
                                    <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                  </clipPath>
                                </defs>
                              </svg>
                              Upload File
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => showMessageBox(item)} className="ancLink">
                              <img src={Email} alt="" className="tw-w-[16px]" />
                              Message
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleRefundShow(item?.id)} className={`ancLink ${0 == item?.is_refund_enable ? "d-none" : "d-flex"}`}>
                              <img src={Refund} alt="" className="tw-w-[16px]" />
                              Refund
                            </Dropdown.Item>
                            <Dropdown.Item className={`ancLink ${true == item?.edit_invoice ? "d-none" : "d-flex"}`}>
                              <img src={Printer} alt="" className="tw-w-[16px]" />
                              Edit Invoice
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => printInvoice(item?.id)} className="ancLink">
                              <img src={Printer} alt="" className="tw-w-[16px]" />
                              Print Invoice
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => printToken(item?.id)} className="ancLink">
                              <img src={Ticket} alt="" className="tw-w-[16px]" />
                              Print Token
                            </Dropdown.Item>
                            {allowedPermissions["appointments_delete"] && <Dropdown.Item onClick={() => handleDeleteShow(item?.id)} className="ancLink">
                              <img src={Delete} alt="" className="tw-w-[16px]" />
                              Delete
                            </Dropdown.Item>}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}

                      {["Completed"].includes(item?.appointment_status) && (
                        <Dropdown className='dropdownUpcoming'>
                          <Dropdown.Toggle id="dropdown-basic">
                            <img src={More} alt="" />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => printInvoice(item?.id)} className="ancLink">
                              <img src={Printer} alt="" className="tw-w-[16px]" />
                              Print Invoice
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => printToken(item?.id)} className="ancLink">
                              <img src={Ticket} alt="" className="tw-w-[16px]" />
                              Print Token
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => printPrecscription(item?.id)} className="ancLink">
                              <img src={Ticket} alt="" className="tw-w-[16px]" />
                              Print Prescription
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </Table>
        <div className='pagination_hk'>
          {totalPages > 1 ? (
            <>
              <div className='countPagination'>
                {paginateCountData?.from} - {paginateCountData?.to} of {paginateCountData?.total}
              </div>
              <ReactPaginate
                previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                breakLabel={null} // No break label
                pageCount={totalPages} // Total number of pages
                pageRangeDisplayed={0} // No page numbers displayed
                marginPagesDisplayed={0} // No margins around current page
                onPageChange={handlePageClick} // Handle page change
                containerClassName={"pagination_hk"} // Styling for the container
                previousClassName={"prev_item"} // Styling for the previous button
                nextClassName={"next_item"} // Styling for the next button
                previousLinkClassName={"previousLink"} // Styling for the previous link
                nextLinkClassName={"medical_next_link"} // Styling for the next link
                forcePage={currentPage - 1} // Force the current page
                renderOnZeroPageCount={null} // Hide pagination if there are no pages
              />
            </>
          ) : null}
        </div>
      </div>
      <PartialPaymentModal partialPaymentId={partialPaymentId} partialPaymentShow={partialPaymentShow} handlePartialPaymentClose={handlePartialPaymentClose} getClinicAppointmentsListing={getClinicAppointmentsListing} />
      <BookAppointmentModal
        bookAppointmentShow={bookAppointmentShow}
        setBookAppointmentShow={setBookAppointmentShow}
        handleBookAppointmentClose={handleBookAppointmentClose}
        prefilledData={prefilledData}
        doctors={doctors}
        isRescheduling={isRescheduling}
      />
      <AddInvoiceModal
        consultationFees={consultationFees}
        getClinicAppointmentsListing={getClinicAppointmentsListing}
        addInvoice={addInvoice}
        totalAmountReceivedError={totalAmountReceivedError}
        doctorProcedures={doctorProcedures}
        doctorProceduresQuantity={doctorProceduresQuantity}
        setConsultationDiscount={setConsultationDiscount}
        consultationDiscount={consultationDiscount}
        setTotalAmountReceived={setTotalAmountReceived}
        totalAmountReceived={totalAmountReceived}
        totalConsultation={totalConsultation}
        setTotalConsultation={setTotalConsultation}
        totalValueBeforeDiscount={totalValueBeforeDiscount}
        setTotalValueBeforeDiscount={setTotalValueBeforeDiscount}
        totalDiscount={totalDiscount}
        setTotalDiscount={setTotalDiscount}
        totalAmount={totalAmount}
        setTotalAmount={setTotalAmount}
        handleAddInvoiceClose={handleAddInvoiceClose}
        appliedConsultationDiscount={appliedConsultationDiscount}
        setAppliedConsultationDiscount={setAppliedConsultationDiscount}
        procedureRows={procedureRows}
        setProcedureRows={setProcedureRows}
        paymentMethods={paymentMethods}
        setPaymentMethods={setPaymentMethods}
        postBookAnAppointment={postBookAnAppointment} />
      <DeleteListModal generalDeleteModal={generalDeleteModal} setIndicationMessage={setIndicationMessage} handleGeneralDeleteClose={handleGeneralDeleteClose} confirmId={confirmId} getClinicAppointmentsListing={getClinicAppointmentsListing} />
      <CheckInModal checkInpastAppointments={checkInpastAppointments} confirmId={confirmId} setCheckInModal={setCheckInModal} checkInModal={checkInModal} />
      <RefundModalShow confirmId={confirmId} RefundFunc={RefundFunc} setRefundAmount={setRefundAmount} refundAmount={refundAmount} setAmountReceived={setAmountReceived} amountReceived={amountReceived} setRefundReason={setRefundReason} refundReason={refundReason} handleRefundClose={handleRefundClose} refundShow={refundShow} />
      <MessagePrescModal handleCloseMessage={handleCloseMessage} showMessage={showMessage} prescriptionProfile={upcomingDataSingle} clinicId={upcomingDataSingle?.clinic_id} patientId={upcomingDataSingle?.patient_id} doctorId={upcomingDataSingle?.doctor_id} number={upcomingDataSingle?.patient_number} prescriptionId={patientData?.appointment_id} removeEmail={removeEmail} />
      <UploadFileCalendar handleCloseHealthModal={handleCloseHealthModal} showHealthRecord={showHealthRecord} uploadRecord={uploadRecord} />
      <EditInvoiceModal handleEditInvoiceClose={handleEditInvoiceClose} editInvoiceShow={editInvoiceShow} />
      <ToastContainer />
      <ViewInvoiceModal
        viewInvoice={viewInvoice}
        handleViewInvoiceClose={handleViewInvoiceClose}
        patientName={selectedAppointment?.patient_name}
        appointmentDate={selectedAppointment?.appointment_completed_at}
        paymentMethod={selectedAppointment?.payment_method}
        time={selectedAppointment?.time}
        appointmentType={selectedAppointment?.appointment_type}
        appointmentId={selectedAppointment?.id}
        amountRecieve={selectedAppointment?.amount_recieve}
        consultationType={selectedAppointment?.consultation_type}
        clinicName={selectedAppointment?.clinic_name}
      />
    </>
  )
}

export default ClinicAppointments