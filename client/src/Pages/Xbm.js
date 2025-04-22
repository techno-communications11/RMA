import React from 'react'
import XBM_Columns from '../Constants/XBM_Columns'
import GetXbmData from '../Components/Apis/GetXbmData'
import Table from '../Components/Tables/Table'
import Home from './Home'

function Xbm() {
  return (
    <div>
        <Home label="XBM Report"/>
      <Table/>
    </div>
  )
}

export default Xbm
