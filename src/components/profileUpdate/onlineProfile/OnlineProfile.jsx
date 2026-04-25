/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Form, FormSelect } from "react-bootstrap"
import User from "../../../assets/images/svg/userIcon.svg"
import ImageUploader from "../../../assets/images/png/image_uploader.png"
import ImageEdit from "../../../assets/images/png/image_edit.png"
import Select from 'react-select'
import VideoCam from '../../../assets/images/svg/videocam.svg'
import { colourOptions } from '../../../services/data/indexSelectMulti'
import ProfileInPersonConsultationModal from '../../modal/profileInPersonConsultationModal/ProfileInPersonConsultationModal';
import ProfileVideoConsultationsModal from '../../modal/profileVideoConsultationsModal/ProfileVideoConsultationsModal';
import ReminderMedical from '../../../assets/images/svg/reminder-medical.svg'
import ProfileUpdateModal from '../../modal/profileUpdateModal/ProfileUpdateModal'
import "./onlineProfile.scss"
import API, { API_MERISEHAT, API_MS } from '../../../services/httpInstance'
import { useSelector } from 'react-redux'
import parse from 'html-react-parser';
import { specialityApi } from '../../../services/endpoints'
import { InputMask } from '@react-input/mask'
import { Prev } from 'react-bootstrap/esm/PageItem'
import { toast } from 'react-toastify'
import Loader from '../../loader/Loader'
import { v4 as uuidv4 } from 'uuid';
import { debounce } from "lodash";


