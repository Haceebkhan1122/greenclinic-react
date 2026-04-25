import React, { useState } from 'react'

const GroupMedicine = ({ groupMedicineList, handleGroupMedicineSelection }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGroupMedicines = groupMedicineList.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <div className="search__bar">
        <input type="text"
          placeholder='Search for medicines'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ul className='list'>
        {filteredGroupMedicines.map((item) => (
          <li key={item?.id} onClick={() => handleGroupMedicineSelection(item)}><span></span>{item?.title}</li>
        ))}
      </ul>
    </>
  )
}

export default GroupMedicine