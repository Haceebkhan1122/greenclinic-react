import React from 'react'
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { message } from '../../services/data/indexMessage';
import "./messagesTab.scss"

const MessagesTab = ({messages,pagination,getMessages}) => {
        const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
        const paginatorRight = <Button type="button" icon="pi pi-download" text />;
        const onPageChange = (event) => {
            const selectedPage = event.page + 1; 
            getMessages(selectedPage);
          };

    return (
        <div className='messageTab'>
            <div className="table__wrape tablePrime">
                <DataTable 
               value={messages}
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
                    <Column field="message" header="Message" style={{ width: '30%' }} sortable></Column>
                    <Column field="date" header="Date" style={{ width: '16%' }} sortable></Column>
                </DataTable>
            </div>
        </div>
    )
}

export default MessagesTab