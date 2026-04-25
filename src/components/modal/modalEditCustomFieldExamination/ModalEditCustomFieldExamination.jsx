/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import { useEffect, useState } from "react";
import './modalEditCustomFieldExamination.scss';
import { toast } from "react-toastify";
import API from "../../../services/httpInstance";

const ModalEditCustomFieldExamination = ({ showEdit, getAppointments, handleCloseEdit, singleEditItem }) => {
    const [id, setId] = useState(null);
    const [fieldName, setFieldName] = useState(singleEditItem?.title);
    const [dataType, setDataType] = useState(singleEditItem?.data_type_field_id);
    const [optionsMore, setOptionsMore] = useState([]);
    const [indicationMessage, setIndicationMessage] = useState("");
    const [requiredVal, setRequiredVal] = useState(0);
    const [printVal, setPrintVal] = useState(0);
    const [count, setCount] = useState(0);
    const [placeholder, setPlaceholder] = useState("");

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "nameField") {
            setFieldName(value);
        }

        if (name == "dataType") {
            setDataType(value);
        }

        if (name == "required") {
            setRequiredVal(value)
        }
        if (name == "placeholder") {
            setPlaceholder(value)
        }

        if (name == "print") {
            setPrintVal(value)
        }
    }

    const addMoreBtn = () => {
        setCount(count + 1)
        setOptionsMore([...optionsMore, count + 1]);
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

    useEffect(() => {
        if (singleEditItem) {
            setId(singleEditItem?.id)
            setFieldName(singleEditItem?.name)
            setPlaceholder(singleEditItem?.placeholder)
            setDataType(singleEditItem?.field_type)
            setRequiredVal(singleEditItem?.show)
            setPrintVal(singleEditItem?.print)
        }
    }, [showEdit, singleEditItem])

    const saveBtnFn = async () => {
        try {
            if (fieldName !== "" && dataType !== "" && requiredVal !== "" && printVal !== "") {
                const response = await API.put(`/update-appointment-settings`, {
                    id,
                    title: fieldName,
                    dataType,
                    optional_values: optionsMore,
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
        <Modal show={showEdit} onHide={handleCloseEdit} centered className="modalEditCustomFieldExamination">
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
                <div className="single customInp">
                    <label htmlFor=""> Place Holder </label>
                    <input type="text" placeholder="Enter Place Holder" name="placeholder" value={placeholder} onChange={handleChange} />
                </div>
                <div className="single_field customSelect">
                    <label htmlFor=""> Data Type* </label>
                    <Form.Select aria-label="Default select example" name='dataType' value={dataType} onChange={handleChange}>
                        <option value={""} selected={singleEditItem?.field_type} >Select Data Type</option>
                        <option value={1}>Dropdown</option>
                        <option value={2}>Free text</option>
                        <option value={3}>Text Field</option>
                        <option value={3}>Date</option>
                        <option value={3}>Time</option>
                        <option value={3}>Number Format</option>
                        <option value={3}>Email Format</option>
                    </Form.Select>
                </div>
                {/* <div className="wraper_fielddsOptions">
                    {optionsMore.length !== 0 && optionsMore.map((item, index) => {
                        return (<>
                            <label htmlFor=""> Option {item}*  </label>
                            <div className="customInp cross_wrpa">
                                <input type="text" placeholder="Enter field name" onChange={(e) => handleOptionInpt(e, index)} value={optionsMore[index]} />
                                <span className="crossOptionIcon" onClick={() => handleCloseOption(item, index)}></span>
                            </div>
                        </>)
                    })}
                </div> */}
                {/* <div className="addMoreBtn" onClick={addMoreBtn}>
                    <span className="addMoreIcon"></span>
                    <h3> Add More </h3>
                </div> */}
                <div className="wrape_checks_req">
                    <div className="field_check customCheck">
                        <label htmlFor=""> Required </label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            value={requiredVal}
                            defaultChecked={requiredVal == 1 || requiredVal == "1"   ? true : false}
                            onChange={handleChange}
                            name="required"
                        />
                    </div>
                    {/* <div className="field_check customCheck">
                        <label htmlFor=""> Print </label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            value={1}
                            defaultChecked={printVal == 1 ? true : false}
                            onChange={handleChange}
                            name="print"
                        />
                    </div> */}
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

export default ModalEditCustomFieldExamination;
