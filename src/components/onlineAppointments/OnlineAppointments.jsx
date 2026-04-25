import React, { useEffect, useState } from 'react'
import { Table, Dropdown } from 'react-bootstrap';
import More from "../../assets/images/svg/more.svg"
import { Link, useNavigate } from 'react-router-dom';
import Delete from "../../assets/images/svg/delete_icon.svg"
import Close from "../../assets/images/png/red_close.png"
import './OnlineAppointments.scss'
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import CancelAppointmentModal from '../modal/cancelAppointmentModal/CancelAppointmentModal';
import Cookies from 'js-cookie';
import AgoraRTM from "agora-rtm-sdk";
import API, { API_MERISEHAT, API_MS } from '../../services/httpInstance';
import { useSelector } from 'react-redux';
import ViewInvoiceModal from '../modal/viewInvoiceModal/ViewInvoiceModal';
import ViewRxModal from '../modal/viewRxModal/ViewRxModal';
import axios from 'axios';
import AddInvoiceModal from '../modal/addInvoiceModal/AddInvoiceModal';
import PartialPaymentModal from '../modal/partialpaymentModal/PartialPaymentModal';
import moment from 'moment/moment';
import Timer from '../countdownAppointment';

const OnlineAppointments = ({ isStatusChecked, isPatientJoin, isAmountChecked, getOnlineAppointmentsListing, isLastVisitChecked, isTimeChecked, isSourceChecked, isAppointmentTypeChecked, isTimeSlotChecked, isMrChecked, isPatientNameChecked, isNumberChecked, filteredDataOnline, paginateCountData, currentPage, handlePageClick, totalPages }) => {
  let doctorData = useSelector((state) => state?.user?.user);
  // let clinicId = useSelector((state) => state?.user?.clinic_id);

  const navigate = useNavigate()
  const [cancelAppointment, setCancelAppoinment] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(false)
  const [viewRxShow, setViewRxShow] = useState(false)
  const [consultationFees, setConsultationFees] = useState('');
  const [addInvoice, setAddInvoice] = useState(false);
  const [totalAmountReceivedError, setTotalAmountReceivedError] = useState('');
  const [doctorProcedures, setDoctorProcedures] = useState([]);
  const [doctorProceduresQuantity, setDoctorProceduresQuantity] = useState([]);
  const [consultationDiscount, setConsultationDiscount] = useState('');
  const [totalAmountReceived, setTotalAmountReceived] = useState('');
  const [totalConsultation, setTotalConsultation] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [totalValueBeforeDiscount, setTotalValueBeforeDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [doctorId, setDoctorId] = useState(null);
  const [partialPaymentShow, setPartialPaymentShow] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0);
  const [appliedConsultationDiscount, setAppliedConsultationDiscount] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState('');
  const [partialPaymentId, setPartialPaymentId] = useState(false)
  const [countdown, setCountdown] = useState(null);
  const [isConsultEnabled, setIsConsultEnabled] = useState(false);
  
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


  const [onlinePermissions, setOnlinePermissions] = useState({});
  const [cancelAppoints, setCancelAppoints] = useState({});
  let userPermissions = useSelector((state) => state.clinic.userPermissions);

  // console.log("onlinee", onlinePermissions);

  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "appointments_view");

    const childPermissions = viewPermission?.child || [];
    const perms = {};

    childPermissions.forEach(child => {
      perms[child.slug] = true;
    });
    setOnlinePermissions(perms);
  }, [userPermissions]);


  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "online-appointments");

    const childPermissions = viewPermission?.child || [];
    const perms = {};

    childPermissions.forEach(child => {
      perms[child.slug] = true;
    });
    setCancelAppoints(perms);
  }, [userPermissions]);

  const handlePartialPaymentClose = () => setPartialPaymentShow(false)

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
        getOnlineAppointmentsListing();
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

  const handleOpenInvoice = (appt) => {
    setDoctorId(appt?.doctor_id)
    setAppointmentId(appt?.id)
    setAddInvoice(true)
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

  useEffect(() => {
    if (doctorId) {
      handleConsultationFees()
      handleProcedure()
    }
  }, [doctorId])

  const handleAddInvoiceClose = () => setAddInvoice(false)

  const handleViewInvoiceShow = (appt) => {
    setSelectedAppointment(appt)
    setViewInvoice(true)
  }

  const handleViewInvoiceClose = () => setViewInvoice(false)

  const handleViewRxShow = (appt) => {
    setSelectedAppointment(appt)
    setViewRxShow(true)
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

  const handleViewRxClose = () => setViewRxShow(false)

  const handleCancelClose = () => setCancelAppoinment(false)

  const handleCancelShow = (appt) => {
    setSelectedAppointment(appt)
    setCancelAppoinment(true)
  }

  const handlePartialPaymentShow = (appt) => {
    setPartialPaymentId(appt?.id)
    setPartialPaymentShow(true)
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
  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = filteredDataOnline?.filter(
    (appt) => appt?.appointment_date === today
  );

  const [consultStart, setConsultStart] = useState(true);

  // useEffect(() => {
  //   let interval;
  //   const timer = () => {
  //     if (filteredDataOnline && filteredDataOnline.length > 0) {
  //       const startTimeStr = filteredDataOnline[0]?.time; 

  //       const today = moment().format("YYYY-MM-DD");
  //       const eventTime = moment(`${today} ${startTimeStr}`, "YYYY-MM-DD h:mm a");
  //       const tenMinutesBefore = eventTime.clone().subtract(10, 'minutes');

  //       const now = moment();

  //       console.log("tenMinutesBefore", tenMinutesBefore.format("h:mm a"));
  //       console.log("now", now.format("h:mm a"));

  //       if (now.isSameOrAfter(tenMinutesBefore)) {
  //         setConsultStart(false);
  //       } else {
  //         setConsultStart(true); 
  //       }
  //     }
  //   };

  //   interval = setInterval(timer, 3000);
  //   timer(); // run immediately

  //   return () => clearInterval(interval);
  // }, [filteredDataOnline]);

  return (
    <>
      <div className='d-lg-none d-block mobBox'>
        {filteredDataOnline?.length > 0 && filteredDataOnline?.map((appt) => {
          return (
            <>
              <div className='appointmentBox'>
                <div className='headerAppointment'>
                  <h5>
                    {isTimeSlotChecked == true && (
                      <span className='text-center'>  {appt?.last_visit} | {appt?.time}</span>
                    )}
                  </h5>
                  <div className='rightBox'>
                    <div className='buttons'>
                      {appt?.appointment_status && (
                        <Link className='button2 completed'>
                          {appt?.appointment_status == 'confirmed' ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                              <path d="M0 7.5C0 3.63401 3.13401 0.5 7 0.5C10.866 0.5 14 3.63401 14 7.5C14 11.366 10.866 14.5 7 14.5C3.13401 14.5 0 11.366 0 7.5Z" fill="#7CC14B" />
                              <path d="M6.18073 10.1832L10.2932 6.07067L9.47656 5.254L6.18073 8.54984L4.51823 6.88734L3.70156 7.704L6.18073 10.1832ZM6.9974 13.3332C6.19045 13.3332 5.43212 13.18 4.7224 12.8738C4.01267 12.5675 3.39531 12.1519 2.87031 11.6269C2.34531 11.1019 1.92969 10.4846 1.62344 9.77484C1.31719 9.06512 1.16406 8.30678 1.16406 7.49984C1.16406 6.69289 1.31719 5.93456 1.62344 5.22484C1.92969 4.51512 2.34531 3.89775 2.87031 3.37275C3.39531 2.84775 4.01267 2.43213 4.7224 2.12588C5.43212 1.81963 6.19045 1.6665 6.9974 1.6665C7.80434 1.6665 8.56267 1.81963 9.2724 2.12588C9.98212 2.43213 10.5995 2.84775 11.1245 3.37275C11.6495 3.89775 12.0651 4.51512 12.3714 5.22484C12.6776 5.93456 12.8307 6.69289 12.8307 7.49984C12.8307 8.30678 12.6776 9.06512 12.3714 9.77484C12.0651 10.4846 11.6495 11.1019 11.1245 11.6269C10.5995 12.1519 9.98212 12.5675 9.2724 12.8738C8.56267 13.18 7.80434 13.3332 6.9974 13.3332ZM6.9974 12.1665C8.30017 12.1665 9.40365 11.7144 10.3078 10.8103C11.212 9.90609 11.6641 8.80262 11.6641 7.49984C11.6641 6.19706 11.212 5.09359 10.3078 4.18942C9.40365 3.28525 8.30017 2.83317 6.9974 2.83317C5.69462 2.83317 4.59115 3.28525 3.68698 4.18942C2.78281 5.09359 2.33073 6.19706 2.33073 7.49984C2.33073 8.80262 2.78281 9.90609 3.68698 10.8103C4.59115 11.7144 5.69462 12.1665 6.9974 12.1665Z" fill="white" />
                            </svg> : ''}
                          {appt?.appointment_status}</Link>
                      )}
                      <Dropdown className='dropdownUpcoming'>
                        <Dropdown.Toggle id="dropdown-basic">
                          <img src={More} alt="" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {cancelAppoints["cancel-online-appointments"] && <Dropdown.Item onClick={() => handleCancelShow(appt)} className="ancLink">
                            <img src={Delete} alt="" className="tw-w-[16px]" />
                            Cancel
                          </Dropdown.Item>}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
                <div className='boxUserApp'>
                  <h3>{isPatientNameChecked == true && (
                    <span>{appt?.patient_name}</span>
                  )}
                    {isNumberChecked == true && (
                      <span className='number'>{appt?.patient_number}</span>
                    )}</h3>
                  <h5>
                    {isAmountChecked == true && (
                      <span>PKR {appt?.amount_recieve}</span>
                    )}
                    <a className={`consult`} onClick={(e) => emitAppointmentStart(e, appt)}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M6.87891 15.2368L11.8789 10.2368L6.87891 5.23682" stroke="#5E6366" stroke-width="1.69847" stroke-linecap="round" stroke-linejoin="round" />
                    </svg></a>
                  </h5>
                </div>
              </div>
            </>)
        })}
      </div>
      <div className='d-none d-lg-block'>
        <Table responsive>
          <thead>
            <tr>
              {isTimeSlotChecked == true && (
                <th className='yellow-bg text-center'>Time slot</th>
              )}
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
                <th>Consultation Type</th>
              )}
              <th>Location</th>
              {isTimeChecked == true && (
                <th>Time</th>
              )}
              <th>Doctor</th>
              {isLastVisitChecked == true && (
                <th>Last Visit</th>
              )}
              {isAmountChecked == true && (
                <th>Amount</th>
              )}
              {isStatusChecked == true && (
                <th>Status</th>
              )}
              <th className='text-center'>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody className=''>
            {filteredDataOnline?.length > 0 && filteredDataOnline?.map((appt) => {
              const nowMoment = moment();
              const startMoment = moment(appt?.time, "h:mm a");
              const fiveMinutesBefore = moment(startMoment).subtract(5, "minutes");
              return (
                <>
                  <tr>
                    {isTimeSlotChecked == true && (
                      <td className='text-center'>{appt?.time}</td>
                    )}
                    {isMrChecked == true && (
                      <td>{appt?.patient_mr_no}</td>
                    )}
                    {isPatientNameChecked == true && (
                      <td>{appt?.patient_name}</td>
                    )}
                    {isNumberChecked == true && (
                      <td>{appt?.patient_number}</td>
                    )}
                    {isAppointmentTypeChecked == true && (
                      <td>{appt?.consultation_type}</td>
                    )}
                    <td>{appt?.clinic_name}</td>
                    {isTimeChecked == true && (
                      <td>{appt?.start_time ? appt?.start_time : appt?.time}</td>
                    )}
                    <td>{appt?.doctor_name}</td>
                    {isLastVisitChecked == true && (
                      <td>{appt?.last_visit}</td>
                    )}
                    {isAmountChecked == true && (
                      <td>{appt?.amount_recieve}</td>
                    )}
                    {isStatusChecked == true && (
                      <td style={{ color: ["cancelled", "cancelled by user"].includes(appt?.appointment_status) && '#FC5C5C' }}>{appt?.appointment_status}</td>
                    )}
                    <td>
                      <div className='buttons'>
                        {/* {appt?.appointment_status == "Confirmed" && (
                          <button className='button1'>ADD INVOICE</button>
                        )} */}
                        {["Completed", "Confirmed", "completed"].includes(appt?.appointment_status) && (
                          appt?.is_partial == 1 ? (
                            <button className='button1' onClick={() => handlePartialPaymentShow(appt)}>
                              ADD INVOICE
                            </button>
                          ) : (
                            <button className='button1' onClick={() => handleViewInvoiceShow(appt)}>
                              VIEW INVOICE
                            </button>
                          )
                        )}
                        {["completed", "Completed"].includes(appt?.appointment_status) && (
                          <button className='button2' onClick={() => printPrecscription(appt?.id)}>VIEW RX</button>
                        )}
                        {["missed", "cancelled"].includes(appt?.appointment_status) && (
                          <button className='button1' disabled>ADD INVOICE</button>
                        )}
                        {appt?.appointment_status == "Booked" && appt?.is_partial == 1 ? (
                          <button disabled={appt?.is_addInvoice_enable == "0"} onClick={() => handlePartialPaymentShow(appt)} className='button1'>
                            ADD INVOICE
                          </button>
                        ) : (appt?.appointment_status !== "Completed" && appt?.appointment_status !== "Confirmed" && appt?.appointment_status !== "completed" && appt?.appointment_status !== "missed" && appt?.appointment_status !== "cancelled" && <button disabled={appt?.is_addInvoice_enable == "0"} onClick={() => handleOpenInvoice(appt)} className='button1'>
                          ADD INVOICE
                        </button>)}
                        {appt?.appointment_status == "missed" && (
                          <button className='button2 completed'> CONSULT</button>
                        )}
                        {["cancelled by user", "cancelled"].includes(appt?.appointment_status) && (
                          <button className='button2 completed'> CONSULT</button>
                        )}
                        {appt?.appointment_status === "Confirmed" &&
                          (appt.consultation_type === "In Person" || appt.consultation_type === "Video Call") && (
                            <div className={"wraper_buttons_consult"}>
                              {moment().isSameOrAfter(moment(appt?.time, "h:mm a").subtract(5, "minutes")) &&
                                moment().isBefore(moment(appt?.time, "h:mm a")) && (
                                  <Timer startTime={appt?.time} />
                                )}
                              <button className="button2" disabled={moment().isBefore(moment(appt?.time, "h:mm a").subtract(5, "minutes"))} onClick={(e) => emitAppointmentStart(e, appt)}>
                                {appt.consultation_type === "In Person" ? "CONSULT" : "CONSULT"}
                              </button>
                            </div>
                          )}
                        {appt?.appointment_status == "Booked" && (
                          <button className='button2' disabled={appt?.is_cosnultNow_enable == 0 && appt?.is_partial == 0 || appt?.appointment_status == "Refunded" || item?.is_partial == 1}>CONSULT</button>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className='d-flex align-items-center'>
                        {appt?.appointment_status == "missed" && (
                          <Dropdown className='dropdownUpcoming' style={{ pointerEvents: "none" }}>
                            <Dropdown.Toggle id="dropdown-basic">
                              <img src={More} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {cancelAppoints["cancel-online-appointments"] && <Dropdown.Item onClick={() => handleCancelShow(appt)} className="ancLink">
                                <img src={Close} alt="" className="tw-w-[16px]" />
                                Cancel
                              </Dropdown.Item>}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {["cancelled", "Completed", "completed", "cancelled by user"].includes(appt?.appointment_status) && (
                          <Dropdown className='dropdownUpcoming' style={{ pointerEvents: "none" }}>
                            <Dropdown.Toggle id="dropdown-basic">
                              <img src={More} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {cancelAppoints["cancel-online-appointments"] && <Dropdown.Item onClick={() => handleCancelShow(appt)} className="ancLink">
                                <img src={Close} alt="" className="tw-w-[16px]" />
                                Cancel
                              </Dropdown.Item>}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {["Confirmed", "Booked", "Check-in", "Refunded"].includes(appt?.appointment_status) && (
                          <Dropdown className='dropdownUpcoming'>
                            <Dropdown.Toggle id="dropdown-basic">
                              <img src={More} alt="" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              {cancelAppoints["cancel-online-appointments"] && <Dropdown.Item onClick={() => handleCancelShow(appt)} className="ancLink">
                                <img src={Close} alt="" className="tw-w-[16px]" />
                                Cancel
                              </Dropdown.Item>}
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                        {isPatientJoin && isPatientJoin.length > 0 && isPatientJoin.some((patient) => patient === appt.id) && appt.appointment_status == "Confirmed" && (
                            <div className='blinking-dot'>
                              <span>Patient is waiting</span>
                            </div>
                        )}
                      </div>
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
      {selectedAppointment && (
        <CancelAppointmentModal
          handleCancelClose={handleCancelClose}
          getOnlineAppointmentsListing={getOnlineAppointmentsListing}
          cancelAppointment={cancelAppointment}
          patientName={selectedAppointment?.patient_name}
          appointmentDate={selectedAppointment?.appointment_date}
          time={selectedAppointment?.time}
          appointmentType={selectedAppointment?.consultation_type}
          appointmentId={selectedAppointment?.id}
        />
      )}
      <PartialPaymentModal partialPaymentId={partialPaymentId} partialPaymentShow={partialPaymentShow} handlePartialPaymentClose={handlePartialPaymentClose} getOnlineAppointmentsListing={getOnlineAppointmentsListing} />
      <AddInvoiceModal
        consultationFees={consultationFees}
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
      <ViewInvoiceModal
        viewInvoice={viewInvoice}
        handleViewInvoiceClose={handleViewInvoiceClose}
        patientName={selectedAppointment?.patient_name}
        appointmentDate={selectedAppointment?.appointment_date}
        paymentMethod={selectedAppointment?.payment_method}
        time={selectedAppointment?.time}
        appointmentType={selectedAppointment?.appointment_type}
        appointmentId={selectedAppointment?.id}
        amountRecieve={selectedAppointment?.amount_recieve}
        consultationType={selectedAppointment?.consultation_type}
        clinicName={selectedAppointment?.clinic_name}
      />
      <ViewRxModal viewRxShow={viewRxShow} handleViewRxClose={handleViewRxClose} selectedAppointment={selectedAppointment} />
    </>
  )
}

export default OnlineAppointments;