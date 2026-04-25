/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Container } from "react-bootstrap"
import { Divider, DatePicker, TimePicker, Checkbox } from 'antd';
import dayjs from 'dayjs';
import API from '../../services/httpInstance';
import Cookies from 'js-cookie';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { Radio } from 'antd';
import isBetween from "dayjs/plugin/isBetween";
import { faBedPulse } from '@fortawesome/free-solid-svg-icons';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from 'libphonenumber-js';
import { useSelector } from 'react-redux';

const AppointmentTabs = ({ doctors,
    reports,
    isDisabled,
    setReports,
    phoneNumber,
    setPhoneNumber,
    setDoctorId,
    setDateSelect,
    doctorId,
    selectedTime,
    setSelectedTime,
    setName,
    name,
    setAge,
    age,
    gender,
    setGender,
    existingMrNumber,
    setExistingMrNumber,
    postBookAnAppointment,
    postResheduling,
    setExistPatientId,
    prefilledData,
    setCountryCode,
    countryCode,
    fromUpcomingApp,
    isRescheduling,
    dateSelect,
    setDynamicValues,
    dynamicFields,
    dynamicValues,
    appointmentData,
    setAppointmentClicked,
    appointmentClicked,
    setAppointmentData,
}) => {
    const [existingData, setExistingData] = useState();
    const [enabledDays, setEnabledDays] = useState([]);
    const [availablePatient, setAvailablePatient] = useState(false);
    const [timeOptions, setTimeOptions] = useState([]);
    const [flag, setFlag] = useState('time');
    const [isEdit, setIsEdit] = useState(false);
    const timeOrToken = Cookies.get('appointmentType');
    const [disableDates, setDisableDates] = useState([]);
    const [phoneError, setPhoneError] = useState('');
    const [searchTimer, setSearchTimer] = useState(null);

    let clinicDetails = useSelector((state) => state.clinic.clinicDetails);

    const dayMapping = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6
    };

    const handleReportChange = (e) => {
        setReports(e.target.checked ? '1' : '0');
    };


    // const handleSearch = async () => {
    //     try {
    //         console.log("Phone number going to API:", phoneNumber);
    //         const response = await API.get(`/search-patients-phone?search=${phoneNumber}`)
    //         if (response?.status == 200) {
    //             if (response?.data?.data?.patients?.length > 0) {
    //                 setAvailablePatient(true)
    //                 appointmentClicked ? setExistingMrNumber((prev) => prev) : setExistingMrNumber(response?.data?.data?.mr_no)
    //                 setExistingData(response?.data?.data?.patients)
    //             } else {
    //                 setExistingData([])
    //                 appointmentClicked ? setExistingMrNumber((prev) => prev) : setExistingMrNumber(response?.data?.data?.mr_no)
    //                 setAppointmentData({});
    //                 setDynamicValues([]);
    //                 setName("");
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // const handlePhoneNumber = (value) => {
    //     setPhoneNumber(value);
    //     if (value?.startsWith("92")) {
    //         setPhoneNumber("0" + value.slice(2));
    //     } else {
    //         setPhoneNumber(value || "");
    //     }

    //     // const value = e.target.value.replace(/\D/g, "");
    //     // setPhoneNumber(value);
    // }

    const phoneVariants = (v = "") => {
        const n = normalizePk(v);
        if (!n) return [];
        return [n, `0${n}`, `92${n}`, `+92${n}`];
    };

    const handleSearch = async (normalizedFromCaller) => {
        try {
            const variants = phoneVariants(normalizedFromCaller ?? phoneNumber);
            let lastMrNo = "";

            for (const q of variants) {
                const res = await API.get(`/search-patients-phone?search=${encodeURIComponent(q)}`);
                if (res?.status === 200) {
                    const patients = res?.data?.data?.patients ?? [];
                    lastMrNo = res?.data?.data?.mr_no ?? lastMrNo;

                    if (patients.length > 0) {
                        setAvailablePatient(true);
                        appointmentClicked
                            ? setExistingMrNumber((prev) => prev)
                            : setExistingMrNumber(lastMrNo);
                        setExistingData(patients);
                        return; // ✅ found
                    }
                }
            }

            setAvailablePatient(false);
            setExistingData([]);
            appointmentClicked
                ? setExistingMrNumber((prev) => prev)
                : setExistingMrNumber(lastMrNo);
            setAppointmentData({});
            setDynamicValues([]);
            setName("");
        } catch (e) {
            console.log(e);
        }
    };

    const normalizePk = (v = "") => {
        let s = (v || "").replace(/\D/g, "");
        if (s.startsWith("92")) s = s.slice(2);
        if (s.startsWith("0")) s = s.slice(1); 
        return s;
    };

    const handlePhoneNumber = (value) => {
        setPhoneNumber(value || "");

        const normalized = normalizePk(value || "");
        clearTimeout(searchTimer);

        if (normalized.length === 10) {
            const t = setTimeout(() => handleSearch(normalized), 250); // debounce
            setSearchTimer(t);
        } else {
            setAvailablePatient(false);
        }
    };

    useEffect(() => {
        if (prefilledData) return;
        // if (phoneNumber?.length === 11) {
        //     handleSearch();
        //     // handleSuggestions();
        // }
        // else if (phoneNumber?.length < 11) {
        //     setAvailablePatient(false);
        // }
    }, [phoneNumber, prefilledData, appointmentClicked]);

    useEffect(() => {
        const fetchTimings = async () => {
            if ((prefilledData && fromUpcomingApp) || (isRescheduling && prefilledData)) {
                setIsEdit(true);
                const docId = prefilledData?.doctor_id;
                setDoctorId(docId);
                setExistingMrNumber(prefilledData?.mr_no || prefilledData?.Arraypatient_mr_no);
                setPhoneNumber(prefilledData?.patient_phone || prefilledData?.patient_number);
                setName(prefilledData?.patient_name);
                setGender(prefilledData?.gender);
                setAge(prefilledData?.age);

                const rawDate = dayjs(prefilledData?.appointment_completed_at, "YYYY-MM-DD hh:mm a");
                const formattedDate = rawDate.format("YYYY-MM-DD");
                const formattedTime = rawDate.format("hh:mm A");

                setDateSelect(formattedDate);
                const selected = prefilledData?.token_no || prefilledData?.time;
                setSelectedTime(selected);
                if (docId && formattedDate) {
                    await getTimings(formattedDate, docId, selected);
                }
            }
        };

        fetchTimings();
    }, [prefilledData, isRescheduling]);


    useEffect(() => {
        if (appointmentClicked) {
            const docId = appointmentData?.doctor_id;
            setDoctorId(docId);
            setExistingMrNumber(appointmentData?.mr_no);
            setPhoneNumber(appointmentData?.phone);
            setName(appointmentData?.name);
            setGender(appointmentData?.gender);
            setDynamicValues(prev => ({
                ["age"]: appointmentData?.age,
                ["gender"]: appointmentData?.gender,
            }));
        }
    }, [appointmentClicked, name])


    useEffect(() => {
        const getDays = async () => {
            try {
                const response = await API.get(`/days/${doctorId}/${clinicDetails?.id || clinicDetails}`)
                if (response?.status == 200) {
                    setEnabledDays(response?.data?.data?.data);
                    setDisableDates(response?.data?.data?.disableDays);
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (doctorId) {
            getDays()
        }
    }, [doctorId])

    dayjs.extend(isBetween);

    const disabledDate = (current) => {
        if (!current) return false;

        if (current.isBefore(dayjs(), "day")) return true;

        const dayOfWeek = current.day();
        if (!(Array.isArray(enabledDays) && enabledDays.includes(
            Object.keys(dayMapping).find((key) => dayMapping[key] === dayOfWeek)
        ))) {
            return true;
        }

        if (Array.isArray(disableDates) && disableDates.length > 0) {
            for (let range of disableDates) {
                const startDate = dayjs(range.startDate);
                const endDate = dayjs(range.endDate);
                if (current.isBetween(startDate, endDate, "day", "[]")) {
                    return true;
                }
            }
        }
        return false;
    };

    const handleDateSelect = async (date, dateString) => {
        if (!isEdit) {
            setSelectedTime("");
        }

        const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
        setDateSelect(formattedDate);

        if (dateString && !isEdit) {
            await getTimings(formattedDate);
        }

        setIsEdit(false);
    };

    // const getShiftToken = async () => {
    //     try {
    //         const todayDate = dayjs().format('YYYY-MM-DD');
    //         const response = await API.get(`/shift-token?doctor_id=${doctorId}&shift_id=1&date=${todayDate}`)
    //         console.log({ response })
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const getTimings = async (selectedDate, docIdParam, prefilledTime) => {
        const docIdToUse = docIdParam || doctorId; // use state if param not passed
        if (!docIdToUse || !selectedDate) return;

        try {
            const response = await API.get(
                `/timings/${docIdToUse}?date=${selectedDate}`,
                {
                    headers: {
                        platform: 'web',
                    },
                }
            );
            if (response?.status === 200) {
                const timings = response?.data?.data?.data;
                setTimeOptions(timings);
                setFlag(response?.data?.message);

                if (timings.length > 0) {
                    if (prefilledTime && !timings.includes(prefilledTime)) {
                        setSelectedTime(prefilledTime);
                    } else if (!prefilledTime) {
                        setSelectedTime(timings[0]);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSuggestions = (item) => {
        if (item) {
            setAvailablePatient(false)
            setExistingMrNumber(item?.mr_no)
            setGender(item?.gender)
            setAge(item?.age)
            appointmentClicked ? setName(appointmentData?.name) : setName(item?.name)
            setExistPatientId(item?.id)
        } else {
            setGender(null)
            setAge(null)
            appointmentClicked ? setName(appointmentData?.name) : setName("")
            setExistPatientId(0);
        }
    }

    let user = useSelector((state) => state.user.user.id)

    useEffect(() => {
        setDoctorId(user)
        // getShiftToken()
    }, [])

    const handleDynamicChange = (key, value) => {
        setDynamicValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <Container>
            <Row>
                <Form.Group as={Col} md="6" className="mb-3 mobpt">
                    <Form.Label>Doctor*</Form.Label>
                    <Form.Select disabled={prefilledData} value={doctorId} onChange={(e) => setDoctorId(e.target.value)} aria-label="Default select example">
                        <option>Select Doctor</option>
                        {doctors?.map((doctor) => (
                            <option value={doctor?.id}>{doctor?.name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Appointment Type</Form.Label>
                    <div className='report_show'>
                        <Form.Check
                            type="radio"
                            label="Report Show"
                            id="ReportShow"
                            checked={reports == '1'}
                            disabled={prefilledData}
                            onChange={handleReportChange}
                        />
                    </div>
                </Form.Group>
                <Divider />
                <Col lg={12}>
                    <h6>Patient Details</h6>
                </Col>
                <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>MR number</Form.Label>
                    <Form.Control type="text" value={appointmentClicked ? appointmentData?.mr_no : existingMrNumber} disabled />
                </Form.Group>

                <Form.Group as={Col} md="6" className="mb-3 position-relative">
                    <Form.Label>Mobile Number*</Form.Label>
                    <PhoneInput
                        style={{
                            backgroundColor: "#F2F9FF",
                            border: "1px solid #F2F9FF",
                            width: "100%",
                        }}
                        country={'pk'}
                        value={phoneNumber}
                        international={false}
                        countryCallingCodeEditable={false}
                        onChange={handlePhoneNumber}
                        countryCodeEditable={false}
                        onBlur={() => setAvailablePatient(false)}
                        disabled={prefilledData}
                        inputProps={{
                            name: "phone",
                            autoComplete: "off",
                        }}
                    />
                    {/* <Form.Control onBlur={() => setAvailablePatient(false)} disabled={prefilledData} maxLength={11} onChange={(e) => handlePhoneNumber(e)} value={phoneNumber} type="text" placeholder="Enter Mobile Number" /> */}
                    {availablePatient && (!appointmentData?.mr_no && !appointmentData?.phone) ? (
                        <ul className='mr_number_list'>
                            {existingData?.map((item) => (
                                <li><a onMouseDown={() => handleSuggestions(item)}>{item?.phone} | {item?.name} | {item?.mr_no}</a></li>
                            ))}
                        </ul>
                    ) : null}
                    {phoneError && <div style={{ color: 'red', marginTop: 4 }}>{phoneError}</div>}
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Full Name*</Form.Label>
                    <Form.Control disabled={prefilledData} onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))} type="text" value={name} placeholder="Enter Full Name" maxLength={30} />
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                    <div className='d-flex tw-gap-2'>
                        <div>
                            <Form.Label>Date</Form.Label>
                            <DatePicker value={dateSelect ? dayjs(dateSelect, "YYYY-MM-DD") : null} format="DD/MM/YYYY" inputReadOnly={true} onChange={handleDateSelect} disabledDate={disabledDate} />
                        </div>
                        <div>
                            <Form.Label>{flag}</Form.Label>
                            <Form.Group className="mb-3 time_hk" style={{ width: '125px' }}>
                                <Form.Select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                >
                                    <option value="">{flag}</option>
                                    {!timeOptions.includes(selectedTime) && selectedTime && (
                                        <option value={selectedTime}>{selectedTime}</option>
                                    )}
                                    {timeOptions?.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                        </div>
                    </div>
                </Form.Group>
                {/* <Form.Group disabled={prefilledData} as={Col} md="6" className="mb-3">
                    <Form.Label>Gender*</Form.Label>
                    <div className="wraperGenders">
                        <Radio.Group
                            name="gender"
                            value={gender}
                            onChange={(e) => {
                                setGender(e.target.value);
                            }}
                            disabled={prefilledData}
                        >
                            <Radio value="M" id="male" disabled={prefilledData}>
                                Male
                            </Radio>
                            <Radio value="F" id="female" disabled={prefilledData}>
                                Female
                            </Radio>
                            <Radio value="O" id="other" disabled={prefilledData}>
                                Other
                            </Radio>
                        </Radio.Group>
                    </div>
                </Form.Group>
                <Form.Group as={Col} md="6" className="mb-3">
                    <Form.Label>Age*</Form.Label>
                    <Form.Control
                        disabled={prefilledData}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,2}$/.test(value)) {
                                setAge(value);
                            }
                        }}
                        value={age}
                        type="text"
                        placeholder="Enter Age"
                    />
                </Form.Group> */}

                {dynamicFields?.map((field) => {
                    const { id, dataType, key, title, options } = field;
                    const prefilledValue = prefilledData ? prefilledData[key] : undefined;

                    let normalizedGender = prefilledValue;
                    if (key == "gender") {
                        if (prefilledValue == "M" || prefilledValue == "Male") {
                            normalizedGender = "Male";
                        } else if (prefilledValue == "F" || prefilledValue == "Female") {
                            normalizedGender = "Female";
                        }
                    }

                    if (dataType == 6 && options?.length) { // Radio buttons (already implemented)
                        return (
                            <Form.Group as={Col} md="6" className="mb-3" key={id}>
                                <Form.Label>{title}</Form.Label>
                                <div className="wraperGenders">
                                    <Radio.Group
                                        name={key}
                                        disabled={prefilledData}
                                        value={normalizedGender || dynamicValues[key]}
                                        onChange={(e) => handleDynamicChange(key, e.target.value)}
                                    >
                                        {options.map((option) => (
                                            <Radio key={option.value} value={option.value}>
                                                {option.value}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </div>
                            </Form.Group>
                        );
                    }

                    if (dataType == 4) { // Number input (already implemented)
                        return (
                            <Form.Group as={Col} md="6" className="mb-3" key={id}>
                                <Form.Label>{title}</Form.Label>
                                <Form.Control
                                    type="number"
                                    disabled={prefilledData}
                                    placeholder={`Enter ${title}`}
                                    value={prefilledValue || dynamicValues[key] || ''}
                                    onChange={(e) => handleDynamicChange(key, e.target.value)}
                                />
                            </Form.Group>
                        );
                    }

                    if (dataType == 1 && options?.length) { // Dropdown (Select)
                        return (
                            <Form.Group as={Col} md="6" className="mb-3" key={id}>
                                <Form.Label>{title}</Form.Label>
                                <Form.Control
                                    as="select"
                                    disabled={prefilledData}
                                    value={prefilledValue || dynamicValues[key] || ''}
                                    onChange={(e) => handleDynamicChange(key, e.target.value)}
                                >
                                    <option value="">Select {title}</option>
                                    {options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.value}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        );
                    }

                    if (dataType == 2) { // Text Area (Message)
                        return (
                            <Form.Group as={Col} md="6" className="mb-3" key={id}>
                                <Form.Label>{title}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    disabled={prefilledData}
                                    placeholder={`Enter ${title}`}
                                    value={prefilledValue || dynamicValues[key] || ''}
                                    onChange={(e) => handleDynamicChange(key, e.target.value)}
                                />
                            </Form.Group>
                        );
                    }

                    if (dataType == 3) { // Date input
                        return (
                            <Form.Group as={Col} md="6" className="mb-3" key={id}>
                                <Form.Label>{title}</Form.Label>
                                <Form.Control
                                    type="date"
                                    disabled={prefilledData}
                                    placeholder={`Enter ${title} asdasdasd`}
                                    value={prefilledValue || dynamicValues[key] || ''}
                                    onChange={(e) => handleDynamicChange(key, e.target.value)}
                                />
                            </Form.Group>
                        );
                    }

                    if (dataType == 5) { // Text input (like mother name)
                        return (
                            <Form.Group as={Col} md="6" className="mb-3" key={id}>
                                <Form.Label>{title}</Form.Label>
                                <Form.Control
                                    type="text"
                                    disabled={prefilledData}
                                    placeholder={`Enter ${title}`}
                                    value={prefilledValue || dynamicValues[key] || ''}
                                    onChange={(e) => handleDynamicChange(key, e.target.value)}
                                />
                            </Form.Group>
                        );
                    }

                    return null;
                })}


            </Row>
            <Divider />
            {prefilledData ? (
                <div className='btn_wrap ss trt'>
                    <button onClick={() => postResheduling(prefilledData, 0)} className='button1' disabled={isDisabled}>Save</button>
                    <button onClick={() => postResheduling(prefilledData, 1)} className='button2' disabled={isDisabled}>Print</button>
                </div>
            ) :
                <div className='btn_wrap ss trt'>
                    <button onClick={postBookAnAppointment} className='button1' disabled={isDisabled}>Save</button>
                    <button onClick={() => postBookAnAppointment('1')} className='button2' disabled={isDisabled}>Print</button>
                </div>
            }

        </Container>
    )
}

export default AppointmentTabs;