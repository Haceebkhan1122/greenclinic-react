import React, { useState, useEffect } from 'react';
import './prescriptionPrintSetting.scss';
import { Row, Col, Form, Modal } from 'react-bootstrap'
import LetterHead from './letterHead/LetterHead';
import Plain from './plain/Plain';
import PresTemplate from "../../../../assets/images/png/pres_template.png";
import InvoiceTemplate from "../../../../assets/images/png/invoice_template.png"
import API from '../../../../services/httpInstance';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Loader from '../../../loader/Loader';

const PrescriptionSetting = () => {
  const [pageSelect, setPageSelect] = useState(0);
  const [modalView, setModalView] = useState(false);
  const [headerImg, setHeaderImg] = useState("");
  const [footerImg, setFooterImg] = useState("");
  const [printSettings, setPrintSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPageType, setSelectedPageType] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [pageSize, setPageSize] = useState("")
  const [pageOrientation, setPageOrientation] = useState("")
  const [selectedTemplatePage, setSelectedTemplatePage] = useState("")
  const [templateId, setTemplateId] = useState(null)
  const [checkPageType, setCheckPageType] = useState("")
  const [marginTop, setMarginTop] = useState('')
  const [marginBottom, setMarginBottom] = useState('')
  const [marginLeft, setMarginLeft] = useState('')
  const [marginRight, setMarginRight] = useState('')
  const [errorObj, setErrorObj] = useState({})

  const userId = useSelector((state)=> state.user.user.id);

  const handleModalViewShow = (item) => {
    setModalView(true);
    setSelectedTemplate(item)
  }

  const handleModalViewClose = () => {
    setSelectedTemplatePage()
    setModalView(false)
  };

  const handleClickInp = (e) => {
    e.stopPropagation();
  }


  const getPrintSettings = async (pageType) => {
    try {
      setIsLoading(true);
      const response = await API.get(`/print-preview-setting?template_id=1&pageType=${pageType}`);
      if (response?.status == 200) {
        setPrintSettings(response?.data?.data);
        setIsLoading(false);
      }
      else {
        setIsLoading(false);
      }
    }
    catch (error) {
      console.log(error)
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const { value, checked, name } = e.target;

    if (name == "pageSize") {
      setPageSize(value);
    }

    if (name == "pageOrientation") {
      setPageOrientation(value);
    }

    if (name == "selectedTemplateId") {
      errorObj.template = ""
      setTemplateId(value);
    }

    if (name == "page") {
      setSelectedPageType(value);
    }
  }

  useEffect(() => {
    let temp = printSettings?.selected_template;
    if (temp !== null && temp !== undefined && Object.keys(temp).length !== 0) { 
      setCheckPageType(printSettings.selected_template.type);
      setTemplateId(printSettings.selected_template.template_id);
      setPageOrientation(printSettings.selected_template.orientation);
      setPageSize(printSettings.selected_template.size);
    } else {
      setPageSize("A4");
      setPageOrientation("portrait");
      setTemplateId(null);
    }
  }, [printSettings, selectedPageType]);

  const createPayload = () => {
    const payload = new FormData();
    payload.append("user_id", userId);
    payload.append("page_orientation", pageOrientation);
    payload.append("page_size", pageSize);
    payload.append("page_type", selectedPageType);
    payload.append("prescription_template_id", templateId);
    payload.append("templateType", 1);

    if (selectedPageType == "letterhead") {
      payload.append("margin_top", marginTop);
      payload.append("margin_bottom", marginBottom);
      payload.append("margin_right", marginRight);
      payload.append("margin_left", marginLeft);
    }
    else if(selectedPageType == "plain"){
      if (headerImg) {
        payload.append("header_image", headerImg);
      }
      if (footerImg) {
        payload.append("footer_image", footerImg);
      }
    }
    return payload;
  };


  useEffect(() => {
    if(templateId !== null || templateId !== undefined) {
      errorObj.template = ""
    }
  }, [templateId])


  const savePrintSettings = async () => {
    let errors = {};
    const payload = createPayload();
    if(!templateId) errors.template = "Template is required";
    try {
      if(templateId) {
      setIsLoading(true)
      const response = await API.post(`/print-setting-save`, payload);
      if (response?.status == 200) {
        toast.success(response?.data?.message);
        setIsLoading(false);
        getPrintSettings(selectedPageType);
      }
      else {
        toast.error(response?.data?.message);
        setIsLoading(false)
      }
    }else {
      toast.error("Please fill all the required fields");
    }
    }
    catch (error) {
      console.log("error in apii", error);
      setIsLoading(false)
    }
    setErrorObj(errors);
  }

  useEffect(() => {
    if(selectedPageType !== "") {
      getPrintSettings(selectedPageType);
    }
  },[selectedPageType])


  return (
    <>
      {isLoading ?
        <Loader />
        :
        <div className='prescriptionSetting'>
          <div className='print_select'>
            <div className='page order2'>
              <span> Page Size </span>
              <div className='page-flex'>
                <div className="single customRadioo">
                  <div className="wrapeInp">
                    <input type="radio" id="a4" name="pageSize" value="A4" checked={pageSize === "A4"} onChange={handleChange} />
                    <span></span>
                  </div>
                  <label htmlFor="custom"> A4 </label>
                </div>
                <div className="single customRadioo">
                  <div className="wrapeInp">
                    <input type="radio" id="a5" name="pageSize" value="A5" checked={pageSize === "A5"} onChange={handleChange} />
                    <span></span>
                  </div>
                  <label htmlFor="a5"> A5 </label>
                </div>
              </div>
            </div>
            <div className='page order3'>
              <span> Page Orientation </span>
              <div className='page-flex'>
                <div className="single customRadioo">
                  <div className="wrapeInp">
                    <input type="radio" id="landscape" name="pageOrientation" value="landscape" checked={pageOrientation === "landscape"} onChange={handleChange} />
                    <span></span>
                  </div>
                  <label htmlFor="landscape"> Landscape </label>
                </div>
                <div className="single customRadioo">
                  <div className="wrapeInp">
                    <input type="radio" id="portrait" name="pageOrientation" value="portrait" checked={pageOrientation === "portrait"} onChange={handleChange} />
                    <span></span>
                  </div>
                  <label htmlFor="portrait"> Portrait </label>
                </div>
              </div>
            </div>
            <div className="single_field customSelect order1">
              <Form.Select aria-label="" disabled name='dataType' defaultChecked={printSettings?.selected_template?.printer_type} >
                <option value='Printed' value={printSettings?.selected_template?.printer_type} > Printer </option>
              </Form.Select>
            </div>
          </div>
          <div className="page_type">
            <Row>
              <Col lg={12}>
                <h4>Page Type</h4>
              </Col>
              <Col lg={6}>
                <div className='box'>
                  <LetterHead setSelectedPageType={setSelectedPageType} selectedPageType={selectedPageType} printSettings={printSettings} marginTop={marginTop} setMarginTop={setMarginTop} marginBottom={marginBottom} setMarginBottom={setMarginBottom} marginLeft={marginLeft} setMarginLeft={setMarginLeft} marginRight={marginRight} setMarginRight={setMarginRight} />
                </div>
              </Col>
              <Col lg={6} className='mt-3 mt-md-0'>
                <div className='box'>
                  <Plain headerImg={headerImg} setHeaderImg={setHeaderImg} footerImg={footerImg} setFooterImg={setFooterImg} setSelectedPageType={setSelectedPageType} selectedPageType={selectedPageType} printSettings={printSettings} />
                </div>
              </Col>
              <Col lg={12}>
                <h4>Templates</h4>
                <div className='select_template'>
                  <div id="btnShow">
                    {printSettings?.templates?.map((item, idx) => {
                      return (<>
                        <div className="form-check" onClick={() => handleModalViewShow(item)}>
                          <img src={item?.thumbnail} alt="" />
                          <input className="form-check-input" type="radio" name="selectedTemplateId" value={item?.id} onClick={handleClickInp} onChange={handleChange} checked={(templateId !== undefined && templateId !== null) && templateId === item?.id || String(templateId) === String(item?.id)} />
                        </div>
                      </>)
                    })}
                  </div>
                </div>
                <span className="error"> {errorObj?.template} </span>
              </Col>
            </Row>
          </div>
          <div className='text-end box-fixed'>
            <button className='button2' onClick={savePrintSettings}> Save </button>
          </div>
          <Modal className='print_view' show={modalView} onHide={handleModalViewClose} centered>
            <Modal.Body>
              <img src={selectedTemplate?.thumbnail} alt="" />
              <div className='text-center'>
                <button className='button1' onClick={handleModalViewClose}>Select</button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      }
    </>
  )
}

export default PrescriptionSetting