import { Col, Form, Row, Tab, Table, Tabs } from 'react-bootstrap';
import './examinationTabOffline.scss';
import { Link } from 'react-router-dom';
import API from '../../../services/httpInstance';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const ExaminationTabOffline = ({ appointmentId, isDiagnosis, vitalList, defaultVitals, setDefaultVitals, examinationList, setVitalList, patientId, examslug, clinicId, doctorId, setExamslug, vitalArray, setVitalArray, setDefaultVitalArray, defaultVitalArray }) => {
    const [currentDiagnosis, setCurrentDiagnosis] = useState([]);
    const [pastMedical, setPastMedical] = useState([]);
    const [familyHistory, setFamilyHistory] = useState([]);
    const [surgicalHistory, setSurgicalHistory] = useState([]);
    const [allergies, setAllergies] = useState([]);
    const [quickList, setQuickList] = useState([])
    const [listingValue, setListingValue] = useState(null)
    const [selectDiagnosis, setSelectDiagnosis] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectCategory, setSelectCategory] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [status, setStatus] = useState(null);
    const [postData, setPostData] = useState('')

    const handlePostData = (e) => {
        setPostData(e.target.value)
    }

    const handleSelectCategory = (e) => {
        setSelectCategory(e.target.id)
        setPostData('')
        setSearchQuery('')
        if (e.target.id == 'indications' || e.target.id == 'pastMedicalHistory') {
            getListingValue();
        }
    }

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);

        if (isDropdownOpen) {
            setListingValue([]);
        }
    };


    // get patient data
    const getPatientData = async () => {
        try {
            const response = await API.get(`/patient-data?patientId=${patientId}`)
            if (response.status == 200) {
                setCurrentDiagnosis(response?.data?.data)
                setPastMedical(response?.data?.data)
                setFamilyHistory(response?.data?.data)
                setSurgicalHistory(response?.data?.data)
                setAllergies(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // get delete diagnosis
    const deleteCurrentDiagnosis = async (id) => {
        try {
            const response = await API.delete(`/delete-diagnosis?id=${id}&patient_id=${patientId}`)
            if (response.status == 200) {
                await getPatientData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    // get quick list 
    const getQuickList = async () => {
        try {
            const response = await API.get("/quick_tag")
            setQuickList(response?.data?.data)
        } catch (error) {
            console.log(error)
        }
    }

    // get listing search 
    const getListingValue = async (query = null) => {
        const searchTerm = query !== null ? query : searchQuery;
        try {
            const response = await API.get(`/search-diagnosis?search=${searchTerm}`);
            setListingValue(response?.data?.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchQuery = (e) => {
        setSearchQuery(e.target.value);
    };
    // get checkbox change
    const handleCheckboxValue = (item) => {
        setSelectDiagnosis((prevSelected) => {
            if (!Array.isArray(prevSelected)) prevSelected = [];

            const isAlreadySelected = prevSelected.some((selectedItem) => selectedItem.diagnosis_id == item.id);

            if (isAlreadySelected) {
                return prevSelected.filter((selectedItem) => selectedItem.diagnosis_id !== item.id);
            } else {
                return [
                    ...prevSelected,
                    {
                        patient_id: patientId,
                        doctor_id: doctorId,
                        clinic_id: clinicId,
                        appointment_id: appointmentId,
                        diagnosis_id: item.id,
                        status: selectCategory == 'indications' ? 1 : 0,
                    },
                ];
            }
        });
    };

    // get status
    const changeStatus = (item, source) => {
        const newStatus = source === 'currentDiagnosis' ? 0 : 1;
        patchDiagnosis(item, newStatus, source);
    };

    // get add newKeyword
    const addNewKeyword = async () => {
        const payload = {
            patient_id: patientId,
            clinic_id: clinicId,
            status: selectCategory == 'indications' ? 1 : 0,
            title: searchQuery,
            appointment_id: appointmentId,
            doctor_id: doctorId,
        }
        if (searchQuery && (!listingValue || listingValue.length === 0)) {
            try {
                const response = await API.post('/add-doc-diagnosis', payload);
                if (response.status == 200) {
                    setSearchQuery('')
                    setIsDropdownOpen()
                    getListingValue();
                    setSelectDiagnosis([])
                    getPatientData();
                }
            } catch (error) {
                console.error('Error', error);
            }
        } else if ((searchQuery || !searchQuery) && selectDiagnosis) {
            const keywordPayload = {
                patient_id: patientId,
                clinic_id: clinicId,
                status: selectCategory == 'indications' ? 1 : 0,
                title: searchQuery,
                appointment_id: appointmentId,
                doctor_id: doctorId,
                diagnosis: selectDiagnosis,
            }
            try {
                const response = await API.post('/add-diagnosis', keywordPayload);
                if (response.status == 200) {
                    setSearchQuery('')
                    setIsDropdownOpen()
                    getListingValue();
                    setSelectDiagnosis([])
                    getPatientData();
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
    };

    // get add history
    const addHistory = async () => {
        const payload = {
            patient_id: patientId,
            clinic_id: clinicId,
            status: 0,
            title: postData,
            appointment_id: appointmentId,
            doctor_id: doctorId,
        }

        // API call for familyHistory
        if (selectCategory === 'familyHistory') {
            try {
                const response = await API.post(`/add-family-history`, payload)
                if (response?.status == 200) {
                    await getPatientData()
                    setPostData('')
                }
            } catch (error) {
                console.log(error)
            }
        }
        // API call for surgicalHistory
        if (selectCategory === 'surgicalHistory') {
            try {
                const response = await API.post(`/add-surgical-history`, payload)
                if (response?.status == 200) {
                    await getPatientData()
                    setPostData('')
                }
            } catch (error) {
                console.log(error)
            }
        }

        // API call for allergies
        if (selectCategory === 'allergies') {
            try {
                const response = await API.post(`/add-allergies`, payload)
                if (response?.status == 200) {
                    await getPatientData()
                    setPostData('')
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    // get patch diagnosis
    const patchDiagnosis = async (item, status, source) => {
        const payload = {
            patient_id: patientId,
            doctor_id: doctorId,
            diagnosis_id: item.diagnosis_id,
            status,
        };

        try {
            const response = await API.patch('/status-diagnosis', payload);

            if (response?.status === 200) {
                if (source === 'currentDiagnosis') {
                    setCurrentDiagnosis(prev => {
                        const updatedList = prev[0].list.filter(d => d.id !== item.id);
                        return [{ ...prev[0], list: updatedList }];
                    });

                    setPastMedical(prev => {
                        const pastEntry = prev[1] ?? { list: [] };
                        const updatedPast = [...pastEntry.list, { ...item, status: 0 }];
                        const copy = [...prev];
                        copy[1] = { ...pastEntry, list: updatedPast };
                        return copy;
                    });
                }

                else if (source === 'pastMedical') {
                    setPastMedical(prev => {
                        const pastEntry = prev[1] ?? { list: [] };
                        const updatedPast = pastEntry.list.filter(d => d.id !== item.id);
                        const copy = [...prev];
                        copy[1] = { ...pastEntry, list: updatedPast };
                        return copy;
                    });

                    setCurrentDiagnosis(prev => {
                        const currentEntry = prev[0] ?? { list: [] };
                        const updatedCurrent = [...currentEntry.list, { ...item, status: 1 }];
                        return [{ ...currentEntry, list: updatedCurrent }];
                    });
                }

                await getPatientData();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    // delete past medical
    const deletePastMedical = async (id) => {
        try {
            const response = await API?.delete(`/delete-diagnosis-past?id=${id}&patient_id=${patientId}`)
            if (response.status == 200) {
                await getPatientData()
            } else {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // delete family medical
    const deleteFamilyMedical = async (id) => {
        try {
            const response = await API?.delete(`/delete-family-history?id=${id}`)
            if (response.status == 200) {
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                await getPatientData()
            } else {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // delete surgical history
    const deleteSurgicalHistory = async (id) => {
        try {
            const response = await API?.delete(`/delete-surgical-history?id=${id}`)
            if (response.status == 200) {
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                await getPatientData()
            } else {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    // delete allergies
    const deleteAllergies = async (id) => {
        try {
            const response = await API?.delete(`/delete-allergies?id=${id}`)
            if (response.status == 200) {
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                await getPatientData()
            } else {
                toast.error(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAllergiesStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 0 ? 1 : 0;
        try {
            const response = await API.patch('/status-allergies', {
                id,
                status: newStatus,
                patientId: patientId
            });

            if (response?.status === 200) {
                setAllergies(prevAllergie => {
                    return prevAllergie.map((section, index) => {
                        if (index === 3) {
                            return {
                                ...section,
                                list: section.list.map(item =>
                                    item.id === id ? { ...item, status: newStatus } : item
                                )
                            };
                        }
                        return section;
                    });
                });
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleFamilyHistory = async (id, currentStatus) => {
        const newStatus = currentStatus === 0 ? 1 : 0;
        try {
            const response = await API.patch(`/status-family`, {
                id,
                status: newStatus,
                patientId: patientId
            })
            if (response.status == 200) {
                setFamilyHistory(prevHistory => {
                    const updatedFamilyHistory = prevHistory[2]?.list.map(item => {
                        if (item.id === id) {
                            return { ...item, status: newStatus };
                        }
                        return item;
                    });
                    const updatedHistory = [...prevHistory];
                    updatedHistory[2].list = updatedFamilyHistory;
                    return updatedHistory;
                });
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            getPatientData();
        }, 10000);

        getQuickList();

        return () => clearInterval(interval); // cleanup on unmount
    }, []);

    useEffect(() => {
        getListingValue();
    }, [searchQuery])

    // Handler functions for updating examslug array
    const handleValueChange = (slug, newValue) => {
        const updatedExamslug = examslug.map(item =>
            item.slug === slug ? { ...item, value: newValue } : item
        );
        setExamslug(updatedExamslug);
    };

    const handleCheckboxChange = (slug, value) => {
        const updatedExamslug = examslug.map(item => {
            if (item.slug === slug) {
                const newValue = item.value.includes(value)
                    ? item.value.filter(val => val !== value)
                    : [...item.value, value];
                return { ...item, value: newValue };
            }
            return item;
        });
        setExamslug(updatedExamslug);
    };

    const handleRadioChange = (slug, value) => {
        const updatedExamslug = examslug.map(item =>
            item.slug === slug ? { ...item, value } : item
        );
        setExamslug(updatedExamslug);
    };

    const mergedVitals = [...vitalList, ...defaultVitals];

    return (
        <div className='examinationTabOffline'>
            <div className='examinationConsultNowTab tw-w-full'>
                <Row className='h-100'>
                    {(vitalList?.length > 0 || defaultVitals?.length) > 0 && (
                        <Col lg={(examinationList?.length > 0 && Array.isArray(isDiagnosis) && isDiagnosis.length > 0) ? 4 : (examinationList?.length > 0 || (Array.isArray(isDiagnosis) && isDiagnosis.length > 0)) ? 6 : 12} style={{ borderRight: "1px solid #D3DEE9" }}>
                            <div className='vitalHead tw-flex tw-justify-between tw-items-center'>
                                <h3> Vitals </h3>
                                <Link to={`/view-history/${patientId}`}><span> View History </span></Link>
                            </div>
                            {/* <ul>
                            {mergedVitals?.map((item) => (
                                <li key={item?.id}>
                                    <label htmlFor="">{item?.title}</label>
                                    <input
                                        type="text"
                                        value={item?.value}
                                        onChange={(e) => {
                                            const updatedValue = e.target.value;

                                            const isVitalList = vitalList?.length > 0;

                                            if (isVitalList) {
                                                setVitalList((prevList) =>
                                                    prevList.map((i) =>
                                                        i.id === item.id ? { ...i, value: updatedValue } : i
                                                    )
                                                );
                                            } else {
                                                setDefaultVitals((prevList) =>
                                                    prevList.map((i) =>
                                                        i.id === item.id ? { ...i, value: updatedValue } : i
                                                    )
                                                );
                                            }

                                            if (isVitalList) {
                                                setVitalArray((prevArray) =>
                                                    prevArray.map((vital) =>
                                                        vital.slug === item.slug ? { ...vital, value: updatedValue } : vital
                                                    )
                                                );
                                            } else {
                                                setDefaultVitalArray((prevArray) =>
                                                    prevArray.map((vital) =>
                                                        vital.slug === item.slug ? { ...vital, value: updatedValue } : vital
                                                    )
                                                );
                                            }
                                        }}
                                    />
                                </li>
                            ))}
                        </ul> */}
                            <ul>
                                {mergedVitals?.map((item) => (
                                    <li key={item?.id}>
                                        <label htmlFor="">{item?.title}</label>
                                        <input
                                            type="text"
                                            value={item?.value}
                                            onChange={(e) => {
                                                const updatedValue = e.target.value;

                                                const updateState = (list, setList) => {
                                                    setList((prevList) =>
                                                        prevList.map((i) =>
                                                            i.slug === item.slug ? { ...i, value: updatedValue } : i
                                                        )
                                                    );
                                                };

                                                const existsInVitalList = vitalList?.some((i) => i.slug === item.slug);
                                                const existsInDefaultVitals = defaultVitals?.some((i) => i.slug === item.slug);

                                                if (existsInVitalList) {
                                                    updateState(vitalList, setVitalList);
                                                    updateState(vitalArray, setVitalArray);
                                                }

                                                if (existsInDefaultVitals) {
                                                    updateState(defaultVitals, setDefaultVitals);
                                                    updateState(defaultVitalArray, setDefaultVitalArray);
                                                }
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    )}
                    {examinationList?.length > 0 && (
                        <Col lg={((vitalList?.length > 0 || defaultVitals?.length > 0) && Array.isArray(isDiagnosis) && isDiagnosis.length > 0) ? 4 : ((vitalList?.length > 0 || defaultVitals?.length > 0) || (Array.isArray(isDiagnosis) && isDiagnosis.length > 0)) ? 6 : 12}>
                            <h3> Examination </h3>
                            <div className="wrape_fileds">
                                {examinationList?.map((item) => (
                                    <div key={item?.id}>
                                        {item?.field_type === 'textarea' ? (
                                            <div className="singleTextArea">
                                                <label htmlFor="">{item?.name}</label>
                                                <textarea
                                                    name={item?.name}
                                                    placeholder={item?.placeholder}
                                                    value={examslug.find(slugItem => slugItem.slug === item.slug)?.value || ''}
                                                    onChange={(e) => handleValueChange(item?.slug, e.target.value)}
                                                ></textarea>
                                            </div>
                                        ) : item?.field_type === 'dropdown' ? (
                                            <div className="single_field customSelect">
                                                <label htmlFor="">{item?.name}</label>
                                                <Form.Select
                                                    name={item?.name}
                                                    value={examslug.find(slugItem => slugItem.slug === item.slug)?.value || ''} // Safely accessing the first element of consultation_examinations_slug
                                                    onChange={(e) => handleValueChange(item?.slug, e.target.value)}
                                                >
                                                    {item?.list_items?.data?.length > 0 && item?.list_items?.data.map((list) => (
                                                        <option value={list?.value} key={list?.id}>
                                                            {list?.label}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                        ) : item?.field_type === 'checkbox' ? (
                                            <div className="singleTextArea">
                                                <label htmlFor="">{item?.name}</label>
                                                <div className="checksWraping">
                                                    {item?.list_items?.data?.length > 0 && item?.list_items?.data?.map((list) => (
                                                        <div className="singleTick customTickCheck" key={list?.id}>
                                                            <label htmlFor="tick">
                                                                <input
                                                                    type="checkbox"
                                                                    id="tick"
                                                                    checked={examslug.find(slugItem => slugItem.slug === item.slug)?.value?.includes(list?.value) || false} // Check the correct state value
                                                                    onChange={() => handleCheckboxChange(item?.slug, list?.value)}
                                                                />
                                                                <span></span>
                                                                {list?.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : item?.field_type === 'radio' ? (
                                            <div className="singleTextArea">
                                                <label htmlFor="">{item?.name}</label>
                                                <div className="checksWraping">
                                                    {item?.list_items?.data?.length > 0 && item?.list_items?.data?.map((list) => (
                                                        <div className="single customRadioo" key={list?.id}>
                                                            <div className="wrapeInp">
                                                                <input
                                                                    type="radio"
                                                                    id={list?.value}
                                                                    name={item?.slug}
                                                                    checked={examslug.find(slugItem => slugItem.slug === item.slug)?.value === list?.value} // Check the correct state value
                                                                    onChange={() => handleRadioChange(item?.slug, list?.value)}
                                                                />
                                                                <span></span>
                                                            </div>
                                                            <label htmlFor={list?.value}>{list?.label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : item?.field_type === 'multiselect' ? (
                                            <div className="singleTextArea">
                                                <label htmlFor="">{item?.name}</label>
                                                <div className="checksWraping">
                                                    {item?.list_items?.data?.length > 0 && item?.list_items?.data?.map((list) => (
                                                        <div className="single customRadioo" key={list?.id}>
                                                            <div className="wrapeInp">
                                                                <input
                                                                    type="radio"
                                                                    id={list?.value}
                                                                    name={item?.slug}
                                                                    checked={examslug.find(slugItem => slugItem.slug === item.slug)?.value === list?.value} // Check the correct state value
                                                                    onChange={() => handleRadioChange(item?.slug, list?.value)}
                                                                />
                                                                <span></span>
                                                            </div>
                                                            <label htmlFor={list?.value}>{list?.label}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : item?.field_type === 'text' ? (
                                            <div className="singleTextArea">
                                                <label htmlFor="">{item?.name}</label>
                                                <input type="text" name={item?.name} className='text'
                                                    placeholder={item?.placeholder}
                                                    value={examslug.find(slugItem => slugItem.slug === item.slug)?.value || ''}
                                                    onChange={(e) => handleValueChange(item?.slug, e.target.value)}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </Col>
                    )}
                    {Array.isArray(isDiagnosis) && isDiagnosis.length > 0 && (
                        <Col lg={((vitalList?.length > 0 || defaultVitals?.length > 0) && examinationList?.length > 0) ? 4 : ((vitalList?.length > 0 || defaultVitals?.length > 0) || examinationList?.length > 0) ? 6 : 12 } style={{ borderLeft: "1px solid #D3DEE9" }}>
                            <h3> Diagnosis </h3>
                            <div className="wrape_filedsDiagnos">
                                <div className="singleTextArea">
                                    <label htmlFor=""> Select Category </label>
                                    <div className="radiosWraping">
                                        {Array.isArray(isDiagnosis) && isDiagnosis.includes("Active Problems") && (
                                            <div className="single customRadioo">
                                                <div className="wrapeInp">
                                                    <input type="radio" id="indications" name="consultType" checked={selectCategory === 'indications'} onChange={handleSelectCategory} />
                                                    <span></span>
                                                </div>
                                                <label htmlFor="indications" className='mb-0'> Indications </label>
                                            </div>
                                        )}
                                        {Array.isArray(isDiagnosis) && isDiagnosis.includes("Past Medical History") && (
                                            <div className="single customRadioo">
                                                <div className="wrapeInp">
                                                    <input type="radio" id="pastMedicalHistory" name="consultType" checked={selectCategory === 'pastMedicalHistory'} onChange={handleSelectCategory} />
                                                    <span></span>
                                                </div>
                                                <label htmlFor="pastMedicalHistory" className='mb-0'> Past Medical History </label>
                                            </div>
                                        )}
                                        {Array.isArray(isDiagnosis) && isDiagnosis.includes("Allergies") && (
                                            <div className="single customRadioo">
                                                <div className="wrapeInp">
                                                    <input type="radio" id="allergies" name="consultType" checked={selectCategory === 'allergies'} onChange={handleSelectCategory} />
                                                    <span></span>
                                                </div>
                                                <label htmlFor="allergies" className='mb-0'> Allergies </label>
                                            </div>
                                        )}
                                        {Array.isArray(isDiagnosis) && isDiagnosis.includes("Family History") && (
                                            <div className="single customRadioo">
                                                <div className="wrapeInp">
                                                    <input type="radio" id="familyHistory" name="consultType" checked={selectCategory === 'familyHistory'} onChange={handleSelectCategory} />
                                                    <span></span>
                                                </div>
                                                <label htmlFor="familyHistory" className='mb-0'> Family History </label>
                                            </div>
                                        )}
                                        {Array.isArray(isDiagnosis) && isDiagnosis.includes("Surgical History") && (
                                            <div className="single customRadioo">
                                                <div className="wrapeInp">
                                                    <input type="radio" id="surgicalHistory" name="consultType" checked={selectCategory === 'surgicalHistory'} onChange={handleSelectCategory} />
                                                    <span></span>
                                                </div>
                                                <label htmlFor="surgicalHistory" className='mb-0'> Surgical History </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {selectCategory === 'indications' || selectCategory === 'pastMedicalHistory' ? (
                                    <div className="dagnosis-form">
                                        <div className="form-group">
                                            <div className="dropdown">
                                                <div className="dagnosis-select">
                                                    <div onClick={toggleDropdown} className="tabslidedown">
                                                        <span>Search for indications</span>
                                                    </div>
                                                    <div className={`tabdropdown-slide ${isDropdownOpen ? 'open' : ''}`}
                                                        style={{ transition: 'max-height 0.3s ease-in-out', maxHeight: isDropdownOpen ? '300px' : '0' }}>
                                                        <form>
                                                            <input type="text" name="search" id="search" placeholder='Search the diagnosis' onChange={(e) => handleSearchQuery(e)} value={searchQuery} />
                                                        </form>
                                                        <div className="quick">
                                                            <h5>Quick tags</h5>
                                                            <ul>
                                                                {quickList?.map((item) => (
                                                                    <li key={item?.id}>{item?.names}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <ul className="listing-val">
                                                            {listingValue?.map((item) => (
                                                                <li className="list-diagnosis" key={item?.id}>
                                                                    <input
                                                                        style={{ marginRight: "5px" }}
                                                                        type="checkbox"
                                                                        id={`item-${item?.id}`}
                                                                        // checked={selectDiagnosis.includes(item?.id)}
                                                                        checked={Array.isArray(selectDiagnosis) && selectDiagnosis.some((selectedItem) => selectedItem.diagnosis_id == item.id)}
                                                                        onChange={() => handleCheckboxValue(item)}
                                                                    // onClick={() => addDiagnosis(item)}
                                                                    />
                                                                    <label htmlFor={`item-${item?.id}`}> {item?.title} </label>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-button">
                                                <a onClick={addNewKeyword} className="button green-main-btn">ADD</a>
                                            </div>
                                        </div>
                                    </div>
                                ) : selectCategory === 'allergies' || selectCategory === 'familyHistory' || selectCategory === 'surgicalHistory' ? (
                                    <div className="dagnosis-form">
                                        <div className="form-group">
                                            <div className="dropdown">
                                                <input type="text" className="family" onChange={(e) => handlePostData(e)} value={postData} placeholder="Enter the Field" />
                                            </div>
                                            <div className="form-button">
                                                <a onClick={addHistory} className="button green-main-btn">ADD</a>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="singleIndicationsTabsWraper">
                                    <Tabs
                                        defaultActiveKey="Indications"
                                        id="uncontrolled-tab-example"
                                        className="mb-3 singleIndicationsTabs"
                                    >
                                        <Tab eventKey="Indications" title="Indications">
                                            <div className="wrape_indication">
                                                <div className="table__wrape tableConsultSub">
                                                    <Table responsive className=''>
                                                        <thead>
                                                            <tr>
                                                                <th>Date </th>
                                                                <th>Indications</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentDiagnosis[0]?.list?.length > 0 ? (currentDiagnosis[0]?.list?.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td>{item.date_web}</td>
                                                                    <td>{item.title}</td>
                                                                    <td><span className="activeBtn">Active</span></td>
                                                                    <td>
                                                                        <div className="wrape_actions">
                                                                            <button
                                                                                className="inActive"
                                                                                onClick={() => changeStatus(item, 'currentDiagnosis')}
                                                                            >
                                                                                Inactive
                                                                            </button>
                                                                            <span
                                                                                className="deleteIcon"
                                                                                onClick={() => deleteCurrentDiagnosis(item.id)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))) : (
                                                                <tr><td colSpan={4} className='text-center'>No Data</td></tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="btnView">
                                                    <span className='saveBtn'> View All </span>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Past Medical" title="Past Medical">
                                            <div className="wrape_indication">
                                                <div className="table__wrape tableConsultSub">
                                                    <Table responsive className=''>
                                                        <thead>
                                                            <tr>
                                                                <th>Date </th>
                                                                <th>Past Medical</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {pastMedical[1]?.list?.length > 0 ? (pastMedical[1]?.list?.map((item) => (
                                                                <tr key={item.id}>
                                                                    <td>{item.date_web}</td>
                                                                    <td>{item.title}</td>
                                                                    <td>
                                                                        <button
                                                                            className="activeBtn"
                                                                            onClick={() => changeStatus(item, 'pastMedical')}
                                                                        >
                                                                            Inactive
                                                                        </button>
                                                                    </td>
                                                                    <td>
                                                                        <div className="wrape_actions">
                                                                            <span
                                                                                className="deleteIcon"
                                                                                onClick={() => deletePastMedical(item.id)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))) : (
                                                                <tr><td colSpan={4} className='text-center'>No Data</td></tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="btnView">
                                                    <span className='saveBtn'> View All </span>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Family History" title="Family History">
                                            <div className="wrape_indication">
                                                <div className="table__wrape tableConsultSub">
                                                    <Table responsive className=''>
                                                        <thead>
                                                            <tr>
                                                                <th>Date </th>
                                                                <th>Family History</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {familyHistory[2]?.list?.length > 0 ? (familyHistory[2]?.list?.map((item) => (
                                                                <tr key={item?.id}>
                                                                    <td> {item?.date}</td>
                                                                    <td> {item?.title} </td>
                                                                    <td>
                                                                        <span className="activeBtn">
                                                                            {item?.status === 0 ? 'Inactive' : 'Active'}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <div className="wrape_actions">
                                                                            <button onClick={() => handleFamilyHistory(item?.id, item?.status)}>
                                                                                <span className='inActive'>
                                                                                    {item.status === 0 ? 'Active' : 'Inactive '}
                                                                                </span>
                                                                            </button>
                                                                            <span className="deleteIcon" onClick={() => deleteFamilyMedical(item?.id)}></span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))) : (<tr><td colSpan={4} className='text-center'>No Data</td></tr>)}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="btnView">
                                                    <span className='saveBtn'> View All </span>
                                                </div>
                                            </div>

                                        </Tab>
                                        <Tab eventKey="Surgical History" title="Surgical History">
                                            <div className="wrape_indication">
                                                <div className="table__wrape tableConsultSub">
                                                    <Table responsive className=''>
                                                        <thead>
                                                            <tr>
                                                                <th>Date </th>
                                                                <th>Surgical History</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {surgicalHistory[4]?.list?.length > 0 ? (surgicalHistory[4]?.list?.map((item) => (
                                                                <tr key={item?.id}>
                                                                    <td> {item?.date_web}</td>
                                                                    <td> {item?.title} </td>
                                                                    <td>
                                                                        <div className="wrape_actions">
                                                                            <span className="deleteIcon" onClick={() => deleteSurgicalHistory(item?.id)}></span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))) : (<tr><td colSpan={4} className='text-center'>No Data</td></tr>)}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="btnView">
                                                    <span className='saveBtn'> View All </span>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Allergies" title="Allergies">
                                            <div className="wrape_indication">
                                                <div className="table__wrape tableConsultSub">
                                                    <Table responsive className=''>
                                                        <thead>
                                                            <tr>
                                                                <th>Date </th>
                                                                <th>Allergies</th>
                                                                <th>Status</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {allergies[3]?.list?.length > 0 ? (
                                                                allergies[3]?.list?.map((item) => (
                                                                    <tr key={item?.id}>
                                                                        <td> {item?.date_web}</td>
                                                                        <td> {item?.title} </td>
                                                                        <td>
                                                                            <span className="activeBtn">
                                                                                {item?.status === 0 ? 'Inactive' : 'Active'}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            <div className="wrape_actions">
                                                                                <button onClick={() => handleAllergiesStatus(item?.id, item?.status)}>
                                                                                    <span className='inActive'>
                                                                                        {item.status === 0 ? 'Active' : 'Inactive '}
                                                                                    </span>
                                                                                </button>
                                                                                <span className="deleteIcon" onClick={() => deleteAllergies(item?.id)}></span>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr><td colSpan={4} className="text-center">No Data</td></tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                                <div className="btnView">
                                                    <span className='saveBtn'> View All </span>
                                                </div>
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </Col>
                    )}

                </Row>
            </div>
        </div>
    )
}

export default ExaminationTabOffline;
