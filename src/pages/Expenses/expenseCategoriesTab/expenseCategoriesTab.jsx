/* eslint-disable no-unused-vars */
import { DatePicker } from 'antd';
import { Col, Form, Row, Table } from 'react-bootstrap';
import Search from "../../../assets/images/svg/search.svg"
import WraperLayout from '../../../components/wraperLayout/WraperLayout';
import { customers } from '../../../services/data';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import InvoicePayoutDetailsModal from '../../../components/modal/invoicePayoutDetailsModal/InvoicePayoutDetailsModal';
import { Divider } from 'antd';
import './expenseCategoriesTab.scss';
import DeleteExpenseCatModal from '../../../components/modal/deleteExpenseCatModal/DeleteExpenseCatModal';
import ExpenseAddCategoryModal from '../../../components/modal/categoryExpenseModal/CategoryExpenseModal';
import API from '../../../services/httpInstance';
import ExpenseAddCategoryEditModal from '../../../components/modal/categoryExpenseEditModal/CategoryExpenseEditModal';
import { isMobile } from 'react-device-detect';
import { useSelector } from 'react-redux';

const ExpensesCategoryTab = ({ getCategories, categoriesData }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format('YYYY/MM/DD'));
    const [isLoading, setIsLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null)
    const [editSingleItem, setEditSingleItem] = useState({})
    const [searchTerm, setSearchTerm] = useState("");

    const [deleteExpenseCatshow, setDeleteExpenseCatshow] = useState(false);
    const handleDeleteExpenseCatClose = () => setDeleteExpenseCatshow(false);

    const handleDeleteExpenseCatShow = (item) => {
        setDeleteId(item);
        setDeleteExpenseCatshow(true);
    }

    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";

    const [expenseAddCategoryshow, setExpenseAddCategoryshow] = useState(false);
    const handleExpenseAddCategoryClose = () => setExpenseAddCategoryshow(false);
    const handleExpenseAddCategoryShow = () => setExpenseAddCategoryshow(true);

    const [expenseEditShow, setExpenseEditShow] = useState(false);
    const handleExpenseEditCategoryClose = () => setExpenseEditShow(false);

    const handleExpenseEditCategoryShow = (item) => {
        setEditSingleItem(item)
        setExpenseEditShow(true);
    }

    const handleDateChange = (date, dateString) => {
        let formatDate = dayjs(date).format('YYYY-MM-DD')
        setSelectedDate(formatDate)
    }

    useEffect(() => {
        getCategories();
    }, []);

    const filteredData = searchTerm
        ? categoriesData?.filter((item) =>
            item.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : categoriesData;

    return (
        <WraperLayout className="expensesCategoryTab bgMobile">
            <div className='mobilebgColor'>
                <Row className=''>
                    <div className="catDown" onClick={handleExpenseAddCategoryShow}>
                        Add Category
                    </div>
                    {isMobile
                        ?
                        <div className='wraper_all_categoriesMobile'>
                            <div className="search__barCat">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                                    <path d="M20.949 19L17.0886 15.1396M17.0886 15.1396C17.7489 14.4793 18.2727 13.6953 18.6301 12.8326C18.9875 11.9698 19.1714 11.0451 19.1714 10.1112C19.1714 9.17735 18.9875 8.25264 18.6301 7.38987C18.2727 6.5271 17.7489 5.74316 17.0886 5.08283C16.4282 4.42249 15.6443 3.89868 14.7815 3.54131C13.9188 3.18394 12.994 3 12.0602 3C11.1263 3 10.2016 3.18394 9.33884 3.54131C8.47607 3.89868 7.69214 4.42249 7.0318 5.08283C5.69819 6.41644 4.94897 8.2252 4.94897 10.1112C4.94897 11.9972 5.69819 13.806 7.0318 15.1396C8.36541 16.4732 10.1742 17.2224 12.0602 17.2224C13.9462 17.2224 15.755 16.4732 17.0886 15.1396Z" stroke={themeColor} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <input type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder='Search here'
                                />
                            </div>
                            <div className="wrape_cards_mobile_listingCa">
                                {filteredData?.map((item) => {
                                    return (<>
                                        <div className="single__card_mobileCat">
                                            <span className='descSingle'> {item?.category}  </span>
                                            <div className='wrape_actions'>
                                                <span className="editIcon" onClick={() => { handleExpenseEditCategoryShow(item) }} ></span>
                                                <span className="deleteIcon" onClick={() => handleDeleteExpenseCatShow(item)}></span>
                                            </div>
                                        </div>
                                    </>)
                                })}
                            </div>
                        </div>
                        :
                        <div className="table__wrape">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Expense Category</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoriesData?.map((item) => {
                                        return (<>
                                            <tr>
                                                <td> {item?.category} </td>
                                                <td>
                                                    <div className='actions tw-flex tw-items-center tw-gap-4'>
                                                        <span className='editIcon' onClick={() => { handleExpenseEditCategoryShow(item) }}></span>
                                                        <span className='deleteIcon' onClick={() => handleDeleteExpenseCatShow(item)}></span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>)
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    }
                </Row>
            </div>
            <DeleteExpenseCatModal deleteExpenseCatshow={deleteExpenseCatshow} handleDeleteExpenseCatClose={handleDeleteExpenseCatClose} deleteId={deleteId} getCategories={getCategories} />
            <ExpenseAddCategoryModal expenseAddCategoryshow={expenseAddCategoryshow} handleExpenseAddCategoryClose={handleExpenseAddCategoryClose} getCategories={getCategories} />
            <ExpenseAddCategoryEditModal handleExpenseEditCategoryClose={handleExpenseEditCategoryClose} expenseEditShow={expenseEditShow} editSingleItem={editSingleItem} getCategories={getCategories} />
        </WraperLayout>
    )
}

export default ExpensesCategoryTab;
