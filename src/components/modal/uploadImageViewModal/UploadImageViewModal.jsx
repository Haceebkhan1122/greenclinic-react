import React from 'react'
import { Modal } from 'react-bootstrap'
import "./uploadImageViewModal.scss"

const UploadImageViewModal = ({ uploadImageViewShow, handleUploadImageViewClose, imageUrl }) => {
    return (
        <Modal className='upload_image_view' show={uploadImageViewShow} onHide={handleUploadImageViewClose}>
            <button onClick={handleUploadImageViewClose} className="close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                {imageUrl ? (
                    <img src={imageUrl} alt="Uploaded Lab Test" style={{ width: '100%' }} />
                ) : (
                    <p>No image available</p>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default UploadImageViewModal