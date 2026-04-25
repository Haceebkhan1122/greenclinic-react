import React, { useEffect, useState } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import API from '../../../services/httpInstance/index';
import "./clinicModal.scss"
import { toast } from 'react-toastify';
import Loader from '../../loader/Loader';

const ClinicModal = ({ handleClinicClose, indicationMessage, setIndicationMessage, clinicShow, getClinics }) => {
    const [clinicName, setClinicName] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [area, setArea] = useState("") 
    const [dateTo, setDateTo] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [citiesAll, setCitiesAll] = useState([])
    const [areasAll, setAreasAll] = useState([])
    const [errorObj, setErrorObj] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);

    const handleChange = async (e) => {
        const { value, name, checked } = e.target;
        if (name == "clinicName") {
            errorObj.clinicName = " "
            setClinicName(value)
        }
        if (name == "city") {
            errorObj.city = " "
            setCity(value)
            setIsLoading(true)
            const response = await API.get(`/areas-list/${value}`);
            if (response?.status == 200) {
                setAreasAll(response?.data?.data);
                setIsLoading(false)
            }
            else {
                setIsLoading(false);
                toast.error(response?.data?.message)
            }
        }
        if (name == "area") {
            errorObj.area = " "

            setArea(value)
        }

        if (name == "address") {
            errorObj.address = " "

            setAddress(value)
        }

        if (name == "clinicTimingTo") {
            errorObj.dateTo = " "

            setDateTo(value)
        }

        if (name == "clinicTimingsFrom") {
            errorObj.dateFrom = " "
            setDateFrom(value)
        }

        if (name == "status") {
            if (checked) {
                setStatus(1)
            }
            else {
                setStatus(0)
            }
        }
    }

    useEffect(() => {
        getCities();
    }, [])

    const getCities = async () => {
        try {
            setIsLoading(true)
            const response = await API.get("/cities-list");
            if (response?.status == 200) {
                setCitiesAll(response?.data?.data)
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false);
            console.log("error")
        }
    }

    useEffect(() => {
        if (clinicName && area && address && dateTo && dateFrom && city) {
            setIsDisabled(false); 
        } else {
            setIsDisabled(true);   
        }
    }, [clinicName, area, address, dateTo, dateFrom, city]);

    const handleSave = async () => {
        let newErrors = {};
        if (!clinicName) newErrors.clinicName = "Clinic Name is required";
        if (!area) newErrors.area = "Area is required";
        if (!address) newErrors.address = "Address is required";
        if (!dateTo) newErrors.dateTo = "End Date is required";
        if (!dateFrom) newErrors.dateFrom = "Start Date is required";
        if (!city) newErrors.city = "City is required";

        if (Object.keys(newErrors).length > 0) {
            setErrorObj(newErrors);
            return;
        }
        try {
            setIsDisabled(true)
            if (clinicName !== "" && area  !== "" && address  !== "" && dateTo !== ""  && dateFrom  !== "" && city !== "" ) {
                setIsDisabled(false);
                setIsLoading(false);
                const response = await API.post(`/add-new-clinic`, {
                    clinic_name: clinicName,
                    area_id: area,
                    address: address,
                    clinic_start_time: dateTo,
                    clinic_end_time: dateFrom,
                    city_id: city,
                    status,
                })
                if (response?.status == 200) {
                    setIsDisabled(true);
                    getClinics();
                    handleClinicClose();
                    setIndicationMessage(response?.data?.message)
                    setIsLoading(false)
                }
                else {
                    setIsDisabled(false);
                    setIndicationMessage(response?.data?.message)
                    setIsLoading(false)
                }
            } else {
                setIndicationMessage("Please fill all the required fields")
                setIsLoading(false)
                setIsDisabled(true);
            }
        } catch (error) {
            setIsDisabled(false);
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setClinicName("");
    }, [])

    const closeAllFields = () => {
        setClinicName("")
        setCity("")
        setArea("")
        setAddress("")
    }

    useEffect(() => {
        closeAllFields();   
    }, [clinicShow])

    return (
        <>
            <Modal className="clinic" show={clinicShow} onHide={handleClinicClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Clinic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Clinic Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter clinic name" name='clinicName' value={clinicName} onChange={handleChange} maxLength={100} />
                                {errorObj.clinicName && <p className="error">{errorObj.clinicName}</p>}
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>City</Form.Label>
                                <div className='wrrrr'>
                                    <Form.Select aria-label="Select city" className="custom-select-dropdown" name='city' value={city} onChange={handleChange} >
                                        <option value="" disabled hidden >Select City</option>
                                        {citiesAll?.map((item, idx) => {
                                            return (<>
                                                <option key={idx} value={item?.id}>{item?.name}</option>
                                            </>)
                                        })}
                                    </Form.Select>
                                </div>
                                {errorObj.city && <p className="error">{errorObj.city}</p>}
                            </Form.Group>
                            <Form.Group as={Col} md="12" className="mb-3" >
                                <Form.Label>Area</Form.Label>
                                <Form.Select aria-label="Select Area" name='area' onChange={handleChange} value={area}>
                                    <option> Select Area </option>
                                    {areasAll?.map((item, idx) => {
                                        return (<>
                                            <option key={idx} value={item?.id}> {item?.title} </option>
                                        </>)
                                    })}
                                </Form.Select>
                                {errorObj.area && <p className="error">{errorObj.area}</p>}

                            </Form.Group>
                            <Form.Group as={Col} md="12" className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder="Enter address" value={address} onChange={handleChange} name="address" maxLength={300} />
                                {errorObj.address && <p className="error">{errorObj.address}</p>}

                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>Clinic Timings (To)</Form.Label>
                                <Form.Select aria-label="clinic timing to" name="clinicTimingTo" onChange={handleChange} value={dateTo} >
                                <option value="">Select time</option>
                                    <option value="01:00 pm">01:00 pm</option>
                                    <option value="02:00 pm">02:00 pm</option>
                                    <option value="03:00 pm">03:00 pm</option>
                                    <option value="04:00 pm">04:00 pm</option>
                                    <option value="05:00 pm">05:00 pm</option>
                                    <option value="06:00 pm">06:00 pm</option>
                                    <option value="07:00 pm">07:00 pm</option>
                                    <option value="08:00 pm">08:00 pm</option>
                                    <option value="09:00 pm">09:00 pm</option>
                                    <option value="10:00 pm">10:00 pm</option>
                                    <option value="11:00 pm">11:00 pm</option>
                                    <option value="12:00 pm">12:00 pm</option>
                                    <option value="01:00 am">01:00 am</option>
                                    <option value="02:00 am">02:00 am</option>
                                    <option value="03:00 am">03:00 am</option>
                                    <option value="04:00 am">04:00 am</option>
                                    <option value="05:00 am">05:00 am</option>
                                    <option value="06:00 am">06:00 am</option>
                                    <option value="07:00 am">07:00 am</option>
                                    <option value="08:00 am">08:00 am</option>
                                    <option value="09:00 am">09:00 am</option>
                                    <option value="10:00 am">10:00 am</option>
                                    <option value="11:00 am">11:00 am</option>
                                    <option value="12:00 am">12:00 am</option>
                                </Form.Select>
                                {errorObj.dateTo && <p className="error">{errorObj.dateTo}</p>}
                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <Form.Label>From</Form.Label>
                                <Form.Select aria-label="clinic timing from" name="clinicTimingsFrom" onChange={handleChange} value={dateFrom} >
                                    <option value="">Select time</option>
                                    <option value="01:00 pm">01:00 pm</option>
                                    <option value="02:00 pm">02:00 pm</option>
                                    <option value="03:00 pm">03:00 pm</option>
                                    <option value="04:00 pm">04:00 pm</option>
                                    <option value="05:00 pm">05:00 pm</option>
                                    <option value="06:00 pm">06:00 pm</option>
                                    <option value="07:00 pm">07:00 pm</option>
                                    <option value="08:00 pm">08:00 pm</option>
                                    <option value="09:00 pm">09:00 pm</option>
                                    <option value="10:00 pm">10:00 pm</option>
                                    <option value="11:00 pm">11:00 pm</option>
                                    <option value="12:00 pm">12:00 pm</option>
                                    <option value="01:00 am">01:00 am</option>
                                    <option value="02:00 am">02:00 am</option>
                                    <option value="03:00 am">03:00 am</option>
                                    <option value="04:00 am">04:00 am</option>
                                    <option value="05:00 am">05:00 am</option>
                                    <option value="06:00 am">06:00 am</option>
                                    <option value="07:00 am">07:00 am</option>
                                    <option value="08:00 am">08:00 am</option>
                                    <option value="09:00 am">09:00 am</option>
                                    <option value="10:00 am">10:00 am</option>
                                    <option value="11:00 am">11:00 am</option>
                                    <option value="12:00 am">12:00 am</option>
                                </Form.Select>
                                {errorObj.dateFrom && <p className="error">{errorObj.dateFrom}</p>}

                            </Form.Group>
                            <Form.Group as={Col} md="6" className="mb-3">
                                <div className="switched">
                                    <label htmlFor=""> Status </label>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        name="status"
                                        onChange={handleChange}
                                    />
                                </div>
                            </Form.Group>
                            <Col md={12} className='form_btn'>
                                <Button className="button1" onClick={handleClinicClose}>
                                    Cancel
                                </Button>
                                <Button className="button2" onClick={handleSave} disabled={isDisabled} >
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ClinicModal