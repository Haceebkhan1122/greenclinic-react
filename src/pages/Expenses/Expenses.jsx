import { Col, Form, Row, Tab, Tabs } from 'react-bootstrap';
import WraperLayout from '../../components/wraperLayout/WraperLayout';
import { DatePicker } from 'antd';
import Search from "../../assets/images/svg/search.svg"
import ExpensesTabExpense from './expensesTabExpense/ExpensesTabExpense';
import ExpensesCategoryTab from './expenseCategoriesTab/expenseCategoriesTab';
import './expenses.scss';
import { useEffect, useState } from 'react';
import API from '../../services/httpInstance';
import { useMediaQuery } from '@mui/material';

const Expenses = () => {
  const [categoriesData, setCategoriesData] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`get-expense-categories`);
      if (response?.status == 200) {
        setCategoriesData(response?.data?.data);
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }











  const isMobile = useMediaQuery('(max-width:767px)');

  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    // If screen width > 768px, show default tab
    if (window.innerWidth > 768) {
      setActiveTab('Expense');
    }
  }, []);
  const handleBack = () => {
    setActiveTab('');
  };

  const HeaderWithBack = ({ title }) => (
    <div className="headerTabs">
      <button onClick={handleBack} className="">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M7.51184 12.96L12.8878 18.336L11.5198 19.68L3.83984 12L11.5198 4.32001L12.8878 5.66401L7.51184 11.04H19.1998V12.96H7.51184Z" fill="#0F75BC" />
        </svg>
      </button>
      {title}
    </div>
  );

  return (
    <>
      {!isMobile
        ?
        <WraperLayout className="patient">
          <div className="box-white">
            <div className='wraper_tabs_expenses'>
              <Tabs
                defaultActiveKey="Expense"
                id="uncontrolled-tab-example"
                className="consultNowOffilineTabViewTabs"
              >
                <Tab eventKey="Expense" title="Expense">
                  <ExpensesTabExpense getCategories={getCategories} categoriesData={categoriesData} />
                </Tab>
                <Tab eventKey="Expense Categories" title="Expense Categories">
                  <ExpensesCategoryTab getCategories={getCategories} categoriesData={categoriesData} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </WraperLayout>
        :
        <WraperLayout className="patient">
          <div className="box-white invoice__main">
            <div className='wraper_tabs_invoices mobileDesignTabs'>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="consultNowOffilineTabViewTabs"
              >
                <Tab eventKey="Expense" title="Expense">
                  {isMobile && (<><HeaderWithBack title="Expense" /></>)}
                  <ExpensesTabExpense getCategories={getCategories} categoriesData={categoriesData} />
                </Tab>
                <Tab eventKey="Expense Categories" title="Expense Categories">
                  {isMobile && (<><HeaderWithBack title="Expense Categories" /></>)}
                  <ExpensesCategoryTab getCategories={getCategories} categoriesData={categoriesData} />
                </Tab>
              </Tabs>
            </div>
          </div>
        </WraperLayout>
      }
    </>
  )
}

export default Expenses;