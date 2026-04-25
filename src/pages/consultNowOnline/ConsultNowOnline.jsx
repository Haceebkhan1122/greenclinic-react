import React, { useState, useEffect } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import { Col, Row } from 'react-bootstrap'
import Scan from "../../assets/images/svg/scan.svg"
import Location from "../../assets/images/svg/location.svg"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap';
import './consultNowOnline.scss'
import ExaminationConsultNowTab from '../../components/tabsConsultNow/examinationConsultNowTab/ExaminationConsultNowTab'
import InvestigationConsultNowTab from '../../components/tabsConsultNow/investigationConsultNowTab/InvestigationConsultNowTab'
import MedicationConsultNowTab from '../../components/tabsConsultNow/medicationConsultNowTab/MedicationConsultNowTab'
import LabReading from '../../components/tabsConsultNow/labReading/LabReading'
import API, { API_MERISEHAT, API_MS } from '../../services/httpInstance';
import MarkCompleteConsultModal from '../../components/modal/markCompleteConsultModal/MarkCompleteConsultModal'
import MarkConsultationEndedModal from '../../components/modal/markConsultationEndedModal/MarkConsultationEndedModal'
import SaveTemplateModal from '../../components/modal/saveTemplateModal/SaveTemplateModal'
import ViewRxModal from '../../components/modal/viewRxModal/ViewRxModal'
import Agora from './Agora/Agora.jsx'
import moment from 'moment/moment.js'
import { toast } from 'react-toastify'
import AgoraRTM from "agora-rtm-sdk";
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect'
import CancelCallModal from '../../components/modal/cancelCallModal/CancelCallModal'
import EndConsultantModal from '../../components/modal/endConsultantModal/EndConsultantModal.jsx'


