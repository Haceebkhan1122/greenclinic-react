/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Col, Form, Modal, Row } from "react-bootstrap"
import { DatePicker, Divider } from "antd";
import API from "../../../services/httpInstance";
import { toast } from "react-toastify";
import "./addExpenseModal.scss"
import dayjs from "dayjs";

const AddExpenseModal = ({ showAdd, handleAddClose, getExpenses, categoriesData, paymentData }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("");
    const [payment, setPayment] = useState("");
    const [amount, setAmount] = useState("");

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "desc") {
            setDesc(value)
        }
        if (name == "category") {
            setCategory(value)
        }
        if (name == "payment") {
            setPayment(value)
        }
        if (name == "amount") {
            setAmount(value)
        }
    }

    const handleDateChange = (date, dateString) => {
        let formatDate = dayjs(date).format('YYYY-MM-DD')
        setSelectedDate(formatDate)
    }

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const response = await API.post(`/add-expense`, {
                amount,
                payment,
                expense_category: category,
                desc,
                date: selectedDate,
            });
            if (response?.status == 200) {
                getExpenses()
                setIsLoading(false);
                toast.success(response?.data?.message)
                setPayment("")
                setAmount("")
                setDesc("")
                setCategory("")
                setSelectedDate("")
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

    return (
        <Modal show={showAdd} onHide={handleAddClose} centered className="modalExpense">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleAddClose}> </span>
                <div className="wraper_add_modal">
                    <h2> <span className="plusAdd"></span> Add </h2>
                    <div className="single customInp">
                        <label htmlFor=""> Description </label>
                        <input type='text' placeholder='' className="descrInpt" name="desc" value={desc} onChange={handleChange} />
                    </div>
                    <div className="wrape_cl">
                        <label htmlFor="openDate"> Date </label>
                        <div className="wraper_dateExpense">
                            <span className='calenderIcon'> </span>
                            <DatePicker id={"openDate"} placeholder="Select Start"  name='dob' onChange={handleDateChange} />
                        </div>
                    </div>
                    <div className="single_field customSelect">
                        <label htmlFor=""> Select Category </label>
                        <Form.Select aria-label="Default select example" name="category" value={category} onChange={handleChange} className='filter'  >
                            <option value={""}>  Select Category </option>
                            {categoriesData?.map((item) => {
                                return (<>
                                    <option value={item?.id} > {item?.category} </option>
                                </>)
                            })}
                        </Form.Select>
                    </div>
                    <div className="single_field customSelect">
                    <label htmlFor=""> Select Payments </label>
                        <Form.Select aria-label="Default select example" name="payment" value={payment} onChange={handleChange} className='filter'  >
                            <option value={""} >  Payment Method </option>
                            {paymentData?.paymentMethod?.map((item, index) => (
                                <option key={index} value={item?.id}>
                                    {item?.title}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                    <div className="single customInp">
                        <label htmlFor=""> Amount </label>
                        <input type='number' placeholder='Amount' className="descrInpt" name="amount" value={amount} onChange={handleChange} />
                    </div>
                    <button className='saveBtn' onClick={handleSave}> Save </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default AddExpenseModal