/* eslint-disable react/prop-types */
import { Divider } from 'antd'
import './addProcedureModal.scss';
import { Form, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../../../services/httpInstance';
import Loader from '../../loader/Loader';

const AddProcedureModal = ({ addProcShow, indicationMessage,getProcedures, setIndicationMessage, handleEditLabClose, handleEditLabshow }) => {
    const [clinicDoctors, setClinicDoctors] = useState([])
    const [errorObj, setErrorObj] = useState({})
    const [procedureName, setProcedureName] = useState("")
    const [price, setPrice] = useState("")
    const [doctorProcedure, setDoctorProcedure] = useState("")
    const [doctorShare, setDoctorShare] = useState("")
    const [doctorPercentage, setDoctorPercentage] = useState("")
    const [allDoctors, setAllDoctors] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [doctorSelectedField, setDoctorSelectedField] = useState(false);





    let clinicDetails = useSelector((state) => state.clinic.clinicDetails);

    useEffect(() => {
        getDoctorsByClinic();
    }, [])

    const getDoctorsByClinic = async () => {
        try {
            const response = await API.get(`/get-all-doctors-by-clinic_id?clinicId=${clinicDetails?.id}`)
            if (response?.status == 200) {
                setClinicDoctors(response?.data?.data);
            }
        } catch (error) {
            console.log("errr", error)
        }
    }


    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        let errors = {};

        if (name == "procedureName") {
            setProcedureName(value);
        }

        if (name == "price") {
            setPrice(value);
        }

        if (name == "doctorProcedure") {
            setDoctorProcedure(value);
        }

        if (name == "doctorShare") {
            errors.doctorShare = ""
            if (value >= 0 && value <= 100) {
                setDoctorShare(value);
                errors.doctorShare = ""
            }
            else {
                errors.doctorShare = "Value must be between 0 to 100"
            }
        }

        if (name == "doctorPercentage") {
            setDoctorPercentage(value)
        }

        if (name == "allDoctors") {
            if (checked) {
                setAllDoctors("on")
                setDoctorSelectedField(true);
                setDoctorProcedure(null);
            }
            else {
                setAllDoctors("off")
                setDoctorSelectedField(false);
            }
        }
        setErrorObj(errors);
    }

    const handleSaveNext = async () => {
        const payload = {
            name: procedureName,
            price,
            percentage: doctorPercentage,
        }

        try {
            setIsLoading(true)
            if (procedureName && price && doctorPercentage) {
                const response = await API.post(`/add-procedures`, payload);

                if (response?.status == 200) {
                    handleEditLabClose();
                    setIsLoading(false)
                    getProcedures();
                    setProcedureName("")
                    setPrice(null)
                    setDoctorPercentage(null)
                    setDoctorProcedure(null)
                    setAllDoctors(null);
                }
                else {
                    setIsLoading(false)
                }
            }
            else {
                console.log("")
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {isLoading ?
                <Loader />
                :
                <Modal show={addProcShow} onHide={handleEditLabClose} centered className="modalEditProceduresMobile">
                    <Modal.Body>
                        <div className="custom_field_form">
                            <div className="fieldsWrape">
                                <h2><span className='backIcon' onClick={handleEditLabClose} /> Add Procedure  </h2>
                                <Divider />
                                <div className="single customInp">
                                    <label htmlFor=""> Procedure Name </label>
                                    <input type="text" placeholder="General" name="procedureName" value={procedureName} onChange={handleChange} />
                                </div>
                                <div className="single customInp">
                                    <label htmlFor=""> Procedure Price  </label>
                                    <input type="number" placeholder="Rs. 1000" name="price" value={price} onChange={handleChange} />

                                </div>
                                <div className="single_field customSelect">
                                    <label htmlFor=""> Doctor </label>
                                    <Form.Select aria-label="Default select example" name="doctorProcedure" value={doctorProcedure} onChange={handleChange}>

                                        <option value=""> Select Doctor </option>
                                        {clinicDoctors?.map((item) => {
                                            return (<>
                                                <option value={item?.id}>{item?.name}</option>
                                            </>)
                                        })}
                                    </Form.Select>
                                </div>
                                <div className="singleTick customTickCheck">
                                    <label htmlFor="tick">
                                        <input type="checkbox" id='tick' name='allDoctors' checked={allDoctors == 1 ? true : false} onChange={handleChange} />
                                        <span></span>
                                        For All Doctors
                                    </label>
                                </div>
                                <div className="single_field customSelect">
                                    <label htmlFor=""> Percentage </label>
                                    <Form.Select aria-label="Default select example" name="doctorPercentage" value={doctorPercentage} onChange={handleChange} >
                                        {Array.from({ length: 100 }, (_, i) => (
                                            <option key={i + 1} value={`${i + 1}`}>{i + 1}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                                <Divider />
                                <div className="wrape_btn">
                                    <button onClick={handleEditLabClose}> Cancel </button>
                                    <button onClick={handleSaveNext}> Next </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default AddProcedureModal;
