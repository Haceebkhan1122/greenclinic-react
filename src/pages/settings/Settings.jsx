import WraperLayout from '../../components/wraperLayout/WraperLayout';
import ClinicConfiguration from '../../components/settingsTabs/clinicConfiguration/ClinicConfiguration';
import FormsSetting from '../../components/settingsTabs/formsSetting/FormsSetting';
import Medicines from '../../components/settingsTabs/medicines/Medicines';
import PrescriptionSettings from '../../components/settingsTabs/prescriptionSettings/PrescriptionSettings'
import PrintSettings from '../../components/settingsTabs/printSettings/PrintSettings'
import Procedures from '../../components/settingsTabs/procedures/Procedures'
import SmsSettings from '../../components/settingsTabs/smsSettings/SmsSettings'
import RoleRights from '../../components/settingsTabs/roleRights/RoleRights'
import FavouriteMedicineSetting from '../../components/settingsTabs/favouriteMedicineSetting/FavouriteMedicineSetting';
import LabsTestTab from '../../components/settingsTabs/labsTestTab/LabsTestTab';
import { Tabs } from 'antd';
import './settings.scss';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../../services/httpInstance';
import Loader from '../../components/loader/Loader';

const Settings = () => {
    const isMobileDevice = () => window.innerWidth <= 768;
    const [activeTab, setActiveTab] = useState(isMobileDevice() ? null : "1");
    const [userData, setUserData] = useState([]);
    const isMobile = useMediaQuery('(max-width:767px)');
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [adminClinic, setAdminClinic] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);
    const [viewClinic, setViewClinic] = useState(false);
    const [viewMedicines, setViewMedicines] = useState(false);
    const [viewLab, setViewLab] = useState(false);
    let clinicDetails = useSelector((state) => state.clinic);
    const [showProcedure, setShowProcedure] = useState(false);
    const [showAppointment, setShowAppointment] = useState(false);
    const [showSms, setShowSms] = useState(false);
    const [showRole, setShowRole] = useState(false);
    const [showPrint, setShowPrint] = useState(false);


    useEffect(() => {
        getUser();
        setUserPermissions(clinicDetails?.userPermissions)
    }, []);

    useEffect(() => {
        if (!isMobileDevice()) {
            if (location.state?.activeTab) {
                setActiveTab(location.state.activeTab);
            } else {
                setActiveTab("1");
            }
        } else {
            setActiveTab(null);
        }
    }, [location.state?.activeTab]);

    useEffect(() => {
        if (activeTab !== null) {
            localStorage.setItem("activeTab", activeTab);
        }
    }, [activeTab]);

    const HeaderWithBack = ({ title, onBack }) => (
        <div className="headerTabs">
            <button onClick={onBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M7.51184 12.96L12.8878 18.336L11.5198 19.68L3.83984 12L11.5198 4.32001L12.8878 5.66401L7.51184 11.04H19.1998V12.96H7.51184Z" fill="#0F75BC" />
                </svg>
            </button>
            {title}
        </div>
    );

    const items = [
        ...(viewClinic ? [{
            key: '1',
            label: 'Clinic Configuration',
            children: (
                <>
                    {isMobile && (<HeaderWithBack title="Clinic Configuration" onBack={() => setActiveTab(null)} />)}
                    <ClinicConfiguration />
                </>
            ),
        }] : []),
        ...(showAppointment ? [{
            key: '2',
            label: 'Forms',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Forms" onBack={() => setActiveTab(null)} /></>)}
                <FormsSetting />
            </>
            ),
        }] : []),
        ...(viewMedicines) ? [{
            key: '3',
            label: 'Medicines',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Medicines" onBack={() => setActiveTab(null)} /></>)}
                <Medicines />,
            </>
            ),
        }] : [],
        ...(viewLab) ? [{
            key: '4',
            label: 'Lab Tests',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Medicines" onBack={() => setActiveTab(null)} /></>)}
                <LabsTestTab />,
            </>
            ),
        }] : [],
        ...(showProcedure ? [{
            key: '5',
            label: 'Procedures',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Procedures" onBack={() => setActiveTab(null)} /></>)}
                <Procedures />,
            </>
            ),
        },] : []),
        ...(viewMedicines) ? [{
            key: '6',
            label: 'Favourite/Group Medicine',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Medicines" onBack={() => setActiveTab(null)} /></>)}
                <FavouriteMedicineSetting />,
            </>
            ),
        }] : [],
        {
            key: '7',
            label: 'Prescription Settings',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Prescription Settings" onBack={() => setActiveTab(null)} /></>)}
                <PrescriptionSettings />,
            </>
            ),
        },
        ...(showSms ? [{
            key: '8',
            label: 'SMS Settings',
            children: (<>
                {isMobile && (<><HeaderWithBack title="SMS Settings" onBack={() => setActiveTab(null)} /></>)}
                <SmsSettings />
            </>
            ),
        }] : []),
        ...(showPrint ? [{
            key: '9',
            label: 'Print Settings',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Print Settings" onBack={() => setActiveTab(null)} /></>)}
                <PrintSettings />,
            </>
            ),
        },] : []),
        ...(adminClinic && showRole ? [{
            key: '10',
            label: 'Role & Rights',
            children: (<>
                {isMobile && (<><HeaderWithBack title="Role & Rights" onBack={() => setActiveTab(null)} /></>)}
                <RoleRights />,
            </>
            ),
        }] : []),
    ];

    // const items2 = [
    //     {
    //         key: '1',
    //         label: 'Clinic Configuration',
    //         children: (
    //             <>
    //                 {isMobile && (<><HeaderWithBack title="Clinic Configuration" onBack={() => setActiveTab(null)} /></>)}
    //                 <ClinicConfiguration />,
    //             </>
    //         ),
    //     },
    //     {
    //         key: '2',
    //         label: 'Forms',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="Forms" onBack={() => setActiveTab(null)} /></>)}
    //             <FormsSetting />
    //         </>
    //         ),
    //     },
    //     {
    //         key: '3',
    //         label: 'Medicines',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="Medicines" onBack={() => setActiveTab(null)} /></>)}
    //             <Medicines />,
    //         </>
    //         ),
    //     },
    //     {
    //         key: '4',
    //         label: 'Lab Tests',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="Lab Tests" onBack={() => setActiveTab(null)} /></>)}
    //             <LabsTestTab />,
    //         </>
    //         ),
    //     },
    //     {
    //         key: '5',
    //         label: 'Procedures',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="Procedures" onBack={() => setActiveTab(null)} /></>)}
    //             <Procedures />,
    //         </>
    //         ),
    //     },
    //     {
    //         key: '6',
    //         label: 'Favourite/Group Medicine',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="Favourite/Group Medicine" onBack={() => setActiveTab(null)} /></>)}
    //             <FavouriteMedicineSetting />,
    //         </>
    //         ),
    //     },
    //     {
    //         key: '7',
    //         label: 'Prescription Settings',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="Prescription Settings" onBack={() => setActiveTab(null)} /></>)}
    //             <PrescriptionSettings />,
    //         </>
    //         ),
    //     },
    //     {
    //         key: '8',
    //         label: 'SMS Settings',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="SMS Settings" onBack={() => setActiveTab(null)} /></>)}
    //             <SmsSettings />
    //         </>
    //         ),
    //     },
    //     {
    //         key: '9',
    //         label: 'Print Settings',
    //         children: (<>
    //             {isMobile && (<><HeaderWithBack title="Print Settings" onBack={() => setActiveTab(null)} /></>)}
    //             <PrintSettings />,
    //         </>
    //         ),
    //     },
    // ];

    const onChange = (key) => {
        console.log(key);
    };

    const getUser = async () => {
        try {
            setIsLoading(true)
            const response = await API.get(`/user`);
            if (response?.status === 200) {
                setUserData(response?.data?.data);
                setIsLoading(false)
                if (response?.data?.data?.is_clinic_admin == 1) {
                    setAdminClinic(true)
                }
                else {
                    setAdminClinic(false)
                }
            }
            else {
                setIsLoading(false)
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false)
        }
    };


    useEffect(() => {
        let checkViewClinic = userPermissions?.find((item) => item.slug === "clinic_configuration_view");
        let checkViewMedicines = userPermissions?.find((item) => item.slug === "add_medicine_view");
        let checkViewLabs = userPermissions?.find((item) => item.slug === "add_lab_test_view");
        let checkViewLabs1 = userPermissions?.find((item) => item.slug === "add_procedure_view");
        let checkViewLabs2 = userPermissions?.find((item) => item.slug === "appointment_form_view");
        let checkViewLabs3 = userPermissions?.find((item) => item.slug === "sms_setting_view");
        let checkViewLabs4 = userPermissions?.find((item) => item.slug === "add_role_view");
        let checkViewLabs5 = userPermissions?.find((item) => item.slug === "prescription_page_setting_view");

        if (checkViewClinic && Object.keys(checkViewClinic)?.length > 0) {
            setViewClinic(true)
        }
        if (checkViewMedicines && Object.keys(checkViewMedicines)?.length > 0) {
            setViewMedicines(true)
        }
        if (checkViewLabs && Object.keys(checkViewLabs)?.length > 0) {
            setViewLab(true)
        }
        if (checkViewLabs1 && Object.keys(checkViewLabs1)?.length > 0) {
            setShowProcedure(true)
        }
        if (checkViewLabs2 && Object.keys(checkViewLabs2)?.length > 0) {
            setShowAppointment(true)
        }
        if (checkViewLabs3 && Object.keys(checkViewLabs3)?.length > 0) {
            setShowSms(true)
        }
        if (checkViewLabs4 && Object.keys(checkViewLabs4)?.length > 0) {
            setShowRole(true)
        }
        if (checkViewLabs5 && Object.keys(checkViewLabs5)?.length > 0) {
            setShowPrint(true)
        }
    }, [userPermissions])


    return (<>
        {isLoading ?
            <Loader />
            : (<>
                {isMobile ?
                    <WraperLayout className="settings">
                        <div className="setting-wrap">
                            <Tabs activeKey={activeTab} defaultActiveKey="1" items={adminClinic ? items : items2} onChange={(key) => setActiveTab(key)} />
                        </div>
                    </WraperLayout>
                    :
                    <WraperLayout className="settings">
                        <div className="setting-wrap">
                            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                        </div>
                    </WraperLayout>
                }
            </>)
        }
    </>)
}

export default Settings;
