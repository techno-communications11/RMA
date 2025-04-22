import React from 'react'
import RMA_Columns from '../Constants/RMA_Columns'
import GetRmaData from '../Components/Apis/GetRmaData'
import Table from '../Components/Tables/Table'
import Home from './Home'

function Rma() {
  return (
    <div>
        <Home label="RMA Report"/>
      <Table/>
    </div>
  )
}

export default Rma
