import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Table } from 'react-bootstrap'
import { Tabs, Select } from 'antd';
import { HeartOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import FavouriteMedicine from './favouriteMedicine/FavouriteMedicine';
import GroupMedicine from './groupMedicine/GroupMedicine';
import "./medicationTabOffline.scss"
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import Loader from '../../loader/Loader';

const MedicationTabOffline = ({ setMedicinesList, medicinesList, appointmentId, getfavouriteMedicine, favouriteMedicineList, groupMedicineList }) => {

    const [medicationList, setMedicationList] = useState([])
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [dosageList, setDosageList] = useState([])
    const [durationList, setDurationList] = useState([])
    const [instructionList, setInstructionList] = useState([])
    const [frequencyList, setfrequencyList] = useState([])
    const [medicineTitle, setMedicineTitle] = useState('')
    const [dosage_title, setDosageTitle] = useState('');
    const [dosagevalue, setDosageValue] = useState('');
    const [dosage_id, setDosageId] = useState(null);
    const [medicine_id, setMedicineId] = useState(null)
    const [frequency, setFrequency] = useState('');
    const [frequency_id, setFrequencyId] = useState(null);
    const [frequency_title, setFrequencyTitle] = useState('');
    const [durationvalue, setDurationValue] = useState('');
    const [duration, setDuration] = useState('');
    const [dosage, setDosage] = useState('');
    const [duration_id, setDurationId] = useState(null);
    const [duration_title, setDurationTitle] = useState('');
    const [morning, setMorning] = useState('')
    const [afternoon, setAfternoon] = useState('')
    const [evening, setEvening] = useState('')
    const [night, setNight] = useState('')
    const [meal, setMeal] = useState('');
    const [meal_id, setMealId] = useState(null);
    const [mealTitle, setMealTitle] = useState('');
    const [customInstruction, setCustomInstruction] = useState('')
    const [reminderValue, setReminderValue] = useState(null);
    const [isFrequency, setIsFrequency] = useState(false)
    const [isInstruction, setIsInstruction] = useState(false)
    const [toastShow, setToastShow] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const [editingMedication, setEditingMedication] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = (input) => {
        setSearchQuery(input); // Update the search query
    };

    const handleEditmedicines = async (med) => {
        setIsLoading(true)
        const selected = medicationList.find(item => item.id === med.medicine_id);

        if (!selected) {
            await getChooseMedication();
        }

        const titleFromList = medicationList.find(item => item.id === med.medicine_id)?.title || '';

        setMedicineId(med.medicine_id);
        setMedicineTitle(titleFromList);

        setDosageValue(med.dosagevalue);
        setDurationId(med.duration_id);
        setFrequencyId(med.frequency_id);
        setMealId(med.meal_id);
        setDurationValue(med.durationvalue);
        setFrequency(med.frequency);
        setMeal(med.mealTitle);
        setMorning(med.morning);
        setAfternoon(med.afternoon);
        setEvening(med.evening);
        setNight(med.night);
        setCustomInstruction(med.customInstruction);
        setDosageId(med.dosage_id);
        setDurationTitle(med.duration_title);
        setDosageTitle(med.dosage_title);
        setMealTitle(med.mealTitle);
        setEditingMedication(med);
        setIsLoading(false)
    };

    const handleDeleteList = (idToDelete) => {
        const updatedMedicinesList = medicinesList.filter((med, index) => index !== idToDelete);

        setMedicinesList(updatedMedicinesList);

        if (editingMedication && editingMedication.medicine_id === idToDelete) {
            setEditingMedication(null);
        }
    };

    const handleFavouriteMedicines = async (med) => {
        const payload = {
            medicine_id: med.medicine_id,
            dosage: med.dosagevalue,
            dosage_id: med.dosage_id,
            dosage_type: med.dosage_title,
            frequency_id: med.frequency_id,
            frequency: med.frequency,
            duration_id: med.duration_id,
            duration: med.durationvalue,
            duration_type: med.duration_title,
            meal_id: med.meal_id,
            meal: med.mealTitle,
        }

        try {
            const response = await API.post('/add-fav-med', payload);
            if (response.status === 200) {
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                getfavouriteMedicine();
            }
        } catch (error) {
            toast.error(response?.data?.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const handleReminderChange = (e) => {
        setReminderValue(e.target.value);
    };

    const getMedication = async () => {
        try {
            const response = await API.get(`/consult-now/${appointmentId}`);
            if (response.status == 200) {
                setDurationList(response?.data?.data?.duration);
                setDosageList(response?.data?.data?.dosage);
                setInstructionList(response?.data?.data?.instruction);
                setfrequencyList(response?.data?.data?.frequency);
            }

        } catch (error) {
            toast.error('Failed to fetch medications. Please try again later.');
        }
    };

    const handleAddMedication = () => {
        if (frequency_id === null) {
            setFrequencyId(1);
        }

        if (meal_id === null) {
            setMealId(1);
        }

        if (!medicine_id || !dosagevalue || !duration_id) {
            if (!toastShow) {
                toast.error('Please fill all the fields', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setToastShow(true);

                setTimeout(() => {
                    setToastShow(false);
                }, 5000);
            }
            return;
        }

        if (isFrequency && (morning || afternoon || evening || night)) {
            setFrequencyId(1);
        }

        const newMedication = {
            medicineTitle: medicineTitle || title,
            medicine_id: medicine_id,
            frequency_id: frequency_id || 1,
            frequency: isFrequency ? `${morning} + ${afternoon} + ${evening} + ${night}` : frequency,
            frequency_title: isFrequency ? `${morning} + ${afternoon} + ${evening} + ${night}` : frequency_title,
            morning,
            afternoon,
            evening,
            night,
            duration: duration,
            dosage: dosage,
            customInstruction: isInstruction ? meal : '',
            dosage_title: dosage_title,
            dosage_id: dosage_id,
            dosagevalue: dosagevalue,
            duration_title: duration_title,
            duration_id: duration_id,
            durationvalue: durationvalue,
            mealTitle: isInstruction ? meal : mealTitle,
            meal_id: isInstruction ? 1 : meal_id || 1,
        };

        if (editingMedication) {
            // Update existing medication
            setMedicinesList((prevData) =>
                prevData.map((med) =>
                    med.medicine_id === editingMedication.medicine_id ? newMedication : med
                )
            );
        } else {
            // Add new medication
            setMedicinesList((prevData) => [...prevData, newMedication]);
        }

        // Reset form and editing state
        resetForm();
        setEditingMedication(null);
    };

    const resetForm = () => {
        setMedicineId(null);
        setMedicineTitle('');
        setDosageValue('');
        setDosageId(null);
        setDurationId(null);
        setFrequencyId(null);
        setMealId(null);
        setFrequencyTitle('')
        setDurationValue('');
        setFrequency('');
        setMeal('');
        setReminderValue(null);
        setMorning('');
        setAfternoon('');
        setEvening('');
        setNight('');
        setCustomInstruction('');
        setMealTitle('');
    };

    const handleChangeMedicineId = (value) => {
        setMedicineId(value);
        const selectedMedicine = medicationList?.find((item) => item?.id === value);

        if (selectedMedicine) {
            setMedicineTitle(selectedMedicine?.title);
        }
    }

    const handleMedicineSelection = (medicine) => {
        setMedicinesList(prevData => [
            ...prevData,
            {
                medicineTitle: medicine.title,
                medicine_id: medicine.medicine_id,
                dosagevalue: medicine.dosagevalue,
                dosage_title: medicine.dosage_type,
                dosage_id: medicine.dosage_id,
                dosage: medicine.dosage,
                frequency: medicine.frequency,
                frequency_id: medicine.frequency_id,
                frequency_title: medicine.frequency,
                morning: medicine.morning,
                afternoon: medicine.afternoon,
                evening: medicine.evening,
                night: medicine.night,
                durationvalue: medicine.durationvalue,
                duration: medicine.duration,
                duration_id: medicine.duration_id,
                duration_title: medicine.duration_type,
                meal_id: medicine.meal_id,
                customInstruction: medicine.customInstruction,
                mealTitle: medicine.meal
            }
        ]);
    };

    const handleGroupMedicineSelection = (group) => {
        const medicinesInGroup = group.medicines;
        const updatedMedicinesList = medicinesInGroup.map(medicine => ({
            medicineTitle: medicine.title,
            medicine_id: medicine.medicine_id,
            dosage: medicine.dosage,
            dosage_id: medicine.dosage_id,
            dosagevalue: medicine.dosagevalue,
            dosage_title: medicine.dosage_type,
            frequency: medicine.frequency,
            frequency_id: medicine.frequency_id,
            frequency_title: medicine.frequency,
            morning: medicine.morning,
            afternoon: medicine.afternoon,
            evening: medicine.evening,
            night: medicine.night,
            durationvalue: medicine.durationvalue,
            duration: medicine.duration,
            duration_id: medicine.duration_id,
            duration_title: medicine.duration_type,
            meal_id: medicine.instruction_id,
            mealTitle: medicine.instruction,
            custom_instruciton: medicine.custom_instruciton,
            custom_frequency: medicine.custom_frequency,
        }));
        setMedicinesList(prevData => [
            ...prevData,
            ...updatedMedicinesList,
        ]);
    };

    const handleChangeDuration = (event) => {
        if (event.target.value.length <= 2) {
            setDurationValue(event.target.value);
        }
    };

    const getChooseMedication = async () => {
        try {
            const response = await API.get(`/medicine-list?page=${page}`);
            if (response.status == 200) {
                const newMedicines = response?.data?.data?.medicines || [];
                setMedicationList(prevList => [...prevList, ...newMedicines]);
            }
        } catch (error) {
            toast.error('Failed to fetch medicine list. Please try again later.');
        }
    };

    const handlePopupScroll = (e) => {
        const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
        if (bottom && hasMore) {
            setPage(prevPage => prevPage + 1); // Load next page when scrolled to bottom
        }
    };

    const handleChangeDurationId = (value) => {
        setDurationId(value);
        const selectedDuration = durationList.find(item => item.id === value);
        if (selectedDuration) {
            setDurationTitle(selectedDuration.title);
        }
    };

    const handleChangeDosage = (e) => {
        if (e.target.value.length <= 2) {
            setDosageValue(e.target.value);
        }
    };
    const handleMorning = (e) => {
        if (e.target.value.length <= 2) {
            setMorning(e.target.value);
        }
    };
    const handleAfternoor = (e) => {
        if (e.target.value.length <= 2) {
            setAfternoon(e.target.value);
        }
    };
    const handleEvening = (e) => {
        if (e.target.value.length <= 2) {
            setEvening(e.target.value);
        }
    };
    const handleNight = (e) => {
        if (e.target.value.length <= 2) {
            setNight(e.target.value);
        }
    };

    const handleChangeDosageId = (value) => {
        setDosageId(value);
        const selectedDosage = dosageList.find(item => item.id === value);
        if (selectedDosage) {
            setDosageTitle(selectedDosage.title);
        }
    };

    const handleChangeMeal = (value) => {
        const selected = instructionList.find(item => item.id === value);
        if (selected) {
            setMealId(value);
            setMealTitle(selected.title);
            setMeal(selected.title);
        }
    };

    const handleChangeFrequency = (value) => {
        const selected = frequencyList.find(item => item.id === value);
        if (selected) {
            setFrequencyId(value);
            setFrequencyTitle(selected.title);
            setFrequency(selected.title);
        }
    };

    useEffect(() => {
        getMedication()
        getChooseMedication()
        getfavouriteMedicine()
    }, [page])

    const items = [
        {
            key: '1',
            label: 'Favourite Medicine',
            children: <FavouriteMedicine favouriteMedicineList={favouriteMedicineList} handleMedicineSelection={handleMedicineSelection} />,
        },
        {
            key: '2',
            label: 'Group Medicine',
            children: <GroupMedicine groupMedicineList={groupMedicineList} handleGroupMedicineSelection={handleGroupMedicineSelection} getfavouriteMedicine={getfavouriteMedicine} />,
        },
    ];

    return (
        <div className='medication_tab medication_Offline'>
            <Row>
                <Col lg={4} style={{ borderRight: "1px solid #D3DEE9" }}>
                    <h3> New Medication </h3>
                    {isLoading ? (<Loader />) : (
                        <>
                            <Row className='row_rwp align-items-center '>
                                <Form.Group as={Col} md={12} className="mb-3">
                                    <Form.Label>Choose Medication</Form.Label>
                                    <Select
                                        showSearch
                                        placeholder="Search for medicine"
                                        className="form-select"
                                        value={medicine_id}
                                        onChange={handleChangeMedicineId}
                                        onSearch={(input) => handleSearch(input)}
                                        filterOption={(input, option) =>
                                            (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onPopupScroll={handlePopupScroll}
                                    >
                                        {medicationList?.map((item) => (
                                            <option key={item.id} value={item.id}>{item?.title}</option>
                                        ))}
                                    </Select>
                                </Form.Group>
                                <Form.Group as={Col} md={6} className="mb-3">
                                    <Form.Label>Duration</Form.Label>
                                    <div className="dropdown inline durationBox medicineBox">
                                        <Form.Control type="text" className="form-control mixed_input" name="duration" id="durationvalue" onChange={handleChangeDuration} value={durationvalue} />
                                        <Select id="duration_id" name="duration_id"
                                            placeholder="Duration"
                                            className='form-select'
                                            value={duration_id}
                                            onChange={handleChangeDurationId}>
                                            {durationList?.map((item) => (
                                                <option key={item.id} value={item.id}>{item?.title}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </Form.Group>
                                <Form.Group as={Col} md={6} className="mb-3">
                                    <Form.Label>Dosage</Form.Label>
                                    <div className="dropdown inline doage medicineBox">
                                        <Form.Control type="text" className="form-control mixed_input" name="doage" value={dosagevalue} onChange={handleChangeDosage} id="doagevalue" />
                                        <Select id="dosage_id" name="dosage_id"
                                            placeholder="Dosage"
                                            className='form-select'
                                            value={dosage_id}
                                            onChange={handleChangeDosageId}>
                                            {dosageList?.map((item) => (
                                                <option key={item.id} value={item.id}>{item?.title}</option>
                                            ))}
                                        </Select>
                                    </div>
                                </Form.Group>
                                <Form.Group as={Col} md={12} className="mb-3">
                                    <div className='d-flex justify-content-between'>
                                        <Form.Label>Enter Instruction</Form.Label>
                                        {isInstruction ? (<a className="default-text" onClick={() => setIsInstruction(false)} >Default</a>) : (<a className="default-text" onClick={() => setIsInstruction(true)} >Custom</a>)}
                                    </div>
                                    {isInstruction ? (
                                        <Form.Control type="text" value={meal} onChange={(e) => setMeal(e.target.value)} className="form-control" />
                                    ) : (
                                        <Select id="instruction_id" name="instruction_id"
                                            placeholder="Instruction"
                                            className='form-select'
                                            value={meal_id}
                                            onChange={handleChangeMeal}>
                                            {instructionList?.map((item) => (
                                                <option value={item?.id} key={item?.id}>{item?.title}</option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md={12} className="mb-3">
                                    <div className='d-flex justify-content-between'>
                                        <Form.Label>Frequency</Form.Label>
                                        {isFrequency ? (<a className="default-text" onClick={() => setIsFrequency(false)} >Default</a>) : (<a className="default-text" onClick={() => setIsFrequency(true)} >Custom</a>)}
                                    </div>
                                    {isFrequency ? (
                                        <Row>
                                            <Col lg={3}>
                                                <Form.Label>Morning</Form.Label>
                                                <Form.Control type="text" className="form-control" value={morning} onChange={handleMorning} placeholder='0' />
                                            </Col>
                                            <Col lg={3}>
                                                <Form.Label>Afternoor</Form.Label>
                                                <Form.Control type="text" className="form-control" value={afternoon} onChange={handleAfternoor} placeholder='0' />
                                            </Col>
                                            <Col lg={3}>
                                                <Form.Label>Evening</Form.Label>
                                                <Form.Control type="text" className="form-control" value={evening} onChange={handleEvening} placeholder='0' />
                                            </Col>
                                            <Col lg={3}>
                                                <Form.Label>Night</Form.Label>
                                                <Form.Control type="text" className="form-control" value={night} onChange={handleNight} placeholder='0' />
                                            </Col>
                                        </Row>
                                    ) : (
                                        <Select id="frequency_id" name="frequency_id"
                                            placeholder="Frequency"
                                            className='form-select'
                                            value={frequency_id}
                                            onChange={handleChangeFrequency}>
                                            {frequencyList?.map((item) => (
                                                <option key={item?.id} value={item?.id}>
                                                    {item?.title}
                                                </option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Group>
                                <Form.Group as={Col} md={12} className="mb-3">
                                    <Form.Label>Medicine Reminders (Days)</Form.Label>
                                    <Form.Check
                                        type="radio"
                                        inline
                                        label="3 Days"
                                        id="3-days"
                                        name="group1"
                                        value="3"
                                        checked={reminderValue === "3"}
                                        onChange={handleReminderChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="7 Days"
                                        inline
                                        value="7"
                                        id="7-days"
                                        name="group1"
                                        checked={reminderValue === "7"}
                                        onChange={handleReminderChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        inline
                                        label="15 Days"
                                        id="15-days"
                                        name="group1"
                                        value="15"
                                        checked={reminderValue === "15"}
                                        onChange={handleReminderChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="No Reminder"
                                        inline
                                        id="no-reminder"
                                        name="group1"
                                        value="no-reminder"
                                        checked={reminderValue === "no-reminder"}
                                        onChange={handleReminderChange}
                                    />
                                </Form.Group>
                                <Col lg={12}>
                                    <button className="button1" onClick={handleAddMedication}>Add Medication</button>
                                </Col>
                            </Row>
                        </>
                    )}
                </Col>
                <Col lg={8} style={{ marginBottom: 20 }}>
                    <h3>Medication List</h3>
                    <Row>
                        <Col lg={12}>
                            <div className="wrape_indication">
                                <div className="table__wrape tableConsultSub">
                                    <Table responsive className=''>
                                        <thead>
                                            <tr>
                                                <th>Medicine</th>
                                                <th>Dosage</th>
                                                <th>Frequency</th>
                                                <th>Duration</th>
                                                <th>Instruction</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {medicinesList?.length > 0 ? (
                                                medicinesList.map((med, index) => (
                                                    <tr key={`${med?.id}-${index}`}>
                                                        <td>{med?.medicineTitle || med?.title}</td>
                                                        <td>{med?.dosagevalue || med?.dosage} {med?.dosage_title || med?.dosage_type}</td>
                                                        <td>{med?.frequency_title || med?.frequency}</td>
                                                        <td>{med?.durationvalue || med?.duration} {med?.duration_title || med?.duration_type}</td>
                                                        <td>{med?.mealTitle}</td>
                                                        <td>
                                                            <div className="wrape_actions">
                                                                <button onClick={() => handleEditmedicines(med)}><EditOutlined /></button>
                                                                <button onClick={() => handleFavouriteMedicines(med)}><HeartOutlined /></button>
                                                                <button className="delete" onClick={() => handleDeleteList(index)}><DeleteOutlined /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center">No data available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="medicineOffline">
                                <Tabs defaultActiveKey="1" items={items} />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row >
        </div >
    )
}

export default MedicationTabOffline