const ConsultNowOnline = () => {
  let doctorData = useSelector((state) => state?.user?.user);
  // let clinicId = useSelector((state) => state?.user?.clinic_id);
  const navigate = useNavigate()
  const location = useLocation();
  const { appointmentId, patientId, doctorId, appointmentDate, clinicId } = location.state || {};
  // console.log(appointmentId, patientId, doctorId, appointmentDate, clinicId)
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    visitCount: '',
    gender: '',
    location: '',
    id: '',
  });

  const [viewRxShow, setViewRxShow] = useState(false)
  const [saveTemplateShow, setSaveTemplateShow] = useState(false)
  const [labReadingListSlug, setLabReadingSlug] = useState([])
  const [medicinesList, setMedicinesList] = useState([])
  const [examslug, setExamslug] = useState([])
  const [vitalArray, setVitalArray] = useState([])
  const [vitalList, setVitalList] = useState([]);
  const [defaultVitals, setDefaultVitals] = useState([]);
  const [defaultVitalArray, setDefaultVitalArray] = useState([])
  const [showMarkComplete, setShowMarkComplete] = useState(false);
  const [showEndedConsult, setShowEndedConsult] = useState(false);
  const [showMarkEnded, setShowMarkEnded] = useState(false);
  const [vitalsCurrentDate, setVitalsCurrentDate] = useState([])
  const [isShowLabReading, setIsShowlabReading] = useState(0)
  const [indicationMessage, setIndicationMessage] = useState("");
  const [isDiagnosis, setIsDiagnosis] = useState([])
  const [groupMedicines, setGroupMedicines] = useState([]);
  const [prescriptionCopyRX, setPrescriptionCopyRX] = useState('')
  const [doctorInformation, setDoctorInformation] = useState(null)
  const [agoraToken, setAgoraToken] = useState('')
  const [groupMedicineList, setGroupMedicineList] = useState([])
  const [favouriteMedicineList, setFavouriteMedicineList] = useState([])
  const [examinationList, setExaminationList] = useState([]);
  const [channelName, setChannelName] = useState('')
  const [reasonVisit, setReasonVisit] = useState('')
  const [timeRem, setTimeRem] = useState(0);
  const [cancelAppointment, setCancelAppointment] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(null);

  var completeAppointmentDate;
  var formattedDate;
  if (completeAppointmentDate) {
    formattedDate = moment(completeAppointmentDate, ["YYYY-MM-DD hh:mm a", "YYYY-MM-DD HH:mm:ss"]).format("YYYY-MM-DD");
    if (!moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
      // console.error("Invalid date format:", formattedDate);
      formattedDate = moment().format("YYYY-MM-DD"); // Fallback to today
    }
  } else {
    // console.log("No date found in cookies, using today's date.");
    formattedDate = moment().format("YYYY-MM-DD"); // Fallback to today
  }


  const handleViewRxShow = () => setViewRxShow(true)
  const handleViewRxClose = () => setViewRxShow(false)

  const handleSaveTemplateShow = () => setSaveTemplateShow(true)
  const handleSaveTemplateClose = () => setSaveTemplateShow(false)

  const handleCloseMarkComplete = () => setShowMarkComplete(false);
  const handleShowMarkComplete = () => setShowMarkComplete(true);

  const handleShowEndconsultantClose = () => setShowEndedConsult(false);
  const handleShowEndconsultantShow = () => setShowEndedConsult(true);

  const handleCloseMarkEnded = () => setShowMarkEnded(false);
  const handleShowMarkEnded = () => setShowMarkEnded(true);
  const handleCancelClose = () => setCancelAppointment(false);

  const getPatientData = async () => {
    try {
      const response = await API.get(`/consult-now/${appointmentId}`);
      setPatientData({
        name: response?.data?.data?.patient_name,
        age: response?.data?.data?.patient_age,
        gender: response?.data?.data?.patient_gender,
        visitCount: response?.data?.data?.visit_count,
        clinicCity: response?.data?.data?.clinic_city,
        id: response?.data?.data?.patient_id,
        queue: response?.data?.data?.doctor_queue,
      });
      setIsShowlabReading(response?.data?.data?.showLabReading)
      setIsDiagnosis(response?.data?.data?.diagnosis)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPatientData()
  }, [appointmentId])

  const getVitalsData = async () => {
    try {
      const response = await API_MERISEHAT.get(`/scans?appt_id=${appointmentId}`)
      if (response?.status == 200) {
        setVitalsCurrentDate(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlePrescriptionCopyRX = async () => {
    try {
      const response = await API.get(`/copy-rx?patient_id=${patientId}&clinic_id=${clinicId}`);
      if (response?.data?.data) {
        const copiedMedicines = response?.data?.data;
        setMedicinesList(copiedMedicines);
      }
      setIndicationMessage(response?.data?.message);
      setViewRxShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 1000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])

  const getDoctorData = async () => {
    try {
      const response = await API.get(`/get-user-details`)
      if (response.status == 200) {
        setDoctorInformation(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getfavouriteMedicine = async () => {
    try {
      const response = await API.get("/get-medicine")
      if (response.status == 200) {
        setFavouriteMedicineList(response?.data?.data?.favourite_medicine)
        setGroupMedicineList(response?.data?.data?.group_medicine)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleTemplateSaved = (newGroupMedicine) => {
    setGroupMedicines(prevGroup => [...prevGroup, newGroupMedicine]);
    getfavouriteMedicine()
  };

  useEffect(() => {
    getDoctorData()
  }, [])

  useEffect(() => {
    // getPatientProfile()
    getVitalsData()
  }, [])

  useEffect(() => {
    if (appointmentId && doctorData?.id) {
      (async () => {
        const response = await API_MS.get(`/generate-agora-rtc-token?appointment_id=${appointmentId}`);
        if (response?.status == 200) {
          setChannelName(response?.data?.data?.channel_name);
          setAgoraToken(response?.data?.data?.agora_token);
        }
      })();
    }
  }, [appointmentId, doctorData?.id]);

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <h3 className="fs-20">Time Ended</h3>;
    }

    return (
      <h3 className="rem-time">
        {minutes < 10 ? "0" + minutes : minutes}:
        {seconds < 10 ? "0" + seconds : seconds}
      </h3>
    );
  };

  const mergedVitalsPayload = [...defaultVitalArray, ...vitalArray];

  const handleOnlineSaveButton = async () => {
    const payload = {
      appointment_id: appointmentId,
      labreading: labReadingListSlug,
      examinArray: examslug,
      medicine: medicinesList,
      reason_for_visit: reasonVisit,
      vitalArray: mergedVitalsPayload,
    }

    try {
      const response = await API.post("/consult-now", payload)
      if (response.status == 200) {
        window.location.href = "/appointments"
        navigate("/appointments")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getConsultNow = async () => {
    try {
      const response = await API.get(`/examination/${appointmentId}`)
      if (response.status == 200) {
        setVitalList(response?.data?.data?.vitals)
        setDefaultVitals(response?.data?.data?.defaultVitals)
        setExaminationList(response?.data?.data?.examination)
        const examinationData = response?.data?.data?.examination.map(item => ({
          slug: item.slug,
          value: item.value
        }));
        const vitalData = response?.data?.data?.vitals.map(item => ({
          slug: item.slug,
          value: item.value
        }));
        const defaultVitalsData = response?.data?.data?.defaultVitals.map(item => ({
          slug: item.slug,
          value: item.value
        }));
        setExamslug(examinationData);
        setVitalArray(vitalData);
        setDefaultVitalArray(defaultVitalsData);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleViewHandle = () => {
    navigate(`/view-history/${patientId}`, {
      state: {
        patient_id: patientId,
      }
    });
  }

  useEffect(() => {
    getConsultNow()
  }, [])

  useEffect(() => {
    let interval;
    const proceedFadDoctor = async () => {
      try {
        const response = await API_MS.get(`/call-status?appointment_id=${appointmentId}&clinic_id=${doctorInformation?.clinic_id}`);
        if (response?.status === 200) {
          setIsAnonymous(response?.data?.data?.is_anonymous)
          const remainingTime = response?.data?.data?.remaining_time;

          if (remainingTime > 0) {
            const currentDateTime = new Date();
            const newTimeRem = new Date(currentDateTime.getTime() + parseInt(remainingTime) * 1000);
            setTimeRem(newTimeRem);
          } else {
            handleShowEndconsultantShow()
          }
        } else if (response.status === 404) {
          const status = response?.data?.data;
          if (status == null) {
            handleShowMarkEnded();
          }
        }
      } catch (error) {
        console.error("Error fetching remaining time:", error);
      }
    };

    if (appointmentId && doctorInformation) {
      proceedFadDoctor(); // Initial API call to get remaining time
      interval = setInterval(proceedFadDoctor, 15000); // Repeat every 15 seconds
    }

    // return () => clearInterval(interval); // Cleanup on unmount or dependency change
  }, [appointmentId, doctorInformation]);

  // useEffect(() => {
  //   let timer;

  //   if (timeRem) {
  //     timer = setInterval(() => {
  //       const now = new Date();
  //       const diff = timeRem - now;

  //       if (diff <= 0) {
  //         clearInterval(timer);
  //         handleShowEndconsultantShow();
  //       }
  //     }, 1000);
  //   }

  //   return () => clearInterval(timer);
  // }, [timeRem]);

  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      <WraperLayout>
        <Row>
          <Col lg={12}>
            <div className="patient_detial">
              <div className="patient">
                <h3>
                  <span>{patientData.name}</span> | {patientData.gender} | {patientData.age} Yrs | Visit No: {patientData.visitCount}
                </h3>
                <h6><img src={Location} alt="" />{patientData?.clinicCity}</h6>
              </div>
              <div className="queue">
                <p>Queue</p>
                <p className='token'>{patientData?.queue}</p>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className='video_call'>
              <Agora
                isAnonymous={isAnonymous}
                doctorData={doctorData}
                appointmentId={appointmentId}
                agoraToken={agoraToken}
                agoraChannelName={channelName}
                renderer={renderer}
                setCancelAppointment={setCancelAppointment}
                timeRem={timeRem}
              />
            </div>
            <div className="reason-visit">
              <h6>Reason for visit</h6>
              <textarea name="reason_for_visit" value={reasonVisit} onChange={(e) => setReasonVisit(e.target.value)}></textarea>
              {Array.isArray(vitalsCurrentDate) ? (vitalsCurrentDate?.map((vitals, index) => (
                <div key={index}>
                  <div className='vital d-flex align-items-center justify-content-between'>
                    <div className='tw-flex tw-items-center'>
                      <h5> Recent Vitals </h5>
                      <span> | </span>
                      <img src={Scan} alt="" />
                      <span> Powered by Sehat Scan </span>
                    </div>
                    <p> {vitals?.created} </p>
                  </div>
                  <ul>
                    <li>
                      <h4>Heart Rate</h4>
                      <p> {vitals?.heart_rate} <span> bpm</span></p>
                    </li>
                    <li>
                      <h4>Breathing</h4>
                      <p> {vitals?.blood_pressure} <span> bpm</span></p>
                    </li>
                    <li>
                      <h4>Blood Pressure</h4>
                      <p> {vitals?.respiratory_rate} <span>mmHg</span></p>
                    </li>
                    <li>
                      <h4>Mental Stress Index</h4>
                      <p> {vitals?.stress_level}</p>
                    </li>
                  </ul>
                </div>
              ))) : (
                <div>
                  <div className='vital d-flex align-items-center justify-content-between'>
                    <div className='tw-flex tw-items-center'>
                      <h5> Recent Vitals </h5>
                      <span className='line'> | </span>
                      <img src={Scan} alt="" />
                      <span> Powered by Sehat Scan </span>
                    </div>
                    <p> {vitalsCurrentDate?.created} </p>
                  </div>
                  <ul>
                    <li>
                      <h4>Heart Rate</h4>
                      <p> {vitalsCurrentDate?.heart_rate} <span> bpm</span></p>
                    </li>
                    <li>
                      <h4>Breathing</h4>
                      <p> {vitalsCurrentDate?.blood_pressure} <span> bpm</span></p>
                    </li>
                    <li>
                      <h4>Blood Pressure</h4>
                      <p> {vitalsCurrentDate?.respiratory_rate} <span>mmHg</span></p>
                    </li>
                    <li>
                      <h4>Mental Stress Index</h4>
                      <p> {vitalsCurrentDate?.stress_level}</p>
                    </li>
                  </ul>
                </div>
              )}
              <h2 className='viewHistory pt-4'>
                {vitalsCurrentDate && (Array.isArray(vitalsCurrentDate) ? vitalsCurrentDate.length > 0 : true) ? (
                  <button onClick={() => handleViewHandle()}><span> View History </span></button>
                ) : (
                  <span className='disabled-link'>View History</span>
                )}
              </h2>
            </div>
          </Col>
          <Col lg={8}>
            <div className='consult_now'>
              <Tabs
                defaultActiveKey="Examination"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="Examination" title="Examination">
                  <ExaminationConsultNowTab setVitalList={setVitalList} setDefaultVitalArray={setDefaultVitalArray} defaultVitalArray={defaultVitalArray} setDefaultVitals={setDefaultVitals} vitalList={vitalList} defaultVitals={defaultVitals} vitalArray={vitalArray} setVitalArray={setVitalArray} clinicId={doctorInformation?.clinic_id} isDiagnosis={isDiagnosis} examinationList={examinationList} doctorId={doctorId} setExamslug={setExamslug} examslug={examslug} appointmentId={appointmentId} patientId={patientId} />
                </Tab>
                <Tab eventKey="Medication" title="Medication">
                  <MedicationConsultNowTab favouriteMedicineList={favouriteMedicineList} groupMedicineList={groupMedicineList} getfavouriteMedicine={getfavouriteMedicine} setMedicinesList={setMedicinesList} medicinesList={medicinesList} appointmentId={appointmentId} />
                </Tab>
                <Tab eventKey="Investigation" title="Investigation">
                  <InvestigationConsultNowTab appointmentId={appointmentId} patientId={patientId} clinicId={clinicId} />
                </Tab>
                {isShowLabReading == 1 &&
                  <Tab eventKey="Lab Readings" title="Lab Readings">
                    <LabReading formattedDate={formattedDate} patientId={patientId} setLabReadingSlug={setLabReadingSlug} />
                  </Tab>
                }
              </Tabs>
              <div className="btnsWraping">
                <button onClick={handleSaveTemplateShow}> Save Template</button>
                <button onClick={handleViewRxShow}>VIEW RX</button>
                <button onClick={handlePrescriptionCopyRX}>Copy RX</button>
              </div>
            </div>
          </Col>
        </Row>
        {isMobile && (
          <>
            <div className='online_mark_as_com_bottomsheet'>
              <button className='markupBtn' onClick={handleShowMarkComplete}> Mark as Complete </button>
            </div>
          </>
        )}
        {!isMobile && (
          <>
            <button className='markupBtn' onClick={handleShowMarkComplete}> Mark as Complete </button>
          </>
        )}
        <CancelCallModal appointmentId={appointmentId} handleCancelClose={handleCancelClose} cancelAppointment={cancelAppointment} />
        <ViewRxModal setViewRxShow={setViewRxShow} setMedicinesList={setMedicinesList} setIndicationMessage={setIndicationMessage} handlePrescriptionCopyRX={handlePrescriptionCopyRX} viewRxShow={viewRxShow} handleViewRxClose={handleViewRxClose} patientId={patientId} patientData={patientData} appointmentDate={appointmentDate} />
        <SaveTemplateModal getfavouriteMedicine={getfavouriteMedicine} groupMedicines={groupMedicines} onTemplateSaved={handleTemplateSaved} setGroupMedicines={setGroupMedicines} saveTemplateShow={saveTemplateShow} medicinesList={medicinesList} handleSaveTemplateClose={handleSaveTemplateClose} />
        <MarkCompleteConsultModal showMarkComplete={showMarkComplete} handleCloseMarkComplete={handleCloseMarkComplete} handleOnlineSaveButton={handleOnlineSaveButton} />
        <EndConsultantModal showEndedConsult={showEndedConsult} handleShowEndconsultantClose={handleShowEndconsultantClose} handleOnlineSaveButton={handleOnlineSaveButton} />
        <MarkConsultationEndedModal showMarkEnded={showMarkEnded} handleCloseMarkEnded={handleCloseMarkEnded} handleOnlineSaveButton={handleOnlineSaveButton} />
      </WraperLayout>
    </>

  )
}

export default ConsultNowOnline