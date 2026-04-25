import React, { useEffect, useState } from 'react';
import './tokenPrintSetting.scss';
import { Row, Col, Form, Modal } from 'react-bootstrap'
import PresTemplate from "../../../../assets/images/png/pres_template.png";
import InvoiceTemplate from "../../../../assets/images/png/invoice_template.png"
import API from '../../../../services/httpInstance';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';
import { Button, Upload } from 'antd';
import { ConsoleSqlOutlined, UploadOutlined } from '@ant-design/icons';

const TokenPrintSetting = () => {
  const [pageSelect, setPageSelect] = useState(0)
  const [modalView, setModalView] = useState(false);
  const [tokenPrintSettings, setTokenPrintSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPageType, setSelectedPageType] = useState("letterhead")
  const [templateURL, setTemplateURL] = useState(InvoiceTemplate);
  const [selectedTokenPrint, setSelectedTokenPrint] = useState(null)
  const [indicationMessage, setIndicationMessage] = useState("");
  const [printerToken, setPrinterToken] = useState("")
  const [errorObj, setErrorObj] = useState({})
  const [firstSignature, setFirstSignature] = useState({})
  const [secondSignature, setSecondSignature] = useState({})
  const [logoType, setLogoType] = useState("")

  
  let user = useSelector((state) => state.user);

  const handleModalViewShow = (show, url) => {
    setModalView(show);
    setTemplateURL(url);
  }
  const handleModalViewClose = () => setModalView(false);



  useEffect(() => {
    getTokenSettings();
  }, []);


  const getTokenSettings = async () => {
    try {
      setIsLoading(true);
      const response = await API.get(`/print-preview-setting?template_id=4&pageType=${selectedPageType}`);
      if (response?.status == 200) {
        setTokenPrintSettings(response?.data?.data);
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }



  const handleChange = (e) => {
    const { value, name, checked } = e.target;
    if (name == "tokenPrint") {
      errorObj.tokenTemplate = ""
      setSelectedTokenPrint(value);
    }
    if (name == "printerToken") {
      setPrinterToken(value);
    }
    if (name == "logotype") {
      setLogoType(value);
    }
  }

  useEffect(() => {
    if(tokenPrintSettings?.selected_template?.template_id) {
      setSelectedTokenPrint(tokenPrintSettings?.selected_template?.template_id)
    }
    else {
      setSelectedTokenPrint(null)
    }
  }, [tokenPrintSettings])


  const handleClickInp = (e) => {
    e.stopPropagation();
  }

  const saveTemplate = async () => {
    let errors = {};
    if (!selectedTokenPrint) errors.tokenTemplate = "Template is required"
    if (Object.keys(firstSignature).length == 0 ) errors.firstSignature = "First Signature is required"
    if (Object.keys(secondSignature).length == 0 ) errors.secondSignature = "Second Signature is required"
    const formdata = new FormData();
    formdata.append("user_id", user?.user?.id);
    formdata.append("page_orientation", "portrait");
    formdata.append("page_type", "letterhead");
    formdata.append("prescription_template_id", selectedTokenPrint);
    formdata.append("templateType", 4);
    formdata.append("printer", printerToken);
    if (Object.keys(firstSignature).length !== 0) {
      formdata.append("logo", firstSignature.originFileObj);
    }

    if (Object.keys(secondSignature).length !== 0) {
      formdata.append("signature", secondSignature.originFileObj);
    }

    try {
      setIsLoading(true)
      const response = await API.post(`/print-setting-save`, formdata);
      if (response?.status == 200) {
        setIndicationMessage(response?.data?.message);
        setIsLoading(false);
        getTokenSettings();
      }
      else {
        setIndicationMessage(response?.data?.message);
        setIsLoading(false)
      }
    }
    catch (error) {
      setIsLoading(false)
    }
    setErrorObj(errors);
  }

  useEffect(() => {
    let timeOut = setTimeout(() => {
      setIndicationMessage("");
    }, 2000);

    return (() => clearTimeout(timeOut));
  }, [indicationMessage])


  const handleChangePhoto = (e) => {
    const { files, name } = e.target;
    let img = files[0];
    if (name == "firstSignature") {
      setFirstSignature(img);
    }
    if (name == "secondSignature") {
      setSecondSignature(img);
    }
  }

  const crossClickedFirst = () => { 
    setFirstSignature(null)
  }

  const crossClickedSecond = () => {
    setSecondSignature(null)
  }

  const props = {
    onChange({ file, fileList }) {
        if (file) {
            setFirstSignature(file)
        }
    },
}

const propsSignature = {
  onChange({ file, fileList }) {
      if (file) {
          setSecondSignature(file)
      }
  },
}



  return (
    <>
      {indicationMessage !== "" && <div className="showPoup">
        {indicationMessage}
      </div>}
      <div className='vital_setting tokenVitalPrint'>
        <div className='print_select'>
          <div className="single_field customSelect">
            <Form.Select aria-label="Default select example" name='logotype' onChange={handleChange}>
              <option value='' hidden> Select Printer format </ option>
              <option value='withLogo'> With logo </option>
              <option value='withoutLogo' selected> Without Logo </option>
            </Form.Select>
          </div>
          <div className="single_field customSelect">
            <Form.Select aria-label="Default select example" name='printerToken' value={printerToken} onChange={handleChange} >
              <option value='' hidden> Select Printer </option>
              <option value='defaultPrinter'> Default Printer </option>
              <option value='thermalPrinter'> Thermal Printer </option>
            </Form.Select>
          </div>
        </div>
        {logoType == "withLogo" && <div className="uploadsAll">
          <div className='w-full tw-flex tw-items-center'>
            <div className='boxxxSig tw-flex tw-flex-col '>
              <h3> Upload Logo </h3>
              <p> Logo image should be in ‘PNG’ format with transparent <br /> background Upload </p>
              <div className='uploadWraper'>
                <Upload {...props} accept=".png,.jpeg,.jpg" multiple={false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                {firstSignature?.name && <div className="imgUploaded">
                  <span> {firstSignature?.name?.toLowerCase()}  </span>
                  <span className='crossIco' onClick={crossClickedFirst}>  </span>
                </div>}
              </div>
              <span className='error'>  {errorObj?.firstSignature} </span>
            </div>
          </div>
          <div className='tw-flex tw-items-center'>
            <div className='boxxxSig tw-flex tw-flex-col '>
              <h3> Upload Signature </h3>
              <p> Signature image should be in ‘PNG’ format with <br /> transparent background Upload </p>
              <div className='uploadWraper'>
                <Upload {...propsSignature} accept=".png,.jpeg,.jpg" multiple={false}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
                {secondSignature?.name && <div className="imgUploaded">
                  <span> {secondSignature?.name?.toLowerCase()}  </span>
                  <span className='crossIco' onClick={crossClickedSecond}>  </span>
                </div>}
              </div>
              <span className='error'>  {errorObj?.secondSignature} </span>
            </div>
          </div>
        </div>}
        <div className="page_type">
          <Row>
            <Col lg={12}>
              <h4>Templates</h4>
              {pageSelect == 1 ? (<div className='select_page'>Select page type first</div>) :
                (<div className='select_template'>
                  <div id="btnShow">
                    {tokenPrintSettings.templates?.map((obj, index) => {
                      return (
                        <div className="form-check" onClick={() => handleModalViewShow(true, obj?.thumbnail)}>
                          <img src={obj?.thumbnail} alt="" />
                          <input className="form-check-input" onClick={handleClickInp} type="radio" name="tokenPrint" onChange={handleChange} value={obj?.id} checked={obj?.id == selectedTokenPrint ? true : false} />
                        </div>
                      )
                    })}
                  </div>
                </div>
                )
              }
              <span className='error'>  {errorObj?.tokenTemplate} </span>
            </Col>
          </Row>
        </div>
        <div className='text-end box-fixed'>
          <button className='button2 btnTemp' onClick={saveTemplate}>SAVE</button>
        </div>
        <Modal className='print_view' show={modalView} onHide={handleModalViewClose} centered>
          <Modal.Body>
            <img src={templateURL} alt="" />
            <div className='text-center'>
              <button className='button1' onClick={handleModalViewClose}>Select</button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default TokenPrintSetting