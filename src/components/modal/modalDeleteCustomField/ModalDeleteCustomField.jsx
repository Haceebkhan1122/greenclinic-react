/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Form, Modal, Row } from "react-bootstrap"
import './modalDeleteCustomField.scss';
import { useEffect, useState } from "react";
import API from "../../../services/httpInstance";

const ModalDeleteCustomField = ({ showDelete, getAppointments, handleCloseDelete, text, singleEditItem }) => {
    const [id, setId] = useState(null);
    const [indicationMessage, setIndicationMessage] = useState("");



    useEffect(() => {
        if (singleEditItem) {
            setId(singleEditItem?.id)
        }
    }, [showDelete]);   


    const deleteCustomFn = async () => {
        try {
                const response = await API.delete(`/delete-custom-fields-appointment?id=${id}`);
                if (response?.status == 200) {
                    setIndicationMessage(response?.data?.message)
                    handleCloseDelete();
                    getAppointments();
                }
            else {
                setIndicationMessage("Please fill all the required fields")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    

    return (
        <Modal show={showDelete} onHide={handleCloseDelete} centered className="modalDeleteCustomFieldAppointment">
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

export default ModalDeleteCustomField;
