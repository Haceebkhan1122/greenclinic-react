import React, { useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import './reqUpgradeModal.scss';
import { Divider, Upload, message } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import DropzoneRequestUpgrade from './dropzoneRequestUpgrade/DropzoneRequestUpgrade';
import { toast } from 'react-toastify';
import API from '../../../services/httpInstance';
import Loader from '../../loader/Loader';

const ReqUpgradeModal = ({ showUpgrade, handleCloseUpgrade }) => {
    const [cameraClicked, setCameraClicked] = useState(false);
    const [filesImage, setFilesImage] = useState(null);
    const [tier, setTier] = useState("");
    const [capturedImg, setCapturedImg] = useState("");
    const [firstOption, setFirstOption] = useState(false);
    const [tierData, setTierData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [indicationMessage, setIndicationMessage] = useState("")

    const { Dragger } = Upload;

    const optionsUpload = {
        name: 'file',
        multiple: true,
        beforeUpload: (file) => {
            const isPNG = file.type === 'image/png';
            const isJPG = file.type === 'image/jpeg';
            if (!isPNG || !isJPG) {
                message.error(`${file.name} is not a png file`);
            }
            return (isPNG || isJPG) || Upload.LIST_IGNORE;
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleChange = (e) => {
        const { value, name, checked } = e.target;
        if (name == "tier") {
            errorObj.tier = ""
            setTier(value);
        }
    }

    function handleTakePhoto(dataUri) {
        setCapturedImg(dataUri);
        if (dataUri) {
            setCameraClicked(false);
        }
    }

    const hanldeCrossClicked = () => {
        setCameraClicked(false);
        setFirstOption(false)
    }


    const hanldeCameraClicked = () => {
        if (filesImage == null) {
            setCameraClicked(true);
            setFirstOption(true);
        }
        else {
            toast.error("You can only choose one Either Upload Photo or Take Photo")
            setFirstOption(false);
        }
    }

    const getTier = async () => {
        try {
            setIsLoading(true)
            const response = await API.get("/sms-plan-lists");
            if (response?.status == 200) {
                setIsLoading(false)
                setTierData(response?.data?.data);
            }
            else {
                setIsLoading(false)
                toast.error(response?.data?.message);
            }
        } catch (error) {
            toast.error("error in buckets")
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getTier();
    }, [])

    const payload = {
        bucket_id: tier,
    }

    if (capturedImg) {
        payload.fileData = capturedImg;
    } else if (filesImage) {
        payload.fileData = filesImage;
    }

    const handleSaveRequest = async () => {
        const formData = new FormData();
        formData.append("bucket_id", tier);
        if (capturedImg) {
            formData.append("fileData", new Blob([capturedImg], { type: "image/png" }), "image.png");
        } else if (filesImage) {
            formData.append("fileData", new Blob([filesImage], { type: "image/png" }), "image.png");
        }
        try {
            setIsLoading(true);
            const response = await API.post("/add-plan-request", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response?.status === 200) {
                toast.success(response?.data?.message);
                handleCloseUpgrade();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    };

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new Blob([arrayBuffer], { type: mimeString });
    };

    const createPayload = () => {
        const payload = new FormData();
        payload.append("bucket_id", tier);
        if (capturedImg) {
            const blob = dataURItoBlob(capturedImg);
            payload.append("fileData", blob, "image.png");
        } else if (filesImage) {
            payload.append("fileData", filesImage); 
        }
        return payload;
    };

    const [errorObj, setErrorObj] = useState({})

    useEffect(() => {
        let timeOut = setTimeout(() => {
            setIndicationMessage("");
        }, 2000);

        return (() => clearTimeout(timeOut));
    }, [indicationMessage])

    const downloadAPI = async () => {
        let errors = {}
        if(!tier) errors.tier = "Select Tier"
        try {
            const tierId = btoa(tier);
            setIsLoading(true)
            const response = await API.get(`download-payment-invoice/${tierId}`);
            if (response?.status === 200) {
            setIsLoading(false)
                setIndicationMessage(response?.data?.message);
                const fileUrl = response?.data?.data; 
                if (fileUrl) {
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.setAttribute('download', 'clinic_reports.csv'); 
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    setIsLoading(false)
                    throw new Error("File URL not found");
                }
            } else {
                setIndicationMessage("Download Error")
            setIsLoading(false)

            }
        } catch (error) {
            setIndicationMessage("Download Error")
            setIsLoading(false)
        }
        setErrorObj(errors);
    };

    return (
        <>
        {isLoading ? <Loader />
                :
        <Modal show={showUpgrade} onHide={handleCloseUpgrade} centered className="reqUpgradeModal">
            {indicationMessage !== "" && <div className="showPoup">
                {indicationMessage}
            </div>}
            <Modal.Body>
                <span className="crossBtnModal" onClick={handleCloseUpgrade}></span>
                <h3> Request Upgrade </h3>
                <Divider />
                <div className="single_field customSelect">
                    <label htmlFor="">Select Tier </label>
                    <Form.Select aria-label="Default select example" name='tier' value={tier} onChange={handleChange}>
                        <option value="" hidden >Select Plan </option>
                        {tierData?.map((item) => {
                            return (<>
                                <option value={item?.id} > {item?.name} </option>
                            </>)
                        })}
                    </Form.Select>
                </div>
                <span className='error'> {errorObj.tier} </span>
                <div className={"uploadWraperRequest"}>
                    <DropzoneRequestUpgrade files={filesImage} setFirstOption={setFirstOption} setFiles={setFilesImage} firstOption={firstOption} />
                </div>
                {cameraClicked ?
                    <div className="cameraWrapingWhole">
                        <div className='wrapeClose'>
                            <span className="closeIconsd" onClick={hanldeCrossClicked}> X </span>
                        </div>
                        <Camera
                            onTakePhoto={(dataUri) => { handleTakePhoto(dataUri); }}
                        />
                    </div>
                    :
                    <div className="cameraWraping" onClick={hanldeCameraClicked}>
                        <span className='iconCamera'></span>
                        <h3> Use Camera to Take Photo </h3>
                        {capturedImg !== "" && <img src={capturedImg} alt="" className='capturedImg' />}
                    </div>
                }
                <div className="wrape_btns">
                    <button onClick={downloadAPI}> INVOICE </button>
                    <button onClick={handleSaveRequest}>  SEND REQUEST </button>
                </div>
            </Modal.Body>
        </Modal>
        }
        </>
    )
}

export default ReqUpgradeModal;
