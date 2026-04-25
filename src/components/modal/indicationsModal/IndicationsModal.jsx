import React from 'react'
import { Modal } from 'react-bootstrap'
import './indicationsModal.scss';

const IndicationsModal = ({ show,
  handleClose,
  searchQuery,
  setSearchQuery,
  modalData,
  heading,
  addNewKeyword,
  selectDiagnosis,
  setSelectDiagnosis,
  patientData,
  patientId,
  inclinationChecked,
  historyChecked
}) => {

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };
  // const handleCheckboxChange = (item) => {
  //   if (selectDiagnosis.includes(item?.id)) {

  //     setSelectDiagnosis((prevSelected) => prevSelected.filter((selectedId) => selectedId !== item?.id));
  //   } else {
  //     setSelectDiagnosis((prevSelected) => [...prevSelected, item?.id]);
  //   }
  // };

  const handleCheckboxChange = (item) => {
    setSelectDiagnosis((prevSelected) => {
      if (!Array.isArray(prevSelected)) prevSelected = [];

      const isAlreadySelected = prevSelected.some((selectedItem) => selectedItem.diagnosis_id == item.id);

      if (isAlreadySelected) {
        return prevSelected.filter((selectedItem) => selectedItem.diagnosis_id !== item.id);
      } else {
        return [
          ...prevSelected,
          {
            patient_id: patientId,
            doctor_id: patientData?.doctor_id,
            clinic_id: patientData?.clinic_id,
            appointment_id: patientData?.appointment_id,
            diagnosis_id: item.id,
            status: heading == 'Indications' ? 1 : 0,
          },
        ];
      }
    });
  };

  return (
    <Modal show={show} centered onHide={handleClose} className='indicationsModal modalIND' backdropClassName="custom-backdrop">
      <Modal.Body>
        <span className='cross' onClick={handleClose}></span>
        <div className="wraper_indicationModal">
          <h3>{heading} </h3>
          <div className="search-bar">
            <span className="ico"></span>
            <input
              onChange={(e) => handleSearchQuery(e)}
              value={searchQuery}
              type="text"
              placeholder='Search'
            />
          </div>
          <ul>
            {modalData?.map((item) => {
              const isIndications = heading == "Indications";
              const checkedList = isIndications ? inclinationChecked : historyChecked;

              const isPreChecked = Array.isArray(checkedList) && checkedList.includes(item.id);
              const isUserSelected = Array.isArray(selectDiagnosis) && selectDiagnosis.some((selectedItem) => selectedItem.diagnosis_id == item.id);

              return (
                <li key={item?.id}>
                  <div className="single customRadioo">
                    <div className="wrapeInp">
                      <input
                        type="checkbox"
                        id={`item-${item?.id}`}
                        checked={isPreChecked || isUserSelected}
                        onChange={() => handleCheckboxChange(item)}
                      />
                      <label htmlFor={`item-${item?.id}`}> {item?.title} </label>
                      <span></span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="btDo tw-w-full tw-flex tw-justify-end tw-items-center">
            <button onClick={addNewKeyword}> Done </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default IndicationsModal;
