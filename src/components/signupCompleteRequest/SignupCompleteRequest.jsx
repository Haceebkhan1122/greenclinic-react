import './signupCompleteRequest.scss';
import bgImg from '../../assets/images/png/signupBg.png';
import bgImg1 from '../../assets/images/png/sign.png';
import { useNavigate } from 'react-router-dom';

const SignupCompleteRequest = () => {

    const navigate = useNavigate();

    return (
        <section className='signupCompleteRequest'>
            <img src={bgImg1} alt='' />
            <div className="reqCard">
                <h4>
                Your Request has been <br />
                submitted successfully.
                </h4>
                <p> One of our representative will contact you <br /> soon. </p>
                <button onClick={() => navigate("/login")}> GO TO HOME </button>
            </div>
        </section>
    )
}

export default SignupCompleteRequest;
