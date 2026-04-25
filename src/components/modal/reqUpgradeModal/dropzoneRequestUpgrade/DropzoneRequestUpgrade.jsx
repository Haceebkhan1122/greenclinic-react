/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import './dropzoneRequestUpgrade.scss';
import { toast } from "react-toastify";

const DropzoneRequestUpgrade = ({ files, setFiles,setFirstOption, pdfFile, setPdfFile, viewPdf, firstOption, setViewPdf, singlePdfFile,  setSinglePdfFile}) => {
    const [viewImg, setViewImg] = useState(null)

    const onDrop = (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;
        const imageFile = acceptedFiles[0]; 
        setViewImg(imageFile);
        const reader = new FileReader();
        reader.readAsArrayBuffer(imageFile); 
        reader.onloadend = () => {
            const binaryData = reader.result;
            setFiles(binaryData); 
        };
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        multiple: false,
    });

    const handleRemoveFile = (event, index) => {
        event.stopPropagation();
        setFiles(null);
        setFirstOption(false)
        setViewImg(null)
    };

    const handleView = async () => {
        e.stopPropagation();
        let url = URL.createObjectURL(viewImg);
        await setSinglePdfFile(url)
        setViewPdf(true);
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="dropzoneRequestUpgrade">
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
                <input {...getInputProps()}  disabled={firstOption} />
                {viewImg ?
                    <div className="wrape_uploadedFiles">
                        <div className="singleFilePdf" >
                            <img src={""} alt="" />
                            <span className="crossICon" onClick={handleRemoveFile}>  </span>
                            <h3>{viewImg.name}</h3>
                            <div className="arrowWraper" onClick={(e)=> {handleView(e)}}>
                                <span className="arrowRight"></span>
                                <h5> VIEW </h5>
                            </div>
                        </div>
                    </div>
                    : <div className='react-info-wrap'>
                        <span className='icon_uplo'></span>
                        <p className="ant-upload-text">Drag and Drop to upload files </p>
                        <span className='orText'> OR </span>
                        <button className='browseBtn'> Browse File </button>
                    </div>}
            </div>
        </div>
    );
};

export default DropzoneRequestUpgrade;
