import React, { useState } from 'react'
import { Col, Dropdown, Modal, Row } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import EditInvoiceModal from '../editInvoiceModal/EditInvoiceModal';
import DeleteInvoiceModal from '../deleteInvoiceModal/DeleteInvoiceModal';
import PrintInvoice from "../../../assets/images/svg/printer.svg"
import EditInvoice from "../../../assets/images/svg/edit.svg"
import Delete from "../../../assets/images/svg/delete_icon.svg"
import "./invoicesPatientProfileModal.scss"
import BookAppointmentModal from '../bookAppointmentModal/BookAppointmentModal';

const InvoicesPatientProfileModal = ({ invoicesPatientProfileClose, invoicesPatientProfile, invoices, generalDeleteModal, setGeneralDeleteModal, handleGeneralDeleteClose, deleteInvoice,doctors,setBookAppointmentShow, bookAppointmentShow,handleBookAppointmentClose }) => {
    const [editInvoiceShow, setEditInvoiceShow] = useState(false)
    const [appointmentId, setAppointmentId] = useState();
    const handleEditInvoiceShow = () => setEditInvoiceShow(true)
    const handleEditInvoiceClose = () => setEditInvoiceShow(false)
    const handleDeleteInvoiceShow = (invoiceid) => {
        setAppointmentId(invoiceid)
        setGeneralDeleteModal(true)
    }

    const printInvoice = async (id) => {
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

    const openAppointment = () => {
        invoicesPatientProfileClose()
        setBookAppointmentShow(true)
    }

    return (
        <>
            <Modal className='invoicePatientProfile' show={invoicesPatientProfile} onHide={invoicesPatientProfileClose}>
                <Modal.Body>
                    <h2><img src={ArrowBack} alt="" onClick={invoicesPatientProfileClose} />Invoice</h2>
                    <Row>
                        {invoices.map((item) => (
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
                                                    <Dropdown.Item onClick={() => printInvoice(id)} className='ancLink'>
                                                        <img src={PrintInvoice} alt="" className='tw-w-[16px]' />
                                                        Print Invoice
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className='ancLink' onClick={handleEditInvoiceShow}>
                                                        <img src={EditInvoice} alt="" className='tw-w-[16px]' />
                                                        Edit Invoice
                                                    </Dropdown.Item>
                                                    <Dropdown.Item className='ancLink' onClick={() => handleDeleteInvoiceShow(id)}>
                                                        <img src={Delete} alt="" className='tw-w-[16px]' />
                                                        Delete
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <p>{item?.source}</p>
                                    <div className="time">
                                        <span>{item?.time}</span>
                                        <p>{item?.web_appointment_date}</p>
                                    </div>
                                    <div className="amount">
                                        <h5><span>Total</span> {item?.total}</h5>
                                        <h5><span>Remaining</span> {item?.remaning}</h5>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className="box-fixed">
                        <button onClick={openAppointment} className='button2'>Add Appointment</button>
                    </div>
                </Modal.Body>
            </Modal>
            <EditInvoiceModal handleEditInvoiceClose={handleEditInvoiceClose} editInvoiceShow={editInvoiceShow} />
            <DeleteInvoiceModal appointmentId={appointmentId} deleteInvoice={deleteInvoice} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />
            <BookAppointmentModal doctors={doctors} bookAppointmentShow={bookAppointmentShow} handleBookAppointmentClose={handleBookAppointmentClose} setBookAppointmentShow={setBookAppointmentShow} />
        </>
    )
}

export default InvoicesPatientProfileModal