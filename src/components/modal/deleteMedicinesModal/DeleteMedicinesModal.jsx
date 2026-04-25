import { Form, Modal, Row } from "react-bootstrap"
import './deleteMedicinesModal.scss';
import { useEffect, useState } from "react";
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";

const DeleteMedicinesModal = ({ handleCloseDelete, showDelete, medicineListApi, medicineDelete, setMedicineList, setFilteredMedicineList }) => {

    const deleteMedincine = async () => {
        if (medicineDelete) {
            try {
                const response = await API.delete(`/delete-meds?id=${medicineDelete}`);
                if (response.status == 200) {
                    toast.success(response?.data?.message, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    handleCloseDelete();
                    // setMedicineList((prevList) => prevList.filter((item) => item.id !== medicineDelete));
                    // setFilteredMedicineList((prevList) => prevList.filter((item) => item.id !== medicineDelete));

                    await medicineListApi();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    return (
        <Modal show={showDelete} onHide={handleCloseDelete} centered className="modalDeleteMedicines">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseDelete}></span>
                <h2> Are you sure you want to delete this medicine? </h2>
                <div className="wraper_btns">
                    <button onClick={handleCloseDelete}> NO </button>
                    <button onClick={deleteMedincine}> YES </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteMedicinesModal