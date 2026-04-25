import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import "./uploadImageModal.scss";
import API from '../../../services/httpInstance';
import { toast } from 'react-toastify';

const UploadImageModal = ({
  uploadImageShow,
  handleUploadImageClose,
  patientId,
  appointmentId,
  getCombinedCurrentLabs,
  investigationName,
  getCurrentLab,
  clinicId,
  note,
  investigationId,
  onImageUpload
}) => {
  const [nameTitle, setNameTitle] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [nameTitleError, setNameTitleError] = useState(null);
  const [uploadLabResult, setUploadLabResult] = useState(null);
  const [headerImg, setHeaderImg] = useState(null);

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile); // Ensure only 1 file is selected
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile); // Ensure only 1 file is selected
    }
  };

  // Process selected file (single file only)
  const handleFileSelect = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (validTypes.includes(file.type)) {
      setFile(file);
      setFilePreview(URL.createObjectURL(file));
      setUploadLabResult(file);
      readBinaryData(file); // Read as binary when valid
    } else {
      console.log('Invalid file type. Please upload a valid image (JPEG, PNG, GIF) or PDF.');
      setFile(null);
      setFilePreview(null);
      setUploadLabResult(null);
      setHeaderImg(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    setUploadLabResult(null);
    setHeaderImg(null);
    console.log(null);
  };

  const readBinaryData = (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const binaryData = reader.result;
      setHeaderImg(binaryData);
    };
  };

  // Submit the form with the payload
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    if (!file) {
      return;
    } else if (!nameTitle) {
      setNameTitleError("The name field is required.")
      hasError = true;
    } else {
      setNameTitleError("")
    }

    const formData = new FormData();
    formData.append("prescribed_lab_id", investigationId);
    formData.append("appointment_id", appointmentId);
    formData.append("clinic_id", clinicId);
    formData.append("patient_id", patientId);
    formData.append("name", nameTitle);
    formData.append("note", note);

    formData.append("upload_lab_result[]", file);

    try {
      const response = await API.post("/upload-lab-result", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status == 200) {
        handleUploadImageClose();
        onImageUpload();
        setFile(null);
        setFilePreview(null);
        setNameTitle("");
        setNameTitleError("");
        getCurrentLab()
        getCombinedCurrentLabs()
        toast.success(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      } else {
        toast.error(response?.data?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (investigationName) {
      setNameTitle(investigationName);
    }
  }, [investigationName]);

  return (
    <Modal className='upload_image' show={uploadImageShow} onHide={handleUploadImageClose}>
      <button onClick={handleUploadImageClose} className="close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
        </svg>
      </button>
      <Modal.Body>
        <h4>Upload</h4>
        <form id="uploadForm" className="fileForm form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              maxLength={30}
              className="form-control upload-name"
              readOnly
              id="labTitle"
              value={nameTitle}
              onChange={(e) => setNameTitle(e.target.value)}
            />
            {nameTitleError && (
              <p style={{ color: 'red' }}>{nameTitleError}</p>
            )}
          </div>

          <div
            className="drop-area"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {file ? (
              <div className='position-relative'>
                {filePreview && (
                  <div className='file-preview'>
                    <img src={filePreview} alt="File preview" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className='button-remove'
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z" fill="#313131" stroke="white" stroke-width="0.375" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <h3>Drag & Drop to Upload File</h3>
                <p>OR</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className='input-file'
                  id="fileInput"
                />
                <label htmlFor="fileInput" className='file-label'>
                  Browse File
                </label>
              </>
            )}
          </div>
          <button type="submit" className="button2">
            SAVE
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default UploadImageModal;
