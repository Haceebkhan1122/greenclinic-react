import { Modal } from "react-bootstrap"
import './markCompleteConsultModal.scss';
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const MarkCompleteConsultModal = ({ showMarkComplete, handleOnlineSaveButton, handleCloseMarkComplete }) => {

    return (
        <Modal show={showMarkComplete} onHide={handleCloseMarkComplete} centered className="markCompleteConsultModal">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseMarkComplete}></span>
                <h2> Are you sure you want to mark
                    this consultation as complete? </h2>
                <div className="wraper_btns">
                    <button onClick={handleCloseMarkComplete} className="button1"> NO </button>
                    <button className="button2" onClick={handleOnlineSaveButton}> MARK COMPLETE </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MarkCompleteConsultModal
