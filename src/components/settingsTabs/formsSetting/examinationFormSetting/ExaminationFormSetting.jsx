import { Divider } from 'antd';
import './examinationFormSetting.scss';
import { Col, Form, Row, Table } from 'react-bootstrap';
import { isMobile } from 'react-device-detect';
import ModalAddCustomField from '../appointmentFormSetting/modalAddCustomField/ModalAddCustomField';
import ModalEditCustomField from '../../../modal/modalEditCustomField/ModalEditCustomField';
import ModalDeleteCustomField from '../../../modal/modalDeleteCustomField/ModalDeleteCustomField';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import API from '../../../../services/httpInstance';
import ModalEditCustomFieldExamination from '../../../modal/modalEditCustomFieldExamination/ModalEditCustomFieldExamination';
import ModalDeleteCustomFieldExamination from '../../../modal/modalDeleteCustomFieldExamination/ModalDeleteCustomFieldExamination';
import Loader from '../../../loader/Loader';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const ExaminationFormSetting = ({ show, setShow, handleShow, handleClose }) => {
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
    const [examinationData, setExaminationData] = useState({});
    const [examinationType, setExaminationType] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [optionsMore, setOptionsMore] = useState([]);
    const [count, setCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [showPopupMsg, setShowPopupMsg] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [examId, setExamId] = useState(null)
    const [errorObj, setErrorObj] = useState({})

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
            setFieldName(item?.name);
            setPlaceholder(item?.placeholder)
            setFieldType(item?.type)
            setRequiredVal(item?.required || 0);
            if(item?.type == 1 || item?.type == "1" || item?.type == 4 || item?.type == "4" || item?.type == 5 || item?.type == "5") {
                setShowInput(true)
            }
            else {
                setShowInput(false)
            }
            if (item?.json_params?.data) {
                setInputs(item?.json_params?.data);
            } else {
                setInputs([{ label: "", value: "" }]);
            }
        }
    }

    const handleShowDelete = (item) => {
        setSingleEditItem(item);
        setShowDelete(true);
    }

    useEffect(() => {
        getExamination();
        getExaminationType();
    }, []);

    const getExamination = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-exam`);
            if (response?.status == 200) {
                setExaminationData(response?.data?.data);
                setFilteredData(response?.data?.data?.examinations)
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getExaminationType = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-examination-type`);
            if (response?.status == 200) {
                setExaminationType(response?.data?.data);
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

        if (name == "placeholder") {
            setPlaceholder(value);
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

    const saveExaminationEdit = async () => {
        let errors = {}
        const isAnyFieldEmpty = inputs.some(input => !input.value.trim());
        if (isAnyFieldEmpty) {
            toast.error(`Please fill all the options`);
            return;
        }

        try {
            if (fieldName && placeholder && fieldType) {
                setIsLoading(true)
                const response = await API.post(`/add-exam`, {
                    id: examId,
                    name: fieldName,
                    placeholder: placeholder,
                    type: Number(fieldType),
                    required: requiredVal,
                    json_params: {
                        "type": fieldType,
                        data: inputs,
                    },
                });
                if (response?.status == 200) {
                    getExamination();
                    setFieldName("")
                    setFieldType("")
                    setPlaceholder("")
                    setIndicationMessage(response?.data?.message);
                    setIsLoading(false)
                    setInputs([]);
                    setRequiredVal(0)
                }
                else {
                    setIndicationMessage(response?.data?.message)
                    setIsLoading(false)
                }
            }
            else {
                toast.error("Please fill all the required fields", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setIsLoading(false)
                return;
            }
        }
        catch (error) {
            console.log("error in apii", error);
            setIsLoading(false)
        }
        setErrorObj(errors)
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        let examData = [...examinationData?.examinations];
        if (value !== "") {
            let lower = value.toLowerCase();
            let trimed = lower.replace(/\s/g, '');
            examData = examData.filter((item) => {
                return item?.name.toLowerCase().replace(/\s/g, '').includes(trimed);
            })
        }
        else {
            examData = [...examinationData?.examinations];
        }
        setFilteredData(examData);
    }

    useEffect(() => {
    }, [])


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

    const handleSwitch = async (e, id) => {
        const { value, checked } = e.target;
        if (checked) {
            setIsLoading(true)
            const response = await API.patch(`/update-exam`, {
                id,
                show: 1,
            })
            if (response?.status == 200) {
                setIsLoading(false)
                getExamination();
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
        else {
            setIsLoading(true)
            const response = await API.patch(`/update-exam`, {
                id,
                show: 0,
            })
            if (response?.status == 200) {
                setIsLoading(false)
                getExamination();
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
                setIsLoading(false)
            }
        }
    }

    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            {isLoading ? <Loader />
                :
                <div className='examinationFormSetting'>
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
                                            filteredData?.map((item) => {
                                                return (
                                                    <>
                                                        <div className="singleCardRoleEx">
                                                            <div>
                                                                <h4>{item?.name}</h4>
                                                                <p>{item?.placeholder}</p>
                                                                <p>{item?.examination_type}</p>
                                                            </div>
                                                            <div className='d-flex tw-gap-3'>
                                                                {item?.examination_type == "Custom" && <div className="wrape_actions">
                                                                    <span className="deleteIcon" onClick={() => handleShowDelete(item)}></span>
                                                                    <span className="editIcon" onClick={() => handleShowEdit(item)}></span>
                                                                </div>}
                                                                <div className="single customCheck">
                                                                    <Form.Check
                                                                        type="switch"
                                                                        id={`${item.id}_custom-switch`}
                                                                        defaultChecked={item?.show == 1 ? true : false}
                                                                        name={`switchShow`}
                                                                        onChange={(e) => handleSwitch(e, item?.id)}
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
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className="table__wrape">
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Examination</th>
                                                    <th>Place Holder</th>
                                                    <th>Type</th>
                                                    <th>Show</th>
                                                    <th> Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    // examinationData?.examinations?.map((item) => {
                                                    filteredData?.map((item) => {
                                                        return (
                                                            <>
                                                                <tr>
                                                                    <td>{item?.name}</td>
                                                                    <td>{item?.placeholder}</td>
                                                                    <td>{item?.examination_type}</td>
                                                                    <td>
                                                                        <div className="single customCheck">
                                                                            <Form.Check
                                                                                type="switch"
                                                                                id={`${item.id}_custom-switch`}
                                                                                checked={item?.show == 1}
                                                                                name={`switchShow`}
                                                                                onChange={(e) => handleSwitch(e, item?.id)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {item?.examination_type == "Custom" && <div className="wrape_actions">
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
                                        <label htmlFor=""> Place Holder </label>
                                        <input type="text" placeholder="Enter Place Holder" name="placeholder" value={placeholder} onChange={handleChange} />
                                    </div>
                                    <div className="single_field customSelect">
                                        <label htmlFor=""> Field Type*</label>
                                        <Form.Select aria-label="Default select example" name='fieldType' value={fieldType} onChange={handleChange}>
                                            <option value="" hidden >Select field type*</option>
                                            {
                                                examinationType.length && examinationType?.map((item, idx) => {
                                                    return (
                                                        <option value={item.value}>{item.type}</option>
                                                    )
                                                })
                                            }
                                        </Form.Select>
                                    </div>
                                    {showInput && (
                                        <>
                                            <div className="wraper_fielddsOptions">
                                                {inputs?.map((input, index) => (
                                                    <>
                                                    <div key={index} className="customInp cross_wrpa">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter field name"
                                                            required
                                                            value={input.value}
                                                            onChange={(e) =>
                                                                handleInputChange(index, "value", e.target.value)
                                                            }
                                                        />
                                                        <span className="crossOptionIcon" onClick={() => handleCloseOption(input, index)}></span>
                                                    </div>
                                                    <span className='error'>{errorObj?.field}</span>
                                                    </>
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
                                                checked={requiredVal == 1}
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
                    <ModalEditCustomFieldExamination showEdit={showEdit} handleCloseEdit={handleCloseEdit} handleShowEdit={handleShowEdit} singleEditItem={singleEditItem} examinationData={examinationData} examinationType={examinationType} fromExam={true} />
                    <ModalDeleteCustomFieldExamination getExamination={getExamination} showDelete={showDelete} handleCloseDelete={handleCloseDelete} handleShowDelete={handleShowDelete} text="Field" singleEditItem={singleEditItem} examinationData={examinationData} examinationType={examinationType} />
                    
                </div>
                
                }
            <ToastContainer />
        </>
    )
}

export default ExaminationFormSetting;
