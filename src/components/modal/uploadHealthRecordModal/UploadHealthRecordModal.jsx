import { Modal } from 'react-bootstrap';
import './uploadHealthRecordModal.scss';
import { Divider } from 'antd';
import { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import DropzoneHealthRecord from '../../dropzoneHealthRecord/DropzoneHealthRecord';
import API from '../../../services/httpInstance';
import { useSelector } from 'react-redux';
import { ConsoleSqlOutlined } from '@ant-design/icons';

const UploadHealthRecordModal = ({ showHealthRecord, patientId, handleCloseHealthModal, uploadRecord, getPatientHealthRecords, patientData }) => {
  const [files, setFiles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [viewPdf, setViewPdf] = useState(false);
  const [singlePdfFile, setSinglePdfFile] = useState([]);
  const [fileName, setFileName] = useState("");
  let clinicDetails = useSelector((state) => state?.clinic?.clinicDetails);
  const saveHealthRecord = async () => {
    const formData = new FormData();
    if (uploadRecord?.id) {
      formData.append('prescribed_lab_id', uploadRecord?.id);
    }
    else {
      formData.append('check_id', '1');
    }
    formData.append('appointment_id', uploadRecord?.id || patientData?.id);
    formData.append('clinic_id', uploadRecord?.clinicId || patientData?.clinic_id);
    formData.append('patient_id', uploadRecord?.patientId || patientData?.id);
    formData.append('name', fileName);
    formData.append('note', 'abc');

    files.forEach(file => {
      formData.append('upload_lab_result[]', file);
    });

    try {
      const response = await API.post('/upload-lab-result', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensures the request is sent as form data
        },
      });
      handleCloseHealthModal()
      await getPatientHealthRecords()
      console.log({ response });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setFileName("")
  }, [showHealthRecord])

  return (
    <Modal show={showHealthRecord} onHide={handleCloseHealthModal} centered className="UploadHealthRecordModal" backdropClassName="custom-backdrop">
      <Modal.Body>
        {viewPdf
          ?
          <span className="crossBtnModal" onClick={() => setViewPdf(false)}></span>
          :
          <span className="crossBtnModal" onClick={handleCloseHealthModal}></span>
        }
        {viewPdf ?
          <img src={singlePdfFile} alt="" className='image_view' />
          //    <embed
          //    src={singlePdfFile}
          //    type="application/pdf"
          //    width="100%"
          //    height="100%"
          //  />
          :
          <>
            <h2> Upload </h2>
            <Divider />
            <div className="single customInp">
              <label htmlFor="">File Name </label>
              <input value={fileName} onChange={(e) => setFileName(e.target.value)} type="text" placeholder="Enter File Name" />
            </div>
            <DropzoneHealthRecord files={files} setFiles={setFiles} pdfFile={pdfFile} setPdfFile={setPdfFile} viewPdf={viewPdf} setViewPdf={setViewPdf} singlePdfFile={singlePdfFile} setSinglePdfFile={setSinglePdfFile} />
            <div className="wraper_btns">
              <button onClick={saveHealthRecord} className="button2"> SAVE </button>
            </div></>}
      </Modal.Body>
    </Modal>
  )
}

export default UploadHealthRecordModal;
