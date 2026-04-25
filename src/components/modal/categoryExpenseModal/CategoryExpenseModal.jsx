import React, { useState } from 'react'
import { Form, Modal } from "react-bootstrap"
import "./categoryExpenseModal.scss"
import { Divider } from 'antd'
import { toast, ToastContainer } from 'react-toastify'
import API from '../../../services/httpInstance'


const ExpenseAddCategoryModal = ({ expenseAddCategoryshow, handleExpenseAddCategoryClose, getCategories }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(0)
    const [category, setCategory] = useState("")
    const [categoryError, setCategoryError] = useState("")


    const handleSave = async () => {
        setCategoryError("")
        if (category == "") {
            setCategoryError("Field is required")
        } else {
            try {
                setIsLoading(true);
                const response = await API.post(`/add-expense-category`, {
                    expense_category: category,
                    status,
                });
                if (response?.status == 200) {
                    setIsLoading(false);
                    toast.success(response?.data?.message)
                    setCategory("")
                    handleExpenseAddCategoryClose();
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

    }


    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "category") {
            setCategory(value)
        }
        if (name == "status") {
            if (checked) {
                setStatus(1)
            }
            else {
                setStatus(0)
            }
        }
    }

    return (
        <>
            <Modal show={expenseAddCategoryshow} onHide={handleExpenseAddCategoryClose} centered className=" modalExpenseCateogory">
                <Modal.Body>
                    <span className="crossBtnModal" onClick={handleExpenseAddCategoryClose}></span>
                    <h2> Add Category </h2>
                    <Divider />
                    <div className="single customInp">
                        <label htmlFor=""> Category* </label>
                        <input type="text" placeholder="Enter category" name="category" value={category} onChange={handleChange} />
                        <p className='error_category'>{categoryError}</p>
                    </div>
                    <div className="single customCheck">
                        <label htmlFor=""> Active </label>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            name="status"
                            value={status}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="wraper_btns">
                        <button className='button2' onClick={handleSave}> Save </button>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    )
}

export default ExpenseAddCategoryModal;