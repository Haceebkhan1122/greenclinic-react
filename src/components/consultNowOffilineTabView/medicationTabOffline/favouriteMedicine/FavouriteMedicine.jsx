import React, { useState } from 'react'

const FavouriteMedicine = ({ favouriteMedicineList, handleMedicineSelection }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMedicines = (favouriteMedicineList ?? []).filter(item =>
    (item?.title ?? '').toLowerCase().includes((searchTerm ?? '').toLowerCase())
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
        {filteredMedicines?.map((item) => (
          <li key={item?.id} onClick={() => handleMedicineSelection(item)}><span></span>{item?.title}</li>
        ))}
      </ul>
    </>
  )
}

export default FavouriteMedicine