import './indicatorCard.scss';
import IndicationsModal from '../../../components/modal/indicationsModal/IndicationsModal';
import TypedModal from '../../../components/modal/typedModal/typedModal';

const IndicatorCard = ({ icon, icon1,
    heading,
    emptyMessage,
    medicalItem,
    handleShow,
    handleClose,
    currentModal,
    setSearchQuery,
    searchQuery,
    modalData,
    addNewKeyword,
    setPostData,
    postData,
    addHistory,
    setSelectDiagnosis,
    selectDiagnosis,
    patchDiagnosis,
    setStatus,
    deleteDiagnosis,
    patientData,
    patientId,
    historyChecked,
    inclinationChecked
}) => {

    const changeStatus = (id) => {
        setStatus(0)
        patchDiagnosis(id)
    }
    
    return (
        <>
            <div className='indicatorCard tw-p-[16px] tw-relative'>
                <div className='tw-w-full tw-flex tw-justify-between tw-pb-3 tw-items-center  tw-border-b-[1px] tw-border-bordere-color'>
                    <div className='tw-flex tw-items-center tw-gap-2'>
                        <img src={icon1} alt="" />
                        <h4>{medicalItem?.length > 0 ? medicalItem?.heading : heading} </h4>
                    </div>
                    <button onClick={() => {
                        handleShow();
                    }}>Add</button>
                </div>
                {medicalItem?.list?.length > 0 ? medicalItem?.list?.map((items) => (
                    <div className="cardsWraperIndicator">
                        <div className='singleC tw-flex tw-flex-col'>
                            <p>{items?.date_web} </p>
                            <div className='tw-flex tw-justify-between tw-items-center'>
                                <h3> {items?.title} </h3>
                                <div className='tw-flex tw-items-center tw-gap-4'>
                                    {medicalItem?.heading == 'Indication' ? (
                                        items?.status == 1 ?  
                                        <button style={{border: 'none'}} onClick={() => changeStatus(items?.id)}>
                                        Inactive
                                    </button> : null
                                    ) : null}

                                    <div onClick={() => deleteDiagnosis(items?.id)} className="deleteIcon"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
                    :
                    <div className='noitemsIndicator tw-flex tw-flex-col tw-w-full tw-justify-center tw-items-center'>
                        <img src={icon} alt="" />
                        <h4> {emptyMessage} </h4>
                    </div>
                }
            </div>
            {currentModal == 'Indications' || currentModal == 'Past Medical History' ? (
                <IndicationsModal
                    handleClose={handleClose}
                    modalData={modalData}
                    searchQuery={searchQuery}
                    show={true}
                    setSearchQuery={setSearchQuery}
                    heading={currentModal}
                    addNewKeyword={addNewKeyword}
                    setSelectDiagnosis={setSelectDiagnosis}
                    selectDiagnosis={selectDiagnosis}
                    patientData={patientData}
                    patientId={patientId}
                    inclinationChecked={inclinationChecked}
                    historyChecked={historyChecked}
                />
            ) : null}


            {currentModal == 'Family History' || currentModal == 'Surgical History' || currentModal == 'Allergies' ? (
                <TypedModal
                    handleClose={handleClose}
                    modalData={modalData}
                    show={true}
                    setPostData={setPostData}
                    postData={postData}
                    addHistory={addHistory}
                    heading={currentModal}
                    patientData={patientData}
                    patientId={patientId}
                />
            ) : null}
        </>
    )
}

export default IndicatorCard;
