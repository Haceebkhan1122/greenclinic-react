import React, { useEffect, useState } from 'react';
import { Col, Row, Nav, Tab, Form, Tabs, Table } from 'react-bootstrap';
import WraperLayout from '../wraperLayout/WraperLayout'
import { HeartOutlined, EditOutlined, DeleteOutlined, CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import FavouriteMedicine from "./favouriteMedicine/FavouriteMedicine"
import GroupMedicine from "./groupMedicine/GroupMedicine"
import "./consultNowOffilineListView.scss"
import { Link, useNavigate } from 'react-router-dom';
import Calendar from '../../assets/images/png/calendar.png';
import API from '../../services/httpInstance';
import { Select } from 'antd';
import Printer from "../../assets/images/png/print.png"
import { toast } from 'react-toastify';
import ViewRxModal from '../modal/viewRxModal/ViewRxModal';
import SaveTemplateModal from '../modal/saveTemplateModal/SaveTemplateModal';
import UploadImageModal from '../modal/uploadImageModal/UploadImageModal';
import PrescriptionTemplateModal from '../modal/prescriptionTemplateModal/PrescriptionTemplateModal';
import Dropdown from 'react-bootstrap/Dropdown';
import UploadImageViewModal from '../modal/uploadImageViewModal/UploadImageViewModal';

const consultNowOffilineListView = ({ formattedDate, isDiagnosis, isShowLabReading, patientData, template, appointmentId, patientId, appointmentDate, clinicId, doctorId }) => {
  const { Option } = Select;
  const [vitalList, setVitalList] = useState([]);
  const [defaultVitals, setDefaultVitals] = useState([]);
  const [examinationList, setExaminationList] = useState([]);
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
  const [medicationList, setMedicationList] = useState([])
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
  const [indicationMessage, setIndicationMessage] = useState("");
  const [meal, setMeal] = useState('');
  const [meal_id, setMealId] = useState(null);
  const [mealTitle, setMealTitle] = useState('');
  const [customInstruction, setCustomInstruction] = useState('')
  const [favouriteMedicineList, setFavouriteMedicineList] = useState([])
  const [groupMedicineList, setGroupMedicineList] = useState([])
  const [reminderValue, setReminderValue] = useState(null);
  const [isFrequency, setIsFrequency] = useState(false)
  const [isInstruction, setIsInstruction] = useState(false)
  const [customLabTest, setCustomLabTest] = useState('')
  const [note, setNote] = useState('')
  const [currentLab, setCurrentLab] = useState([])
  const [historyLab, setHistoryLab] = useState([])
  const [viewRxShow, setViewRxShow] = useState(false)
  const [saveTemplateShow, setSaveTemplateShow] = useState(false)
  const [labTest, setLabTest] = useState([])
  const [medicinesList, setMedicinesList] = useState([])
  const [uploadImageShow, setUploadImage] = useState(false)
  const [labReading, setLabReading] = useState([])
  const [selectDatePicker, setSelectDatePicker] = useState('')
  const [page, setPage] = useState(1);
  const [sendSms, setSendSms] = useState(0)
  const [searchTerm, setSearchTerm] = useState("");
  const [sendWhatsapp, setSendWhatsapp] = useState(0)
  const [vitalArray, setVitalArray] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [navActiveKey, setNavActiveKey] = useState("Examination");
  const [examslug, setExamslug] = useState([])
  const [labReadingListSlug, setLabReadingSlug] = useState([])
  const [defaultVitalArray, setDefaultVitalArray] = useState([])
  const [investigationId, setInvestigationId] = useState(null)
  const [isImageUploaded, setIsImageUploaded] = useState({});
  const [groupMedicines, setGroupMedicines] = useState([]);
  const [prescriptionTemplateShow, setPrescriptionTemplateShow] = useState(false)
  const [prescriptionCopyRX, setPrescriptionCopyRX] = useState('')
  const [uploadImageViewShow, setUploadImageViewShow] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [toastShow, setToastShow] = useState(false)
  const [editingMedication, setEditingMedication] = useState(null);
  const navigate = useNavigate()

  const handleImageUpload = () => {
    setIsImageUploaded(prevState => ({
      ...prevState,
      [investigationId]: true
    }));
    getCurrentLab();
  };

  const handleViewRxShow = () => setViewRxShow(true)
  const handleViewRxClose = () => setViewRxShow(false)

  const handleSaveTemplateShow = () => setSaveTemplateShow(true)
  const handleSaveTemplateClose = () => setSaveTemplateShow(false)

  const handlehandlePrescriptionTemplateShow = () => setPrescriptionTemplateShow(true)
  const handlePrescriptionTemplateClose = () => setPrescriptionTemplateShow(false)

  const handlePostData = (e) => {
    setPostData(e.target.value)
  }


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
        !("additionalValue" in obj) // Exclude objects that have additionalValue
    );

    const payload = {
      appointment_id: appointmentId,
      date_select: selectDatePicker,
      send_sms: sendSms ? 1 : 0,
      send_whatsapp: sendWhatsapp ? 1 : 0,
      labreading: filteredData,
      examinArray: examslug,
      vitalArray: (vitalArray && vitalArray.length > 0) ? vitalArray : defaultVitalArray,
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

  // Handle printing prescriptions
  const handlePrintPrescription = async (language) => {
    try {
      const response = await API.get(`/print-prescription?appointment_id=${appointmentId}&language=${language}`);
      if (response?.status == 200) {
        const pdfUrl = response.data?.data?.url;
        if (pdfUrl) {
          window.open(pdfUrl, "_blank");
        } else {
          throw new Error('PDF URL not found in the response');
        }
      }
    } catch (error) {
      console.error(`Error printing ${language} prescription:`, error.message);
    }
  };

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

  const handleUploadImageShow = (id) => {
    setInvestigationId(id)
    setUploadImage(true)
  }
  const handleUploadImageClose = () => setUploadImage(false)

  // get examination and vital
  const getConsultNow = async () => {
    try {
      const response = await API?.get(`/examination/${appointmentId}`)
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

  // Handler functions for updating examslug array
  const handleValueChange = (slug, newValue) => {
    const updatedExamslug = examslug.map(item =>
      item.slug === slug ? { ...item, value: newValue } : item
    );
    setExamslug(updatedExamslug);  // Update the state with the new value
  };

  const handleCheckboxChange = (slug, value) => {
    const updatedExamslug = examslug.map(item => {
      if (item.slug === slug) {
        const newValue = item.value.includes(value)
          ? item.value.filter(val => val !== value)  // Uncheck, remove value
          : [...item.value, value];  // Check, add value
        return { ...item, value: newValue };
      }
      return item;
    });
    setExamslug(updatedExamslug);  // Update the state with the new value
  };

  const handleRadioChange = (slug, value) => {
    const updatedExamslug = examslug.map(item =>
      item.slug === slug ? { ...item, value } : item
    );
    setExamslug(updatedExamslug);  // Update the state with the new value
  };

  // get Patient Data
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

  const getMedication = async () => {
    const response = await API.get(`/consult-now/${appointmentId}`)
    // console.log(response?.data?.data, "medication")
    setDurationList(response?.data?.data?.duration)
    setDosageList(response?.data?.data?.dosage)
    setInstructionList(response?.data?.data?.instruction)
    setfrequencyList(response?.data?.data?.frequency)
  }

  // get delete diagnosis
  const deleteCurrentDiagnosis = async (id) => {
    try {
      const response = await API.delete(`/delete-diagnosis?id=${id}&patient_id=${patientId}`)
      if (response.status == 200) {
        getPatientData()
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

  // const changeStatus = (id, source) => {
  //   const newStatus = 1; // Set the status to "inactive" or "1" here

  //   // Handle status change and move between lists
  //   if (source === 'currentDiagnosis') {
  //     // Move from currentDiagnosis to pastMedical
  //     setPastMedical(prev => [...prev, currentDiagnosis.find(item => item.id === id)]);
  //     setCurrentDiagnosis(prev => prev.filter(item => item.id !== id));
  //   } else if (source === 'pastMedical') {
  //     // Move from pastMedical to currentDiagnosis
  //     setCurrentDiagnosis(prev => [...prev, pastMedical.find(item => item.id === id)]);
  //     setPastMedical(prev => prev.filter(item => item.id !== id));
  //   }

  //   // Update the status in the database
  //   patchDiagnosis(id, newStatus);
  // }

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


  const addDiagnosis = async (item) => {
    const payload = {
      patient_id: patientId,
      clinic_id: clinicId,
      status: selectCategory === 'indications' ? 1 : 0,
      appointment_id: appointmentId,
      doctor_id: doctorId,
      diagnosis_id: item.id
    }
    try {
      const response = await API.post('/add-diagnosis', payload);
      if (response.status === 200) {
        await getPatientData(); // Ensure this updates `currentDiagnosis` state
      }
    } catch (error) {
      console.error('Error', error);
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

  const handleUploadImageViewShow = (imageUrl) => {
    setSelectedImage(imageUrl)
    setUploadImageViewShow(true)
  }

  const handleUploadImageViewClose = () => setUploadImageViewShow(false)

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
        getPatientData()
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
        getPatientData()
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
        getPatientData()
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

  const handleAddMedication = () => {
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

    const newMedication = {
      medicineTitle: medicineTitle || title,
      medicine_id: medicine_id,
      frequency_id: frequency_id,
      frequency: isFrequency ? `${morning} + ${afternoon} + ${evening} + ${night}` : frequency,
      frequency_title: isFrequency ? `${morning} + ${afternoon} + ${evening} + ${night}` : frequency_title,
      morning,
      afternoon,
      evening,
      night,
      duration: duration,
      dosage: dosage,
      customInstruction: customInstruction,
      dosage_title: dosage_title,
      dosage_id: dosage_id,
      dosagevalue: dosagevalue,
      duration_title: duration_title,
      duration_id: duration_id,
      durationvalue: durationvalue,
      mealTitle: isInstruction ? meal : mealTitle,
      meal_id: isInstruction ? null : meal_id
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

  const handleChangeMedicineId = (value) => {
    setMedicineId(value);
    const selectedMedicine = medicationList?.find((item) => item?.id === value);

    if (selectedMedicine) {
      setMedicineTitle(selectedMedicine?.title);
    }
  }

  const handleChangeDuration = (event) => {
    if (event.target.value.length <= 2) {
      setDurationValue(event.target.value);
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

  const getfavouriteMedicine = async () => {
    try {
      const response = await API.get("/get-medicine")
      if (response.status == 200) {
        setFavouriteMedicineList(response?.data?.data?.favourite_medicine)
        setGroupMedicineList(response?.data?.data?.group_medicine)
      }
      // console.log(response?.data?.data?.favourite_medicine)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentLab = async () => {
    try {
      const response = await API.get(`/current-lab/${appointmentId}`)
      // console.log(response, "getCurrentLab")
      setCurrentLab(response?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getHistoryLab = async () => {
    try {
      const response = await API.get(`/labhistory?appointment_id=${appointmentId}`)
      setHistoryLab(response?.data?.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getLabTest = async () => {
    try {
      const response = await API.get("/lab-test");
      if (response.status === 200) {
        setLabTest(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCustomLabTest = (value) => {
    setCustomLabTest(value)
  }

  const handleAddInvestigation = async () => {
    if (!customLabTest && !note.trim()) {
      setIndicationMessage('Please choose a lab test or enter an instruction first');
      return;
    } else if (!customLabTest) {
      setIndicationMessage('Please choose a lab test');
      return;
    }
    const payload = {
      appointment_id: appointmentId,
      patient_id: patientId,
      customlabtest: customLabTest ? [customLabTest] : [],
      note: note
    }
    try {
      const response = await API?.post('/prescribe-lab-note', payload)
      if (response.status === 200) {
        getCurrentLab();
        setCustomLabTest('');
        setNote('');
        setIndicationMessage(response?.data?.message)
      } else {
        setIndicationMessage(response?.data?.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getDeleteCurrent = async (id) => {
    try {
      const response = await API.delete(`/delete-prescribed-labtest?LabId=${id}`)
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
        })
        getCurrentLab()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 1000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])

  const getLabReading = async () => {
    const response = await API.get(`/lab-reading-filter?patient_id=${patientId}&date=${formattedDate}`)
    // console.log(response?.data?.data, "lab Reading")
    setLabReading(response?.data?.data)
  }

  // edit list of medication
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

  // delete list of medication
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

  const handleTemplateSaved = (newGroupMedicine) => {
    setGroupMedicines(prevGroup => [...prevGroup, newGroupMedicine]);
    getfavouriteMedicine()
  };

  // reminder change
  const handleReminderChange = (e) => {
    setReminderValue(e.target.value);
  };

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

  const handleAllergiesStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    try {
      const response = await API.patch('/status-allergies', {
        id,
        status: newStatus,
        patientId: patientId
      });

      if (response?.status == 200) {
        setAllergies(prevAllergie => {
          const updatedAllergies = prevAllergie[3]?.list.map(item => {
            if (item.id === id) {
              return { ...item, status: newStatus };
            }
            return item;
          });
          const updatedAllergie = [...prevAllergie];
          updatedAllergie[3].list = updatedAllergies;
          return updatedAllergie;
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
    getConsultNow()
    getLabReading()
    getCurrentLab()
    getQuickList()
    getHistoryLab()
    getfavouriteMedicine()
    getMedication()
    getChooseMedication()
    getLabTest()
  }, [page])

  useEffect(() => {
    const interval = setInterval(() => {
      getPatientData();
    }, 5000);

    getQuickList();

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  useEffect(() => {
    getListingValue();
  }, [searchQuery])

  const handleSearch = (value) => {
    setCustomLabTest(value);
  };


  const scrollToFn = (id) => {
    let idNew = document.getElementById(id)
    if (idNew) {
      idNew.scrollIntoView({ behaviour: "smooth" });
    }
  }

  useEffect(() => {
    if (labReading) {
      const prefilledData = labReading?.map((item) => ({
        id: item?.id,
        value: item?.value || "", // Use existing value or empty
        additionalValue: "" // Empty second column field
      }));
      setLabReadingSlug(prefilledData);
    }
  }, [labReading]);

  const handleInputChange = (id, value) => {
    setLabReadingSlug((prevList) => {
      const existingIndex = prevList.findIndex((obj) => obj.id === id);

      if (existingIndex !== -1) {
        // Update existing object
        const updatedList = [...prevList];
        updatedList[existingIndex] = { id, value };
        return updatedList;
      } else {
        // Add new object only if value is not empty
        return value ? [...prevList, { id, value }] : prevList;
      }
    });
  };

  const groupedReadings = Array.isArray(labReading)
    ? labReading.reduce((acc, item) => {
      if (!acc[item.title]) {
        acc[item.title] = [];
      }
      acc[item.title].push(item);
      return acc;
    }, {})
    : {};

  const mergedVitals = [...vitalList, ...defaultVitals];

  const isExaminationEmpty =
    (vitalList?.length === 0 || !vitalList) &&
    (defaultVitals?.length === 0 || !defaultVitals) &&
    (examinationList?.length === 0 || !examinationList) &&
    (isDiagnosis?.length === 0 || !isDiagnosis);

  useEffect(() => {
    if (isExaminationEmpty) {
      setNavActiveKey("Medication");
    } else {
      setNavActiveKey("Examination");
    }
  }, [vitalList, defaultVitals, examinationList, isDiagnosis]);

  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      <WraperLayout>
        <div className='consultNowOffilineListView'>
          <Nav activeKey={navActiveKey} className="list-nav">
            {!isExaminationEmpty &&
              <Nav.Item>
                <Nav.Link eventKey="Examination" onClick={() => { scrollToFn("examinationTab"); setNavActiveKey("Examination"); }}>Examination</Nav.Link>
              </Nav.Item>
            }
            <Nav.Item>
              <Nav.Link eventKey="Medication" onClick={() => { scrollToFn("medicationTab"); setNavActiveKey("Medication"); }}>Medication</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="Investigation" onClick={() => { scrollToFn("investigationTab"); setNavActiveKey("Investigation"); }}>Investigation</Nav.Link>
            </Nav.Item>
            {isShowLabReading == 1 &&
              <Nav.Item>
                <Nav.Link eventKey="Lab Readings" onClick={() => { scrollToFn("labReadingsTab"); setNavActiveKey("Lab Readings"); }}> Lab Readings </Nav.Link>
              </Nav.Item>
            }
          </Nav>
          {/* examination */}
          {!isExaminationEmpty &&
            <div className='examinationListOffline'>
              <div className='examinationConsultNowList tw-w-full'>
                <Row className='h-100'>
                  {(vitalList?.length > 0 || defaultVitals?.length) > 0 && (
                    <Col lg={(examinationList?.length > 0 && Array.isArray(isDiagnosis) && isDiagnosis.length > 0) ? 4 : (examinationList?.length > 0 || (Array.isArray(isDiagnosis) && isDiagnosis.length > 0)) ? 6 : 12} style={{ borderRight: "1px solid #D3DEE9" }}>
                      <div className='vitalHead tw-flex tw-justify-between tw-items-center'>
                        <h3> Vitals </h3>
                        <Link to={`/view-history/${patientId}`}><span> View History </span></Link>
                      </div>
                      <ul>
                        {mergedVitals?.map((item) => (
                          <li key={item?.id}>
                            <label htmlFor="">{item?.title}</label>
                            <input
                              type="text"
                              value={item?.value || ''}
                              onChange={(e) => {
                                const updatedValue = e.target.value;

                                // Check if we are dealing with vitalList or defaultVitals
                                const isVitalList = vitalList?.length > 0;
                                const listToUpdate = isVitalList ? vitalList : defaultVitals;
                                const arrayToUpdate = isVitalList ? vitalArray : defaultVitalArray;

                                // Update the list (either vitalList or defaultVitals)
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

                                // Update the corresponding array (either vitalArray or defaultVitalArray)
                                const updatedVitalArray = arrayToUpdate.map((vital) =>
                                  vital.slug === item.slug ? { ...vital, value: updatedValue } : vital
                                );

                                // Set the updated array to state
                                if (isVitalList) {
                                  setVitalArray(updatedVitalArray);
                                } else {
                                  setDefaultVitalArray(updatedVitalArray);
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
                                  name={item.name}
                                  placeholder={item?.placeholder}
                                  value={item?.value}
                                  onChange={(e) => handleValueChange(item?.slug, e.target.value)}
                                ></textarea>
                              </div>
                            ) : item?.field_type === 'dropdown' ? (
                              <div className="single_field customSelect">
                                <label htmlFor="">{item?.name}</label>
                                <Form.Select name={item?.name} onChange={(e) => handleValueChange(item?.slug, e.target.value)}>
                                  {item?.list_items?.data?.length > 0 && item?.list_items?.data?.map((list) => (
                                    <option value={list?.value} key={list?.id}>
                                      {list?.label}
                                    </option>
                                  ))}
                                </Form.Select>
                              </div>
                            ) : item?.field_type === 'checkbox' ? (
                              <div className="singleTextArea">
                                <label htmlFor=""> {item?.name} </label>
                                <div className="checksWraping">
                                  {item?.list_items?.data?.length > 0 && item?.list_items?.data?.map((list) => (
                                    <div className="singleTick customTickCheck" key={list?.id}>
                                      <label htmlFor="tick">
                                        <input
                                          type="checkbox"
                                          id="tick"
                                          checked={item?.value?.includes(list?.value)}
                                          onChange={() => handleCheckboxChange(item?.slug, list?.value)}
                                        />
                                        <span></span>
                                        {list?.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : item?.field_type === 'multiselect' ? (
                              <div className="singleTextArea">
                                <label htmlFor=""> {item?.name} </label>
                                <div className="checksWraping">
                                  {item?.list_items?.data?.length > 0 && item?.list_items?.data?.map((list) => (
                                    <div className="singleTick customTickCheck" key={list?.id}>
                                      <label htmlFor="tick">
                                        <input
                                          type="checkbox"
                                          id="tick"
                                          checked={item?.value?.includes(list?.value)}
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
                                <label htmlFor=""> {item?.name} </label>
                                <div className="checksWraping">
                                  {item?.list_items?.data?.length > 0 && item?.list_items?.data?.map((list) => (
                                    <div className="single customRadioo" key={list?.id}>
                                      <div className="wrapeInp">
                                        <input
                                          type="radio"
                                          id={list?.value}
                                          name={item?.slug}
                                          checked={item?.value === list?.value}
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
                    <Col lg={((vitalList?.length > 0 || defaultVitals?.length > 0) && examinationList?.length > 0) ? 4 : ((vitalList?.length > 0 || defaultVitals?.length > 0) || examinationList?.length > 0) ? 6 : 12} style={{ borderLeft: "1px solid #D3DEE9" }}>
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
                                        <th>Status</th>
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
          }

          {/* medication */}
          <div className='medication_list' id='medicationTab'>
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
              <Col lg={8}>
                <h3>Medication List</h3>
                <Row>
                  <Col lg={12}>
                    <div className="wrape_indication">
                      <div className="table__wrape tableConsultSub">
                        <Table responsive className=''>
                          <thead>
                            <tr>
                              <th>Medicine </th>
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
                      <Tabs
                        defaultActiveKey="favouriteMedicine"
                        id="uncontrolled-tab-example"
                      >
                        <Tab eventKey="favouriteMedicine" title="Favourite Medicine">
                          <FavouriteMedicine favouriteMedicineList={favouriteMedicineList} handleMedicineSelection={handleMedicineSelection} />
                        </Tab>
                        <Tab eventKey="groupMedicine" title="Group Medicine">
                          <GroupMedicine groupMedicineList={groupMedicineList} handleGroupMedicineSelection={handleGroupMedicineSelection} getfavouriteMedicine={getfavouriteMedicine} />
                        </Tab>
                      </Tabs>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          {/* investigation */}
          <div className='investigationTabOffline pb-0' id="investigationTab">
            <Col lg={12}>
              <Row className='h-100'>
                <Col lg={3} className='h-100'>
                  <h3> New Investigation </h3>
                  <div className="single_field customSelect">
                    <label htmlFor=""> Choose Lab Test* </label>
                    <Select
                      showSearch
                      placeholder="Search for labs"
                      className="form-select"
                      value={customLabTest || undefined}
                      optionFilterProp="children"
                      onSearch={handleSearch}
                      onChange={handleCustomLabTest}
                    >
                      {labTest?.map((item) => (
                        <Option value={item?.id} key={item?.id}>
                          {item?.title}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="customTextArea">
                    <label htmlFor=""> Enter Instruction </label>
                    <textarea id="present_complaint" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                  </div>
                  <div className="wraper_btn">
                    <button onClick={handleAddInvestigation}> Add Investigation </button>
                  </div>
                  <ul className='wrapeFollowUp'>
                    <li>
                      <div className='form-checked'>
                        <h4> Follow-up Appointment </h4>
                        <div className='date-pick'>
                          <p>
                            {selectDatePicker ? `${selectDatePicker}` : ''}
                          </p>
                          <div className='date-input'>
                            <input type="date" value={selectDatePicker} onChange={(e) => setSelectDatePicker(e.target.value)} />
                            <img src={Calendar} />
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Form.Group className='form-checked'>
                        <Form.Label> Send prescription via WhatsApp </Form.Label>
                        <Form.Check type="checkbox" checked={sendWhatsapp} onChange={(e) => setSendWhatsapp(e.target.value)} />
                      </Form.Group>
                    </li>
                    <li>
                      <Form.Group className='form-checked'>
                        <Form.Label> Send prescription via SMS </Form.Label>
                        <Form.Check type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.value)} />
                      </Form.Group>
                    </li>
                  </ul>
                </Col>
                <Col lg={9} className='h-100'>
                  <h3> Lab Tests </h3>
                  <Tabs
                    defaultActiveKey="Current"
                    id="uncontrolled-tab-example"
                    className="mb-3 tabsCurrent"
                  >
                    <Tab eventKey="Current" title="Current">
                      <div className="currentTabInvest">
                        <div className="wrape_indication">
                          <div className="table__wrape tableConsultSub">
                            <Table responsive className=''>
                              <thead>
                                <tr>
                                  <th>Date </th>
                                  <th>Lab Test</th>
                                  <th>Instruction</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  currentLab?.length > 0 ? (
                                    currentLab?.map((item) => (
                                      <tr key={item?.id}>
                                        <td> {item?.created_at} </td>
                                        <td> {item?.lab_tests} </td>
                                        <td> {item?.note} </td>
                                        <td>
                                          <div className="wrape_actions">
                                            {
                                              item?.image_url_path || isImageUploaded[item?.id] ? (
                                                <button onClick={() => handleUploadImageViewShow(item?.image_url_path)}>
                                                  <CloudDownloadOutlined />
                                                </button>
                                              ) : (
                                                <button onClick={() => handleUploadImageShow(item?.id, item?.lab_tests)}>
                                                  <CloudUploadOutlined />
                                                </button>
                                              )
                                            }
                                            <span className="deleteIcon" onClick={() => getDeleteCurrent(item?.id)}></span>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className='text-center'>No data</td>
                                    </tr>
                                  )
                                }
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Tab>
                    <Tab eventKey="History" title="History">
                      <div className="currentTabInvest">
                        <div className="wrape_indication">
                          <div className="table__wrape tableConsultSub">
                            <Table responsive className=''>
                              <thead>
                                <tr>
                                  <th>Date </th>
                                  <th>Lab Test</th>
                                  <th>Instruction</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {historyLab?.length > 0 ? (
                                  historyLab?.map((item) => (
                                    <tr key={item?.id}>
                                      <td> {item?.created_at} </td>
                                      <td> {item?.lab_tests} </td>
                                      <td> {item?.note} </td>
                                      <td>
                                        <div className="wrape_actions">
                                          <button onClick={() => handleUploadImageShow(item?.id, item?.lab_tests)}><CloudUploadOutlined /></button>
                                          <span className="deleteIcon" onClick={() => getDeleteCurrent(item?.id)}></span>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (<tr>
                                  <td colSpan={4} className='text-center'>No data</td>
                                </tr>)}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Tab>
                  </Tabs>
                </Col>
              </Row>
            </Col>
          </div>

          {/* lab reading */}
          {isShowLabReading == 1 &&
            <div className='lab_reading_offline' id="labReadingsTab">
              <Row>
                <Col lg={12}>
                  <h3>New Investigation</h3>
                  <Table responsive>
                    <tbody>
                      {(() => {
                        // Get max number of readings where values are not null/empty
                        const maxColumns = Math.max(
                          ...Object.values(groupedReadings).map((items) =>
                            items.filter((item) => item?.value !== null && item?.value !== "").length
                          ),
                          1
                        );

                        return (
                          <>
                            {/* Date Row - Only show columns when data exists */}
                            <tr>
                              <td><p>Date</p></td>
                              {Array.from({ length: maxColumns }).map((_, index) => {
                                const dateValue = Object.values(groupedReadings)
                                  .flat()
                                  .filter(item => item?.value !== null && item?.value !== "")[index]?.date;

                                return dateValue ? (
                                  <td key={`date-${index}`}>
                                    <input type="text" value={dateValue} readOnly />
                                  </td>
                                ) : (
                                  <td key={`empty-date-${index}`}>
                                    <input type="text" value={formattedDate} readOnly />
                                  </td>
                                );
                              })}
                            </tr>


                            {/* Dynamic Rows */}
                            {Object.entries(groupedReadings).map(([title, items]) => {
                              // Filter out items that have null/empty values
                              const validItems = items.filter(item => item?.value !== null && item?.value !== "");

                              return (
                                <tr key={title}>
                                  <td><p>{title}</p></td>

                                  {/* Display only non-null values */}
                                  {validItems.map((item) => (
                                    <td key={item.id}>
                                      <input type="text" value={item?.value} readOnly />
                                    </td>
                                  ))}

                                  {/* Ensure alignment by filling in missing columns */}
                                  {Array.from({ length: maxColumns - validItems.length }).map((_, index) => (
                                    <td key={`empty-${title}-${index}`} style={{ display: 'none' }}></td>
                                  ))}

                                  {/* Empty Column for New Input */}
                                  <td>
                                    <input type="text" onChange={(e) => handleInputChange(items?.[0]?.id, e.target.value)} />
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        );
                      })()}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          }

          <div className="btnsWraping">
            <button onClick={handleSaveTemplateShow}> Save Template</button>
            <button onClick={handleViewRxShow}>VIEW RX</button>
            <button onClick={handlePrescriptionCopyRX}>Copy RX</button>
          </div>
          <div className="print_action position-relative">
            <button onClick={handlehandlePrescriptionTemplateShow}><img src={Printer} alt="" /></button>
            <div className="d-lg-none d-block">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  Print <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M12.9483 6.57129L8.4272 11.0924L3.9061 6.57129" stroke="#0F75BC" stroke-width="1.93762" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="" onClick={() => handlePrintPrescription("urdu")}>Print اردو</Dropdown.Item>
                  <Dropdown.Item href="" onClick={() => handlePrintPrescription("english")}>Print English</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="d-lg-none d-block mobileDropdown">
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic">
                  Print <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M12.9483 6.57129L8.4272 11.0924L3.9061 6.57129" stroke="#0F75BC" stroke-width="1.93762" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="" onClick={() => handlePrintPrescription("urdu")}>Print اردو</Dropdown.Item>
                  <Dropdown.Item href="" onClick={() => handlePrintPrescription("english")}>Print English</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <button className='button1 d-lg-block d-none' onClick={() => handleSaveButton("urdu")}>Print اردو</button>
            <button className='button1 d-lg-block d-none' onClick={() => handleSaveButton("english")}>Print English</button>
            <button className='button2' onClick={() => handleSaveButton(1)}>Save</button>
          </div>
        </div>
        <ViewRxModal setViewRxShow={setViewRxShow} setMedicinesList={setMedicinesList} setIndicationMessage={setIndicationMessage} handlePrescriptionCopyRX={handlePrescriptionCopyRX} viewRxShow={viewRxShow} handleViewRxClose={handleViewRxClose} patientId={patientId} patientData={patientData} appointmentDate={appointmentDate} />
        <SaveTemplateModal groupMedicines={groupMedicines} setGroupMedicines={setGroupMedicines} onTemplateSaved={handleTemplateSaved} saveTemplateShow={saveTemplateShow} medicinesList={medicinesList} handleSaveTemplateClose={handleSaveTemplateClose} />
        <UploadImageModal uploadImageShow={uploadImageShow} note={note} investigationId={investigationId} onImageUpload={handleImageUpload} handleUploadImageClose={handleUploadImageClose} appointmentId={appointmentId} clinicId={clinicId} patientId={patientId} />
        <UploadImageViewModal handleUploadImageViewClose={handleUploadImageViewClose} uploadImageViewShow={uploadImageViewShow} imageUrl={selectedImage} />
        <PrescriptionTemplateModal prescriptionTemplateShow={prescriptionTemplateShow} handlePrescriptionTemplateClose={handlePrescriptionTemplateClose} template={template} />
      </WraperLayout >
    </>

  )
}

export default consultNowOffilineListView