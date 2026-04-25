import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { pastAppts } from '../../services/data/indexPast';
import { Dropdown } from 'react-bootstrap';
import Rx from "../../assets/images/svg/rx_icon.svg"
import PrintInvoice from "../../assets/images/svg/printer.svg"
import Delete from "../../assets/images/svg/delete_icon.svg"
import DeletePastApptsModal from "../modal/deletePastApptsModal/DeletePastApptsModal"
import { useNavigate } from 'react-router-dom';
import "./pastAppts.scss"
import API from '../../services/httpInstance';


const PastAppts = ({ pastAppointments, deleteAppointment, generalDeleteModal, setGeneralDeleteModal, handleGeneralDeleteClose, getPastAppointments, pagination }) => {
    const [appointmentId, setAppointmentId] = useState();
    const handleDeletePastApptsShow = (appId) => {
        setAppointmentId(appId)
        setGeneralDeleteModal(true)
    }
    const onPageChange = (event) => {
        const selectedPage = event.page + 1;
        getPastAppointments(selectedPage);
    };
    const navigate = useNavigate()
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;


    const navigateToPrescription = async (id) => {
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
                        <Dropdown.Item href="javascript:void(0);" className='ancLink'>
                            <img src={PrintInvoice} alt="" className='tw-w-[16px]' />
                            Print Invoice
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => { navigateToPrescription(rowData?.id) }} className='ancLink'>
                            <img src={Rx} alt="" className='tw-w-[16px]' />
                            View Prescription
                        </Dropdown.Item>
                        <Dropdown.Item href="javascript:void(0);" className='ancLink' onClick={() => handleDeletePastApptsShow(rowData.id)}>
                            <img src={Delete} alt="" className='tw-w-[16px]' />
                            Delete
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </>)
    };
    return (
        <div className='pastApptsTab'>
            <div className="table__wrape tablePrime">
                <DataTable
                    value={pastAppointments}
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
                    <Column field="id" header="Token No." style={{ width: '15%' }} ></Column>
                    <Column field="id" header="MR No." style={{ width: '10%' }} ></Column>
                    <Column field="doctor_name" header="Doctor" style={{ width: '15%' }} ></Column>
                    <Column field="web_appointment_date" header="Date" style={{ width: '15%' }} ></Column>
                    <Column field="time" header="Time" style={{ width: '15%' }} ></Column>
                    <Column field="source" header="Source" style={{ width: '20%' }} ></Column>
                    <Column field="" header="" style={{ width: '20%', textAlign: "end", paddingRight: "22px" }} body={priceBodyTemplate}></Column>
                </DataTable>
            </div>
            <DeletePastApptsModal appointmentType={"Past"} appointmentId={appointmentId} deleteAppointment={deleteAppointment} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />
        </div>
    )
}

export default PastAppts