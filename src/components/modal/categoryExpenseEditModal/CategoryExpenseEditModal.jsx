import React, { useEffect, useState } from 'react'
import { Form, Modal } from "react-bootstrap"
import "./categoryExpenseEditModal.scss"
import { Divider } from 'antd'
import { toast } from 'react-toastify'
import API from '../../../services/httpInstance'
import { isMobile } from 'react-device-detect'

const ExpenseAddCategoryEditModal = ({ expenseEditShow, handleExpenseEditCategoryClose, editSingleItem, getCategories }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0)
    const [category, setCategory] = useState("")
    const [id, setId] = useState(null)

    useEffect(() => {
        if (editSingleItem){
            setStatus(editSingleItem?.status)
        }
    }, [editSingleItem])

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await API.post(`/add-expense-category`, {
                id,
                expense_category: category,
                status,
            });
            if (response?.status == 200) {
                setIsLoading(false);
                toast.success(response?.data?.message)
                setCategory("")
                handleExpenseEditCategoryClose();
                getCategories();
                setStatus(0)
            }
            else {
                setIsLoading(false);
                toast.error(response?.data?.message)
            }
        }
        catch (error) {
            console.log(error)
            toast.error("error in adding")
            setIsLoading(false);
        }
    }



    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "category") {
            setCategory(value)
        }
        if (name === "status") {
            setStatus(checked ? 1 : 0);
        }
    }

    useEffect(() => {
        if (editSingleItem) {
            setCategory(editSingleItem?.category);
            setId(editSingleItem?.id);
        }
    }, [expenseEditShow])


    return (
        <Modal show={expenseEditShow} onHide={handleExpenseEditCategoryClose} centered className="modalExpenseCateogory">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleExpenseEditCategoryClose}></span>
                <h2> {isMobile ? "Update Category" : "Edit  Category"} </h2>
                <Divider />
                <div className="single customInp">
                    <label htmlFor=""> Category* </label>
                    <input type="text" placeholder="Enter category" name="category" value={category} onChange={handleChange} />
                </div>
                <div className="single customCheck">
                    <label htmlFor="custom-switch"> Active </label>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        name="status"
                        checked={status === 1} // Ensure state reflects the toggle status
                        onChange={handleChange}
                    />
                </div>
                <div className="wraper_btns">
                    <button className='button2' onClick={handleSave}> Save </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ExpenseAddCategoryEditModal;