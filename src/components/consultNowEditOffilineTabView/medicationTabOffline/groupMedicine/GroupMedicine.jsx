import React from 'react'

const GroupMedicine = ({ groupMedicineList, handleGroupMedicineSelection }) => {
  return (
    <ul className='list'>
      {groupMedicineList.map((item) => (
        <li key={item?.id} onClick={() => handleGroupMedicineSelection(item)}><span></span>{item?.title}</li>
      ))}
    </ul>
  )
}

export default GroupMedicine