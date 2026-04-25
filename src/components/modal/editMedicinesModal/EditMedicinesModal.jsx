import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { Divider } from "antd";
import './editMedicinesModal.scss';
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";

const EditMedicineModal = ({ showEdit, setIsLoading, handleCloseEdit,   editMedicines, vendorList, medicineListApi, setMedicineList }) => {
    const [medicineName, setMedicineName] = useState('')
    const [vendor, setVendor] = useState();

    const handleVendorData = (e) => {
        setVendor(e.target.value)
    }

    useEffect(() => {
        if (editMedicines) {
            setMedicineName(editMedicines?.med_name || '');
            setVendor(editMedicines?.vendor_id || '');
        }
    }, [editMedicines])

    const handleEditMedicines = async () => {

        const payload = {
            id: editMedicines?.id,
            title: medicineName,
            vendor_id: vendor,
        }               
        try {
            setIsLoading(true)
            const response = await API.post(`/add-med`, payload)
            if (response.status == 200) {
            setIsLoading(false)
                toast.success(response?.data?.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
                medicineListApi();
                handleCloseEdit(false)
            }
        } catch (error) {
            setIsLoading(false)
            console.log(error)
        }
    }

    return (
        <Modal show={showEdit} onHide={handleCloseEdit} centered className="modalEditMedicine">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseEdit}></span>
                <h2> Edit Medicine </h2>
                <Divider />
                <div className="single customInp position-relative">
                    <label htmlFor=""> Medicine Name* </label>
                    <input type="text" value={medicineName} onChange={(e) => setMedicineName(e.target.value)} placeholder="Enter field name" />
                </div>
                <div className="single_field customSelect">
                    <label htmlFor=""> Vendor* </label>
                    <Form.Select onChange={handleVendorData} id={vendor?.id} value={vendor}>
                        {vendorList?.map((item) => (
                            <option value={item.id} key={item.id}>{item?.name}</option>
                        ))}
                    </Form.Select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className="wraper_btns">
                    <button onClick={handleCloseEdit}> CANCEL </button>
                    <button onClick={handleEditMedicines}> Update </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default EditMedicineModal;
