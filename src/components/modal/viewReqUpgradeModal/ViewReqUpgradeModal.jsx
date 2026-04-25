import React, { useState } from 'react'
import './viewReqUpgradeModal.scss';
import { Modal } from 'react-bootstrap';

const ViewReqUpgradeModal = ({ showViewUpgrade, handleViewCloseUpgrade, viewSingleItem }) => {

    return (
        <Modal show={showViewUpgrade} onHide={handleViewCloseUpgrade} centered className="viewreqUpgradeModal">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleViewCloseUpgrade}></span>
                <img src={viewSingleItem?.file_path} alt="" className='img_view' />
                <div className="wrape_btns">
                    <button onClick={handleViewCloseUpgrade}> Cancel </button>
                    <button>  Download </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ViewReqUpgradeModal;
