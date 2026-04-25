import { Col, Form, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import './investigationTabOffline.scss';
import { useEffect, useState } from 'react';
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import Calendar from '../../../assets/images/png/calendar.png';
import { DatePicker, Select } from 'antd';
import UploadImageModal from '../../modal/uploadImageModal/UploadImageModal';

const InvestigationTabOffline = ({ appointmentId, patientId, sendSms, sendWhatsapp, setSendWhatsapp, setSendSms, clinicId, setSelectDatePicker, selectDatePicker }) => {
    const { Option } = Select;
    const [customLabTest, setCustomLabTest] = useState('')
    const [note, setNote] = useState('')
    const [currentLab, setCurrentLab] = useState([])
    const [historyLab, setHistoryLab] = useState([])
    const [labTest, setLabTest] = useState([])
    const [uploadImageShow, setUploadImage] = useState(false)
    const [investigationId, setInvestigationId] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadImageViewShow, setUploadImageViewShow] = useState(false)
    const [isImageUploaded, setIsImageUploaded] = useState({});

    const handleUploadImageShow = (id) => {
        setInvestigationId(id)
        setIsImageUploaded(prevState => ({
            ...prevState,
            [id]: false
        }));
        setUploadImage(true)
    }

    const handleImageUpload = () => {
        setIsImageUploaded(prevState => ({
            ...prevState,
            [investigationId]: true
        }));
    };

    const handleUploadImageViewShow = (imageUrl) => {
        setSelectedImage(imageUrl)
        setUploadImageViewShow(true)
    }

    const handleUploadImageViewClose = () => setUploadImageViewShow(false)

    const handleUploadImageClose = () => setUploadImage(false)

    const getCurrentLab = async () => {
        try {
            const response = await API.get(`/current-lab/${appointmentId}`);
            if (response.status == 200) {
                setCurrentLab(response?.data?.data);
            }
        } catch (error) {
            console.log('Error fetching current labs: ', error);
        }
    }

    const getHistoryLab = async () => {
        try {
            const response = await API.get(`/labhistory?appointment_id=${appointmentId}`)
            if (response.status === 200) {
                setHistoryLab(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getDeleteCurrent = async (id) => {
        try {
            const response = await API.delete(`/delete-prescribed-labtest?LabId=${id}`)
            if (response.status === 200) {
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
                getCurrentLab()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getLabTest = async () => {
        try {
            const response = await API.get("/lab-test");
            if (response.status === 200) {
                setLabTest(response?.data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddInvestigation = async () => {
        if (!customLabTest && !note.trim()) {
            setIndicationMessage('Please choose a lab test or enter an instruction first');
            return;
        }  else if(!customLabTest){
            setIndicationMessage('Please choose a lab test');
            return;
        }
        const payload = {
            appointment_id: appointmentId,
            patient_id: patientId,
            customlabtest: customLabTest ? [customLabTest] : [],
            note: note
        }
        try {
            const response = await API?.post('/prescribe-lab-note', payload)
            if (response.status === 200) {
                getCurrentLab();
                setCustomLabTest('');
                setNote('');
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
            } else {
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
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleCustomLabTest = (value) => {
        setCustomLabTest(value)
    }

    const handleSearch = (value) => {
        setCustomLabTest(value);
    };

    useEffect(() => {
        getCurrentLab()
        getHistoryLab()
        getLabTest()
    }, [])

    return (
        <div className='investigationTabOffline'>
            <Col lg={12}>
                <Row className='h-100'>
                    <Col lg={3} className='h-100' style={{ borderRight: "1px solid #D3DEE9" }}>
                        <h3> New Investigation </h3>
                        <div className="single_field customSelect">
                            <label htmlFor=""> Choose Lab Test* </label>
                            <Select
                                showSearch
                                placeholder="Search for labs"
                                className="form-select"
                                value={customLabTest || undefined}
                                optionFilterProp="children"
                                onSearch={handleSearch}
                                onChange={handleCustomLabTest}
                            >
                                {labTest?.map((item) => (
                                    <Option value={item?.id} key={item?.id}>
                                        {item?.title}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div className="customTextArea">
                            <label htmlFor=""> Enter Instruction </label>
                            <textarea id="present_complaint" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                        </div>
                        <div className="wraper_btn">
                            <button onClick={handleAddInvestigation}> Add Investigation </button>
                        </div>
                        <ul className='wrapeFollowUp'>
                            <li>
                                <div className='form-checked'>
                                    {/* <DatePicker /> */}
                                    <h4> Follow-up Appointment </h4>
                                    <div className='date-pick'>
                                        <p>
                                            {selectDatePicker ? `${selectDatePicker}` : ''}
                                        </p>
                                        <div className='date-input'>
                                            <input type="date" value={selectDatePicker} onChange={(e) => setSelectDatePicker(e.target.value)} />
                                            <img src={Calendar} />
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <Form.Group className='form-checked'>
                                    <Form.Label> Send prescription via WhatsApp </Form.Label>
                                    <Form.Check type="checkbox" checked={sendWhatsapp} onChange={(e) => setSendWhatsapp(e.target.checked)} />
                                </Form.Group>
                            </li>
                            <li>
                                <Form.Group className='form-checked'>
                                    <Form.Label> Send prescription via SMS </Form.Label>
                                    <Form.Check type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} />
                                </Form.Group>
                            </li>
                        </ul>
                    </Col>
                    <Col lg={9} className='h-100'>
                        <h3> Lab Tests </h3>
                        <Tabs
                            defaultActiveKey="Current"
                            id="uncontrolled-tab-example"
                            className="mb-3 tabsCurrent"
                        >
                            <Tab eventKey="Current" title="Current">
                                <div className="currentTabInvest">
                                    <div className="wrape_indication">
                                        <div className="table__wrape tableConsultSub">
                                            <Table responsive className=''>
                                                <thead>
                                                    <tr>
                                                        <th>Date </th>
                                                        <th>Lab Test</th>
                                                        <th>Instruction</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentLab?.length > 0 ? (
                                                            currentLab?.map((item) => (
                                                                <tr key={item?.id}>
                                                                    <td> {item?.created_at} </td>
                                                                    <td> {item?.lab_tests} </td>
                                                                    <td> {item?.note} </td>
                                                                    <td>
                                                                        <div className="wrape_actions">
                                                                            {item?.image_url_path ? (
                                                                                <button onClick={() => handleUploadImageViewShow(item?.image_url_path)}>
                                                                                    <CloudDownloadOutlined />
                                                                                </button>
                                                                            ) : (
                                                                                <button onClick={() => handleUploadImageShow(item?.id, item?.lab_tests)}>
                                                                                    <CloudUploadOutlined />
                                                                                </button>
                                                                            )}
                                                                            <span className="deleteIcon" onClick={() => getDeleteCurrent(item?.id)}></span>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={4} className='text-center'>No data</td>
                                                            </tr>
                                                        )
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="History" title="History">
                                <div className="currentTabInvest">
                                    <div className="wrape_indication">
                                        <div className="table__wrape tableConsultSub">
                                            <Table responsive className=''>
                                                <thead>
                                                    <tr>
                                                        <th>Date </th>
                                                        <th>Lab Test</th>
                                                        <th>Instruction</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {historyLab?.length > 0 ? (
                                                        historyLab?.map((item) => (
                                                            <tr key={item?.id}>
                                                                <td> {item?.created_at} </td>
                                                                <td> {item?.lab_tests} </td>
                                                                <td> {item?.note} </td>
                                                                <td>
                                                                    <div className="wrape_actions">
                                                                        <button onClick={() => handleUploadImageShow(item?.id, item?.lab_tests)}><CloudUploadOutlined /></button>
                                                                        <span className="deleteIcon" onClick={() => getDeleteCurrent(item?.id)}></span>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (<tr>
                                                        <td colSpan={4} className='text-center'>No data</td>
                                                    </tr>)}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Col>
            <uploadImageViewModal handleUploadImageViewClose={handleUploadImageViewClose} uploadImageViewShow={uploadImageViewShow} imageUrl={selectedImage} />
            <UploadImageModal uploadImageShow={uploadImageShow} note={note} investigationId={investigationId} onImageUpload={handleImageUpload} handleUploadImageClose={handleUploadImageClose} appointmentId={appointmentId} clinicId={clinicId} patientId={patientId} />
        </div>
    )
}

export default InvestigationTabOffline;
