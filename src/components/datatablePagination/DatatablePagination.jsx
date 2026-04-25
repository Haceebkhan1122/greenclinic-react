
import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { customers } from '../../services/data';

const PaginatedDatatable = () => {

    // const [customers, setCustomers] = useState([]);

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;


    return (
        <div className="table__wrape tablePrime">
            <DataTable value={customers} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate=" CurrentPageReport PrevPageLink NextPageLink"
                currentPageReportTemplate="{first} - {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                <Column field="name" header="Date Sent" style={{ width: '25%' }} sortable></Column>
                <Column field="country" header="Time" style={{ width: '25%' }} sortable></Column>
                <Column field="company" header="Request Status" style={{ width: '25%' }} sortable></Column>
                <Column field="representative" header="Requested Plan" style={{ width: '25%' }} sortable></Column>
            </DataTable>
        </div>
    );
}

export default PaginatedDatatable;
