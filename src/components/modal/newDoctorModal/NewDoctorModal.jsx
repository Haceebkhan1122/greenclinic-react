import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Form } from 'react-bootstrap';
import { Checkbox, Divider, Input } from 'antd';
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
import "./newDoctorModal.scss"
import { useSelector } from 'react-redux';

const NewDoctorModal = ({ handleDoctorClose,isLoading, setIsLoading,setIndicationMessage, indicationMessage, doctorShow, currentStep, clinicId, getDoctorsByClinic }) => {
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
    const [isValid, setIsValid] = useState(false);
    const [specialityData, setSpecialityData] = useState([]);
    const [errorObj, setErrorObj] = useState({});
    let clinicDetails = useSelector((state) => state.clinic.clinicDetails);

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

    const payloadAdd = {
        name : nameField,
        email,
        phone : phoneNumber,
        gender,
        specialty_id : speciality,
        password,
        conf_password : confirmPassword,
        clinic_id : clinicDetails?.id,
        status:1,
    }

    const handleSave = async () => {
        let newErrors = {};
        if (!nameField) newErrors.nameField = "Name is required";
        if (phoneNumber == "") newErrors.phoneNumber = "Phone number is required" 
        if (phoneNumber !== "" && phoneNumber?.length !== 11) newErrors.phoneNumber = "Please enter a valid mobile number."
        if (phoneNumber !== "" && !phoneNumber?.startsWith("03")) newErrors.phoneNumber = "Phone number must be starts with 03."
        if (!email) newErrors.email = "email is required";
        if (!gender) newErrors.gender = "gender is required";
        if (!speciality) newErrors.speciality = "speciality is required";
        if (!password) newErrors.password = "password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";

        if (Object.keys(newErrors).length > 0) {
            setErrorObj(newErrors);
            return;
        }
        if(password !== confirmPassword) {
            newErrors.confirmPassword == "Password is not same";
            return; 
        }

        try {
            setIsLoading(true);
            const response = await API.post("/add-new-doctor", payloadAdd)
            if(response?.status == 200) {
                setIsLoading(false)
                handleDoctorClose();
                getDoctorsByClinic();
                setIndicationMessage(response?.data?.message);
                setNameField("")
                setPhoneNumber("")
                setEmail("")
                setGender("")
                setSpeciality(null)
                setPassword("")
                setIsValid(false);
                setConfirmPassword("")
                setPassEight(null);
                setErrorObj(null)
                
            }
            else {
                setIsLoading(false)
                setIndicationMessage(response?.data?.message);
            }
        } catch (error) {
            console.log("error", error)
        }
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
        const { name, value, checked } = e.target;
        if (name == "name") {
            errorObj.nameField = " ";
            setNameField(value);
        }
        if (name == "phone") {
            errorObj.phone = " "
            let val = value.slice(0, 11);
            if (val !== "" && !val.startsWith(`03`)) {
                errorObj.phone = "Number must be starts with 03"
            }
            if (val !== "" && !val.startsWith(0) || !val.startsWith("0")) {
                val = ""
                errorObj.phone = "Number must be starts with 0"
            }
            setPhoneNumber(val);
        }
        if (name == "email") {
            errorObj.email = " ";
            setEmail(value);

        }
        if (name == "gender") {
            errorObj.gender = " ";
            setGender(value);
        }
        if (name == "speciality") {
            errorObj.speciality = " ";
            let id = specialityData.filter((item) => {
                let idFind = item.id == value;
                return idFind;
            })
            setSpecialityId(id[0]?.id);
            setSpeciality(value);
            errorObj.speciality = "";
        }
        if (name == "password") {
            errorObj.password = " ";
            setIsValid(/[A-Z]/.test(value))
            setPassword(value);
            if (value.length >= 8) {
                setPassEight(true)
            }
            else {
                setPassEight(false)
            }
        }
        if (name == "cPassword") {
            errorObj.confirmPassword = " ";
            setIsValid(/[A-Z]/.test(value))
            setConfirmPassword(value);
            if (value.length >= 8) {
                setPassEight(true)
            }
            else {
                setPassEight(false)
            }
        }
    }

    const handleConfirmPassword = (e) => {
        const { value } = e.target;
        if (password !== "" && password !== value) {
            errorObj.confirmPassword = "password not same";
            return;
        }
        else {
            errorObj.confirmPassword = " ";
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
                    <div>
                        <h2><img src={ArrowBack} alt="" onClick={handleDoctorClose} /> New Doctor</h2>
                        <Form autoComplete="off" className="doctor_form bg_from">
                            <Row>
                                <Col lg={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" placeholder='Enter full name' name='name' onChange={handleChangeForm} value={nameField} />
                                    {errorObj?.nameField && <p className="error">{errorObj?.nameField}</p>}
                                    </Form.Group>
                                </Col>
                                <Col lg={4} className="mb-3">
                                    <Form.Group>
                                        <div className="single_field">
                                            <label htmlFor=""> Mobile Number* </label>
                                            <InputMask mask="___________" replacement={{ _: /\d/ }} name='phone' onChange={handleChangeForm} value={phoneNumber} placeholder='Enter mobile number' />
                                        </div>
                                    {errorObj?.phoneNumber && <p className="error">{errorObj?.phoneNumber}</p>}
                                    </Form.Group>
                                </Col>
                                <Col lg={4} className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" placeholder='Enter email address' name='email' onChange={handleChangeForm} value={email} />
                                    {errorObj?.email && <p className="error">{errorObj?.email}</p>}
                                    </Form.Group>
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
                                    {errorObj?.gender && <p className="error">{errorObj?.gender}</p>}
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
                                    {errorObj?.speciality && <p className="error">{errorObj?.speciality}</p>}
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
                                    {errorObj?.password && <p className="error">{errorObj?.password}</p>}
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
                                    {errorObj?.confirmPassword && <p className="error">{errorObj?.confirmPassword}</p>}
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
                                            <input type="checkbox" id='' name='pass2' readOnly checked={isValid} />
                                            <span>  </span>
                                            Include at least one uppercase letter (A-Z)
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                        <Divider />
                        <div className="form_btn1">
                            <button className="button1" onClick={handleDoctorClose}>Cancel</button>
                            <button onClick={handleSave} type="submit" className="button2 saveBtn">Save</button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default NewDoctorModal;