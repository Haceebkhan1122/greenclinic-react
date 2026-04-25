import React from 'react'
import { Col, Modal, Row, Accordion } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png"
import "./labReadingsPatientProfileModal.scss"
import API from '../../../services/httpInstance'

const LabReadingsPatientProfileModal = ({ labReadingsPatientProfileClose, labReadingsPatientProfile, labReadings }) => {
    const uniqueTitles = labReadings.length > 0
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
        <Modal className='labReadingPatientProfile' show={labReadingsPatientProfile} onHide={labReadingsPatientProfileClose}>
            <Modal.Body>
                <h2><img src={ArrowBack} alt="" onClick={labReadingsPatientProfileClose} />Lab Reading</h2>
                <Row>
                    <Col xs={12}>
                        <div className="card">
                            <Accordion defaultActiveKey="0">
                                {uniqueTitles?.map((title, index) => {
                                    const readingData = labReadings?.map((reading) => {
                                        const matchingItem = reading.data.find(item => item.title === title);
                                        return matchingItem ? matchingItem.value : "-";
                                    });

                                    return (
                                        <Accordion.Item eventKey={String(index)} key={index}>
                                            <Accordion.Header>{title || "Untitled"}</Accordion.Header>
                                            <Accordion.Body>
                                                {readingData?.length > 0 ? (
                                                    <ul>
                                                        {readingData?.map((value, i) => (
                                                            <li key={i}>{value}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p>No data available</p>
                                                )}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    );
                                })}
                            </Accordion>
                        </div>
                    </Col>
                </Row>
                <div className="box-fixed">
                    <button onClick={() => printDownloadCsv()} className='button2'>DOWNLOAD CSV</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default LabReadingsPatientProfileModal