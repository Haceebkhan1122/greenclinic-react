import React from 'react'
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import "./labReading.scss";
import API from '../../services/httpInstance';

const LabReading = ({ labReadings }) => {
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    const uniqueTitles = labReadings.length > 0 && labReadings[0].data 
        ? labReadings[0].data.map((item) => item.title) 
        : [];

        const printDownloadCsv = async (id) => {
            try {
              const response = await API.get(`/lab-reading-csv`)
              if (response?.status == 200) {
                const pdfUrl = response.data?.data;
                window.open(pdfUrl, "_blank");
              }
            } catch (error) {
              console.log(error)
            }
          }

    return (
        <div className='labReadingTab'>
            <div className="table__wrape tablePrime">
                <DataTable
                    value={uniqueTitles} 
                    paginator
                    rows={9}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: "50rem" }}
                    paginatorTemplate=" CurrentPageReport PrevPageLink NextPageLink"
                    currentPageReportTemplate="{first} - {last} of {totalRecords}"
                    paginatorLeft={paginatorLeft}
                    paginatorRight={paginatorRight}
                >
                    <Column
                        header="Title"
                        body={(rowData) => rowData} 
                        style={{ width: "20%" }}
                    />
                    {Array.isArray(labReadings) && labReadings.length > 0 && labReadings.map((reading, colIndex) => (
                        <Column
                            key={colIndex}
                            header={reading.formated_date || "No Date"}
                            body={(rowData) => {
                                const matchingItem = reading.data.find((item) => item.title === rowData);
                                return matchingItem?.value || "-";
                            }}
                            style={{ width: "20%" }}
                        />
                    ))}
                </DataTable>
            </div>
            <button onClick={() => printDownloadCsv()} className='add_btn'>Download CSV</button>
        </div>
    )
}

export default LabReading