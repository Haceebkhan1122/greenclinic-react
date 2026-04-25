import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddLabModal from '../../modal/addLabModal/AddLabModal';
import EditLabModal from '../../modal/editLabModal/EditLabModal';
import DeleteLabModal from '../../modal/deleteLabModal/DeleteLabModal';
import { isMobile } from 'react-device-detect';
import "./labsTestTab.scss"
import API from '../../../services/httpInstance';
import Loader from '../../loader/Loader';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const LabsTestTab = () => {
    let userData = useSelector((state) => state.user.user);
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";
    const [addLabshow, setAddLabshow] = useState(false);
    const [editLabshow, setEditLabshow] = useState(false);
    const [deleteLabshow, setDeleteLabshow] = useState(false);
    const [labTests, setLabTests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filteredData, setFilteredData] = useState([])
    const [singleEditItem, setSingleEditItem] = useState({})
    const [indicationMessage, setIndicationMessage] = useState("");
    const [investigationList, setInvestigationList] = useState(null)

    const handleAddLabClose = () => setAddLabshow(false);
    const handleAddLabshow = () => setAddLabshow(true);

    const handleEditLabClose = () => setEditLabshow(false);

    const handleEditLabshow = (item) => { 
        setSingleEditItem(item);
        setEditLabshow(true);
    } 

    const handleDeleteLabClose = () => setDeleteLabshow(false);

    useEffect(() => {
        getLabTests();
    }, []);

    const getLabTests = async () => {
        try {
            setIsLoading(true);
            const response = await API.get(`/get-all-labs`);
            if (response?.status == 200) {
                setLabTests(response?.data?.data);
                setFilteredData(response?.data?.data?.labs);
                setIsLoading(false);
            }
            else {
                setIsLoading(false);
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false);
        }
    }

    const handleDeleteLabshow = (item) => {
        setSingleEditItem(item);
        setDeleteLabshow(true);
    }

    const handleSearch = (e) => {
        const { value } = e.target;
        let examData = [...labTests?.labs];
        if (value !== "") {
            let lower = value.toLowerCase();
            let trimed = lower.replace(/\s/g, '');
            examData = examData.filter((item) => {
                return item?.title.toLowerCase().replace(/\s/g, '').includes(trimed);
            })
        }
        else {
            examData = [...labTests?.labs];
        }
        setFilteredData(examData);
    }

    const handleChange = (e) => {
        const {value, name, checked} = e.target;
        if(name == "investigationList") {
            if (checked) {
                setInvestigationList(1)
                try {
                    setIsLoading(true)
                    const response = API.patch(`/update-investigation-list`, {
                        investigationList: 1,
                    })
                    if (response?.status == 200) {
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
                        getLabTests();
                        setIsLoading(false)
                    }
                    else {
                        toast.error(response?.data?.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        })
                        setIsLoading(false)
                    }
                } catch (error) {
                    console.log("error")
                    setIsLoading(false);
                }
            }

            else {
                setInvestigationList(0)
                try {
                    setIsLoading(true)
                    const response = API.patch(`/update-investigation-list`, {
                        investigationList: 0,
                    })
                    if (response?.status == 200) {
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
                        getLabTests();
                        setIsLoading(false)
                    }
                    else {
                        toast.error(response?.data?.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        })
                        setIsLoading(false)
                    }
                } catch (error) {
                    console.log("error")
                    setIsLoading(false);
                }
            }
        }
    }


    useEffect(() => {
        setInvestigationList(labTests?.investigationList)
    }, [labTests, investigationList])
    
    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            {isLoading ? <Loader /> :
                <div className='lab_Tab'>
                    <div className="top">
                        <Row>
                            <Col lg={7} className='order2'>
                                <div className="field_check customCheck">
                                    <label htmlFor=""> Investigation list </label>
                                    <Form.Check
                                        style={{ border: "none !important" }}
                                        type="switch"
                                        id="custom-switch"
                                        name='investigationList'
                                        onChange={handleChange}
                                        defaultChecked={userData?.investigation_guide == 1}
                                    />
                                </div>
                            </Col>
                            <Col lg={3} className='order1'>
                                <div className="search-bar">
                                    <span className="ico"></span>
                                    <input type="text" placeholder='Search lab tests' onChange={handleSearch} />
                                </div>
                            </Col>
                            <Col lg={2} className='box-fixed'>
                                <button className='button1' onClick={handleAddLabshow}> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                    <path d="M11.1911 13.0096H4.33398V10.7238H11.1911V3.8667H13.4768V10.7238H20.334V13.0096H13.4768V19.8667H11.1911V13.0096Z" fill={themeColor} />
                                </svg> Add Lab Test </button>
                            </Col>
                        </Row>
                    </div>
                    {!isMobile ? (
                        <div className="table__wrape">
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Lab Test</th>
                                        <th>Type</th>
                                        <th className='text-center'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length
                                        ?
                                        filteredData?.map((item) => {
                                            return (<>
                                                <tr>
                                                    <td>{item?.title}</td>
                                                    <td>{item?.lab_type}</td>
                                                    <td>
                                                        <div className='form_btn'>
                                                            <button className='delete' onClick={() => { handleDeleteLabshow(item) }}> <DeleteOutlined /></button>
                                                            <button className='edit' onClick={() => { handleEditLabshow(item) }}><EditOutlined /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </>)
                                        })
                                        :
                                        <div className='noDataTable'> No data available in table </div>
                                    }
                                </tbody>
                            </Table>
                        </div>
                    ) : (<div className='card__wrape'>
                        <Row>
                            <Col lg={12}>
                                <div className="card">
                                    <div>
                                        <h5>Blood Test</h5>
                                        <p>3gAllergy Specific IgE Universal Food</p>
                                    </div>
                                    <div className='form_btn'>
                                        <button className='edit' onClick={handleEditLabshow}><EditOutlined /></button>
                                        <button className='delete' onClick={handleDeleteLabshow}><DeleteOutlined /></button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>)}
                    <AddLabModal setIndicationMessage={setIndicationMessage} indicationMessage={indicationMessage} addLabshow={addLabshow} getLabTests={getLabTests} handleAddLabClose={handleAddLabClose} />
                    <EditLabModal editLabshow={editLabshow} handleEditLabClose={handleEditLabClose} singleEditItem={singleEditItem} getLabTests={getLabTests} indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} />
                    <DeleteLabModal deleteLabshow={deleteLabshow} handleDeleteLabClose={handleDeleteLabClose} singleEditItem={singleEditItem} getLabTests={getLabTests} indicationMessage={indicationMessage} setIndicationMessage={setIndicationMessage} />
                </div>
            }
        </>
    )
}

export default LabsTestTab;
