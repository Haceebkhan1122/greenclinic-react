import { useState, useEffect } from "react";

import './consultNowOffilineTabView.scss';
import WraperLayout from '../wraperLayout/WraperLayout';
import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import Printer from "../../assets/images/png/print.png"
import ExaminationTabOffline from './examinationTabOffline/ExaminationTabOffline';
import InvestigationTabOffline from './investigationTabOffline/InvestigationTabOffline';
import MedicationTabOffline from './medicationTabOffline/MedicationTabOffline';
import LabReadingTabOffline from './labReadingTabOffline/LabReadingTabOffline';
import ViewRxModal from '../modal/viewRxModal/ViewRxModal';
import SaveTemplateModal from '../modal/saveTemplateModal/SaveTemplateModal';
import API from '../../services/httpInstance';
import { toast } from 'react-toastify';
import PrescriptionTemplateModal from '../modal/prescriptionTemplateModal/PrescriptionTemplateModal';
import Dropdown from 'react-bootstrap/Dropdown';
import Cookies from 'js-cookie';

const ConsultNowOffilineTabView = ({ formattedDate, isDiagnosis, setTemplate, template, isShowLabReading, appointmentId, clinicId, patientId, doctorId, appointmentDate, patientData }) => {
    const [viewRxShow, setViewRxShow] = useState(false)
    const [saveTemplateShow, setSaveTemplateShow] = useState(false)
    const [prescriptionTemplateShow, setPrescriptionTemplateShow] = useState(false)
    const [selectDatePicker, setSelectDatePicker] = useState('')
    const [sendSms, setSendSms] = useState(0)
    const [sendWhatsapp, setSendWhatsapp] = useState(0)
    const [labReadingListSlug, setLabReadingSlug] = useState([])
    const [vitalArray, setVitalArray] = useState([])
    const [medicinesList, setMedicinesList] = useState([])
    const [groupMedicines, setGroupMedicines] = useState([]);
    const [examslug, setExamslug] = useState([])
    const [defaultVitalArray, setDefaultVitalArray] = useState([])
    const [prescriptionCopyRX, setPrescriptionCopyRX] = useState('')
    const [favouriteMedicineList, setFavouriteMedicineList] = useState([])
    const [groupMedicineList, setGroupMedicineList] = useState([])
    const [vitalList, setVitalList] = useState([]);
    const [defaultVitals, setDefaultVitals] = useState([]);
    const [indicationMessage, setIndicationMessage] = useState("");
    const [examinationList, setExaminationList] = useState([]);

    const handleViewRxShow = () => setViewRxShow(true)
    const handleViewRxClose = () => setViewRxShow(false)

    const handleSaveTemplateShow = () => setSaveTemplateShow(true)
    const handleSaveTemplateClose = () => setSaveTemplateShow(false)

    const getfavouriteMedicine = async () => {
        try {
            const response = await API.get("/get-medicine")
            if (response.status == 200) {
                setFavouriteMedicineList(response?.data?.data?.favourite_medicine)
                setGroupMedicineList(response?.data?.data?.group_medicine)
            }
        } catch (error) {
            console.log(error)
        }
    }

    // get examination and vital
    const getConsultNow = async () => {
        try {
            const response = await API.get(`/examination/${appointmentId}`)
            if (response.status == 200) {
                setVitalList(response?.data?.data?.vitals)
                setDefaultVitals(response?.data?.data?.defaultVitals)
                setExaminationList(response?.data?.data?.examination)
                const examinationData = response?.data?.data?.examination.map(item => ({
                    slug: item.slug,
                    value: item.value
                }));
                const vitalData = response?.data?.data?.vitals.map(item => ({
                    slug: item.slug,
                    value: item.value
                }));
                const defaultVitalsData = response?.data?.data?.defaultVitals.map(item => ({
                    slug: item.slug,
                    value: item.value
                }));
                setExamslug(examinationData);
                setVitalArray(vitalData);
                setDefaultVitalArray(defaultVitalsData);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleTemplateSaved = (newGroupMedicine) => {
        setGroupMedicines(prevGroup => [...prevGroup, newGroupMedicine]);
        getfavouriteMedicine()
    };

    const handlehandlePrescriptionTemplateShow = () => {
        setPrescriptionTemplateShow(true)
    }
    const handlePrescriptionTemplateClose = () => setPrescriptionTemplateShow(false)

    const [activeTab, setActiveTab] = useState("Examination");
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setActiveTab(null); // Mobile view pe koi bhi tab active nahi hoga
        } else {
            setActiveTab("Examination"); // Desktop view pe "Examination" active rahega
        }
    }, []);

    useEffect(() => {
        getConsultNow()
    }, [])

    const mergedVitalsPayload = [...defaultVitalArray, ...vitalArray];

    const handleSaveButton = async (language) => {

        let printFlags = {
            is_print_prescription_urdu: '0',
            is_print_prescription: '0',
        };

        if (language == 'english') {
            printFlags.is_print_prescription = '1';
            printFlags.is_print_prescription_urdu = '0';
        } else if (language == 'urdu') {
            printFlags.is_print_prescription_urdu = '1';
            printFlags.is_print_prescription = '0';
        }
        const filteredData = labReadingListSlug.filter(
            (obj) =>
                obj.value.trim() !== "" &&
                !("additionalValue" in obj)
        );

        const payload = {
            appointment_id: appointmentId,
            date_select: selectDatePicker,
            send_sms: sendSms ? 1 : 0,
            send_whatsapp: sendWhatsapp ? 1 : 0,
            labreading: filteredData,
            examinArray: examslug,
            vitalArray: mergedVitalsPayload,
            medicine: medicinesList,
            is_print_prescription_urdu: printFlags.is_print_prescription_urdu,
            is_print_prescription: printFlags.is_print_prescription,
        }

        try {
            const response = await API.post("/consult-now", payload)
            if (response.status == 200) {
                if (response?.data?.data?.url) {
                    const pdfUrl = response?.data?.data?.url;
                    window.open(pdfUrl, "_blank");
                }
                window.location.href = "/appointments"
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePrescriptionCopyRX = async () => {
        try {
            const response = await API.get(`/copy-rx?patient_id=${patientId}&clinic_id=${clinicId}`);
            if (response?.data?.data) {
                const copiedMedicines = response?.data?.data;
                setMedicinesList(copiedMedicines);
            }
            setIndicationMessage(response?.data?.message);
            setViewRxShow(false);
        } catch (error) {
            console.log(error);
        }
    };

    const isExaminationEmpty =
        (vitalList?.length === 0 || !vitalList) &&
        (defaultVitals?.length === 0 || !defaultVitals) &&
        (examinationList?.length === 0 || !examinationList) && 
        (isDiagnosis?.length === 0 || !isDiagnosis);

    useEffect(() => {
        if (isExaminationEmpty) {
            setActiveTab("Medication");
        } else {
            setActiveTab("Examination");
        }
    }, [vitalList, defaultVitals, examinationList, isDiagnosis]);

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 1000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}

            <WraperLayout>
                <Row>
                    <Col lg={12} className="mobileSpacing">
                        <div className='consultNowOffilineTabView test'>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                id="uncontrolled-tab-example"
                                className="mb-3 consultNowOffilineTabViewTabs"
                            >
                                {!isExaminationEmpty &&
                                    <Tab eventKey="Examination" title="Examination">
                                        <ExaminationTabOffline isDiagnosis={isDiagnosis} setVitalList={setVitalList} setDefaultVitals={setDefaultVitals} vitalList={vitalList} defaultVitals={defaultVitals} examinationList={examinationList} doctorId={doctorId} setExamslug={setExamslug} examslug={examslug} clinicId={clinicId} appointmentId={appointmentId} setDefaultVitalArray={setDefaultVitalArray} defaultVitalArray={defaultVitalArray} setVitalArray={setVitalArray} vitalArray={vitalArray} patientId={patientId} />
                                    </Tab>
                                }
                                <Tab eventKey="Medication" title="Medication">
                                    <MedicationTabOffline favouriteMedicineList={favouriteMedicineList} groupMedicineList={groupMedicineList} getfavouriteMedicine={getfavouriteMedicine} setMedicinesList={setMedicinesList} medicinesList={medicinesList} appointmentId={appointmentId} />
                                </Tab>
                                <Tab eventKey="Investigation" title="Investigation">
                                    <InvestigationTabOffline setSelectDatePicker={setSelectDatePicker} selectDatePicker={selectDatePicker} appointmentId={appointmentId} patientId={patientId} clinicId={clinicId} sendSms={sendSms} sendWhatsapp={sendWhatsapp} setSendWhatsapp={setSendWhatsapp} setSendSms={setSendSms} />
                                </Tab>
                                {isShowLabReading == 1 &&
                                    <Tab eventKey="Lab Readings" title="Lab Readings">
                                        <LabReadingTabOffline formattedDate={formattedDate} patientId={patientId} setLabReadingSlug={setLabReadingSlug} />
                                    </Tab>
                                }
                            </Tabs>
                            <div className="btnsWraping">
                                <button onClick={handleSaveTemplateShow}> Save Template</button>
                                <button onClick={handleViewRxShow}>VIEW RX</button>
                                <button onClick={handlePrescriptionCopyRX}>Copy RX</button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="print_action">
                    <button onClick={handlehandlePrescriptionTemplateShow}><img src={Printer} alt="" /></button>
                    <div className="d-lg-none d-block mobileDropdown">
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                                Print <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                    <path d="M12.9483 6.57129L8.4272 11.0924L3.9061 6.57129" stroke="#0F75BC" stroke-width="1.93762" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <div className='linkBox'>
                                    <input type='radio' name="print" onClick={() => handleSaveButton("english")}></input>
                                    <label>  English</label>
                                </div>
                                <div className='linkBox'>
                                    <input type='radio' name="print" onClick={() => handleSaveButton("urdu")}></input>
                                    <label>   Urdu</label>
                                </div>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <button className='button1 d-lg-block d-none' onClick={() => handleSaveButton("urdu")}>Print اردو</button>
                    <button className='button1 d-lg-block d-none' onClick={() => handleSaveButton("english")}>Print English</button>
                    <button className='button2' onClick={() => handleSaveButton(1)}>Save</button>
                </div>
                <ViewRxModal setViewRxShow={setViewRxShow} setMedicinesList={setMedicinesList} setIndicationMessage={setIndicationMessage} handlePrescriptionCopyRX={handlePrescriptionCopyRX} viewRxShow={viewRxShow} handleViewRxClose={handleViewRxClose} patientId={patientId} patientData={patientData} appointmentDate={appointmentDate} />
                <SaveTemplateModal getfavouriteMedicine={getfavouriteMedicine} groupMedicines={groupMedicines} onTemplateSaved={handleTemplateSaved} setGroupMedicines={setGroupMedicines} saveTemplateShow={saveTemplateShow} medicinesList={medicinesList} handleSaveTemplateClose={handleSaveTemplateClose} />
                <PrescriptionTemplateModal appointmentId={appointmentId} prescriptionTemplateShow={prescriptionTemplateShow} handlePrescriptionTemplateClose={handlePrescriptionTemplateClose} setTemplate={setTemplate} template={template} />
            </WraperLayout>
        </>
    )
}

export default ConsultNowOffilineTabView
