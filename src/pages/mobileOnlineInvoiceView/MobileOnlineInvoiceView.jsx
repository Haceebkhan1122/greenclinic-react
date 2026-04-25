import React from 'react'
import './mobileOnlineInvoiceView.scss';
import { useLocation } from 'react-router-dom';

const MobileOnlineInvoiceView = () => {
    const location = useLocation();
    let items = location?.state?.item;

    return (
        <div className='wraper_mobile_view'>
            sadasdasd asdasd 
            asdasdsad
        </div> 
    )
}

export default MobileOnlineInvoiceView;
