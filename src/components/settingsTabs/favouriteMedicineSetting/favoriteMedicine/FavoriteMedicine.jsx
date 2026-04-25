import React, { useEffect, useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { DeleteOutlined } from '@ant-design/icons';
import { Divider, Select } from 'antd';
import { isMobile } from 'react-device-detect';
import NewFavoriteMedicineModal from '../../../modal/newFavoriteMedicineModal/NewFavoriteMedicineModal';
import API from '../../../../services/httpInstance';
import Loader from '../../../loader/Loader';
import "./favoriteMedicine.scss"
import { toast } from 'react-toastify';
import { useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux';

const FavoriteMedicine = () => {

  const [searchFavoriteMedicines, setSearchFavoriteMedicines] = useState('')
  const [addMedicine, setAddMedicine] = useState(false)
  const [favoriteMedicine, setFavoriteMedicine] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteTitle, setFavoriteTitle] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  const [favoriteDuration, setFavoriteDuration] = useState([]);
  const [favoriteDosage, setFavoriteDosage] = useState([]);
  const [favoriteFrequency, setFavoriteFrequency] = useState([]);
  const [favoriteInstruction, setFavoriteInstruction] = useState([]);
  const [medicineId, setMedicineId] = useState(null)
  const [dosage, setDosage] = useState('')
  const [dosage_id, setDosageId] = useState(null)
  const [page, setPage] = useState(1);
  const [duration, setDuration] = useState('')
  const [dosageTitle, setDosageTitle] = useState('');
  const [durationTitle, setDurationTitle] = useState('');
  const [duration_id, setDurationId] = useState(null)
  const [frequency_id, setFrequencyId] = useState('')
  const [meal, setMeal] = useState('')
  const [mealId, setMealId] = useState('')
  const [frequency_title, setFrequencyTitle] = useState('')
  const [errorObj, setErrorObj] = useState({})
  const isMobile = useMediaQuery('(max-width:767px)');

  const [allowedPermissions, setAllowedPermissions] = useState({});
  let userPermissions = useSelector((state) => state.clinic.userPermissions);

  useEffect(() => {
    const viewPermission = userPermissions?.find((item) => item.slug === "add_medicine_view");
    const childPermissions = viewPermission?.child || [];
    const perms = {};
    childPermissions.forEach(child => {
      perms[child.slug] = true;
    });
    setAllowedPermissions(perms);
  }, [userPermissions]);

  const handleMedicineShow = () => {
    setAddMedicine(true)
  }
  const handleMedicineClose = () => setAddMedicine(false)

  // Favorite Medicine Api
  const getFavoriteMedicineApi = async () => {
    try {
      const response = await API.get(`/all-fav-med-setting?search=${searchFavoriteMedicines}`)
      if (response.status == 200) {
        setFavoriteMedicine(response?.data?.data)
      } 
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearchQuery = (e) => {
    const search = e.target.value
    setSearchFavoriteMedicines(search)
  }

  const handleChangeMedicineId = (value) => {
    const selectedMedicine = medicinesList?.find((item) => item?.id === value);

    if (selectedMedicine) {
      errorObj.medicine = ""
      setMedicineId(value);
      setFavoriteTitle(selectedMedicine?.title);
    }
  };

  const handleChangeDuration = (event) => {
    errorObj.duration_id = ""
    if (event.target.value.length <= 7) {
      setDuration(event.target.value);
    }
  };

  const handleChangeDurationId = (value) => {
    const selectedDuration = favoriteDuration.find(item => item.id === value);

    if (selectedDuration) {
      setDurationId(value);
      setDurationTitle(selectedDuration.title);
    }
  };

  const handleChangeDosage = (e) => {
    errorObj.dosage = ""
    if (e.target.value.length <= 7) {
      setDosage(e.target.value);
    }
  };

  const handleChangeDosageId = (value) => {
    const selectedDosage = favoriteDosage.find(item => item.id === value);

    if (selectedDosage) {
      setDosageId(value);
      setDosageTitle(selectedDosage.title);
    }
  };

  const handleChangeMeal = (value) => {
    const selected = favoriteInstruction.find(item => item.id === value);
    if (selected) {
      setMealId(value);
      setMeal(selected.title);
    }
  };

  const handleChangeFrequency = (value) => {
    const selected = favoriteFrequency.find(item => item.id === value);
    if (selected) {
      setFrequencyId(value);
      setFrequencyTitle(selected.title);
    }
  };

  // Favorite Medicine List Api
  const getFavoriteMedicineListApi = async () => {
    try {
      const response = await API.get("/medicine-dropdown")
      if (response.status == 200) {
        // setFavoriteMedicines(response?.data?.data?.medicines)
        setFavoriteDuration(response?.data?.data?.duration)
        setFavoriteDosage(response?.data?.data?.dosage)
        setFavoriteInstruction(response?.data?.data?.instruction)
        setFavoriteFrequency(response?.data?.data?.frequency)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getChooseMedication = async () => {
    try {
      const response = await API.get(`/medicine-list?page=${page}`);
      if (response.status == 200) {
        const newMedicines = response?.data?.data?.medicines || [];
        setMedicinesList(prevList => [...prevList, ...newMedicines]);
      }
    } catch (error) {
      toast.error('Failed to fetch medicine list. Please try again later.');
    }
  };

  const handlePopupScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Delete Favorite Medicines API
  const deleteFavoriteMedicines = async (id) => {
    const updatedMedicines = favoriteMedicine.filter((item) => item.id !== id);
    setFavoriteMedicine(updatedMedicines);
    try {
      const response = await API.delete(`/delete-fav-medicine-setting/${id}`)
      if (response.status == 200) {
        setFavoriteMedicine((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Add Favorite Medicine Api
  const addFavoriteMedicine = async () => {
    let errors = {};
    const payload = {
      medicine_id: medicineId,
      medicine_title: favoriteTitle,
      dosage: dosage,
      dosage_type: dosageTitle,
      dosage_id: dosage_id,
      duration: duration,
      duration_id: duration_id,
      duration_type: durationTitle,
      meal_id: mealId,
      meal: meal,
      frequency_id: frequency_id,
      frequency: frequency_title
    };

    if (!medicineId) errors.medicine = "Medicine is required"
    if (!duration) errors.duration = "Duration required"
    if (!dosage) errors.dosage = "Dosage is required"

    try {
      const response = await API.post("/add-fav-med-setting", payload);
      if (response.status == 200) {
        await getFavoriteMedicineApi();

        setMedicineId('');
        setDosage('');
        setFavoriteTitle('');
        setDosageId('');
        setDuration('');
        setDurationId('');
        setFrequencyId('');
        setMeal('');
        setMealId('');
        setFrequencyTitle('');
        handleMedicineClose(false)
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

  useEffect(() => {
    getFavoriteMedicineApi()
    getFavoriteMedicineListApi()
  }, [searchFavoriteMedicines])

  useEffect(() => {
    getChooseMedication();
  }, [page]);

  return (
    <>
      {isLoading ? <Loader /> :
        (
          <div className='favorite_medicine'>
            <Row>
              <Col lg={6}>
                <div className="left_wrap">
                  <div className="search-bar">
                    <input type="text" placeholder='Search' value={searchFavoriteMedicines} onChange={handleSearchQuery} />
                    <div className="searchIconWraper">
                      <span className='arrow'>  </span>
                    </div>
                  </div>
                  {!isMobile ? (
                    <div>
                      {favoriteMedicine?.length > 0 ? (
                        favoriteMedicine.map((item) => (
                          <div className='card' value={item?.id} key={item?.id}>
                            <h5>{item?.title}</h5>
                            <button onClick={() => deleteFavoriteMedicines(item.id)}>
                              <span className="delete"><DeleteOutlined /></span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No favorite medicines available.</p>
                      )}
                    </div>
                  ) : (
                    <div className='favWraperMob'>
                      {favoriteMedicine?.length > 0 ? (
                        favoriteMedicine?.map((item) => (
                          <div className='card' value={item?.id} key={item?.id}>
                            <h5>{item?.title}</h5>
                            <button onClick={() => deleteFavoriteMedicines(item.id)}>
                              <span className="delete"><DeleteOutlined /></span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p>No favorite medicines available.</p>
                      )}
                    </div>
                  )}
                </div>
              </Col>
              {allowedPermissions["add_medicine_add"] && <Col lg={6} className='border_left'>
                <div className="right_wrap">
                  <h4>New Medication</h4>
                  <Divider />
                  <Row>
                    <Col lg={6}>
                      <div className="single">
                        <Form.Label htmlFor=""> Choose Medication* </Form.Label>
                        <Select
                          showSearch
                          placeholder="Select the Medicines"
                          className="form-select"
                          value={medicineId}
                          onChange={handleChangeMedicineId}
                          filterOption={(input, option) =>
                            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
                          }
                          onPopupScroll={handlePopupScroll}
                        >
                          {medicinesList?.map((item) => (
                            <Option value={item?.id} key={item?.id}>
                              {item?.title}
                            </Option>
                          ))}
                        </Select>
                        <span className='error'> {errorObj.medicine} </span>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <Form.Label for="duration">Duration*</Form.Label>
                      <Form.Group>
                        <div className="dropdown inline">
                          <Form.Control type="number" placeholder='00' maxLength="3" className="form-control" name="duration" id="duration" onChange={handleChangeDuration} value={duration} autoComplete="off" />
                          <Select id="duration_id" name="duration_id"
                            placeholder="Select the Duration"
                            className='form-select'
                            value={duration_id}
                            onChange={handleChangeDurationId}>
                            {favoriteDuration?.map((item) => (
                              <option key={item?.id} value={item?.id}>{item?.title}</option>
                            ))}
                          </Select>
                        </div>
                        <span className='error'> {errorObj?.duration_id} </span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <div className="single">
                        <div className='d-flex justify-content-between'>
                          <Form.Label htmlFor=""> Instruction </Form.Label>
                          <button className='custom'>
                            Custom
                          </button>
                        </div>
                        <Select id="instruction_id" name="instruction_id"
                          placeholder="Select the Instruction"
                          className='form-select'
                          value={mealId}
                          onChange={handleChangeMeal}>
                          {favoriteInstruction?.map((item) => (
                            <option value={item?.id}>{item?.title}</option>
                          ))}
                        </Select>
                        {/* <Form.Control type="text" value={meal} onChange={handleChangeMeal} placeholder="" /> */}
                      </div>
                      <span className='error'> {errorObj?.instruction} </span>
                    </Col>
                    <Col lg={6}>
                      <Form.Label for="dosage">Dosage*</Form.Label>
                      <Form.Group>
                        <div className="dropdown inline">
                          <Form.Control type="text" placeholder='00' maxLength="7" className="form-control" value={dosage} onChange={handleChangeDosage} name="dosage" id="dosage" autoComplete="off" />
                          <Select id="dosage_id" name="dosage_id"
                            placeholder="Select the Dosage"
                            className='form-select'
                            value={dosage_id}
                            onChange={handleChangeDosageId}>
                            {favoriteDosage?.map((item) => (
                              <option value={item?.id}>{item?.title}</option>
                            ))}
                          </Select>
                        </div>
                        <span className='error'> {errorObj?.dosage} </span>
                      </Form.Group>
                    </Col>
                    <Col lg={6}>
                      <div className="single">
                        <div className='d-flex justify-content-between'>
                          <Form.Label htmlFor=""> Frequency </Form.Label>
                          <button className='custom'>
                            Custom
                          </button>
                        </div>
                        <Select id="frequency_id" name="frequency_id"
                          placeholder="Select the Frequency"
                          className='form-select'
                          value={frequency_title}
                          onChange={handleChangeFrequency}>
                          {favoriteFrequency?.map((item) => (
                            <option key={item?.id} value={item?.id}>
                              {item?.title}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </Col>
                  </Row>
                  <div className="form_btn">
                    <button className='button1' onClick={addFavoriteMedicine}>Save</button>
                  </div>
                </div>
              </Col>}
              <div className="box-fixed">
                <button className='button2' onClick={handleMedicineShow}>ADD MEDICINE</button>
              </div>
            </Row>
            <NewFavoriteMedicineModal
              handleMedicineClose={handleMedicineClose}
              addMedicine={addMedicine}
              frequency_title={frequency_title}
              handleChangeFrequency={handleChangeFrequency}
              handleChangeMedicineId={handleChangeMedicineId}
              medicineId={medicineId}
              medicinesList={medicinesList}
              favoriteDuration={favoriteDuration}
              favoriteFrequency={favoriteFrequency}
              addFavoriteMedicine={addFavoriteMedicine}
              handlePopupScroll={handlePopupScroll}
              handleChangeDosageId={handleChangeDosageId}
              handleChangeDosage={handleChangeDosage}
              favoriteDosage={favoriteDosage}
              dosage_id={dosage_id}
              handleChangeDuration={handleChangeDuration}
              handleChangeDurationId={handleChangeDurationId}
              favoriteInstruction={favoriteInstruction}
              handleChangeMeal={handleChangeMeal}
              mealId={mealId}
              duration_id={duration_id}
            />
          </div >
        )
      }
    </>
  )
}

export default FavoriteMedicine