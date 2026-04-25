/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Form, Modal, Row } from "react-bootstrap"
import { useEffect, useState } from "react";
import API from "../../../services/httpInstance";
import './modalDeleteProcedure.scss';

const ModalDeleteProcedure = ({ showDelete,  getAppointments, indicationMessage, setIndicationMessage, handleCloseDelete, text, singleEditItem, getProcedures, doctorId, id }) => {

    const deleteCustomFn = async () => {
        try {
                const response = await API.delete(`/delete-procedures?id=${id}&doctor_id=${doctorId}`);
                if (response?.status == 200) {
                    setIndicationMessage(response?.data?.message)
                    handleCloseDelete();
                    getProcedures();
                }
            else {
                setIndicationMessage("Please fill all the required fields")
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <Modal show={showDelete} onHide={handleCloseDelete} centered className="modalDeleteProcedure">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseDelete}></span>
                <h2> Are you sure you want to
                    delete this {text}? </h2>
            </Modal.Body>
            <Modal.Footer>
                <div className="wraper_btns">
                    <button onClick={deleteCustomFn}> Yes </button>
                    <button onClick={handleCloseDelete}> No </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalDeleteProcedure;
