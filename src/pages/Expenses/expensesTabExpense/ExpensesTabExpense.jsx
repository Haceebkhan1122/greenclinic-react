import { DatePicker } from 'antd';
import { Col, Form, Row, Table } from 'react-bootstrap';
import Search from "../../../assets/images/svg/search.svg"
import WraperLayout from '../../../components/wraperLayout/WraperLayout';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Divider } from 'antd';
import './expensesTabExpense.scss';
import API from '../../../services/httpInstance';
import { toast, ToastContainer } from 'react-toastify';
import DeleteExpenseModal from '../../../components/modal/deleteExpenseModal/DeleteExpenseModal';
import { isMobile } from 'react-device-detect';
import AddExpenseModal from '../../../components/modal/addExpenseModal/AddExpenseModal';
import EditExpenseModal from '../../../components/modal/editExpenseModal/EditExpenseModal';
import { useSelector } from 'react-redux';
import moment from 'moment/moment';

const ExpensesTabExpense = ({ categoriesData, getCategories }) => {
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [expensesData, setExpensesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState({})
    const [desc, setDesc] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [category, setCategory] = useState("");
    const [payment, setPayment] = useState("");
    const [amount, setAmount] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showEditExpense, setShowEditExpense] = useState(false);
    const [singleDeleteItem, setSingleDeleteItem] = useState(null);
    const [singleAddItem, setSingleAddItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [toastHider, setToastHider] = useState(false);

    const handleDeleteShow = (item) => {
        setSingleDeleteItem(item)
        setShowDelete(true)
    }

    const handleDeleteClose = () => {
        setShowDelete(false)
    }


    const handleAddShow = (item) => {
        setShowAdd(true)
    }

    const handleAddClose = () => {
        setShowAdd(false)
    }

    const handleEditShow = (item) => {
        setSingleAddItem(item)
        setShowEditExpense(true)
    }

    const handleEditClose = () => {
        setShowEditExpense(false)
    }

    useEffect(() => {
        getExpenses();
        getPayment();
        getCategories();
    }, []);

    const handleSave = async () => {
        setToastHider(false);
        if (!amount || !payment || !category || !selectedDate || !desc) {
            setTimeout(() => setToastHider(true), 100); // Delay for rendering
            toast.error("Please fill all fields");
        }
        else if (amount == null || amount < 0) {
            setTimeout(() => setToastHider(true), 100); // Delay for rendering
            toast.error("Value should not be less than 0");
        } else {
            try {
                setIsLoading(true);
                const response = await API.post(`/add-expense`, {
                    amount,
                    payment,
                    expense_category: category,
                    desc,
                    date: moment(selectedDate).format("YYYY-MM-DD"),
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
            setTimeout(() => setToastHider(false), 100); // Delay for rendering
        }
    }

    const getExpenses = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-all-expenses`);
            if (response?.status == 200) {
                setExpensesData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }


    const getPayment = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-payment-method`);
            if (response?.status == 200) {
                setPaymentData(response?.data?.data);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }


    const handleDateChange = (date, dateString) => {
        if (date) {
            let formatDate = dayjs(date).format("YYYY/MM/DD");
            setSelectedDate(formatDate);
        } else {
            setSelectedDate(""); // Handle the case where the date is cleared
        }
    };

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "desc") {
            const alphabetOnly = value.replace(/[^a-zA-Z\s]/g, '');
            setDesc(alphabetOnly);
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

    const filteredData = searchTerm
        ? expensesData?.expenses?.filter((item) =>
            item?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.deposit_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.expense_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.payment_method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.amount?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : expensesData?.expenses;


    const downloadAPI = async () => {
        try {
            const response = await API.get('expense-download');

            if (response?.status === 200) {
                const fileUrl = response?.data?.data; // Extract the CSV file URL from the response

                if (fileUrl) {
                    // Create a temporary link and trigger download
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.setAttribute('download', 'clinic_reports.csv'); // Suggested filename
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link); // Cleanup

                    toast.success("Download Successful!", {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                } else {
                    throw new Error("File URL not found");
                }
            } else {
                toast.error("Download Error", {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } catch (error) {
            toast.error("Download Error", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    return (
        <>
            <WraperLayout className="expenseClinicMainTab bgMobile">
                <Row className='mobWRapeExp'>
                    <div className="btnDown" onClick={() => downloadAPI()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                            <path d="M10.5 13.3333L6.33334 9.16665L7.50001 7.95831L9.66668 10.125V3.33331H11.3333V10.125L13.5 7.95831L14.6667 9.16665L10.5 13.3333ZM5.50001 16.6666C5.04168 16.6666 4.64932 16.5035 4.32293 16.1771C3.99654 15.8507 3.83334 15.4583 3.83334 15V12.5H5.50001V15H15.5V12.5H17.1667V15C17.1667 15.4583 17.0035 15.8507 16.6771 16.1771C16.3507 16.5035 15.9583 16.6666 15.5 16.6666H5.50001Z" fill={themeColor} />
                        </svg>
                        <h5> DOWNLOAD  </h5>
                    </div>
                    {isMobile && (
                        <>
                            <div className='mobileAdd' onClick={handleAddShow}>
                                <span> + </span>
                            </div>
                        </>
                    )}
                    <div className="top_wrapExpense">
                        <Row className="align-items-center">
                            <Col lg={10}>
                                <Row className="align-items-center">
                                    <Col lg={2}>
                                        <input type='text' placeholder='description' className="descrInpt" name="desc" value={desc} onChange={handleChange} maxLength={50} />
                                    </Col>
                                    <Col lg={2}>
                                        <div className="wraper_dateExpense">
                                            <DatePicker name='dob' onChange={handleDateChange} format="DD/MM/YYYY" placeholder='Select Date' inputReadOnly={true} />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                                <path d="M5.57649 22.0047C5.0264 22.0047 4.5555 21.8088 4.16377 21.4171C3.77204 21.0254 3.57617 20.5544 3.57617 20.0044V6.00211C3.57617 5.45202 3.77204 4.98111 4.16377 4.58938C4.5555 4.19765 5.0264 4.00179 5.57649 4.00179H6.57665V2.00146H8.57698V4.00179H16.5783V2.00146H18.5786V4.00179H19.5787C20.1288 4.00179 20.5997 4.19765 20.9915 4.58938C21.3832 4.98111 21.5791 5.45202 21.5791 6.00211V20.0044C21.5791 20.5544 21.3832 21.0254 20.9915 21.4171C20.5997 21.8088 20.1288 22.0047 19.5787 22.0047H5.57649ZM5.57649 20.0044H19.5787V10.0027H5.57649V20.0044ZM5.57649 8.00243H19.5787V6.00211H5.57649V8.00243ZM12.5776 14.0034C12.2942 14.0034 12.0567 13.9075 11.865 13.7158C11.6733 13.5241 11.5775 13.2866 11.5775 13.0032C11.5775 12.7199 11.6733 12.4823 11.865 12.2906C12.0567 12.0989 12.2942 12.0031 12.5776 12.0031C12.861 12.0031 13.0985 12.0989 13.2902 12.2906C13.4819 12.4823 13.5778 12.7199 13.5778 13.0032C13.5778 13.2866 13.4819 13.5241 13.2902 13.7158C13.0985 13.9075 12.861 14.0034 12.5776 14.0034ZM8.57698 14.0034C8.2936 14.0034 8.05606 13.9075 7.86436 13.7158C7.67266 13.5241 7.57681 13.2866 7.57681 13.0032C7.57681 12.7199 7.67266 12.4823 7.86436 12.2906C8.05606 12.0989 8.2936 12.0031 8.57698 12.0031C8.86035 12.0031 9.09789 12.0989 9.28959 12.2906C9.48129 12.4823 9.57714 12.7199 9.57714 13.0032C9.57714 13.2866 9.48129 13.5241 9.28959 13.7158C9.09789 13.9075 8.86035 14.0034 8.57698 14.0034ZM16.5783 14.0034C16.2949 14.0034 16.0573 13.9075 15.8656 13.7158C15.6739 13.5241 15.5781 13.2866 15.5781 13.0032C15.5781 12.7199 15.6739 12.4823 15.8656 12.2906C16.0573 12.0989 16.2949 12.0031 16.5783 12.0031C16.8616 12.0031 17.0992 12.0989 17.2909 12.2906C17.4826 12.4823 17.5784 12.7199 17.5784 13.0032C17.5784 13.2866 17.4826 13.5241 17.2909 13.7158C17.0992 13.9075 16.8616 14.0034 16.5783 14.0034ZM12.5776 18.004C12.2942 18.004 12.0567 17.9082 11.865 17.7165C11.6733 17.5248 11.5775 17.2873 11.5775 17.0039C11.5775 16.7205 11.6733 16.483 11.865 16.2913C12.0567 16.0996 12.2942 16.0037 12.5776 16.0037C12.861 16.0037 13.0985 16.0996 13.2902 16.2913C13.4819 16.483 13.5778 16.7205 13.5778 17.0039C13.5778 17.2873 13.4819 17.5248 13.2902 17.7165C13.0985 17.9082 12.861 18.004 12.5776 18.004ZM8.57698 18.004C8.2936 18.004 8.05606 17.9082 7.86436 17.7165C7.67266 17.5248 7.57681 17.2873 7.57681 17.0039C7.57681 16.7205 7.67266 16.483 7.86436 16.2913C8.05606 16.0996 8.2936 16.0037 8.57698 16.0037C8.86035 16.0037 9.09789 16.0996 9.28959 16.2913C9.48129 16.483 9.57714 16.7205 9.57714 17.0039C9.57714 17.2873 9.48129 17.5248 9.28959 17.7165C9.09789 17.9082 8.86035 18.004 8.57698 18.004ZM16.5783 18.004C16.2949 18.004 16.0573 17.9082 15.8656 17.7165C15.6739 17.5248 15.5781 17.2873 15.5781 17.0039C15.5781 16.7205 15.6739 16.483 15.8656 16.2913C16.0573 16.0996 16.2949 16.0037 16.5783 16.0037C16.8616 16.0037 17.0992 16.0996 17.2909 16.2913C17.4826 16.483 17.5784 16.7205 17.5784 17.0039C17.5784 17.2873 17.4826 17.5248 17.2909 17.7165C17.0992 17.9082 16.8616 18.004 16.5783 18.004Z" fill={themeColor} />
                                            </svg>
                                        </div>
                                    </Col>
                                    <Col lg={2}>
                                        <div className="single_field customSelect">
                                            <Form.Select aria-label="Default select example" name="category" value={category} onChange={handleChange} className='filter'  >
                                                <option value={""} disabled selected>  Select Category </option>
                                                {categoriesData?.filter(item => item?.status !== 0).map((item) => (
                                                    <option key={item?.id} value={item?.id}> {item?.category} </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col lg={2}>
                                        <div className="single_field customSelect">
                                            <Form.Select aria-label="Default select example" name="payment" value={payment} onChange={handleChange} className='filter'  >
                                                <option value={""} >  Payment Method </option>
                                                {paymentData?.paymentMethod?.map((item, index) => (
                                                    <option key={index} value={item?.id}>
                                                        {item?.title}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </Col>
                                    <Col lg={2}>
                                        <input type='number' placeholder='Amount' className="descrInpt" name="amount" value={amount} onChange={handleChange} />
                                    </Col>
                                    <Col lg={2}>
                                        <button className='saveBtn' onClick={handleSave}> Save </button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={2} className='mob'>
                                <div className="search__bar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                        <path d="M20.949 19L17.0886 15.1396M17.0886 15.1396C17.7489 14.4793 18.2727 13.6953 18.6301 12.8326C18.9875 11.9698 19.1714 11.0451 19.1714 10.1112C19.1714 9.17735 18.9875 8.25264 18.6301 7.38987C18.2727 6.5271 17.7489 5.74316 17.0886 5.08283C16.4282 4.42249 15.6443 3.89868 14.7815 3.54131C13.9188 3.18394 12.994 3 12.0602 3C11.1263 3 10.2016 3.18394 9.33884 3.54131C8.47607 3.89868 7.69214 4.42249 7.0318 5.08283C5.69819 6.41644 4.94897 8.2252 4.94897 10.1112C4.94897 11.9972 5.69819 13.806 7.0318 15.1396C8.36541 16.4732 10.1742 17.2224 12.0602 17.2224C13.9462 17.2224 15.755 16.4732 17.0886 15.1396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <input type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder='Search here' />
                                </div>
                                {isMobile &&
                                    <div className="btnDownMobile" onClick={() => downloadAPI()}>
                                        <span className='iccc'></span>
                                        <h5> DOWNLOAD  </h5>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </div>
                    {!isMobile && <Divider />}
                    <div className="singleCard expCardIcon">
                        <h3> Total Expense  </h3>
                        <div className="wrape">
                            <h2> {expensesData?.totalExpense} </h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                <ellipse cx="16.9325" cy="16.9352" rx="16.9325" ry="16.9352" fill="#DBF6FF" />
                                <path d="M12.3813 11C13.4343 11 14.3021 11.127 14.9847 11.381C15.6726 11.635 16.1832 12.0186 16.5166 12.5319C16.85 13.0452 17.0166 13.6934 17.0166 14.4766C17.0166 15.0057 16.9161 15.4687 16.715 15.8656C16.514 16.2625 16.2494 16.5985 15.9213 16.8737C15.5932 17.1488 15.2387 17.3737 14.8577 17.5483L18.2707 22.6044H15.5403L12.7702 18.1516H11.4606V22.6044H9V11H12.3813ZM12.2067 13.0161H11.4606V16.1514H12.2543C13.0692 16.1514 13.6512 16.0164 14.0005 15.7466C14.355 15.4714 14.5323 15.0692 14.5323 14.5401C14.5323 13.9897 14.3418 13.5982 13.9608 13.3653C13.5851 13.1325 13.0004 13.0161 12.2067 13.0161ZM25.7318 19.9692C25.7318 20.5725 25.5889 21.0831 25.3032 21.5011C25.0227 21.9139 24.602 22.2287 24.0411 22.4457C23.4802 22.6574 22.7817 22.7632 21.9457 22.7632C21.3266 22.7632 20.7948 22.7235 20.3503 22.6441C19.9111 22.5648 19.4666 22.4325 19.0168 22.2473V20.247C19.4984 20.464 20.0143 20.6439 20.5646 20.7868C21.1202 20.9244 21.607 20.9932 22.0251 20.9932C22.496 20.9932 22.832 20.9244 23.0331 20.7868C23.2395 20.6439 23.3427 20.4587 23.3427 20.2312C23.3427 20.083 23.3003 19.9507 23.2157 19.8343C23.1363 19.7126 22.9617 19.5777 22.6918 19.4295C22.4219 19.276 21.9986 19.0776 21.4218 18.8342C20.8662 18.6014 20.4085 18.3659 20.0487 18.1278C19.6942 17.8896 19.4296 17.6092 19.255 17.2864C19.0856 16.9583 19.001 16.5429 19.001 16.0402C19.001 15.22 19.3185 14.6036 19.9534 14.1908C20.5937 13.7728 21.4483 13.5638 22.5172 13.5638C23.0675 13.5638 23.5914 13.6193 24.0888 13.7305C24.5914 13.8416 25.1074 14.0188 25.6365 14.2623L24.9063 16.0085C24.4671 15.818 24.0517 15.6619 23.6601 15.5402C23.2739 15.4185 22.8796 15.3576 22.4775 15.3576C22.123 15.3576 21.8557 15.4052 21.6758 15.5005C21.4959 15.5957 21.406 15.7413 21.406 15.937C21.406 16.0799 21.4509 16.2069 21.5409 16.318C21.6361 16.4292 21.816 16.5535 22.0806 16.6911C22.3505 16.8234 22.7447 16.9954 23.2633 17.207C23.766 17.4134 24.2025 17.6304 24.5729 17.8579C24.9433 18.0801 25.2291 18.3579 25.4302 18.6913C25.6312 19.0194 25.7318 19.4454 25.7318 19.9692Z" fill={themeColor} />
                            </svg>
                        </div>
                    </div>
                    {
                        isMobile ?
                            <div className="wrape_cards_mobile_listing">
                                {filteredData?.map((item) => {
                                    return (<>
                                        <div className="single__card_mobile">
                                            <div className='left'>
                                                <span className='descSingle'> {item?.description} </span>
                                                <p className='descSingle'>  {item?.deposit_date}  </p>
                                                <div className='tw-flex tw-items-center tw-gap-3'>
                                                    <span className='descSingleDateMed'> medicines static </span>
                                                    <span className='descSingleDateMed'> {item?.payment_method} </span>
                                                </div>
                                            </div>
                                            <div className='rightt'>
                                                <span className="price">
                                                    {item?.amount}
                                                </span>
                                                <div className='wrape_actions'>
                                                    <span className="editIcon" onClick={() => handleEditShow(item)} ></span>
                                                    <span className="deleteIcon" onClick={() => handleDeleteShow(item)}></span>
                                                </div>
                                            </div>
                                        </div>
                                    </>)
                                })}
                            </div>
                            :
                            <div className="table__wrape">
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Description</th>
                                            <th>Deposit Date</th>
                                            <th>Expense Category</th>
                                            <th>Payment Method</th>
                                            <th> Amount </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredData?.map((item) => {
                                            return (<>
                                                <tr>
                                                    <td> {item?.description} </td>
                                                    <td> {item?.deposit_date}  </td>
                                                    <td> {item?.expense_category} </td>
                                                    <td> {item?.payment_method} </td>
                                                    <td> {item?.amount} </td>
                                                    <td>
                                                        <div className='wrape_actions'>
                                                            <span className="editIcon" onClick={() => handleEditShow(item)}></span>
                                                            <span className="deleteIcon" onClick={() => handleDeleteShow(item)}></span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>)
                                        })}
                                    </tbody>
                                </Table>
                            </div>}
                </Row>
                <DeleteExpenseModal handleDeleteClose={handleDeleteClose} showDelete={showDelete} getExpenses={getExpenses} singleDeleteItem={singleDeleteItem} />
                <AddExpenseModal showAdd={showAdd} paymentData={paymentData} categoriesData={categoriesData} handleAddClose={handleAddClose} getExpenses={getExpenses} />
                <EditExpenseModal singleAddItem={singleAddItem} showEditExpense={showEditExpense} paymentData={paymentData} categoriesData={categoriesData} handleEditClose={handleEditClose} getExpenses={getExpenses} />
            </WraperLayout>
            <ToastContainer />
        </>

    )
}

export default ExpensesTabExpense;
