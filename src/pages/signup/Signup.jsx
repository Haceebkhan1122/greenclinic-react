import WraperLayout from '../../components/wraperLayout/WraperLayout';
// import logo from '../../assets/images/png/logoGreen.png';
import logo from '../../assets/images/png/ms_pro.png'
import { Col, Form, Row } from 'react-bootstrap';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { DatePicker, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import SignupCompleteRequest from '../../components/signupCompleteRequest/SignupCompleteRequest';
import './signup.scss';
import { citiesApi, signUpForm, specialityApi } from '../../services/endpoints';
import API from '../../services/httpInstance';
import { InputMask } from '@react-input/mask';
import { toast } from 'react-toastify';
import Loader from '../../components/loader/Loader';
import { useClickAway } from "@uidotdev/usehooks";
// import { PhoneInput } from 'react-international-phone';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import 'react-international-phone/style.css';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  // eslint-disable-next-line no-unused-vars
  const [signupComplete, setSignupComplete] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("");
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [practiceCity, setPracticeCity] = useState("")
  const [area, setArea] = useState("");
  const [region, setRegion] = useState("")
  const [gender, setGender] = useState("")
  const [dob, setDob] = useState("")
  const [cityId, setCityId] = useState("")
  const [specialityId, setSpecialityId] = useState("")
  const [practiceName, setPracticeName] = useState("")
  const [practiceAddress, setPracticeAddress] = useState("")
  const [practicePhoneNumber, setPracticePhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [experience, setExperience] = useState("");
  const [pmdc, setPmdc] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [specialityData, setSpecialityData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [passEight, setPassEight] = useState(false)
  const [areasAll, setAreasAll] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [regionsAll, setRegionsAll] = useState([])
  const [errorObj, setErrorObj] = useState({})
  const [validEmail, setValidEmail] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [indicationMessage, setIndicationMessage] = useState("");
  const [showArea, setShowArea] = useState(false)
  const [otherArea, setOtherArea] = useState("");
  const [otherAreaDisabled, setOtherAreaDisabled] = useState(false);
  const [areaDisplay, setAreaDisplay] = useState("Select Area");
  const [isSave, setIsSave] = useState(true);


  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 2000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])

  const ref = useClickAway(() => {
    if (otherArea !== "") {
      setOtherArea((prev) => prev)
    }
    setShowArea(false);
  });


  useEffect(() => {
    specialitiesFn();
    getRegions();
  }, [])

  const { Option } = Select;

  const handlePhoneChange = (value, country) => {
    // setPhoneNumber(value);
    // const dialCode = country?.dialCode || "";

    // let error = "";
    // if (!value.startsWith("+")) {
    //   error = `Phone number must include country code (e.g., +${dialCode})`;
    // }

    setPhoneNumber(value);
    let formattedPhone = value;

    // Format the phone number if it starts with 92 (Pakistan)
    if (value?.startsWith('0')) {
      formattedPhone = '+92' + value.slice(1); // Replace 0 with +92 for Pakistani numbers
    } else if (!value?.startsWith('+')) {
      formattedPhone = '+' + value; // Ensure the value starts with +
    }

    setPhoneNumber(formattedPhone);

    // setErrorObj((prev) => ({ ...prev, phone: error }));
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // if (name == "phone") {
    //   errorObj.phone = " ";
    //   let val = value.replace(/\D/g, "").slice(0, 10);

    //   if (val !== "" && !val.startsWith("3")) {
    //     errorObj.phone = "Number must start with 3 (e.g., 3xxxxxxxxx)";
    //   }

    //   setPhoneNumber(val);
    // }

    if (name == "otherArea") {
      setOtherArea(value);
    }

    if (name == "name") {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        let val = value.slice(0, 30);
        errorObj.name = " ";
        setName(val);
      }
    }

    if (name == "email") {
      errorObj.email = " "
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let val = value.slice(0, 40);
      setEmail(val);
      setValidEmail(emailRegex.test(value));
    }

    if (name == "email") {
      errorObj.email = " "

      if (value.length >= 40) {
        errorObj.email = 'Email must be less than or 40 characters'
      }
      else {
        errorObj.email = ''
      }
    }

    if (name == "practiceCity") {
      errorObj.city = " "
      setCityId(value);
      const response = await API.get(`/areas-list/${value}`);
      if (response?.status == 200) {
        setAreasAll(response?.data?.data);
        setFilteredAreas(response?.data?.data);
        setIsLoading(false)
      }
      else {
        setAreasAll([]);
        setAreaDisplay("Select Area");
        setIsLoading(false);
        setIndicationMessage("No Area Found")
      }
    }
    if (name == "area") {
      errorObj.area = " "
      setArea(value);
    }
    if (name == "region") {
      errorObj.region = " "
      setRegion(value);
      const response = await API.get(`/cities-list/${value}`);
      if (response?.status == 200) {
        setCitiesData(response?.data?.data);
        setIsLoading(false)
      }
      else {
        setIsLoading(false);
        setIndicationMessage("No Area Found")
      }
    }
    if (name == "gender") {
      errorObj.gender = " "
      setGender(value);
    }
    if (name == "specialty") {
      errorObj.speciality = " "

      setSpecialityId(value);
    }
    if (name == "practiceName") {
      errorObj.practiceName = " "
      let val = value.slice(0, 100);
      setPracticeName(val);
    }
    if (name == "practiceAddress") {
      errorObj.practiceAddress = " "
      let val = value.slice(0, 200);
      setPracticeAddress(val);
    }
    if (name == "practiceNumber") {
      errorObj.practicePhoneNumber = " "
      let val = value;
      if (val !== "" && !val.startsWith(`03`)) {
        errorObj.practicePhoneNumber = "Number must be starts with 03"
      }
      if (val !== "" && !val.startsWith(0) || !val.startsWith("0")) {
        val = ""
        errorObj.practicePhoneNumber = "Number must be starts with 0"
      }
      setPracticePhoneNumber(val);
    }
    if (name == "cnic") {
      errorObj.cnic = " "
      let val = value;
      setCnic(val);
    }
    if (name == "experience") {
      errorObj.experience = " "
      setExperience(value);
    }
    if (name == "pmdc") {
      errorObj.pmdc = " "
      let val = value.slice(0, 7);
      setPmdc(val);
    }
    if (name == "password") {
      errorObj.password = " "
      let val = value.slice(0, 30);
      setIsValid(/[A-Z]/.test(val))
      if (val.length < 8) {
        errorObj.password = "Password must be atleast 8 characters long"
        setPassEight(false);
      }
      if (val.length >= 8) {
        setPassEight(true)
        errorObj.password = ""
      }
      setPassword(val);
    }
    if (name == "cPassword") {
      errorObj.confirmPassword = " "
      setConfirmPassword(value);
      setIsValid(/[A-Z]/.test(value))
      if (value.length >= 8) {
        setPassEight(true)
      }
      else {
        setPassEight(false)
      }
    }
  }

  const getRegions = async () => {
    try {
      const response = await API.get("/regions-list");
      setRegionsAll(response?.data?.data);
    } catch (error) {
      console.log("error", error);
    }
  }

  const dateChange = (date, dateString) => {
    setDob(dateString);
  };

  // const derivedCode = phoneNumber.match(/^\+(\d{1,2})/)?.[1] || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    let derivedCode = '';
    let cleanPhone = phoneNumber?.trim();
    let inputPhone = cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone;

    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      inputPhone = '+92' + cleanPhone.slice(1);
    }

    const phoneObj = parsePhoneNumberFromString(inputPhone);

    if (phoneObj?.isValid()) {
      derivedCode = phoneObj.countryCallingCode;
      cleanPhone = phoneObj.nationalNumber;
      if (derivedCode === "92" && !cleanPhone.startsWith("0")) {
        cleanPhone = "0" + cleanPhone;
      }
    } else {
      toast.error("Invalid phone number format", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark"
      });
      return;
    }

    const payload = {
      phone: cleanPhone,
      country_code: derivedCode,
      full_name: name,
      tag_password: password,
      con_passowrd: confirmPassword,
      gender: gender,
      date_of_birth: dob,
      city_id: cityId,
      address: practiceAddress,
      pmdc: pmdc,
      cnic: cnic,
      speciality_id: specialityId,
      practice_name: practiceName,
      practice_address: practiceAddress,
      practice_phone: practicePhoneNumber,
      no_of_years: experience,
      email,
    }

    // console.log({ payload })

    if (area !== "") payload.area_id = area;
    if (otherArea !== "") payload.area_title = otherArea;

    let errors = {};
    if (phoneNumber == "") errors.phone = "Phone number is required"
    if (!phoneNumber.startsWith(`+${countryCode}`)) errors.phone = `Phone number must include country code (e.g., +${dialCode})`
    // if (phoneNumber !== "" && phoneNumber.length !== 11) errors.phone = "Please enter a valid mobile number."
    // if (!phoneNumber.startsWith("3")) errors.phone = "This field is required"
    if (name == "") errors.name = "Please enter a valid name."
    if (email == "") errors.email = "Email is required"
    if (email !== "" && !validEmail) errors.email = "Please enter a valid email address."
    if (region == "") errors.region = "Region is required"
    if (gender == "") errors.gender = "Gender is required"
    if (cityId == "" || cityId == null) errors.city = "Please select a city"
    if (dob == "") errors.dob = "Please select Date of Birth."
    if (area == "") errors.area = "Please select a area"
    if (specialityId == "") errors.speciality = "Please select a speciality"
    if (practiceName == "") errors.practiceName = "Practice Name is Required"
    if (practiceAddress == "") errors.practiceAddress = "Practice Address is Required"
    if (practicePhoneNumber == "") errors.practicePhoneNumber = "Practice PhoneNumber is Required"
    if (cnic == "") errors.cnic = "Cnic is Required"
    if (experience == "") errors.experience = "Experience is Required"
    if (pmdc == "") errors.pmdc = "Pmdc is Required"
    if (password == "") errors.password = "Password is Required"
    if (confirmPassword == "") errors.confirmPassword = "Confirm Password is Required"
    if (confirmPassword && password && (password !== confirmPassword)) errors.password = "Passwords do not match."

    if (phoneNumber && name && email && password && confirmPassword) {
      try {
        setIsLoading(true)
        let response = await API.post(`${signUpForm}`, payload);
        if (response?.status == 200) {
          setIndicationMessage(response?.data?.message);
          setIsLoading(false)
          setSignupComplete(true);
        }
        else {
          setIndicationMessage(response?.data?.message);
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.log("error", error)
      }
      setErrorObj(errors);
    }
    else {
      setIndicationMessage("Please fill all the fields ")
    }
  }

  const specialitiesFn = async () => {
    let response = await API.get(`${specialityApi}`)
    if (response?.status == 200) {
      let data = response?.data?.data;
      return setSpecialityData(data);
    }
  }

  const handleOnlyNumber = (e) => {
    // e.target.value = e.target.value.replace(/[eE+-]/g, "");
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
  };

  const handleOnlyText = (e) => {
    if (/\d/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleAreaClick = () => {
    setShowArea(!showArea)
  }


  const handleChangeArea = (e, item) => {
    const { value } = e.target;
    setArea(value);
    setAreaDisplay(item?.title);
    setShowArea(false)
    if (otherArea !== "") {
      setOtherArea("")
    }
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAreas, setFilteredAreas] = useState(areasAll);

  const handleSearchTerm = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = areasAll?.filter((item) =>
      item?.title?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAreas(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Backspace" && searchTerm.length === 1) {
      setSearchTerm(""); // Reset search when last character is removed
      setFilteredAreas(areasAll);
    }
  };


  useEffect(() => {
    if (otherArea !== "") {
      setOtherAreaDisabled(true);
      setArea("");
    }
    else {
      setOtherAreaDisabled(false);
    }
  }, [otherArea]);

  const handleSaveArea = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOtherArea((prev) => prev);
    if (otherArea !== "") {
      setAreaDisplay(otherArea);
    }
    else {
      setAreaDisplay("Select Area")
    }
    setShowArea(false);
  }

  useEffect(() => {
    if (otherArea !== "") {
      setIsSave(false)
    }
    else {
      setIsSave(true)
    }
  }, [otherArea])

  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}

      {isLoading ? <Loader /> : (<>
        {signupComplete ? <SignupCompleteRequest /> :
          <WraperLayout className={"signPage"}>
            <div className='top-wrape'>
              <h1><Link to="/login">
                <span><svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                  <path d="M4.51184 8.95995L9.88784 14.3359L8.51984 15.6799L0.839844 7.99995L8.51984 0.319946L9.88784 1.66395L4.51184 7.03995H16.1998V8.95995H4.51184Z" fill="#0F75BC" />
                </svg></span>
              </Link>  Signup </h1>
              <img src={logo} alt="" />
            </div>
            <div className="bottomCard">
              <h3> Share Your Clinic Details to Join Our Platform  </h3>
              <form className='signupForm' onSubmit={handleSubmit}>
                <Col lg={12}>
                  <Row>
                    <Col lg={3}>
                      <div className="single_field mobileNumber position-relative">
                        <label htmlFor=""> Mobile Number* </label>
                        {/* <PhoneInput
                          style={{
                            backgroundColor: "#F2F9FF",
                            border: "1px solid #F2F9FF",
                            width: "100%",
                          }}
                          defaultCountry="pk"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          inputProps={{
                            name: "phone",
                            autoComplete: "off",
                          }}
                        /> */}
                        <PhoneInput
                          style={{
                            backgroundColor: "#F2F9FF",
                            border: "1px solid #F2F9FF",
                            width: "100%",
                          }}
                          country={'pk'}
                          value={phoneNumber.replace(/^0/, "92")}
                          international={false}
                          countryCallingCodeEditable={false}
                          onChange={handlePhoneChange}
                          countryCodeEditable={false}
                          inputProps={{
                            name: "phone",
                            autoComplete: "off",
                          }}
                        />
                        <span className="error">{errorObj?.phone}</span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Full Name* </label>
                        <input type="text" placeholder='Enter your full name.' name='name' onChange={handleChange} value={name} />
                        <span className="error"> {errorObj?.name} </span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Email Address </label>
                        <input type="email" placeholder='Enter your email address.' name='email' onChange={handleChange} value={email} />
                        <span className="error"> {errorObj?.email} </span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Region </label>
                        <Form.Select aria-label="Default select example" name='region' onChange={handleChange} value={region} >
                          <option> Select your Region </option>
                          {regionsAll?.map((item) => {
                            return (<>
                              <option value={item?.id}>{item?.title}</option>
                            </>)
                          })}
                        </Form.Select>
                        <span className="error">  {errorObj?.region}  </span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Practice City </label>
                        <Form.Select aria-label="Default select example" name='practiceCity' onChange={handleChange} value={cityId} >
                          <option value="">Select Your City</option>
                          {citiesData?.map((item) => {
                            return (<>
                              <option value={item?.id}>{item.name}</option>
                            </>)
                          })}
                        </Form.Select>
                        <span className="error"> {errorObj?.city}</span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className='areaWraperRegister'>
                        <label htmlFor=""> Area </label>
                        <div className="topArea" onClick={handleAreaClick}>
                          <span className='title'> {areaDisplay} </span>
                          <span className='dropArr'></span>
                        </div>
                        {(showArea && areasAll.length > 0) && (
                          <div className="areaOptions" ref={ref}>
                            <div className="citiesOptionsAll">
                              <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchTerm}
                                onKeyDown={handleKeyPress}
                                placeholder='Search'
                                className='areaSearchInp'
                              />
                              {filteredAreas?.map((item) => (
                                <div key={item.id} className="single customRadioo">
                                  <div className="wrapeInp">
                                    <input
                                      type="radio"
                                      id={item.id}
                                      name='area'
                                      onChange={(e) => handleChangeArea(e, item)}
                                      value={item.id}
                                      checked={area == item.id}
                                    />
                                    <span></span>
                                  </div>
                                  <label htmlFor={item?.id}> {item?.title} </label>
                                </div>
                              ))}
                            </div>
                            <div className="enterAreaSearch">
                              <input type="text" placeholder='Enter area' value={otherArea} name='otherArea' onChange={handleChange} />
                              <button onClick={handleSaveArea} disabled={isSave} > Save </button>
                            </div>
                          </div>
                        )}
                        {showArea && !areasAll?.length &&
                          <div className="areaOptions" ref={ref}>
                            <div className="enterAreaSearch">
                              <input type="text" placeholder='Enter area' value={otherArea} name='otherArea' onChange={handleChange} />
                              <button onClick={handleSaveArea} disabled={isSave}> Save </button>
                            </div>
                          </div>
                        }
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <span htmlFor="" className='labelTextSpan'>  Gender </span>
                        <div className="wraperGenders">
                          <div className="single customRadioo singleGender">
                            <div className="wrapeInp">
                              <input className='customInp' type="radio" name='gender' id="male" onChange={handleChange} value={"male"} />
                              <span></span>
                            </div>
                            <label htmlFor={"male"}>Male</label>
                          </div>
                          <div className="single customRadioo singleGender">
                            <div className="wrapeInp">
                              <input className='customInp' type="radio" name='gender' id="female" onChange={handleChange} value={"female"} />
                              <span></span>
                            </div>
                            <label htmlFor={"female"}>female</label>
                          </div>
                          <div className="single customRadioo singleGender" >
                            <div className="wrapeInp">
                              <input className='customInp' type="radio" name='gender' id="other" onChange={handleChange} value={"other"} />
                              <span></span>
                            </div>
                            <label htmlFor={"other"}>Other</label>
                          </div>
                        </div>
                      </div>
                      <span className="error">  {errorObj?.gender}  </span>

                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Date of Birth </label>
                        <div className="wraper_date">
                          <DatePicker onChange={dateChange} inputReadOnly readonly name='dob' autoFocus={false} />
                        </div>
                      </div>
                      <span className="error">  {errorObj?.dob}  </span>

                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Specialty </label>
                        <Form.Select aria-label="Default select example" name='specialty' onChange={handleChange} value={specialityId}  >
                          <option> Select your specialty </option>
                          {specialityData?.map((item) => {
                            return (<>
                              <option key={item?.id} value={item?.id}> {item.name} </option>
                            </>)
                          })}
                        </Form.Select>
                        <span className="error">  {errorObj?.speciality}  </span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Practice Name </label>
                        <input type="text" placeholder='Enter clinic name' name='practiceName' onKeyDown={handleOnlyText} onChange={handleChange} value={practiceName} maxLength={50} />
                        <span className="error"> {errorObj?.practiceName}</span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Practice Address </label>
                        <input type="text" placeholder='Enter clinic address' name='practiceAddress' onChange={handleChange} value={practiceAddress} maxLength={50} />
                        <span className="error"> {errorObj?.practiceAddress}</span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Practice Phone Number </label>
                        <InputMask mask="___________" replacement={{ _: /\d/ }} placeholder='Enter clinic number' name='practiceNumber' onChange={handleChange} value={practicePhoneNumber} />
                        <span className="error"> {errorObj?.practicePhoneNumber} </span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> CNIC </label>
                        <InputMask mask="_____________" replacement={{ _: /\d/ }} name='cnic' onChange={handleChange} value={cnic} placeholder='Enter your CNIC' />
                        <span className="error"> {errorObj?.cnic} </span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Experience in numbers </label>
                        <InputMask mask="__" replacement={{ _: /\d/ }} placeholder='Enter your experience' name='experience' onChange={handleChange} value={experience} />
                        <span className="error"> {errorObj?.experience} </span>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> PMDC </label>
                        <input type="text" placeholder='Enter your PMDC' inputMode="numeric" onInput={handleOnlyNumber} name='pmdc' onChange={handleChange} value={pmdc} />
                        <span className="error">{errorObj?.pmdc}</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <h4> Setup your password </h4>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> New password </label>
                        {/* <input type="text" /> */}
                        <Input.Password
                          placeholder="Enter your password"
                          name='password'
                          value={password}
                          onChange={handleChange}
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </div>
                      <span className="error"> {errorObj.password} </span>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field">
                        <label htmlFor=""> Confirm your new password  </label>
                        <Input.Password
                          placeholder="Re-type your password "
                          name='cPassword' onChange={handleChange}
                          value={confirmPassword}
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      </div>
                      <span className="error">  {errorObj.confirmPassword}</span>
                    </Col>
                  </Row>
                  <Row>
                    <h4 className='passCri'> Password Criteria </h4>
                    <Col lg={3}>
                      <div className="single_field_checks">
                        <label htmlFor="pass">
                          <input type="checkbox" id='pass' name='pass' checked={passEight} />
                          <span>  </span>
                          Minimum 8 Characters (alphanumeric)
                        </label>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="single_field_checks">
                        <label htmlFor="">
                          <input type="checkbox" id='' name='pass2' readOnly checked={isValid} />
                          <span>  </span>
                          Include at least one uppercase letter (A-Z)
                        </label>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <div className="btnWraper">
                  <button type='submit' > SUBMIT </button>
                </div>
              </form>
            </div>
          </WraperLayout>}
      </>)}
    </>)
}

export default SignupPage;