import React from 'react'
import './typedModal.scss';
import { Modal } from 'react-bootstrap'

const TypedModal = ({ handleClose, show, addHistory, postData, setPostData, heading }) => {
    const handleSearchQuery = (e) => {
        setPostData(e.target.value)
    }

    return (
        <Modal show={show} centered onHide={handleClose} className='indicationsModal lowHeight' backdropClassName="custom-backdrop" >
            <Modal.Body>
                <span className='cross' onClick={handleClose}>  </span>
                <div className="wraper_indicationModal">
                    <h3>{heading} </h3>
                    <div className="search-bar">
                        <input onChange={(e) => handleSearchQuery(e)} value={postData} type="text" placeholder='Enter' />
                    </div>
                    <ul>
                    </ul>
                    <div className="btDo tw-w-full tw-flex tw-justify-end tw-items-center">
                        <button onClick={addHistory} > Done </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default TypedModal