import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Search from "../../assets/images/svg/search.svg"
import { Calendar, Button, Popover } from "antd";
import dayjs from "dayjs";
import "./calendarView.scss";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Form, Dropdown, Accordion, Tab, Tabs } from "react-bootstrap"
import Stethoscope from "../../assets/images/svg/stethoscope.svg"
import EventSchedule from "../../assets/images/svg/eventschedule.svg";
import CheckMark from "../../assets/images/svg/checkmark.svg";
import { API } from '../../services/httpInstance';
import calendarIcon from "../../assets/images/svg/litlleCalendar.svg"
import deleteCalendar from "../../assets/images/svg/deleteCalendar.svg"
import Close from "../../assets/images/png/red_close.png"
import editCalendar from "../../assets/images/svg/editCalendar.svg"
import clock from "../../assets/images/svg/clock.svg"
import phone from "../../assets/images/svg/phonne.svg"
import AddInvoiceModal from "../modal/addInvoiceModal/AddInvoiceModal";
import ReminderMedical from "../../assets/images/png/reminder-medical.png"
import videocam from "../../assets/images/png/videocam.png"
import moment from "moment";
import CheckInModal from "../checkInModal/CheckInModal";
import RefundModalShow from "../modal/refundModalShow/RefundModalShow";
import DeletePastApptsModal from "../modal/deletePastApptsModal/DeletePastApptsModal";
import Cookies from 'js-cookie';
import BookAppointmentModal from "../modal/bookAppointmentModal/BookAppointmentModal";
import OutOfficeModal from '../modal/outOfficeModal/OutOfficeModal';
import UploadFileCalendar from '../modal/uploadFileCalendar/uploadFileCalendar';
import { toast, ToastContainer } from "react-toastify";
import debounce from "lodash/debounce";
import { useSelector } from "react-redux";
import AgoraRTM from "agora-rtm-sdk";
import EditInvoiceModal from "../modal/editInvoiceModal/EditInvoiceModal";
import PartialPaymentModal from "../modal/partialpaymentModal/PartialPaymentModal";
import CancelAppointmentModal from "../modal/cancelAppointmentModal/CancelAppointmentModal";
import ViewInvoiceModal from "../modal/viewInvoiceModal/ViewInvoiceModal";

