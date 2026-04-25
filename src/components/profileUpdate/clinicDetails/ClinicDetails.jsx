/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Row, Col, Form } from "react-bootstrap";
import { DatePicker, Input, Checkbox } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "./clinicDetails.scss";
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { InputMask } from '@react-input/mask';
import moment from 'moment/moment';

const ClinicDetails = ({ detailsDoctor, isLoading, setdetailsDoctor, setIsLoading, getDetailsDoctor }) => {
  const [citiesAll, setCitiesAll] = useState([])
  const [areasAll, setAreasAll] = useState([])
  const [regionsAll, setRegionsAll] = useState([])
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [city, setCity] = useState(null)
  const [area, setArea] = useState(null)
  const [region, setRegion] = useState("")
  const [gender, setGender] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [expInYears, setExpInYears] = useState(null);
  const [cnic, setCnic] = useState(null);
  const [pmdcNumber, setPmdcNumber] = useState(null);
  const [practiceName, setPracticeName] = useState("");
  const [practicePhoneNumber, setPracticePhoneNumber] = useState(null);
  const [practiceAddress, setPracticeAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [capitalizePassword, setCapitalizePassword] = useState(false)
  const [passEight, setPassEight] = useState(false)
  const [otherArea, setOtherArea] = useState("")
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    getRegions();
    getDetailsDoctor();
    getCities();
  }, [])

  const getRegions = async () => {
    try {
      setIsLoading(true)
      const response = await API.get("/regions-list");
      if (response?.status == 200) {
        setRegionsAll(response?.data?.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error")
    }
  }

  const getCities = async () => {
    try {
      setIsLoading(true)
      const response = await API.get("/cities-list");
      if (response?.status == 200) {
        setCitiesAll(response?.data?.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error")
    }
  }

  const getAreas = async (cityId) => {
    try {
      setIsLoading(true)
      if (city !== "") {
        const response = await API.get(`/areas-list/${cityId}`);
        if (response?.status == 200) {
          setAreasAll(response?.data?.data)
          setIsLoading(false)
        }
        else {
          toast.error("No area found")
          setIsLoading(false)
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error")
    }
  }

  const handleChange = async (e) => {
    const { value, name, checked } = e.target;

    if (name == "fullName") {
      setFullName(value);
    }

    if (name == "email") {
      setEmail(value);
    }

    if (name == "practiceCity") {
      setCity(value);
      const response = await API.get(`/areas-list/${value}`);
      if (response?.status == 200) {
        setAreasAll(response?.data?.data);
        setIsLoading(false)
      }
      else {
        setIsLoading(false);
        toast.error("No Area Found")
      }
    }

    if (name == "area") {
      setArea(value);
    }


    if (name == "region") {
      setRegion(value);
      const response = await API.get(`/cities-list/${value}`);
      if (response?.status == 200) {
        setCitiesAll(response?.data?.data);
        setIsLoading(false)
      }
      else {
        setIsLoading(false);
        toast.error("No City Found")
      }
    }

    if (name == "gender") {
      setGender(value);
    }

    if (name == "expInYears") {
      setExpInYears(value);
    }

    if (name == "cnic") {
      setCnic(value);
    }

    if (name == "pmdcNumber") {
      setPmdcNumber(value);
    }


    if (name == "practiceName") {
      setPracticeName(value);
    }

    if (name == "practicePhoneNumber") {
      setPracticePhoneNumber(value);
    }

    if (name == "practiceAddress") {
      setPracticeAddress(value);
    }

    if (name == "password") {
      setPassword(value);
      setIsValid(/[A-Z]/.test(value))
      if (value.length >= 8) {
        setPassEight(true)
      }
      else {
        setPassEight(false)
      }
    }
    if (name == "cPassword") {
      setConfirmPassword(value);
    }
  }


  const handleDateChange = (date) => {
    if (date) {
      let formatDate = dayjs(date).format('YYYY/MM/DD');
      setDateOfBirth(formatDate);
    } else {
      setDateOfBirth(null);
    }
  };

  const handleConfirmPassword = (e) => {
    const { value } = e.target;
    if (password !== "" && password === value) {
    }
    else {
    }
  }

  useEffect(() => {
    if (detailsDoctor) {
      setFullName(detailsDoctor?.user?.name)
      setEmail(detailsDoctor?.user?.email)
      setGender(detailsDoctor?.user?.gender)
      setExpInYears(detailsDoctor?.user?.no_of_years_exp) 
      setCnic(detailsDoctor?.user?.cnic)
      setPracticeName(detailsDoctor?.user?.practice_name)
      setPracticePhoneNumber(detailsDoctor?.user?.practice_number)
      setPracticeAddress(detailsDoctor?.user?.practice_address)
      setRegion(detailsDoctor?.user?.region_id);

      if (detailsDoctor?.user?.city_id) {
        setCity(detailsDoctor?.user?.city_id || null)
        getAreas(detailsDoctor?.user?.city_id)
      }

      if (detailsDoctor?.user?.pmdc !== null) {
        setPmdcNumber(detailsDoctor?.user?.pmdc || null)
      }

      if (detailsDoctor?.user?.area_id !== null) {
        setArea(detailsDoctor?.user?.area_id || null)
      }

      if (dayjs(detailsDoctor?.user?.dob !== null)) {
        let datee = detailsDoctor?.user?.dob;
        setDateOfBirth(datee || null)
      }
    }
  }, [detailsDoctor])


  const payload = {
    name: fullName,
    email,
    cnic,
    city_id: city,
    area_id: area,
    region,
    gender,
    dob: dateOfBirth,
    no_of_years_exp: expInYears,
    pmdc: pmdcNumber,
    practice_name: practiceName,
    practice_address: practiceAddress,
    practice_number: practicePhoneNumber,
  };

  if (password) {
    payload.password = password;
    payload.password_confirmation = confirmPassword;
  }

  const [errorObj, setErrorObj] = useState({}); 
  const [btnDisabled, setBtnDisabled] = useState(true);

  useEffect(() => {
    if (
      fullName &&
      city &&
      email &&
      area &&
      region &&
      gender &&
      dateOfBirth &&
      expInYears &&
      cnic &&
      pmdcNumber &&
      password &&
      confirmPassword
    ) {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  }, [
    fullName,
    city,
    email,
    area,
    region,
    gender,
    dateOfBirth,
    expInYears,
    cnic,
    pmdcNumber,
    password,
    confirmPassword,
  ]);


  const handleUpdate = async () => {
    let errors = {}
    if (!fullName) errors.name = "Full name is required";
    if (!city) errors.city = "City is required";
    if (!email) errors.email = "Email is required";
    if (!area) errors.area = "area is required";
    if (!region) errors.region = "Region is required";
    if (!gender) errors.gender = "Gender is required";
    if (!dateOfBirth) errors.dateOfBirth = "Date Of Birth is required";
    if (!expInYears) errors.expInYears = "Experience In Years is required";
    if (!cnic) errors.cnic = "Cnic is required";
    if (!pmdcNumber) errors.pmdcNumber = "Pmdc Number is required";
    if (!password) errors.password = "Password is required";
    if (!confirmPassword) errors.confirmPassword = "Confirm Password is required";

    if (fullName && city && email && area && region && gender && dateOfBirth && expInYears && cnic && pmdcNumber && password && confirmPassword) {
      setBtnDisabled(false) 
      try {
        setIsLoading(true);
        const response = await API.put("/profile-update", payload)
        if (response?.status == 200) {
          toast.success(response?.data?.message)
          window.location.reload()
          getDetailsDoctor();
          setIsLoading(false);
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
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("error in update");
        setIsLoading(false);
      }
    } else {
      setBtnDisabled(true)
    }
    setErrorObj(errors)
  }

  useEffect(() => {
    const getDataCities = async (region) => {
      const response = await API.get(`/cities-list/${region}`);
      if (response?.status == 200) {
        setCitiesAll(response?.data?.data);
        setIsLoading(false)
      }
      else {
        setIsLoading(false);
        toast.error("No City Found")
      }
    }
    if (region !== "" && region !== null && region !== undefined) {
      getDataCities(region)
    }
  }, [region])

  useEffect(() => {
    const getDataAreas = async (city) => {
      const response = await API.get(`/areas-list/${city}`);
      if (response?.status == 200) {
        setAreasAll(response?.data?.data);
        setIsLoading(false)
      }
      else {
        setIsLoading(false);
        toast.error("No City Found")
      }
    }
    if (city !== "" && city !== null && city !== undefined) {
      getDataAreas(city)
    }
  }, [city])

  return (
    <div className='clinic_detail'>
      <Row>
        <Col lg={12}>
          <h3>Basic Information</h3>
          <div className="form-update">
            <Row>
              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Doctor ID</Form.Label>
                <Form.Control type="text" placeholder="name@example.com" disabled readOnly value={detailsDoctor?.user?.id} />
              </Form.Group>
              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Mobile Number*</Form.Label>
                <Form.Control type="text" placeholder="+92 334202020" readOnly value={detailsDoctor?.user?.phone} />
              </Form.Group>
              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Full Name*</Form.Label>
                <Form.Control type="text" placeholder="Maheen Afzal" name='fullName' onChange={handleChange} value={fullName} />
                <span className='error'> {errorObj?.name} </span>
              </Form.Group>
              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="text" placeholder="Enter Email " name='email' onChange={handleChange} value={email} />
                <span className='error'> {errorObj?.email} </span>
              </Form.Group>

              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Region</Form.Label>
                <Form.Select aria-label="Default select example" name='region' onChange={handleChange} value={region} defaultChecked={detailsDoctor?.user?.region_id == region ? true : false} >
                  <option value="">Select Region</option>
                  {regionsAll?.map((item) => {
                    return (<>
                      <option value={item?.id}>{item?.title}</option>
                    </>)
                  })}
                </Form.Select>
                <span className='error'> {errorObj?.region} </span>
              </Form.Group>

              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Practice City</Form.Label>
                <Form.Select aria-label="Default select example" name='practiceCity' onChange={handleChange} value={city} defaultChecked={detailsDoctor?.user?.city_id == city ? true : false} >
                  <option value="">Select City</option>
                  {citiesAll?.map((item) => {
                    return (<>
                      <option value={item?.id}>{item?.name}</option>
                    </>)
                  })}
                </Form.Select>
                <span className='error'> {errorObj?.city} </span>
              </Form.Group>

              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Area</Form.Label>
                <Form.Select aria-label="Default select example" name='area' onChange={handleChange} value={area} >
                  <option value="">Select Area</option>
                  {areasAll?.map((item, index) => {
                    return (<>
                      <option value={item?.id} selected={detailsDoctor?.user?.area_id} >{item?.title}  </option>
                    </>)
                  })}
                </Form.Select>
                <span className='error'> {errorObj?.area} </span>
              </Form.Group>
              <Col lg={3} md={3}>
                <span className='heLab'> Gender </span>
                <div className="wrape_gender">
                  <div className="single customRadioo">
                    <div className="wrapeInp">
                      <input type="radio" id="gender1" name="gender" value={"male"} onChange={handleChange} checked={gender == "male"} />
                      <span></span>
                    </div>
                    <label htmlFor="gender1"> Male </label>
                  </div>
                  <div className="single customRadioo">
                    <div className="wrapeInp">
                      <input type="radio" id="gender2" name="gender" value={"female"} onChange={handleChange} checked={gender == "female"} />
                      <span></span>
                    </div>
                    <label htmlFor="gender2"> Female </label>
                  </div>
                  <div className="single customRadioo">
                    <div className="wrapeInp">
                      <input type="radio" id="gender3" name="gender" value={"other"} onChange={handleChange} checked={gender == "other"} />
                      <span></span>
                    </div>
                    <label htmlFor="gender3"> Other </label>
                  </div>
                </div>
                <span className='error'> {errorObj?.gender} </span>

              </Col>
              <Form.Group as={Col} md={3}>
                <Form.Label>Date of Birth</Form.Label>
                <DatePicker onChange={handleDateChange} name='dob' placeholder="00" value={dateOfBirth ? dayjs(dateOfBirth, 'YYYY/MM/DD') : null} />
                <span className='error'> {errorObj?.dateOfBirth} </span>
              </Form.Group>

              <Form.Group as={Col} md={3}>
                <Form.Label>Experience in Years</Form.Label>
                <InputMask mask="__" replacement={{ _: /\d/ }} name='expInYears' onChange={handleChange} value={expInYears} placeholder='00' className='maskInpp' />
                <span className='error'> {errorObj?.expInYears} </span>
              </Form.Group>

              <Form.Group as={Col} md={3}>
                <Form.Label>CNIC</Form.Label>
                <InputMask mask="_____________" replacement={{ _: /\d/ }} name='cnic' onChange={handleChange} value={cnic} placeholder='00' className='maskInpp' />
                <span className='error'> {errorObj?.cnic} </span>
              </Form.Group>

            </Row>
          </div>
          <h3 className='pt-2'>Practice Details</h3>
          <div className="form-update">
            <Row>
              <Form.Group as={Col} md={3}>
                <Form.Label>PMDC Number</Form.Label>
                <Form.Control type="text" placeholder="UHS929" name='pmdcNumber' onChange={handleChange} value={pmdcNumber} />
                <span className='error'> {errorObj?.pmdcNumber} </span>
              </Form.Group>
              <Form.Group as={Col} md={3}>
                <Form.Label>Practice Name</Form.Label>
                <Form.Control type="text" placeholder="name@example.com" name='practiceName' onChange={handleChange} value={practiceName} />
              </Form.Group>
              <Form.Group as={Col} md={3}>
                <Form.Label>Practice Phone Number</Form.Label>
                <InputMask mask="___________" replacement={{ _: /\d/ }} name='practicePhoneNumber' onChange={handleChange} value={practicePhoneNumber} placeholder='00399984939' className='maskInpp' />
              </Form.Group>
              <Form.Group as={Col} md={3}>
                <Form.Label>Practice Address</Form.Label>
                <Form.Control type="text" placeholder="Sunset Lane 5" name='practiceAddress' onChange={handleChange} value={practiceAddress} />
              </Form.Group>
            </Row>
          </div>
          <h3 className='pt-2'>Setup your password</h3>
          <div className="form-update">
            <Row>
              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>New password</Form.Label>
                <Input.Password
                  placeholder="Enter your password"
                  name='password'
                  value={password}
                  onChange={handleChange}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
                <span className='error'> {errorObj?.password} </span>
              </Form.Group>
              <Form.Group as={Col} md={3} className="mb-3">
                <Form.Label>Confirm your new password</Form.Label>
                <Input.Password
                  placeholder="Re-type your password"
                  name='cPassword'
                  value={confirmPassword}
                  onChange={handleChange}
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
                <span className='error'> {errorObj?.confirmPassword} </span>
              </Form.Group>
              <Row>
                <h5 className='passCri'> Password Criteria </h5>
                <Col lg={3}>
                  <div className="single_field_checks">
                    <label htmlFor="pass">
                      <input type="checkbox" id='pass' name='pass' checked={passEight} />
                      <span>  </span>
                      Minimum 8 Characters (alphanumeric)
                    </label>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="single_field_checks">
                    <label htmlFor="">
                      <input type="checkbox" id='' name='pass2' readOnly checked={isValid} />
                      <span>  </span>
                      Include at least one uppercase letter (A-Z)
                    </label>
                  </div>
                </Col>
              </Row>
            </Row>
          </div>
          <div className='update'>
            <button className="button2" onClick={handleUpdate} >Update</button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default ClinicDetails;
