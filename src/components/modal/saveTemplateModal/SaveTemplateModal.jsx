/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Form, Modal } from "react-bootstrap"
import "./saveTemplateModal.scss"
import API from '../../../services/httpInstance';

const SaveTemplateModal = ({ saveTemplateShow, handleSaveTemplateClose, medicinesList, onTemplateSaved, getfavouriteMedicine  }) => {

    const [isTemplateError, setIsTemplateError] = useState('');
    const [isTemplate, setIsTemplate] = useState('')
    const [medicinesArr, setMedicinesArr] = useState([])


    useEffect(() => {
        setMedicinesArr(medicinesList?.map((item) => ({
            medicine_id : item?.medicine_id,
            medicineTitle : item?.medicineTitle || item?.title,
            dosage_id : item?.dosage_id,
            dosage: item?.dosage,
            dosagevalue : item?.dosagevalue,
            dosage_title : item?.dosage_title,
            meal_id : item?.meal_id,
            duration_id : item?.duration_id,
            durationvalue :item?.durationvalue,
            duration :item?.duration,
            duration_title :item?.duration_title,
            frequency_id : item?.frequency_id,
            frequency : item?.frequency,
            frequency_title : item?.frequency_title,
            meal : item?.mealTitle,
            meal_id : item?.meal_id,
        })));
    }, [saveTemplateShow, medicinesList])

    const handleTemplateSaveButton = async () => {
        if (!isTemplate) {
            setIsTemplateError('Template name is required');
            return;
        }

        const payload = {
            title: isTemplate,
            medicine: medicinesArr,
        }

        try {
            const response = await API.post(`/add-grp-med`, payload)
            if (response.status == 200) {
                onTemplateSaved(response?.data);
                await getfavouriteMedicine()
                handleSaveTemplateClose(false)
            } else if (response.status == 422) {
                setIsTemplateError(response?.data?.message);
            } else {
                setIsTemplateError(response?.data?.message);
            }
        } catch (error) {
            console.log(error)
            setIsTemplateError('Something went wrong. Please try again later.');
        }

    }
    return (
        <Modal className='save_template' show={saveTemplateShow} onHide={handleSaveTemplateClose}>
            <button onClick={handleSaveTemplateClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <h3>Are you sure you want to save this template?</h3>
                <Form.Group>
                    <Form.Label>Template Name</Form.Label>
                    <Form.Control placeholder='Enter template name' type="text" value={isTemplate} onChange={(e) => setIsTemplate(e.target.value)} required />
                    {isTemplateError && (
                        <p style={{ color: "#C12C3B", fontSize: '12px', fontWeight: '300' }}>{isTemplateError}</p>
                    )}
                </Form.Group>
                <div className="btn_wrap">
                    <button className='button1' onClick={handleSaveTemplateClose}>No</button>
                    <button className='button2' onClick={handleTemplateSaveButton}>SAVE</button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default SaveTemplateModal