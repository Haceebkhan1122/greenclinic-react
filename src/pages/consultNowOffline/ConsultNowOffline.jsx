import React, { useEffect, useState, useRef } from 'react'
import { Row, Col, Tab, Tabs } from "react-bootstrap"
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './consultNowOffline.scss'
import Cookies from 'js-cookie';
import SearchResultConsultNow from "../../layouts/Header/searchResultConusltNow/SearchResult";
import ConsultNowOffilineTabView from '../../components/consultNowOffilineTabView/ConsultNowOffilineTabView'
import ConsultNowOffilineListView from '../../components/consultNowOffilineListView/ConsultNowOffilineListView'
import API from '../../services/httpInstance'
import { useClickAway } from "@uidotdev/usehooks";
import moment from "moment";
import Cross from "../../assets/images/png/cross.png"
import { isMobile } from 'react-device-detect'
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import AddPatientFromConsultNowModal from '../../components/modal/addPatientFromConsultNowModal/AddPatientFromConsultNowModal'
import Loader from '../../components/loader/Loader'
import NewPatientConsult from '../../components/modal/newPatientConsult/NewPatientConsult'

const ConsultNowOffline = () => {
  const location = useLocation();
  const { appointmentId, patientId, clinicId, doctorId, appointmentDate } = location.state || {};

  const navigate = useNavigate();
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [template, setTemplate] = useState([])
  const [textQuery, setTextQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isDate, setIsDate] = useState(moment().format(null))
  // const completeAppointmentDate = Cookies.get('appointmentCompleteDate');
  const prescriptionsAdd = Cookies.get('prescriptionsAdd');
  const searchQuery = useRef(null)
  const [searchPopper, setSearchPopper] = useState(false)
  const [isAddPrescriptions, setIsAddPrescriptions] = useState(false);
  const [isShowLabReading, setIsShowlabReading] = useState(0)
  const [patientAddShow, setPatientAddShow] = useState(false);
  const [cities, setCities] = useState([]);
  const [indicationMessage, setIndicationMessage] = useState("");
  const [mrNumber, setMrNumber] = useState(null);
  const [isDiagnosis, setIsDiagnosis] = useState([])
  const [isDate, setIsDate] = useState(moment().format(null))
  const [newPatientConsult, setNewPatientConsult] = useState(false)
  const patientClose = Cookies.get('patientClose');

  const { state } = useLocation();
  var completeAppointmentDate;
  var formattedDate;
  if (completeAppointmentDate) {
    formattedDate = moment(completeAppointmentDate, ["YYYY-MM-DD hh:mm a", "YYYY-MM-DD HH:mm:ss"]).format("YYYY-MM-DD");
    if (!moment(formattedDate, "YYYY-MM-DD", true).isValid()) {
      console.error("Invalid date format:", formattedDate);
      formattedDate = moment().format("YYYY-MM-DD"); // Fallback to today
    }
  } else {
    formattedDate = moment().format("YYYY-MM-DD"); // Fallback to today
  }
  const [patientData, setPatientData] = useState({
    name: state?.name || '',
    age: state?.age || '',
    gender: state?.gender || '',
    visitCount: state?.visitCount || ''
  });

  const ref = useClickAway(() => {
    setSearchPopper(false);
  });
  const handleFocus = () => {
    if (searchQuery.current?.trim() !== "" || searchQuery.current?.trim() !== null) {
      setSearchPopper(true)
    }
    if (searchQuery.current?.trim() == "" || searchQuery.current?.trim() == null) {
      setSearchPopper(false)
    }
  }
  const getSearchedResult = async (textQuery) => {
    try {
      setSearchLoading(true);
      const response = await API.get(`main-search?search=${textQuery}`);
      if (response?.status === 200) {
        setFilteredResults(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
      setSearchPopper(false);
    }
  };
  const searchByText = (e) => {
    const value = e.target.value;
    setTextQuery(value);
    // if (value) {
    //   getSearchedResult(value);
    // }
  };
  useEffect(() => {
    if (textQuery) {
      getSearchedResult(textQuery);
    }
  }, [textQuery]);

  const handleRemoveSearch = () => {
    setTextQuery('')
    setFilteredResults([])
    setSearchPopper(false)
  }

  useEffect(() => {
    if (state?.addPrescriptions) {
      setIsAddPrescriptions(true);
    }
  }, [state]);

  const handlePrevDate = () => {
    setIsDate((prev) => dayjs(prev).subtract(1, "day").format("YYYY-MM-DD"));
  };
  const handleNextDate = () => {
    setIsDate((prev) => dayjs(prev).add(1, "day").format("YYYY-MM-DD"));
  };
  const handleDateChange = (date, dateString) => {
    getListingAppointments(1, dateString)
    if (!date) {
      setIsDate(null); // Clear the state when the date is removed
      return;
    }
    let formatDate = dayjs(date).format("YYYY/MM/DD");
    setIsDate(formatDate);
  };

  const handlePatientAddShow = () => {
    getMrNumber();
    getCitites();
    setPatientAddShow(true);
  }

  const getMrNumber = async () => {
    try {
      const response = await API.get('/mr-number')
      if (response?.status == 200) {
        setMrNumber(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleVisitprofile = (patientId) => {
    navigate(`/patient-profile/${patientId}`);
  }

  const getCitites = async () => {
    try {
      const response = await API.get('/cities-list/2')
      if (response?.status == 200) {
        setCities(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewPatientConsultShow = () => setNewPatientConsult(true)
  const handleNewPatientConsultClose = () => setNewPatientConsult(false)

  const NoPateintSelected = () => {
    Cookies.remove('patientClose');
    Cookies.set('prescriptionsAdd', "1");
    navigate(`/consult-now`, {
      state: {
        addPrescriptions: true
      }
    });
    handleNewPatientConsultClose(false)
    setIndicationMessage("No patient selected")
  }

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 1000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])

  const getPatientData = async () => {
    try {
      const response = await API.get(`/consult-now/${appointmentId}`);
      setPatientData({
        name: response?.data?.data?.patient_name,
        age: response?.data?.data?.patient_age,
        gender: response?.data?.data?.patient_gender,
        visitCount: response?.data?.data?.visit_count
      });
      setIsShowlabReading(response?.data?.data?.showLabReading)
      setIsDiagnosis(response?.data?.data?.diagnosis)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      getPatientData()
    }
  }, [appointmentId])


  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      {isLoading ? <Loader /> :
        <WraperLayout>
          <section className={`consult_now consult_offline ${isAddPrescriptions ? 'add-prescriptions' : ''}`}>
            {prescriptionsAdd ? (<div className='patient_details'>
              <Row>
                <Col lg={9}>
                  <Row>
                    <Col lg={3}>
                      <div className="wraper_date">
                        <span className='left_arrow' onClick={handlePrevDate}></span>
                        <DatePicker
                          value={dayjs(isDate, "YYYY-MM-DD")}
                          inputReadOnly={true}
                          format="YYYY-MM-DD"
                          onChange={handleDateChange}
                          name="dob"
                        />
                        <span className='right_arrow' onClick={handleNextDate}></span>
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className='h-100 align-items-center d-none d-md-flex hk_searchbar'>
                        <div className={searchPopper ? "search-bar searcWithRes" : "search-bar"} ref={ref}>
                          <div className="cross_input">
                            <input
                              value={textQuery}
                              maxLength={50}
                              type="text"
                              placeholder='Search by name, number'
                              onChange={searchByText}
                              onFocus={handleFocus}
                            />
                            {textQuery && (
                              <>
                                <button onClick={handleRemoveSearch} className="cross"><img src={Cross} alt="" /></button>
                              </>
                            )}
                          </div>
                          <div
                            className={searchPopper ? "searchIconWraper searcWithRes" : 'searchIconWraper'}
                          >
                            <span className='arrow'></span>
                          </div>
                          {textQuery && (
                            <SearchResultConsultNow
                              searchLoading={searchLoading}
                              filteredResults={filteredResults}
                              textQuery={textQuery}
                            />
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={3} className='text-end'>
                  <button className="button1" onClick={handlePatientAddShow}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <path d="M7.19049 9.30961H0.333344V7.02389H7.19049V0.166748H9.4762V7.02389H16.3333V9.30961H9.4762V16.1667H7.19049V9.30961Z" fill={themeColor} />
                    </svg>
                    Add New Patient</button>
                </Col>
              </Row>
            </div>) : (
              <>
                <div className="patient_detial">
                  <div className="patient">
                    <h3>
                      <span>{patientData.name}</span> {!isMobile && "|"} {patientData.gender} | {patientData.age} Yrs | Visit No: {patientData.visitCount}
                    </h3>
                    <div className='d-lg-none d-block'> <button onClick={() => handleVisitprofile(patientId)} className='visit'>Visit Profile</button></div>
                  </div>
                </div>
                {patientClose ? (<button className='close_patient' onClick={handleNewPatientConsultShow}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#F22E2E" />
                </svg></button>) : <button onClick={() => handleVisitprofile(patientId)} className='visit d-lg-block d-none'>Visit Profile</button>}
              </>)
            }
            <Row>
              <Col lg={12}>
                <div className={`wraperOfflineTabs ${patientClose ? 'patient_close' : ''}`}>
                  <Tabs
                    defaultActiveKey="tabView"
                    id="uncontrolled-tab-example"
                    className="tabs_offline"
                  >
                    <Tab eventKey="listView" title="List View">
                      <ConsultNowOffilineListView isDiagnosis={isDiagnosis} isShowLabReading={isShowLabReading} formattedDate={formattedDate} patientName={patientData?.name} template={template} appointmentDate={appointmentDate} appointmentId={appointmentId} patientId={patientId} clinicId={clinicId} doctorId={doctorId} />
                    </Tab>
                    <Tab eventKey="tabView" title="Tab View">
                      <ConsultNowOffilineTabView setTemplate={setTemplate} isDiagnosis={isDiagnosis} isShowLabReading={isShowLabReading} formattedDate={formattedDate} patientName={patientData?.name} template={template} appointmentDate={appointmentDate} appointmentId={appointmentId} patientId={patientId} doctorId={doctorId} clinicId={clinicId} />
                    </Tab>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </section>
          <AddPatientFromConsultNowModal setPatientAddShow={setPatientAddShow} cities={cities} patientAddShow={patientAddShow} mrNumber={mrNumber} />
          <NewPatientConsult handleNewPatientConsultClose={handleNewPatientConsultClose} newPatientConsult={newPatientConsult} NoPateintSelected={NoPateintSelected} />
        </WraperLayout>
      }
    </>
  )
}

export default ConsultNowOffline;