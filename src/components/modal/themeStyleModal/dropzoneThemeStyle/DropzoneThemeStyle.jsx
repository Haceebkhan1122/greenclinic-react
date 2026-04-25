import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import './dropzoneThemeStyle.scss';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const DropzoneThemeStyle = ({ setFiles }) => {
    const [uploadedFile, setUploadedFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const previewUrl = URL.createObjectURL(file);
            setFiles(previewUrl);
            setUploadedFile({
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2), // Convert size to MB
                preview: previewUrl,
            });
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        setFiles(null);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
    });

    return (
        <div className="dropzoneThemeStyle">
            {!uploadedFile ? (
                <div
                    {...getRootProps()}
                    style={{
                        border: "2px dashed #007bff",
                        borderRadius: "5px",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                >
                    <input {...getInputProps()} />
                    <div className='react-info-wrap'>
                        <span className='icon_uplo'></span>
                        <p className="ant-upload-text">Drag and Drop to upload files </p>
                        <button className='browseBtn'> Browse File </button>
                    </div>
                </div>
            ) : (
                <div className="file-preview">
                    <div className="file-info">
                            <span className="file-icon"><svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
                                <path d="M11.375 25.4375H22.625V22.625H11.375V25.4375ZM11.375 19.8125H22.625V17H11.375V19.8125ZM8.5625 31.0625C7.78906 31.0625 7.12695 30.7871 6.57617 30.2363C6.02539 29.6855 5.75 29.0234 5.75 28.25V5.75C5.75 4.97656 6.02539 4.31445 6.57617 3.76367C7.12695 3.21289 7.78906 2.9375 8.5625 2.9375H19.8125L28.25 11.375V28.25C28.25 29.0234 27.9746 29.6855 27.4238 30.2363C26.873 30.7871 26.2109 31.0625 25.4375 31.0625H8.5625ZM18.4062 12.7813V5.75H8.5625V28.25H25.4375V12.7813H18.4062Z" fill="#5F6368" />
                            </svg></span>
                        <div className="file-details">
                            <p className="file-name">{uploadedFile.name}</p>
                            <p className="file-size">{uploadedFile.size} MB</p>
                        </div>
                        <button className="delete-btn" onClick={removeFile}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1.625 12.5L7.25 6.875L12.875 12.5M12.875 1.25L7.24893 6.875L1.625 1.25" stroke="#FC5C5C" stroke-width="1.875" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropzoneThemeStyle;
