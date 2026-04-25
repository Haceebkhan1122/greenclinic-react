import React from 'react'

const FavouriteMedicine = ({ favouriteMedicineList, handleMedicineSelection }) => {
  return (
    <ul className='list'>
      {favouriteMedicineList?.map((item) => (
        <li key={item?.id} onClick={() => handleMedicineSelection(item)}><span></span>{item?.title}</li>
      ))}
    </ul>
  )
}

export default FavouriteMedicine