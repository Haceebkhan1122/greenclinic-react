import { Modal, Form } from 'react-bootstrap';
import './editSmsTemplateModal.scss';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import API from '../../../services/httpInstance';
import { data } from 'autoprefixer';
import { toast } from 'react-toastify';


const EditSmsTemplateModal = ({ showEdit, handleCloseEdit, singleEditItem, smsSettingsData, indicationMessage, setIndicationMessage }) => {
    const [templateFor, setTemplateFor] = useState([]);
    const [templateType, setTemplateType] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTemplateFor, setSelectedTemplateFor] = useState("")
    const [selectedTemplateType, setSelectedTemplateType] = useState("")
    const [englishVal, setEnglishVal] = useState([])
    const [urduVal, setUrduVal] = useState("")

    const handleChangeData = () => { }

    const handleChange = (e) => {
        const { value, name, checked } = e.target;

        if(name == "englishVal") {
            setEnglishVal(value)
        }

        if(name == "urduVal") {
            setUrduVal(value)
        }

        if(name == "selectTemplateFor") {
            setSelectedTemplateFor(value)
        }

        if(name == "selectTemplateType") {
            setSelectedTemplateType(value)
        }

        if(name == "formatSelectEnglish") {
            if(checked) {
                if (!englishVal.includes(value)) {
                    setEnglishVal((prev) => (prev ? `${prev}${value}` : value));
                }
            }
        }
        
        if(name == "formatSelectUrdu") {
            if(checked) {
                if (!urduVal.includes(value)) {
                    setUrduVal((prev) => (prev ? `${prev}${value}` : value));
                }
            }
        }
    }

    useEffect(() => {
        getTemplateType();
        getTemplateFor();
    }, []);

    useEffect(() => {
        if(singleEditItem) {
            setSelectedTemplateFor(singleEditItem?.template_for)
            setSelectedTemplateType(singleEditItem?.key)
            setEnglishVal(singleEditItem?.value)
            setUrduVal(singleEditItem?.urdu_value)
        }
    }, [showEdit])


    const getTemplateType = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-sms-template-type`);
            if (response?.status == 200) {
                setTemplateType(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const getTemplateFor = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-sms-template-for`);
            if (response?.status == 200) {
                setTemplateFor(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }   

    const handleSaveEdit = async () => {
        try {
                setIsLoading(true)
                const response = await API.put(`/update-template-data`, {
                    TemplateType: selectedTemplateType,
                    TemplateFor: selectedTemplateFor,
                    Template: englishVal,
                    urduTemplate: urduVal,
                    id: singleEditItem?.id,
                });
                if (response?.status == 200) {
                    toast.success(response?.data?.message)
                    setIsLoading(false)
                    handleCloseEdit();
                }
                else {
                    toast.error(response?.data?.message)
                    setIsLoading(false)
                }
        }
        catch (error) {
            console.log("error in apii", error);
            setIsLoading(false)
        }
    }

    return (
        <Modal className='editSmsTemplateModal' show={showEdit} onHide={handleCloseEdit} centered>
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseEdit}></span>
                <h3> Edit Template </h3>
                <Divider />
                <div className="wrape_fields">
                    <div className="single_field customSelect">
                        <label htmlFor=""> Choose Template Type* </label>
                        <Form.Select aria-label="Default select example" name='selectTemplateType' value={selectedTemplateType} onChange={handleChange} >
                            {templateType?.map((item, index) => {
                                return (<>
                                    <option value={item} selected={selectedTemplateType}>{item}</option>
                                </>)
                            })}
                        </Form.Select>
                    </div>
                    <div className="single_field customSelect">
                        <label htmlFor=""> Template For* </label>
                        <Form.Select aria-label="Default select example" name='selectTemplateFor' value={selectedTemplateFor} onChange={handleChange}>
                            {templateFor?.map((item, index) => {
                                return (<>
                                    <option value={item?.key} selected={selectedTemplateFor}>{item?.value}</option>
                                </>)
                            })}
                        </Form.Select>
                    </div>
                </div>
                <h4> Select Format </h4>
                <div className="ticksChecks">
                    {smsSettingsData?.map((item, index) => {
                        return (<>
                            {item?.isUrdu == 0 &&<div className="singleTick customTickCheck">
                                <label htmlFor={index}>
                                    <input type="radio" id={index} name='formatSelectEnglish' value={item?.shortcode} onChange={handleChange} />
                                    <span></span>
                                    <p className='inptPara'>
                                    {item?.format}
                                    </p>
                                </label>
                            </div>}
                        </>)
                    }
                    )}
                </div>
                <div className="ticksChecks urduchecks">
                    {smsSettingsData?.map((item, index) => {
                        return (<>
                            {item?.isUrdu == 1 && <div className="singleTick customTickCheck">
                                <label htmlFor={index}>
                                    <input type="radio" id={index} name='formatSelectUrdu' value={item?.shortcode} onChange={handleChange} />
                                    <span></span>
                                    {item?.format}
                                </label>
                            </div>}
                        </>)
                    }
                    )}
                </div>
                <div className="single customInp">
                    <label htmlFor=""> English </label>
                    <input type="text" placeholder="<doctor-name><start-date><practice-name><start-time><practice-phone><comments><doctor-number>" name='englishVal' value={englishVal} onChange={handleChange} />
                </div>
                <div className="single customInp">
                    <label htmlFor=""> Urdu </label>
                    <input type="text" placeholder="<doctor-name><start-date><practice-name><start-time><practice-phone><comments><doctor-number>"  name='urduVal' value={urduVal} onChange={handleChange} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="btnsWrapingEditModal">
                    <button onClick={handleCloseEdit}>Cancel</button>
                    <button onClick={handleSaveEdit}>Save</button>
                </div>
            </Modal.Footer>
        </Modal >
    )
}

export default EditSmsTemplateModal;
