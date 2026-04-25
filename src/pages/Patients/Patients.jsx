import React, { useEffect, useState } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import Search from "../../assets/images/svg/search.svg"
import { DatePicker } from 'antd';
import { Row, Col, Form, Table } from "react-bootstrap"
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import EditPatientModal from '../../components/modal/editPatientModal/EditPatientModal';
import AddPatientModal from '../../components/modal/addPatientModal/AddPatientModal';
import { Link } from 'react-router-dom';
import DeletePatientModal from '../../components/modal/deletePatientModal/DeletePatientModal';
import { API } from '../../services/httpInstance/index';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import dayjs from "dayjs";

import "./patient.scss";
import { useMediaQuery } from '@mui/material';
import Loader from '../../components/loader/Loader';
import { useSelector } from 'react-redux';

const Patients = () => {
  const [patientAddShow, setPatientAddShow] = useState(false);
  const [patientEditShow, setPatientEditShow] = useState(false);
  const [patientDeleteShow, setPatientDeleteShow] = useState(false);
  const [patientsListing, setPatientsListing] = useState(false);
  const [editPatient, setEditPatient] = useState({});
  const [patientDelete, setPatientDelete] = useState();
  const [mrNumber, setMrNumber] = useState(null);
  const handlePatientEditClose = () => setPatientEditShow(false);
  const handlePatientDeleteClose = () => setPatientDeleteShow(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState("1");
  const [paginateCountData, setPaginateCountData] = useState(null);
  const [cities, setCities] = useState([]);
  const [filterGender, setFilterGender] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [filteredData, setFilteredData] = useState([])
  const [responseDataComp, setResponseDataComp] = useState([])
  const isMobile = useMediaQuery('(max-width:767px)');
  const [waitForApiResponse, setWaitForApiResponse] = useState(true);
  const [showPatientsPerm, SetshowPatientsPerm] = useState(false)
  const [allowedPermissions, setAllowedPermissions] = useState({});
  const [patientPermissions, setPatientPermissions] = useState({});
  let userPermissions = useSelector((state) => state.clinic.userPermissions);

  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "patients_view");
    if(viewPermission && Object.keys(viewPermission).length > 0) {
      SetshowPatientsPerm(true)

      const childPermissions = viewPermission?.child || [];
      const perms = {};
      childPermissions.forEach(child => {
        perms[child.slug] = true;
      });
      setAllowedPermissions(perms);
      setPatientPermissions(perms);
    }
    else {
      SetshowPatientsPerm(false);
      window.location = "/";
    }
  }, [userPermissions]);

  const navigate = useNavigate();

  const handlePrevDate = () => {

    setSelectedDate(prevDate =>
      dayjs(prevDate).subtract(1, "day").format("YYYY-MM-DD")
    );

  };

  const handleNextDate = () => {
    setSelectedDate(prevDate =>
      dayjs(prevDate).add(1, "day").format("YYYY-MM-DD")
    );
  };
  const fetchAllPatientsListing = async () => {
    try {
      const params = new URLSearchParams();
      // Add filters only if they have values
      if (filterGender) params.append("gender", filterGender);
      if (searchFilter) params.append("name", searchFilter);
      if (selectedDate) params.append("date", selectedDate);

      params.append("page", currentPage); // Page should always be included

      const listing = await API.get(`/patients-listing-pagination?${params.toString()}`);
      setWaitForApiResponse(true)
      if (listing?.status === 200) {
        const calculatedTotalPages = Math.ceil(
          listing?.data?.data?.pagination?.total / listing?.data?.data?.pagination?.per_page
        );
        setTotalPages(calculatedTotalPages);
        setPatientsListing(listing?.data?.data?.patients);
        setFilteredData(listing?.data?.data?.patients)
        setCurrentPage(listing?.data?.data?.pagination?.current_page);
        setPaginateCountData(listing?.data?.data?.pagination);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const allPatients = async () => {
    setIsLoading(true)
    const response = await API.get(`/patients-listing`);
    if (response?.status == 200) {
      setIsLoading(false)
      setResponseDataComp(response?.data?.data);
    }
    else {
      setIsLoading(false);
      setResponseDataComp([])
    }
  }

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    let examData = [...responseDataComp];
    if (value !== "") {
      let lower = value.toLowerCase();
      let trimed = lower.replace(/\s/g, '');
      examData = examData.filter((item) => {
        return item?.mr_no.toLowerCase().replace(/\s/g, '').includes(trimed) || item?.phone.toLowerCase().replace(/\s/g, '').includes(trimed) || item?.name.toLowerCase().replace(/\s/g, '').includes(trimed);
      })
    }
    else {
      examData = [...responseDataComp];
    }
    setFilteredData(examData);
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

  const handlePatientAddShow = () => {
    getMrNumber();
    getCitites();
    setPatientAddShow(true);
  }

  const handlePatientEditShow = (item) => {
    setEditPatient(item)
    getCitites();
    setPatientEditShow(true);
  }

  const handlePatientDeleteShow = (item) => {
    setPatientDeleteShow(true);
    setPatientDelete(item?.id)
  }


  const navigateToPatient = (item) => {
    navigate(`/patient-profile/${item?.id}`)
  }

  const handleGender = (e) => {
    setFilterGender(e.target.value)
  }

  const handleDatePicker = (date, datestring) => {
    setSelectedDate(datestring)
    // setSelectedDate(date ? dayjs(dateString) : null);
  }

  const handleSearchFilter = (e) => {
    setSearchFilter(e.target.value)
  }

  useEffect(() => {
    allPatients();
  }, []);

  useEffect(() => {
    fetchAllPatientsListing();
    setWaitForApiResponse(false)
  }, [currentPage, filterGender, searchFilter, selectedDate]);

  return (
    <>
      {isLoading ? <Loader />
        :
        <WraperLayout className="patient">
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
                        onChange={handleDatePicker}
                        name='dob'
                        defaultValue={dayjs()}
                        inputReadOnly={true}
                        allowClear={false}
                        value={dayjs(selectedDate)}
                      />

                    </div>
                  </Col>
                  <Col lg={4}>
                    <div className="filter-by-div">
                      <p className="filterHeading">Filter by gender </p>
                      <Form.Select aria-label="Default select example" name='practiceCity' onChange={(e) => handleGender(e)} className='filter'  >
                        <option selected disabled>Select</option>
                        <option value={"male"} >Male </option>
                        <option value={"female"} >Female</option>
                        <option value={"other"} >Other </option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col lg={1}></Col>
                  <Col lg={5}>
                    <Row className='justify-content-end'>
                      <Col lg={7}>
                        <div className="search__bar">
                          <img src={Search} alt="" />
                          <input onChange={handleSearch} type="text" placeholder='Search by Name or Number' />
                        </div>
                      </Col>
                      {allowedPermissions["patients_add"] && <Col lg={4} >
                        <button onClick={handlePatientAddShow} className="button1">Add New Patient</button>
                      </Col>}
                    </Row>
                  </Col>
                </Row>
              </div>
              <div className="bottom_wrap">
                <Table responsive>
                  <thead>
                    <tr>
                      <th>MR No.</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>Phone No.</th>
                      <th>Date Created</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData?.length > 0 ?
                      filteredData?.map((item) => (
                        <tr>
                          <td>{item?.mr_no}</td>
                          <td>{item?.name}</td>
                          <td>{item?.gender}</td>
                          <td>{item?.phone}</td>
                          <td>{item?.created_at}</td>
                          <td>
                            <div className='wrape_actions'>
                              {allowedPermissions["patients_profile_view"] && <div onClick={() => navigateToPatient(item)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <g clip-path="url(#clip0_7042_5034)">
                                    <path d="M23.2047 11.745C22.3226 9.46324 20.7912 7.48996 18.7998 6.06906C16.8084 4.64817 14.4443 3.84193 11.9997 3.75C9.55507 3.84193 7.19097 4.64817 5.19958 6.06906C3.20819 7.48996 1.6768 9.46324 0.794681 11.745C0.735106 11.9098 0.735106 12.0902 0.794681 12.255C1.6768 14.5368 3.20819 16.51 5.19958 17.9309C7.19097 19.3518 9.55507 20.1581 11.9997 20.25C14.4443 20.1581 16.8084 19.3518 18.7998 17.9309C20.7912 16.51 22.3226 14.5368 23.2047 12.255C23.2643 12.0902 23.2643 11.9098 23.2047 11.745ZM11.9997 18.75C8.02468 18.75 3.82468 15.8025 2.30218 12C3.82468 8.1975 8.02468 5.25 11.9997 5.25C15.9747 5.25 20.1747 8.1975 21.6972 12C20.1747 15.8025 15.9747 18.75 11.9997 18.75Z" fill="#0F75BC" />
                                    <path d="M12 7.5C11.11 7.5 10.24 7.76392 9.49994 8.25839C8.75991 8.75285 8.18314 9.45566 7.84254 10.2779C7.50195 11.1002 7.41283 12.005 7.58647 12.8779C7.7601 13.7508 8.18869 14.5526 8.81802 15.182C9.44736 15.8113 10.2492 16.2399 11.1221 16.4135C11.995 16.5872 12.8998 16.4981 13.7221 16.1575C14.5443 15.8169 15.2471 15.2401 15.7416 14.5001C16.2361 13.76 16.5 12.89 16.5 12C16.5 10.8065 16.0259 9.66193 15.182 8.81802C14.3381 7.97411 13.1935 7.5 12 7.5ZM12 15C11.4067 15 10.8266 14.8241 10.3333 14.4944C9.83994 14.1648 9.45543 13.6962 9.22836 13.148C9.0013 12.5999 8.94189 11.9967 9.05765 11.4147C9.1734 10.8328 9.45912 10.2982 9.87868 9.87868C10.2982 9.45912 10.8328 9.1734 11.4147 9.05764C11.9967 8.94189 12.5999 9.0013 13.1481 9.22836C13.6962 9.45542 14.1648 9.83994 14.4944 10.3333C14.8241 10.8266 15 11.4067 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7957 15 12 15Z" fill="#0F75BC" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_7042_5034">
                                      <rect width="24" height="24" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>
                              </div>}
                              {allowedPermissions["patients_update"] &&<button onClick={() => handlePatientEditShow(item)}><EditOutlined /></button>}
                              {allowedPermissions["patients_delete"] && <button onClick={() => handlePatientDeleteShow(item)}><span className='deleteIcon'></span></button>}
                            </div>
                          </td>
                        </tr>
                      ))
                      :
                      <tr >
                        <td className='noRsult' colSpan={12}> No results found </td>
                      </tr>
                    }
                  </tbody>
                </Table>
              </div>
              <div className='boxBtn'>
                {totalPages > 1 ? (
                  <>
                    <div className='countPagination'>
                      {/* {paginateCountData?.from} - {paginateCountData?.to} of {paginateCountData?.total} */}
                      {paginateCountData?.total}
                    </div>
                    <ReactPaginate
                      previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                      nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                      breakLabel={null} // No break label
                      pageCount={totalPages} // Total number of pages
                      pageRangeDisplayed={0} // No page numbers displayed
                      marginPagesDisplayed={0} // No margins around the current page
                      onPageChange={handlePageClick} // Handle page change
                      containerClassName={"pagination_hk"} // Styling for the container
                      previousClassName={`prev_item ${!waitForApiResponse ? "disabled" : ""}`} // Disable when API is loading
                      nextClassName={`next_item ${!waitForApiResponse ? "disabled" : ""}`} // Disable when API is loading
                      previousLinkClassName={"previousLink"} // Styling for the previous link
                      nextLinkClassName={"medical_next_link"} // Styling for the next link
                      forcePage={currentPage - 1} // Force the current page
                      renderOnZeroPageCount={null} // Hide pagination if there are no pages
                      disabledClassName={"disabled"} // Class to disable prev/next buttons
                    />

                  </>
                ) : null}
              </div>
            </div>
          ) : (<div className='box-white patient-mobile'>
            <div className="top_wrap">
              <Row className=' tw-justify-end'>
                <Col xs={12}>
                  <div className="search__bar">
                    <img src={Search} alt="" />
                    <input value={searchFilter} onChange={(e) => handleSearchFilter(e)} type="text" placeholder='Search by here' />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="wraper_date">
                    <div className='iconCalander'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M5.07454 22.0027C4.52445 22.0027 4.05354 21.8069 3.66181 21.4151C3.27008 21.0234 3.07422 20.5525 3.07422 20.0024V6.00015C3.07422 5.45007 3.27008 4.97916 3.66181 4.58743C4.05354 4.1957 4.52445 3.99983 5.07454 3.99983H6.0747V1.99951H8.07502V3.99983H16.0763V1.99951H18.0766V3.99983H19.0768C19.6269 3.99983 20.0978 4.1957 20.4895 4.58743C20.8812 4.97916 21.0771 5.45007 21.0771 6.00015V20.0024C21.0771 20.5525 20.8812 21.0234 20.4895 21.4151C20.0978 21.8069 19.6269 22.0027 19.0768 22.0027H5.07454ZM5.07454 20.0024H19.0768V10.0008H5.07454V20.0024ZM5.07454 8.00047H19.0768V6.00015H5.07454V8.00047ZM12.0757 14.0014C11.7923 14.0014 11.5547 13.9056 11.3631 13.7139C11.1714 13.5222 11.0755 13.2847 11.0755 13.0013C11.0755 12.7179 11.1714 12.4804 11.3631 12.2887C11.5547 12.097 11.7923 12.0011 12.0757 12.0011C12.359 12.0011 12.5966 12.097 12.7883 12.2887C12.98 12.4804 13.0758 12.7179 13.0758 13.0013C13.0758 13.2847 12.98 13.5222 12.7883 13.7139C12.5966 13.9056 12.359 14.0014 12.0757 14.0014ZM8.07502 14.0014C7.79164 14.0014 7.55411 13.9056 7.36241 13.7139C7.17071 13.5222 7.07486 13.2847 7.07486 13.0013C7.07486 12.7179 7.17071 12.4804 7.36241 12.2887C7.55411 12.097 7.79164 12.0011 8.07502 12.0011C8.3584 12.0011 8.59594 12.097 8.78764 12.2887C8.97933 12.4804 9.07518 12.7179 9.07518 13.0013C9.07518 13.2847 8.97933 13.5222 8.78764 13.7139C8.59594 13.9056 8.3584 14.0014 8.07502 14.0014ZM16.0763 14.0014C15.7929 14.0014 15.5554 13.9056 15.3637 13.7139C15.172 13.5222 15.0761 13.2847 15.0761 13.0013C15.0761 12.7179 15.172 12.4804 15.3637 12.2887C15.5554 12.097 15.7929 12.0011 16.0763 12.0011C16.3597 12.0011 16.5972 12.097 16.7889 12.2887C16.9806 12.4804 17.0765 12.7179 17.0765 13.0013C17.0765 13.2847 16.9806 13.5222 16.7889 13.7139C16.5972 13.9056 16.3597 14.0014 16.0763 14.0014ZM12.0757 18.0021C11.7923 18.0021 11.5547 17.9062 11.3631 17.7145C11.1714 17.5228 11.0755 17.2853 11.0755 17.0019C11.0755 16.7185 11.1714 16.481 11.3631 16.2893C11.5547 16.0976 11.7923 16.0018 12.0757 16.0018C12.359 16.0018 12.5966 16.0976 12.7883 16.2893C12.98 16.481 13.0758 16.7185 13.0758 17.0019C13.0758 17.2853 12.98 17.5228 12.7883 17.7145C12.5966 17.9062 12.359 18.0021 12.0757 18.0021ZM8.07502 18.0021C7.79164 18.0021 7.55411 17.9062 7.36241 17.7145C7.17071 17.5228 7.07486 17.2853 7.07486 17.0019C7.07486 16.7185 7.17071 16.481 7.36241 16.2893C7.55411 16.0976 7.79164 16.0018 8.07502 16.0018C8.3584 16.0018 8.59594 16.0976 8.78764 16.2893C8.97933 16.481 9.07518 16.7185 9.07518 17.0019C9.07518 17.2853 8.97933 17.5228 8.78764 17.7145C8.59594 17.9062 8.3584 18.0021 8.07502 18.0021ZM16.0763 18.0021C15.7929 18.0021 15.5554 17.9062 15.3637 17.7145C15.172 17.5228 15.0761 17.2853 15.0761 17.0019C15.0761 16.7185 15.172 16.481 15.3637 16.2893C15.5554 16.0976 15.7929 16.0018 16.0763 16.0018C16.3597 16.0018 16.5972 16.0976 16.7889 16.2893C16.9806 16.481 17.0765 16.7185 17.0765 17.0019C17.0765 17.2853 16.9806 17.5228 16.7889 17.7145C16.5972 17.9062 16.3597 18.0021 16.0763 18.0021Z" fill="#0F75BC" />
                      </svg>
                      <div className='datePickerMob'>
                        <DatePicker onChange={handleDatePicker} name='dob' defaultValue={dayjs()} inputReadOnly={true} allowClear={false} value={dayjs(selectedDate)} />
                      </div>

                    </div>
                    <a>
                      <span className='left_arrow' onClick={handlePrevDate}></span>
                    </a>
                    <a>
                      <span className='right_arrow' onClick={handleNextDate}></span>
                    </a>
                    <DatePicker onChange={handleDatePicker} name='dob' defaultValue={dayjs()} inputReadOnly={true} allowClear={false} value={dayjs(selectedDate)} />
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="filter-by-div">
                    <p className="filterHeading">  {isMobile ? "Filter by " : "Filter by gender"}</p>
                    <Form.Select aria-label="Default select example" name='practiceCity' onChange={(e) => handleGender(e)} className='filter'  >
                      <option selected disabled>Select</option>
                      <option value={"male"} >Male </option>
                      <option value={"female"} >Female</option>
                      <option value={"other"} >Other</option>
                    </Form.Select>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className='mt-3'>
              {patientsListing?.length > 0 && patientsListing?.map((item) => (
                <Col key={item?.id} xs={12}>
                  <div className="card">
                    <p>{item?.created_at}</p>
                    <div className="mr-no">{item?.mr_no}</div>
                    <h4>{item?.name} | {item?.gender}</h4>
                    <div className='d-flex justify-content-between'>
                      <p>{item?.phone}</p>
                      <div className='wrape_actions'>
                        <div onClick={() => navigateToPatient(item)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clip-path="url(#clip0_7042_5034)">
                              <path d="M23.2047 11.745C22.3226 9.46324 20.7912 7.48996 18.7998 6.06906C16.8084 4.64817 14.4443 3.84193 11.9997 3.75C9.55507 3.84193 7.19097 4.64817 5.19958 6.06906C3.20819 7.48996 1.6768 9.46324 0.794681 11.745C0.735106 11.9098 0.735106 12.0902 0.794681 12.255C1.6768 14.5368 3.20819 16.51 5.19958 17.9309C7.19097 19.3518 9.55507 20.1581 11.9997 20.25C14.4443 20.1581 16.8084 19.3518 18.7998 17.9309C20.7912 16.51 22.3226 14.5368 23.2047 12.255C23.2643 12.0902 23.2643 11.9098 23.2047 11.745ZM11.9997 18.75C8.02468 18.75 3.82468 15.8025 2.30218 12C3.82468 8.1975 8.02468 5.25 11.9997 5.25C15.9747 5.25 20.1747 8.1975 21.6972 12C20.1747 15.8025 15.9747 18.75 11.9997 18.75Z" fill="#0F75BC" />
                              <path d="M12 7.5C11.11 7.5 10.24 7.76392 9.49994 8.25839C8.75991 8.75285 8.18314 9.45566 7.84254 10.2779C7.50195 11.1002 7.41283 12.005 7.58647 12.8779C7.7601 13.7508 8.18869 14.5526 8.81802 15.182C9.44736 15.8113 10.2492 16.2399 11.1221 16.4135C11.995 16.5872 12.8998 16.4981 13.7221 16.1575C14.5443 15.8169 15.2471 15.2401 15.7416 14.5001C16.2361 13.76 16.5 12.89 16.5 12C16.5 10.8065 16.0259 9.66193 15.182 8.81802C14.3381 7.97411 13.1935 7.5 12 7.5ZM12 15C11.4067 15 10.8266 14.8241 10.3333 14.4944C9.83994 14.1648 9.45543 13.6962 9.22836 13.148C9.0013 12.5999 8.94189 11.9967 9.05765 11.4147C9.1734 10.8328 9.45912 10.2982 9.87868 9.87868C10.2982 9.45912 10.8328 9.1734 11.4147 9.05764C11.9967 8.94189 12.5999 9.0013 13.1481 9.22836C13.6962 9.45542 14.1648 9.83994 14.4944 10.3333C14.8241 10.8266 15 11.4067 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7957 15 12 15Z" fill="#0F75BC" />
                            </g>
                            <defs>
                              <clipPath id="clip0_7042_5034">
                                <rect width="24" height="24" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          {/* <EyeOutlined /> */}
                        </div>
                        {/* <Link to="/patient-profile"></Link> */}
                        <button onClick={() => handlePatientEditShow(item)}><EditOutlined /></button>
                        <button onClick={() => handlePatientDeleteShow(item)}><span className='deleteIcon'></span></button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
            {allowedPermissions["patients_add"] && <div className="btnWrapeSave box-fixed">
              <button onClick={handlePatientAddShow} className="button2">Add New Patient</button>
            </div>}
          </div>)}
          <AddPatientModal setPatientAddShow={setPatientAddShow} cities={cities} patientAddShow={patientAddShow} mrNumber={mrNumber} fetchAllPatientsListing={fetchAllPatientsListing} />
          <EditPatientModal fetchAllPatientsListing={fetchAllPatientsListing} cities={cities} editPatient={editPatient} handlePatientEditClose={handlePatientEditClose} patientEditShow={patientEditShow} />
          <DeletePatientModal fetchAllPatientsListing={fetchAllPatientsListing} patientDelete={patientDelete} handlePatientDeleteClose={handlePatientDeleteClose} patientDeleteShow={patientDeleteShow} />
        </WraperLayout>
      }
    </>
  )
}

export default Patients