import { useState } from "react";
import { Modal } from "react-bootstrap"
import Welcome from '../../../assets/images/png/welcome.png';
import { Link } from "react-router-dom";
import "./welcomeModal.scss"

const WelcomeUser = ({ userData, showWelcome, handleCloseWelcome, setShowWelcome }) => {

    return (
        <Modal show={showWelcome} onHide={handleCloseWelcome} centered className="welcomeUser">
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseWelcome}></span>
                <img src={Welcome} alt="" className="welcomePng" />
                <h3> Welcome Onboard ! </h3>
                <h5> Dr. {userData?.first_name} </h5>
                <p> Please set up your clinic before proceeding with appointments </p>
                <div className="wraper_btns">
                    <Link to="/settings" className="button2"> Go to Settings </Link>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default WelcomeUser;