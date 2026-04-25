import { useLockBodyScroll } from '@uidotdev/usehooks';
import './updatePopper.scss';
import { Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useEffect, useState } from 'react';
import API from '../../services/httpInstance';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const UpdatePopper = ({ allFeature, unreadFeatures, setNotificationCount, notificationCount, getNotification }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";

    const getUserReadStatus = async () => {
        try {
            const response = await API.get("/notification-read-status")
            if (response.status == 200) {
                setNotificationCount(0);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleTabSelect = (key) => {
        setActiveTab(key);
        if (key === "unread") {
            getUserReadStatus();
        }
    };

    useEffect(() => {
        getNotification()
    }, [notificationCount])

    useLockBodyScroll()

    const hidePopperOnNotification = () => {
        Cookies.set('toNotification', 1);
        setTimeout(() => {
            if (Cookies.get('toNotification')) {
                navigate('/update-notification');
            }
        }, 100);
    };

    return (
        <div className="updateContent">
            <div className="updateContentWraper">
                <span onClick={() => hidePopperOnNotification()} className="viewText"> View All </span>
                <h3> Updates </h3>
                <Tabs
                    defaultActiveKey="all"
                    activeKey={activeTab}
                    onSelect={handleTabSelect}
                    id="uncontrolled-tab-example"
                    className="mb-3"
                >
                    <Tab eventKey="all" title="All">
                        <div className='notification-scroll'>
                            {allFeature?.length > 0 ? (
                                allFeature?.map((item) => (
                                    <div className="wraper_notifications" key={item?.id}>
                                        <div className="singleNotification">
                                            <h4> {item?.feature_upload?.notification_text} </h4>
                                            <p className='mb-0'> {moment(item?.created_at).format('MMM D, YYYY')} <span className="newIcon"></span> </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="noUpdates">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" fill="none">
                                            <path d="M31.5 23.25V19.75H38.5V23.25H31.5ZM33.6 35.5L28 31.3L30.1 28.5L35.7 32.7L33.6 35.5ZM30.1 14.5L28 11.7L33.6 7.5L35.7 10.3L30.1 14.5ZM8.75 33.75V26.75H7C6.0375 26.75 5.21354 26.4073 4.52812 25.7219C3.84271 25.0365 3.5 24.2125 3.5 23.25V19.75C3.5 18.7875 3.84271 17.9635 4.52812 17.2781C5.21354 16.5927 6.0375 16.25 7 16.25H14L22.75 11V32L14 26.75H12.25V33.75H8.75ZM19.25 25.7875V17.2125L14.9625 19.75H7V23.25H14.9625L19.25 25.7875ZM24.5 27.3625V15.6375C25.2875 16.3375 25.9219 17.1906 26.4031 18.1969C26.8844 19.2031 27.125 20.3042 27.125 21.5C27.125 22.6958 26.8844 23.7969 26.4031 24.8031C25.9219 25.8094 25.2875 26.6625 24.5 27.3625Z" fill={themeColor} />
                                        </svg>
                                    <h4> No Updates to show </h4>
                                </div>
                            )}
                        </div>
                    </Tab>
                    <Tab eventKey="unread" title="Unread">
                        {unreadFeatures?.length > 0 ? (
                            unreadFeatures?.map((item) => (
                                <div className="wraper_notifications" key={item?.id}>
                                    <div className="singleNotification">
                                        <h4> {item?.feature_upload?.notification_text} </h4>
                                        <p className='mb-0'> {moment(item?.created_at).format('MMM D, YYYY')} <span className="newIcon"></span> </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="noUpdates">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" fill="none">
                                        <path d="M31.5 23.25V19.75H38.5V23.25H31.5ZM33.6 35.5L28 31.3L30.1 28.5L35.7 32.7L33.6 35.5ZM30.1 14.5L28 11.7L33.6 7.5L35.7 10.3L30.1 14.5ZM8.75 33.75V26.75H7C6.0375 26.75 5.21354 26.4073 4.52812 25.7219C3.84271 25.0365 3.5 24.2125 3.5 23.25V19.75C3.5 18.7875 3.84271 17.9635 4.52812 17.2781C5.21354 16.5927 6.0375 16.25 7 16.25H14L22.75 11V32L14 26.75H12.25V33.75H8.75ZM19.25 25.7875V17.2125L14.9625 19.75H7V23.25H14.9625L19.25 25.7875ZM24.5 27.3625V15.6375C25.2875 16.3375 25.9219 17.1906 26.4031 18.1969C26.8844 19.2031 27.125 20.3042 27.125 21.5C27.125 22.6958 26.8844 23.7969 26.4031 24.8031C25.9219 25.8094 25.2875 26.6625 24.5 27.3625Z" fill={themeColor} />
                                    </svg>
                                <h4> No Updates to show </h4>
                            </div>
                        )}
                    </Tab>
                </Tabs >
            </div >
        </div >
    )
}

export default UpdatePopper
