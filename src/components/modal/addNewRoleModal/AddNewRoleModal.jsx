import React from 'react'
import { Col, Modal, Row, Form } from 'react-bootstrap'
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import { Divider, Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "./addNewRoleModal.scss"

const AddNewRoleModal = ({ handleAddNewRoleClose, addNewRole, handleChange, handlePermissions, nameField, handleRoles, phoneNumber, email, password, rolesField, confirmPassword, handleSave, activeSwitches, rolesSettings, permissions }) => {
    return (
        <Modal className='add_new_role' show={addNewRole} onHide={handleAddNewRoleClose}>
            <button onClick={handleAddNewRoleClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                </svg>
            </button>
            <Modal.Body>
                <h2><img src={ArrowBack} alt="" onClick={handleAddNewRoleClose} /> Add New Role</h2>
                <div className="right">
                    <h3> Personal Information </h3>
                    <Divider />
                    <Col lg={12}>
                        <Row className=''>
                            <Col lg={6} className='mb-20'>
                                <div className="single customInp">
                                    <label htmlFor=""> Full Name* </label>
                                    <input type="text" placeholder="Enter full name" name="nameField" value={nameField} onChange={handleChange} />
                                </div>
                            </Col>
                            <Col lg={6} className='mb-20'>
                                <div className="single customInp">
                                    <label htmlFor=""> Mobile Number* </label>
                                    <input type="text" placeholder="Enter mobile number" name="phone" value={phoneNumber} onChange={handleChange} />
                                </div>
                            </Col>
                            <Col lg={6} className='mb-20'>
                                <div className="single customInp">
                                    <label htmlFor=""> Email Address </label>
                                    <input type="text" placeholder="Enter mobile number" name="email" value={email} onChange={handleChange} />
                                </div>
                            </Col>
                            <Col lg={6} className='mb-20'>
                                <span className='heLab'> Gender </span>
                                <div className="wrape_gender">
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="gender1" name="gender" value={"male"} onChange={handleChange} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="gender1"> Male </label>
                                    </div>
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="gender2" name="gender" value={"female"} onChange={handleChange} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="gender2"> Female </label>
                                    </div>
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="gender3" name="gender" value={"other"} onChange={handleChange} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="gender3"> Other </label>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6} className='mb-20'>
                                <label htmlFor=""> New password </label>
                                <div className="single_field passwordField">
                                    <Input.Password
                                        placeholder="Enter your password"
                                        name='password'
                                        value={password}
                                        onChange={handleChange}
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                    {/* <span className="error"> asdasdsadasdasd s</span> */}
                                </div>
                            </Col>
                            <Col lg={6} className='mb-20'>
                                <label htmlFor=""> Confirm password </label>
                                <div className="single_field passwordField">
                                    <Input.Password
                                        placeholder="Enter your password"
                                        name="confirmPassword" value={confirmPassword} onChange={handleChange}
                                        className=''
                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <h4> Roles </h4>
                        <div className="wrape_radios">
                            {rolesSettings?.roles?.map((item, idx) => {
                                return (<>
                                    <div className="single customRadioo">
                                        <div className="wrapeInp">
                                            <input type="radio" id="roles1" defaultChecked={item?.id == rolesField ? true : false} name="rolesField" value={item?.id} onChange={(e) => handleRoles(e, item?.slug)} />
                                            <span></span>
                                        </div>
                                        <label htmlFor="roles1"> {item?.name} </label>
                                    </div>
                                </>)
                            })}
                        </div>
                        <h3 className='staffTitle'> Staff Roles User Rights </h3>
                        <Divider />
                        <Col lg={12}>
                            <div className="wraper_checks__row">
                                <Row className=''>
                                    {permissions?.map((item, idx) => {
                                        return (<>
                                            <Col lg={6}>
                                                <div className='boxxxWraper'>
                                                    <div className='boxxx tw-flex tw-justify-between tw-items-center'>
                                                        <h3 className='titleBox'> {item?.name} </h3>
                                                        <div className="field_check customCheck">
                                                            <label htmlFor="">  </label>
                                                            <Form.Check
                                                                type="switch"
                                                                id={`custom-switch-${idx}`}
                                                                name="viewChecked"
                                                                value={item?.id}
                                                                onChange={(e) => { handlePermissions(item?.id, e, idx) }}
                                                                checked={activeSwitches.includes(item?.id)}
                                                            />
                                                        </div>
                                                    </div>
                                                    {activeSwitches.includes(item?.id) && (
                                                        <div className="ticksWrapingAll">
                                                            {item?.child?.map((childItem) => {
                                                                return (<>
                                                                    <div className="singleTick customTickCheck">
                                                                        <label htmlFor={`${childItem?.id}_${childItem?.slug.replace(/\D/g, '')}`}>
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`${childItem?.id}_${childItem?.slug.replace(/\D/g, '')}`}
                                                                                name="clinic_check_permissions"
                                                                                value={childItem?.id}
                                                                                onChange={handleChange}
                                                                            />
                                                                            <span></span>
                                                                            {childItem?.name}
                                                                        </label>
                                                                    </div>
                                                                </>)
                                                            })}
                                                        </div>)}
                                                </div>
                                            </Col>
                                        </>)
                                    })}
                                </Row>
                            </div>
                        </Col>
                    </Col>
                    <div className="btnWrapeSave box-fixed">
                        <button onClick={handleSave}> Save </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default AddNewRoleModal