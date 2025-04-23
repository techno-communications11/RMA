const XBM_Columns = [
    { label: 'SINO', field:'id' },
    { label: 'Market', field: 'market' },
    { label: 'store ID', field: 'store_id' },
    { label: 'Store Name', field: 'store_name' },
    { label: 'Ordered Date', field: 'ordered_date' },
    { label: 'Description', field: 'description' },
    { label: 'Customer IMEI', field: 'old_imei' },
    { label: 'New IMEI', field: 'new_imei' },
    { label: 'Label Type', field: 'label_type' },
    { label: 'Tracking Number', field: 'tracking_number' },
    { label: 'Status', field: 'status' },
    { label: 'Ntid', field: 'ntid', roles:['user'] },
    { label: 'Verify', field:'verify', roles:['user'] },
    { label: 'Actions', roles:['manager', 'admin'] },
  
  ];
  export default XBM_Columns;