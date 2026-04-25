import React from 'react'
import { Modal } from 'react-bootstrap'
import "./viewInvoiceModal.scss"
import MeriSehat from "../../../assets/images/png/meri_sehat.png"
import Download from "../../../assets/images/png/download.png"
import { Divider } from 'antd'
import API from '../../../services/httpInstance'
import { toast } from 'react-toastify'

const ViewInvoiceModal = ({
    viewInvoice,
    handleViewInvoiceClose,
    patientName,
    appointmentDate,
    time,
    appointmentType,
    paymentMethod,
    appointmentId,
    amountRecieve,
    consultationType,
    clinicName
}) => {

    const downloadInvoicePrint = async () => {
        try {
            const response = await API.get(`/download-invoice-print/${appointmentId}`);
            if (response?.status == 200) {
                const fileUrl = response?.data?.data?.url;
                if (fileUrl) {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.setAttribute('download', 'invoice_reports.pdf');
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    toast.success("Download Successful!", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                } else {
                    toast.error("File URL not found");
                }
            } else {
                toast.error("Download Failed");
            }
        }
        catch (error) {
            toast.error("Download Error", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };


    return (
        <Modal className='viewInvoice' show={viewInvoice} onHide={handleViewInvoiceClose}>
            <button onClick={handleViewInvoiceClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <img src={MeriSehat} className='logo' alt="" />
                <div className='invoice'>
                    <h4>Invoice</h4>
                    <button onClick={downloadInvoicePrint}><img src={Download} alt="" /> DOWNLOAD INVOICE</button>
                </div>
                <div className="box_wrap">
                    <ul>
                        <li>Appointment ID <span>{appointmentId}</span></li>
                        <li>Patient Name<span>{patientName}</span></li>
                        <li>Appointment Date<span>{appointmentDate}</span></li>
                        <li>Appointment Time<span>{time || "-"}</span></li>
                        <li>Appointment Type<span>{consultationType || appointmentType || "-"}</span></li>
                        <li>Location<span></span>{clinicName}</li>
                        <li>Payment Type<span>{paymentMethod || "-"}</span></li>
                    </ul>
                    <Divider />
                    <ul>
                        <li className='blue_color'>Amount Paid by Patient<span>{amountRecieve}</span></li>
                        {/* <li className='blue_color'>Meri Sehat Platform Fee<span></span></li> */}
                    </ul>
                    <Divider />
                    <ul>
                        <li>Total Amount (incl. GST)<span>{amountRecieve}</span></li>
                    </ul>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ViewInvoiceModal