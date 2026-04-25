/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import './dropzoneHealthRecord.scss';
import pdfImg from '../../assets/images/svg/pdfSvg.svg';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const DropzoneHealthRecord = ({ files, setFiles, pdfFile, setPdfFile, viewPdf, setViewPdf, singlePdfFile,  setSinglePdfFile}) => {

    const onDrop = (acceptedFiles) => {
        const pdf = acceptedFiles.find((file) => file.type == "application/pdf");
        setFiles((prev) => [...prev, ...acceptedFiles]);
        if (pdf) {
            const pdfBlobUrl = URL.createObjectURL(pdf);
            setPdfFile(pdfBlobUrl);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        multiple: true,
    });

    const handleRemoveFile = (event, index) => {
        event.stopPropagation();
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const handleView = async (e, index, file) => {
        e.stopPropagation();
        let url = URL.createObjectURL(file);
        await setSinglePdfFile(url)
        setViewPdf(true);
    }

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="wrape_upload">
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
                {files?.length > 0 ?
                    <div className="wrape_uploadedFiles">
                        {files.map((file, index) => (
                            <div className="singleFilePdf" key={index} >
                                <img src={pdfImg} alt="" />
                                <span className="crossICon" onClick={(event) => handleRemoveFile(event, index)}>  </span>
                                <h3>{file.name}</h3>
                                <div className="arrowWraper" onClick={(e) => { handleView(e, index, file) }}>
                                    <span className="arrowRight"></span>
                                    <h5> VIEW </h5>
                                </div>
                            </div>
                        ))}
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

export default DropzoneHealthRecord;
