import { Col, Form, Row, Table } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import ModalAddCustomField from '../appointmentFormSetting/modalAddCustomField/ModalAddCustomField';
import ModalEditCustomField from '../../../modal/modalEditCustomField/ModalEditCustomField';
import ModalDeleteCustomField from '../../../modal/modalDeleteCustomField/ModalDeleteCustomField';
import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import API from '../../../../services/httpInstance';
import ModalEditCustomFieldExamination from '../../../modal/modalEditCustomFieldExamination/ModalEditCustomFieldExamination';
import ModalDeleteCustomFieldExamination from '../../../modal/modalDeleteCustomFieldExamination/ModalDeleteCustomFieldExamination';
import Loader from '../../../loader/Loader';
import './vitalFormSetting.scss';
import { Divider } from 'antd';

const VitalFormSetting = ({ show, handleShow, setShow, handleClose }) => {
    const [fieldName, setFieldName] = useState();
    const [placeholder, setPlaceholder] = useState("");
    const [position, setPosition] = useState("");
    const [urduTranslation, setUrduTranslation] = useState("");
    const [siUnit, setSiUnit] = useState("");
    const [fieldType, setFieldType] = useState(null);
    const [requiredVal, setRequiredVal] = useState(0);
    const [printVal, setPrintVal] = useState(0);
    const [showDelete, setShowDelete] = useState(false);
    const [singleEditItem, setSingleEditItem] = useState({})
    const [showEdit, setShowEdit] = useState(false);
    const [indicationMessage, setIndicationMessage] = useState("");
    const [filteredData, setFilteredData] = useState([])
    const [vitalData, setVitalData] = useState([]);
    const [vitalType, setVitalType] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [optionsMore, setOptionsMore] = useState([]);
    const [count, setCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [showPopupMsg, setShowPopupMsg] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [examId, setExamId] = useState(null)

    const handleAddInput = () => {
        setInputs([...inputs, { label: "", value: "" }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedInputs = [...inputs];
        updatedInputs[index][field] = value;
        updatedInputs[index].label = value;
        setInputs(updatedInputs);
    };

    const handleCloseEdit = () => setShowEdit(false);
    const handleCloseDelete = () => setShowDelete(false);


    const handleShowEdit = (item) => {
        setSingleEditItem(item);
        setEditClicked(true);
        if (item) {
            setExamId(item?.id)
            setFieldName(item?.title);
            setSiUnit(item?.unit)
            // setFieldType(item?.type)
            setRequiredVal(item?.show)
            if(fieldType == 1 || fieldType == "1" || fieldType == 4 || fieldType == "4" || fieldType == 5 || fieldType == "5") {
                setShowInput(true)
            }
            else {
                setShowInput(false)
            }
            if (item?.json_params?.data) {
                setFieldType(item?.type)
                setInputs(item?.json_params?.data);
            } else {
                setInputs([{ label: "", value: "" }]);
            }
        }
    }

    const addMoreBtn = () => {
    }

    const handleShowDelete = (item) => {
        setSingleEditItem(item);
        setShowDelete(true);
    }

    useEffect(() => {
        getVitals();
        getVitalsType();
    }, []);

    const getVitals = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-vitals`);
            if (response?.status == 200) {
                setVitalData(response?.data?.data?.vitals);
                setFilteredData(response?.data?.data?.vitals)
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getVitalsType = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-examination-type`);
            if (response?.status == 200) {
                setVitalType(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const { value, name, checked } = e.target;

        if (name == "nameField") {
            setFieldName(value);
        }

        if (name == "siUnit") {
            setSiUnit(value);
        }


        if (name == "fieldType") {
            if (value == 1 || value == "1" || value == 4 || value == "4" || value == 5 || value == "5") {
                setShowInput(true);
                setInputs([{ label: "", value: "" }]);
            } else {
                setShowInput(false);
                setInputs([]);
            }
            setFieldType(value)
        }

        if (name == "required") {
            if (checked) {
                setRequiredVal(1)
            }
            else {
                setRequiredVal(0)
            }
        }
    }

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");   
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    const saveExaminationEdit = async () => {
        // const isAnyFieldEmpty = inputs.some(input => !input.value.trim());
        // if (isAnyFieldEmpty) {
        //     setIndicationMessage(`Please fill all the options`);
        //     return;
        // }
        const payload = {
            title: fieldName,
            unit: siUnit,
            show : requiredVal,
        }

        if(examId !==  null) payload.id = examId; 

        try {
            if (fieldName && siUnit ) {
                setIsLoading(true)
                const response = await API.post(`/add-vitals`, payload );
                if (response?.status == 200) {
                    getVitals();
                    setFieldName("")
                    setFieldType("")
                    setPlaceholder("")
                    setOptionsMore([])
                    setRequiredVal(0)
                    setIndicationMessage(response?.data?.message);
                    setIsLoading(false)
                    setInputs([]);
                    setExamId(null)
                }
                else {
                    setIndicationMessage(response?.data?.message)
                    setIsLoading(false)
                }
            }
            else {
                toast.error("Please fill all the required fields", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: false,
                    theme: "dark",
                });
                setIsLoading(false)
            }
        }
        catch (error) {
            console.log("error in apii", error);
            setIsLoading(false)
        }
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        let examData = [...vitalData];
        if (value !== "") {
            let lower = value.toLowerCase();
            let trimed = lower.replace(/\s/g, '');
            examData = examData.filter((item) => {
                return item?.title.toLowerCase().replace(/\s/g, '').includes(trimed);
            })
        }
        else {
            examData = vitalData;
        }
        setFilteredData(examData);
    }

    const handleCloseOption = (val, i) => {
        let remove = inputs.filter((item) => item !== val)
        setCount((prev) => prev - 1)
        return setInputs(remove);
    }


    const handleOptionInpt = (e, index) => {
        const { value } = e.target;
        const updatedOptions = [...optionsMore];
        updatedOptions[index] = value;
        setOptionsMore(updatedOptions);
    }

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])


    const handleSwitch = async (e, item) => {
        const { value, checked } = e.target;
        let payload = {
            id : item?.id,
        }
        payload.show = checked ? 1 : 0;
        setIsLoading(true);
        const response = await API.patch(`/change-vital-status`, payload)
        if (response?.status == 200) {
            setIsLoading(false)
            getVitals();
            toast.success(response?.data?.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            setIsLoading(false)
            toast.error(response?.data?.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            {isLoading ? <Loader />
                :
                <div className='vitalFormSetting'>
                    <Col lg={12}>
                        <Divider />
                        <Row>
                            <Col lg={7} xs={12}>
                                <div className="search-bar">
                                    <span className="ico"></span>
                                    <input type="text" placeholder='Search for default fields' onChange={handleSearch} />
                                </div>
                                {isMobile ?
                                    <div className="cardRoleWraper">
                                        {
                                            // vitalData?.examinations?.map((item) => {
                                            filteredData?.map((item) => {
                                                return (
                                                    <>
                                                        <div className="singleCardRoleEx">
                                                            <div>
                                                                <h4>{item?.title}</h4>
                                                                <p>{item?.unit}</p>
                                                                <p>{item?.type}</p>
                                                            </div>
                                                            <div className='d-flex tw-gap-3'>
                                                                {item?.examination_type == "Custom" && <div className="wrape_actions">
                                                                    <span className="deleteIcon" onClick={() => handleShowDelete(item)}></span>
                                                                    <span className="editIcon" onClick={() => { handleShowEdit(item) }}></span>
                                                                </div>}
                                                                <div className="single customCheck">
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id={`${item.id}_custom-switch`}
                                                                        defaultChecked={item.show == 1 ? true : false}
                                                                        name={`switchShow`}
                                                                        onChange={(e) => {handleSwitch(e, item)}}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                        <div className="bottombarBtn">
                                            <div className="wrape_bt">
                                                <button onClick={handleShow}> ADD CUSTOM FIELD </button>
                                                <button onClick={handleShow}> SAVE </button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="table__wrape">
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Examination</th>
                                                    <th>Unit</th>
                                                    <th>Type</th>
                                                    <th>Show</th>
                                                    <th> Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    // vitalData?.examinations?.map((item) => {
                                                    filteredData?.map((item) => {
                                                        return (
                                                            <>
                                                                <tr>
                                                                    <td>{item?.title}</td>
                                                                    <td>{item?.unit}</td>
                                                                    <td>{item?.type}</td>
                                                                    <td>
                                                                        <div className="single customCheck">
                                                                            <Form.Check
                                                                                type="switch"
                                                                                id={`${item.id}_custom-switch`}
                                                                                defaultChecked={item.show == 1 ? true : false}
                                                                                name={`switchShow`}
                                                                                onChange={(e) => {handleSwitch(e, item)}}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {item?.type == "custom" && <div className="wrape_actions">
                                                                            <span className="deleteIcon" onClick={() => handleShowDelete(item)}></span>
                                                                            <span className="editIcon" onClick={() => { handleShowEdit(item) }}></span>
                                                                        </div>}
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </div>}
                            </Col>
                            {!isMobile && <Col lg={5}>
                                <div className="custom_field_form">
                                    <h2> {editClicked ? "Edit Field" : "Custom Field"} </h2>
                                    <Divider />
                                    <div className="single customInp">
                                        <label htmlFor=""> Field Name* </label>
                                        <input type="text" placeholder="Enter field name" name="nameField" value={fieldName} onChange={handleChange} />
                                    </div>
                                    <div className="single customInp">
                                        <label htmlFor=""> SI Unit* </label>
                                        <input type="text" placeholder="Enter SI unit" name="siUnit" value={siUnit} onChange={handleChange} />
                                    </div>
                                    {/* <div className="single_field customSelect">
                                        <label htmlFor=""> Field Type*</label>
                                        <Form.Select aria-label="Default select example" name='fieldType' value={fieldType} onChange={handleChange}>
                                            <option value="" hidden>Select field type*</option>
                                            {
                                                vitalType.length && vitalType?.map((item, idx) => {
                                                    return (
                                                        <option value={item.value}>{item.type}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select>
                                    </div> */}
                                    {showInput && (
                                        <>
                                            <div className="wraper_fielddsOptions">
                                                {inputs?.map((input, index) => (
                                                    <div key={index} className="customInp cross_wrpa">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter field name"
                                                            value={input.value}
                                                            onChange={(e) =>
                                                                handleInputChange(index, "value", e.target.value)
                                                            }
                                                        />
                                                        <span className="crossOptionIcon" onClick={() => handleCloseOption(input, index)}></span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="addMoreBtn" onClick={handleAddInput}>
                                                <span className="addMoreIcon"></span>
                                                <h3> Add More </h3>
                                            </div>
                                        </>
                                    )}
                                    <Divider />
                                    <div className="wrape_checks_req">
                                        <div className="field_check customCheck">
                                            <label htmlFor=""> Required </label>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                value={requiredVal}
                                                checked={requiredVal == 1 || requiredVal == "1" ? true : false}
                                                onChange={handleChange}
                                                name="required"
                                            />
                                        </div>
                                    </div>
                                    <div className="wraper_btns">
                                        <button onClick={saveExaminationEdit}> SAVE </button>
                                    </div>
                                </div>
                            </Col>}
                        </Row>
                    </Col>
                    <ModalAddCustomField show={show} handleClose={handleClose} handleShow={handleShow} />
                    <ModalEditCustomFieldExamination showEdit={showEdit} handleCloseEdit={handleCloseEdit} handleShowEdit={handleShowEdit} singleEditItem={singleEditItem} vitalData={vitalData} vitalType={vitalType} fromExam={true} />
                    <ModalDeleteCustomFieldExamination getVitals={getVitals} showDelete={showDelete} handleCloseDelete={handleCloseDelete} handleShowDelete={handleShowDelete} text="Field" singleEditItem={singleEditItem} vitalData={vitalData} vitalType={vitalType} />
                </div>}
        </>
    )
}

export default VitalFormSetting;
