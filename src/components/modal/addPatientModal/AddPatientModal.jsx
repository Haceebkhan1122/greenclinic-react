import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Form } from "react-bootstrap"
import User from "../../../assets/images/svg/userIcon.svg"
import ImageUploader from "../../../assets/images/png/image_uploader.png"
import ImageEdit from "../../../assets/images/png/image_edit.png"
import Cookies from "js-cookie"
import "image-upload-react/dist/index.css";
import "./addPatientModal.scss"
import API from '../../../services/httpInstance'
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { toast } from 'react-toastify'

const AddPatientModal = ({ patientAddShow, mrNumber, cities, fetchAllPatientsListing, setPatientAddShow }) => {
    const [profileImg, setProfileImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [fullName, setFullName] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [limit, setLimit] = useState(15);
    const [countryCode, setCountryCode] = useState("")
    const [city, setCity] = useState(null);
    const [cityError, setCityError] = useState(null);
    // const [doctor, setDoctor] = useState(null);
    // const [doctors, setDoctors] = useState([]);
    // const [doctorError, setDoctorError] = useState(null);
    const [homeAddress, setHomeAddress] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [ageError, setAgeError] = useState('');
    const clinicAllowMedProtocol = Cookies.get("clinicAllowMedProtocol")

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImg(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // const getAllDoctors = async () => {
    //     try {
    //         const response = await API.get(`/doctor`)
    //         if (response?.status == 200) {
    //             setDoctors(response?.data?.data)
    //             console.log(response?.data?.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     if(patientAddShow){
    //         getAllDoctors()
    //     }
    // }, [patientAddShow])

    const handlePatientAddClose = () => {
        setPatientAddShow(false);
        setPhoneNumber('')
        setFullName('')
        setCity(null)
        setHomeAddress(null)
        setEmail('')
        setProfileImg(null)
        setAge('')
    }

    const handlePatientAddCloseFields = () => {
        setPhoneNumber('')
        setFullName('')
        setCity(null)
        setHomeAddress(null)
        setEmail('')
        setProfileImg(null)
        setAge('')
    }

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value);
        let formattedPhone = value;

        // Format the phone number if it starts with 92 (Pakistan)
        if (value?.startsWith('0')) {
            formattedPhone = import.meta.env.VITE_DEFAULT_COUNTRY_CODE + value.slice(1); // Replace 0 with +92 for Pakistani numbers
        } else if (!value?.startsWith('+')) {
            formattedPhone = '+' + value; // Ensure the value starts with +
        }

        setPhoneNumber(formattedPhone);
    }

    useEffect(() => {
        handlePatientAddCloseFields();
    }, [patientAddShow])

    const handleImageClick = () => {
        document.getElementById('input-file').click();
    };

    const payload = {
        name: fullName,
        phone: phoneNumber,
        // doctor_id: doctor,
        email: email,
        gender: gender,
        address: homeAddress,
        city: city,
        age: age,
        mr_no: mrNumber,
        image: previewImg,
    };

    const addPatient = async () => {
        let hasError = false;
        const form = new FormData();

        // Validations
        if (!fullName) {
            setFullNameError("Full Name is required");
            hasError = true;
        } else {
            setFullNameError("");
        }
        // if (!doctor) {
        //     setDoctorError("Select Doctor is required");
        //     hasError = true;
        // } else {
        //     setDoctorError("");
        // }

        if (!phoneNumber) {
            setPhoneError("Phone Number is required");
            hasError = true;
        } else {
            setPhoneError("");
        }

        if (email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(email)) {
                setEmailError("");
            } else {
                setEmailError("Must follow correct email format.");
                hasError = true;
            }
        }

        if (clinicAllowMedProtocol === "1" && !gender) {
            setGenderError("Gender is required");
            hasError = true;
        } else {
            setGenderError("");
        }

        if (!city) {
            setCityError("The city field must be a number.")
            hasError = true;
        } else {
            setCityError("")
        }

        if (clinicAllowMedProtocol === "1" && !age) {
            setAgeError("Age is required");
            hasError = true;
        } else if (!age) {
            setAgeError("The age field must be a number.");
            hasError = true;
        } else {
            setAgeError("")
        }

        if (hasError) {
            return;
        }

        let derivedCode = '';
        let cleanPhone = phoneNumber?.trim();
        let inputPhone = cleanPhone.startsWith("+") ? cleanPhone : "+" + cleanPhone;

        if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
            inputPhone = import.meta.env.VITE_DEFAULT_COUNTRY_CODE + cleanPhone.slice(1);
        }

        const phoneObj = parsePhoneNumberFromString(inputPhone);

        if (phoneObj?.isValid()) {
            derivedCode = phoneObj.countryCallingCode;
            cleanPhone = phoneObj.nationalNumber;
        } else {
            toast.error("Invalid phone number format", {
                position: "top-center",
                autoClose: 3000,
                theme: "dark"
            });
            return;
        }

        // Append all fields to FormData
        form.append('name', fullName);
        form.append('phone', cleanPhone);
        form.append('country_code', derivedCode);
        form.append('email', email || "");
        // form.append('doctor', doctor || "");
        form.append('gender', gender || "");
        form.append('address', homeAddress || "");
        form.append('city', city || "");
        form.append('age', age);
        form.append('mr_no', mrNumber);
        form.append('file', profileImg);

        try {
            const response = await API.post('add-patient', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response?.status == 200) {
                handlePatientAddClose(false);
                fetchAllPatientsListing();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal className='patientModal' show={patientAddShow} onHide={handlePatientAddClose}>
            <button onClick={handlePatientAddClose} className="close d-md-none d-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Header>
                <Modal.Title>New Patient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col lg={12} className="mb-3">
                            <div className="upload_patient">
                                <div className="img-holder" onClick={handleImageClick}>
                                    {previewImg ? (
                                        <>
                                            <img src={previewImg} alt="Profile" className="img-preview" />
                                            <img src={ImageEdit} className='image_edit' alt="" />
                                        </>
                                    ) : (
                                        <div className='upload_img'>
                                            <span><img src={User} alt="" className='user' /></span>
                                            <img src={ImageUploader} className='image_uploader' alt="" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="input-file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <p>Upload Patient Photo</p>
                            </div>
                        </Col>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>MR No.</Form.Label>
                            <Form.Control readOnly defaultValue={mrNumber} type="text" placeholder="MR 9892" className='readonly' />
                        </Form.Group>
                        {/* <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Doctor  </Form.Label>
                            <Form.Select
                                value={doctor}
                                onChange={(e) => setDoctor(e.target.value)}
                                aria-label="Select City"
                                className="form-control"
                            >
                                <option value="" disabled selected>Select Doctor</option>
                                {doctors?.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {doctorError && (
                                <p style={{ color: 'red' }}>{doctorError}</p>
                            )}
                        </Form.Group> */}
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control maxLength={50} value={fullName} onChange={(e) => {
                                const inputValue = e.target.value;
                                if (/^[a-zA-Z\s]*$/.test(inputValue)) { // Only allows letters & spaces
                                    setFullName(inputValue);
                                }
                            }
                            }
                                type="text" placeholder="Enter full name" />
                            {fullNameError && (
                                <p style={{ color: 'red' }}>{fullNameError}</p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <div className="wraperGenders">
                                <Form.Check
                                    type="radio"
                                    id="male"
                                    label="male"
                                    name="gender"
                                    value="male"
                                    checked={gender == 'male'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    label="female"
                                    value="female"
                                    checked={gender == 'female'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    id="other"
                                    label="other"
                                    name="gender"
                                    value="other"
                                    checked={gender == 'other'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                            </div>
                            {genderError && (
                                <p style={{ color: 'red' }}>{genderError}</p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Age</Form.Label>
                            <Form.Control value={age} onChange={(e) => {
                                const limit = 2;
                                setAge(e.target.value.slice(0, limit))
                            }
                            }
                                type="number" placeholder="Enter age" />
                            {ageError && (
                                <p style={{ color: 'red' }}>{ageError}</p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <PhoneInput
                                style={{
                                    backgroundColor: "#F2F9FF",
                                    border: "1px solid #F2F9FF",
                                    width: "100%",
                                }}
                                value={phoneNumber.replace(/^0/, "92")}
                                country={'pk'}
                                international={false}
                                countryCodeEditable={false}
                                countryCallingCodeEditable={false}
                                onChange={handlePhoneNumber}
                                inputProps={{
                                    name: "phone",
                                    autoComplete: "off",
                                }}
                            />
                            {/* <Form.Control
                                value={phoneNumber}
                                onChange={(e) => {
                                    const limit = 11;
                                    const value = e.target.value.slice(0, limit);
                                    setPhoneNumber(value);
                                    if ((value.length < limit) && (value.length != 0)) {
                                        setPhoneError("Please enter a valid phone number.");
                                    } else {
                                        setPhoneError("");
                                    }
                                }}
                                type="number"
                                placeholder="Enter Phone Number"
                            /> */}
                            {phoneError && (
                                <p style={{ color: 'red' }}>{phoneError}</p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>City  </Form.Label>
                            <Form.Select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                aria-label="Select City"
                                className="form-control"
                            >
                                <option value="" disabled selected>Enter City</option> {/* Placeholder option */}
                                {cities?.map((cityItem) => (
                                    <option key={cityItem.id} value={cityItem.id}>
                                        {cityItem.name}
                                    </option>
                                ))}
                            </Form.Select>
                            {cityError && (
                                <p style={{ color: 'red' }}>{cityError}</p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email Address" />
                            {emailError && (
                                <p style={{ color: 'red' }}>
                                    {emailError}
                                </p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Home Address</Form.Label>
                            <Form.Control type="text" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} placeholder="Enter Home Address" />
                        </Form.Group>
                        <div className='button_wrap'>
                            <button type='button' className='button1' onClick={handlePatientAddClose}>
                                CANCEL
                            </button>
                            <button onClick={addPatient} type='button' className='button2'>
                                Save
                            </button>
                        </div>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddPatientModal