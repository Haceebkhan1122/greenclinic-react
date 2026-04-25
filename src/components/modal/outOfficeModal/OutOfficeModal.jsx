import React, { useEffect, useState } from 'react'
import { DatePicker, Divider } from 'antd';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import Close from "../../../assets/images/svg/close_search.svg";
import "./outOfficeModal.scss"
import moment from 'moment';

const OutOfficeModal = ({ outOfficeShow,
  handleOutOfficeClose,
  doctors,
  setLeftDoctorId,
  setStartDate,
  setEndDate,
  startDate,
  onlyNewAppt,
  setOnlyNewAppt,
  newAndExistingAppt,
  setNewAndExistingAppt,
  setIsDeclined,
  isDeclined,
  setLeaveMessage,
  leaveMessage,
  saveLeftDoctor,
  buttonDisabled,
  formattedEndDate,
  setFormattedEndDate,
  leftDoctorId,
  leaveEntryData,
  // deleteSelectiveDate,
  // deleteSpecificDate,
  updateSelectiveDate,
  updateSpecificDate,
  setFormattedStartDate,
  formattedStartDate
}) => {

  const handleDecline = (e) => {
    const checked = e.target.checked ? 1 : 0;
    setIsDeclined(checked);

    if (!checked) {
      setOnlyNewAppt(0);
      setNewAndExistingAppt(0);
    } else {
      setOnlyNewAppt(1);
      setNewAndExistingAppt(0);
    }
  };

  const handleOptionChange = (e) => {
    if (e.target.id === "new_appointments") {
      setOnlyNewAppt(1);
      setNewAndExistingAppt(0);
    } else {
      setOnlyNewAppt(0);
      setNewAndExistingAppt(1);
    }
  };

  const handleStartDate = (date) => {
    if (date) {
      setStartDate(date.format("DD/MM/YYYY"));
      setFormattedStartDate(date.format("DD/MM/YYYY"));
    } else {
      setStartDate(null);
      setFormattedStartDate("");
    }
  };

  const handleEndDate = (date) => {
    if (date) {
      setEndDate(date.format("DD/MM/YYYY"));
      setFormattedEndDate(date.format("DD/MM/YYYY"));
    } else {
      setEndDate(null);
      setFormattedEndDate("");
    }
  };

  const disabledStartDate = (current) => {
    return current && current.isBefore(moment().startOf("day"));
  };

  const disabledEndDate = (current) => {
    if (!current) return false;
  
    const today = moment().startOf("day");
  
    if (!startDate) {
      return current.isBefore(today);
    }
  
    const start = moment(startDate).startOf("day");
  
    if (current.isBefore(today)) return true;
    return current.isBefore(start);
  };
  
  useEffect(() => {
    if (leaveEntryData) {
      setIsDeclined(leaveEntryData.automatically_decline_all_appt);
      setOnlyNewAppt(leaveEntryData.only_new_appt);
      setNewAndExistingAppt(leaveEntryData.new_and_existing);
    }
  }, [leaveEntryData]);

  useEffect(() => {
    if (leaveEntryData && doctors?.length > 0) {
      const selected = doctors.find((d) => d.name === leaveEntryData.doctor_name);
      if (selected) {
        setLeftDoctorId(selected.id);
      }
    } else {
      setLeftDoctorId('');
    }
  }, [leaveEntryData, doctors]);

  useEffect(() => {
    if (doctors?.length == 1 && !leftDoctorId) {
      setLeftDoctorId(doctors[0]?.id);
    }
  }, [doctors]);

  const dateFormatList = ['DD/MM/YY'];
  return (
    <Modal className='modal_appointment outofoffice' show={outOfficeShow} onHide={handleOutOfficeClose} centered>
      <Modal.Body>
        <button className='close' onClick={handleOutOfficeClose}>
          <img src={Close} alt="" />
        </button>
        <h4>Out of Office</h4>
        <Row>
          <Form.Group as={Col} md="6" className="mb-3">
            <Form.Label>Doctor*</Form.Label>
            <Form.Select
              disabled={!!leaveEntryData}
              value={String(leftDoctorId)}
              onChange={(e) => setLeftDoctorId(e.target.value)}
              aria-label="Default select example"
            >
              <option disabled value="">Select Doctor</option>
              {doctors?.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </Form.Select>


          </Form.Group>
          <Col lg={5}></Col>
          <Col lg={12}>
            <h6>From</h6>
          </Col>
          <Form.Group as={Col} md="6" xs="6" className="mb-3">
            <Form.Label>Date</Form.Label>
            <DatePicker
              placeholder={formattedStartDate ? moment(formattedStartDate).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')}
              suffixIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M4.85156 7.37891L9.85156 12.3789L14.8516 7.37891"
                    stroke="#5E6366"
                    strokeWidth="1.69847"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              inputReadOnly={true} onChange={handleStartDate} disabledDate={disabledStartDate} format="DD/MM/YYYY" />
          </Form.Group>
          <Form.Group as={Col} md="6" xs="6" className="mb-3">
            <Form.Label>Date</Form.Label>
            <DatePicker
              placeholder={formattedEndDate ? moment(formattedEndDate).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY')}
              // defaultValue={formattedEndDate ? moment(formattedEndDate, "YYYY-MM-DD") : null}
              suffixIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M4.85156 7.37891L9.85156 12.3789L14.8516 7.37891"
                    stroke="#5E6366"
                    strokeWidth="1.69847"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              inputReadOnly={true} onChange={handleEndDate} disabledDate={disabledEndDate} format="DD/MM/YYYY" />
          </Form.Group>
        </Row>
        <Divider />
        <Row>
          <Col xs={12} lg={6}>
            <div className="automatically_wrap">
              <Form.Check
                type="checkbox"
                id="decline"
                label="Automatically decline all appointments"
                onChange={handleDecline}
                checked={isDeclined === 1}
              />

              <ul>
                <li>
                  <Form.Check
                    type="radio"
                    id="new_appointments"
                    label="Only New Appointments"
                    name="group1"
                    checked={onlyNewAppt === 1}
                    onChange={handleOptionChange}
                  />
                </li>
                <li>
                  <Form.Check
                    type="radio"
                    id="existing_appointments"
                    label="New and Existing Appointments"
                    name="group1"
                    checked={newAndExistingAppt === 1}
                    onChange={handleOptionChange}
                  />
                </li>
              </ul>
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={250}
                placeholder="Enter message here"
                // disabled={!!leaveEntryData}
                value={leaveEntryData ? leaveEntryData.absence_reason : leaveMessage}
                onChange={(e) => setLeaveMessage(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <div className='justify-content-end d-flex'>
            <button disabled={buttonDisabled} onClick={() => {
              if (updateSelectiveDate) {
                updateSpecificDate();
              }
              else {
                saveLeftDoctor();
              }
            }} className='saveButton'>Save</button>
          </div>
        </Row>
      </Modal.Body>
    </Modal>
  )
}

export default OutOfficeModal