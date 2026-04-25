import { Modal } from "react-bootstrap"
import './markConsultationEndedModal.scss';

const MarkConsultationEndedModal = ({ showMarkEnded, handleCloseMarkEnded, handleOnlineSaveButton }) => {
    return (
        <Modal show={showMarkEnded} onHide={handleCloseMarkEnded} centered className="markConsultationEndedModal">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseMarkEnded}></span>
                <span className="infoIco">  </span>
                <h2> Consultation ended by patient </h2>
                <p> Patient has ended the consultation, you can continue adding prescription or mark as complete </p>
                <div className="wraper_btns">
                    <button onClick={handleCloseMarkEnded} className="button1"> CONTINUE PRESCRIPTION </button>
                    <button className="button2" onClick={handleOnlineSaveButton}> MARK COMPLETE </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default MarkConsultationEndedModal;
