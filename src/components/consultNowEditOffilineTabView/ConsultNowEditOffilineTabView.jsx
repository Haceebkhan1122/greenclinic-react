import { useState, useEffect } from "react";

import './consultNowEditOffilineTabView.scss';
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

const ConsultNowEditOffilineTabView = ({ formattedDate, setTemplate, isDiagnosis, template, isShowLabReading, prescriptionsEdit, appointmentId, clinicId, patientId, doctorId, appointmentDate, patientData }) => {
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
    const [indicationMessage, setIndicationMessage] = useState("");
    const [defaultVitalArray, setDefaultVitalArray] = useState([])
    const [prescriptionCopyRX, setPrescriptionCopyRX] = useState('')
    const [favouriteMedicineList, setFavouriteMedicineList] = useState([])
    const [groupMedicineList, setGroupMedicineList] = useState([])
    const [vitalList, setVitalList] = useState([]);
    const [defaultVitals, setDefaultVitals] = useState([]);
    const [examinationList, setExaminationList] = useState([]);

    const handleViewRxShow = () => setViewRxShow(true)
    const handleViewRxClose = () => setViewRxShow(false)

    const handleSaveTemplateShow = () => setSaveTemplateShow(true)
    const handleSaveTemplateClose = () => setSaveTemplateShow(false)

    const mergedVitalsPayload = [...defaultVitalArray, ...vitalArray];

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
            const response = await API.get(`/consult-now-detail/${appointmentId}`)
            if (response.status == 200) {
                setVitalList(response?.data?.data?.vitals);
                setDefaultVitals(response?.data?.data?.defaultVitals);
                setExaminationList(response?.data?.data?.examination);

                const examinationData = response?.data?.data?.examination?.map(item => ({
                    slug: item.slug,
                    value: item?.consultation_examinations_slug?.length > 0
                        ? item?.consultation_examinations_slug[0]?.examination_value
                        : undefined
                }));

                const vitalData = response?.data?.data?.vitals.map(item => ({
                    slug: item.slug,
                    value: item?.consultation_vital_title ? item?.consultation_vital_title.vitals_value : undefined
                }));

                const defaultVitalsData = response?.data?.data?.defaultVitals.map(item => ({
                    slug: item?.get_vitals?.slug,
                    value: item?.consultation_vital_title ? item?.consultation_vital_title.vitals_value : undefined
                }));

                setExamslug(examinationData);
                setVitalArray(vitalData);
                setDefaultVitalArray(defaultVitalsData);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const medicinesListPrescription = async () => {
        try {
            const response = await API.get(`/consult-now-detail/${appointmentId}`);
            if (response.status === 200) {
                setMedicinesList(response?.data?.data?.get_prescription);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleTemplateSaved = (newGroupMedicine) => {
        setGroupMedicines(prevGroup => [...prevGroup, newGroupMedicine]);
        getfavouriteMedicine()
    };

    const handlehandlePrescriptionTemplateShow = () => setPrescriptionTemplateShow(true)
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

    const handleUpdateButton = async (language) => {

        let printFlags = {
            is_print_prescription_urdu: '0',
            is_print_prescription: '0',
        };

        if (language === 'english') {
            printFlags.is_print_prescription = '1';
        } else if (language === 'urdu') {
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
            const response = await API.put("/consult-now-update", payload)
            if (response.status == 200) {
                Cookies.remove("prescriptionsEdit")
                if (response?.data?.data?.url) {
                    const pdfUrl = response.data?.data?.url;
                    window.open(pdfUrl, "_blank");
                }
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
                window.location.href = "/prescriptions"
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

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 1000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    useEffect(() => {
        medicinesListPrescription()
    }, [appointmentId])

    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            <WraperLayout>
                <Row>
                    <Col lg={12} className="mobileSpacing">
                        <div className='consultNowEditOffilineTabView'>
                            <Tabs
                                activeKey={activeTab}
                                onSelect={(k) => setActiveTab(k)}
                                id="uncontrolled-tab-example"
                                className="mb-3 consultNowOffilineTabViewTabs"
                            >
                                <Tab eventKey="Examination" title="Examination">
                                    <ExaminationTabOffline isDiagnosis={isDiagnosis} setVitalList={setVitalList} setDefaultVitals={setDefaultVitals} vitalList={vitalList} defaultVitals={defaultVitals} examinationList={examinationList} prescriptionsEdit={prescriptionsEdit} doctorId={doctorId} setExamslug={setExamslug} examslug={examslug} clinicId={clinicId} appointmentId={appointmentId} setDefaultVitalArray={setDefaultVitalArray} defaultVitalArray={defaultVitalArray} setVitalArray={setVitalArray} vitalArray={vitalArray} patientId={patientId} />
                                </Tab>
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
                                    <input type='radio' name="print" onClick={() => handlePrintPrescription("english")}></input>
                                    <label>  English</label>
                                </div>
                                <div className='linkBox'>
                                    <input type='radio' name="print" onClick={() => handlePrintPrescription("urdu")}></input>
                                    <label>   Urdu</label>
                                </div>



                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <button className='button1 d-lg-block d-none' onClick={() => handleUpdateButton("urdu")}>Print اردو</button>

                    <button className='button1 d-lg-block d-none' onClick={() => handleUpdateButton("english")}>Print English</button>
                    <button className='button2' onClick={() => handleUpdateButton(1)}>Update</button>

                </div>
                <ViewRxModal setViewRxShow={setViewRxShow} setMedicinesList={setMedicinesList} setIndicationMessage={setIndicationMessage} handlePrescriptionCopyRX={handlePrescriptionCopyRX} viewRxShow={viewRxShow} handleViewRxClose={handleViewRxClose} patientId={patientId} patientData={patientData} appointmentDate={appointmentDate} />
                <SaveTemplateModal groupMedicines={groupMedicines} onTemplateSaved={handleTemplateSaved} setGroupMedicines={setGroupMedicines} saveTemplateShow={saveTemplateShow} medicinesList={medicinesList} handleSaveTemplateClose={handleSaveTemplateClose} />
                <PrescriptionTemplateModal setTemplate={setTemplate} prescriptionTemplateShow={prescriptionTemplateShow} handlePrescriptionTemplateClose={handlePrescriptionTemplateClose} template={template} />
            </WraperLayout>
        </>

    )
}

export default ConsultNowEditOffilineTabView
