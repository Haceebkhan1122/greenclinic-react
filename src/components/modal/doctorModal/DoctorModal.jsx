import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Form } from 'react-bootstrap';
import { Checkbox, Input } from 'antd';
import "./doctorModal.scss"
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { EyeInvisibleOutlined, EyeTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import AddButton from "../../../assets/images/svg/add_button.svg"
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import API from '../../../services/httpInstance';
import { InputMask } from '@react-input/mask';
import { specialityApi } from '../../../services/endpoints';
import { toast } from 'react-toastify';

const DoctorModal = ({ handleDoctorClose, doctorShow, currentStep, setCurrentStep, clinicId }) => {
    const [mobilevalue, setMobileValue] = useState('');
    const [nameField, setNameField] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [email, setEmail] = useState("")
    const [gender, setGender] = useState("male")
    const [speciality, setSpeciality] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [capitalizePassword, setCapitalizePassword] = useState(false)
    const [passEight, setPassEight] = useState(false)
    const [specialityId, setSpecialityId] = useState("")
    const [fees, setFees] = useState("")
    const [duration, setDuration] = useState("")
    const [priceofDoctor, setPriceofDoctor] = useState("")
    const [clinicShare, setClinicShare] = useState("")
    const [platformFee, setPlatformFee] = useState("")
    const [specialityData, setSpecialityData] = useState([]);
    const [errorObjValidation, setErrorObjValidation] = useState({});

    const daysInPerson = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const [daysOfWeek, setDayOfWeek] = useState([...Array(7)].map((_, idx) => ({
        day: daysInPerson[idx],
        timing: [{ start_time: '', end_time: '' }],
        isVisible: false,
    })));

    const handleSwitchToggle = (index) => {
        const newDaysOfWeek = [...daysOfWeek];
        newDaysOfWeek[index].isVisible = !newDaysOfWeek[index].isVisible;
        setDayOfWeek(newDaysOfWeek);
    };

    useEffect(() => {
        specialitiesFn();
    }, [])

    const specialitiesFn = async () => {
        let response = await API.get(`${specialityApi}`)
        if (response?.status == 200) {
            let data = response?.data?.data;
            return setSpecialityData(data);
        }
    }

    const handleAddTiming = (index) => {
        const newDayOfWeek = [...daysOfWeek];
        newDayOfWeek[index].timing.push({ start_time: '', end_time: '' })
        setDayOfWeek(newDayOfWeek)
    }

    const handleTimeChange = (dayIndex, timingIndex, type, value) => {
        const newDayOfWeek = [...daysOfWeek];
        newDayOfWeek[dayIndex].timing[timingIndex][type] = value;
        setDayOfWeek(newDayOfWeek)
    }

    const nextStep = () => {
        let errorr = {};

        if (nameField == "") {
            errorr.name = "Doctor name is required."
        }

        if (phoneNumber == "") {
            errorr.phone = "Mobile number is required."
        }

        if (email == "") {
            errorr.email = "Email is required."
        }


        if (gender == "") {
            errorr.gender = "Gender is required."
        }

        if (speciality == "") {
            errorr.speciality = "Please select a specialty."
        }

        if (password == "") {
            errorr.password = "password is required."
        }

        if (confirmPassword == "") {
            errorr.cPassword = "Confirm password is required."
        }


        if (nameField && phoneNumber && email && gender && speciality) {
            setCurrentStep(currentStep + 1);
        }

        setErrorObjValidation(errorr);
    };


    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleChange = (value) => {
        if (value) {
            const cleanedValue = value.replace(/\D/g, '');
            if (cleanedValue.length <= 11) {
                setMobileValue(value);
            }
        } else {
            setMobileValue('')
        }
    };



    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        if (name == "name") {
            setNameField(value);
            errorObjValidation.name = "";
        }
        if (name == "phone") {
            let val = value;
            if (!val.startsWith("+923")) {
                val = ""
                errorObjValidation.phone = "Number must be starts with 3"
            }
            setPhoneNumber(val);
            errorObjValidation.phone = "";
        }
        if (name == "email") {
            setEmail(value);
            errorObjValidation.email = "";

        }
        if (name == "gender") {
            setGender(value);
        }
        if (name == "speciality") {
            let id = specialityData.filter((item) => {
                let idFind = item.id == value;
                return idFind;
            })
            setSpecialityId(id[0]?.id);
            setSpeciality(value);
            errorObjValidation.speciality = "";
        }
        if (name == "password") {
            setPassword(value);
            if (value.length >= 8) {
                setPassEight(true)
            }
            else {
                setPassEight(false)
            }
        }
        if (name == "cPassword") {
            setConfirmPassword(value);
            errorObjValidation.cPassword = "";
        }

        if (name == "fees") {
            setFees(value);
        }

        if (name == "duration") {
            setDuration(value);
        }

        if (name == "priceofDoctor") {
            setPriceofDoctor(value);
        }


        if (name == "clinic_share") {
            setClinicShare(value);
        }

        if (name == "platformFee") {
            setPlatformFee(value);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let phoneeVa = phoneNumber;
        let splitted = phoneeVa.split("-");
        let joined = splitted.join("")
        let phoneVeriii = joined.split("+92");
        let phoneeTa = phoneVeriii.join("")
        let obj = {};
        obj.name = nameField;
        obj.phone = `0${phoneeTa}`;
        obj.password = password;
        obj.conf_password = confirmPassword;
        obj.gender = gender;
        obj.specialty_id = specialityId;
        obj.consultation_fee = fees;
        obj.consultation_duration = duration;
        obj.doctor_share = priceofDoctor;
        obj.clinic_share = clinicShare;
        obj.doctor_timings = daysOfWeek;
        obj.clinic_id = clinicId;
        obj.platform_fee = platformFee;


        let response = await API.post(`/add-new-doctor`, obj);
    }

    const handleConfirmPassword = (e) => {
        const { value } = e.target;
        if (password !== "" && password === value) {
        }
        else {
        }
    }

    return (
        <Modal className="step_form" show={doctorShow} onHide={handleDoctorClose}>
            <button onClick={handleDoctorClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <div>
                    {currentStep === 1 && (
                        <div>
                            <h2><img src={ArrowBack} alt="" onClick={handleDoctorClose} /> New Doctor</h2>
                            <Form autoComplete="off" className="doctor_form bg_from">
                                <Row>
                                    <Col lg={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder='Enter full name' name='name' onChange={handleChangeForm} value={nameField} />
                                        </Form.Group>
                                        <p className='errorTxt'> {errorObjValidation?.name} </p>
                                    </Col>
                                    <Col lg={4} className="mb-3">
                                        <Form.Group>
                                            <div className="single_field">
                                                <label htmlFor=""> Mobile Number* </label>
                                                {/* <input type="text" placeholder='+92 334202020' name='phone' onChange={handleChange} value={phoneNumber} /> */}
                                                <InputMask mask="+92___-_______" replacement={{ _: /\d/ }} name='phone' onChange={handleChangeForm} value={phoneNumber} placeholder='+92334202020' />
                                                <span className="error">  </span>
                                            </div>
                                            <p className='errorTxt'> {errorObjValidation?.phone} </p>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder='Enter email address' name='email' onChange={handleChangeForm} value={email} />
                                        </Form.Group>
                                        <p className='errorTxt'> {errorObjValidation?.email} </p>
                                    </Col>
                                    <Col lg={4} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Gender</Form.Label>
                                            <RadioGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name='gender'
                                                onChange={handleChangeForm}
                                                value={gender}
                                                defaultChecked={gender}
                                            >
                                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                                            </RadioGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4} className="mb-3">
                                        <Form.Group >
                                            <Form.Label>Speciality</Form.Label>
                                            <Form.Select name='speciality' onChange={handleChangeForm} value={speciality} >
                                                <option> Select your specialty </option>
                                                {specialityData?.map((item) => {
                                                    return (<>
                                                        <option key={item?.id} value={item?.id}> {item.name} </option>
                                                    </>)
                                                })}
                                            </Form.Select>
                                        </Form.Group>
                                        <p className='errorTxt'> {errorObjValidation?.speciality} </p>

                                    </Col>
                                </Row>
                                <Row>
                                    <h4> Setup your password </h4>
                                    <Col lg={3} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>New password</Form.Label>
                                            <Input.Password
                                                placeholder="Enter your password"
                                                name='password'
                                                value={password}
                                                onChange={handleChangeForm}
                                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                            />
                                        </Form.Group>
                                        <p className='errorTxt'> {errorObjValidation?.password} </p>

                                    </Col>
                                    <Col lg={3} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Confirm your new password</Form.Label>
                                            <Input.Password
                                                placeholder="Re-type your password"
                                                name='cPassword'
                                                value={confirmPassword}
                                                onChange={handleChangeForm}
                                                onBlur={handleConfirmPassword}
                                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                            />
                                        </Form.Group>
                                        <p className='errorTxt'> {errorObjValidation?.cPassword} </p>

                                    </Col>
                                </Row>
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
                                                <input type="checkbox" id='' name='pass2' readOnly />
                                                <span>  </span>
                                                Include at least one uppercase letter (A-Z)
                                            </label>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                            <div className="box-fixed">
                                <Row>
                                    <Col lg={12}>
                                        <div className="form_btn1">
                                            <button className="button1" onClick={handleDoctorClose}>Cancel</button>
                                            <button onClick={nextStep} type="submit" className="button2">Next</button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <h2><button className='w-auto p-0 m-0 h-auto' onClick={prevStep}><img src={ArrowBack} alt="" /></button>In-person Consultation</h2>
                            <Row className='bg_from'>
                                <Col lg={8} className='px-md-3 px-0'>
                                    <h3>Fees</h3>
                                    <Form>
                                        <Row>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Consultation Fees*</Form.Label>
                                                    <Form.Control type="text" placeholder='Enter consultation fees' name='fees' onChange={handleChangeForm} value={fees} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">

                                                <Form.Group>
                                                    <Form.Label>Consultation Duration*</Form.Label>
                                                    <select name='duration' onChange={handleChangeForm} value={duration}>
                                                        <option>Select duration</option>
                                                        <option value={1}>1</option>
                                                        <option value={15}>15</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Share Price of Doctor (%)*</Form.Label>
                                                    <Form.Control type="text" placeholder='Enter share price in percentage' name='priceofDoctor' onChange={handleChangeForm} value={priceofDoctor} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Clinic Share (%)</Form.Label>
                                                    <Form.Control type="text" placeholder='Auto calculate based on doctor share' name='clinic_share' onChange={handleChangeForm} value={clinicShare} />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Platform fee (%)</Form.Label>
                                                    <Form.Control type="text" placeholder='20%' name='platformFee' onChange={handleChangeForm} value={platformFee} />
                                                </Form.Group>
                                                <p className='platform_fee'><InfoCircleOutlined /> Platform fee is only applicable for Meri sehat appointments</p>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col lg={4} className='scheduleInPerson'>
                                    <h3>Schedule</h3>
                                    <ul>
                                        {daysOfWeek?.map((days, index) => (
                                            <li key={index}>
                                                <div className='days'>
                                                    <span>{days.day}</span>
                                                    <Form.Check
                                                        type="switch"
                                                        id={`custom-switch-${index}`}
                                                        checked={days.isVisible || false}
                                                        onChange={() => handleSwitchToggle(index)}
                                                    />
                                                </div>
                                                {days.isVisible && (
                                                    <div className='timing'>
                                                        {days.timing.map((time, timingIndex) => (
                                                            <div key={timingIndex} className="timing-inputs">
                                                                <div>
                                                                    <label>Start Time</label>
                                                                    <input
                                                                        type="time"
                                                                        value={time.start_time}
                                                                        onChange={(e) =>
                                                                            handleTimeChange(index, timingIndex, 'start_time', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>End Time</label>
                                                                    <input
                                                                        type="time"
                                                                        value={time.end_time}
                                                                        onChange={(e) =>
                                                                            handleTimeChange(index, timingIndex, 'end_time', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => handleAddTiming(index)}><img src={AddButton} alt="add button" /></button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col lg={12} className='form_btn2'>
                                    <button className='button1 ms-0 d-none d-lg-block' onClick={prevStep}>Back</button>
                                    <div>
                                        <button className='button1' onClick={handleSubmit}>Save</button>
                                        <button className='button2' onClick={nextStep}>Next to Video Slots</button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h2><button className='w-auto p-0 m-0 h-auto' onClick={prevStep}><img src={ArrowBack} alt="" /></button>Video Consultation</h2>
                            <Row className='bg_from'>
                                <Col lg={8} className='px-md-3 px-0'>
                                    <h3>Fees</h3>
                                    <Form>
                                        <Row>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Consultation Fees*</Form.Label>
                                                    <Form.Control type="text" placeholder='Enter consultation fees' />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Consultation Duration*</Form.Label>
                                                    <select>
                                                        <option>Select duration</option>
                                                    </select>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Share Price of Doctor (%)*</Form.Label>
                                                    <Form.Control type="text" placeholder='Enter share price in percentage' />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Clinic Share (%)</Form.Label>
                                                    <Form.Control type="text" placeholder='Auto calculate based on doctor share' />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} className="mb-3">
                                                <Form.Group>
                                                    <Form.Label>Platform fee (%)</Form.Label>
                                                    <Form.Control type="text" placeholder='20%' />
                                                </Form.Group>
                                                <p className='platform_fee'><InfoCircleOutlined /> Platform fee is only applicable for Meri sehat appointments</p>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col lg={4} className='scheduleInVideo'>
                                    <h3>Schedule</h3>
                                    <ul>
                                        {daysOfWeek?.map((days, index) => (
                                            <li key={index}>
                                                <div className='days'>
                                                    <span>{days.day}</span>
                                                    <Form.Check
                                                        type="switch"
                                                        id={`custom-switch-${index}`}
                                                        checked={days.isVisible || false}
                                                        onChange={() => handleSwitchToggle(index)}
                                                    />
                                                </div>
                                                {days.isVisible && (
                                                    <div className='timing'>
                                                        {days.timing.map((time, timingIndex) => (
                                                            <div key={timingIndex} className="timing-inputs">
                                                                <div>
                                                                    <label>Start Time</label>
                                                                    <input
                                                                        type="time"
                                                                        value={time.start_time}
                                                                        onChange={(e) =>
                                                                            handleTimeChange(index, timingIndex, 'start_time', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label>End Time</label>
                                                                    <input
                                                                        type="time"
                                                                        value={time.end_time}
                                                                        onChange={(e) =>
                                                                            handleTimeChange(index, timingIndex, 'end_time', e.target.value)
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => handleAddTiming(index)}><img src={AddButton} alt="add button" /></button>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                                <Col lg={12} className='form_btn2'>
                                    <button className='button1 ms-0 d-none d-lg-block' onClick={prevStep}>Back</button>
                                    <div>
                                        <button className='button1' onClick={handleDoctorClose}>Cancel</button>
                                        <button className='button2' onClick={() => alert('Form submitted!')}>Save & Update</button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DoctorModal;