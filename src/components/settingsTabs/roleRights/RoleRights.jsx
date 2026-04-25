import { Col, Form, Row, Table } from 'react-bootstrap';
import './roleRights.scss';
import { Divider, Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import API from '../../../services/httpInstance';
import { useMediaQuery } from '@mui/material'
import { toast } from 'react-toastify';
import AddNewRoleModal from '../../modal/addNewRoleModal/AddNewRoleModal';
import DeleteRoleModal from '../../modal/deleteRoleModal/DeleteRoleModal';
import Loader from '../../loader/Loader';
import { useSelector } from 'react-redux';

const RoleRights = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [rolesListingData, setRolesListingData] = useState([]);
  const [nameField, setNameField] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rolesField, setRolesField] = useState("");
  const [rolesSettings, setRolesSettings] = useState([])
  const [activeSwitches, setActiveSwitches] = useState([]);
  const [permissions, setPermissions] = useState([])
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [addNewRole, setAddNewRole] = useState(false)
  const isMobile = useMediaQuery('(max-width:767px)');
  const [isValid, setIsValid] = useState(false);
  const [passEight, setPassEight] = useState(false)
  const [validEmail, setValidEmail] = useState(false);
  const [errorObj, setErrorObj] = useState({});
  const [indicationMessage, setIndicationMessage] = useState("");
  const [editClicked, setEditClicked] = useState(false);
  const [singleEditItem, setSingleEditItem] = useState({})
  const [deleteLabShow, setDeleteLabShow] = useState(false)
  const [singleItem, setSingleItem] = useState([]);

  let user = useSelector((state) => state.user.user);

  const handleAddNewRoleShow = () => setAddNewRole(true)
  const handleAddNewRoleClose = () => setAddNewRole(false);

  const [editPermissions, setEditPermissions] = useState([]);

  const handleShowEdit = async (item) => {
    setEditClicked(true);
    setIsLoading(true);
    const response = await API.get(`/edit-role?doctor_id=${item?.id}`);
    setIsLoading(false);
    if (response?.status === 200) {
      setErrorObj({});
      errorObj.email = ""
      errorObj.password = ""
      const data = response?.data?.data;
      let roleSet = data?.role_id == 3 ? "doctor" : data?.role_id == 7 ? "receptionist" : data?.role_id == 8 ? "staff" : "";
      getPermissionsByRoles(roleSet);
      let editPermissions = data?.permissons;
      let activeids = editPermissions?.map((item) => item?.id);
      const selectedChildIds = editPermissions?.flatMap((item) => item.child?.map((child) => child.id) || []);
      const combinedSelected = [...activeids, ...selectedChildIds];
      setSelectedPermissions(combinedSelected);
      setActiveSwitches(activeids);
      let concat = [...permissions, ...editPermissions];
      const uniqueSet = [...new Set(concat)];
      setSingleItem(data);
      setEditPermissions(uniqueSet)
    }
  };

  useEffect(() => {
    if (singleItem) {
      setNameField(singleItem?.name)
      setPhoneNumber(singleItem?.phone)
      setEmail(singleItem?.email)
      setGender(singleItem?.gender);
      setRolesField(singleItem?.role_id);
    }
    if(editPermissions?.length > 0) {
      setPermissions(editPermissions);
    }
  }, [singleItem])  

  useEffect(() => {
    
    if (permissions && !editClicked) {
      const activeIds = permissions?.map((item) => item?.id);
      setActiveSwitches(activeIds);
      const selectedChildIds = permissions.flatMap((item) => item.child?.map((child) => child.id) || []);
      const combinedSelected = [...activeIds, ...selectedChildIds];
      setSelectedPermissions(combinedSelected);
    }
  }, [permissions]);

  const handleDeleteLabClose = () => setDeleteLabShow(false)

  useEffect(() => {
    getRoleListing();
    getRoleSettings();
  }, []);

  const getRoleListing = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/role-listing-setting`);
      if (response?.status == 200) {
        setRolesListingData(response?.data?.data);
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  const getRoleSettings = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/roles-permission-setting`);
      if (response?.status == 200) {
        setRolesSettings(response?.data?.data);
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const { value, name, checked } = e.target;

    if (name == "nameField") {
      errorObj.name = "";
      let val = value.slice(0, 30)
      setNameField(val);
    }

    if (name == "phone") {
      errorObj.phoneNumber = "";
      let val = value.slice(0, 11);
      if (val !== "" && !val.startsWith(`03`)) {
        errorObj.phoneNumber = "Number must be starts with 03"
      }
      if (val !== "" && !val.startsWith(0) || !val.startsWith("0")) {
        val = ""
        errorObj.phoneNumber = "Number must be starts with 0"
      }
      setPhoneNumber(val);
    }

    if (name == "email") {
      errorObj.email = "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidEmail(emailRegex.test(value));
      let val = value.slice(0, 35);
      setEmail(val);
    }

    if (name == "email") {
      errorObj.email = " "

      if (value.length >= 30) {
        errorObj.email = 'Email must be less than or 35 characters'
      }
      else {
        errorObj.email = ''
      }
    }

    if (name == "gender") {
      errorObj.gender = "";
      setGender(value);
    }

    if (name == "password") {
      errorObj.password = "";
      let val = value.slice(0, 30);
      setIsValid(/[A-Z]/.test(val))
      if (val.length < 8) {
        errorObj.password = "Password must be atleast 8 characters long"
        setPassEight(false);
      }
      if (val.length >= 8) {
        setPassEight(true)
        errorObj.password = ""
      }
      setPassword(val);
    }

    if (name == "confirmPassword") {
      errorObj.cPassword = "";
      let val = value.slice(0, 30);
      setIsValid(/[A-Z]/.test(val))
      if (val.length < 8) {
        errorObj.cPassword = "Confirm Password must be atleast 8 characters long"
        setPassEight(false);
      }
      if (val.length >= 8) {
        setPassEight(true)
        errorObj.password = ""
      }
      setConfirmPassword(val);
    }

    if (name == "rolesField") {
      setRolesField(value)
      setEditClicked(false);
    }

    if (name == "clinic_check_permissions") {
      errorObj.permission = ""
      const id = parseInt(e.target.value);

      setSelectedPermissions((prev) => {
        if (checked) {
          return [...new Set([...prev, id])];
        } else {
          return prev.filter((permId) => permId !== id);
        }
      });
    }
  }

  const handlePermissions = (id, e, idx) => {
    const checked = e.target.checked;
    const childIds = permissions.find((p) => p.id === id)?.child?.map((c) => c.id) || [];

    setActiveSwitches((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });

    setSelectedPermissions((prev) => {
    if (checked) {
      return [...new Set([...prev, id, ...childIds])];
    } else {
      return prev.filter((permId) => permId !== id && !childIds.includes(permId));
    }
  });
  };

  const handleDelete = (item) => {
    setDeleteLabShow(true)
    setSingleEditItem(item)
  }

  const [editPermissionsAll, setEditPermissionsAll] = useState([])

  const getPermissionsByRoles = async (slugPermission) => {
    try {
      setIsLoading(true);
      const response = await API.get(`/get-permission-by-role?slug=${slugPermission}`);
      if (response?.status == 200) {
        setPermissions(response?.data?.data?.permissions);
        // setEditPermissionsAll(response?.data?.data?.permissions)
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  const handleRoles = (e, slug) => {
    const { value, name, checked } = e.target;
    errorObj.rolesField = ""
    if (checked) {
      getPermissionsByRoles(slug)
      setRolesField(value);
      setEditClicked(false);
    }
  }

  const handleStatus = async (e, item) => {
    const { value, name, checked } = e.target;
    let payload = { id: item?.id }
    try {
      checked ? payload.status = "1" : payload.status = "0";
      setIsLoading(true)
      const response = await API.patch(`/status-role-setting`, payload);
      if (response?.status == 200) {
        setIsLoading(false)
        getRoleListing();
        setIndicationMessage(response?.data?.message);
      }
      else {
        setIndicationMessage(response?.data?.message);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("error")
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    let errors = {};
    if (!nameField) errors.name = "Name is Required";
    if (!phoneNumber) errors.phoneNumber = "PhoneNumber is Required";
    if (phoneNumber !== "" && phoneNumber?.length !== 11) errors.phone = "Please enter a valid mobile number."
    if (!phoneNumber?.startsWith("03")) errors.phone = "Phone number must be starts with 03."
    if (!password) errors.password = "password is Required";
    if (!confirmPassword) errors.confirmPassword = "Confirm Password is Required";
    if (!rolesField) errors.rolesField = "Roles Field is Required";
    if (!gender) errors.gender = "Gender is Required";
    if (!email) errors.email = "Email is Required";
    if (email !== "" && !validEmail) errors.email = "Please enter a valid email address."
    if (password == "") errors.password = "Password is Required"
    if (!selectedPermissions.length || selectedPermissions.length == 0) errors.permission = "Permission is Required"
    if (confirmPassword == "") errors.confirmPassword = "Confirm Password is Required"
    if (password !== confirmPassword) errors.password = "Passwords do not match."

    try {
      setIsLoading(true);
      const response = await API.post("/add-new-role", {
        first_name: nameField,
        phone: phoneNumber,
        email,
        password,
        retype_password: confirmPassword,
        role_id: rolesField,
        permission_id: selectedPermissions,
        gender,
      })
      if (response?.status == 200) {
        setIndicationMessage(response?.data?.message);
        setIsLoading(false)
        getRoleListing();
        setNameField("")
        setPhoneNumber("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setGender("")
        setErrorObj({});
        errors = {};
      }
      else {
        setIndicationMessage(response?.data?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error in save", error);
      setIsLoading(false);
    }
    setErrorObj(errors);
  }

  const handleEdit = async () => {
    let errors = {};
    if (!nameField) errors.name = "Name is Required";
    if (!phoneNumber) errors.phoneNumber = "PhoneNumber is Required";
    if (phoneNumber !== "" && phoneNumber?.length !== 11) errors.phone = "Please enter a valid mobile number."
    if (!phoneNumber?.startsWith("03")) errors.phone = "Phone number must be starts with 03."
    if (!password) errors.password = "password is Required";
    if (!confirmPassword) errors.confirmPassword = "Confirm Password is Required";
    if (!rolesField) errors.rolesField = "Roles Field is Required";
    if (!gender) errors.gender = "Gender is Required";
    if (!email) errors.email = "Email is Required";
    if (email !== "" && !validEmail) errors.email = "Please enter a valid email address."
    if (password == "") errors.password = "Password is Required"
    if (!selectedPermissions.length || selectedPermissions.length == 0) errors.permission = "Permission is Required"
    if (confirmPassword == "") errors.confirmPassword = "Confirm Password is Required"
    if (password !== confirmPassword) errors.password = "Passwords do not match."

    try {
      setIsLoading(true);
      const response = await API.patch("/update-role", {
        id: singleItem?.id,
        first_name: nameField,
        phone: phoneNumber,
        email,
        password,
        retype_password: confirmPassword,
        role_id: rolesField,
        permission_id: selectedPermissions,
        gender,
      })
      if (response?.status == 200) {
        setIndicationMessage(response?.data?.message);
        setIsLoading(false)
        getRoleListing();
        setNameField("")
        setPhoneNumber("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setGender("")
        setSelectedPermissions([])
        setActiveSwitches([]);
        setSingleEditItem("")
        setEditPermissions([]);
        setEditClicked(false);
        setRolesField("")
        setPermissions([])
        errors = {};
        setErrorObj({});
      }
      else {
        setIndicationMessage(response?.data?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error in save", error);
      setIsLoading(false);
    }
    setErrorObj(errors);
  }

  useEffect(() => {
    setRolesField(rolesSettings?.roles?.[0]?.id)
  }, [])

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 2000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])

  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      {isLoading ? <Loader />
        :
        (<>
          <div className='roleAndRights'>
            {isMobile ?
              <div className="cardRoleWraper">
                {rolesListingData?.map((item) => {
                  return (<>
                    <div className="singleCardRole">
                      <div className='box1'>
                        <div className="wrape">
                          <h4> {item?.name} </h4>
                          <span>  {item?.role} | {item?.gender} </span>
                        </div>
                        <span className='email'>{item?.email}</span>
                        <span className='num'>{item?.phone}</span>
                      </div>
                      <div className='box2'>
                        {item?.id !== user?.id && <div className="ico">
                          <span className="editIco" onClick={() => handleShowEdit(item)} ></span>
                          <span className="deleteIco" onClick={() => handleDelete(item)}  ></span>
                          <div className="single customCheck">
                            <Form.Check
                              type="switch"
                              id={`${item?.key}_custom_check`}
                              checked={item?.status == "1" ? true : false}
                              onChange={(e) => handleStatus(e, item)}
                            />
                          </div>
                        </div>}
                      </div>
                    </div>
                  </>)
                })}
              </div>
              : <Row>
                <Col lg={7}>
                  <div className="left">
                    <div className="table__wrape">
                      <Table>
                        <thead>
                          <tr>
                            <th>Name/Role</th>
                            <th>Phone Number</th>
                            <th>Gender</th>
                            <th>Email</th>
                            <th> Action </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rolesListingData?.map((item) => {
                            return (<>
                              <tr>
                                <td>
                                  <div className="wrape">
                                    <h5> {item?.name} </h5>
                                    <span>  {item?.role} </span>
                                  </div>
                                </td>
                                <td>{item?.phone?.slice(0, 4)} {item?.phone?.slice(4)} </td>
                                <td>{item?.gender}</td>
                                <td>{item?.email}</td>
                                <td>
                                  {item?.id !== user?.id && <div className="ico">
                                    <span className="editIco" onClick={() => handleShowEdit(item)} ></span>
                                    <span className="deleteIco" onClick={() => handleDelete(item)}  ></span>
                                    <div className="single customCheck">
                                      <Form.Check
                                        type="switch"
                                        id={`${item?.key}_custom_check`}
                                        checked={item?.status == "1" ? true : false}
                                        onChange={(e) => handleStatus(e, item)}
                                      />
                                    </div>
                                  </div>}
                                </td>
                              </tr>
                            </>)
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </Col>
                <Col lg={5}>
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
                          <span className='error'> {errorObj?.name} </span>
                        </Col>
                        <Col lg={6} className='mb-20'>
                          <div className="single customInp">
                            <label htmlFor=""> Mobile Number* </label>
                            <input type="text" placeholder="Enter mobile number" name="phone" value={phoneNumber} onChange={handleChange} />
                          </div>
                          <span className='error'> {errorObj?.phoneNumber} </span>

                        </Col>
                        <Col lg={6} className='mb-20'>
                          <div className="single customInp">
                            <label htmlFor=""> Email Address </label>
                            <input type="text" placeholder="Enter email address" name="email" value={email} onChange={handleChange} />
                          </div>
                          <span className='error'> {errorObj?.email} </span>

                        </Col>
                        <Col lg={6} className='mb-20'>
                          <span className='heLab'> Gender </span>
                          <div className="wrape_gender">
                            <div className="single customRadioo">
                              <div className="wrapeInp">
                                <input type="radio" id="gender1" name="gender" checked={gender == "male"} value={"male"} onChange={handleChange} />
                                <span></span>
                              </div>
                              <label htmlFor="gender1"> Male </label>
                            </div>
                            <div className="single customRadioo">
                              <div className="wrapeInp">
                                <input type="radio" id="gender2" name="gender" checked={gender == "female"} value={"female"} onChange={handleChange} />
                                <span></span>
                              </div>
                              <label htmlFor="gender2"> Female </label>
                            </div>
                            <div className="single customRadioo">
                              <div className="wrapeInp">
                                <input type="radio" id="gender3" name="gender" checked={gender == "other"} value={"other"} onChange={handleChange} />
                                <span></span>
                              </div>
                              <label htmlFor="gender3"> Other </label>
                            </div>
                          </div>
                          <span className='error'> {errorObj?.gender} </span>

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
                          <span className='error'> {errorObj?.password} </span>

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
                          <span className='error'> {errorObj?.cPassword} </span>

                        </Col>
                      </Row>
                      <h4> Roles </h4>
                      <div className="wrape_radios">
                        {rolesSettings?.roles?.map((item, idx) => {
                          return (<>
                            <div className="single customRadioo">
                              <div className="wrapeInp">
                                <input type="radio" id="roles1" checked={item?.id == rolesField} name="rolesField" value={item?.id} onChange={(e) => handleRoles(e, item?.slug)} />
                                <span></span>
                              </div>
                              <label htmlFor="roles1"> {item?.name} </label>
                            </div>
                          </>)
                        })}
                      </div>
                      <span className='error'> {errorObj?.rolesField} </span>
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
                                                  onChange={(e) => handleChange(e, item?.id)}
                                                  checked={selectedPermissions.includes(childItem?.id)}
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
                    <Divider />
                    <div className="btnWrapeSave">
                      {editClicked ?
                        <button onClick={handleEdit}> Edit </button>
                        :
                        <button onClick={handleSave}> Save </button>
                      }
                    </div>
                  </div>
                </Col >
              </Row >}
          </div >
          <div className="bottomBarMobBtn">
            <button onClick={handleAddNewRoleShow}> ADD NEW ROLE </button>
          </div>
          <AddNewRoleModal handleAddNewRoleClose={handleAddNewRoleClose} addNewRole={addNewRole} handleChange={handleChange} nameField={nameField} phoneNumber={phoneNumber} email={email} password={password} confirmPassword={confirmPassword} activeSwitches={activeSwitches} rolesSettings={rolesSettings} handlePermissions={handlePermissions} handleRoles={handleRoles} permissions={permissions} handleSave={handleSave} rolesField={rolesField} />
          <DeleteRoleModal getRoleListing={getRoleListing} getRoleSettings={getRoleSettings} handleDeleteLabClose={handleDeleteLabClose} deleteLabShow={deleteLabShow} indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} singleEditItem={singleEditItem} />
        </>)
      }
    </>
  )
}

export default RoleRights;
