/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Form, Modal, Row } from "react-bootstrap"
import './modalDeleteCustomFieldExamination.scss';
import { useEffect, useState } from "react";
import API from "../../../services/httpInstance";

const ModalDeleteCustomFieldExamination = ({ showDelete, getAppointments,getExamination, handleCloseDelete, text, singleEditItem, examinationData }) => {
    const [id, setId] = useState(null);
    
    const [indicationMessage, setIndicationMessage] = useState("");

    useEffect(() => {
        if (singleEditItem) {
            setId(singleEditItem?.id)
        }
    }, [showDelete]);   


    const deleteCustomFn = async () => {
        try {
                const response = await API.delete(`/delete-examination?id=${id}`);
                if (response?.status == 200) {
                    handleCloseDelete();
                    getExamination();
                    setTimeout(() => {
                        setIndicationMessage(response?.data?.message)
                    }, 1000);
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
        <Modal show={showDelete} onHide={handleCloseDelete} centered className="modalDeleteCustomFieldExamination">
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseDelete}></span>
                <h2> Are you sure you want to
                    delete this {text}? </h2>
            </Modal.Body>
            <Modal.Footer>
                <div className="wraper_btns">
                    <button onClick={handleCloseDelete}> NO </button>
                    <button onClick={deleteCustomFn}> YES </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDeleteCustomFieldExamination;
