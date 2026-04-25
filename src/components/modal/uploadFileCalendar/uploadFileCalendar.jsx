import React, { useEffect, useState } from 'react'
import API from '../../../services/httpInstance';
import { Modal } from 'react-bootstrap';
import './uploadFileCalendar.scss';
import DropzoneHealthRecord from '../../dropzoneHealthRecord/DropzoneHealthRecord';
import { Divider } from 'antd';

const UploadFileCalendar = ({ showHealthRecord, handleCloseHealthModal, uploadRecord }) => {
  const [files, setFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [viewPdf, setViewPdf] = useState(false);
  const [singlePdfFile, setSinglePdfFile] = useState({})
  const [fileName, setFileName] = useState('');
  console.log(uploadRecord)

  const saveHealthRecord = async () => {
    const formData = new FormData();
    formData.append("prescribed_lab_id", '');
    formData.append("appointment_id", uploadRecord?.id || uploadRecord?.appointmentId);
    formData.append("clinic_id", uploadRecord?.clinic_id || uploadRecord?.clinicId);
    formData.append("patient_id", uploadRecord?.patient_id || uploadRecord?.patientId);
    formData.append("name", fileName);
    formData.append("note", "abc");

    files.forEach((file) => {
      formData.append("upload_lab_result[]", file);
    });

    try {
      const response = await API.post("/upload-lab-result", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(response?.status == 200){
        handleCloseHealthModal()
      }
    } catch (error) {
      console.log("Upload error:", error);
    }
  };
  return (
    <Modal show={showHealthRecord} onHide={handleCloseHealthModal} centered className="UploadHealthRecordModal">
      <Modal.Body>
        {viewPdf ? (
          <span className="crossBtnModal" onClick={() => setViewPdf(false)}></span>
        ) : (
          <span className="crossBtnModal" onClick={handleCloseHealthModal}></span>
        )}
        {viewPdf ? (
          <img src={singlePdfFile} alt="" className='upload_view' />
          // <embed src={singlePdfFile} type="application/pdf" width="100%" height="100%" />
        ) : (
          <>
            <h2> Upload </h2>
            <Divider />
            <div className="single customInp">
              <label htmlFor="">File Name</label>
              <input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                type="text"
                placeholder="Enter File Name"
              />
            </div>
            <DropzoneHealthRecord
              files={files}
              setFiles={setFiles}
              pdfFile={pdfFile}
              setPdfFile={setPdfFile}
              viewPdf={viewPdf}
              setViewPdf={setViewPdf}
              singlePdfFile={singlePdfFile}
              setSinglePdfFile={setSinglePdfFile}
            />
            <div className="wraper_btns">
              <button onClick={saveHealthRecord} className="button2">
                SAVE
              </button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UploadFileCalendar 