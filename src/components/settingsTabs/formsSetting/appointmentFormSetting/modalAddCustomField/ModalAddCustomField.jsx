/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Form, Modal } from "react-bootstrap"
import './modalAddCustomField.scss';
import { Divider, Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from '../../../../../services/httpInstance';

const ModalAddCustomField = ({ show,setShow, handleClose, setAppointmentData }) => {
    const [optionsMore, setOptionsMore] = useState([]);
    const [requiredVal, setRequiredVal] = useState(0);
    const [printVal, setPrintVal] = useState(0);
    const [fieldName, setFieldName] = useState("");
    const [dataType, setDataType] = useState("");
    const [count, setCount] = useState(0);
    const [indicationMessage, setIndicationMessage] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const addMoreBtn = () => {
        setCount(count + 1)
        setOptionsMore([...optionsMore, count + 1]);
    }

    const handleAddInput = () => {
        setInputs([...inputs, { label: "", value: "" }]);
    };

    useEffect(() => {
        if(show == false) {
            setFieldName("")
            setDataType("")
            setInputs([])
            setRequiredVal(0)
            setPrintVal(0)
        }
    }, [show])

    const handleInputChange = (index, field, value) => {
        const updatedInputs = [...inputs];
        updatedInputs[index][field] = value;
        updatedInputs[index].label = value;
        setInputs(updatedInputs);
    };

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])


    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "nameField") {
            setFieldName(value);
        }

        if (name == "dataType") {
            if (value == 1) {
                setShowInput(true)
                setInputs([...inputs, { label: "", value: "" }]);
            }
            else {
                setShowInput(false)
                setInputs([]);
            }
            setDataType(value)
        }

        if (name == "required") {
            setRequiredVal(value)
        }

        if (name == "print") {
            setPrintVal(value)
        }
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

    const handleChangeChecks = (e, type) => {
        const { checked } = e.target
        if (type == "required") {
            if (checked) {
                setRequiredVal(1)
            }
            else {
                setRequiredVal(0)
            }
        }
        if (type == "print") {
            if (checked) {
                setPrintVal(1)
            }
            else {
                setPrintVal(0)
            }
        }
    }

    const saveBtnFn = async () => {
        try {
            setIsLoading(true)
            if (fieldName !== "" && dataType !== "" && requiredVal !== "" && printVal !== "") {
                const response = await API.post(`/add-appointment-settings`, {
                    title: fieldName,
                    dataType,
                    optional_values: inputs,
                    show: 1,
                    required: requiredVal,
                    print: printVal,
                });
                if (response?.status == 200) {
                    getAppointments();
                    setIsLoading(false)
                    setFieldName("")
                    setDataType("")
                    setOptionsMore([])
                    setRequiredVal(0)
                    setPrintVal(0);
                    setIndicationMessage(response?.data?.message)
                    handleClose();
                }
            }
            else {
                setIndicationMessage("Please fill all the required fields")
                setIsLoading(false)
            }
        } catch (error) {
            console.log("error", error)
            setIsLoading(false)
        }
    }


        useEffect(() => {
            getAppointments();
        }, [])

    async function getAppointments(){
            try {
                setIsLoading(true);
                const response = await API.get(`/appointment-form-data`);
                if (response?.status == 200) {
                    setAppointmentData(response?.data?.data);
                    setIsLoading(false);
                }
                else {
                    setIsLoading(false);
                    toast.error(response?.data?.message);
                }
            } catch (error) {
                console.log(error)
                setIsLoading(false);
            }
    }

    return (
        <Modal show={show} onHide={handleClose} centered className="modaladdCustomFieldAppointment">
            <Modal.Body>
                {indicationMessage !== "" && <div className="showPoup">
                    {indicationMessage}
                </div>}
                <span className="crossBtnModal" onClick={handleClose}></span>
                <h2> Create New Field </h2>
                <Divider />
                <div className="single customInp">
                    <label htmlFor=""> Field Name* </label>
                    <input type="text" placeholder="Enter field name" name="nameField" value={fieldName} onChange={handleChange} />
                </div>
                <div className="single_field customSelect">
                    <label htmlFor=""> Data Type* </label>
                    <Form.Select aria-label="Default select example" name='dataType' value={dataType} onChange={handleChange} >
                        <option value={""} hidden>Select Data Type</option>
                        <option value={1}>Dropdown</option>
                        <option value={2}>Free text</option>
                        <option value={5}>Text Field</option>
                        <option value={3}>Date</option>
                        <option value={4}>Time</option>
                        <option value={6}>Number Format</option>
                        <option value={7}>Email Format</option>
                    </Form.Select>
                </div>
                {showInput && (
                    <>
                        <div className="wraper_fielddsOptions">
                            {inputs?.map((item, index) => (
                                <div key={index} className="customInp cross_wrpa">
                                    <input
                                        type="text"
                                        placeholder="Enter field name"
                                        value={item.value}
                                        onChange={(e) =>
                                            handleInputChange(index, "value", e.target.value)
                                        }
                                    />
                                    <span className="crossOptionIcon" onClick={() => handleCloseOption(item, index)}></span>
                                </div>
                            ))}
                        </div>
                        <div className="addMoreBtn" onClick={handleAddInput}>
                            <span className="addMoreIcon"></span>
                            <h3> Add More </h3>
                        </div>
                    </>
                )}
                <div className="wrape_checks_req">
                    <div className="field_check customCheck">
                        <label htmlFor=""> Required </label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            value={1}
                            defaultChecked={requiredVal == 1 ? true : false}
                            onChange={handleChange}
                            name="required"
                        />
                    </div>
                    <div className="field_check customCheck">
                        <label htmlFor=""> Print </label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            value={1}
                            defaultChecked={printVal == 1 ? true : false}
                            onChange={handleChange}
                            name="print"
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="wraper_btns">
                    <button onClick={handleClose}> CANCEL </button>
                    <button onClick={saveBtnFn}> SAVE </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAddCustomField;
