import { Col, Form, Row, Table } from 'react-bootstrap';
import './medicines.scss'
import { useEffect, useState } from 'react';
import AddMedicinesModal from '../../modal/addMedicinesModal/AddMedicinesModal';
import DeleteMedicinesModal from '../../modal/deleteMedicinesModal/DeleteMedicinesModal';
import EditMedicineModal from '../../modal/editMedicinesModal/EditMedicinesModal';
import { isMobile } from 'react-device-detect';
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import { useMediaQuery } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/fontawesome-free-solid';
import Loader from '../../loader/Loader';
import { useSelector } from 'react-redux';

const Medicines = () => {
  let userData = useSelector((state) => state.user.user);
  let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
  let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
  const [medicineShow, setMedicineShow] = useState(false);
  const [medicineList, setMedicineList] = useState([])
  const [medicineDelete, setMedicineDelete] = useState({});
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredMedicineList, setFilteredMedicineList] = useState([])
  const [vendorList, setVendorList] = useState([]);
  const [siUnitList, setSiUnitList] = useState([]);
  const [editMedicines, setEditMedicines] = useState({});
  const [pharma, setPharma] = useState(null);
  const [indicationMessage, setIndicationMessage] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState("1");
  const [paginateCountData, setPaginateCountData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleParmaChange = async (e) => {
    const payload = { pharma_on: e.target.checked ? 1 : 0 };

    setPharma(e.target.checked ? 1 : 0);

    try {
      const response = await API.post('/pharma-check', payload);

      if (response.status === 200) {
        setPharma(response?.data?.data?.pharma_on);

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
  };


  useEffect(() => {
    if (pharma !== undefined) {
      localStorage.setItem('pharma', JSON.stringify(pharma));
    }
  }, [pharma]);

  const handleSearchQuery = (e) => {
    const search = e.target.value
    setSearchQuery(search)
  }

  const medicineListApi = async (pageNumber) => {
    try {
      setIsLoading(true);
      const response = await API.get("/med-setting-listing", {
        params: {
          page: pageNumber,
        }
      })
      if (response?.status == 200) {
        const calculatedTotalPages = Math.ceil(response?.data?.data?.pagination?.total / response?.data?.data?.pagination?.per_page);
        setTotalPages(calculatedTotalPages);
        setMedicineList(response?.data?.data?.med)
        setFilteredMedicineList(response?.data?.data?.med)
        setPaginateCountData(response?.data?.data?.pagination)
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  // get vendor api
  const vendorListApi = async () => {
    try {
      const response = await API.get("/vendor-list")
      if (response.status == 200) {
        setVendorList(response?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // get si unit api
  const siUnitListApi = async () => {
    try {
      const response = await API.get("/medicine-dropdown")
      if (response.status == 200) {
        setSiUnitList(response?.data?.data?.dosage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    medicineListApi(currentPage);
    vendorListApi()
    siUnitListApi()
  }, [])


  useEffect(() => {
    if (currentPage !== 1) {
      medicineListApi(currentPage);
    }
  }, [currentPage]);


  useEffect(() => {
    if (searchQuery === '') {
      setFilteredMedicineList(medicineList);
    } else {
      const filtered = medicineList.filter((item) =>
        item?.med_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedicineList(filtered);
    }
  }, [searchQuery, medicineList]);

  const handleMedicineClose = () => setMedicineShow(false);
  const handleMedicineShow = () => setMedicineShow(true);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (item) => {
    setEditMedicines(item?.id)
    setEditMedicines(item)
    setShowEdit(true)
  };

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (item) => {
    setMedicineDelete(item?.id)
    setShowDelete(true)
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

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
      <div className='medicinesTab'>
        {isMobile ?
          (<>
            <div className="search__bar">
              <span className='search_icon'>  </span>
              <input type="text" placeholder='Search for appointment' />
            </div>
            <div className="cardRoleWraper">
              <div className="field_check customCheck">
                <label htmlFor=""> Pharma guide on </label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  name="pharma"
                  onChange={handleParmaChange}
                  defaultChecked={userData?.pharma_guide == 1}
                />
              </div>
              {isLoading ? <Loader /> : (
                filteredMedicineList?.map((item) => (
                  <div className="singleCardRole" key={item?.id}>
                    <h4>{item?.med_name}</h4>
                    <div className='wrapeActionMyReq'>
                      <p>{item?.venodor_name}</p>
                      <div className="wrape_actions">
                        <span className="deleteIcon" onClick={() => handleShowDelete(item)}></span>
                        <span className="editIcon" onClick={() => handleShowEdit(item)}></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>)
          : (<>
            <div className="top">
              <Row>
                <Col lg={7}>
                  <div className="field_check customCheck">
                    <label htmlFor=""> Pharma guide on </label>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      name="pharma"
                      onChange={handleParmaChange}
                      defaultChecked={userData?.pharma_guide == 1}
                    />
                  </div>
                </Col>
                <Col lg={3}>
                  <div className="search-bar">
                    <span className="ico"></span>
                    <input type="text" placeholder='Search medicine' value={searchQuery} onChange={handleSearchQuery} />
                  </div>
                </Col>
                {allowedPermissions["add_medicine_add"] && <Col lg={2}>
                  <button onClick={handleMedicineShow}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M11.1911 13.0096H4.33398V10.7238H11.1911V3.8667H13.4768V10.7238H20.334V13.0096H13.4768V19.8667H11.1911V13.0096Z" fill={themeColor} />
                  </svg> Add Medicine </button>
                </Col>}
              </Row>
            </div>
            <div className="table__wrape">
              <Table>
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Vendor</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicineList?.length > 0 ? (
                    filteredMedicineList?.map((item) => (
                      <tr key={item?.id}>
                        <td>{item?.med_name}</td>
                        <td>{item?.venodor_name}</td>
                        <td>
                          <div className="wrape_actions">
                            {allowedPermissions["add_medicine_delete"] && <span className="deleteIcon" onClick={() => handleShowDelete(item)}></span>}
                            {allowedPermissions["add_medicine_edit"] && <span className="editIcon" onClick={() => handleShowEdit(item)}></span>}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className='text-center p-5 border-0'>No data available in table</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <div className='boxBtn'>
              {totalPages > 1 ? (
                <>
                  <div className='countPagination'>
                    {paginateCountData?.from} - {paginateCountData?.to} of {paginateCountData?.total}
                    {paginateCountData?.total}
                  </div>
                  <ReactPaginate
                    previousLabel={<FontAwesomeIcon icon={faChevronLeft} />}
                    nextLabel={<FontAwesomeIcon icon={faChevronRight} />}
                    breakLabel={null}
                    pageCount={totalPages}
                    pageRangeDisplayed={0}
                    marginPagesDisplayed={0}
                    onPageChange={handlePageClick}
                    containerClassName="pagination_hk"
                    previousClassName="prev_item"
                    nextClassName="next_item"
                    previousLinkClassName="previousLink"
                    nextLinkClassName="medical_next_link"
                    forcePage={currentPage - 1}
                    renderOnZeroPageCount={null}
                  />
                </>
              ) : null}
            </div>
          </>)}
        <AddMedicinesModal medicineListApi={medicineListApi} setIndicationMessage={setIndicationMessage} indicationMessage={indicationMessage} medicineShow={medicineShow} handleMedicineClose={handleMedicineClose} vendorList={vendorList}  siUnitList={siUnitList} />
        <DeleteMedicinesModal handleCloseDelete={handleCloseDelete} showDelete={showDelete} medicineDelete={medicineDelete} medicineListApi={medicineListApi} setMedicineList={setMedicineList} setFilteredMedicineList={setFilteredMedicineList} />
        <EditMedicineModal setIsLoading={setIsLoading} medicineListApi={medicineListApi} showEdit={showEdit} handleCloseEdit={handleCloseEdit} editMedicines={editMedicines} vendorList={vendorList} setMedicineList={setMedicineList} />
      </div>
      <div className="bottomBarMobBtn">
        <button onClick={handleMedicineShow}> ADD MEDICINE </button>
      </div>
    </>
  )
}

export default Medicines;