import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import "./addLabModal.scss"
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";

const AddLabModal = ({ addLabshow, handleAddLabClose, getLabTests, indicationMessage, setIndicationMessage }) => {

    const [labTestTypesAll, setLabTestTypesAll] = useState([]);
    const [dataType, setDataType] = useState(null);
    const [fieldName, setFieldName] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getLabTestsTypes();
    }, [])

    const getLabTestsTypes = async () => {
        try {
            const response = await API.get(`/get-lab-test-types`);
            if (response?.status == 200) {
                setLabTestTypesAll(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e) => {
        const { value, name } = e.target;
        if (name == "fieldName") {
            setFieldName(value);
        }

        if (name == "dataType") {   
            setDataType(value);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const response = await API.post(`/add-lab-test`, {
                parent_id: dataType,
                title: fieldName,
            });
            if (response?.status == 200) {
                setIsLoading(false) 
                setIndicationMessage(response?.data?.message)
                handleAddLabClose();
                getLabTests();
                setDataType("")
                setFieldName("")
            }
            else {
                setIsLoading(false) 
                setIndicationMessage(response?.data?.message)
            }
        } catch (error) {
            console.log("error in save ", error)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        setFieldName("")
        setDataType("")
    }, [addLabshow])

    return (
        <Modal show={addLabshow} onHide={handleAddLabClose} centered className="modalLab">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleAddLabClose}></span>
                <h2> Add Lab Test </h2>
                <Divider />
                <div className="single customInp">
                    <label htmlFor=""> Lab Test* </label>
                    <input type="text" placeholder="Enter field name" name='fieldName' value={fieldName} onChange={handleChange} />
                </div>
                <div className="single_field customSelect">
                    <label htmlFor="">Type* </label>
                    <Form.Select aria-label="Default select example" name='dataType' value={dataType} onChange={handleChange}  >
                        <option value={""}>Select type</option>
                        {labTestTypesAll?.map((item, index) => {
                            return (<>
                                <option key={index} value={item?.id}>{item?.title}</option>
                            </>)
                        })}
                    </Form.Select>
                </div>
                <div className="wraper_btns">
                    <button onClick={handleAddLabClose} className="button1"> CANCEL </button>
                    <button className="button2" onClick={handleSave}> SAVE </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default AddLabModal