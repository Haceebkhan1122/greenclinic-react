/* eslint-disable no-empty */
import { Divider } from 'antd';
import { Col, Form, Row, Table } from 'react-bootstrap';
import ModalDeleteCustomField from '../../modal/modalDeleteCustomField/ModalDeleteCustomField';
import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { DeleteOutlined, EditOutlined, SettingFilled } from '@ant-design/icons';
import EditProcedureModal from '../../modal/editProcedureModal/EditProcedureModal';
import API from '../../../services/httpInstance';
import Loader from '../../loader/Loader';
import './procedures.scss';
import ModalDeleteProcedure from '../../modal/modalDeleteProcedure/ModalDeleteProcedure';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import AddProcedureModal from '../../modal/addProcedureModal/AddProcedureModal';

const Procedures = () => {
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [editClicked, setEditClicked] = useState(false);
  const [addClicked, setAddClicked] = useState(false);
  const [editLabshow, setEditLabshow] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [proceduresData, setProceduresData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [id, setId] = useState(null);
  const [procedureName, setProcedureName] = useState("")
  const [price, setPrice] = useState("")
  const [doctorProcedure, setDoctorProcedure] = useState("")
  const [doctorShare, setDoctorShare] = useState("")
  const [doctorPercentage, setDoctorPercentage] = useState("")
  const [clinicId, setClinicId] = useState(null)
  const [clinicDoctors, setClinicDoctors] = useState([])
  const [indicationMessage, setIndicationMessage] = useState("");
  const [allDoctors, setAllDoctors] = useState("")
  const [errorObj, setErrorObj] = useState({})
  const [singleEditItem, setSingleEditItem] = useState({})
  const [doctorSelectedField, setDoctorSelectedField] = useState(false);
  const [showSide, setShowSide] = useState(false)
  const [addProcShow, setAddProcShow] = useState(false);

  let clinicDetails = useSelector((state) => state.clinic.clinicDetails);
  let user = useSelector((state) => state.user?.user);

  const handleCloseDelete = () => setShowDelete(false);
  const handleCloseEdit = () => setEditLabshow(false);

  const addProcedureBtn = () => {
    setShowSide(true)
    setEditClicked(false);
    setProcedureName("")
    setDoctorPercentage("")
    setDoctorShare("")
    setPrice("")
    setDoctorProcedure("");
    setAllDoctors("off")
    setDoctorSelectedField(false)
  }


  const addProcedureMobileBtn = () => {
    setAddProcShow(true)
  }

  const closeAddProcedureMobileBtn = () => {
    setAddProcShow(false)
  }

  useEffect(() => {
    getProcedures();
  }, []);

  const getProcedures = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/get-procedures`);
      if (response?.status == 200) {
        setProceduresData(response?.data?.data);
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  const handleShowEdit = (item) => {
    setShowSide(true)
    setEditClicked(true);
    setSingleEditItem(item)
    if (item) {
      if(item?.doctor_id) {
        setDoctorId(item?.doctor_id);
        setDoctorProcedure(item?.doctor_id)
        setAllDoctors(null);
      }
      if(item?.selectAll) {
        setAllDoctors(item?.selectAll == 1 ? "on" : "off")
        setDoctorProcedure("");
        setDoctorSelectedField(true)
      }
      setId(item?.id)
      setProcedureName(item?.name)
      setPrice(item?.price)
      setDoctorPercentage(item?.percentage)
    }
    else {
      setDoctorId(null)
      setDoctorProcedure(null)
      setDoctorSelectedField(false)
    }
  }

  const handleEditLabshow = (item) => {
    // setEditLabshow(true)
    setEditClicked(true);
    setSingleEditItem(item)
    if (item) {
      setDoctorId(item?.doctor_id);
      setId(item?.id)
      setProcedureName(item?.name)
      setPrice(item?.price)
      setDoctorProcedure(item?.doctor_id)
      setDoctorPercentage(item?.percentage)
      setAllDoctors(item?.selectAll)
    }
    setEditLabshow(true)
  }

  const handleShowDelete = (item) => {
    setShowDelete(true)
    if (item) {
      setDoctorId(item?.doctor_id);
      setId(item?.id)
    }
  }

  useEffect(() => {
    getDoctorsByClinic();
  }, [])

  const getDoctorsByClinic = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/get-all-doctors-by-clinic_id?clinicId=${clinicDetails?.id}`)
      if (response?.status == 200) {
        setClinicDoctors(response?.data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("errr", error)
      setIsLoading(false);
    }
  }


  const handleChange = (e) => {
    const { value, name, checked } = e.target;
    if (name == "procedureName") {
      errorObj.name = " "
      setProcedureName(value);
    }

    if (name == "price") {
      errorObj.price = " "

      setPrice(value);
    }

    if (name == "doctorProcedure") {
      errorObj.procedure = " "
      setDoctorProcedure(value);
      setAllDoctors("");
    }

    if (name == "doctorPercentage") {
      errorObj.percentage = " "
      setDoctorPercentage(value)
    }

    if (name == "allDoctors") {
      if (checked) {
        setAllDoctors("on")
        setDoctorSelectedField(true);
        setDoctorProcedure("");
      }
      else {
        setAllDoctors("off")
        setDoctorSelectedField(false);
      }
    }
  }


  const handleEditNext = async () => {
    try {
      setIsLoading(true)
      if (procedureName && price) {
        const response = await API.post(`/add-procedures`, {
          id,
          name: procedureName,
          price,
          doctor_id: doctorProcedure,
          percentage: doctorPercentage,
          select_all_doctor: allDoctors,
        });
        if (response?.status == 200) {
          setShowSide(false);
          setIsLoading(false)
          setIndicationMessage(response?.data?.message)
          getProcedures();
          setProcedureName("")
          setPrice(null)
          setDoctorId(null)
          setDoctorPercentage(null)
          setAllDoctors(null);
          setEditClicked(false);
        }
        else {
          setIsLoading(false)
          setIndicationMessage(response?.data?.message)
        }
      }
      else {
        setIsLoading(false)
        setIndicationMessage("Please fill all the required fields")
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let timeOut = setTimeout(() => {
        setIndicationMessage("");
    }, 2000);

    return (() => clearTimeout(timeOut));
}, [indicationMessage])




  const handleSaveNext = async () => {
    let errors = {}
    if(!procedureName) errors.name = "Procedure Name is required";
    if(!price) errors.price = "Procedure price is required";
    if(!doctorPercentage) errors.percentage = "Doctor Percentage is required";
    if(allDoctors == null && !doctorProcedure) errors.procedure = "Doctor Procedure is required";

    
  const payload = {
    name: procedureName,
    price,
    percentage: doctorPercentage,
    
  }

  if (allDoctors == "on") {
    payload.select_all_doctor = allDoctors;
  }

  if (doctorProcedure !== "" && doctorProcedure !== null) {
    payload.doctor_id = doctorProcedure;
  }

    try {
      setIsLoading(true)
      if (procedureName && price && doctorPercentage) {
        const response = await API.post(`/add-procedures`, payload);

        if (response?.status == 200) {
          setShowSide(false); 
          setIsLoading(false)
          setIndicationMessage(response?.data?.message);
          getProcedures();
          setProcedureName("")
          setPrice(null)
          setDoctorId(null)
          setDoctorPercentage(null)
          setDoctorProcedure(null)
          setAllDoctors(null);
          setDoctorSelectedField(false);
          setErrorObj({});
        }
        else {
          setIsLoading(false)
          toast.error(response?.data?.message)
        }
      }
      else {
        console.log("")
        setIsLoading(false)
      }
    }
    catch (error) {
      setIsLoading(false)
      console.log(error);
    }
    setErrorObj(errors)
  }

  const handleCancel = () => {
    setShowSide(false)
    setProcedureName("")
    setPrice("")
    setDoctorPercentage("")
    setDoctorShare("")
    setDoctorProcedure("")
  }

  const handleOnlyNumber = (e) => {
    e.target.value = e.target.value.replace(/[eE+-]/g, "");
  };


  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      {
        isLoading ? <Loader />
          :
          <div className='procedureSetting'>
            {isMobile ?
              <Col lg={12}>
                <div className="wrape_mobile">
                  <div className="search__bar">
                    <span className='search_icon'>  </span>
                    <input type="text" placeholder='Search for appointment' />
                  </div>
                  <div className='card__wrapes'>
                    {
                      proceduresData?.map((item) => {
                        return (
                          <>
                            <div className="card">
                              <h3>{item?.name}</h3>
                              <div className='wrapeActionMyReq'>
                                <p>{item?.price}</p>
                                <div className="ico">
                                  <span className="editIco" onClick={() => { handleEditLabshow(item) }} ></span>
                                  <span className="deleteIco" onClick={() => { handleShowDelete(item) }}  ></span>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })
                    }
                    <div className="bottombarBtn">
                      <div className="wrape_bt">
                        <button onClick={addProcedureMobileBtn}> ADD NEW PROCEDURE </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              : <Col lg={12}>
                <div className="procedureWrapeBtn">
                  <button className='' onClick={addProcedureBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                      <path d="M11.1911 13.0096H4.33398V10.7238H11.1911V3.8667H13.4768V10.7238H20.334V13.0096H13.4768V19.8667H11.1911V13.0096Z" fill={themeColor} />
                    </svg>
                    Add New Procedure
                  </button>
                </div>
                <Divider />
                <Row className=''>
                  <Col lg={showSide ? 7 : 12} style={{ paddingTop: "20px" }}>
                    <div className="table__wrape">
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th> Action </th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            proceduresData?.map((item) => {
                              return (
                                <>
                                  <tr>
                                    <td>{item?.name}</td>
                                    <td>{item?.price}</td>
                                    <td>
                                      <div className="wrape_actions">
                                        <span className="deleteIcon" onClick={() => { handleShowDelete(item) }} ></span>
                                        <span className="editIcon" onClick={() => { handleShowEdit(item) }} > </span>
                                      </div>
                                    </td>
                                  </tr>
                                </>
                              )
                            })
                          }
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                  <Col lg={5} style={showSide ? {display : "flex" } : {display : "none"}}>
                    {editClicked ? <div className="custom_field_form">
                      <div className="fieldsWrape">
                        {/* <h2> {editClicked ? "Edit Procedure " : "Add Procedure"}  </h2> */}
                        <h2> Edit Procedure </h2>
                        <Divider />
                        <div className="single customInp">
                          <label htmlFor=""> Procedure Name </label>
                          <input type="text" placeholder="General" name="procedureName" value={procedureName} onChange={handleChange} />
                        </div>
                        <div className="single customInp">
                          <label htmlFor=""> Procedure Price  </label>
                          <input type="number" placeholder="Rs. 1000" name="price" value={price} onChange={handleChange} />
                        </div>
                        <div className="single_field customSelect">
                          <label htmlFor=""> Doctor </label>
                          <Form.Select aria-label="Default select example" disabled={doctorSelectedField} name="doctorProcedure" value={doctorProcedure} onChange={handleChange}>
                            <option value=""> Select Doctor </option>
                            {clinicDoctors?.map((item) => {
                              return (<>
                                <option value={item?.id}>{item?.name}</option>
                              </>)
                            })}
                          </Form.Select>
                        </div>
                        <div className="singleTick customTickCheck">
                          <label htmlFor="tick">
                            <input type="checkbox" id='tick' name='allDoctors' checked={allDoctors == 'on' ? true : false} onChange={handleChange} />
                            <span></span>
                            For All Doctors
                          </label>
                        </div>
                        <div className="single_field customSelect">
                          <label htmlFor=""> Discount in Percentage </label>
                          <Form.Select aria-label="Default select example" name="doctorPercentage" value={doctorPercentage} onChange={handleChange} >
                            <option value=""> Select Percentage</option>
                            {Array.from({ length: 100 }, (_, i) => (
                              <option key={i + 1} value={`${i + 1}`} selected={doctorPercentage} >{i + 1}</option>
                            ))}
                          </Form.Select>
                        </div>
                        <Divider />
                        <div className="wrape_btn">
                          <button onClick={handleCancel}> Cancel </button>
                          <button onClick={handleEditNext}> Next </button>
                        </div>
                      </div>
                    </div>
                      :
                      <div className="custom_field_form">
                        <div className="fieldsWrape">
                          <h2> Add Procedure </h2>
                          <Divider />
                          <div className="single customInp">
                            <label htmlFor=""> Procedure Name </label>
                            <input type="text" placeholder="General" name="procedureName" value={procedureName} onChange={handleChange} />
                            <span className='error'> {errorObj?.name} </span>
                          </div>
                          <div className="single customInp">
                            <label htmlFor=""> Procedure Price  </label>
                            <input type="number" placeholder="Rs. 1000" name="price" value={price} onChange={handleChange} />
                            <span className='error'> {errorObj?.price} </span>

                          </div>
                          <div className="single_field customSelect">
                            <label htmlFor=""> Doctor </label>
                            <Form.Select aria-label="Default select example" disabled={doctorSelectedField} name="doctorProcedure" value={doctorProcedure} onChange={handleChange}>
                              <option value=""> Select Doctor </option>
                              {clinicDoctors?.map((item) => {
                                return (<>
                                  <option value={item?.id}>{item?.name}</option>
                                </>)
                              })}
                            </Form.Select>
                          <span className='error'> {errorObj?.procedure} </span>
                          </div>
                          {/* <div className="single customInp">
                            <label htmlFor=""> Doctor Share </label>
                            <input type="number" min={0} max={100} placeholder="600" name="doctorShare" onInput={handleOnlyNumber} value={doctorShare} onChange={handleChange} />
                          </div> */}
                          <div className="singleTick customTickCheck">
                            <label htmlFor="tick">
                              <input type="checkbox" id='tick' name='allDoctors' onChange={handleChange} />
                              <span></span>
                              For All Doctors
                            </label>
                          </div>
                          <div className="single_field customSelect">
                            <label htmlFor=""> Percentage </label>
                            <Form.Select aria-label="Default select example" name="doctorPercentage" value={doctorPercentage} onChange={handleChange} >
                            <option value=""> Select Percentage</option>
                              {Array.from({ length: 100 }, (_, i) => (
                                <option key={i + 1} value={`${i + 1}`}>{i + 1}</option>
                              ))}
                            </Form.Select>
                            <span className='error'> {errorObj?.percentage} </span>
                          </div>
                          <Divider />
                          <div className="wrape_btn">
                            <button onClick={handleCancel}> Cancel </button>
                            <button onClick={handleSaveNext}> Next </button>
                          </div>
                        </div>
                      </div>
                    }
                  </Col>
                </Row>
              </Col>}
            <ModalDeleteProcedure indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} isLoading={isLoading} setIsLoading={setIsLoading} showDelete={showDelete} handleCloseDelete={handleCloseDelete} handleShowDelete={handleShowDelete} text="Procedure" getProcedures={getProcedures} doctorId={doctorId} id={id} />
            <EditProcedureModal indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} editLabshow={editLabshow} handleEditLabshow={handleEditLabshow} handleEditLabClose={handleCloseEdit} />
            <AddProcedureModal getProcedures={getProcedures} indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} addProcShow={addProcShow} addProcedureMobileBtn={addProcedureMobileBtn} handleEditLabClose={closeAddProcedureMobileBtn} />
          </div>
      }
    </>
  )
}

export default Procedures;