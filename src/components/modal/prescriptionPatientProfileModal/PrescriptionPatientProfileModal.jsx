import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import { Dropdown } from 'react-bootstrap';
import Rx from "../../../assets/images/svg/rx_icon.svg"
import PrintInvoice from "../../../assets/images/svg/printer.svg"
import Delete from "../../../assets/images/svg/delete_icon.svg"
import "./prescriptionPatientProfileModal.scss";
import DeletePrescriptionModal from '../deletePrescriptionModal/DeletePrescriptionModal';

const PrescriptionPatientProfileModal = ({ prescriptionPatientProfileClose, prescriptionPatientProfile, generalDeleteModal, setGeneralDeleteModal, deletePrescription, handleGeneralDeleteClose, prescriptionData, getPrescription }) => {
    const [appointmentId, setAppointmentId] = useState();

    const handleDeletePrescriptionShow = (prescriptionId) => {
        setAppointmentId(prescriptionId)
        setGeneralDeleteModal(true)
    }

    const printToken = async (id) => {
        try {
            const response = await API.get(`/download-invoice-print/${id}`)
            if (response?.status == 200) {
                const pdfUrl = response.data?.data?.url;
                window.open(pdfUrl, "_blank");
            }
        } catch (error) {
            console.log(error)
        }
    }


    const viewPrescription = async (id) => {
        try {
            const response = await API.get(`/patient-presc-download/${id}`)
            if (response?.status == 200) {
                const pdfUrl = response.data?.data?.url;
                window.open(pdfUrl, "_blank");
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Modal className='prescriptionPatientProfile' show={prescriptionPatientProfile} onHide={prescriptionPatientProfileClose}>
                <Modal.Body>
                    <h2><img src={ArrowBack} alt="" onClick={prescriptionPatientProfileClose} />Prescription</h2>
                    <Row>
                        {prescriptionData.map((item) => (
                            <Col xs={12}>
                                <div className="card">
                                    <div className="token">
                                        <h4>{item?.doctor_name}</h4>
                                        <div className="mr_no">
                                            <h6>{item?.mr_no}</h6>
                                            <Dropdown className='dropdownUpcoming'>
                                                <Dropdown.Toggle id="dropdown-basic">
                                                    <span className='menuIcon'></span>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => printToken(id)} className='ancLink'>
                                                        <img src={PrintInvoice} alt="" className='tw-w-[16px]' />
                                                        Print Invoice
                                                    </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => viewPrescription(id)} className='ancLink'>
                                                        <img src={Rx} alt="" className='tw-w-[16px]' />
                                                        View Prescription
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className='ancLink' onClick={() => handleDeletePrescriptionShow(id)}>
                                                        <img src={Delete} alt="" className='tw-w-[16px]' />
                                                        Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="time">
                                        <span>{item?.time}</span>
                                        <p>{item?.web_appointment_date}</p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Modal.Body>
            </Modal>
            <DeletePrescriptionModal appointmentId={appointmentId} deletePrescription={deletePrescription} setGeneralDeleteModal={setGeneralDeleteModal} generalDeleteModal={generalDeleteModal} handleGeneralDeleteClose={handleGeneralDeleteClose} />
        </>
    )
}

export default PrescriptionPatientProfileModal