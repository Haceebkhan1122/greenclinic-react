/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'

const LetterHead = ({selectedPageType, setSelectedPageType, printSettings,marginTop, setMarginTop,marginBottom,setMarginBottom,marginLeft,setMarginLeft,marginRight,setMarginRight }) => {

    const handleChange = (e) => {
        const {value, name, checked} = e.target;
        setSelectedPageType(value)
    }

    useEffect(() => {
        setMarginTop(printSettings?.selected_template?.margin_top)
        setMarginBottom(printSettings?.selected_template?.margin_bottom)
        setMarginRight(printSettings?.selected_template?.margin_right)
        setMarginLeft(printSettings?.selected_template?.margin_left)
    }, [printSettings, selectedPageType])

    return (
        <>
            <div className='letter_head'>
                <div className="single customRadioo">
                    <div className="wrapeInp">
                        <input type="radio" value={"letterhead"} id="custom_letterhead" name="page" onChange={handleChange} defaultChecked={!printSettings?.selected_template?.type ? selectedPageType == "letterhead" ? true : false : printSettings?.selected_template?.type == "letterhead" ? true : false } />
                        <span></span>
                    </div>
                    <label htmlFor="custom_letterhead"> Letter Head </label>
                </div>
                <p>Page Margin (mm)</p>
            </div>
            <Row className='form-row'>
                <div className="form-group col-lg-6">
                    <div className="page_flex">
                        <label htmlFor="right" className="xsmall-text">Right</label>
                        <input type="tel" className="form-control" id="right" name="margin_right" value={marginRight} required="" onChange={(e) => setMarginRight(e.target.value)} />
                    </div>
                </div>
                <div className="form-group col-lg-6">
                    <div className="page_flex">
                        <label htmlFor="top" className="xsmall-text">Top</label>
                        <input type="tel" className="form-control" id="top" required="" name="margin_top" value={marginTop} onChange={(e) => setMarginTop(e.target.value)} />
                    </div>
                </div>
                <div className="form-group col-lg-6">
                    <div className="page_flex">
                        <label htmlFor="left" className="xsmall-text">Left</label>
                        <input type="tel" className="form-control" id="left" required="" name="margin_left" value={marginLeft} onChange={(e) => setMarginLeft(e.target.value)} />
                    </div>
                </div>
                <div className="form-group col-lg-6">
                    <div className="page_flex">
                        <label htmlFor="bottom" className="xsmall-text">Bottom</label>
                        <input type="tel" className="form-control" id="bottom" required="" name="margin_bottom" value={marginBottom} onChange={(e) => setMarginBottom(e.target.value)} />
                    </div>
                </div>
            </Row>
        </>
    )
}

export default LetterHead