import React, { useEffect, useState } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import Search from "../../assets/images/svg/search-light.svg"
import { DatePicker } from 'antd';
import { Row, Col, Form, Table } from "react-bootstrap"
import { RightOutlined, PrinterOutlined, EditOutlined, DownOutlined } from '@ant-design/icons';
import AddPrescriptionsModal from '../../components/modal/addPrescriptionsModal/AddPrescriptionsModal';
import dayjs from 'dayjs';
import DeletePrescriptionsModal from '../../components/modal/deletePrescriptionsModal/DeletePrescriptionsModal';
import API from '../../services/httpInstance';
import "./prescriptions.scss";
import Cookies from 'js-cookie';
import moment from 'moment/moment';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux';
import FilterIcon from '../../assets/images/svg/FilterButton.svg';
import PrescriptionFilterModal from '../../components/modal/prescriptionFilterModal/PrescriptionFilterModal';

const Prescriptions = () => {
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [prescriptionsDeleteShow, setPrescriptionsDeleteShow] = useState(false);
  const [prescriptionsDelete, setPrescriptionsDelete] = useState();
  const [tableList, setTableList] = useState([])
  const [doctors, setDoctors] = useState(null);
  const [mrNumber, setMrNumber] = useState(null);
  const [isDate, setIsDate] = useState(moment().format('YYYY-MM-DD'))
  const [searchQuery, setSearchQuery] = useState('')
  const [doctorsId, setDoctorsId] = useState('');
  const [prescriptionFilterShow, setPrescriptionFilterShow] = useState(false)
  const dateFormat = ['YYYY-MM-DD'];
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:767px)');

  const handlPrescriptionFilterClose = () => setPrescriptionFilterShow(false);
  const handlPrescriptionFilterShow = () => setPrescriptionFilterShow(true);

  // get doctor list
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

  // const getCitites = async () => {
  //   try {
  //     const response = await API.get('/cities-list/2')
  //     if (response?.status == 200) {
  //       setCities(response?.data?.data)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const handlePrevDate = () => {
    if (isDate) {
      setIsDate(dayjs(isDate, "YYYY/MM/DD").subtract(1, "day").format("YYYY/MM/DD"));
    }
  };

  const handleNextDate = () => {
    if (isDate) {
      setIsDate(dayjs(isDate, "YYYY/MM/DD").add(1, "day").format("YYYY/MM/DD"));
    }
  };

  const handlePrescriptionsDeleteClose = () => setPrescriptionsDeleteShow(false);
  const handlePrescriptionsDeleteShow = (list) => {
    setPrescriptionsDeleteShow(true)
    setPrescriptionsDelete(list?.id)
  };

  const prescriptionList = async () => {
    try {
      const params = new URLSearchParams();

      if (isDate) {
        const formattedDate = moment(isDate).format("YYYY-MM-DD");
        params.append("date", formattedDate);
      }

      if (doctorsId) params.append("doctor_id", doctorsId);
      if (searchQuery) params.append("search", searchQuery);

      const res = await API.get(`/prescription-all?${params.toString()}`);
      if (res.status === 200) {
        setTableList(res?.data?.data)
      }
    } catch (error) {
      console.log("Error fetching prescriptions:", error);
    }
  }

  // const getMrNumber = async () => {
  //   try {
  //     const response = await API.get('/mr-number')
  //     if (response?.status == 200) {
  //       setMrNumber(response?.data?.data)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    prescriptionList()
  }, [searchQuery, isDate, doctorsId]);

  useEffect(() => {
    getAllDoctors();
  }, []);


  const handleSearchQuery = (e) => {
    const search = e.target.value
    setSearchQuery(search)
  }

  const navigateToPrescription = async (list) => {
    const { id: appointmentId, patient_id, clinic_id, doctor_id, appointment_completed_at } = list;
    navigate(`/prescription-profile/${list?.id}`, {
      state: {
        appointmentId,
        patientId: patient_id,
        clinicId: clinic_id,
        doctorId: doctor_id,
        appointmentDate: appointment_completed_at
      }
    })
    Cookies.set('prescriptionsEdit', "1");
    // Cookies.set('itemId', list?.id);
    // Cookies.set('appointmentCompleteDate', list?.appointment_completed_at);
  }

  const navigateToAddConsultNow = async () => {
    Cookies.set('prescriptionsAdd', "1");
    Cookies.remove('prescriptionsEdit');
    navigate(`/consult-now`, {
      state: {
        addPrescriptions: true,
      }
    })
  }

  const navigateToConsultNow = async (list) => {
    const { id: appointmentId, patient_id, clinic_id, doctor_id, appointment_completed_at } = list;
    try {
      const response = await API.get(`/consult-now-detail/${list?.id}`);
      console.log(response)
      if (response?.status == 200) {
        Cookies.set('prescriptionsEdit', "1");
        // Cookies.set('itemId', list?.id);
        // Cookies.set('patientId', list?.patient_id);
        Cookies.remove('prescriptionsAdd');
        Cookies.remove('patientClose');

        navigate(`/consult-now-edit`, {
          state: {
            name: list?.name,
            age: list?.age,  // Assuming you have `age` data here
            gender: list?.gender,  // Assuming you have `gender` data here
            visitCount: list?.visitCount,  // Assuming you have `visitCount` data here
            fromPrescriptions: true,
            appointmentId,
            patientId: patient_id,
            clinicId: clinic_id,
            doctorId: doctor_id,
            appointmentDate: appointment_completed_at
          }
        });
      } else {
        console.error("Error fetching consult-now details:", response?.data);
      }
    } catch (error) {
      console.error('Error during API call or navigation:', error);
    }
  };

  const prescriptionsDownload = async (list) => {
    try {
      const response = await API.get(`/patient-presc-download/${list?.id}`)
      if (response?.status == 200) {
        const pdfUrl = response.data?.data?.url;
        window.open(pdfUrl, "_blank");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDateChange = (date) => {
    if (!date) {
      setIsDate(null); // Clear the state when the date is removed
      return;
    }

    let formatDate = dayjs(date).format("YYYY/MM/DD");
    setIsDate(formatDate);
  };

  const handleDoctorId = (e) => {
    const value = e.target.value;
    setDoctorsId(value || null)
  }

  const [allowedPermissions, setAllowedPermissions] = useState({});
  let userPermissions = useSelector((state) => state.clinic.userPermissions);

        useEffect(() => {
            const viewPermission = userPermissions?.find((item) => item.slug === "prescription");
            const childPermissions = viewPermission?.child || [];
            const perms = {};
            childPermissions.forEach(child => {
                perms[child.slug] = true;
            });
            setAllowedPermissions(perms);
        }, [userPermissions]);

  return (
    <WraperLayout className="prescriptions">
      {!isMobile ? (
        <div className="box-white">
          <div className="top_wrap">
            <Row className="align-items-center">
              <Col lg={2}>
                <div className="wraper_date">
                  <a>
                    <span className='left_arrow' onClick={handlePrevDate}></span>
                  </a>
                  <a>
                    <span className='right_arrow' onClick={handleNextDate}></span>
                  </a>
                  <DatePicker
                    value={isDate ? dayjs(isDate, "YYYY/MM/DD") : null} // Convert string back to dayjs object
                    allowClear={true}
                    name="dob"
                    onChange={handleDateChange}
                    inputReadOnly={true}
                  />
                </div>
              </Col>
              <Col lg={3}>
                <div className="filter-by-div">
                  <p className="filterHeading">Filter by</p>
                  <Form.Select value={doctorsId} onChange={handleDoctorId} className="filter">
                    <option value="" disabled>Select Doctor</option>
                    {doctors?.map((doctor) => (
                      <option key={doctor?.id} value={doctor?.id}>
                        {doctor?.name}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Col>
              <Col lg={2}></Col>
              <Col lg={5}>
                <Row className='justify-content-end'>
                  <Col lg={7}>
                    <div className="search__bar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="11.5" cy="10.5" r="6.5" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M16 16L20 20" stroke={themeColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <input type="text" placeholder='Search by Name or Number' value={searchQuery} onChange={handleSearchQuery} />
                    </div>
                  </Col>
                  <Col lg={4} >
                    {allowedPermissions["prescription_add"] && <button onClick={navigateToAddConsultNow} className="button1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                        <path d="M7.19049 9.30961H0.333344V7.02389H7.19049V0.166748H9.4762V7.02389H16.3333V9.30961H9.4762V16.1667H7.19049V9.30961Z" fill={themeColor} />
                      </svg> Add Prescriptions</button>}
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
          <div className="bottom_wrap">
            <Table responsive>
              <thead>
                <tr>
                  <th>MR No.</th>
                  <th>patient Name</th>
                  <th>Number</th>
                  <th>Created on</th>
                  <th>Added by</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableList.length === 0 ? (<tr><td colSpan="6" className='text-center'>No prescriptions found</td></tr>) : (
                  tableList?.map((list) => (
                    <tr key={list?.id}>
                      <td>{list?.mr_no}</td>
                      <td>{list?.name}</td>
                      <td>{list.phone}</td>
                      <td>{list.date}</td>
                      <td>{list?.added_by}</td>
                      <td>
                        <div className='wrape_actions'>
                          <button onClick={() => handlePrescriptionsDeleteShow(list)}><span className='deleteIcon'></span></button>
                          <button onClick={() => navigateToConsultNow(list)}><EditOutlined /></button>
                          <button onClick={() => prescriptionsDownload(list)}><PrinterOutlined /></button>
                          <button onClick={() => navigateToPrescription(list)} className='link'><RightOutlined /></button>
                        </div>
                      </td>
                    </tr>
                  )
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (<div className='box-white prescription-mobile'>
        {isMobile && (<>
          <div className="wrapePrint" onClick={handlPrescriptionFilterShow}>
            <div className="printIcoBtn">
              <img src={FilterIcon} alt='' className='filterIcon' />
            </div>
          </div>
        </>)}
        <Row className=''>
          <Col xs={6} className='pe-0'>
            <div className="search__bar">
              <img src={Search} alt="" />
              <input type="text" placeholder='Search here' value={searchQuery} onChange={handleSearchQuery} />
            </div>
          </Col>
          <Col xs={6} >
            <button onClick={navigateToAddConsultNow} className="button1 tw-justify-around"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M7.19049 9.30961H0.333344V7.02389H7.19049V0.166748H9.4762V7.02389H16.3333V9.30961H9.4762V16.1667H7.19049V9.30961Z" fill="#0F75BC" />
            </svg> Add Prescription</button>
          </Col>
        </Row>
        <Row className='mt-3'>
          {tableList?.map((list) => (
            <Col key={list?.id} xs={12}>
              <div className="card">
                <span>{list?.added_by}</span>
                <h4>{list?.name}</h4>
                <p>{list?.date}</p>
                <div className='d-flex justify-content-between'>
                  <p>{list?.phone}</p>
                  <div className='wrape_actions wrape_actionsRE'>
                    <button onClick={() => prescriptionsDownload(list)}><PrinterOutlined /></button>
                    <button onClick={() => handlePrescriptionsDeleteShow(list)}><span className='deleteIcon'></span></button>
                    <button onClick={() => navigateToConsultNow(list)}><EditOutlined /></button>
                    <button onClick={() => navigateToPrescription(list)} className='link'><DownOutlined /></button>
                  </div>
                </div>
                <div className="mr-no">{list?.mr_no}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>)}

      {/* <AddPrescriptionsModal cities={cities} prescriptionList handlePrescriptionsAddClose={handlePrescriptionsAddClose} prescriptionsAddShow={prescriptionsAddShow} mrNumber={mrNumber} /> */}
      <DeletePrescriptionsModal prescriptionList={prescriptionList} handlePrescriptionsDeleteClose={handlePrescriptionsDeleteClose} prescriptionsDeleteShow={prescriptionsDeleteShow} prescriptionsDelete={prescriptionsDelete} />
      <PrescriptionFilterModal doctors={doctors} prescriptionList={prescriptionList} handleDoctorId={handleDoctorId} handleDateChange={handleDateChange} handlPrescriptionFilterClose={handlPrescriptionFilterClose} prescriptionFilterShow={prescriptionFilterShow} />
    </WraperLayout>
  )
}

export default Prescriptions