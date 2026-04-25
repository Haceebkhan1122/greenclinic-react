import React, { useEffect, useState } from 'react'
import { Modal, Form } from 'react-bootstrap';
import "./assignDoctorModal.scss";
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const AssignDoctorModal = ({ handleAssignDoctorClose,setAssignDoctorShow, setIndicationMessage, indicationMessage, assignDoctorShow, getDoctorsByClinic }) => {
    const [allDoctors, setAllDoctors] = useState([]);
    const [singleDocId, setSingleDocId] = useState(null);
    const [isDisabled, setIsDisabled] = useState(false)
    const [validationError, setValidationError] = useState("")
    let clinicDetails = useSelector((state) => state.clinic.clinicDetails);

    useEffect(() => {
        getDoctors();
    }, [])

    // const getDoctors = async () => {
    //     try {
    //         const response = await API.get(`/get-all-doctors`);
    //         if (response?.status == 200) {
    //             setAllDoctors(response?.data?.data)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const getDoctors = async () => {
        try {
            const response = await API.get(`/get-all-doctors-by-clinic`);
            if (response?.status == 200) {
                setAllDoctors(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    



    const handleSave = async (e) => {
        e.preventDefault();
        try {
            let doctorId = allDoctors?.find((item) => item?.id == singleDocId);
            setIsDisabled(true);
            const response = await API.post(`/assign-doctor-to-clinic`, {
                doctorId: doctorId?.id,
                clinicId: clinicDetails?.id,
            });
            if (response?.status == 200) {
                setAssignDoctorShow(false);
                setIndicationMessage(response?.data?.message);
                setIsDisabled(false);
                getDoctorsByClinic();
                handleAssignDoctorClose();
            }
            else {
                setIsDisabled(false);
                setIndicationMessage(response?.data?.message);
            }
        } catch (error) {
            console.log("error in save ", error )
            setIsDisabled(false);
        }
    }

    const handleChange = (e) => {
        setSingleDocId(e.target.value);
    }

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    return (
        <>
        <Modal className='assignDoctor' show={assignDoctorShow} onHide={handleAssignDoctorClose} centered>
                {indicationMessage !== "" && <div className="showPoup">
                    {indicationMessage}
                </div>}
            <button onClick={handleAssignDoctorClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Header>
                <Modal.Title>Assign Doctor</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Assign Doctor</Form.Label>
                        <Form.Select onChange={handleChange} >
                            <option value={""}>Select Doctor</option>
                            {allDoctors.map((item) => {
                                return (<>
                                    <option key={item?.id} value={item?.id}>{item?.name}</option>
                                </>)
                            })}
                        </Form.Select>
                    </Form.Group>
                    <p> {validationError?.mess} </p>
                    <div className="form_btn">
                        <button className='button1' onClick={handleAssignDoctorClose}>Close</button>
                        <button className='button2' onClick={handleSave} disabled={isDisabled}>Save</button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal >
        </>
    )
}

export default AssignDoctorModal