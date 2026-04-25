import React, { useState } from 'react'
import { Modal, Row, Col, Form } from "react-bootstrap"
import User from "../../../assets/images/svg/userIcon.svg"
import ImageUploader from "../../../assets/images/png/image_uploader.png"
import ImageEdit from "../../../assets/images/png/image_edit.png"
import "image-upload-react/dist/index.css";
import "./addPrescriptionsModal.scss"
import API from '../../../services/httpInstance'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';

const AddPrescriptionsModal = ({ handlePrescriptionsAddClose, prescriptionsAddShow, mrNumber, prescriptionList, cities }) => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [profileImg, setProfileImg] = useState(null);
    const [fullName, setFullName] = useState('')
    const [fullNameError, setFullNameError] = useState('');
    const [gender, setGender] = useState('male')
    const [age, setAge] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [phoneError, setPhoneError] = useState('');
    const [homeAddress, setHomeAddress] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [city, setCity] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImg(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        document.getElementById('input-file').click();
    };

    const addPrescriptions = async () => {
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

        const payload = {
            name: fullName,
            phone: phoneNumber,
            image: profileImg,
            email: email,
            address: homeAddress,
            mr_no: mrNumber,
            city: city,
            age: age
        }
        try {
            const response = await API.post('add-patient', payload)
            if (response.status == 200) {
                prescriptionList()
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                handlePrescriptionsAddClose(false)
            }
        } catch (error) {
            console.log(error, "error")
        }
    }
    return (
        <Modal className='prescriptionsModal' show={prescriptionsAddShow} onHide={handlePrescriptionsAddClose}>
            <Modal.Header>
                <Modal.Title>New Prescriptions</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col lg={12} className="mb-3">
                            <div className="upload_prescriptions">
                                <div className="img-holder" onClick={handleImageClick}>
                                    {profileImg ? (
                                        <>
                                            <img src={profileImg} alt="Profile" className="img-preview" />
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
                            <Form.Control readOnly defaultValue={mrNumber} type="text" />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" />
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
                            <Form.Control value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Enter age" />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control value={phoneNumber} onChange={(e) => {
                                const limit = 11;
                                const value = e.target.value.slice(0, limit);
                                setPhoneNumber(value);
                                if ((value.length < limit) && (value.length != 0)) {
                                    setPhoneError("Please enter a valid phone number.");
                                } else {
                                    setPhoneError("");
                                }
                            }} type="text" placeholder="Enter Phone Number" />
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
                                className="form-control"
                            >
                                <option value="" disabled>Select a city</option>
                                {cities?.map((cityItem) => (
                                    <option key={cityItem.id} value={cityItem.id}>
                                        {cityItem.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Home Address</Form.Label>
                            <Form.Control value={homeAddress} type="text" onChange={(e) => setHomeAddress(e.target.value)} placeholder="Enter Home Address" />
                        </Form.Group>
                        <Form.Group as={Col} md="6" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control value={email} type="text" onChange={(e) => setEmail(e.target.value)} placeholder="Enter email Address" />
                            {emailError && (
                                <p style={{ color: 'red' }}>{emailError}</p>
                            )}
                        </Form.Group>
                        <div className='button_wrap'>
                            <button type='button' className='button1' onClick={handlePrescriptionsAddClose}>
                                Close
                            </button>
                            <button onClick={addPrescriptions} type='button' className='button2'>
                                Save
                            </button>
                        </div>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default AddPrescriptionsModal