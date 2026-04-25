import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, Tab, Tabs, Accordion, Table, Spinner } from 'react-bootstrap';
import Copy from "../../../assets/images/png/content_copy.png";
import "./viewRxModal.scss";
import API from '../../../services/httpInstance';

const ViewRxModal = ({
    selectedAppointment,
    viewRxShow,
    setMedicinesList,
    handleViewRxClose,
    patientId,
    setViewRxShow,
    patientData,
    setIndicationMessage,
    appointmentDate
}) => {
    const [patientPrescriptions, setPatientPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [otherPrescriptions, setOtherPrescriptions] = useState([]);
    const [otherPage, setOtherPage] = useState(1);
    const [otherHasMore, setOtherHasMore] = useState(true);
    const [otherLoading, setOtherLoading] = useState(false);
    var patientIdToUse = selectedAppointment?.patient_id || patientId

    const getPrescritpion = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/view-rx?patient_id=${patientIdToUse}`);
            if (response.status === 200) {
                setPatientPrescriptions(response.data.data.patient_prescription || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOtherPrescriptions = async (pageToLoad = 1) => {
        try {
            setOtherLoading(true);
            const response = await API.get(`/view-rx?patient_id=${patientIdToUse}&page=${pageToLoad}`);
            if (response.status === 200) {
                const data = response.data.data.other_patient_prescription?.data || [];
                const pagination = response.data.data.other_patient_prescription?.pagination;

                setOtherPrescriptions(prev => [...prev, ...data]);
                setOtherHasMore(pagination?.current_page < pagination?.last_page);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setOtherLoading(false);
        }
    };

    const handlePrescriptionCopyRX = async (prescribeMedId) => {
        try {
            const response = await API.get(`/copy-rx?patient_id=${patientId}&prescribe_med_id=${prescribeMedId}`);
            if (response?.status == 200) {
                const copiedMedicines = response?.data?.data;
                setMedicinesList(copiedMedicines);
            }
            setIndicationMessage(response?.data?.message);
            setViewRxShow(false);
        } catch (error) {
            console.log(error);
        }
    };
    const observer = useRef();
    const lastOtherPrescriptionRef = useCallback(
        (node) => {
            if (otherLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && otherHasMore) {
                    setOtherPage(prev => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [otherLoading, otherHasMore]
    );

    // Reset & Load Data on Modal Open
    useEffect(() => {
        if (viewRxShow && (patientId || selectedAppointment?.patient_id)) {
            setPatientPrescriptions([]);
            setOtherPrescriptions([]);
            setOtherPage(1);
            setOtherHasMore(true);
            getPrescritpion();
        }
    }, [viewRxShow, selectedAppointment, patientId]);

    useEffect(() => {
        if (viewRxShow) {
            fetchOtherPrescriptions(otherPage);
        }
    }, [otherPage, viewRxShow]);

    return (
        <Modal className='view-rx' show={viewRxShow} onHide={handleViewRxClose}>
            <button onClick={handleViewRxClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" strokeWidth="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <h4>View RX</h4>

                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Tabs defaultActiveKey="patient-prescription" id="rx-tabs" className="mb-3">
                        {/* Patient Prescription Tab */}
                        <Tab eventKey="patient-prescription" title="Patient’s Prescription">
                            <Accordion defaultActiveKey="0">
                                {patientPrescriptions && patientPrescriptions.length > 0 ? (
                                    patientPrescriptions.map((prescriptionsOfDay, dayIndex) => (
                                        <Accordion.Item eventKey={dayIndex.toString()} key={dayIndex}>
                                            <Accordion.Header>
                                                <div className="left_wrap">
                                                    <span>Date: {selectedAppointment?.appointment_date || appointmentDate}</span>
                                                    <h5>{selectedAppointment?.patient_name || patientData?.name}</h5>
                                                </div>
                                                <div className="right_wrap">
                                                    <img
                                                        src={Copy}
                                                        alt="Copy"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePrescriptionCopyRX();
                                                        }}
                                                    />
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <Table responsive>
                                                    <thead>
                                                        <tr>
                                                            <th>Medicine</th>
                                                            <th>Dosage</th>
                                                            <th>Frequency</th>
                                                            <th>Duration</th>
                                                            <th>Instructions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {prescriptionsOfDay?.length > 0 ? (
                                                            prescriptionsOfDay.map((medicine, medIndex) => (
                                                                <tr key={medIndex}>
                                                                    <td>{medicine?.medicinetitle}</td>
                                                                    <td>{medicine?.dosage_value} {medicine?.dosage}</td>
                                                                    <td>{medicine?.frequency}</td>
                                                                    <td>{medicine?.duration_value} {medicine?.duration}</td>
                                                                    <td>{medicine?.meal}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={5} className="text-center">No data found.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))
                                ) : (
                                    <div className="text-center py-4">No data found.</div>
                                )}
                            </Accordion>
                        </Tab>
                        <Tab eventKey="other-prescription" title="Other Prescription">
                            <Accordion defaultActiveKey="0">
                                {otherPrescriptions && otherPrescriptions.length > 0 ? (
                                    otherPrescriptions.map((prescriptionsOfDay, dayIndex) => {
                                        const isLast = dayIndex === otherPrescriptions.length - 1;
                                        return (
                                            <Accordion.Item
                                                key={dayIndex}
                                                eventKey={dayIndex.toString()}
                                                ref={isLast ? lastOtherPrescriptionRef : null}
                                            >
                                                <Accordion.Header>
                                                    <div className="left_wrap">
                                                        <span>Date: {selectedAppointment?.appointment_date || appointmentDate}</span>
                                                        <h5>{selectedAppointment?.patient_name || patientData?.name}</h5>
                                                    </div>
                                                    <div className="right_wrap">
                                                        <img
                                                            src={Copy}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePrescriptionCopyRX(prescriptionsOfDay[0]?.id);
                                                            }}
                                                            alt="Copy"
                                                        />
                                                    </div>
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <Table responsive>
                                                        <thead>
                                                            <tr>
                                                                <th>Medicine</th>
                                                                <th>Dosage</th>
                                                                <th>Frequency</th>
                                                                <th>Duration</th>
                                                                <th>Instructions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {prescriptionsOfDay?.length > 0 ? (
                                                                prescriptionsOfDay.map((medicine, medIndex) => (
                                                                    <tr key={medIndex}>
                                                                        <td>{medicine?.medicinetitle}</td>
                                                                        <td>{medicine?.dosage_value} {medicine?.dosage}</td>
                                                                        <td>{medicine?.frequency}</td>
                                                                        <td>{medicine?.duration_value} {medicine?.duration}</td>
                                                                        <td>{medicine?.meal}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={5} className="text-center">No prescriptions for this day.</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4">No data found.</div>
                                )}
                            </Accordion>

                            {otherLoading && (
                                <div className="text-center py-3">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            )}
                        </Tab>
                    </Tabs>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default ViewRxModal
