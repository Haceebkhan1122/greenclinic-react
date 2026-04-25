import './toast.scss';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Toast = () => {
    const message = Cookies.get("message")
    let themeStyle = useSelector((state) => state.themeStyle.themeStyle);
    let themeColor = themeStyle?.color ? themeStyle?.color : "#0F75BC";

    const {pathname} = useLocation();

    return (
        <div className={pathname == "/" ? 'toast-wraper' : "d-none"} style={{ backgroundColor: themeColor }}>
            <span> {message}  </span>
        </div>
    )
}

export default Toast;
