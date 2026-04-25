import React, { useState } from 'react'
import { Col, Dropdown, Modal, Row } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import "./healthRecordsPatientProfileModal.scss"
import DeleteHealthRecordModal from '../deleteHealthRecordModal/DeleteHealthRecordModal';
import { CloudUploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import UploadHealthRecordModal from '../uploadHealthRecordModal/UploadHealthRecordModal';
import ViewHealthRecordModal from '../viewHealthRecordModal/ViewHealthRecordModal';
import moment from 'moment';

const HealthRecordsPatientProfileModal = ({ healthRecordsPatientProfileClose, healthRecordsPatientProfile, getPatientHealthRecords, patientHealthRecord, handleGeneralDeleteClose, generalDeleteModal, setGeneralDeleteModal, deleteHealthRecords, patientData }) => {
    const [showHealthRecord, setShowHealthRecord] = useState(false);
    const [healthRecordsShow, setHealthRecordsShow] = useState(false);
    const [appointmentId, setAppointmentId] = useState();
    const [healthView, setHealthView] = useState();
    const [uploadRecord, setUploadRecord] = useState();

    const handleViewHealthClose = () => setHealthRecordsShow(false)
    const handleDeleteHealthShow = (invoiceid) => {
        setAppointmentId(invoiceid)
        setGeneralDeleteModal(true)
    }
    const handleViewHealthShow = (item) => {
        setHealthView(item)
        setHealthRecordsShow(true)
    }

    const handleCloseHealthModal = () => setShowHealthRecord(false)

    const handleShowHealthModal = (rowData) => {
        setUploadRecord(rowData)
        setShowHealthRecord(true)
    }

    return (
        <>
            <Modal className='healthRecordsPatientProfile' show={healthRecordsPatientProfile} onHide={healthRecordsPatientProfileClose} backdropClassName="custom-backdrop">
                <Modal.Body>
                    <h2><img src={ArrowBack} alt="" onClick={healthRecordsPatientProfileClose} />Health Records</h2>
                    <Row>
                        {patientHealthRecord?.map((item) => (
                            <Col xs={12} key={item.id}>
                                <div className="card">
                                    <div className="token">
                                        <h4>{item?.title}</h4>
                                        <Dropdown className='dropdownUpcoming'>
                                            <Dropdown.Toggle id="dropdown-basic">
                                                <span className='menuIcon'></span>
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item href="javascript:void(0);" className='ancLink' onClick={() => handleViewHealthShow(image_url_path)}>
                                                    <EyeOutlined />
                                                    Print Invoice
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleShowHealthModal(item)} className='ancLink'>
                                                    <CloudUploadOutlined />
                                                    View Prescription
                                                </Dropdown.Item>
                                                <Dropdown.Item href="javascript:void(0);" className='ancLink' onClick={() => handleDeleteHealthShow(item?.id)}>
                                                    <DeleteOutlined />
                                                    Delete
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <h4>{moment(item?.created_at).format('DD/MMM/YYYY')}</h4>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <div className="box-fixed">
                        <button className='button2 cs' onClick={() => setShowHealthRecord(true)}>Add Health Record</button>
                    </div>
                </Modal.Body>
            </Modal>

            <DeleteHealthRecordModal deleteHealthRecords={deleteHealthRecords} appointmentId={appointmentId} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />
            <UploadHealthRecordModal patientData={patientData} handleCloseHealthModal={handleCloseHealthModal} showHealthRecord={showHealthRecord} getPatientHealthRecords={getPatientHealthRecords} uploadRecord={uploadRecord} />
            <ViewHealthRecordModal healthView={healthView} handleViewHealthClose={handleViewHealthClose} healthRecordsShow={healthRecordsShow} />
        </>
    )
}

export default HealthRecordsPatientProfileModal