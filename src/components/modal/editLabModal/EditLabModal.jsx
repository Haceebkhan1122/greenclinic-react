import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import "./editLabModal.scss"
import { toast } from "react-toastify";
import API from "../../../services/httpInstance";

const EditLabModal = ({ editLabshow, handleEditLabClose, singleEditItem, getLabTests, indicationMessage, setIndicationMessage }) => {
    const [labTestId, setLabTestId] = useState(null)
    const [parentId, setParentId] = useState(null)
    const [labTestName, setLabTestName] = useState("")
    const [labTestType, setLabTestType] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [labTestTypesAll, setLabTestTypesAll] = useState([]);

    useEffect(() => {
        if (singleEditItem) {
            setLabTestId(singleEditItem?.id)
            setLabTestName(singleEditItem?.title)
            setLabTestType(singleEditItem?.parent_id)
            setParentId(singleEditItem?.parent_id)
        }
    }, [editLabshow])


    const handleChange = (e) => {
        const { value, name } = e.target;
        if (name == "labTestName") {
            setLabTestName(value);
        }

        if (name == "labTestType") {
            setLabTestType(value);
        }
    }

    const saveEditLab = async () => {
        try {
            if (labTestName && labTestType) {
                setIsLoading(true)
                const response = await API.put(`/update-lab-test`, {
                    parent_id: labTestType,
                    lab_test_id: labTestId,
                    title: labTestName,
                });
                if (response?.status == 200) {
                    handleEditLabClose();
                    getLabTests();
                    setIsLoading(false)
                    setTimeout(() => {
                        setIndicationMessage(response?.data?.message);
                    }, 1000);
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
            }
        }
        catch (error) {
            setIsLoading(false)
        }
    }

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

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");   
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])


    return (
        <Modal show={editLabshow} onHide={handleEditLabClose} centered className="modalEditLab">
            
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleEditLabClose}></span>
                <h2> Edit Lab Test </h2>
                <Divider />
                <div className="single customInp">
                    <label htmlFor=""> Lab Test* </label>
                    <input type="text" placeholder="3gAllergy Specific IgE Universal Food Allergens Profile" name="labTestName" onChange={handleChange} value={labTestName} />
                </div>
                <div className="single_field customSelect">
                    <label htmlFor="">Type* </label>
                    <Form.Select aria-label="Default select example" name="labTestType" onChange={handleChange} value={labTestType}>
                        {labTestTypesAll?.map((item, index) => {
                            return (<>
                                <option key={index} value={item?.id}>{item?.title}</option>
                            </>)
                        })}
                    </Form.Select>
                </div>
                <div className="wraper_btns">
                    <button onClick={handleEditLabClose} className="button1"> CANCEL </button>
                    <button className="button2" onClick={saveEditLab}> SAVE </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default EditLabModal