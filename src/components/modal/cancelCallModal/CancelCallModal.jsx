import { Modal } from "react-bootstrap"
import './cancelCallModal.scss';
import API from "../../../services/httpInstance";
import { useNavigate } from "react-router-dom";

const CancelCallModal = ({cancelAppointment,handleCancelClose,appointmentId}) => {
    const navigate = useNavigate();
    const handleCancelButton = async () => {
        try {
            const response = await API.patch("/cancel-fad-appointment", {
                appointmentId: appointmentId,
                status: "cancelled",
                cancelReason: 'cancelled during appointment',
            });
            if (response.status === 200) {
                handleCancelClose('')
                navigate('/appointments')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal show={cancelAppointment} onHide={handleCancelClose} centered className="cancelCallModal">
            <Modal.Body>
                <div className="centerMainDiv">
                    <div>   
                    <p>
                    Are you sure you want to cancel this call ? 
                   </p>
                    </div>
                    <div className="cancelContainer">
                        <button onClick={handleCancelButton} className="yesCancel">Yes</button>
                        <button onClick={handleCancelClose} className="NoCancel">No</button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default CancelCallModal
