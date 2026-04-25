import { useLockBodyScroll } from '@uidotdev/usehooks';
import './searchResult.scss';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie"
import API from '../../../services/httpInstance';

const SearchResult = ({ filteredResults, textQuery, searchLoading }) => {
    useLockBodyScroll();
    const navigate = useNavigate();

    const handleNavigation = async (item) => {
        const payload = {
            doctor_id: item?.doctor_id,
            patient_id: item?.id
        }
        try {
            const response = await API.post("book-appointment-by-patient", payload)
            window.location.reload();
            Cookies.remove("prescriptionsAdd")
            Cookies.set("patientClose", "1")
            navigate('/consult-now', { 
                state: { 
                    doctorId: item?.doctor_id, 
                    patientId: item?.id,
                    appointmentId: response?.data?.data,
                    clinicId: item?.clinic_id
                } 
            });
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="searchResults">
            <div className={filteredResults?.length > 5 ? `list_serach` : ''}>
                {searchLoading ? (
                    <>
                        <p className='d-flex align-items-center justify-content-center'>
                            Searching...
                        </p>
                    </>
                ) : (
                    <>
                        {!searchLoading && filteredResults?.length > 0 && filteredResults?.map((item) => {
                            return (<>
                                <div style={{ cursor: 'pointer' }} onClick={() => handleNavigation(item)} className="singleResult">
                                    <span> {item?.mr_no} | {item?.name} | {item?.phone} | {item?.gender} | {item?.age ? <span>{item?.age} Y</span> : null} </span>
                                </div>
                            </>)
                        })}
                        {(textQuery?.trim() !== null && textQuery?.trim() !== "" && !filteredResults?.length)
                            &&
                            <div className='noRes'>  No results found </div>
                        }
                    </>
                )}

            </div>
            <div className="allSearchResults">
                <span className='arrow'>  </span>
                <span> All search results for  {textQuery}  </span>
            </div>
        </div>
    )
}

export default SearchResult;
