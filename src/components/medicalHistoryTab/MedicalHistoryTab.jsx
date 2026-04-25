import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import IndicatorCard from './indicatorCard/IndicatorCard'
import './medicalHistoryTab.scss';
import coronavirus from '../../assets/images/svg/coronavirus.svg'
import scalpel from '../../assets/images/svg/scalpel.svg'
import pedestrian_family from '../../assets/images/svg/pedestrian_family.svg'
import reportPatient from '../../assets/images/svg/reportPatient.svg'
import stethoscopes from '../../assets/images/svg/stethoscopes.svg'



import coronavirus1 from '../../assets/images/svg/coronavirus1.svg'
import scalpel1 from '../../assets/images/svg/scalpel1.svg'
import pedestrian_family1 from '../../assets/images/svg/pedestrian_family1.svg'
import reportPatient1 from '../../assets/images/svg/reportPatient1.svg'
import stethoscopes1 from '../../assets/images/svg/stethoscopes1.svg'
import API from '../../services/httpInstance';
import Loader from '../loader/Loader';

const MedicalHistoryTab = ({ medicalHistory, patientData, patientId, getMedicalHistory }) => {
    const [currentModal, setCurrentModal] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalData, setModalData] = useState(null);
    const [postData, setPostData] = useState('');
    const [inclinationChecked, setInclinationChecked] = useState(null);
    const [historyChecked, setHistoryChecked] = useState(null);
    const [selectDiagnosis, setSelectDiagnosis] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

       else if (modalData?.length > 0 && selectDiagnosis) {
        const payload = { diagnosis: selectDiagnosis };
            try {
                const response = await API.post('/add-diagnosis', payload);

                if (response.status == 200) {
                    setSearchQuery('')
                    handleClose()
                    await getAllInclinations();
                }
            } catch (error) {
                console.error('Error', error);
            }
        }
        getMedicalHistory(); 
    };

    const handleShow = (modalType) => {
        setCurrentModal((prevModal) => (prevModal === modalType ? null : modalType));
    };

    const handleClose = () => {
        setSearchQuery('')
        setSelectDiagnosis('')
        setPostData('')
        setCurrentModal(false);
    } 

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

            }
        }

    }

    const patchDiagnosis = async (id) => {
        const body = {
            patient_id: patientId,
            doctor_id: patientData?.clinic_id,
            diagnosis_id: id,
            status: 0,
        }
        try {
            const response = await API.patch('/status-diagnosis', body)
            if (response?.status == 200) {
                getMedicalHistory();
            }
        } catch (error) {
            console.error('Error', error);
        }
    }

    useEffect(() => {
        if (currentModal == 'Indications' || currentModal == 'Past Medical History') {
            getAllInclinations();
        }
    }, [searchQuery, currentModal]);


    const deleteDiagnosis = async (id, endpoint, requiresPatientId = false) => {
        try {
            setIsLoading(true)
            let url = `/delete-diagnosis-past?id=${id}`;
            if (requiresPatientId) {
                url += `&patient_id=${patientId}`;
            }
            const response = await API.delete(url);
            if (response?.status == 200) {
                getMedicalHistory();
                setIsLoading(false)
            }
            else {
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log("error", error)
        }
    }

    useEffect(() => {
        const inclinations = medicalHistory[0]?.list?.map(item => item?.diagnosis_id) || [];
        const pastHistory = medicalHistory[1]?.list?.map(item => item?.diagnosis_id) || [];
        setInclinationChecked(inclinations);
        setHistoryChecked(pastHistory);
      }, [medicalHistory]);

    //   console.log(inclinationChecked,'inclinationChecked')
    //   console.log(historyChecked,'historyChecked')

    return (
        <>
            {isLoading ?
                <Loader />
                :
                <div className='medicalHistoryTab dd'>
                    <Col lg={12}>
                        <Row>
                            <Col lg={4} >
                                <IndicatorCard
                                    icon={stethoscopes}
                                    icon1={stethoscopes1}
                                    heading="Indications"
                                    emptyMessage="No Indications added"
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
                                    inclinationChecked={inclinationChecked}
                                    historyChecked={historyChecked}
                                    deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-diagnosis', true)}
                                    patientData={patientData}
                                    patientId={patientId} />
                            </Col>
                            <Col lg={4}>
                                <IndicatorCard
                                    icon={reportPatient}
                                    icon1={reportPatient1}
                                    heading="Past Medical History"
                                    emptyMessage="No Past Medical History added"
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
                                    patientData={patientData}
                                    inclinationChecked={inclinationChecked}
                                    historyChecked={historyChecked}
                                    patientId={patientId}
                                    deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-past-medical-history', true)} />
                            </Col>
                            <Col lg={4}>
                                <IndicatorCard
                                    icon={pedestrian_family}
                                    icon1={pedestrian_family1}
                                    heading="Family History"
                                    emptyMessage="No Family History"
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
                                    inclinationChecked={inclinationChecked}
                                    historyChecked={historyChecked}
                                    patientData={patientData}
                                    patientId={patientId}
                                    deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-family-history', false)}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col lg={12}>
                        <Row>
                            <Col lg={6}>
                                <IndicatorCard
                                    icon={scalpel}
                                    icon1={scalpel1}
                                    heading="Surgical History"
                                    emptyMessage="No Surgical History added"
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
                                    inclinationChecked={inclinationChecked}
                                    historyChecked={historyChecked}
                                    patientData={patientData}
                                    patientId={patientId}
                                    deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-surgical-history', false)}
                                />
                            </Col>
                            <Col lg={6}>
                                <IndicatorCard
                                    icon={coronavirus}
                                    icon1={coronavirus1}
                                    heading="Allergies"
                                    emptyMessage="No Allergies added"
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
                                    inclinationChecked={inclinationChecked}
                                    historyChecked={historyChecked}
                                    patientData={patientData}
                                    patientId={patientId}
                                    deleteDiagnosis={(id) => deleteDiagnosis(id, '/delete-allergies', false)} />
                            </Col>
                        </Row>
                    </Col>
                </div>
            }
        </>
    )
}

export default MedicalHistoryTab;