const OnlineProfile = ({ detailsDoctor, phoneNumber }) => {
  const [profileImg, setProfileImg] = useState(null);
  const [profileUpdateShow, setProfileUpdateShow] = useState(false);
  const [videoConsultationsShow, setVideoConsultationsShow] = useState(false);
  const [inPersonConsultationShow, setInPersonConsultationShow] = useState(false);
  const [onlineDetailsData, setOnlineDetailsData] = useState({});
  const [specialityData, setSpecialityData] = useState([]);
  const [aboutMe, setAboutMe] = useState("")
  const [expYears, setExpYears] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [specialityDataAll, setSpecialityDataAll] = useState([]);
  const [bankAccountName, setBankAccountName] = useState("")
  const [ibanNumber, setIbanNumber] = useState(null)
  const [bankName, setBankName] = useState("");
  const [cnic, setCnic] = useState("");
  const [count, setCount] = useState(0);
  const [educationOptionsMore, setEducationOptionsMore] = useState([1]);
  const [experienceOptionsMore, setExperienceOptionsMore] = useState([1]);
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [conditionOptions, setConditionOptions] = useState([]);
  const [selectedEducation, setSelectedEducation] = useState([]);
  const [institutesAll, setInstitutesAll] = useState([])
  const [certificationsAll, setCertificationsAll] = useState([])
  const [selectedExperience, setSelectedExperience] = useState([])
  const [degreesAll, setDegreesAll] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, index) => 2000 + index);
  const [phone, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [cityId, setCityId] = useState(null)
  const [pmdc, setPmdc] = useState(null)
  const [msUserId, setMsUserId] = useState(null)
  const [nameField, setNameField] = useState("")
  const [isMsUser, setIsMsUser] = useState(true)
  const [msUserbtn, setMsUserbtn] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [indicationMessage, setIndicationMessage] = useState("")
  const [errorObj, setErrorObj] = useState({})
  const [isVideoFieldsEmpty, setIsVideoFieldsEmpty] = useState(false)
  const [isPersonFieldsEmpty, setIsPersonFieldsEmpty] = useState(false)
  const [callInPersonFn, setCallInPersonFn] = useState(false)
  const [callVideoFn, setCallVideoFn] = useState(false)
  // const [callFns, setCallFns] = useState(false);

  let userId = useSelector((state) => state.user?.user?.id);

  const handleInPersonConsultationClose = () => setInPersonConsultationShow(false);

  const handleInPersonConsultationShow = () => {
    // if (onlineDetailsData?.ms_user_id) {
    //   setIsMsUser(false);
    //   setInPersonConsultationShow(true);
    // }
    // else {
    //   setIsMsUser(true);
    // }
    setInPersonConsultationShow(true);
  }

  const getMsUser = () => {
    if (onlineDetailsData && onlineDetailsData !== undefined && onlineDetailsData?.ms_user_id) {
      setIsMsUser(false);
      setMsUserbtn(true);
    } else {
      setIsMsUser(true);
      setMsUserbtn(false);
    }
  }

  useEffect(() => {
    getMsUser();
  }, [onlineDetailsData, isMsUser, msUserbtn]);

  const handleVideoConsultationsClose = () => setVideoConsultationsShow(false);

  const handleVideoConsultationsShow = () => {
    // if (onlineDetailsData?.ms_user_id) {
    //   setVideoConsultationsShow(true);
    //   setIsMsUser(false);
    // }
    // else {
    //   setIsMsUser(true);
    //   setMsUserbtn(false)
    //   return;
    // }
    setVideoConsultationsShow(true);

  }

  const handleProfileUpdateClose = () => setProfileUpdateShow(false);
  const handleProfileUpdateShow = () => setProfileUpdateShow(true);

  useEffect(() => {
    getOnlineDetails();
    specialitiesFn();
    servicesFn();
    getInstitutes();
    getCertfications();
    getDegrees();
  }, [])

  useEffect(() => {
    if (phoneNumber !== "" || phoneNumber !== undefined || phoneNumber !== null) {
      getOnlineDetails();
    }
  }, [phoneNumber]);


  //   const fetchConditionsDebounced = debounce(async (specialityId, namedVal) => {
  //     await fetchConditions(specialityId, namedVal);
  // }, 500);

  const fetchConditions = async (specialityId, namedVal) => {
    try {
      const response = await API_MERISEHAT.get(`/conditions?${namedVal}=${true}&speciality_id=${specialityId}`);
      if (response?.status == 200) {
        setIsLoading(false)
        if (namedVal == "service") {
          const servicess = response?.data?.services?.map((service) => ({
            value: service?.id,
            label: service?.name,
          }));
          setServiceOptions(servicess);
        }
        else {
          const conditions = response?.data?.condition?.map((condition) => ({
            value: condition?.id,
            label: condition?.name,
          }));
          setConditionOptions(conditions);
        }
      }
      else {
        setIsLoading(false)
        setIndicationMessage(response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching conditions:", error);
      setIsLoading(false)
    }
  };

  // const convertToBase64 = async (file) => {
  //   if (!file) {
  //     return;
  //   }

  //   if (!file.type.match('image.*')) {
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const base64 = await readFileAsBase64(file);
  //     setBase64String(base64);
  //     return base64;
  //   } catch (err) {
  //     throw err;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };



  const getOnlineDetails = async () => {
    try {
      setIsLoading(true)
      const response = await API_MS.get(`/doctor-profile?phone=${phoneNumber}`);
      if (response?.status == 200 || response?.status == 201) {
        setOnlineDetailsData(response?.data?.data)
        setIsLoading(false)
      }
      else {
        setIsLoading(false);
        // setIndicationMessage(response?.data?.message)
      }
    } catch (error) {
      setIsLoading(false);
      console.log("error")
    }
  }

  const extractText = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  const handleChangeSpec = (e, index, item) => {
    const updatedExpertise = [...selectedExpertise];
    updatedExpertise[index].speciality_id = Number(e.target.value);
    setSelectedExpertise(updatedExpertise);
    if (item?.speciality_id) {
      fetchConditions(updatedExpertise[index].speciality_id, "service")
    }
  };

  const handleMultiChange = (index, field, selectedOptions) => {
    const updatedExpertise = [...selectedExpertise];
    updatedExpertise[index][field] = selectedOptions;
    setSelectedExpertise(updatedExpertise);
  };

  const handleMultiServiceChange = (selectedServices, index) => {
    const updatedExpertise = [...selectedExpertise];
    updatedExpertise[index].services = selectedServices;
    setSelectedExpertise(updatedExpertise);
    if (selectedServices.length > 0) {
      fetchConditions(updatedExpertise[index].speciality_id, "condition");
    }
  };

  useEffect(() => {
    if (onlineDetailsData) {
      let parsed = onlineDetailsData?.doctor_details?.about && extractText(onlineDetailsData?.doctor_details?.about);
      setNameField(onlineDetailsData?.name)
      setProfileImg(onlineDetailsData?.profile_picture);
      // setImageFile(onlineDetailsData?.profile_picture)
      setAboutMe(parsed);
      setExpYears(onlineDetailsData?.doctor_details?.experience)
      setMsUserId(onlineDetailsData?.ms_user_id);

      let expertises = onlineDetailsData?.doctor_expertise;
      setSelectedExpertise(
        (!expertises || expertises.length === 0)
          ? [{
            speciality_id: "",
            services: [{ value: "", label: "" }],
            conditions: [{ value: "", label: "" }]
          }]
          : expertises.map((expertise) => ({
            speciality_id: expertise?.id || "",
            services: (expertise?.services || []).map((service) => ({
              value: service?.id || "",
              label: service?.name || "",
            })),
            conditions: (expertise?.conditions || []).map((condition) => ({
              value: condition?.id || "",
              label: condition?.name || "",
            }))
          }))
      );

      let education = onlineDetailsData?.doctor_education;
      if (!education || education.length === 0) {
        setSelectedEducation([{ id: Date.now(), institute: '', completion: '', degree: '' }]);
      } else {
        setSelectedEducation(education.map((item) => ({
          id: item?.id,
          institute: item?.university?.id || '',
          completion: item?.year_of_completion || '',
          degree: item?.degree?.id || '',
        })));
      }

      let experience = onlineDetailsData?.experiences;
      if (!experience || experience.length === 0) {
        setSelectedExperience([
          {
            id: Date.now(),
            institute: '',
            startDate: '',
            endDate: '',
            certification: {
              id: '',
              certificateName: '',
            },
          },
        ]);
      } else {
        setSelectedExperience(experience?.map((item, index) => ({
          id: item?.id,
          institute: item?.institute?.id,
          startDate: item?.start_date,
          endDate: item?.end_date,
          certification: {
            id: onlineDetailsData?.certification?.[index]?.id || '',
            certificateName: onlineDetailsData?.certification?.[index]?.name || '',
          },
        })));
      }

      setBankAccountName(onlineDetailsData?.bank_details?.account_name)
      setBankName(onlineDetailsData?.bank_details?.bank_name)
      setIbanNumber(onlineDetailsData?.bank_details?.iban)
      setCnic(onlineDetailsData?.bank_details?.cnic)
    }
  }, [onlineDetailsData, phoneNumber])

  const handleChangeEducation = (index, field, value) => {
    const updatedEducation = [...selectedEducation];
    updatedEducation[index][field] = Number(value);
    setSelectedEducation(updatedEducation);
  };

  const handleAddMoreEducation = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setSelectedEducation([
      ...selectedEducation,
      { id: randomId, institute: '', completion: '', degree: '' },
    ]);
  };

  const addMoreSpeciality = () => {
    setSelectedExpertise([
      ...selectedExpertise,
      {
        speciality_id: "",
        services: [],
        conditions: [],
      },
    ]);
  };

  const specialitiesFn = async () => {
    try {
      setIsLoading(true)
      let response = await API_MERISEHAT.get(`/specialties`)
      if (response?.status == 200) {
        setSpecialityData(response?.data?.services);
        setIsLoading(false);
      }
      else {
        setIsLoading(false)
        setIndicationMessage(response?.data?.message);
      }
    } catch (error) {
      console.log("error", error)
      setIsLoading(false)
    }
  }


  const servicesFn = async () => {
    try {
      const response = await API_MERISEHAT.get("/services");
      const services = response?.data?.services?.map((service) => ({
        value: service?.id,
        label: service?.name,
      }));
      setServiceOptions(services);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { value, name, checked } = e.target;

    if (name == "about") {
      setAboutMe(value);
    }

    if (name == "expYears") {
      setExpYears(value);
    }

    if (name == "cnic") {
      setCnic(value);
    }

    if (name == "bankAccountName") {
      setBankAccountName(value);
    }

    if (name == "ibanNumber") {
      setIbanNumber(value);
    }

    if (name == "bankName") {
      setBankName(value);
    }
  }

  const allServices = servicesData?.map((service) => ({
    value: service?.id,
    label: service?.name,
  })) || [];

  const optionsMulti = allServices;

  const getInstitutes = async () => {
    try {
      setIsLoading(true)

      const response = await API_MERISEHAT.get("/institutes")
      if (response?.status == 200) {
        setIsLoading(false)

        setInstitutesAll(response?.data?.institutes);
      }
      else {
        setIsLoading(false)
        setIndicationMessage(response?.data?.message)
      }
    } catch (error) {
      setIsLoading(false)
      console.log("error")
    }
  }

  const getDegrees = async () => {
    try {
      setIsLoading(true)

      const response = await API_MERISEHAT.get("/degrees")
      if (response?.status == 200) {
        setDegreesAll(response?.data?.degrees);
        setIsLoading(false)

      }
      else {
        setIsLoading(false)
        setIndicationMessage(response?.data?.message);
      }
    } catch (error) {
      setIsLoading(false)

      console.log("error")
    }
  }

  const getCertfications = async () => {
    try {
      setIsLoading(true)
      const response = await API_MERISEHAT.get("/certifications")
      if (response?.status == 200) {
        setCertificationsAll(response?.data?.certifications);
        setIsLoading(false)
      }
      else {
        setIsLoading(false)
        setIndicationMessage(response?.data?.message);
      }
    } catch (error) {
      console.log("error")
    }
  }

  const handleChangeExperience = (index, field, value) => {
    const updatedExperience = [...selectedExperience];
    if (field.startsWith('certification.')) {
      const certField = field.split('.')[1];
      updatedExperience[index].certification[certField] = value;
    } else {
      updatedExperience[index][field] = value;
    }
    setSelectedExperience(updatedExperience);
  };

  const handleChangeCertification = (index, value) => {
    const updatedExperience = [...selectedExperience];
    const selectedCert = certificationsAll.find(cert => cert.id === parseInt(value));
    updatedExperience[index].certification = selectedCert || null;
    setSelectedExperience(updatedExperience);
  };

  const handleAddMoreExperience = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setSelectedExperience([
      ...selectedExperience,
      {
        id: randomId,
        institute: '',
        startDate: '',
        endDate: '',
        certification: [],
      },
    ]);
  };


  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 2000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])

  useEffect(() => {
    if (detailsDoctor?.user) {
      setPhoneNumber(detailsDoctor?.user?.phone);
      setEmail(detailsDoctor?.user?.email);
      setDob(detailsDoctor?.user?.dob);
      setGender(detailsDoctor?.user?.gender);
      setCityId(detailsDoctor?.user?.city_id);
      setPmdc(detailsDoctor?.user?.pmdc);
      setNameField(detailsDoctor?.user?.name)
      setExpYears(detailsDoctor?.user?.no_of_years_exp)
      setCnic(detailsDoctor?.user?.cnic)
    }
  }, [onlineDetailsData, phoneNumber, detailsDoctor])


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (!file) return;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [allFieldsFilled, setAllFieldsFilled] = useState(false)

  const allFieldsPresent = (
    profileImg &&
    userId &&
    nameField &&
    phone &&
    email &&
    dob &&
    gender &&
    cityId &&
    pmdc &&
    expYears &&
    aboutMe &&
    ibanNumber &&
    bankAccountName &&
    bankName &&
    detailsDoctor?.user?.practice_name &&
    detailsDoctor?.user?.practice_address &&
    cnic &&
    selectedExpertise?.length > 0 &&
    selectedEducation?.length > 0 &&
    selectedExperience?.length > 0
  );

  useEffect(() => {
    if (allFieldsPresent) {
      setAllFieldsFilled(true)
    }
    else {
      setAllFieldsFilled(false);
    }
  }, [allFieldsPresent]);

  const handleUpdate = async () => {
    let errors = {};

    const allFieldsPresent = (
      profileImg &&
      userId &&
      nameField &&
      phone &&
      email &&
      dob &&
      gender &&
      cityId &&
      pmdc &&
      expYears &&
      aboutMe &&
      ibanNumber &&
      bankAccountName &&
      bankName &&
      detailsDoctor?.user?.practice_name &&
      detailsDoctor?.user?.practice_address &&
      cnic &&
      selectedExpertise?.length > 0 &&
      selectedEducation?.length > 0 &&
      selectedExperience?.length > 0
    );
    if (allFieldsPresent) {
      const payload = {
        image: profileImg,
        gc_user_id: userId,
        name: nameField,
        phone,
        email,
        birth_date: dob,
        gender,
        city_id: cityId,
        pmc_no: pmdc,
        experience_years: expYears,
        about: aboutMe,
        iban_number: ibanNumber,
        account_name: bankAccountName,
        bank_name: bankName,
        prefix: "Dr",
        practice_name: detailsDoctor?.user?.practice_name,
        practice_address: detailsDoctor?.user?.practice_address,
        cnic,
        specialities: selectedExpertise?.map((item) => ({
          speciality_id: item?.speciality_id,
          services_conditions: item?.services?.map((service, index) => ({
            service_id: service?.value,
            condition_id: item?.conditions[index]?.value,
          })),
        })),
        educations: selectedEducation?.map((item) => ({
          id: item?.id,
          degree_id: item?.degree,
          university_id: item?.institute,
          year: item?.completion,
        })),
        experiences: selectedExperience?.map((item) => ({
          id: item?.id,
          institute_id: item?.institute,
          year_start: item?.startDate,
          year_end: item?.endDate,
          "position": "test",
        })),
        certifications: selectedExperience
          ?.filter((item) => item?.certification)
          ?.map((item) => ({
            id: item?.id,
            certification_id: String(item?.certification?.id),
          })),
      };
      const formData = new FormData();
      formData.append("image", imageFile);
      if (!aboutMe) errors.about = "About is required";
      if (!bankAccountName) errors.bankAccountName = "Bank Account Name is required";
      if (!bankName) errors.bankName = "Bank Name is required";
      if (!ibanNumber) errors.ibanNumber = "ibanNumber is required";
      if (selectedExpertise[0]?.speciality_id == "") errors.selectedExpertise = "Expertise is required";

      if (onlineDetailsData?.ms_user_id) {
        formData.append("ms_user_id", onlineDetailsData?.ms_user_id);
      }
      selectedExpertise?.forEach((item, index) => {
        formData.append(`specialities[${index}][speciality_id]`, item?.speciality_id);
        item?.services?.forEach((service, sIndex) => {
          formData.append(
            `specialities[${index}][services_conditions][${sIndex}][service_id]`,
            service?.value
          );
          formData.append(
            `specialities[${index}][services_conditions][${sIndex}][condition_id]`,
            item?.conditions[sIndex]?.value
          );
        });
      });

      selectedEducation?.forEach((item, index) => {
        formData.append(`educations[${index}][id]`, item?.id);
        formData.append(`educations[${index}][degree_id]`, item?.degree);
        formData.append(`educations[${index}][university_id]`, item?.institute);
        formData.append(`educations[${index}][year]`, item?.completion);
      });

      selectedExperience?.forEach((item, index) => {
        formData.append(`experiences[${index}][id]`, item?.id);
        formData.append(`experiences[${index}][institute_id]`, item?.institute);
        formData.append(`experiences[${index}][year_start]`, item?.startDate);
        formData.append(`experiences[${index}][year_end]`, item?.endDate);
        formData.append(`experiences[${index}][position]`, "test");
      });

      selectedExperience
        ?.filter((item) => item.certification?.id)
        ?.forEach((item, index) => {
          formData.append(
            `certifications[${index}][id]`,
            item?.certification?.id
          );
          formData.append(
            `certifications[${index}][certification_id]`,
            item?.certification?.id
          );
        });

      if (!pmdc) setIndicationMessage("Please update your clinic profile first");

      try {
        setIsLoading(true);
        const response = await API_MERISEHAT.post("/register", payload)
        if (response?.status === 200 || response?.status === 201) {
          setCallInPersonFn(true)
          setCallVideoFn(true)
          setProfileUpdateShow(true);
          getOnlineDetails();
          getMsUser();
          setIndicationMessage(response?.data?.message);
          setMsUserbtn(true)
          setIsLoading(false)
          setProfileUpdateShow(false);

          setTimeout(() => {
            setCallInPersonFn(true);
            setCallVideoFn(true);
          }, 1000);
        }
        if (response?.status === 422) {
          setCallVideoFn(false);
          setCallInPersonFn(false);
          setIndicationMessage(response?.data?.message);
          setIsLoading(false);
        }
        else {
          setIndicationMessage(response?.data?.message);
          setIsLoading(false)
          setCallInPersonFn(false)
          setCallVideoFn(false)
          setCallInPersonFn(true)
        }
      } catch (error) {
        setIsLoading(false)
        setCallInPersonFn(false)
        setCallVideoFn(false)
      }
    }
    else {
      setIsLoading(false);
      setIndicationMessage("Please Fill all the fields");
      setCallInPersonFn(false)
      setCallVideoFn(false)
    }
    setErrorObj(errors);
  }

  const handleCrossExper = (itemToRemove, indexToRemove) => {
    const updatedList = selectedExpertise.filter((_, index) => index !== indexToRemove);
    setSelectedExpertise(updatedList);
  };

  const handleCrossEduc = (itemToRemove, indexToRemove) => {
    const updatedList = selectedEducation.filter((_, index) => index !== indexToRemove);
    setSelectedEducation(updatedList);
  };

  const handleCrossCert = (itemToRemove, indexToRemove) => {
    const updatedList = selectedExperience.filter((_, index) => index !== indexToRemove);
    setSelectedExperience(updatedList);
  };

  const [disabledBtn, setDisabledBtn] = useState(false);

  useEffect(() => {
    if (isPersonFieldsEmpty === true && isVideoFieldsEmpty === true) {
      setDisabledBtn(true);
    }
    else {
      setDisabledBtn(false)
    }
  }, [isPersonFieldsEmpty, isVideoFieldsEmpty])

  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      {isLoading ? <Loader />
        :
        <div className='online-profile'>
          <h3>Boost Your Online Presence with Meri Sehat!</h3>
          <label htmlFor='image_profile' className="upload_patient">
            <div className="img-holder">
              {profileImg ? (
                <>
                  <img src={profileImg} alt="Profile" className="img-preview" />
                  <img src={ImageEdit} className='image_edit' alt="" />
                </>
              ) : (
                <div className='upload_img'>
                  <span><img src={User} alt="" className='user' /></span>
                  <img src={ImageUploader} className='image_uploader' alt="" />
                </div>
              )}
            </div>
            <input
              id="image_profile"
              type="file"
              onChange={handleFileChange}
              className={"imageeOnline"}
            />
            <p>Provide the required details to feature your profile on Meri Sehat. Once reviewed and approved, you'll receive an email, and your profile will go live—making it easy for patients to find and book with you!</p>
          </label>
          <div className="about">
            <Row>
              <Col lg={6}>
                <h5>About Me</h5>
                <Form.Group className='mb-3'>
                  <Form.Control type="text" placeholder="Please share a brief bio to provide additional information about yourself..." name="about" value={aboutMe} onChange={handleChange} ></Form.Control>
                  <span className='error'> {errorObj.about} </span>
                </Form.Group>
              </Col>
              <Col lg={5}>
                <Form.Group className='mb-3'>
                  <Form.Label>Experience in Years</Form.Label>
                  <Form.Control type="text" name="expYears" placeholder='00' value={expYears} onChange={handleChange}></Form.Control>
                </Form.Group>
              </Col>
              {selectedExpertise?.map((item, index) => {
                return (<>
                  <Row>
                    <Col lg={3}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Select your speciality </Form.Label>
                        <Form.Select name="speciality" onChange={(e) => handleChangeSpec(e, index, item)} value={item?.speciality_id}>
                          <option value=""> Select your speciality </option>
                          {specialityData?.map((specialttyy) => {
                            return (<>
                              <option key={specialttyy.id} value={specialttyy.id}>
                                {specialttyy?.name}
                              </option>
                            </>)
                          })}
                        </Form.Select>
                        <span className='error'> {errorObj.selectedExpertise} </span>
                      </Form.Group>
                    </Col>
                    <Col lg={4}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Select your services</Form.Label>
                        <Select
                          isMulti
                          name="multi_services"
                          value={item?.services?.[0]?.value ? item.services : []}
                          options={serviceOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={(selected) => handleMultiServiceChange(selected, index)}
                        />
                      </Form.Group>
                    </Col>
                    <Col lg={4} className=''>
                      <Form.Group className='mb-3'>
                        <Form.Label>Select Conditions your treat</Form.Label>
                        <div className='tw-flex tw-items-center'>
                          <Select
                            isMulti
                            name="colors"
                            value={item?.conditions?.[0]?.value ? item.conditions : []}
                            options={conditionOptions}
                            className="basic-multi-select slccc_myl"
                            classNamePrefix="select"
                            onChange={(selectedOptions) => handleMultiChange(index, "conditions", selectedOptions)}
                            style={{ width: "90%" }}
                          />
                          {index !== 0 && <span className='crossICon' onClick={() => handleCrossExper(item, index)}>  </span>}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </>)
              })}
            </Row>
            <button className='button1 add_more' onClick={addMoreSpeciality}>ADD MORE</button>
          </div>
          <h4>Education</h4>
          <div className="education">
            {selectedEducation?.map((item, index) => (
              <Row key={index}>
                <Col lg={3}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Degree*</Form.Label>
                    <Form.Select
                      name='education'
                      value={item?.degree}
                      onChange={(e) =>
                        handleChangeEducation(index, 'degree', e.target.value)
                      }
                    >
                      <option value=""> Select Degree </option>
                      {degreesAll?.map((item) => {
                        return (<>
                          <option value={item?.id} selected={item?.degree}> {item?.name} </option>
                        </>)
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Institute / University*</Form.Label>
                    <Form.Select
                      name='institute'
                      value={item?.institute}
                      onChange={(e) =>
                        handleChangeEducation(index, 'institute', e.target.value)
                      }>
                      <option value=""> Select Institute </option>
                      {institutesAll?.map((item) => {
                        return (<>
                          <option value={item?.id} selected={item?.id}> {item?.name} </option>
                        </>)
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col lg={3}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Year of Completion*</Form.Label>
                    <div className='tw-flex tw-items-center'>
                      <Form.Select value={item?.completion} onChange={(e) =>
                        handleChangeEducation(index, 'completion', e.target.value)
                      }
                        className='slccc_myl'
                      >
                        <option value="please-select">Please Select</option>
                        {years.map((year) => (
                          <option key={year} value={year} selected={year} >
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                      {index !== 0 && <span className='crossICon' onClick={() => handleCrossEduc(item, index)}>  </span>}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            ))}
            <button className='button1 add_more' onClick={handleAddMoreEducation}>ADD MORE</button>
          </div>
          <h4>Experience</h4>
          <div className="experience">
            {selectedExperience?.map((item, index) => {
              return (<>
                <Row key={index}>
                  <Col lg={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Institute / University*</Form.Label>
                      <Form.Select
                        name='institute'
                        value={item?.institute}
                        onChange={(e) =>
                          handleChangeExperience(index, 'institute', e.target.value)
                        }
                      >
                        <option value=""> Select Institute </option>
                        {institutesAll?.map((item) => {
                          return (<>
                            <option value={item?.id} selected={item?.id}>{item?.name}</option>
                          </>)
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Start Year</Form.Label>
                      <Form.Select value={item?.startDate}
                        onChange={(e) =>
                          handleChangeExperience(index, 'startDate', e.target.value)
                        }>
                        <option value="">Please Select</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>End Year</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          handleChangeExperience(index, 'endDate', e.target.value)
                        }
                        value={item?.endDate}
                      >
                        <option value="">Please Select</option>
                        {years.map((year) => {
                          return (<>
                            <option key={year} value={year}>
                              {year}
                            </option>
                          </>)
                        })}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col lg={9}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Personal Membership / Certification</Form.Label>
                      <div className='tw-flex tw-items-center'>
                        <Form.Select
                          value={item.certification?.id || ""}
                          onChange={(e) =>
                            handleChangeCertification(index, e.target.value)
                          }
                          className='slccc_myl'
                        >
                          <option value="">Select Certification</option>
                          {certificationsAll?.map((cert) => {
                            return (<>
                              <option key={cert?.id} value={cert?.id} selected={item.certification?.id} >
                                {cert?.name}
                              </option>
                            </>)
                          })}
                        </Form.Select>
                        {index !== 0 && <span className='crossICon' onClick={() => handleCrossCert(item, index)}>  </span>}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </>)
            })}
            <button className='button1 add_more' onClick={handleAddMoreExperience}>ADD MORE</button>
          </div>
          <h4>Bank Details</h4>
          <div className="bank-details">
            <Row>
              <Col lg={3}>
                <Form.Group className='mb-3'>
                  <Form.Label>Account Name</Form.Label>
                  <Form.Control type="text" placeholder='Enter account name' name='bankAccountName' onChange={handleChange} value={bankAccountName} />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className='mb-3'>
                  <Form.Label>Account / IBN number</Form.Label>
                  <Form.Control type="text" placeholder='Enter IBN Number' name='ibanNumber' onChange={handleChange} value={ibanNumber} />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className='mb-3'>
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control type="text" placeholder='Enter Bank name' name='bankName' onChange={handleChange} value={bankName} />
                </Form.Group>
              </Col>
              <Col lg={3}>
                <Form.Group className='mb-3'>
                  <Form.Label>CNIC</Form.Label>
                  <InputMask mask="_____________" replacement={{ _: /\d/ }} name='cnic' onChange={handleChange} value={cnic} placeholder='+92334202020' className='maskInpp' />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <h4>Consultation Details</h4>
          <div className="consultation">
            <Row>
              <Col lg={3}>
                <div className="box-wrap">
                  <h6><img src={VideoCam} alt="" /> Video Consultation</h6>
                  <button onClick={handleVideoConsultationsShow} >Add</button>
                </div>
                <div className="box-wrap">
                  <h6><img src={ReminderMedical} alt="" /> In-person Consultation</h6>
                  {/* disabled={isMsUser}  */}
                  <button onClick={handleInPersonConsultationShow} >Add</button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="update">
            {msUserbtn ?
              <button className='button2 diableBtn' disabled >Update</button>
              :
              <button className={"button2"} disabled={(isPersonFieldsEmpty === true || isVideoFieldsEmpty === true) || (isPersonFieldsEmpty === true && isVideoFieldsEmpty === true) || !allFieldsFilled} onClick={handleUpdate}> Update </button>
            }
          </div>
          <ProfileInPersonConsultationModal msUserId={msUserId} callInPersonFn={callInPersonFn} setInPersonConsultationShow={setInPersonConsultationShow} setIndicationMessage={setIndicationMessage} setIsPersonFieldsEmpty={setIsPersonFieldsEmpty} handleInPersonConsultationClose={handleInPersonConsultationClose} inPersonConsultationShow={inPersonConsultationShow} />
          <ProfileVideoConsultationsModal msUserId={msUserId} callInPersonFn={callInPersonFn} callVideoFn={callVideoFn} setIndicationMessage={setIndicationMessage} setVideoConsultationsShow={setVideoConsultationsShow} setIsVideoFieldsEmpty={setIsVideoFieldsEmpty} handleVideoConsultationsClose={handleVideoConsultationsClose} videoConsultationsShow={videoConsultationsShow} userId={userId} />
          <ProfileUpdateModal handleProfileUpdateClose={handleProfileUpdateClose} profileUpdateShow={profileUpdateShow} />
        </div>}
    </>
  )
}

export default OnlineProfile;