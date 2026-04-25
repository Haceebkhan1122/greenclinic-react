import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap';
import ArrowBack from "../../../assets/images/png/arrow_back_blue.png";
import CloseSearch from "../../../assets/images/svg/close_search.svg";
import ResultSearch from "../../../assets/images/png/icons_search.png";
import "./searchModal.scss"

const SearchModal = ({ handleSearchClose, searchShow }) => {
    const itemList = [
        { id: '1', title: "Majid", age: "25", gender: "male", number: "03548966666" },
        { id: '2', title: "Maheen Afzal", age: "25", gender: "Female", number: "0354892255" },
        { id: '3', title: "Ali Murtaza", age: "25", gender: "male", number: "03548944466" },
        { id: '4', title: "Ismail Ali", age: "25", gender: "Other", number: "0354897896" },
    ]
    const [searchTerm, setSearchItems] = useState('')
    const [filteredItems, setFilteredItems] = useState(itemList);

    const handleListChange = (e) => {
        const search = e.target.value
        setSearchItems(search)
        const filteredItem = itemList?.filter((item) => item?.title.toLowerCase()?.includes(search?.toLowerCase()))
        setFilteredItems(filteredItem)
    }
    const handleSearchRemove = () => [
        setSearchItems('')
    ]
    return (
        <Modal className='searchModal' show={searchShow} onHide={handleSearchClose}>
            <Modal.Header >
                <img src={ArrowBack} alt="" className="back_blue" onClick={handleSearchClose} />
                <div className="search-in">
                    <input type="text" name="search-bar" placeholder=" " value={searchTerm} onChange={handleListChange} />
                    <button onClick={handleSearchRemove}><img src={CloseSearch} alt="" /></button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <div className="search_result" id="search_result">
                    {searchTerm && filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <div key={item.id} className='box_bg'>
                                <span className='one_char'>{item.title.charAt(0)}</span>
                                <div>
                                    <span>{item.id}</span>
                                    <p>{item.title} {item.gender.charAt(0).toUpperCase()} | {item.age}</p>
                                    <span>{item.number}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        searchTerm ? <div className='no_result'> <img src={ResultSearch} alt="" /> <h6>No results found</h6> <p>We can’t find any item matching your Search</p> </div> : null
                    )}
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default SearchModal