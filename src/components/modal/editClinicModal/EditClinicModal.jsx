import React, { useEffect, useState } from 'react'
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import API from '../../../services/httpInstance/index';
import { toast } from 'react-toastify';
import "./editClinicModal.scss"
import Loader from '../../loader/Loader';

const EditClinicModal = ({ handleEditClinicClose, EditClinicShow, getClinics, singleEditItem }) => {
    const [clinicName, setClinicName] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [area, setArea] = useState(null)
    const [dateTo, setDateTo] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [citiesAll, setCitiesAll] = useState([])
    const [areasAll, setAreasAll] = useState([])
    const [editItem, setEditItem] = useState({})
    const [clinicId, setClinicId] = useState(null)
    const [indicationMessage, setIndicationMessage] = useState("");
    const [errorObj, setErrorObj] = useState({});

    useEffect(() => {
        getClinicById()
    }, [EditClinicShow])


    useEffect(() => {
        if (editItem) {
            setClinicName(editItem?.name)
            setAddress(editItem?.address)
            setCity(editItem?.city_id)
            setArea(editItem?.area?.id)
            setDateTo(editItem?.clinic_start_time)
            setDateFrom(editItem?.clinic_end_time)
            setStatus(editItem?.status)
            setClinicId(editItem?.id)
        }
    }, [EditClinicShow, editItem])


    const getAreas = async (idCity) => {
        const response = await API.get(`/areas-list/${idCity}`);
        if (response?.status == 200) {
            setAreasAll(response?.data?.data);
            setIsLoading(false)
        }
        else {
            setIsLoading(false);
            toast.error(response?.data?.message)
        }
    }

    useEffect(() => {
        if (city !== "" && city !== null && city !== undefined) {
            getAreas(city)
        }
    }, [city])


    const handleChange = async (e) => {
        const { value, name, checked } = e.target;

        if (name == "clinicName") {
            setClinicName(value)
        }
        if (name == "city") {
            setCity(value)
            setIsLoading(true)
            getAreas(value)
        }
        if (name == "area") {
            setArea(value)
        }

        if (name == "address") {
            setAddress(value)
        }

        if (name == "clinicTimingTo") {
            setDateTo(value)
        }

        if (name == "clinicTimingsFrom") {
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
        } catch (error) {
            setIsLoading(false);
            console.log("error")
        }
    }

    const getClinicById = async () => {
        try {
            setIsLoading(true)
            const response = await API.get(`/get-clinic-details/${singleEditItem?.id}`);
            if (response?.status == 200) {
                setEditItem(response?.data?.data)
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false);
            console.log("error")
        }
    }

    const handleEdit = async () => {
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
            if (clinicName && area && address && dateTo && dateFrom && city) {
                setIsLoading(true);
                const response = await API.put(`/update-clinics`, {
                    clinic_name: clinicName,
                    area_id: area,
                    address: address,
                    clinic_start_time: dateTo,
                    clinic_end_time: dateFrom,
                    city_id: city,
                    status,
                    clinic_id: clinicId,
                })
                if (response?.status == 200) {
                    getClinics();
                    handleEditClinicClose();
                    toast.success(response?.data?.message)
                    setIsLoading(false)
                }
                else {
                    toast.error(response?.data?.message)
                    setIsLoading(false)
                }
            }
            else {
                setIndicationMessage("Please fill all the required fields")
                setIsLoading(false)
            }
        } catch (error) {
            toast.error("error")
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading ?
                <Loader />
                :
                <Modal className="clinic" show={EditClinicShow} onHide={handleEditClinicClose}>
                    {indicationMessage !== "" && <div className="showPoup">
                        {indicationMessage}
                    </div>}
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Clinic</Modal.Title>
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
                                    <Form.Select aria-label="Select city" name='city' value={city} onChange={handleChange} >
                                        <option value="">Select City</option>
                                        {citiesAll?.map((item, idx) => {
                                            return (<>
                                                <option key={idx} value={item?.id} selected={item?.id == city} >{item?.name}</option>
                                            </>)
                                        })}
                                    </Form.Select>
                                    {errorObj.city && <p className="error">{errorObj.city}</p>}
                                </Form.Group>
                                <Form.Group as={Col} md="12" className="mb-3" >
                                    <Form.Label>Area</Form.Label>
                                    <Form.Select aria-label="Select-area" name='area' onChange={handleChange} value={area}>
                                        {areasAll?.map((item, idx) => {
                                            return (<>
                                                <option key={idx} value={item?.id} selected={item?.id == area} > {item?.title} </option>
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
                                    <Form.Select aria-label="clinic timing to" name="clinicTimingTo" onChange={handleChange} value={dateTo}>
                                        {editItem?.clinic_start_time && (<option key="clinic-start-time" value={editItem.clinic_start_time}>{editItem.clinic_start_time}</option>)}
                                        {[
                                            "01:00 PM",
                                            "02:00 PM",
                                            "03:00 PM",
                                            "04:00 PM",
                                            "05:00 PM",
                                            "06:00 PM",
                                            "07:00 PM",
                                            "08:00 PM",
                                            "09:00 PM",
                                            "10:00 PM",
                                            "11:00 PM",
                                            "12:00 PM",
                                            "01:00 AM",
                                            "02:00 AM",
                                            "03:00 AM",
                                            "04:00 AM",
                                            "05:00 AM",
                                            "06:00 AM",
                                            "07:00 AM",
                                            "08:00 AM",
                                            "09:00 AM",
                                            "10:00 AM",
                                            "11:00 AM",
                                            "12:00 AM",
                                        ].filter(time => time !== editItem?.clinic_start_time)
                                            .map((time, idx) => (
                                                <option key={idx} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                    </Form.Select>
                                    {errorObj.dateTo && <p classNAMe="error">{errorObj.dateTo}</p>}

                                </Form.Group>
                                <Form.Group as={Col} md="6" classNAMe="mb-3">
                                    <Form.Label>From</Form.Label>
                                    <Form.Select
                                        aria-label="clinic timing from"
                                        name="clinicTimingsFrom"
                                        onChange={handleChange}
                                        value={dateFrom}
                                    >
                                        {editItem?.clinic_end_time && (
                                            <option key="clinic-end-time" value={editItem.clinic_end_time}>
                                                {editItem.clinic_end_time}
                                            </option>
                                        )}
                                        {[
                                            "01:00 PM",
                                            "02:00 PM",
                                            "03:00 PM",
                                            "04:00 PM",
                                            "05:00 PM",
                                            "06:00 PM",
                                            "07:00 PM",
                                            "08:00 PM",
                                            "09:00 PM",
                                            "10:00 PM",
                                            "11:00 PM",
                                            "12:00 PM",
                                            "01:00 AM",
                                            "02:00 AM",
                                            "03:00 AM",
                                            "04:00 AM",
                                            "05:00 AM",
                                            "06:00 AM",
                                            "07:00 AM",
                                            "08:00 AM",
                                            "09:00 AM",
                                            "10:00 AM",
                                            "11:00 AM",
                                            "12:00 AM",
                                        ]
                                            .filter(time => time !== editItem?.clinic_end_time)
                                            .map((time, idx) => (
                                                <option key={idx} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                    </Form.Select>
                                    {errorObj.dateFrom && <p className="error">{errorObj.dateFrom}</p>}
                                </Form.Group>
                                <Form.Group as={Col} md="6" className="mb-3">
                                    <div className="switched">
                                        <label htmlFor=""> Status</label>
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch"
                                            name="status"
                                            onChange={handleChange}
                                            defaultChecked={editItem?.status == 1 ? true : false}
                                        />
                                    </div>
                                </Form.Group>
                                <Col md={12} className='form_btn'>
                                    <Button className="button1" onClick={handleEditClinicClose}>
                                        CANCEL
                                    </Button>
                                    <Button className="button2" onClick={handleEdit}>
                                        SAVE
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Modal.Body>
                </Modal>}
        </>
    )
}

export default EditClinicModal;