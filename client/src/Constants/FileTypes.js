const FileTypes = [
    {
      id: 'rma',
      label: 'RMA Data',
      accept: '.csv',
      description: 'Upload Return Merchandise Authorization data'
    },
    {
      id: 'xbm',
      label: 'XBM Data',
      accept: '.csv',
      description: 'Upload XBM inventory data'
    },
    {
      id: 'trade-in',
      label: 'Trade-In Data',
      accept: '.csv',
      description: 'Upload device trade-in records'
    },
    {
      id: 'tracking',
      label: 'Tracking Data',
      accept: '.csv',
      description: 'Upload package tracking information'
    }
  ];
  export default FileTypes;