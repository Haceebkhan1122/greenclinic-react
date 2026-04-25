import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import CancelButton from "../../../assets/images/png/cancel_button.png"
import "./printPrescriptionModal.scss"
import { useParams } from 'react-router-dom'
import API from '../../../services/httpInstance'

const PrintPrescriptionModal = ({ handleDownloadPrescriptionClose, downloadPrescriptionShow, prescriptionProfile }) => {
    const [prescriptionPrint, setPrescriptionPrint] = useState(null)
    const [pdfUrl, setPdfUrl] = useState(null)

    const getPrescriptionPrint = async () => {
        try {
            const response = await API.get("/prescription-template")
            if (response.status == 200) {
                setPrescriptionPrint(response?.data?.data[0])
            }
        } catch (error) {
            consolelog(error)
        }
    }
    const handleDownloadPrescription = async () => {
        try {
            const response = await API.get(`/patient-presc-download/${prescriptionProfile?.appointment?.id}`)
            if (response?.status === 200) {
                const url = response.data?.data?.url;
                setPdfUrl(url);
                if (url) {
                    window.open(url, "_blank");
                } else {
                    console.error("No PDF URL found");
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getPrescriptionPrint()
    }, {})
    return (
        <Modal className='printPrescription' show={downloadPrescriptionShow} onHide={handleDownloadPrescriptionClose} centered>
            <button className='close' onClick={handleDownloadPrescriptionClose}><img src={CancelButton} alt="" /></button>
            <Modal.Body>
                {prescriptionPrint?.thumbnail ? (
                    <img src={prescriptionPrint?.thumbnail} alt="Prescription Template" />
                ) : (
                    <div className="no-prescription">No prescription available</div>
                )}                <div className='text-center'>
                    <button className='button2' onClick={handleDownloadPrescription} disabled={!prescriptionPrint?.thumbnail}>PRINT</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default PrintPrescriptionModal