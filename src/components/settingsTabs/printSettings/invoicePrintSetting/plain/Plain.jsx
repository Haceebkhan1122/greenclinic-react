import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { toast } from 'react-toastify';
import './plain.scss';

const Plain = ({headerImg, setHeaderImg, footerImg,setFooterImg, selectedPageType, setSelectedPageType, printSettings, inputVall})  => {

    const props1 = {
        beforeUpload: file => {
            if (file.type !== 'application/pdf') {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = () => {
                    const binaryData = reader.result;
                    setHeaderImg(binaryData);
                }
            }
            else {
                toast.error(`${file.name} is not a png file`); 
            }
            return file;
        },
    };

    const props2 = {
        beforeUpload: file => {
            if (file.type !== 'application/pdf') {
                const reader = new FileReader();
                reader.onload = () => {
                    const binaryData = reader.result;
                    setFooterImg(binaryData);
                }
            }
            else {
                toast.error(`${file.name} is not a png file`);
            }
            return file;
        },
    };

    const handleChange = (e) => {
        const {value, name, checked} = e.target;
        setSelectedPageType(value)
    }

    const handlingImgHeader = (file) => {
        if(file) {
            let fileee = file?.file?.originFileObj;
            let reader = new FileReader();
            reader.readAsDataURL(fileee)
            reader.onload = () => {
                const binaryData = reader.result;
                setHeaderImg(binaryData);
            }
        }
    }

    const handlingImgFooter = (file) => {
        if(file) {
            let fileee = file?.file?.originFileObj;
            let reader = new FileReader();
            reader.readAsDataURL(fileee)
            reader.onload = () => {
                const binaryData = reader.result;
                setFooterImg(binaryData);
            }
        }
    }

    const handleChangePhoto = (e) => {
        const { files, name } = e.target;
        let img = files[0];
        if (name == "header") {
            setHeaderImg(img);
        }
        if (name == "footer") {
            setFooterImg(img);
        }
    }

    const crossClickedFooter = () => {
        setFooterImg(null)
    }

    const props = {
        onChange({ file, fileList }) {
            if (file) {
                setHeaderImg(file)
            }
        },
    }

    const propsFooter = {
        onChange({ file, fileList }) {
            if (file) {
                setFooterImg(file)
            }
        },
    }

    return (
        <>
            <div className="single customRadioo">
                <div className="wrapeInp">
                    <input type ="radio" value={"plain"} id="custom_plain" name="page" onChange={handleChange} defaultChecked={!printSettings?.selected_template?.type ? selectedPageType == "plain" ? true : false : printSettings?.selected_template?.type == "plain" ? true : false }  />
                    <span></span>
                </div>
                <label htmlFor="custom_plain"> Plain </label>
            </div>
            <div className="inner-div">
                <div className="heading_upload_btn">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="body-text semi-bold text_custom_presc_settings mb-md-1">Upload Header</h6>
                        <div className='uploadWraperPrint'>
                            {/* <div className='singleImgUpload'>
                                <input type="file" id='upPhoto1' onChange={handleChangePhoto} name='header' />
                                
                                <label htmlFor='upPhoto1'> <span className='uploadLogo'> </span> Upload </label>
                            </div> */}
                            <Upload {...props} accept=".png,.jpeg,.jpg" multiple={false}>
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            {headerImg?.name && <div className="imgUploaded">
                                <span> {headerImg?.name?.toLowerCase()}  </span>
                                <span className='crossIco' onClick={crossClickedFooter}>  </span>
                            </div>}
                        </div>
                    </div>
                    <p className="texthas imgHide text_header_extra">Header image should be in ‘PNG’ format with transparent background Upload</p>
                </div>
            </div>
            <div className="inner-div mb-0">
                <div className="heading_upload_btn">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="body-text semi-bold text_custom_presc_settings mb-md-1">Upload Footer</h6>
                        <div className='uploadWraperPrint'>
                            <Upload {...propsFooter} accept=".png,.jpeg,.jpg" multiple={false}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                            {footerImg?.name && <div className="imgUploaded">
                                <span> {footerImg?.name?.toLowerCase()}  </span>
                                <span className='crossIco' onClick={crossClickedFooter}>  </span>
                            </div>}
                        </div>
                    </div>
                    <p className="texthas imgHide text_header_extra">Footer image should be in ‘PNG’ format with transparent background Upload</p>
                </div>
            </div>
        </>
    )
}

export default Plain