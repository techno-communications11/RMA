const RMA_Columns = [
  { label: 'SINO' },
  { label: 'market' , field: 'market' },
  { label: 'Store ID', field: 'store_id' },
  { label: 'Store Name', field: 'store_name' },
  { label: 'Description', field: 'description' },
  { label: 'Old IMEI', field: 'old_imei' },
  { label: 'Refund/LabelType', field: 'refund_label_type' },
  { label: 'New Exchange IMEI', field: 'new_exchange_imei' },
  { label: 'Employee Name', field: 'employee_name' },
  { label: 'Sold Date', field: 'sold_date' },
  { label: 'Tracking Details', field: 'tracking_details' },
  { label: 'Shipping Status', field: 'shipping_status' },
  { label: 'Ntid', roles: ['user'], },
  { label: 'Verify', roles: ['user'] },
  { label: 'Actions', roles: ['inventry', 'admin'] },
];

export default RMA_Columns;