const CalendarView = ({ doctors, showAppointmentsPerm, setDoctors, }) => {
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [calendarView, setCalendarView] = useState("timeGridDay");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [appointmentsAll, setAppointmentsAll] = useState([]);
  const [doctorsId, setDoctorsId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [filterCounts, setFilterCounts] = useState({});
  const [openPopover, setOpenPopover] = useState(false);
  const [activeTab, setActiveTab] = useState("clinicAppointments");
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentStatus, setAppointmentStatus] = useState("");
  const handleBookAppointmentShow = () => setBookAppointmentShow(true);
  const navigate = useNavigate()
  const [addInvoice, setAddInvoice] = useState(false);
  const [invoiceDoctorId, setInvoiceDoctorId] = useState(null);
  const [consultationFees, setConsultationFees] = useState('');
  const [doctorProceduresQuantity, setDoctorProceduresQuantity] = useState([]);
  const [doctorProcedures, setDoctorProcedures] = useState([]);
  const [consultationDiscount, setConsultationDiscount] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState('');
  const [totalConsultation, setTotalConsultation] = useState(null);
  const [totalValueBeforeDiscount, setTotalValueBeforeDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [appliedConsultationDiscount, setAppliedConsultationDiscount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState('');
  const [appointmentId, setAppointmentId] = useState(null);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState(null);
  const [checkInModal, setCheckInModal] = useState(null);
  const [confirmId, setConfirmId] = useState(false)
  const [amountReceived, setAmountReceived] = useState('')
  const [viewInvoice, setViewInvoice] = useState(false)
  const [refundShow, setRefundShow] = useState(false)
  const [refundReason, setRefundReason] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [bookAppointmentShow, setBookAppointmentShow] = useState(false);
  const [generalDeleteModal, setGeneralDeleteModal] = useState(false)
  const [formattedEndDate, setFormattedEndDate] = useState('')
  const [formattedStartDate, setFormattedStartDate] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState('')
  const [newAndExistingAppt, setNewAndExistingAppt] = useState(0);
  const [onlyNewAppt, setOnlyNewAppt] = useState(1);
  const [isDeclined, setIsDeclined] = useState(0);
  const [startDate, setStartDate] = useState(moment().format(''))
  const [endDate, setEndDate] = useState(moment().format(''))
  const [leftDoctorId, setLeftDoctorId] = useState(null);
  const [outOfficeShow, setOutOfficeShow] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prefilledData, setPrefilledData] = useState(false)
  const [showHealthRecord, setShowHealthRecord] = useState(false);
  const [uploadRecord, setUploadRecord] = useState();
  const handleOutOfficeShow = () => setOutOfficeShow(true);
  const handleCloseHealthModal = () => setShowHealthRecord(false)
  const [doctorError, setDoctorError] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [partialPaymentId, setPartialPaymentId] = useState(false)
  const [partialPaymentShow, setPartialPaymentShow] = useState(false)
  const [cancelAppointment, setCancelAppoinment] = useState(false)
      const [allowedPermissions, setAllowedPermissions] = useState({});
    let userPermissions = useSelector((state) => state.clinic.userPermissions);
  
  const handleViewInvoiceClose = () => setViewInvoice(false)

  let doctorData = useSelector((state) => state?.user?.user);
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
    const viewPermission = userPermissions?.find((item) => item.slug === "appointments_view");
    const childPermissions = viewPermission?.child || [];
    const perms = {};
    childPermissions.forEach(child => {
      perms[child.slug] = true;
    });
    setAllowedPermissions(perms);
  }, [userPermissions]);


  const dropdownRef = useRef(null);
  const handleBookAppointmentClose = () => setBookAppointmentShow(false);
  const handleGeneralDeleteClose = () => setGeneralDeleteModal(false)
  const [leaveDates, setLeaveDates] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const [updatedDoctorData, setUpdatedDoctorData] = useState(null);
  const [leaveEntryData, setLeaveEntryData] = useState(null);
  const [editInvoiceShow, setEditInvoiceShow] = useState(false)
  const [updateSelectiveDate, setUpdateSelectiveDate] = useState(null);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdownId(null);
    }
  };

  const handleEditInvoiceShow = () => setEditInvoiceShow(true)
  const handleEditInvoiceClose = () => setEditInvoiceShow(false)

  // useEffect(() => {
  //   if (doctors?.length > 0) {
  //     setDoctorsId(doctors[0]?.id);
  //   }
  // }, [doctors]);

  const getDoctorsLeave = async () => {
    try {
      const response = await API.get(`get-doctor-out-off-office/${doctorsId}`)
      if (response?.status == 200) {
        setLeaveDates(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (doctorsId) {
      getDoctorsLeave()
    }
  }, [doctorsId])

  const handlePartialPaymentClose = () => setPartialPaymentShow(false)


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateChange = (value) => {
    if (value) {
      setSelectedDate(value.format("YYYY-MM-DD"));
    }
  };

  const handlePrevMonth = () => {
    setSelectedDate(prevDate =>
      dayjs(prevDate).subtract(1, "day").format("YYYY-MM-DD")
    );
  };

  // Function to navigate to next month
  const handleNextMonth = () => {
    setSelectedDate(prevDate =>
      dayjs(prevDate).add(1, "day").format("YYYY-MM-DD")
    );
  };

  const handleEventClick = debounce((info) => {
    if (info.jsEvent.target.closest(".appointmentDropdown")) return;

    setSelectedEvent(info.event);
    setOpenPopover(true);
  }, 300);

  const handleDropdownOptionClick = (callback) => {
    setOpenPopover(false);
    setOpenDropdownId(null);
    callback();
  };
  // const handleEventClick = (info) => {
  //   setSelectedEvent(info.event);
  //   if (!openPopover) {
  //     setOpenPopover(true);
  //   }
  // };

  // const handleEventClick = debounce((info) => {
  //   setSelectedEvent(info.event);
  //   setOpenPopover(true);
  // }, 300);

  const handleMenuClick = (event, eventId) => {
    event.stopPropagation();
    setOpenDropdownId((prevId) => {
      const newId = prevId === eventId ? null : eventId;
      return newId;
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
  }, [openDropdownId])

  const handleMenuClose = () => {
    setOpenDropdownId(null);
    setAnchorEl(null);
  };

  const handleConsultationFees = async () => {
    try {
      const response = await API.get(`/consulation-fee/${invoiceDoctorId}`)
      if (response?.status == 200) {
        setConsultationFees(response?.data?.data?.consultation_fee)
        // getDoctorsLeave()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleProcedure = async () => {
    try {
      const response = await API.get(`/procedures/${invoiceDoctorId}`)
      if (response?.status == 200) {
        setDoctorProcedures(response?.data?.data?.data)
        setDoctorProceduresQuantity(response?.data?.data?.quantity)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (invoiceDoctorId) {
      handleConsultationFees()
      handleProcedure()
    }
  }, [invoiceDoctorId])

  const handleAddInvoiceClose = () => {
    setConsultationDiscount('')
    setTotalAmountReceived('')
    setProcedureRows([
      {
        id: 1,
        selectedProcedure: null,
        selectedQuantity: '',
        procedureAmount: '',
        discountProcedure: '',
        finalDiscount: '',
        calculatonValue: ''
      }
    ])
    setAddInvoice(false);

  }

  const saveLeftDoctor = async () => {
    if (!leftDoctorId) {
      // setDoctorError(true);
      toast.error("Please select a doctor.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      return;
    }
    if ((isDeclined && onlyNewAppt == 0 && newAndExistingAppt == 0) || leftDoctorId == null) {
      setButtonDisabled(false)

    }
    else {
      const payload = {
        doctorId: leftDoctorId,
        startDate: moment(formattedStartDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        endDate: moment(formattedEndDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
        automaticallyDeclineAllAppt: isDeclined,
        onlyNewAppt: onlyNewAppt,
        newAndExistingAppt: newAndExistingAppt,
        absenceReason: leaveMessage
      };
      try {
        const response = await API.post(`/doctor-out-off-office`, payload)
        if (response?.status == 200) {
          handleOutOfficeClose()
          toast.success(response?.data?.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        } else if (response?.status === 422) {
          toast.error(response?.data?.message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }

      } catch (error) {
        console.log(error);
        toast.error(error?.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  const handleShowHealthModal = (rowData) => {
    setUploadRecord(rowData)
    console.log(rowData)
    setShowHealthRecord(true)
  }

  const handlePartialPaymentShow = (item) => {
    setPartialPaymentId(item?.appointmentId)
    setPartialPaymentShow(true)
  }

  const getCalenderWiseApps = async () => {
    try {
      let type = "";
      let value = "";
      let doctorId = doctorsId || "all";
      let appType = appointmentType || "all";
      let appStatus = appointmentStatus || "all";

      if (calendarView == "timeGridDay") {
        type = "day";
        value = selectedDate;
        appStatus = appointmentStatus
      } else if (calendarView == "timeGridWeek") {
        type = "week";
        value = selectedDate;
        appStatus = appointmentStatus
      } else if (calendarView == "dayGridMonth") {
        type = "month";
        value = dayjs(selectedDate).format("YYYY,MM");
        appStatus = appointmentStatus
      }

      const response = await API.get(
        `/get-calender-wise-appointments?type=${type}&value=${value}&doctor_id=${doctorId}&filter=${appStatus}&appointment_type=${appType}`
      );

      if (response?.status === 200) {
        const rawAppointments = response?.data?.data?.appointments;
        const formattedAppointments = rawAppointments.map(item => {
          const dateObj = new Date(item?.date);
          const dateTime = moment(`${item.date} ${item.appointmentData.time}`, "YYYY-MM-DD hh:mm A");
          const start = dateTime.toISOString();
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit'
          }).replace(' ', ' ');
          return {
            id: item?.appointmentData?.id?.toString() || "",
            title: item?.appointmentData?.appointment_type,
            start: start,
            extendedProps: {
              doctor_name: item?.dr_name,
              gender: item?.appointmentData?.gender,
              age: item?.appointmentData?.age,
              patient_number: item?.appointmentData?.patient_number,
              status: item?.appointmentData?.appointment_status,
              patient_name: item?.appointmentData?.patient_name,
              token: item?.appointmentData?.token_no,
              onlineAppointment: item?.appointmentData?.is_online_appointment,
              time: item?.appointmentData?.time,
              video_start_end_time: item?.appointmentData?.video_start_end_time,
              doctor: item?.appointmentData?.doctor_name,
              amount: item?.appointmentData?.amount_recieve,
              doctorsId: item?.appointmentData?.doctor_id,
              appointmentId: item?.appointmentData?.id,
              editInvoice: item?.appointmentData?.edit_invoice,
              appointmentType: item?.appointmentData?.appointment_type,
              isOnlineApp: item?.appointmentData?.is_online_appointment,
              clinicName: item?.appointmentData?.clinic_name,
              patientId: item?.appointmentData?.patient_id,
              clinicId: item?.appointmentData?.clinic_id,
              paymentMethod: item?.appointmentData?.paymen_method,
              refundEnable: item?.appointmentData?.is_refund_enable,
              isFad: item?.appointmentData?.is_fad,
              isCosnultNowEnable: item?.appointmentData?.is_cosnultNow_enable,
              isPartial: item?.appointmentData?.is_partial,
              isCheckin: item?.appointmentData?.is_checkin,
              fadVideo: item?.appointmentData?.fad_appointment_type,
              isDate: formattedDate,
              appointment_completed_at: item?.appointmentData?.appointment_completed_at,
              patient_mr_no: item?.appointmentData?.patient_mr_no,
            }
          }
        });
        setAppointmentsAll(formattedAppointments);
        setFilterCounts(response?.data?.data?.filterCounts);
        setTotalAppointmentsCount(response?.data?.data?.total_appointments)
      } else {
        setAppointmentsAll([]);
      }
    } catch (error) {
      console.log(error);
      setAppointmentsAll([]);
    }
  };


  useEffect(() => {
    getCalenderWiseApps();
  }, [calendarView, selectedDate, doctorsId, appointmentType, appointmentStatus]);

  const handleAppointmentType = (e) => {
    const { value, checked } = e.target;
    let updatedTypes = appointmentType ? appointmentType.split(",") : [];

    if (checked) {
      updatedTypes.push(value);
    } else {
      updatedTypes = updatedTypes.filter((type) => type !== value);
    }

    setAppointmentType(updatedTypes.join(","));
  };

  const handleAppointmentStatus = (e) => {
    const { value, checked } = e.target;
    let updatedStatus = appointmentStatus ? appointmentStatus.split(",") : [];

    if (checked) {
      updatedStatus.push(value);
    } else {
      updatedStatus = updatedStatus.filter((type) => type !== value);
    }

    setAppointmentStatus(updatedStatus.join(","));
  };

  const handleMainTabs = (type) => {
    setCalendarView(type)
    setOpenPopover(false)
  }

  const handleDoctorId = (e) => {
    const value = e.target.value;
    setDoctorsId(value)
  }

  const handleAddInvoice = (items) => {
    setInvoiceDoctorId(items?.doctorsId)
    setAppointmentId(items?.appointmentId)
    setAddInvoice(true)
  }

  const subTotal = Number(totalValueBeforeDiscount) + Number(consultationFees);
  const grandDiscount = Number(totalDiscount) + Number(appliedConsultationDiscount);
  const effectiveConsultation = totalConsultation !== null ? Number(totalConsultation) : Number(consultationFees);
  const grandTotalAmount = Math.max(
    Number(totalAmount) + effectiveConsultation,
    0
  )
  const remainingAmount = grandTotalAmount - Number(totalAmountReceived);

  const postBookAnAppointment = async (print) => {
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
        getCalenderWiseApps();
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

  const checkInpastAppointments = async (id) => {
    const data = { appointment_id: id }
    if (id) {
      try {
        const response = await API.post('/check-in', data)
        if (response?.status == 200) {
          getCalenderWiseApps()
          setCheckInModal(false)
        }
        else {
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

  const handleRefundClose = () => {
    setRefundShow(false)
    setConfirmId(null)
    setRefundAmount('')
    setAmountReceived('')
    setRefundReason('')
  }

  const openCheckIn = (id) => {
    setCheckInModal(true)
    setConfirmId(id)
  }

  const handleRefundShow = (rowData) => {
    setAmountReceived(rowData?.amount)
    setConfirmId(rowData?.appointmentId)
    setRefundShow(true)
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
          getCalenderWiseApps()
          handleRefundClose()
        }
        else {
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

  const handleDeletePastApptsShow = (appId) => {
    setConfirmId(appId)
    setGeneralDeleteModal(true)
  }

  const handleViewInvoiceShow = (extendedProps) => {
    setSelectedAppointment(extendedProps)
    setViewInvoice(true)
  }

  const deleteAppointment = async (appId) => {
    try {
      const response = await API.delete(`/delete-appt?appt_id=${appId}`)
      if (response?.status == 200) {
        handleGeneralDeleteClose()
        getAppointments()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const consultNow = (appt) => {
    const { appointmentId, patientId, clinicId, doctorsId, appointment_completed_at, isOnlineApp } = appt;
    if (isOnlineApp == 1) {
      // Cookies.set('patientId', appt?.appointmentId);
      // Cookies.set('apptId', appt?.patientId);
      navigate('/online-consultation', {
        state: {
          appointmentId: appointmentId,
          patientId: patientId,
          clinicId: clinicId,
          doctorId: doctorsId,
          appointmentDate: appointment_completed_at
        }
      })
    }
    else {
      // Cookies.set('patientId', appt?.appointmentId);
      // Cookies.set('apptId', appt?.patientId);
      navigate('/consult-now', {
        state: {
          appointmentId: appointmentId,
          patientId: patientId,
          clinicId: clinicId,
          doctorId: doctorsId,
          appointmentDate: appointment_completed_at
        }
      })
    }
  }

  const formatPhoneNumber = (phone) => {
    const formattedPhone = phone.replace(/(\d{4})(\d{1,})/, '$1-$2');
    return formattedPhone;
  };

  const dayCellClassNames = (arg) => {
    const formattedDate = new Date(arg.date);
    formattedDate.setHours(0, 0, 0, 0);
    if (!leaveDates || leaveDates.length === 0) {
      return [];
    }
    const leaveEntry = leaveDates.find(({ startDate, endDate }) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return formattedDate >= start && formattedDate <= end;
    });

    if (leaveEntry) {
      return [
        "leave-day",
        `leave-id-${leaveEntry.id}`,
        `leave-start-${leaveEntry.startDate}`,
        `leave-end-${leaveEntry.endDate}`
      ];
    }

    return [];
  };

  const handleOutOfficeClose = () => {
    setOutOfficeShow(false);
    setUpdateSelectiveDate(null)
    setLeaveEntryData(null)
    setFormattedStartDate('')
    setFormattedEndDate('')
  }
  const openUpdateDateModal = (leaveEntry) => {
    setFormattedStartDate(moment(leaveEntry?.startDate, "YYYY-MM-DD"));
    setFormattedEndDate(moment(leaveEntry?.endDate, "YYYY-MM-DD"));
    setOutOfficeShow(true)
    setUpdateSelectiveDate(leaveEntry?.id)
    setLeaveEntryData(leaveEntry)
  }

  const updateSpecificDate = async () => {
    const payload = {
      id: updateSelectiveDate,
      doctor_id: doctorsId,
      startDate: moment(formattedStartDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      endDate: moment(formattedEndDate, "DD/MM/YYYY").format("YYYY-MM-DD"),
      automaticallyDeclineAllAppt: isDeclined,
      onlyNewAppt: onlyNewAppt,
      newAndExistingAppt: newAndExistingAppt,
      absenceReason: leaveMessage
    }
    try {
      const response = await API.patch(`/update-doctor-out-off-office`, payload)
      if (response?.status == 200) {
        setOutOfficeShow(false)
        setUpdateSelectiveDate(null)
        setLeaveEntryData(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (leaveDates.length > 0) {
      setForceRender((prev) => !prev);
    }
  }, [leaveDates]);

  const handleReshedule = (item) => {
    setBookAppointmentShow(true)
    setPrefilledData(item)
    setIsRescheduling(true);
  }

  const handleCancelClose = () => setCancelAppoinment(false)

  const handleCancelShow = (extendedProps) => {
    setSelectedAppointment(extendedProps)
    setCancelAppoinment(true)
  }

  // const isConfirmed = selectedEvent.extendedProps.status === 'confirmed';

  async function emitAppointmentStart(e, appt) {
    e.preventDefault();
    let options = {
      uid: "",
      token: "",
    };
    const appID = import.meta.env.VITE_REACT_APP_AGORA_APP_ID;
    const appointmentId = appt?.id;

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
                appointmentId: appt?.appointmentId,
                patientId: appt?.patientId,
                doctorId: appt?.doctorsId,
                appointmentDate: appt?.appointment_date?.split(' ')[0],
              },
            });
          });
      }
    }
  }


  const handleConsultNowOffline = (item) => {
    const { appointmentId, patientId, clinicId, doctorsId, appointment_completed_at } = item;
    Cookies.remove("prescriptionsAdd")
    Cookies.remove("prescriptionsEdit")
    Cookies.remove("patientClose")
    navigate('/consult-now', {
      state: {
        appointmentId,
        patientId: patientId,
        clinicId: clinicId,
        doctorId: doctorsId,
        appointmentDate: appointment_completed_at
      }
    });
  }

  return (
    <>

      <div className="container p-4 clanderBox">
        <div className="row">
          <div className="col-lg-3 clanderSmallApp">
            <div className="headerClander">
              <div className="dateBoxHeader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0px 10px 8px 0" }}>
                {/* Left Section (Today Button & Navigation Arrows) */}
                <div className="btnToday" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Button onClick={() => {
                    const today = dayjs();
                    setSelectedDate(today.format("YYYY-MM-DD"));
                    onChange(today);
                  }}>
                    Today
                  </Button>

                </div>
                <div className="iconLR">
                  <span style={{ cursor: "pointer" }} onClick={handlePrevMonth} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                      <path d="M6.4375 1.55566L1.73683 5.85249C1.65008 5.93178 1.65008 6.06843 1.73683 6.14773L6.4375 10.4446" stroke="#313131" stroke-width="1.5" stroke-linecap="round" />
                    </svg>

                  </span>
                  <span style={{ cursor: "pointer" }} onClick={handleNextMonth}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                      <path d="M1.4375 10.4443L6.13819 6.14751C6.22494 6.06822 6.22494 5.93157 6.13819 5.85227L1.4375 1.55545" stroke="#313131" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </span>

                </div>
                <div style={{ fontSize: "15px" }} className="dateC">
                  {dayjs(selectedDate).format("MMMM D, YYYY")}
                </div>
              </div>
              <Calendar
                value={dayjs(selectedDate)}
                fullscreen={false}
                onChange={handleDateChange}
                defaultValue={dayjs()
                }
                headerRender={({ value, onChange }) => {
                  const current = value;
                  const months = dayjs.months();
                  const years = Array.from({ length: 10 }, (_, i) => dayjs().year() - 5 + i);

                  return (
                    <div
                      className="dateBoxHeader1 dateBoxHeader"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0px 10px 8px 0",
                      }}
                    >  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <select
                          value={current.month()} // Get the selected month index
                          onChange={(e) => {
                            const newMonth = parseInt(e.target.value, 10);
                            onChange(current.month(newMonth)); // Update the month
                          }}
                          style={{ width: "auto", padding: "0 9px" }}
                        >
                          {months.map((month, index) => (
                            <option key={month} value={index}>
                              {month}
                            </option>
                          ))}
                        </select>

                        {/* Year Dropdown */}
                        <select
                          value={current.year()} // Get the selected year
                          onChange={(e) => {
                            const newYear = parseInt(e.target.value, 10);
                            onChange(current.year(newYear)); // Update the year
                          }}
                          className="iconSelect"
                          style={{ width: "auto", paddingLeft: "5px" }}
                        >
                          {years.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>


                      <div className="iconLR">
                        <span onClick={() => onChange(current.subtract(1, "month"))} style={{ cursor: "pointer" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path d="M6.4375 1.55566L1.73683 5.85249C1.65008 5.93178 1.65008 6.06843 1.73683 6.14773L6.4375 10.4446" stroke="#313131" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                        <span onClick={() => onChange(current.add(1, "month"))} style={{ cursor: "pointer" }}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1.4375 10.4443L6.13819 6.14751C6.22494 6.06822 6.22494 5.93157 6.13819 5.85227L1.4375 1.55545" stroke="#313131" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <div className="appointmentType">
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>Appointment Type</Accordion.Header>
                    <Accordion.Body>
                      <div className="checkboxItem">
                        <div className="boxCheck">
                          <input
                            type="checkbox"
                            value="all"
                            onChange={handleAppointmentType}
                            className="checkCustom"
                            name="appointmentType"
                          />
                          <label>All</label>
                        </div>
                        <div className="boxCheck">
                          <input
                            type="checkbox"
                            value="clinicAppointment"
                            onChange={handleAppointmentType}
                            className="checkCustom"
                            name="appointmentType"
                          />
                          <label>Clinic Appointments</label>
                        </div>
                        <div className="boxCheck">
                          <input
                            type="checkbox"
                            value="onlineAppointment"
                            onChange={handleAppointmentType}
                            className="checkCustom"
                            name="appointmentType"
                          />
                          <label>Online Appointments</label>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Appointment Status</Accordion.Header>
                    <Accordion.Body>
                      <div className="checkboxItem">
                        <div className="boxCheck">
                          <input type="checkbox" value="booked" onChange={handleAppointmentStatus} className="checkCustom" name="appointmenttype"></input>
                          <label>Booked</label>
                          <p>{filterCounts?.booked}</p>
                        </div>
                        <div className="boxCheck">
                          <input type="checkbox" value="confirmed" onChange={handleAppointmentStatus} className="checkCustom" name="appointmenttype"></input>
                          <label>Confirmed</label>
                          <p>{filterCounts?.confirmed}</p>
                        </div>
                        <div className="boxCheck">
                          <input type="checkbox" value="completed" onChange={handleAppointmentStatus} className="checkCustom" name="appointmenttype"></input>
                          <label>Completed</label>
                          <p>{filterCounts?.completed}</p>
                        </div>
                        <div className="boxCheck">
                          <input type="checkbox" value="cancelled" onChange={handleAppointmentStatus} className="checkCustom" name="appointmenttype"></input>
                          <label>Cancelled</label>
                          <p>{filterCounts?.cancelled}</p>
                        </div>
                        <div className="boxCheck">
                          <input type="checkbox" value="missed" onChange={handleAppointmentStatus} className="checkCustom" name="appointmenttype"></input>
                          <label>Missed</label>
                          <p>{filterCounts?.missed}</p>
                        </div>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </div>

          </div>
          <div className="col-lg-9 rightBoxClander">
            <div className="top_wrap calanderTopRow">
              <Row className="align-items-center">
                <Col xs={8} className="d-lg-none d-block">
                  <Form.Select className='form-control allAppField' >

                    <option>All Appointments </option>
                    <option>All Appointments </option>
                    <option>All Appointments </option>

                  </Form.Select>
                </Col>
                <Col lg={3}>
                  <div className="search">
                    <img src={Stethoscope} alt="" />
                    <Form.Select onChange={(e) => handleDoctorId(e)} aria-label="Default select example" name="practiceCity" className="selectSty">
                      <option value="">All Doctors</option>
                      {doctors?.map((item) => (
                        <option key={item?.id} value={item?.id}>
                          Dr. {item?.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                </Col>
                <Col lg="3" xs={7} className="ms-auto">
                  <div className="flex gap-2 daysTabs">
                    <Button type={calendarView == "timeGridDay" ? "primary" : "default"} onClick={() => handleMainTabs('timeGridDay')}>
                      Day
                    </Button>
                    <Button type={calendarView == "timeGridWeek" ? "primary" : "default"} onClick={() => handleMainTabs('timeGridWeek')}>
                      Week
                    </Button>
                    <Button type={calendarView == "dayGridMonth" ? "primary" : "default"} onClick={() => handleMainTabs('dayGridMonth')}>
                      Month
                    </Button>
                  </div>
                </Col>

                <Col lg={5} className="ms-auto">
                  <Row className='justify-content-end '>
                    <Col lg={6} >
                      <div className="search__bar d-lg-flex d-none" >
                        <img src={Search} alt="" />
                        <input type="text" placeholder='Search' />
                      </div>
                    </Col>
                    {activeTab === "clinicAppointments" && (
                      <Col lg={4}>
                        <Dropdown className='create'>
                          <Dropdown.Toggle id="dropdown-basic">
                            <span>Create</span> <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                              <path d="M13.1673 7.3335L8.50065 12.0002L3.83398 7.3335" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {allowedPermissions["appointments_add"] &&  <Dropdown.Item onClick={handleBookAppointmentShow}><img src={EventSchedule} /> Book an Appointment</Dropdown.Item>}
                            <Dropdown.Item onClick={handleOutOfficeShow}><img src={CheckMark} /> Out of office</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    )}
                    <Col lg={2}></Col>
                  </Row>
                </Col>
              </Row>
            </div>


            <FullCalendar
              className="clanderMain"
              headerRender={() => null}
              key={`${selectedDate}-${calendarView}-${JSON.stringify(leaveDates)}`}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={calendarView}
              initialDate={selectedDate}
              selectable={true}
              height={600}
              events={appointmentsAll}
              eventClick={(info) => handleEventClick(info)}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              eventDisplay="block"
              eventOverlap={false}
              slotEventOverlap={false}
              eventOrder="start,-duration,title"
              eventMaxStack="1"
              slotDuration="00:30:00"
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              dayCellClassNames={dayCellClassNames}
              eventDidMount={(arg) => {
                const { isFad } = arg.event.extendedProps;
                if (isFad == 1 || isFad == '1') {
                  arg.el.classList.add('onlineConsultation');
                }
              }}
              dayCellContent={(arg) => {
                const classNames = dayCellClassNames(arg);
                const isDisabled = classNames.includes("leave-day");
                const idClass = classNames.find(cls => cls.startsWith("leave-id-"));
                const leaveId = idClass ? idClass.split("-")[2] : null;
                const startClass = classNames.find(cls => cls.startsWith("leave-start-"));
                const startDate = startClass ? startClass.split("leave-start-")[1] : null;
                const endClass = classNames.find(cls => cls.startsWith("leave-end-"));
                const endDate = endClass ? endClass.split("leave-end-")[1] : null;
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "4px" }}>
                    {isDisabled && (
                      <>
                        <img
                          onClick={() => {
                            const leaveEntry = leaveDates.find((leave) => leave.id == Number(leaveId));
                            if (leaveEntry) {
                              openUpdateDateModal(leaveEntry);
                            }
                          }}
                          src={editCalendar}
                          alt="Edit Icon"
                          style={{ width: "15px" }} />
                      </>
                    )}
                    <span>{arg.date.getDate()}</span>
                  </div>
                );
              }}
              eventContent={(arg) => {
                const { extendedProps } = arg.event;
                if (calendarView === "timeGridDay") {
                  return (
                    <div className="d-flex justify-content-between">
                      <div className="d-flex boxFl boxGreen">
                        <span className="d-flex gap-2">
                          <img
                            style={{ width: "20px", height: "20px" }}
                            src={extendedProps.isOnlineApp === 1 ? videocam : ReminderMedical}
                            alt="icon"
                          />{" "}
                          <span className="pName">  {extendedProps.patient_name}</span> <span className="hideMob">|</span>
                        </span>
                        <span className="typep">
                          {extendedProps.gender} | {extendedProps.age}
                        </span>
                        <span className="typep">{extendedProps.appointmentType}</span>
                        <span className="typep status01">{extendedProps.status}</span>
                        <span className="typep d-flex gap-2">
                          <img src={phone} alt="phone" width="12" height="12" /> {formatPhoneNumber(extendedProps.patient_number)}
                        </span>
                      </div>
                      <span className="threeDot">
                        <div role="button" tabIndex="0" onClick={(e) => handleMenuClick(e, arg.event.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12 4C12.55 4 13.0208 4.19583 13.4125 4.5875C13.8042 4.97917 14 5.45 14 6C14 6.55 13.8042 7.02083 13.4125 7.4125C13.0208 7.80417 12.55 8 12 8C11.45 8 10.9792 7.80417 10.5875 7.4125C10.1958 7.02083 10 6.55 10 6C10 5.45 10.1958 4.97917 10.5875 4.5875C10.9792 4.19583 11.45 4 12 4ZM12 10C12.55 10 13.0208 10.1958 13.4125 10.5875C13.8042 10.9792 14 11.45 14 12C14 12.55 13.8042 13.0208 13.4125 13.4125C13.0208 13.8042 12.55 14 12 14C11.45 14 10.9792 13.8042 10.5875 13.4125C10.1958 13.0208 10 12.55 10 12C10 11.45 10.1958 10.9792 10.5875 10.5875C10.9792 10.1958 11.45 10 12 10ZM12 16C12.55 16 13.0208 16.1958 13.4125 16.5875C13.8042 16.9792 14 17.45 14 18C14 18.55 13.8042 19.0208 13.4125 19.4125C13.0208 19.8042 12.55 20 12 20C11.45 20 10.9792 19.8042 10.5875 19.4125C10.1958 19.0208 10 18.55 10 18C10 17.45 10.1958 16.9792 10.5875 16.5875C10.9792 16.1958 11.45 16 12 16Z"
                              fill="#0F345A"
                            />
                          </svg>
                        </div>
                      </span>
                      {/* Dropdown Menu */}
                      <div ref={dropdownRef}>
                        {openDropdownId === arg.event.id && (
                          <div className="appointmentDropdown">
                            {extendedProps?.fadVideo == "video" ? (
                              <Link onClick={(e) => handleCancelShow(extendedProps)}>
                                <img src={Close} alt="" className="tw-w-[16px]" />Cancel
                              </Link>
                            ) : (
                              <>
                                <Link onClick={(e) => {
                                  if (extendedProps?.isCheckin === 1) {
                                    e.preventDefault();
                                    return;
                                  }
                                  handleDropdownOptionClick(() => openCheckIn(extendedProps.appointmentId));
                                }}
                                  style={{
                                    pointerEvents: extendedProps?.isCheckin === 1 ? 'none' : 'auto',
                                    opacity: extendedProps?.isCheckin === 1 ? 0.5 : 1,
                                    cursor: extendedProps?.isCheckin === 1 ? 'not-allowed' : 'pointer',
                                  }}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <g clip-path="url(#clip0_156_5436)">
                                      <path d="M7 11.207L4.5 8.7065L5.2065 8L7 9.793L10.7925 6L11.5 6.7075L7 11.207Z" fill="#0F75BC" />
                                      <path d="M8 1.5C6.61553 1.5 5.26216 1.91054 4.11101 2.67971C2.95987 3.44888 2.06266 4.54213 1.53285 5.82122C1.00303 7.1003 0.86441 8.50776 1.13451 9.86563C1.4046 11.2235 2.07129 12.4708 3.05026 13.4497C4.02922 14.4287 5.2765 15.0954 6.63437 15.3655C7.99224 15.6356 9.3997 15.497 10.6788 14.9672C11.9579 14.4373 13.0511 13.5401 13.8203 12.389C14.5895 11.2378 15 9.88447 15 8.5C15 6.64348 14.2625 4.86301 12.9497 3.55025C11.637 2.2375 9.85652 1.5 8 1.5ZM8 14.5C6.81332 14.5 5.65328 14.1481 4.66658 13.4888C3.67989 12.8295 2.91085 11.8925 2.45673 10.7961C2.0026 9.69974 1.88378 8.49334 2.11529 7.32946C2.3468 6.16557 2.91825 5.09647 3.75736 4.25736C4.59648 3.41824 5.66558 2.8468 6.82946 2.61529C7.99335 2.38378 9.19975 2.5026 10.2961 2.95672C11.3925 3.41085 12.3295 4.17988 12.9888 5.16658C13.6481 6.15327 14 7.31331 14 8.5C14 10.0913 13.3679 11.6174 12.2426 12.7426C11.1174 13.8679 9.5913 14.5 8 14.5Z" fill="#0F75BC" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_156_5436">
                                        <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                      </clipPath>
                                    </defs>
                                  </svg>Check In</Link>
                                <Link onClick={(e) => handleDropdownOptionClick(() => handleReshedule(extendedProps))} className={`${0 == extendedProps?.isCosnultNowEnable ? "d-none" : "d-flex"}`}>
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
                                  Reschedule</Link>
                                <Link onClick={(e) => handleDropdownOptionClick(() => handleShowHealthModal(extendedProps))} >
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
                                  Upload File</Link>
                                <Link onClick={(e) => handleDropdownOptionClick(() => handleRefundShow(extendedProps))} className={`${0 == extendedProps?.refundEnable ? "d-none" : "d-flex"}`}>
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
                                  Refund</Link>
                                <Link onClick={(e) => handleDropdownOptionClick(() => printInvoice(extendedProps.appointmentId))}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M11.2714 5.04555L10.6868 5.78926C11.947 6.76025 12.5756 8.33226 12.3275 9.89227C12.1457 11.037 11.5246 12.0431 10.5786 12.7254C9.63225 13.4074 8.47467 13.6846 7.31866 13.5037C4.93228 13.1316 3.29602 10.9065 3.67114 8.54326C3.85289 7.39843 4.47423 6.39226 5.42035 5.71011C6.2464 5.11466 7.23348 4.82867 8.24008 4.8854L7.41735 5.74008L8.02769 6.31683L9.32642 4.96671L9.32673 4.96721L9.90855 4.36222L9.29865 3.78609L9.29834 3.78627L7.93538 2.5L7.35312 3.10499L8.24121 3.94258C7.03398 3.88604 5.85151 4.23378 4.8603 4.94844C3.70873 5.77873 2.95261 7.00332 2.73121 8.39698C2.27454 11.2733 4.26597 13.982 7.17069 14.4347C7.45144 14.4785 7.73206 14.5 8.01087 14.5C9.12973 14.5 10.2169 14.1518 11.1386 13.4871C12.2903 12.6567 13.0463 11.4321 13.2677 10.0387C13.5697 8.14035 12.8047 6.22697 11.2714 5.04555Z" fill="#0F75BC" />
                                    <path d="M6.40983 7.1665C6.74548 7.1665 7.0221 7.20969 7.23968 7.29606C7.45896 7.38243 7.62172 7.51288 7.72798 7.68742C7.83425 7.86196 7.88738 8.08238 7.88738 8.34869C7.88738 8.52863 7.85533 8.68607 7.79123 8.82102C7.72714 8.95598 7.6428 9.07024 7.53823 9.16381C7.43365 9.25737 7.32065 9.33385 7.1992 9.39322L8.28712 11.1125H7.41679L6.5338 9.59835H6.11634V11.1125H5.33203V7.1665H6.40983ZM6.35417 7.85206H6.11634V8.91819H6.36935C6.6291 8.91819 6.81464 8.87231 6.92596 8.78054C7.03897 8.68697 7.09547 8.55022 7.09547 8.37028C7.09547 8.18315 7.03475 8.04999 6.91331 7.97082C6.79355 7.89165 6.60717 7.85206 6.35417 7.85206ZM10.6654 10.2164C10.6654 10.4216 10.6198 10.5952 10.5287 10.7374C10.4393 10.8777 10.3053 10.9848 10.1265 11.0585C9.94768 11.1305 9.72503 11.1665 9.45853 11.1665C9.26119 11.1665 9.09168 11.153 8.94999 11.126C8.81 11.099 8.66832 11.054 8.52495 10.9911V10.3109C8.67844 10.3847 8.84289 10.4459 9.01831 10.4944C9.19541 10.5412 9.35058 10.5646 9.48383 10.5646C9.63395 10.5646 9.74106 10.5412 9.80515 10.4944C9.87093 10.4459 9.90382 10.3829 9.90382 10.3055C9.90382 10.2551 9.89033 10.2101 9.86334 10.1706C9.83804 10.1292 9.78238 10.0833 9.69636 10.0329C9.61034 9.98072 9.4754 9.91324 9.29155 9.83047C9.11445 9.7513 8.96855 9.67123 8.85385 9.59026C8.74084 9.50928 8.65651 9.41392 8.60085 9.30416C8.54687 9.19259 8.51989 9.05134 8.51989 8.8804C8.51989 8.6015 8.62109 8.39188 8.82349 8.25152C9.02758 8.10937 9.29998 8.0383 9.6407 8.0383C9.81611 8.0383 9.9831 8.05719 10.1416 8.09498C10.3019 8.13277 10.4663 8.19304 10.635 8.27582L10.4022 8.86961C10.2622 8.80483 10.1298 8.75175 10.005 8.71036C9.88189 8.66898 9.75624 8.64829 9.62805 8.64829C9.51504 8.64829 9.42986 8.66448 9.37251 8.69687C9.31516 8.72926 9.28649 8.77874 9.28649 8.84532C9.28649 8.8939 9.30083 8.93708 9.3295 8.97487C9.35986 9.01266 9.41721 9.05494 9.50154 9.10173C9.58757 9.14671 9.71322 9.20519 9.87852 9.27717C10.0388 9.34734 10.1779 9.42111 10.296 9.49849C10.414 9.57406 10.5051 9.66853 10.5692 9.78189C10.6333 9.89345 10.6654 10.0383 10.6654 10.2164Z" fill="#0F75BC" />
                                  </svg>
                                  Print Invoice</Link>
                                <Link onClick={(e) => handleDropdownOptionClick(() => printToken(extendedProps.appointmentId))}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <g clip-path="url(#clip0_156_5483)">
                                      <path d="M14 5H12.5V2H3.5V5H2C1.73478 5 1.48043 5.10536 1.29289 5.29289C1.10536 5.48043 1 5.73478 1 6V11C1 11.2652 1.10536 11.5196 1.29289 11.7071C1.48043 11.8946 1.73478 12 2 12H3.5V15H12.5V12H14C14.2652 12 14.5196 11.8946 14.7071 11.7071C14.8946 11.5196 15 11.2652 15 11V6C15 5.73478 14.8946 5.48043 14.7071 5.29289C14.5196 5.10536 14.2652 5 14 5ZM4.5 3H11.5V5H4.5V3ZM11.5 14H4.5V9H11.5V14ZM14 11H12.5V8H3.5V11H2V6H14V11Z" fill="#0F75BC" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_156_5483">
                                        <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Print Token</Link>
                                <Link className={`ancLink ${true == extendedProps?.editInvoice ? "d-none" : "d-flex"}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <g clip-path="url(#clip0_156_5526)">
                                      <path d="M11.1825 8.5H10.2734V9.40909H11.1825V8.5Z" fill="#0F75BC" />
                                      <path d="M8.45472 8.5H4.81836V9.40909H8.45472V8.5Z" fill="#0F75BC" />
                                      <path d="M11.1825 6.68164H10.2734V7.59073H11.1825V6.68164Z" fill="#0F75BC" />
                                      <path d="M8.45472 6.68164H4.81836V7.59073H8.45472V6.68164Z" fill="#0F75BC" />
                                      <path d="M11.182 4.86328H4.81836V5.77237H11.182V4.86328Z" fill="#0F75BC" />
                                      <path d="M12.0909 2.13623H3.90909C3.66806 2.13647 3.43697 2.23233 3.26653 2.40276C3.0961 2.5732 3.00024 2.80429 3 3.04532V14.409C3 14.5295 3.04789 14.6451 3.13313 14.7304C3.21838 14.8156 3.33399 14.8635 3.45455 14.8635H3.90909C3.97966 14.8635 4.04928 14.8471 4.1124 14.8156C4.17552 14.784 4.23042 14.7382 4.27273 14.6817L5.27273 13.3485L6.27273 14.6817C6.31687 14.7354 6.37238 14.7787 6.43526 14.8084C6.49813 14.8382 6.56682 14.8536 6.63636 14.8536C6.70591 14.8536 6.77459 14.8382 6.83747 14.8084C6.90035 14.7787 6.95586 14.7354 7 14.6817L8 13.3485L9 14.6817C9.04415 14.7354 9.09965 14.7787 9.16253 14.8084C9.22541 14.8382 9.29409 14.8536 9.36364 14.8536C9.43318 14.8536 9.50187 14.8382 9.56474 14.8084C9.62762 14.7787 9.68313 14.7354 9.72727 14.6817L10.7273 13.3485L11.7273 14.6817C11.7696 14.7382 11.8245 14.784 11.8876 14.8155C11.9507 14.8471 12.0203 14.8635 12.0909 14.8635H12.5455C12.666 14.8635 12.7816 14.8156 12.8669 14.7304C12.9521 14.6451 13 14.5295 13 14.409V3.04532C12.9997 2.8043 12.9039 2.57323 12.7334 2.4028C12.563 2.23237 12.3319 2.13651 12.0909 2.13623ZM12.0909 13.6512L11.0909 12.318C11.0468 12.2643 10.9913 12.221 10.9284 12.1913C10.8655 12.1616 10.7968 12.1462 10.7273 12.1462C10.6577 12.1462 10.589 12.1616 10.5262 12.1913C10.4633 12.221 10.4078 12.2643 10.3636 12.318L9.36364 13.6512L8.36364 12.318C8.31949 12.2643 8.26398 12.221 8.20111 12.1913C8.13823 12.1616 8.06955 12.1462 8 12.1462C7.93045 12.1462 7.86177 12.1616 7.79889 12.1913C7.73602 12.221 7.68051 12.2643 7.63636 12.318L6.63636 13.6512L5.63636 12.318C5.59222 12.2643 5.53671 12.221 5.47383 12.1913C5.41096 12.1616 5.34227 12.1462 5.27273 12.1462C5.20318 12.1462 5.1345 12.1616 5.07162 12.1913C5.00874 12.221 4.95324 12.2643 4.90909 12.318L3.90909 13.6512V3.04532H12.0909V13.6512Z" fill="#0F75BC" />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_156_5526">
                                        <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                  Edit Invoice
                                </Link>
                                <Link onClick={(e) => handleDropdownOptionClick(() => handleDeletePastApptsShow(extendedProps.appointmentId))} >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                    <path d="M12.7037 4.3C12.8707 4.3 13.0308 4.36321 13.1489 4.47574C13.267 4.58826 13.3333 4.74087 13.3333 4.9C13.3333 5.05913 13.267 5.21174 13.1489 5.32426C13.0308 5.43679 12.8707 5.5 12.7037 5.5H12.0741L12.0722 5.5426L11.4847 13.3852C11.4621 13.688 11.32 13.9713 11.0869 14.1781C10.8538 14.385 10.5471 14.5 10.2286 14.5H5.10407C4.78557 14.5 4.47889 14.385 4.24582 14.1781C4.01274 13.9713 3.87058 13.688 3.84796 13.3852L3.26052 5.5432C3.25956 5.52882 3.25914 5.51441 3.25926 5.5H2.62963C2.46264 5.5 2.30249 5.43679 2.18441 5.32426C2.06634 5.21174 2 5.05913 2 4.9C2 4.74087 2.06634 4.58826 2.18441 4.47574C2.30249 4.36321 2.46264 4.3 2.62963 4.3H12.7037ZM10.8129 5.5H4.52041L5.1047 13.3H10.2286L10.8129 5.5ZM8.92593 2.5C9.09291 2.5 9.25306 2.56321 9.37114 2.67574C9.48922 2.78826 9.55556 2.94087 9.55556 3.1C9.55556 3.25913 9.48922 3.41174 9.37114 3.52426C9.25306 3.63679 9.09291 3.7 8.92593 3.7H6.40741C6.24042 3.7 6.08027 3.63679 5.96219 3.52426C5.84411 3.41174 5.77778 3.25913 5.77778 3.1C5.77778 2.94087 5.84411 2.78826 5.96219 2.67574C6.08027 2.56321 6.24042 2.5 6.40741 2.5H8.92593Z" fill="#FC5C5C" />
                                  </svg>
                                  Delete</Link>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                else if (calendarView === "timeGridWeek") {
                  return (
                    <div onClick={(e) => handleEventClick(e, arg.event.id)} className="d-flex boxFl boxGreen">
                      <i className="pName">{extendedProps.patient_name} </i>
                      {extendedProps.video_start_end_time ? (
                        <b> {extendedProps.video_start_end_time}</b>
                      ) : <b>
                        {extendedProps.token ? extendedProps.token : extendedProps.time}
                      </b>}
                    </div>
                  );
                }
                else if (calendarView === "dayGridMonth") {
                  return (
                    <div onClick={(e) => handleEventClick(e, arg.event.id)} className="d-flex boxFl boxGreen">
                      <span className="timeMonth">{extendedProps.video_start_end_time ? extendedProps.video_start_end_time : extendedProps.time ? extendedProps.time : extendedProps.token ? extendedProps.token : ''}</span>
                      <i>
                        {extendedProps.patient_name.length > 8
                          ? extendedProps.patient_name.substring(0, 8) + "..."
                          : (<span className="pName">{extendedProps.patient_name}</span>)}
                      </i>
                      {/* <b>{arg.timeText}</b>  */}
                    </div>
                  );
                }
                return null;
              }}
            />
            {selectedEvent && (
              <>
                <Popover
                  open={openPopover}
                  className="boxModalFollowupMain"
                  content={
                    <div className="boxModalFollowup">
                      <div className="mobileHeader"><div className="btnClose" onClick={() => setOpenPopover(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <path d="M8.99287 10.3925L5.1368 6.27938L5.00001 6.13347L4.86322 6.27938L1.00714 10.3925L0.257012 9.59238L4.12965 5.46157L4.24988 5.33333L4.12965 5.20509L0.257012 1.07429L1.00714 0.274146L4.86322 4.38729L5.00001 4.53319L5.1368 4.38729L8.99287 0.274146L9.743 1.07429L5.87036 5.20509L5.75014 5.33333L5.87036 5.46157L9.743 9.59238L8.99287 10.3925Z" fill="#313131" stroke="white" strokeWidth="0.375" />
                        </svg>
                      </div>
                        <h3 className="d-lg-block d-none">{selectedEvent.extendedProps.appointmentType}</h3>
                        <h3 className="d-lg-none d-block"> Appointment Details</h3>
                      </div>
                      <div className="dateandTime">
                        <p><img style={{ width: '11px', height: '11px' }} src={calendarIcon} alt="date" />Mon, {selectedEvent?.extendedProps?.isDate}</p>
                        <p> <img style={{ width: '11px', height: '11px' }} src={clock} alt="time" />
                          {selectedEvent.extendedProps.isOnlineApp == 0 ? (
                            <p>{selectedEvent.extendedProps.token ? selectedEvent.extendedProps.token : selectedEvent.extendedProps.time}</p>
                          ) : <p>
                            {selectedEvent.extendedProps.video_start_end_time}
                          </p>}
                        </p>
                      </div>
                      <div className="boxGrid">
                        <div><label>Patient Name</label><p>{selectedEvent.extendedProps.patient_name}</p></div>
                        <div><label>Status</label><p>{selectedEvent.extendedProps.status}</p></div>
                        <div><label>Phone Number</label><p>{selectedEvent.extendedProps.patient_number}</p></div>
                        <div><label>Doctor</label><p>Dr. {selectedEvent.extendedProps.doctor}</p></div>
                        <div><label>Amount</label><p>Rs. {selectedEvent.extendedProps.amount}/-</p></div>
                        <div><label>Clinic</label><p>{selectedEvent.extendedProps.clinicName}</p></div>
                      </div>
                      <div className="d-flex justify-content-end gap12">
                        {["Completed", "Confirmed"].includes(selectedEvent.extendedProps?.status) && (
                          selectedEvent.extendedProps?.isPartial == 1 ? (
                            <button className='button1 px-2' onClick={() => handlePartialPaymentShow(selectedEvent.extendedProps)}>
                              ADD INVOICE
                            </button>
                          ) : (
                            <button className='button1 px-2' onClick={() => handleViewInvoiceShow(selectedEvent.extendedProps)}>
                              VIEW INVOICE
                            </button>
                          )
                        )}
                        {selectedEvent.extendedProps.status == "Booked" && selectedEvent.extendedProps?.isPartial == 1 ? (
                          <button onClick={() => handlePartialPaymentShow(selectedEvent.extendedProps)} className='button1' style={{ fontSize: "12px", padding: "0px 15px" }}>
                            ADD INVOICE
                          </button>
                        ) : (selectedEvent.extendedProps.status !== "Completed" && selectedEvent.extendedProps.status !== "Confirmed" && <button disabled={selectedEvent.extendedProps.status == "Confirmed"} onClick={() => handleAddInvoice(selectedEvent.extendedProps)} className='button1' style={{ fontSize: "12px", padding: "0px 15px" }}>
                          ADD INVOICE
                        </button>)}
                        <Button disabled={selectedEvent.extendedProps?.isCosnultNowEnable == 0 && selectedEvent.extendedProps?.isPartial == 0 || selectedEvent.extendedProps?.status == "Refunded" || selectedEvent.extendedProps?.isPartial == 1} onClick={(e) => {
                          if (selectedEvent.extendedProps.fadVideo === "in-person" || selectedEvent.extendedProps.isFad === 0) {
                            handleConsultNowOffline(selectedEvent.extendedProps);
                          } else {
                            emitAppointmentStart(e, selectedEvent.extendedProps);
                          }
                        }} className="btns btn02">CONSULT Now</Button>
                      </div>
                    </div>
                  }
                  onOpenChange={(isOpen) => setOpenPopover(isOpen)}
                />
              </>
            )}
            <div className="d-flex align-items-center totalAppoint">
              <p>Total Appointments: <b>{totalAppointmentsCount}</b></p>
              <ul className="totalApp">
                <li>

                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                    <circle cx="6" cy="6.5" r="6" fill="#0F75BC" />
                  </svg>
                  Clinic Appointment
                </li>
                <li>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                    <circle cx="6" cy="6.5" r="6" fill="#7FC241" />
                  </svg>
                  Online Appointment
                </li>
              </ul>
            </div>

            {selectedAppointment && (
              <CancelAppointmentModal
                cancelAppointment={cancelAppointment}
                handleCancelClose={handleCancelClose}
                getCalenderWiseApps={getCalenderWiseApps}
                patientName={selectedAppointment.patient_name}
                appointmentDate={selectedAppointment.appointment_completed_at}
                time={selectedAppointment.time}
                appointmentType={selectedAppointment.appointmentType}
                appointmentId={selectedAppointment.appointmentId}
              />
            )}

            <ViewInvoiceModal
              viewInvoice={viewInvoice}
              handleViewInvoiceClose={handleViewInvoiceClose}
              patientName={selectedAppointment?.patient_name}
              appointmentDate={selectedAppointment?.appointment_completed_at}
              paymentMethod={selectedAppointment?.paymentMethod}
              time={selectedAppointment?.time}
              appointmentId={selectedAppointment?.appointmentId}
              amountRecieve={selectedAppointment?.amount}
              consultationType={selectedAppointment?.fadVideo}
              clinicName={selectedAppointment?.clinicName}
            />

            <AddInvoiceModal
              consultationFees={consultationFees}
              addInvoice={addInvoice}
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
              appliedConsultationDiscount={appliedConsultationDiscount}
              setAppliedConsultationDiscount={setAppliedConsultationDiscount}
              procedureRows={procedureRows}
              setProcedureRows={setProcedureRows}
              paymentMethods={paymentMethods}
              setPaymentMethods={setPaymentMethods}
              postBookAnAppointment={postBookAnAppointment}
              setAddInvoice={setAddInvoice}
              handleAddInvoiceClose={handleAddInvoiceClose}
            />
            <RefundModalShow confirmId={confirmId} RefundFunc={RefundFunc} setRefundAmount={setRefundAmount} refundAmount={refundAmount} setAmountReceived={setAmountReceived} amountReceived={amountReceived} setRefundReason={setRefundReason} refundReason={refundReason} handleRefundClose={handleRefundClose} refundShow={refundShow} />
            <CheckInModal checkInpastAppointments={checkInpastAppointments} confirmId={confirmId} setCheckInModal={setCheckInModal} checkInModal={checkInModal} />
            <DeletePastApptsModal appointmentType={"Upcoming"} appointmentId={confirmId} deleteAppointment={deleteAppointment} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />
            <BookAppointmentModal isRescheduling={isRescheduling} prefilledData={prefilledData} doctors={doctors} bookAppointmentShow={bookAppointmentShow} handleBookAppointmentClose={handleBookAppointmentClose} setBookAppointmentShow={setBookAppointmentShow} />
            <OutOfficeModal
              formattedEndDate={formattedEndDate}
              setFormattedEndDate={setFormattedEndDate}
              formattedStartDate={formattedStartDate}
              setFormattedStartDate={setFormattedStartDate}
              buttonDisabled={buttonDisabled}
              saveLeftDoctor={saveLeftDoctor}
              setDoctorError={setDoctorError}
              doctorError={doctorError}
              setLeaveMessage={setLeaveMessage}
              leaveMessage={leaveMessage}
              setNewAndExistingAppt={setNewAndExistingAppt}
              newAndExistingAppt={newAndExistingAppt}
              onlyNewAppt={onlyNewAppt}
              setOnlyNewAppt={setOnlyNewAppt}
              setIsDeclined={setIsDeclined}
              isDeclined={isDeclined}
              endDate={endDate}
              startDate={startDate}
              setEndDate={setEndDate}
              updateSelectiveDate={updateSelectiveDate}
              setStartDate={setStartDate}
              setLeftDoctorId={setLeftDoctorId}
              leftDoctorId={leftDoctorId}
              doctors={doctors}
              outOfficeShow={outOfficeShow}
              handleOutOfficeClose={handleOutOfficeClose}
              updateSpecificDate={updateSpecificDate}
              updatedDoctorData={updatedDoctorData}
              leaveEntryData={leaveEntryData} />
            <UploadFileCalendar handleCloseHealthModal={handleCloseHealthModal} showHealthRecord={showHealthRecord} uploadRecord={uploadRecord} />
            <EditInvoiceModal handleEditInvoiceClose={handleEditInvoiceClose} editInvoiceShow={editInvoiceShow} />
            <PartialPaymentModal partialPaymentId={partialPaymentId} partialPaymentShow={partialPaymentShow} handlePartialPaymentClose={handlePartialPaymentClose} getCalenderWiseApps={getCalenderWiseApps} />
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default CalendarView;