import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import { Tabs } from 'antd';
import IndicatorCard from './indicatorCard/IndicatorCard';
import "./medicalHistoryPatientProfileModal.scss"
import API from '../../../services/httpInstance';

const MedicalHistoryPatientProfileModal = ({ medicalHistoryPatientProfile, medicalHistoryPatientProfileClose, medicalHistory, patientData, patientId, getMedicalHistory }) => {
    const [currentModal, setCurrentModal] = useState(null);
    const [modalData, setModalData] = useState(null);
    const [postData, setPostData] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectDiagnosis, setSelectDiagnosis] = useState('');
    const [status, setStatus] = useState(null);
    const getAllInclinations = async () => {
        try {
            const response = await API.get(`/search-diagnosis?search=${searchQuery}`)
            if (response?.status == 200) {
                setModalData(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const addNewKeyword = async () => {
        const data = {
            patient_id: patientId,
            clinic_id: patientData?.clinic_id,
            status: currentModal == 'Indications' ? 1 : 0,
            title: searchQuery,
            appointment_id: patientData?.appointment_id,
            doctor_id: patientData?.doctor_id,
        }
        if (modalData?.length === 0 && searchQuery) {
            try {
                const response = await API.post('/add-doc-diagnosis', data);

                if (response.status === 200) {
                    setSearchQuery('')
                    await getAllInclinations();
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
        // getMedicalHistory(); 
    }

    const handleShow = (modalType) => {
        setCurrentModal((prevModal) => (prevModal === modalType ? null : modalType));
    };

    const handleClose = () => setCurrentModal(false);

    const addHistory = async () => {
        const data = {
            patient_id: patientId,
            clinic_id: patientData?.clinic_id,
            status: 0,
            title: postData,
            appointment_id: patientData?.appointment_id,
            doctor_id: patientData?.doctor_id,
        }
        // API call for familyHistory//
        if (currentModal == 'Family History') {
            try {
                const response = await API.post(`/add-family-history`, data)
                if (response?.status == 200) {
                    handleClose()
                    getMedicalHistory()
                }
            } catch (error) {
                console.log("errorr")
            }
        }
        // API call for surgicalHistory//
        if (currentModal == 'Surgical History') {
            try {
                const response = await API.post(`/add-surgical-history`, data)
                if (response?.status == 200) {
                    handleClose()
                    getMedicalHistory()
                }
            } catch (error) {
                console.log("errorr")
            }
        }

        // API call for allergies//
        if (currentModal == 'Allergies') {
            try {
                const response = await API.post(`/add-allergies`, data)
                if (response?.status == 200) {
                    handleClose()
                    getMedicalHistory()
                }
            } catch (error) {
                console.log("errorr")
            }
        }
    }

    const patchDiagnosis = async (id) => {
        const body = {
            patient_id: patientId,
            doctor_id: patientData?.clinic_id,
            diagnosis_id: id,
            status: status,
        }
        if (status) {
            try {
                const response = await API.patch('/status-diagnosis', body)
                if (response?.status == 200) {
                    getMedicalHistory();
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
    }

    const deleteDiagnosis = async (id, endpoint, requiresPatientId = false) => {
        try {
            let url = `${endpoint}?id=${id}`;
            if (requiresPatientId) {
                url += `&patient_id=${patientId}`;
            }
            const response = await API.delete(url);
            if (response?.status == 200) {
                getMedicalHistory();
            }
        } catch (error) {
            console.log("error")
        }
    }

    useEffect(() => {
        if (currentModal == 'Indications' || currentModal == 'Past Medical History') {
            getAllInclinations();
        }
    }, [currentModal])
    const items = [
        {
            key: '1',
            label: 'Current Diagnosis',
            children: <IndicatorCard
                medicalItem={medicalHistory[0]}
                handleClose={handleClose}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                modalData={modalData}
                currentModal={currentModal}
                handleShow={() => handleShow('Indications')}
                show={currentModal == 'Indications'}
                getAllInclinations={getAllInclinations}
                addNewKeyword={addNewKeyword}
                setSelectDiagnosis={setSelectDiagnosis}
                selectDiagnosis={selectDiagnosis}
                patchDiagnosis={patchDiagnosis}
                setStatus={setStatus}
                deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-diagnosis', true)} />,
        },
        {
            key: '2',
            label: 'Past Medical',
            children: <IndicatorCard
                medicalItem={medicalHistory[1]}
                handleClose={handleClose}
                modalData={modalData}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                handleShow={() => handleShow('Past Medical History')}
                currentModal={currentModal}
                show={currentModal == 'Past Medical History'}
                getAllInclinations={getAllInclinations}
                addNewKeyword={addNewKeyword}
                setSelectDiagnosis={setSelectDiagnosis}
                selectDiagnosis={selectDiagnosis}
                patchDiagnosis={patchDiagnosis}
                setStatus={setStatus}
                deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-past-medical-history', true)} />,
        },
        {
            key: '3',
            label: 'Family History',
            children: <IndicatorCard
                medicalItem={medicalHistory[2]}
                handleClose={handleClose}
                modalData={modalData}
                handleShow={() => handleShow('Family History')}
                currentModal={currentModal}
                show={currentModal == 'Family History'}
                setPostData={setPostData}
                postData={postData}
                addHistory={addHistory}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                addNewKeyword={addNewKeyword}
                setSelectDiagnosis={setSelectDiagnosis}
                selectDiagnosis={selectDiagnosis}
                patchDiagnosis={patchDiagnosis}
                setStatus={setStatus}
                deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-family-history', false)}
            />,
        },
        {
            key: '4',
            label: 'Surgical History',
            children: <IndicatorCard
                medicalItem={medicalHistory[4]}
                handleClose={handleClose}
                modalData={modalData}
                handleShow={() => handleShow('Surgical History')}
                currentModal={currentModal}
                show={currentModal == 'Surgical History'}
                setPostData={setPostData}
                postData={postData}
                addHistory={addHistory}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                addNewKeyword={addNewKeyword}
                setSelectDiagnosis={setSelectDiagnosis}
                selectDiagnosis={selectDiagnosis}
                patchDiagnosis={patchDiagnosis}
                setStatus={setStatus}
                deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-surgical-history', false)}
            />,
        },
        {
            key: '5',
            label: 'Allergies',
            children: <IndicatorCard
                medicalItem={medicalHistory[3]}
                modalData={modalData}
                handleShow={() => handleShow('Allergies')}
                currentModal={currentModal}
                show={currentModal == 'Allergies'}
                handleClose={handleClose}
                setPostData={setPostData}
                postData={postData}
                addHistory={addHistory}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
                addNewKeyword={addNewKeyword}
                setSelectDiagnosis={setSelectDiagnosis}
                selectDiagnosis={selectDiagnosis}
                patchDiagnosis={patchDiagnosis}
                setStatus={setStatus}
                deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-allergies', false)} />,
        },
    ];
    return (
        <Modal className="medicalHistoryPatientProfile" show={medicalHistoryPatientProfile} onHide={medicalHistoryPatientProfileClose}>
            <Modal.Body>
                <h2><img src={ArrowBack} alt="" onClick={medicalHistoryPatientProfileClose} /> Medical History</h2>
                <Tabs defaultActiveKey="1" items={items} />
            </Modal.Body>
        </Modal>
    )
}

export default MedicalHistoryPatientProfileModal