import { Col, Form, Row, Tab, Table, Tabs } from 'react-bootstrap';
import './investigationConsultNowTab.scss';
import { CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Select } from 'antd';
import UploadImageModal from '../../modal/uploadImageModal/UploadImageModal';
import API, { API_MERISEHAT } from '../../../services/httpInstance';
import { toast } from 'react-toastify';
import UploadImageViewModal from '../../modal/uploadImageViewModal/UploadImageViewModal';

const InvestigationConsultNowTab = ({ appointmentId, patientId, clinicId }) => {
    const { Option } = Select;
    const [customLabTest, setCustomLabTest] = useState('');
    const [note, setNote] = useState('');
    const [currentMedicalRecords, setCurrentMedicalRecords] = useState([]);
    const [historyLab, setHistoryLab] = useState([]);
    const [labTest, setLabTest] = useState([]);
    const [uploadImageShow, setUploadImage] = useState(false);
    const [investigationId, setInvestigationId] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState({});
    const [uploadImageViewShow, setUploadImageViewShow] = useState(false);
    const [indicationMessage, setIndicationMessage] = useState('');
    const [investigationName, setInvestigationName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const handleUploadImageViewShow = (imageUrl) => {
        setSelectedImage(imageUrl);
        setUploadImageViewShow(true);
    };

    const handleUploadImageViewClose = () => setUploadImageViewShow(false);

    const handleUploadImageShow = (id, labTests) => {
        setInvestigationId(id)
        setInvestigationName(labTests)
        getCombinedCurrentLabs();
        setIsImageUploaded(prevState => ({
            ...prevState,
            [id]: false
        }));
        setUploadImage(true)
    }

    const handleImageUpload = async () => {
        setIsImageUploaded(prevState => ({
            ...prevState,
            [investigationId]: true
        }));
        await getCombinedCurrentLabs();
        handleUploadImageClose();
    };

    const handleUploadImageClose = () => setUploadImage(false);

    const getCombinedCurrentLabs = async () => {
        try {
            const [labResponse, recordResponse] = await Promise.all([
                API.get(`/current-lab/${appointmentId}`),
                API_MERISEHAT.get(`/instant-medical-record-current?appt_id=${appointmentId}`)
            ]);

            const labData = labResponse.status === 200 ? labResponse?.data?.data || [] : [];
            const recordData = recordResponse.status === 200 ? recordResponse?.data?.data || [] : [];

            const combined = [...labData, ...recordData].sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));
            setCurrentMedicalRecords(combined);
        } catch (error) {
            console.error("Error fetching combined lab data:", error);
        }
    };

    const getHistoryLab = async () => {
        try {
            const response = await API.get(`/labhistory?appointment_id=${appointmentId}`);
            if (response.status === 200) {
                setHistoryLab(response?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getDeleteCurrent = async (id) => {
        try {
            const response = await API.delete(`/delete-prescribed-labtest?LabId=${id}`);
            if (response?.status === 200) {
                await getCombinedCurrentLabs();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getLabTest = async () => {
        try {
            const response = await API.get("/lab-test");
            if (response.status === 200) {
                setLabTest(response?.data?.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddInvestigation = async () => {
        if (!customLabTest && !note.trim()) {
            setIndicationMessage('Please choose a lab test or enter an instruction first');
            return;
        } else if (!customLabTest) {
            setIndicationMessage('Please choose a lab test');
            return;
        }
        const payload = {
            appointment_id: appointmentId,
            patient_id: patientId,
            customlabtest: customLabTest ? [customLabTest] : [],
            note: note
        };
        try {
            const response = await API?.post('/prescribe-lab-note', payload);
            if (response.status === 200) {
                await getCombinedCurrentLabs();
                setCustomLabTest('');
                setNote('');
                setIndicationMessage(response?.data?.message);
            } else {
                setIndicationMessage(response?.data?.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage('');
        }, 1000);
        return () => clearTimeout(timeOut);
    }, [indicationMessage]);

    const handleCustomLabTest = (value) => {
        setCustomLabTest(value);
    };

    const handleSearch = (value) => {
        setCustomLabTest(value);
    };

    useEffect(() => {
        getHistoryLab();
        getLabTest();
    }, [appointmentId]);

    useEffect(() => {
        const interval = setInterval(() => {
            getCombinedCurrentLabs();
        }, 15000);

        return () => clearInterval(interval);
    }, [appointmentId]);

    return (
        <>
            {indicationMessage !== "" && <div className="showPoup">{indicationMessage}</div>}
            <div className='investigationConsultNowTab'>
                <div className="topCard">
                    <h3>New Investigation</h3>
                    <Row>
                        <Col lg={6}>
                            <div className="single_field customSelect">
                                <label className='mb-1'>Choose Lab Test*</label>
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
                        </Col>
                        <Col lg={6}>
                            <div className="single customInp">
                                <label>Instruction</label>
                                <input type="text" placeholder="Enter field name" value={note} onChange={(e) => setNote(e.target.value)} />
                            </div>
                        </Col>
                        <div className="wraper_btn">
                            <button onClick={handleAddInvestigation}>Add Investigation</button>
                        </div>
                    </Row>
                </div>
                <div className="bottomCard">
                    <h3>Lab Tests</h3>
                    <Tabs defaultActiveKey="Current" id="uncontrolled-tab-example" className="mb-3">
                        <Tab eventKey="Current" title="Current">
                            <div className="currentTabInvest">
                                <div className="wrape_indication">
                                    <div className="table__wrape tableConsultSub">
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Lab Test</th>
                                                    <th>Instruction</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentMedicalRecords?.length > 0 ? (
                                                    currentMedicalRecords.map((item) => (
                                                        <tr key={item?.id}>
                                                            <td>{item?.created_at || item?.date}</td>
                                                            <td>{item?.lab_tests || item?.filename}</td>
                                                            <td>{item?.note}</td>
                                                            <td>
                                                                <div className="wrape_actions">
                                                                    {item?.image_url_path || isImageUploaded[item?.id] || item?.instant_medical_record_file?.image ? (
                                                                        <button onClick={() => handleUploadImageViewShow(
                                                                            item?.image_url_path || item?.instant_medical_record_file?.image
                                                                        )}>
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
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                    <div className="btnView">
                                        <span className='saveBtn'>View All</span>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="History" title="History">
                            <div className="currentTabInvest">
                                <div className="wrape_indication">
                                    <div className="table__wrape tableConsultSub">
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Lab Test</th>
                                                    <th>Instruction</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historyLab?.length > 0 ? (
                                                    historyLab.map((item) => (
                                                        <tr key={item?.id}>
                                                            <td>{item?.created_at || item?.date}</td>
                                                            <td>{item?.lab_tests || item?.filename}</td>
                                                            <td>{item?.note}</td>
                                                            <td>
                                                                <div className="wrape_actions">
                                                                    {item?.image_url_path || isImageUploaded[item?.id] || item?.instant_medical_record_file?.image ? (
                                                                        <button onClick={() => handleUploadImageViewShow(
                                                                            item?.image_url_path || item?.instant_medical_record_file?.image
                                                                        )}>
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
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
                <UploadImageModal
                    uploadImageShow={uploadImageShow}
                    note={note}
                    investigationId={investigationId}
                    onImageUpload={handleImageUpload}
                    handleUploadImageClose={handleUploadImageClose}
                    appointmentId={appointmentId}
                    clinicId={clinicId}
                    getCombinedCurrentLabs={getCombinedCurrentLabs}
                    investigationName={investigationName}
                    patientId={patientId}
                />
                <UploadImageViewModal
                    handleUploadImageViewClose={handleUploadImageViewClose}
                    uploadImageViewShow={uploadImageViewShow}
                    imageUrl={selectedImage}
                />
            </div>
        </>
    );
};

export default InvestigationConsultNowTab;
