import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './prescriptionTemplateModal.scss';
import Slider from 'react-slick';
import API from '../../../services/httpInstance';

const PrescriptionTemplateModal = ({
    prescriptionTemplateShow,
    handlePrescriptionTemplateClose,
    template,
    setTemplate,
    appointmentId,
}) => {
    const [selectedLanguage, setSelectedLanguage] = useState('eng');
    const [filteredTemplates, setFilteredTemplates] = useState([]);

    const settings = {
        dots: false,
        infinite: true,
        speed: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    // console.log(filteredTemplates, "filteredTemplates")

    const getConsultNowTemplate = async () => {
        try {
            const response = await API.get(`/consult-now/${appointmentId}`);
            setTemplate(response?.data?.data?.templates);
            filterTemplatesByLanguage('eng', response?.data?.data?.templates);
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const filterTemplatesByLanguage = (language, templates) => {
        const filtered = templates?.filter((t) => t.language.toLowerCase() === language.toLowerCase()) || [];
        setFilteredTemplates(filtered);
    };

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        filterTemplatesByLanguage(lang, template);
    };

    useEffect(() => {
        if (appointmentId) {
            getConsultNowTemplate();
        }
    }, [appointmentId]);

    useEffect(() => {
        filterTemplatesByLanguage(selectedLanguage, template);
    }, [template, selectedLanguage]);

    return (
        <Modal className="prescriptionTemplate" show={prescriptionTemplateShow} onHide={handlePrescriptionTemplateClose}>
            <button onClick={handlePrescriptionTemplateClose} className="close d-none d-lg-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M9.47885 8.13258L15.7348 14.3886L14.3886 15.7348L8.13258 9.47885L8 9.34626L7.86742 9.47885L1.61143 15.7348L0.265165 14.3886L6.52115 8.13258L6.65374 8L6.52115 7.86742L0.265165 1.61143L1.61143 0.265165L7.86742 6.52115L8 6.65374L8.13258 6.52115L14.3886 0.265165L15.7348 1.61143L9.47885 7.86742L9.34626 8L9.47885 8.13258Z"
                        fill="#313131"
                        stroke="white"
                        stroke-width="0.375"
                    />
                </svg>
            </button>
            <Modal.Body>
                <h4>Print Prescription</h4>
                <div className="prescription_select">
                    <h5 className="dynamic-color">Prescription:</h5>
                    <div className="checkboxes-container justify-content-start">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="language"
                                id="preview-english"
                                value="eng"
                                checked={selectedLanguage === 'eng'}
                                onChange={handleLanguageChange}
                            />
                            <label className="form-check-label body-text" htmlFor="preview-english">
                                English
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="language"
                                id="preview-urdu"
                                value="urdu"
                                checked={selectedLanguage === 'urdu'}
                                onChange={handleLanguageChange}
                            />
                            <label className="form-check-label body-text" htmlFor="preview-urdu">
                                Urdu
                            </label>
                        </div>
                    </div>
                </div>
                <div className="slider-preview">
                    {filteredTemplates?.length === 1 ? (
                        // If there's only one template, show it directly
                        <div key={filteredTemplates[0]?.id}>
                            <div className="form-check">
                                <input
                                    className="form-check-input radioRound prescription_add"
                                    type="radio"
                                    name={`prescription_template_id-${filteredTemplates[0].id}`}
                                    id={`prescription_template_id-${filteredTemplates[0].id}`}
                                    value={filteredTemplates[0].id}
                                />
                                <div className="pdf-container" id={`pdf-container-${filteredTemplates[0].id}`}>
                                    <img src={filteredTemplates[0]?.thumbnail} alt="template" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // If there are multiple templates, show the slider
                        <Slider {...settings}>
                            {filteredTemplates?.map((item) => (
                                <div key={item?.id}>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input radioRound prescription_add"
                                            type="radio"
                                            name={`prescription_template_id-${item.id}`}
                                            id={`prescription_template_id-${item.id}`}
                                            value={item.id}
                                        />
                                        <div className="pdf-container" id={`pdf-container-${item.id}`}>
                                            <img src={item?.thumbnail} alt="template" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
                <div className="btn-wrap">
                    <button className="button2" onClick={handlePrescriptionTemplateClose}>
                        DONE
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default PrescriptionTemplateModal;
