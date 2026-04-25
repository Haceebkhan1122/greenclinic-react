import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import { Modal } from 'react-bootstrap';
import Close from "../../../assets/images/svg/close_search.svg";
import "./bookAppointmentModal.scss"
import AppointmentTabs from '../../appointmentTabs/AppointmentTabs';
import InvoiceTabs from "../../invoiceTabs/InvoiceTabs";
import API from '../../../services/httpInstance';
import { useSelector } from 'react-redux';
import { Checkbox } from 'antd';
import { Form, Row, Col, Container } from "react-bootstrap"
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { toast, ToastContainer } from 'react-toastify';

const BookAppointmentModal = ({ isRescheduling, setAppointmentClicked, appointmentClicked, setAppointmentData, appointmentData, bookAppointmentShow, handleBookAppointmentClose, doctors, setBookAppointmentShow, prefilledData, fromUpcomingApp, getClinicAppointmentsListing }) => {
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [doctorId, setDoctorId] = useState(null);
  const [reports, setReports] = useState('0');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState("");
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [consultationFees, setConsultationFees] = useState('');
  const [doctorProcedures, setDoctorProcedures] = useState([]);
  const [doctorProceduresQuantity, setDoctorProceduresQuantity] = useState([]);
  const [consultationDiscount, setConsultationDiscount] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [totalConsultation, setTotalConsultation] = useState(null);
  const [totalValueBeforeDiscount, setTotalValueBeforeDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [appliedConsultationDiscount, setAppliedConsultationDiscount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState('');
  const [dateSelect, setDateSelect] = useState('');
  const [existingMrNumber, setExistingMrNumber] = useState('');
  const [existPatientId, setExistPatientId] = useState(null);
  const [isInvoiceChecked, setIsInvoiceChecked] = useState(false);
  const [doctorIdError, setDoctorIdError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [isDisabled, setisDisabled] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [dynamicValues, setDynamicValues] = useState({});

  const handleCheckboxChange = (e) => {
    setIsInvoiceChecked(e.target.checked);
  };

  console.log({ doctors })

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

  useEffect(() => {
    if (bookAppointmentShow == false) {
      setPhoneNumber('')
    }
  }, [bookAppointmentShow])

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

  const getFields = async () => {
    try {
      const response = await API.get(`/appointment-fields`)
      if (response?.status == 200) {
        setDynamicFields(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!dynamicFields) {
      getFields()
    }
  }, [dynamicFields])

  useEffect(() => {
    if (doctorId) {
      handleConsultationFees()
      handleProcedure()
    }
  }, [doctorId])

  const subTotal = Number(totalValueBeforeDiscount) + Number(consultationFees);
  // 2 amount jo deni hain user ko, aik procedures ki amount aur dusri consultation fees. wo add hokr subTotal hui 
  const grandDiscount = Number(totalDiscount) + Number(appliedConsultationDiscount);

  // total discount wo hai jo procedures per client lagaeyga.. appliedConsultationDiscount wo jo consultationFees per lagega

  const effectiveConsultation = totalConsultation !== null ? Number(totalConsultation) : Number(consultationFees);
  // Agar totalConsultation hai to wo, warna consultationFees use karo ... yaad rakhna ye effectiveConsultation payload mai nahi jaeygi
  const grandTotalAmount = Math.max(
    Number(totalAmount) + effectiveConsultation,
    0
  );
  // grandtotal mai sab add hne chaiye. consultation, procedure amount
  const remainingAmount = grandTotalAmount - Number(totalAmountReceived);

  const downloadAppointment = async (id) => {
    try {
      const response = await API.get(`/download-appointment-pdf/${id}?invoice=1`)
      if (response?.status == 200) {
        const pdfUrl = response.data?.data?.url;
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const postResheduling = async (data, type) => {
    const body = {
      appointmentId: data?.id,
      time_token: selectedTime,
      appointment_date: dateSelect,
    }
    setisDisabled(true)
    const response = await API.patch(`/reschedule-appointment`, body)
    if (response?.status == 200) {
      setisDisabled(false)
      if (type == '1') {
        downloadAppointment(response?.data?.data?.appointmentId)
      }
      setisDisabled(false)
      setBookAppointmentShow(false)
    } else {
      setisDisabled(false)
    }
  }

  const resetFields = () => {
    setDoctorId(null);
    setReports('0');
    setPhoneNumber('');
    setSelectedTime('');
    setName('');
    setAge('');
    setGender('');
    setConsultationFees('');
    setDoctorProcedures([]);
    setDoctorProceduresQuantity([]);
    setConsultationDiscount('');
    setTotalAmountReceived(0);
    setTotalConsultation(null);
    setTotalValueBeforeDiscount(0);
    setTotalDiscount(0);
    setTotalAmount(0);
    setAppliedConsultationDiscount(0);
    setPaymentMethods('');
    setDateSelect('');
    setExistingMrNumber('');
    setExistPatientId(null);
    setIsInvoiceChecked(false);
    setDoctorIdError('');
    setPhoneError('');
    setNameError('');
    setGenderError('');
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
    ]);
  }

  const postBookAnAppointment = async (print) => {
    let derivedCode = '';
    let cleanPhone = phoneNumber?.trim();
    let inputPhone = cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone;

    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      inputPhone = import.meta.env.VITE_DEFAULT_COUNTRY_CODE + cleanPhone.slice(1);
    }

    const phoneObj = parsePhoneNumberFromString(inputPhone);

    if (phoneObj?.isValid()) {
      derivedCode = phoneObj.countryCallingCode;
      cleanPhone = phoneObj.nationalNumber;
    } else {
      toast.error("Invalid phone number format", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark"
      });
      return;
    }
    const procedureData = procedureRows?.map((item) => ({
      amount: Number(item?.procedureAmount) || 0,
      id: item?.selectedProcedure || null,
      discount: item.calculatonValue
        ? (item.calculatonValue * item.discountProcedure) / 100
        : 0,
    })).filter(item => item.id !== null);

    const payload = {
      doctor_id: doctorId,
      phone: cleanPhone,
      country_code: derivedCode,
      name: name,
      appointment_date: dateSelect,
      time_token: selectedTime,
      mr_no: existingMrNumber,
      invoicecheck: totalAmountReceived ? '1' : '0',
      consultation_fees: consultationFees,
      fee_discount: appliedConsultationDiscount,
      ...(procedureData.length > 0 && { procedure: procedureData }), // Add procedure only if valid
      payment_mode: paymentMethods,
      amount_rec: totalAmountReceived,
      sub_total: subTotal,
      discount: grandDiscount,
      grand_total: grandTotalAmount,
      remaining_amount: remainingAmount,
      is_print: print == 1 ? '1' : '0',
      patient_id: existPatientId == null ? '0' : existPatientId,
      medical_history: 'Referred',
      ...dynamicValues,
      // gender: gender,
      // age : age,
    }
    if (!doctorId) {
      toast.error("Please select doctor", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    } else if (!phoneNumber) {
      toast.error("Phone number is required", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    } else if (!name) {
      toast.error("Name is required", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    for (const field of dynamicFields) {
      if (field.required == 1 && !dynamicValues[field.key]) {
        toast.error(`${field.title} is required`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
    }

    if (!selectedTime) {
      toast.error("Time/token is required", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    else {
      try {
        setisDisabled(true);
        const response = await API.post(`/book-appointment`, payload)
        if (response?.status == 200) {
          setisDisabled(false);
          resetFields()
          if (getClinicAppointmentsListing) {
            getClinicAppointmentsListing();
          }
          if (print == '1') {
            downloadAppointment(response?.data?.data)
          }
          setBookAppointmentShow(false)
        } else {
          setisDisabled(false);
          toast.error(response?.data?.message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        }
      } catch (error) {
        console.log(error)
        setisDisabled(false);
      }
    }
  }

  const items = [
    {
      key: '1',
      label: 'Appointment Details',
      children: <AppointmentTabs
        isDisabled={isDisabled}
        doctors={doctors}
        setDoctorId={setDoctorId}
        doctorId={doctorId}
        setReports={setReports}
        reports={reports}
        phoneNumber={phoneNumber}
        setCountryCode={setCountryCode}
        countryCode={countryCode}
        setPhoneNumber={setPhoneNumber}
        setExistingMrNumber={setExistingMrNumber}
        existingMrNumber={existingMrNumber}
        setSelectedTime={setSelectedTime}
        selectedTime={selectedTime}
        setGender={setGender}
        gender={gender}
        age={age}
        setAge={setAge}
        name={name}
        setName={setName}
        setDateSelect={setDateSelect}
        dateSelect={dateSelect}
        postBookAnAppointment={postBookAnAppointment}
        setExistPatientId={setExistPatientId}
        prefilledData={prefilledData}
        fromUpcomingApp={fromUpcomingApp}
        postResheduling={postResheduling}
        isRescheduling={isRescheduling}
        dynamicFields={dynamicFields}
        dynamicValues={dynamicValues}
        setDynamicValues={setDynamicValues}
        appointmentData={appointmentData}
        setAppointmentData={setAppointmentData}
        appointmentClicked={appointmentClicked}
        setAppointmentClicked={setAppointmentClicked}
      />,
    },
    {
      key: '2',
      label: 'Invoice',
      children: <InvoiceTabs
        isDisabled={isDisabled}
        handleBookAppointmentClose={handleBookAppointmentClose}
        consultationFees={consultationFees}
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
        prefilledData={prefilledData}
      />,
      disabled: !!prefilledData,
    },
  ];

  return (
    <Modal className='modal_appointment appointmeintMainModal' show={bookAppointmentShow} onHide={handleBookAppointmentClose}>
      <div className='d-lg-none d-flex mobBar'>
        <button className='close1' onClick={handleBookAppointmentClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7.81878 12.9994L13.4154 18.5961L11.9913 19.9952L3.99609 12L11.9913 4.00488L13.4154 5.40404L7.81878 11.0007H19.9864V12.9994H7.81878Z" fill={themeColor} />
          </svg>
        </button>
        <h4>
          {!isInvoiceChecked ? ("Book an Appointment") : ("Add Invoice")}</h4>

      </div>
      <Modal.Body>
        <button className='close' onClick={handleBookAppointmentClose}>
          <img src={Close} alt="" />
        </button>
        <h4>{isRescheduling
          ? "Edit Appointment"
          : "Book an Appointment"}</h4>
        <div className='d-lg-block d-none'>
          <Tabs defaultActiveKey="1" items={items} className='tabClass' />
        </div>
        <div className="d-lg-none d-block boxMob">
          {/* Appointment Form */}
          {!isInvoiceChecked && (
            <div className="appointmentForm">
              <AppointmentTabs
                doctorIdError={doctorIdError}
                genderError={genderError}
                nameError={nameError}
                doctors={doctors}
                setDoctorId={setDoctorId}
                doctorId={doctorId}
                setReports={setReports}
                reports={reports}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                setExistingMrNumber={setExistingMrNumber}
                setCountryCode={setCountryCode}
                countryCode={countryCode}
                existingMrNumber={existingMrNumber}
                setSelectedTime={setSelectedTime}
                selectedTime={selectedTime}
                setAppointmentData={setAppointmentData}
                setGender={setGender}
                gender={gender}
                age={age}
                setAge={setAge}
                name={name}
                setName={setName}
                setDateSelect={setDateSelect}
                dateSelect={dateSelect}
                postBookAnAppointment={postBookAnAppointment}
                postResheduling={postResheduling}
                setExistPatientId={setExistPatientId}
              />
            </div>
          )}

          {/* Checkbox for Add Invoice */}
          <Row className='mt-0'>
            <Col lg={12}>
              <div className="mb-3 px-3 checkboxcheck">

                <Checkbox
                  type="checkbox"
                  checked={isInvoiceChecked}
                  onChange={handleCheckboxChange}
                />
                <Form.Label>Add Invoice</Form.Label>
              </div>
            </Col>
          </Row>
          {/* Invoice Form */}
          {isInvoiceChecked && (
            <div className="invoiceForm">
              <InvoiceTabs
                handleBookAppointmentClose={handleBookAppointmentClose}
                consultationFees={consultationFees}
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
              />
            </div>
          )}
        </div>
      </Modal.Body>
      <ToastContainer />
    </Modal>
  )
}

export default BookAppointmentModal