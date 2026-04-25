import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'react-bootstrap';
import EditInvoice from "../../assets/images/svg/edit.svg"
import PrintInvoice from "../../assets/images/svg/printer.svg"
import Delete from "../../assets/images/svg/delete_icon.svg"
import "./invoiceTab.scss";
import EditInvoiceModal from '../modal/editInvoiceModal/EditInvoiceModal';
import DeleteInvoiceModal from '../modal/deleteInvoiceModal/DeleteInvoiceModal';
import API from '../../services/httpInstance';
import PartialPaymentModal from '../modal/partialpaymentModal/PartialPaymentModal';

const InvoiceTab = ({ invoices, allowedPermissions, generalDeleteModal, setGeneralDeleteModal, generalDeleteModalUpdated, setGeneralDeleteModalUpdated, handleGeneralDeleteClose, handleGeneralDeleteCloseUpdated, deleteInvoice, getInvoices, pagination }) => {
    const [partialPaymentShow, setPartialPaymentShow] = useState(false)
    const [appointmentId, setAppointmentId] = useState();
    const [partialPaymentId, setPartialPaymentId] = useState(false)
    // const handleEditInvoiceShow = (item) => {
    //     setAppointmentId(item)
    //     setEditInvoiceShow(true)
    // }
    const handlePartialPaymentClose = () => setPartialPaymentShow(false)

    const handlePartialPaymentShow = (rowData) => {
        setPartialPaymentId(rowData?.id)
        setPartialPaymentShow(true)
    }

    const handleDeleteInvoiceShow = (invoiceId) => {
        setAppointmentId(invoiceId)
        // setGeneralDeleteModal(true);
        setGeneralDeleteModalUpdated("invoice");
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const onPageChange = (event) => {
        const selectedPage = event.page + 1;
        getInvoices(selectedPage);
    };

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

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <Dropdown className='dropdownUpcoming'>
                    <Dropdown.Toggle id="dropdown-basic">
                        <span className='menuIcon'></span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => printInvoice(rowData?.id)} className='ancLink'>
                            <img src={PrintInvoice} alt="" className='tw-w-[16px]' />
                            Print Invoice
                        </Dropdown.Item>
                        {allowedPermissions["billing_update"] && <Dropdown.Item className='ancLink' onClick={() => handlePartialPaymentShow(rowData)}>
                            <img src={EditInvoice} alt="" className='tw-w-[16px]' />
                            Edit Invoice
                        </Dropdown.Item>}
                        {allowedPermissions["billing_delete"] && <Dropdown.Item className='ancLink' onClick={() => { handleDeleteInvoiceShow(rowData?.id) }}>
                            <img src={Delete} alt="" className='tw-w-[16px]' />
                            Delete
                        </Dropdown.Item>}
                    </Dropdown.Menu>
                </Dropdown>
            </>)
    };

    return (
        <div className='invoiceTab'>
            <div className="table__wrape tablePrime">
                <DataTable
                    value={invoices}
                    paginator
                    rows={pagination?.per_page}
                    totalRecords={pagination?.total}
                    lazy
                    onPage={onPageChange}
                    first={(pagination?.current_page - 1) * pagination?.per_page}
                    paginatorTemplate="CurrentPageReport PrevPageLink NextPageLink"
                    currentPageReportTemplate="{first} - {last} of {totalRecords}"
                    paginatorLeft={paginatorLeft}
                    paginatorRight={paginatorRight}
                    tableStyle={{ minWidth: "50rem" }}>
                    <Column field="mr_no" header="MR No." style={{ width: '10%' }}></Column>
                    <Column field="doctor_name" header="Doctor" style={{ width: '20%' }}></Column>
                    <Column field="created_at" header="Date" style={{ width: '20%' }}></Column>
                    <Column field="time" header="Time" style={{ width: '20%' }}></Column>
                    <Column field="total" header="Total (Rs)" style={{ width: '15%' }}></Column>
                    <Column field="remaning" header="Remaining (Rs)" style={{ width: '40%' }}></Column>
                    <Column field="" header="" style={{ width: '15%', paddingRight: "22px" }} body={priceBodyTemplate}></Column>
                </DataTable>
            </div>
            <button className='add_btn'>Add Appointment</button>
            {/* <EditInvoiceModal handleEditInvoiceClose={handleEditInvoiceClose} editInvoiceShow={editInvoiceShow} /> */}
            <PartialPaymentModal getInvoices={getInvoices} partialPaymentId={partialPaymentId} partialPaymentShow={partialPaymentShow} handlePartialPaymentClose={handlePartialPaymentClose} />
            <DeleteInvoiceModal appointmentId={appointmentId} generalDeleteModalUpdated={generalDeleteModalUpdated} handleGeneralDeleteCloseUpdated={handleGeneralDeleteCloseUpdated} deleteInvoice={deleteInvoice} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />

        </div>
    )
}

export default InvoiceTab