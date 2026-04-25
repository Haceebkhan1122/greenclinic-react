import './indicatorCard.scss';
import IndicationsModal from '../../../../components/modal/indicationsModal/IndicationsModal';
import TypedModal from '../../../../components/modal/typedModal/typedModal';

const IndicatorCard = ({
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
    deleteDiagnosis
}) => {

    const changeStatus = (id) => {
        setStatus(1)
        patchDiagnosis(id)
    }

    return (
        <>
            <div className='indicator'>
                {medicalItem?.list?.map((items) => (
                    <div className="cardsWraperIndicator">
                        <div className='singleC tw-flex tw-flex-col'>
                            <p>{items?.date_web} </p>
                            <div className='tw-flex tw-justify-between tw-items-center'>
                                <h3> {items?.title} </h3>
                                <div className='tw-flex tw-items-center tw-gap-4'>
                                    {medicalItem?.heading == 'Past Medical History' ? (
                                        items?.status == 1 ? null : (
                                            <h4 onClick={() => changeStatus(items?.id)}>
                                                Inactive
                                            </h4>
                                        )
                                    ) : null}

                                    <div onClick={() => deleteDiagnosis(items?.id)} className="deleteIcon"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='box-fixed'>
                <button className='button2' onClick={() => {
                    handleShow();
                }}>Add</button>
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
                />
            ) : null}
        </>
    )
}

export default IndicatorCard;
