import React, { useState, useEffect } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import Loader from '../../components/loader/Loader';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import { DatePicker, Select } from 'antd';
import API from '../../services/httpInstance';
import { Row, Col, Form, Table } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/fontawesome-free-solid';
import { useMediaQuery } from '@uidotdev/usehooks';
import "./auditLog.scss"

const { Option } = Select;

const AuditLog = () => {
    const [indicationMessage, setIndicationMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDate, setIsDate] = useState(null)
    const [auditUsers, setAuditUsers] = useState([])
    const [auditModules, setAuditModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [filterUsers, setFilterUsers] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState("1");
    const [paginateCountData, setPaginateCountData] = useState(null);
    const [waitForApiResponse, setWaitForApiResponse] = useState(true);
    const isMobile = useMediaQuery('(max-width:767px)');

    const getAudit = async () => {
        try {
            setIsLoading(true);
            const response = await API.get("/audit-log")
            if (response?.status == 200) {
                setAuditUsers(response?.data?.auditUsers)
                setAuditModules(response?.data?.auditModules);
            }
        } catch (error) {
            setIndicationMessage(error)
        } finally {
            setIsLoading(false);
        }
    }

    const handlePageClick = (selectedPage) => {
        setCurrentPage(selectedPage.selected + 1);
    };

    const getAuditLogs = async () => {
        try {
            const params = new URLSearchParams();

            if (selectedModules && selectedModules.length > 0) {
                selectedModules.forEach((mod) => {
                    params.append("search_by_module[]", mod);
                });
            }

            if (filterUsers) {
                params.append("search_by_user", filterUsers);
            }

            if (isDate) {
                const formattedDate = moment(isDate).format("YYYY-MM-DD");
                params.append("date", formattedDate);
            }

            params.append("page", currentPage);

            const response = await API.get(`/audit-log?${params.toString()}`);
            setWaitForApiResponse(true);

            if (response?.status === 200) {
                const calculatedTotalPages = Math.ceil(
                    response?.data?.pagination?.total / response?.data?.pagination?.per_page
                );
                setTotalPages(calculatedTotalPages);
                setAuditLogs(response?.data?.auditLogs);
                setCurrentPage(response?.data?.pagination?.current_page);
                setPaginateCountData(response?.data?.pagination);
            }
        } catch (error) {
            setIndicationMessage(error);
        }
    };

    const handlePrevDate = () => {
        if (isDate) {
            setIsDate(dayjs(isDate, "YYYY/MM/DD").subtract(1, "day").format("YYYY/MM/DD"));
        }
    };

    const handleNextDate = () => {
        if (isDate) {
            setIsDate(dayjs(isDate, "YYYY/MM/DD").add(1, "day").format("YYYY/MM/DD"));
        }
    };

    const handleDateChange = (date) => {
        if (!date) {
            setIsDate(null); // Clear the state when the date is removed
            return;
        }

        let formatDate = dayjs(date).format("YYYY/MM/DD");
        setIsDate(formatDate);
    };

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    useEffect(() => {
        getAudit()
    }, [])

    useEffect(() => {
        setCurrentPage(1);
    }, [filterUsers, selectedModules, isDate]);

    useEffect(() => {
        getAuditLogs()
        setWaitForApiResponse(false)
    }, [filterUsers, selectedModules, isDate, currentPage])
    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            {isLoading ? <Loader /> : (
                <WraperLayout className="audit_log">
                    {!isMobile ? (
                        <div className="box-white">
                            <div className="top_wrap">
                                <Row className="align-items-center">
                                    <Col lg={2}>
                                        <div className="wraper_date">
                                            <span className='left_arrow' onClick={handlePrevDate}></span>
                                            <DatePicker
                                                value={isDate ? dayjs(isDate, "YYYY-MM-DD") : null}
                                                inputReadOnly={true}
                                                format="YYYY-MM-DD"
                                                allowClear={false}
                                                onChange={handleDateChange}
                                                placeholder="Select Date"
                                                name="dob"
                                            />
                                            <span className='right_arrow' onClick={handleNextDate}></span>
                                        </div>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Select
                                            aria-label="Default select example"
                                            className='selectSty'
                                            value={filterUsers}
                                            onChange={(e) => setFilterUsers(e.target.value)}
                                        >
                                            <option value="" disabled selected>Select User</option>
                                            {auditUsers.map((auditUser) => (
                                                <option value={auditUser.name} key={auditUser.user_id}>
                                                    {auditUser.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col lg={4}>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Select Module"
                                            value={selectedModules}
                                            onChange={(value) => setSelectedModules(value)}
                                        >
                                            {auditModules.map((auditModule) => (
                                                <Option key={auditModule} value={auditModule}>
                                                    {auditModule}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                            <div className="bottom_wrap">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>User</th>
                                            <th>Module</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {auditLogs.length === 0 ? (<tr><td colSpan="6" className='text-center'>No Audit found</td></tr>) : (
                                            auditLogs.map((auditLog) => (
                                                <tr key={auditLog.id}>
                                                    <td>{auditLog.date}</td>
                                                    <td>{auditLog.user}</td>
                                                    <td>{auditLog.module}</td>
                                                    <td>{auditLog.action}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                            <div className='boxBtn'>
                                {totalPages > 1 ? (
                                    <>
                                        <div className='countPagination'>
                                            {paginateCountData?.current_page}
                                        </div>
                                        <ReactPaginate
                                            previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                                            nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                                            breakLabel={null}
                                            pageCount={totalPages}
                                            pageRangeDisplayed={0}
                                            marginPagesDisplayed={0}
                                            onPageChange={handlePageClick}
                                            containerClassName={"pagination_hk"}
                                            previousClassName={`prev_item ${!waitForApiResponse ? "disabled" : ""}`}
                                            nextClassName={`next_item ${!waitForApiResponse ? "disabled" : ""}`}
                                            previousLinkClassName={"previousLink"}
                                            nextLinkClassName={"medical_next_link"}
                                            forcePage={currentPage - 1}
                                            renderOnZeroPageCount={null}
                                            disabledClassName={"disabled"}
                                        />
                                        <div className='countPagination'>
                                            {paginateCountData?.last_page}
                                        </div>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div className='box-white'>
                            <div className="top_wrap">
                                <Row className="align-items-center">
                                    <Col lg={2}>
                                        <div className="wraper_date">
                                            <span className='left_arrow' onClick={handlePrevDate}></span>
                                            <DatePicker
                                                value={isDate ? dayjs(isDate, "YYYY-MM-DD") : null}
                                                inputReadOnly={true}
                                                format="YYYY-MM-DD"
                                                allowClear={false}
                                                onChange={handleDateChange}
                                                placeholder="Select Date"
                                                name="dob"
                                            />
                                            <span className='right_arrow' onClick={handleNextDate}></span>
                                        </div>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Select
                                            aria-label="Default select example"
                                            className='selectSty'
                                            value={filterUsers}
                                            onChange={(e) => setFilterUsers(e.target.value)}
                                        >
                                            <option value="" disabled selected>Select User</option>
                                            {auditUsers.map((auditUser) => (
                                                <option value={auditUser.name} key={auditUser.user_id}>
                                                    {auditUser.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Col>
                                    <Col lg={4}>
                                        <Select
                                            mode="multiple"
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Select Module"
                                            value={selectedModules}
                                            onChange={(value) => setSelectedModules(value)}
                                        >
                                            {auditModules.map((auditModule) => (
                                                <Option key={auditModule} value={auditModule}>
                                                    {auditModule}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Col>
                                </Row>
                            </div>
                            <div className="bottom-wrap">
                                {auditLogs.length === 0 ? (<div className='text-center'> No Audit found</div>) : (
                                    auditLogs.map((auditLog) => (
                                        <div className="card">
                                            <span>{auditLog?.date}</span>
                                            <div className="d-flex tw-justify-between">
                                                <h4>{auditLog?.user}</h4>
                                                <p>Update Profile</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>)}
                </WraperLayout>
            )}
        </>

    )
}

export default AuditLog