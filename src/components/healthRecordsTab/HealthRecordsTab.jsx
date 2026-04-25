import React, { useState } from 'react'
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "./healthRecordsTab.scss"
import { CloudUploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import DeleteHealthRecordModal from '../modal/deleteHealthRecordModal/DeleteHealthRecordModal';
import UploadHealthRecordModal from '../modal/uploadHealthRecordModal/UploadHealthRecordModal';
import ViewHealthRecordModal from '../modal/viewHealthRecordModal/ViewHealthRecordModal';
import moment from 'moment';

const HealthRecordsTab = ({ patientHealthRecord, handleGeneralDeleteClose, patientId, generalDeleteModal, setGeneralDeleteModal, deleteHealthRecords, patientData, getPatientHealthRecords, pagination }) => {
    
    const [healthRecordsShow, setHealthRecordsShow] = useState(false);
    const [appointmentId, setAppointmentId] = useState(null);
    const [healthView, setHealthView] = useState();
    const [uploadRecord, setUploadRecord] = useState();
    const handleViewHealthClose = () => setHealthRecordsShow(false)


    const handleDeleteHealthShow = (invoiceId) => {
        setAppointmentId(invoiceId)
        setGeneralDeleteModal(true)
    }


    const handleViewHealthShow = (item) => {
        setHealthView(item)
        setHealthRecordsShow(true)
    }

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const handleShowHealthModal = (rowData) => {
        setUploadRecord(rowData)
        setShowHealthRecord(true)
    }

    const onPageChange = (event) => {
        const selectedPage = event.page + 1;
        getPatientHealthRecords(selectedPage);
    };

    // const handlee = (data) => {
    // }

    const priceBodyTemplate = (rowData) => {
        return (
            <div className='btn-icon'>
                <button onClick={() => handleViewHealthShow(rowData?.image_url)}><EyeOutlined /></button>
                <button onClick={() => handleShowHealthModal(rowData)}><CloudUploadOutlined /></button>
                <button onClick={() => handleDeleteHealthShow(rowData?.prescribed_lab_id)}><DeleteOutlined /></button>
                {/* <button onClick={()=> {handlee(rowData)}}><DeleteOutlined /></button> */}
            </div>
        )
    };
    const [showHealthRecord, setShowHealthRecord] = useState(false);
    
    const handleCloseHealthModal = () => setShowHealthRecord(false)

    const formatDateTemplate = (rowData) => {
        return moment(rowData?.created_at).format('DD MMM YYYY');
    };
    return (
        <div className='healthRecordTab'>
            <div className="table__wrape tablePrime">
                <DataTable
                    value={patientHealthRecord}
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
                    <Column field="title" header="File Name" style={{ width: '25%' }}></Column>
                    <Column field="created_at" header="Date" body={formatDateTemplate} style={{ width: '25%' }}></Column>
                    <Column field="" header="" style={{ width: '15%', paddingRight: "22px" }} body={priceBodyTemplate}></Column>
                </DataTable>
            </div>
            <button className='add_btn' onClick={() => setShowHealthRecord(true)}>Add Health Record</button>
            <DeleteHealthRecordModal deleteHealthRecords={deleteHealthRecords} appointmentId={appointmentId} handleGeneralDeleteClose={handleGeneralDeleteClose} generalDeleteModal={generalDeleteModal} />
            <UploadHealthRecordModal getPatientHealthRecords={getPatientHealthRecords} patientId={patientId} patientData={patientData} handleCloseHealthModal={handleCloseHealthModal} showHealthRecord={showHealthRecord} uploadRecord={uploadRecord} />
            <ViewHealthRecordModal healthView={healthView} handleViewHealthClose={handleViewHealthClose} healthRecordsShow={healthRecordsShow} />
        </div>
    )
}

export default HealthRecordsTab