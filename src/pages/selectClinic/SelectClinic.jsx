import React, { useEffect, useState } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout';
import './selectClinic.scss';
import { Row, Col } from 'react-bootstrap';
// import { Select } from 'antd';
// import Logo from '../../assets/images/png/logoGreen.png';
import Logo from '../../assets/images/png/ms_pro.png'
import CarouselFront from '../../components/carouselFront/CarouselFront';
import { useNavigate } from 'react-router-dom';
import { API } from '../../services/httpInstance/index';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import "react-color-palette/css";
import { Dropdown } from 'primereact/dropdown';
import { clinicSuccess, savePermissions } from '../../redux/slices/clinicSlice';
import { useDispatch } from 'react-redux';

const SelectClinic = () => {
  const [clinicList, setClinicList] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [clinicDetails, setClinicDetails] = useState({});
  const [indicationMessage, setIndicationMessage] = useState("");

  const navigate = useNavigate();

  const getClinicList = async () => {
    try {
      const response = await API.get('/clinic-list')
      if (response?.status == 200) {
        setClinicList(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getClinicList()
  }, [])


  useEffect(() => {
    if (clinicList.length == 1) {
      setSelectedId(clinicList[0].id);
      let details = clinicList.filter((item) => {
        return item?.id == clinicList[0].id;
      })
      setClinicDetails(details[0]);
    } else {
      setSelectedId('');
    }
  }, [clinicList])

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 1000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])


  const handleClinicId = (value) => {
    setSelectedId(value);
    let details = clinicList.filter((item) => {
      return item?.id == value;
    })
    setClinicDetails(details[0]);
  }

  const dispatch = useDispatch();

  const saveClinic = async (e) => {
    e.preventDefault();
    if (selectedId) {
      try {
        const payload = {
          clinic_id: selectedId
        };
        const saveId = await API.post('/save-clinic', payload)
        if (saveId?.status == 200) {
          dispatch(clinicSuccess(clinicDetails));
          dispatch(savePermissions(saveId?.data?.data?.permissions))
          Cookies.set('appointmentType', saveId?.data?.data?.appointment_type)
          Cookies.set('previousAppointment', saveId?.data?.data?.previous_appointment_billing)
          Cookies.set('clinicAllowMedProtocol', saveId?.data?.data?.clinicAllowMedProtocol)
          Cookies.set('message', saveId?.data?.data?.message)
          navigate('/')
        } else {
          Cookies.remove('Authorization')
          setIndicationMessage(saveId?.data?.message);
          setTimeout(() => {
            navigate('/login')
          }, 3000)
        }
      } catch (error) {
        console.log(error)
      }
    }

  }
  
  return (
    <WraperLayout className={"select_clinic"}>
      <Row>
        <Col lg={6}>
          <div className="left-wrap">
            <CarouselFront />
          </div>
        </Col>
        <Col lg={6}>
          <div className="right-wrap">
            <Row className="align-items-center">
              <Col lg={8}>
                <div className="log-img">
                  <img src={Logo} alt="" />
                </div>
                <div className="text-center selectClinicLogin">
                  <p className="body-text">Select your clinic</p>
                </div>
                <form method="get" className="otp-form" autoComplete="off">
                  <div className="form-row ">
                    <div className="form-group col-lg-12">
                      <Dropdown value={selectedId} onChange={(e) => handleClinicId(e.value)}
                        options={clinicList?.map((option) => ({
                          value: option.id,
                          label: option.name,
                        }))}
                        placeholder="Select a Clinic" />
                    </div>
                  </div>
                  <div className="form-button">
                    <button onClick={(e) => saveClinic(e)} id="continueBtn" className="button2">CONTINUE</button>
                  </div>
                </form>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </WraperLayout>
  )
}

export default SelectClinic