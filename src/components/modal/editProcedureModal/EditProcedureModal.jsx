/* eslint-disable react/prop-types */
import { Divider } from 'antd'
import './editProcedureModal.scss';
import { Form, Modal } from 'react-bootstrap';

const EditProcedureModal = ({ editLabshow, indicationMessage, setIndicationMessage, handleEditLabClose, handleEditLabshow }) => {

    const handleChangeData = () => { console.log("") }

    return (
        <Modal show={editLabshow} onHide={handleEditLabClose} centered className="modalEditProceduresMobile">
            <Modal.Body>
                <div className="custom_field_form">
                    <div className="fieldsWrape">
                        <h2> Edit Procedure  </h2>
                        <Divider />
                        <div className="single customInp">
                            <label htmlFor=""> Procedure Name </label>
                            <input type="text" placeholder="General" />
                        </div>
                        <div className="single customInp">
                            <label htmlFor=""> Procedure Price  </label>
                            <input type="text" placeholder="Rs. 1000" />
                        </div>
                        <div className="single_field customSelect">
                            <label htmlFor=""> Doctor </label>
                            <Form.Select aria-label="Default select example" name='dataType' onChange={handleChangeData}>
                                <option value={1}>Dr. Nida</option>
                                <option value={2}>data demo</option>
                                <option value={3}>data demo1</option>
                            </Form.Select>
                        </div>
                        <div className="single customInp">
                            <label htmlFor=""> Doctor Share </label>
                            <input type="text" placeholder="600" />
                        </div>
                        <div className="singleTick customTickCheck">
                            <label htmlFor="tick">
                                <input type="checkbox" id='tick' />
                                <span></span>
                                For All Doctors
                            </label>
                        </div>
                        <div className="single_field customSelect">
                            <label htmlFor=""> Discount in Percentage </label>
                            <Form.Select aria-label="Default select example" name='dataType' onChange={handleChangeData}>
                                <option value={1}>1</option>
                                <option value={2}>data demo</option>
                                <option value={3}>data demo1</option>
                            </Form.Select>
                        </div>
                        <Divider />
                        <div className="wrape_btn">
                            <button onClick={handleEditLabClose}> Cancel </button>
                            <button> Next </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default EditProcedureModal;
