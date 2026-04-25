import React from 'react'
import './CheckInModal.scss';
import { Modal } from 'antd';

const CheckInModal = ({ checkInModal, setCheckInModal, confirmId, checkInpastAppointments }) => {

  
  return (
    <div>
      <Modal
        title=""
        className='checkinModal'
        centered
        open={checkInModal}
        onCancel={() => setCheckInModal(false)}
        footer={(
          <div className='footerBtns'>
            <button className='button1' onClick={() => setCheckInModal(false)}>No</button>
            <button onClick={() => checkInpastAppointments(confirmId)} className='button2'>Yes</button>
          </div>
        )}
      >
        <p>Are you sure you want to Checkin?</p>
      </Modal>
    </div>
  )
}

export default CheckInModal