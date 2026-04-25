import React, { useEffect, useState } from 'react'
import WraperLayout from '../../components/wraperLayout/WraperLayout'
import { Tabs } from 'antd';
import "./myProfileUpdate.scss"
import ClinicDetails from '../../components/profileUpdate/clinicDetails/ClinicDetails';
import OnlineProfile from '../../components/profileUpdate/onlineProfile/OnlineProfile';
import MyReviews from '../../components/profileUpdate/myReviews/MyReviews';
import API from '../../services/httpInstance';
import { profileSuccess } from '../../redux/slices/updateProfileSlice';
import { useDispatch, useSelector } from 'react-redux';

const MyProfileUpdate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [detailsDoctor, setDetailsDoctor] = useState({})
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [allowedPermissions, setAllowedPermissions] = useState({});
    const [viewProfile, setViewProfile] = useState(false)
    let userPermissions = useSelector((state) => state.clinic.userPermissions);
    
    useEffect(() => {
        const viewPermission = userPermissions?.find((item) => item.slug === "update_user_profile");
        if (viewPermission && Object.keys(viewPermission).length > 0) {
            setViewProfile(true)
        }
        else {
            setViewProfile(false)
            window.location.href = "/"; 
        }
    }, [userPermissions]);

    useEffect(() => {
        getDetailsDoctor();
    }, [])

    const dispatch = useDispatch(); 

    const getDetailsDoctor = async () => {
        try {
            setIsLoading(true) 
            const response = await API.get("/update-profile");
            if (response?.status == 200) {
                setDetailsDoctor(response?.data?.data);
                setPhoneNumber(response?.data?.data?.user?.phone)
                setIsLoading(false)
                dispatch(profileSuccess(response?.data?.data));
            }
            else {
                setDetailsDoctor({});
                setPhoneNumber(null);
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            setDetailsDoctor({});
            setPhoneNumber(null)
            console.log("error",error)
        }
    }

    const onChange = (key) => {
    };

    const items = [
        {
            key: '1',
            label: 'Clinic Details',
            children: <ClinicDetails detailsDoctor={detailsDoctor} setDetailsDoctor={setDetailsDoctor} isLoading={isLoading} setIsLoading={setIsLoading} getDetailsDoctor={getDetailsDoctor} />,
        },
        {
            key: '2',
            label: 'Online Profile',
            children: <OnlineProfile detailsDoctor={detailsDoctor}  phoneNumber={phoneNumber} />,
        },
        {
            key: '3',
            label: 'My Reviews',
            children: <MyReviews detailsDoctor={detailsDoctor} />,
        },
    ];


    return (
        <WraperLayout className="profile-update">
            <div className="profileUpdate-wrap">
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>
        </WraperLayout>
    )
}

export default MyProfileUpdate