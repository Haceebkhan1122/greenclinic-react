import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Form } from "react-bootstrap"
import User from "../../../assets/images/svg/userIcon.svg"
import ImageUploader from "../../../assets/images/png/image_uploader.png"
import ImageEdit from "../../../assets/images/png/image_edit.png"
import "image-upload-react/dist/index.css";
import 'react-international-phone/style.css';
import "./editPatientModal.scss"
import API from '../../../services/httpInstance'
import PhoneInput from "react-phone-input-2";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const EditPatientModal = ({ patientEditShow, handlePatientEditClose, editPatient, cities, getPatientProfile, fetchAllPatientsListing }) => {
    const [profileImg, setProfileImg] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);
    const [fullName, setFullName] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [limit, setLimit] = useState(15);
    const [countryCode, setCountryCode] = useState("")
    const [city, setCity] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [genderError, setGenderError] = useState('');

    useEffect(() => {
        if (editPatient) {
            setFullName(editPatient?.name || '');
            setGender(editPatient?.gender || '');
            setAge(editPatient?.age || '');
            setPhoneNumber(editPatient?.phone || '');
            setCity(editPatient?.city || '');
            setHomeAddress(editPatient?.address || '');
            setEmail(editPatient?.email || '');
        }
    }, [editPatient]);

    useEffect(() => {
        if (editPatient && cities?.length > 0) {
            const selectedCity = cities.find((cityItem) => cityItem.name === editPatient.city);
            setCity(selectedCity?.id || '');
        }
    }, [editPatient, cities]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImg(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        document.getElementById('input-file').click();
    };

    const EditPatient = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        let hasError = false;

        if (!fullName) {
            setFullNameError("Full Name is required");
            hasError = true;
        } else {
            setFullNameError("");
        }

        if (!phoneNumber) {
            setPhoneError("Phone Number is required");
            hasError = true;
        } else {
            setPhoneError("");
        }

        if (!email) {
            setEmailError("Email is required");
            hasError = true;
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(email)) {
                setEmailError("");
            } else {
                setEmailError("Must follow correct email format.");
                hasError = true;
            }
        }

        if (!gender) {
            setGenderError("Gender is required");
            hasError = true;
        } else {
            setGenderError("");
        }

        if (hasError) {
            return;
        }

        // const payload = {
        //     name: fullName,
        //     phone: phoneNumber,
        //     email: email,
        //     gender: gender,
        //     address: homeAddress,
        //     city: city,
        //     age: age,
        //     mr_no: editPatient?.mr_no,
        //     image: profileImg,
        // }

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

        const formData = new FormData();
        formData.append("name", fullName);
        formData.append("phone", cleanPhone);
        formData.append('country_code', derivedCode);
        formData.append("email", email);
        formData.append("gender", gender);
        formData.append("address", homeAddress);
        formData.append("city", city);
        formData.append("age", age);
        formData.append("mr_no", editPatient?.mr_no || "");
        formData.append("file", profileImg);

        try {
            const response = await API.post(`/update-patient/${editPatient?.id}`, formData);
            if (response?.status == 200) {
                window.location.reload();
                handlePatientEditClose()
                fetchAllPatientsListing()
                getPatientProfile();
            }
        } catch (error) {
            console.log(error)
        }
    }


    console.log("editPatient", editPatient)

    useEffect(() => {
        if (editPatient?.image !== null || editPatient?.image !== "") {
            setPreviewImg(editPatient?.image)
        }
    }, [editPatient])


    return (
        <Modal className='patientModal' show={patientEditShow} onHide={handlePatientEditClose}>
            <button onClick={handlePatientEditClose} className="close d-md-none d-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Header>
                <Modal.Title>Edit Patient</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={EditPatient}>
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
                            <Form.Control value={editPatient?.mr_no} type="text" placeholder="MR 9892" readOnly />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Enter full name" />
                            {fullNameError && (
                                <p style={{ color: 'red' }}>{fullNameError}</p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Gender*</Form.Label>
                            <div className="wraperGenders">
                                <Form.Check
                                    type="radio"
                                    id="male"
                                    label="Male"
                                    name="gender"
                                    value="Male"
                                    checked={gender == 'Male'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    id="female"
                                    name="gender"
                                    label="Female"
                                    value="Female"
                                    checked={gender == 'Female'}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    id="other"
                                    label="Other"
                                    name="gender"
                                    value="Other"
                                    checked={gender == 'Other'}
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
                            } type="text" placeholder="Enter age" />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
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
                                }} type="number" placeholder="Enter Phone Number" /> */}
                            <PhoneInput
                                style={{
                                    backgroundColor: "#F2F9FF",
                                    border: "1px solid #F2F9FF",
                                    width: "100%",
                                }}
                                country={'pk'}
                                international={false}
                                countryCodeEditable={false}
                                countryCallingCodeEditable={false}
                                value={phoneNumber.replace(/^0/, "92")}
                                onChange={(value, metadata) => {
                                    setPhoneNumber(value);
                                    let formattedPhone = value;

                                    // Format the phone number if it starts with 92 (Pakistan)
                                    if (value?.startsWith('0')) {
                                        formattedPhone = import.meta.env.VITE_DEFAULT_COUNTRY_CODE + value.slice(1); // Replace 0 with +92 for Pakistani numbers
                                    } else if (!value?.startsWith('+')) {
                                        formattedPhone = '+' + value; // Ensure the value starts with +
                                    }

                                    setPhoneNumber(formattedPhone);
                                }}
                                onCountryChange={(country) => {
                                    console.log("Selected country:", country);
                                    const dialCode = "+" + country.dialCode;
                                    setCountryCode(dialCode);

                                    const dialCodeLength = dialCode.length;
                                    const localNumberLength = 10;
                                    setLimit(dialCodeLength + localNumberLength);
                                }}
                                inputProps={{
                                    name: "phone",
                                    autoComplete: "off",
                                }}
                            />
                            {phoneError && (
                                <p style={{ color: 'red' }}>{phoneError}</p>
                            )}
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                aria-label="Select City"
                                className='form-control'
                            >
                                <option value="" disabled>Select a city</option>
                                {cities?.map((cityItem) => (
                                    <option key={cityItem?.id} value={String(cityItem?.id)}>
                                        {cityItem?.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Home Address</Form.Label>
                            <Form.Control value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} type="text" placeholder="Enter Home Address" />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Enter email Address" />
                            {emailError && (
                                <p style={{ color: 'red' }}>
                                    {emailError}
                                </p>
                            )}
                        </Form.Group>
                        <div className='button_wrap'>
                            <button type='submit' className='button2'>
                                Update
                            </button>
                        </div>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default EditPatientModal