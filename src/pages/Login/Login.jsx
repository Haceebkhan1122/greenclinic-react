import WraperLayout from '../../components/wraperLayout/WraperLayout';
import './login.scss';
import { Row, Col } from 'react-bootstrap';
// import Logo from '../../assets/images/png/logoGreen.png';
import Logo from '../../assets/images/png/ms_pro.png'
import CarouselFront from '../../components/carouselFront/CarouselFront';
import { useState, useEffect } from 'react';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../../services/httpInstance/index';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import Cookies from 'js-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/loginSlice';
const LoginPage = () => {
  const [isName, setIsName] = useState("")
  const [isPassword, setIsPassword] = useState("")
  const [indicationMessage, setIndicationMessage] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const loginAPI = async () => {
    try {
      const data = {
        email: isName,
        password: isPassword,
      }
      const res = await API.post(`/login`, data)
      if (res?.status === 200) {
        Cookies.set('Authorization', `Bearer ${res?.data?.data?.token}`)
        dispatch(loginSuccess(res?.data?.data));
        if(res?.data?.data?.['clinic-list'] === true){
          navigate('/select-clinic')
        } else {
          navigate('/')
        }
      } else if (res?.data?.status == 402) {
        setIndicationMessage(res?.data?.message)
      } else {
        setIndicationMessage(res?.data?.message)
      }
    } catch (error) {
      console.log(error)
      setIndicationMessage('An error occurred. Please try again later.')
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    loginAPI()
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };
  const handleForgetPassword = async () => {
    const payload = {
      email: isName
    }
    try {
      const res = await API.post(`/forget-password`, payload)
      if (res?.status == 200) {
        setIndicationMessage(res?.data?.message);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 2000);
    return (() => clearTimeout(timeOut));
  }, [indicationMessage])
  return (
    <>
      <WraperLayout className={"loginPage"}>
        {indicationMessage !== "" && <div className="showPoup">
          {indicationMessage}
        </div>}
        <Row>
          <Col lg={6}>
            <div className="left-wrap">
              <CarouselFront />
            </div>
          </Col>
          <Col lg={6}>
            <div className="right-wrap">
              <Row className="align-items-center">
                <Col lg={8}>
                  <div className="log-img">
                    <img src={Logo} alt="" />
                  </div>
                  <div className="text">
                    <h3>Let’s Get Started</h3>
                    <p>Enter your credentials to login to your clinic</p>
                  </div>
                  <div className="otp-form number">
                    <div className="single_field">
                      <input type="text" placeholder='Enter your user name or email' value={isName} onChange={(e) => setIsName(e.target.value)} onKeyDown={handleKeyDown} />
                    </div>
                    <div className="single_field">
                      <Input.Password className="mb-2"
                        placeholder="Enter your password"
                        name='password'
                        maxLength={50}
                        value={isPassword}
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setIsPassword(e.target.value)}
                        iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                      />
                      <a onClick={handleForgetPassword} className='ps-3'>Forget password?</a>
                    </div>
                    <div className="form-button">
                      <button type="submit" className="green-main-btn" onClick={handleSubmit}>LOGIN</button>
                    </div>
                    <p className="dont-account">Don’t have an account? <Link to="/register">Signup here</Link> </p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </WraperLayout>
    </>
  )
}
export default LoginPage;