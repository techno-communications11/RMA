const Trade_IN_Columns = [
    { label: 'SINO', field:'id' },
    { label: 'Market', field: 'market' },
    { label: 'Store ID', field: 'store_id' },
    { label: 'Store Name', field: 'store_name' },
    { label: 'Employee ID', field: 'emp_id' },
    { label: 'Invoice Date', field: 'invoice_date' },
    { label: 'TI applied', field: 'ti_applied' },
    { label: 'old_imei', field: 'old_imei' },
    { label: 'Model', field: 'model' },
    { label: 'Label Type', field: 'label_type' },
    { label: 'Tracking Number', field: 'tracking_number' },
    { label: 'Status', field: 'status' },
    { label: 'Ntid', field:'ntid', roles:['user'] },
    { label: 'Verify', field:'verify', roles:['user'] },
    { label: 'Actions', roles:['inventry', 'admin'] },
  
  ];
  export default Trade_IN_Columns;