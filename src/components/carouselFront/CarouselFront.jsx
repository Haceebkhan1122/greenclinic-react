import React from 'react'
import { Carousel } from 'antd';
import slider1 from '../../assets/images/png/slider1.png';
import slider2 from '../../assets/images/png/slider2.png';
import slider3 from '../../assets/images/png/slider3.png';

const CarouselFront = () => {
  return (
    <Carousel autoplay>
      <div>
        <h3>Patient Management</h3>
        <p>Manage patient profiles, medical histories, and records at your fingertips. Ensure efficient and error-free data storage for seamless patient care.</p>
        <img className='img1' src={slider1} alt="slider1" />
      </div>
      <div>
        <h3>Billing Management</h3>
        <p>Effortlessly handle all financial transactions and maintain accurate records. Streamline invoicing, receipts, and other billing needs with ease.</p>
        <img className='img2' src={slider2} alt="slider" />
      </div>
      <div>
        <h3>Appointment Management</h3>
        <p>Schedule, modify, and monitor appointments with ease. Enhance the patient experience with timely reminders and efficient time slot allocation.</p>
        <img className='img3' src={slider3} alt="slider3" />
      </div>
    </Carousel>
  )
}

export default CarouselFront