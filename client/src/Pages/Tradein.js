import React from 'react'
import GetTradeINData from '../Components/Apis/GetTradeINData'
import Trade_IN_Columns from '../Constants/Trade_IN_Columns'
import Table from '../Components/Tables/Table'
import Home from './Home'

function Tradein() {
  return (
    <div>
        <Home label="Tradein Report"/>
      <Table/>
    </div>
  )
}

export default Tradein
