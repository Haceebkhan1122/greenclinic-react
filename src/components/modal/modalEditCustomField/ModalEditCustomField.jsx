/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import { useEffect, useState } from "react";
import './modalEditCustomField.scss';
import { toast } from "react-toastify";
import API from "../../../services/httpInstance";

const ModalEditCustomField = ({ showEdit, getAppointments, handleCloseEdit, singleEditItem, fromExam }) => {
    const [id, setId] = useState(null);
    const [fieldName, setFieldName] = useState(singleEditItem?.title);
    const [dataType, setDataType] = useState(null);
    const [optionsMore, setOptionsMore] = useState([]);
    const [indicationMessage, setIndicationMessage] = useState("");
    const [requiredVal, setRequiredVal] = useState(0);
    const [printVal, setPrintVal] = useState(0);
    const [count, setCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [inputs, setInputs] = useState([]);

    const handleAddInput = () => {
        setInputs([...inputs, { label: "", value: "" }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedInputs = [...inputs];
        updatedInputs[index][field] = value;
        updatedInputs[index].label = value;
        setInputs(updatedInputs);
    };

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

    const addMoreBtn = () => {
        setCount(count + 1)
        setOptionsMore([...optionsMore, count + 1]);
    }

    const handleChangeDataType = (e) => {
        const { value } = e.target;
        setDataType(value);
    }

    const handleCloseOption = (val, i) => {
        let remove = optionsMore.filter((item) => item !== val)
        setCount((prev) => prev - 1)
        return setOptionsMore(remove);
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

    useEffect(() => {
        if (singleEditItem) {
            setId(singleEditItem?.id)
            setFieldName(singleEditItem?.title)
            setDataType(singleEditItem?.data_type_field_id)
            setPrintVal(singleEditItem?.print)
            setPrintVal(singleEditItem?.required)
        }
    }, [showEdit])


    const saveBtnFn = async () => {
        try {
            if (fieldName !== "" && dataType !== "" && requiredVal !== "" && printVal !== "") {
                const response = await API.put(`/update-appointment-settings`, {
                    id,
                    title: fieldName,
                    dataType,
                    optional_values: inputs,
                    show: 1,
                    required: requiredVal,
                    print: printVal,
                });
                if (response?.status == 200) {
                    setFieldName("")
                    setDataType("")
                    setOptionsMore([])
                    setRequiredVal(0)
                    setPrintVal(0);
                    setIndicationMessage(response?.data?.message)
                    handleCloseEdit();
                    getAppointments();
                }
            }
            else {
                setIndicationMessage("Please fill all the required fields")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    return (
        <Modal show={showEdit} onHide={handleCloseEdit} centered className="modalEditCustomFieldAppointment">
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseEdit}></span>
                <h2> Edit Field </h2>
                <Divider />
                <div className="single customInp">
                    <label htmlFor=""> Field Name* </label>
                    <input type="text" placeholder="Enter field name" name="nameField" value={fieldName} onChange={handleChange} />
                </div>
                <div className="single_field customSelect">
                    <label htmlFor=""> Data Type* </label>
                    <Form.Select aria-label="Default select example" name='dataType' value={dataType} onChange={handleChange}>
                        <option value={""}>Select Data Type</option>
                        <option value={1}>Dropdown</option>
                        <option value={2}>Free text</option>
                        <option value={5}>Text Field</option>
                        <option value={3}>Radio</option>
                        <option value={4}>Mutitext</option>
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
                    <button onClick={handleCloseEdit}> CANCEL </button>
                    <button onClick={saveBtnFn}> SAVE </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalEditCustomField;
