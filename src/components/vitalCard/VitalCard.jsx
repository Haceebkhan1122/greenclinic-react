import React, { useState } from 'react'
import './vitalCard.scss';
import { Accordion, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useMediaQuery } from '@mui/material';
import { RightOutlined } from "@ant-design/icons"
import VitalPatientProfileModal from '../modal/vitalPatientProfileModal/VitalPatientProfileModal';
import VitalHeart from "../../assets/images/png/vital_heart.png";
import ScanAlt from "../../assets/images/png/scan-alt.png";

const VitalCard = ({ vitalsData, patientData, vitalsCurrentDate }) => {
    const [vitalPatientProfile, setVitalPatientProfile] = useState(false);

    const vitalPatientProfileShow = () => setVitalPatientProfile(true);
    const vitalPatientProfileClose = () => setVitalPatientProfile(false);

    const isMobile = useMediaQuery('(max-width:767px)');

    const normalizedVitalsData = Array.isArray(vitalsData) ? vitalsData : vitalsData ? [vitalsData] : [];

    return (
        <>
            {!isMobile ? (
                <div className='vitalCardMain'>
                    <div className='topcardVital tw-flex tw-items-center'>
                        <img src={VitalHeart} alt="" />
                        <h4>  Vitals  </h4>
                    </div>
                    {(normalizedVitalsData?.length > 0) ? (
                        <div className="dataClass wrapeAccords">
                            <Accordion defaultActiveKey="0">
                                {normalizedVitalsData?.map((vitals, index) => (
                                    <Accordion.Item eventKey={index} key={index}>
                                        <Accordion.Header>
                                            <div className='tw-flex tw-flex-col'>
                                                <div className='accordHeader tw-flex tw-items-center'>
                                                    <h5> Vitals </h5>
                                                    <span> | </span>
                                                    <img src={ScanAlt} alt="" />
                                                    <span> Powered by Sehat Scan </span>
                                                </div>
                                                <p>{vitals?.created}</p>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ul className='accordianListing'>
                                                <li>
                                                    <p>Heart Rate</p>
                                                    <h4>{vitals?.heart_rate} <span>bpm</span></h4>
                                                </li>
                                                <li>
                                                    <p>Breathing</p>
                                                    <h4>{vitals?.respiratory_rate} <span>bpm</span></h4>
                                                </li>
                                                <li>
                                                    <p>Blood Pressure</p>
                                                    <h4>{vitals?.blood_pressure} <span>mmHg</span></h4>
                                                </li>
                                                <li>
                                                    <p>Mental Stress Index</p>
                                                    <h4>{vitals?.stress_level} <span>bpm</span></h4>
                                                </li>
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </div>
                    ) : (vitalsCurrentDate && vitalsCurrentDate?.length > 0) ? (
                        <div className="dataClass wrapeAccords">
                            <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <div className="tw-flex tw-flex-col">
                                            <div className="accordHeader tw-flex tw-items-center">
                                                <h5> Vitals </h5>
                                                <span> | </span>
                                                <img src={ScanAlt} alt="" />
                                                <span> Powered by Sehat Scan </span>
                                            </div>
                                            <p>{moment().format("MMM D, YYYY | h:mm A")}</p>
                                        </div>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul className="accordianListing">
                                            {vitalsCurrentDate.map((vitals, index) => (
                                                <li key={vitals?.index}>
                                                    <p>{vitals?.vitals_key}</p>
                                                    <h4>{vitals?.vitals_value} <span>bpm</span></h4>
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </div>
                    ) : (
                        <div className="nodataClass">
                            <div className='noData'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <g clip-path="url(#clip0_1338_6166)">
                                        <path d="M27.9272 40.5L27.9264 40.5C27.6666 40.4989 27.4081 40.4318 27.183 40.3011C26.9581 40.1705 26.7708 39.9784 26.6566 39.74C26.6564 39.7394 26.6561 39.7388 26.6558 39.7383L22.5527 31.2692H19H18.5V30.7692V29.2308V28.7308H19H23.4643H23.4664C23.7263 28.7319 23.9847 28.799 24.2099 28.9297C24.4344 29.0601 24.6215 29.2517 24.7357 29.4897L27.9002 35.9446L34.6661 20.3015L34.6663 20.3011C34.7756 20.049 34.9659 19.8451 35.1977 19.707C35.4291 19.5691 35.6969 19.4993 35.9657 19.5L35.9718 19.5L35.9718 19.5001C36.2431 19.5041 36.5121 19.5802 36.7422 19.7251C36.9728 19.8704 37.1588 20.0821 37.2602 20.3407L37.2607 20.342L40.5207 28.7308H50H50.5V29.2308V30.7692V31.2692H50L39.5368 31.2692C39.5367 31.2692 39.5365 31.2692 39.5364 31.2692H39.5357V30.7692C39.3485 30.7696 39.1659 30.7194 39.0137 30.6255C38.8615 30.5316 38.7474 30.3989 38.6875 30.2462L27.9272 40.5ZM27.9272 40.5C28.196 40.5007 28.4638 40.4309 28.6952 40.293C28.9267 40.1551 29.1167 39.9515 29.2261 39.7C29.2263 39.6996 29.2264 39.6993 29.2266 39.6989L35.9313 24.3981L27.9272 40.5Z" fill="#0F75BC" stroke="#0F75BC" />
                                        <path d="M42.0937 11.25C43.4588 11.2489 44.8105 11.5202 46.0694 12.0483C47.3283 12.5763 48.4691 13.3503 49.4249 14.325C51.3945 16.3245 52.4985 19.0184 52.4985 21.825C52.4985 24.6316 51.3945 27.3255 49.4249 29.325L29.9999 48.9938L10.5749 29.325C8.60541 27.3255 7.50142 24.6316 7.50142 21.825C7.50142 19.0184 8.60541 16.3245 10.5749 14.325C11.5314 13.351 12.6723 12.5774 13.931 12.0493C15.1898 11.5212 16.5411 11.2492 17.9062 11.2492C19.2712 11.2492 20.6226 11.5212 21.8814 12.0493C23.1401 12.5774 24.281 13.351 25.2374 14.325L29.9999 19.2L34.7437 14.3625C35.6967 13.3762 36.8387 12.5922 38.1016 12.0575C39.3645 11.5227 40.7222 11.248 42.0937 11.25ZM42.0937 7.50001C40.2292 7.49842 38.3832 7.86911 36.6639 8.59032C34.9446 9.31153 33.3866 10.3688 32.0812 11.7L29.9999 13.8L27.9187 11.7C26.6117 10.3712 25.0533 9.31577 23.3343 8.59536C21.6153 7.87495 19.7701 7.50393 17.9062 7.50393C16.0423 7.50393 14.1971 7.87495 12.4781 8.59536C10.7591 9.31577 9.20066 10.3712 7.89369 11.7C5.23472 14.4068 3.74487 18.0494 3.74487 21.8438C3.74487 25.6381 5.23472 29.2807 7.89369 31.9875L29.9999 54.375L52.1062 31.9875C54.7652 29.2807 56.255 25.6381 56.255 21.8438C56.255 18.0494 54.7652 14.4068 52.1062 11.7C50.7996 10.3704 49.2413 9.31434 47.5223 8.59324C45.8032 7.87215 43.9578 7.50052 42.0937 7.50001Z" fill="#C3CCD5" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1338_6166">
                                            <rect width="60" height="60" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <h6>No Vitals to show</h6>
                            </div>
                        </div>
                    )}
                    {(normalizedVitalsData?.length > 0 || vitalsCurrentDate?.length > 0) && (
                        <h2 className='viewHistory'>
                            <Link
                                to={{
                                    pathname: `/view-history/${patientData?.id}`,
                                }}
                                state={{
                                    vitals: normalizedVitalsData?.length > 0 ? normalizedVitalsData : vitalsCurrentDate,
                                }}
                            >
                                View History
                            </Link>
                        </h2>
                    )}
                </div>
            ) : (<Row>
                <Col xs={12} className='mb-3'>
                    <button className='box_modal'>
                        <span>Vitals</span>
                        <RightOutlined onClick={vitalPatientProfileShow} />
                    </button>
                </Col>
            </Row>)}
            <VitalPatientProfileModal vitalsData={vitalsData} vitalsCurrentDate={vitalsCurrentDate} vitalPatientProfile={vitalPatientProfile} vitalPatientProfileClose={vitalPatientProfileClose} />
        </>
    )
}

export default VitalCard
