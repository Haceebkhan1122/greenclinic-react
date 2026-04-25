import React, { useEffect, useState } from 'react'
import { Row, Col, Table } from "react-bootstrap"
import "./labReadingTabOffline.scss"
import API from '../../../services/httpInstance';

const LabReadingTabOffline = ({ formattedDate, patientId, setLabReadingSlug }) => {
    const [labReading, setLabReading] = useState([]);

    const getLabReading = async () => {
        try {
            const response = await API.get(`/lab-reading-filter?patient_id=${patientId}&date=${formattedDate}`)
            // console.log(response?.data?.data, "lab Reading")
            setLabReading(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getLabReading()
    }, [])

    useEffect(() => {
        if (labReading) {
            const prefilledData = labReading?.map((item) => ({
                id: item?.id,
                value: item?.value || "", // Use existing value or empty
                additionalValue: "" // Empty second column field
            }));
            setLabReadingSlug(prefilledData);
        }
    }, [labReading]);

    const handleInputChange = (id, value) => {
        setLabReadingSlug((prevList) => {
            const existingIndex = prevList.findIndex((obj) => obj.id === id);

            if (existingIndex !== -1) {
                // Update existing object
                const updatedList = [...prevList];
                updatedList[existingIndex] = { id, value };
                return updatedList;
            } else {
                // Add new object only if value is not empty
                return value ? [...prevList, { id, value }] : prevList;
            }
        });
    };

    const groupedReadings = Array.isArray(labReading)
        ? labReading.reduce((acc, item) => {
            if (!acc[item.title]) {
                acc[item.title] = [];
            }
            acc[item.title].push(item);
            return acc;
        }, {})
        : {};

    return (
        <div className='lab_reading_offline'>
            <Row>
                <Col lg={12}>
                    <h3>New Investigation</h3>
                    <Table responsive>
                        <tbody>
                            {(() => {
                                // Get max number of readings where values are not null/empty
                                const maxColumns = Math.max(
                                    ...Object.values(groupedReadings).map((items) =>
                                        items.filter((item) => item?.value !== null && item?.value !== "").length
                                    ),
                                    1
                                );

                                return (
                                    <>
                                        {/* Date Row - Only show columns when data exists */}
                                        <tr>
                                            <td><p>Date</p></td>
                                            {Array.from({ length: maxColumns }).map((_, index) => {
                                                const dateValue = Object.values(groupedReadings)
                                                    .flat()
                                                    .filter(item => item?.value !== null && item?.value !== "")[index]?.date;

                                                return dateValue ? (
                                                    <td key={`date-${index}`}>
                                                        <input type="text" value={dateValue} readOnly />
                                                    </td>
                                                ) : (
                                                    <td key={`empty-date-${index}`}>
                                                        <input type="text" value={formattedDate} readOnly />
                                                    </td>
                                                );
                                            })}
                                        </tr>


                                        {/* Dynamic Rows */}
                                        {Object.entries(groupedReadings).map(([title, items]) => {
                                            // Filter out items that have null/empty values
                                            const validItems = items.filter(item => item?.value !== null && item?.value !== "");

                                            return (
                                                <tr key={title}>
                                                    <td><p>{title}</p></td>

                                                    {/* Display only non-null values */}
                                                    {validItems.map((item) => (
                                                        <td key={item.id}>
                                                            <input type="text" value={item?.value} readOnly />
                                                        </td>
                                                    ))}

                                                    {/* Ensure alignment by filling in missing columns */}
                                                    {Array.from({ length: maxColumns - validItems.length }).map((_, index) => (
                                                        <td key={`empty-${title}-${index}`} style={{ display: 'none' }}></td>
                                                    ))}

                                                    {/* Empty Column for New Input */}
                                                    <td>
                                                        <input type="text" onChange={(e) => handleInputChange(items?.[0]?.id, e.target.value)} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                );
                            })()}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    )
}

export default LabReadingTabOffline