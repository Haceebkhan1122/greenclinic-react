import React, { useEffect, useState } from 'react';
import { Row, Col, Accordion, Table, Form } from 'react-bootstrap';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Divider, Select } from 'antd';
import AddCircle from '../../../../assets/images/svg/add_circle.svg';
import ArrowRight from '../../../../assets/images/png/arrowright_black.png';
import './groupMedicine.scss';
import { isMobile } from 'react-device-detect';
import GroupMedicineModal from '../../../modal/groupMedicineModal/GroupMedicineModal';
import MedicineListModal from '../../../modal/medicineListModal/MedicineListModal';
import API from '../../../../services/httpInstance';
import { toast } from 'react-toastify';
import { duration } from 'moment/moment';
import { useSelector } from 'react-redux';
import Loader from '../../../loader/Loader';

const GroupMedicine = () => {
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [addMedicineMore, setAddMedicineMore] = useState([]);
  const [countMore, setCountMore] = useState(0);
  const [addGroup, setAddGroup] = useState(false);
  const [medicineList, setMedicineList] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [groupMedicines, setGroupMedicines] = useState([]);
  const [groupMedicinesList, setGroupMedicinesList] = useState([]);
  const [groupDuration, setGroupDuration] = useState([]);
  const [groupDosage, setGroupDosage] = useState([]);
  const [groupInstruction, setGroupInstruction] = useState([]);
  const [groupFrequency, setGroupFrequency] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [editGroup, setEditGroup] = useState(null);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errorObj, setErrorObj] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [medicinesArr, setMedicinesArr] = useState([
    {
      medicine_id: null,
      dosagevalue: '',
      dosage_id: null,
      dosage_type: null,
      durationvalue: '',
      duration_id: null,
      duration_type: null,
      meal_id: null,
      frequency_id: null,
      title: null
    },
  ]);

  const handleGroupMedicineShow = () => setAddGroup(true);
  const handleGroupMedicineClose = () => setAddGroup(false);

  const handleMedicineListShow = () => setMedicineList(true);
  const handleMedicineListClose = () => setMedicineList(false);

  // For Edit Table list
  const editGroupMedicineItem = async (medicineId) => {
    setIsLoading(true);
    setIsEditMode(true);
    try {
      if (!groupMedicinesList.length || !groupDosage.length || !groupDuration.length || !groupInstruction.length || !groupFrequency.length) {
        await getGroupMedicineListApi();
        await getChooseMedication();
      }
      const response = await API.get(`/edit-grp-med-setting/${medicineId}`);
      if (response.status === 200 && response.data?.data) {
        const groupData = response.data.data;
        setSelectedMedicine(groupData.medicine);
        // setIsEditMode(true);
        setGroupName(groupData.title);

        // Set medicines after options are loaded
        setMedicinesArr(groupData.medicines.map((medicine) => ({
          medicine_id: medicine.medicine_id || null,
          dosagevalue: medicine.dosage || '',
          dosage_type: medicine.dosage_type || null,
          dosage_id: medicine.dosage_id || null,
          durationvalue: medicine.duration || '',
          duration_id: medicine.duration_id || null,
          duration_type: medicine.duration_type || null,
          meal_id: medicine.meal_id || null,
          frequency_id: medicine.frequency_id || null,
          title: medicine.title || '',
        })));

        setEditGroup({ id: groupData.med_grp_id });
      }
    } catch (error) {
      console.error('Error fetching edit group medicine data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMedicine = () => {
    setCountMore(countMore + 1);
    setAddMedicineMore([...addMedicineMore, countMore + 1]);
    setMedicinesArr((prevState) => [
      ...prevState,
      {
        medicine_id: null,
        dosagevalue: '',
        dosage_id: null,
        dosage_type: null,
        durationvalue: '',
        duration_id: null,
        duration_type: null,
        meal_id: null,
        frequency_id: null,
        title: null
      },
    ]);
  };

  const deleteGroupMedicines = async (id) => {
    try {
      const updatedMedicines = groupMedicines.filter((item) => item.id !== id);
      setGroupMedicines(updatedMedicines);
      const response = await API.delete(`/delete-grp-medicine-setting/${id}`);
      if (response.status === 200) {
        toast.success(response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        groupMedicineApi();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteGroupMedicineItem = async (medicineId, groupId) => {
    try {
      const response = await API.delete(`/delete-medicine-from-group?medicineId=${medicineId}&medicineGroupId=${groupId}`);
      if (response.status === 200) {
        groupMedicineApi();
        toast.success(response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        toast.error(response?.data?.message || 'Something went wrong', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete medicine item', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  const getGroupMedicineListApi = async () => {
    try {
      const response = await API.get('/medicine-dropdown');
      if (response.status === 200) {
        // setGroupMedicinesList(response?.data?.data?.medicines);
        setGroupDuration(response?.data?.data?.duration);
        setGroupDosage(response?.data?.data?.dosage);
        setGroupInstruction(response?.data?.data?.instruction);
        setGroupFrequency(response?.data?.data?.frequency);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getChooseMedication = async () => {
    try {
      const response = await API.get(`/medicine-list?page=${page}`);
      if (response.status == 200) {
        const newMedicines = response?.data?.data?.medicines || [];
        setGroupMedicinesList(prevList => [...prevList, ...newMedicines]);
      }
    } catch (error) {
      toast.error('Failed to fetch medicine list. Please try again later.');
    }
  };

  const handlePopupScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMore) {
      setPage(prevPage => prevPage + 1); // Load next page when scrolled to bottom
    }
  };

  const groupMedicineApi = async () => {
    try {
      const response = await API.get('/all-grp-med-setting');
      if (response.status === 200) {
        setGroupMedicines(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch group medicines', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  // Add Group Medicines
  const addGroupMedicine = async () => {
    let errors = {};
    if (!groupName) errors.name = "Group name is required"
    const updatedMedicines = medicinesArr.map((medicine, index) => {

      if (!medicine.durationvalue) {
        errors.durationvalue = "Duration is required";
      }

      if (!medicine.dosagevalue) {
        errors.dosage = "Dosage is required";
      }

      return errors;
    });

    if (Object.keys(errors).length > 0 || updatedMedicines.some((m) => Object.keys(m).length > 0)) {
      setErrorObj({ ...errors, medicines: updatedMedicines });
      return;
    }

    const payload = {
      title: groupName,
      medicine: medicinesArr,
    };

    if (!duration) errors.durationId = "Duration is required"

    try {
      const response = await API.post('/add-grp-med-setting', payload);
      if (response.status === 200) {
        await groupMedicineApi();
        setGroupName('');
        setMedicinesArr([
          {
            medicine_id: null,
            dosagevalue: '',
            dosage_id: null,
            dosage_type: null,
            durationvalue: '',
            duration_id: null,
            duration_type: null,
            meal_id: null,
            frequency_id: null,
            title: null
          },
        ]);
        toast.success(response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        toast.error(response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.log(error);
    }
    setErrorObj(errors);
  };

  // Update Group Medicines
  const updateGroupMedicine = async (id) => {
    const payload = {
      title: groupName,
      medicine: medicinesArr,
      // medicine: medicinesArr.map(medicine => ({
      //   medicine_id: medicine.medicine_id,
      //   dosagevalue: medicine.dosagevalue,
      //   dosage_id: medicine.dosage_id,
      //   dosage_type: medicine.dosage_type,
      //   durationvalue: medicine.durationvalue,
      //   duration_id: medicine.duration_id,
      //   duration_type: medicine.duration_type, // Ensure this is included
      //   meal_id: medicine.meal_id,
      //   frequency_id: medicine.frequency_id,
      // })),
    };
    try {
      const response = await API.put(`/update-group-medi/${id}`, payload);
      if (response.status === 200) {
        await groupMedicineApi();
        setGroupName('');
        setMedicinesArr([
          {
            medicine_id: null,
            dosagevalue: '',
            dosage_id: null,
            dosage_type: null,
            durationvalue: '',
            duration_id: null,
            duration_type: null,
            meal_id: null,
            frequency_id: null,
          },
        ]);

        setIsEditMode(false);
        setEditGroup(null);

        toast.success(response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        toast.error(response?.data?.message, {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update group medicine', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };

  const handleChangeGroupName = (event) => {
    setGroupName(event.target.value);
  };

  // const handleChangeField = (index, field, value) => {
  //   setMedicinesArr((prevState) => {
  //     const updatedArr = [...prevState];
  //     updatedArr[index][field] = value;
  //     const updatedMedicines = [...medicinesArr];
  //     updatedMedicines[index][field] = value;
  //     setMedicinesArr(updatedMedicines);
  //     if (field === 'medicine_id') {
  //       const selectedMedicine = groupMedicinesList.find((item) => item.id === value);
  //       if (selectedMedicine) {
  //         updatedArr[index].title = selectedMedicine.title;
  //       }
  //     }
  //     return updatedArr;
  //   });
  // };

  const handleChangeField = (index, field, value) => {
    setMedicinesArr((prevState) => {
      const updatedArr = [...prevState];
      updatedArr[index][field] = value;
      if (field === 'medicine_id') {
        const selectedMedicine = groupMedicinesList.find((item) => item.id === value);
        if (selectedMedicine) {
          updatedArr[index].title = selectedMedicine.title;
        }
      } else if (field === 'dosage_id') {
        const selectedDosage = groupDosage.find((item) => item.id === value);
        if (selectedDosage) {
          updatedArr[index].dosage_type = selectedDosage.type;
        }
      } else if (field === 'duration_id') {
        const selectedDuration = groupDuration.find((item) => item.id === value);
        if (selectedDuration) {
          updatedArr[index].duration_type = selectedDuration.type;
        }
      }
      return updatedArr;
    });
    setErrorObj((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (field === "durationvalue" && newErrors.medicines?.[index]?.duration) {
        delete newErrors.medicines[index].duration;
      }
      if (field === "dosagevalue" && newErrors.medicines?.[index]?.dosage) {
        delete newErrors.medicines[index].dosage;
      }

      if (newErrors.medicines?.[index] && Object.keys(newErrors.medicines[index]).length === 0) {
        delete newErrors.medicines[index];
      }

      return newErrors;
    });
  };

  useEffect(() => {
    groupMedicineApi();
    getGroupMedicineListApi();
    getChooseMedication();
  }, [page]);

  return (
    <div className="group_medicine">
      <Row>
        <Col lg={6}>
          <div className="left_wrap">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="searchIconWraper">
                <span className="arrow"> </span>
              </div>
            </div>
            {!isMobile ? (
              <div>
                {groupMedicines?.length > 0 ? (
                  <Accordion>
                    {groupMedicines?.map((item) => (
                      <Accordion.Item key={item.id} eventKey={item.id.toString()} className="mb-3">
                        <Accordion.Header>
                          {item.title}
                          <button onClick={() => deleteGroupMedicines(item?.id)} className="ms-auto me-2">
                            <span className="delete">
                              <DeleteOutlined />
                            </span>
                          </button>
                        </Accordion.Header>
                        <Accordion.Body>
                          <Table responsive>
                            <thead>
                              <tr>
                                <th>Medicine</th>
                                <th>Dosage</th>
                                <th>Frequency</th>
                                <th>Duration</th>
                                <th>Instruction</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {item?.medicines?.map((medicine) => (
                                <tr key={medicine.id}>
                                  <td>{medicine?.title || null}</td>
                                  <td>{`${medicine?.dosage} ${medicine?.dosage_type}` || null}</td>
                                  <td>{medicine?.frequency || null}</td>
                                  <td>{`${medicine?.duration} ${medicine?.duration_type}` || null}</td>
                                  <td>{medicine?.instruction || null}</td>
                                  <td>
                                    <div className="wrape_actions">
                                      <button>
                                        <span className="edit">
                                          <EditOutlined onClick={() => editGroupMedicineItem(medicine?.id)} />
                                        </span>
                                      </button>
                                      <button>
                                        <span className="delete" onClick={() => deleteGroupMedicineItem(medicine?.medicine_id, medicine?.med_grp_id)}>
                                          <DeleteOutlined />
                                        </span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                ) : (<p>No Group medicines available.</p>)}
              </div>
            ) : (
              <ul className='favWraperMob'>
                {groupMedicines?.map((item) => (
                  <li key={item?.id}>
                    <div className="card">
                      <div>
                        <h5>{item?.title}</h5>
                        <span>{item?.medicines_count} Medications</span>
                      </div>
                      <button onClick={handleMedicineListShow}>
                        <img src={ArrowRight} alt="" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Col>
        <Col lg={6} className="border_left">
          <div className="right_wrap">

            {isLoading ? (<Loader />) :
              (
                <>
                  <div className="add_group_medicine">
                    <h4>{isEditMode ? 'Edit Group Medicine' : 'Add Group Medicine'}</h4>
                    <button onClick={handleAddMedicine}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                        <path d="M9.0013 0C4.4013 0 0.667969 3.73333 0.667969 8.33333C0.667969 12.9333 4.4013 16.6667 9.0013 16.6667C13.6013 16.6667 17.3346 12.9333 17.3346 8.33333C17.3346 3.73333 13.6013 0 9.0013 0ZM13.168 9.16667H9.83464V12.5H8.16797V9.16667H4.83464V7.5H8.16797V4.16667H9.83464V7.5H13.168V9.16667Z" fill={themeColor} />
                      </svg> <span> Add Group Medicine</span>
                    </button>
                  </div>
                  <Divider />
                  <div className="single pb-4">
                    <Form.Label htmlFor=""> Group Name </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder=""
                      value={groupName}
                      onChange={handleChangeGroupName}
                      maxLength={50}
                    />
                    <span className='error'> {errorObj?.name} </span>
                  </div>
                  {medicinesArr?.map((medicine, index) => (
                    <div key={index}>
                      <Row>
                        <Col lg={6}>
                          <div className="single">
                            <Form.Label htmlFor=""> Choose Medication* </Form.Label>
                            <Select
                              showSearch
                              placeholder="Select the Medicines"
                              className="form-select"
                              value={medicine.medicine_id}
                              onChange={(value) => handleChangeField(index, 'medicine_id', value)}
                              filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                              }
                              onPopupScroll={handlePopupScroll}
                            >
                              {groupMedicinesList?.map((item) => (
                                <Select.Option value={item?.id} key={item?.id}>
                                  {item?.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <Form.Label for="duration">Duration*</Form.Label>
                          <Form.Group>
                            <div className="dropdown inline">
                              <Form.Control
                                type="number"
                                placeholder="00"
                                className="form-control"
                                name="duration"
                                id="duration"
                                autoComplete="off"
                                value={medicine.durationvalue}
                                onChange={(e) =>
                                  handleChangeField(index, 'durationvalue', e.target.value)
                                }
                              />
                              <Select
                                id="duration_id"
                                name="duration_id"
                                placeholder="Select the Duration"
                                className="form-select"
                                value={medicine.duration_id}
                                onChange={(value) => handleChangeField(index, 'duration_id', value)}
                              >
                                {groupDuration?.map((item) => (
                                  <Select.Option value={item?.id} key={item?.id}>
                                    {item?.title}
                                  </Select.Option>
                                ))}
                              </Select>
                            </div>
                            {errorObj.medicines?.[index]?.duration && (
                              <span className="error">{errorObj.medicines[index].duration}</span>
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <div className="single">
                            <div className="d-flex justify-content-between">
                              <Form.Label htmlFor=""> Instruction </Form.Label>
                              <button className="custom">Custom</button>
                            </div>
                            <Select
                              id="instruction_id"
                              name="instruction_id"
                              placeholder="Select the Instruction"
                              className="form-select"
                              value={medicine.meal_id}
                              onChange={(value) => handleChangeField(index, 'meal_id', value)}
                            >
                              {groupInstruction?.map((item) => (
                                <Select.Option value={item?.id} key={item?.id}>
                                  {item?.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <Form.Label for="dosage">Dosage*</Form.Label>
                          <Form.Group>
                            <div className="dropdown inline">
                              <Form.Control
                                type="number"
                                placeholder="00"
                                className="form-control"
                                name="dosage"
                                id="dosage"
                                value={medicine.dosagevalue}
                                onChange={(e) =>
                                  handleChangeField(index, 'dosagevalue', e.target.value)
                                }
                                autoComplete="off"
                              />
                              <Select
                                id="dosage_id"
                                name="dosage_id"
                                placeholder="Select the Dosage"
                                className="form-select"
                                value={medicine.dosage_id}
                                onChange={(value) => handleChangeField(index, 'dosage_id', value)}
                              >
                                {groupDosage?.map((item) => (
                                  <Select.Option value={item?.id} key={item?.id}>
                                    {item?.title}
                                  </Select.Option>
                                ))}
                              </Select>
                            </div>
                            {errorObj.medicines?.[index]?.dosage && (
                              <span className="error">{errorObj.medicines[index].dosage}</span>
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <div className="single">
                            <div className="d-flex justify-content-between">
                              <Form.Label htmlFor=""> Frequency </Form.Label>
                              <button className="custom"> Custom</button>
                            </div>
                            <Select
                              id="frequency_id"
                              name="frequency_id"
                              placeholder="Select the Frequency"
                              className="form-select"
                              value={medicine.frequency_id}
                              onChange={(value) => handleChangeField(index, 'frequency_id', value)}
                            >
                              {groupFrequency?.map((item) => (
                                <Select.Option value={item?.id} key={item?.id}>
                                  {item?.title}
                                </Select.Option>
                              ))}
                            </Select>
                          </div>
                        </Col>
                      </Row>
                      <Divider className='mt-4' />
                    </div>
                  ))}
                </>
              )
            }
            <div className="form_btn">
              {!isEditMode ? (
                <button className="button1" onClick={addGroupMedicine}>
                  Save
                </button>
              ) : (
                <button className="button1" onClick={() => updateGroupMedicine(editGroup?.id)}>
                  Update
                </button>
              )}
            </div>
          </div>
        </Col>
        <div className="box-fixed">
          <button className="button2" onClick={handleGroupMedicineShow}>
            ADD GROUP
          </button>
        </div>
      </Row>
      <GroupMedicineModal
        handleGroupMedicineClose={handleGroupMedicineClose}
        addGroup={addGroup}
        handleAddMedicine={handleAddMedicine}
        addMedicineMore={addMedicineMore}
      />
      <MedicineListModal
        handleMedicineListClose={handleMedicineListClose}
        medicineList={medicineList}
      />
    </div>
  );
};

export default GroupMedicine;