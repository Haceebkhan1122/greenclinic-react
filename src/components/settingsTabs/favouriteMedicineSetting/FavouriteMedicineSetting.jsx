import React from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import GroupMedicine from './groupMedicine/GroupMedicine'
import FavoriteMedicine from './favoriteMedicine/FavoriteMedicine'
import "./favouriteMedicineSetting.scss"

const FavouriteMedicineSetting = () => {
  return (
    <div className='wrap-tab favourite'>
      <Tabs
        defaultActiveKey="favorite_medicine"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="favorite_medicine" title="Favorite Medicine">
          <FavoriteMedicine />
        </Tab>
        <Tab eventKey="group_medicine" title="Group Medicine">
          <GroupMedicine />
        </Tab>
      </Tabs>
    </div>
  )
}

export default FavouriteMedicineSetting