import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { prescription } from '../../services/data/indexPrescription';
import { Dropdown } from 'react-bootstrap';
import Rx from "../../assets/images/svg/rx_icon.svg"
import PrintInvoice from "../../assets/images/svg/printer.svg"
import Delete from "../../assets/images/svg/delete_icon.svg"
import DeletePrescriptionModal from "../../components/modal/deletePrescriptionModal/DeletePrescriptionModal"
import "./prescriptionTab.scss"
import API from '../../services/httpInstance';
import { useNavigate } from 'react-router-dom';

const PrescriptionTab = ({ generalDeleteModal, setGeneralDeleteModal, deletePrescription, handleGeneralDeleteClose, prescriptionData, pagination, getPrescription }) => {
  // const [deletePrescriptionShow, setDeletePrescriptionShow] = useState(false)
  const [appointmentId, setAppointmentId] = useState();
  // const handleDeletePrescriptionClose = () => setDeletePrescriptionShow(false)
    const navigate = useNavigate()
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  const handleDeletePrescriptionShow = (prescriptionId) => {
    setAppointmentId(prescriptionId)
    setGeneralDeleteModal(true)
  }

  const onPageChange = (event) => {
    const selectedPage = event.page + 1;
    getPrescription(selectedPage);
  };

  const printToken = async (id) => {
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

  
  const viewPrescription = async (id) => {
    try {
      const response = await API.get(`/appointment-details/${id}`)
      if (response?.status == 200) {
        navigate(`/prescription-profile/${id}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const priceBodyTemplate = (rowData) => {
    return (
      <>
        <Dropdown className='dropdownUpcoming'>
          <Dropdown.Toggle id="dropdown-basic">
            <span className='menuIcon'></span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => printToken(rowData?.id)} className='ancLink'>
              <img src={PrintInvoice} alt="" className='tw-w-[16px]' />
              Print Prescription
            </Dropdown.Item>
            <Dropdown.Item onClick={() => viewPrescription(rowData?.id)} className='ancLink'>
              <img src={Rx} alt="" className='tw-w-[16px]' />
              View Prescription
            </Dropdown.Item>
            <Dropdown.Item className='ancLink' onClick={() => handleDeletePrescriptionShow(rowData?.id)}>
              <img src={Delete} alt="" className='tw-w-[16px]' />
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>)
  };
  return (
    <div className='prescriptionTab'>
      <div className="table__wrape tablePrime">
        <DataTable
          value={prescriptionData}
          paginator
          rows={pagination?.per_page || 10}
          totalRecords={pagination?.total || 0}
          lazy
          onPage={onPageChange}
          first={(pagination?.current_page - 1) * pagination?.per_page || 0}
          paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
          currentPageReportTemplate="{first} - {last} of {totalRecords}"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          tableStyle={{ minWidth: "50rem" }}>
          <Column field="mr_no" header="MR No." style={{ width: '10%' }} ></Column>
          <Column field="doctor_name" header="Doctor" style={{ width: '20%' }} ></Column>
          <Column field="date" header="Date" style={{ width: '20%' }} ></Column>
          <Column field="appointment_time" header="Time" style={{ width: '20%' }} ></Column>
          <Column field="" header="" style={{ width: '20%', textAlign: "end", paddingRight: "22px" }} body={priceBodyTemplate}></Column>
        </DataTable>
      </div>
      <button className='add_btn'>Add Prescription</button>
      <DeletePrescriptionModal appointmentId={appointmentId} deletePrescription={deletePrescription} setGeneralDeleteModal={setGeneralDeleteModal} generalDeleteModal={generalDeleteModal} handleGeneralDeleteClose={handleGeneralDeleteClose} />
    </div>
  )
}

export default PrescriptionTab