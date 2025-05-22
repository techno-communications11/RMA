export const container = {
    style: {
      background: "linear-gradient(135deg,rgb(229, 237, 248) 0%,rgba(213, 245, 246, 0.32) 50%,rgba(248, 223, 241, 0.83) 100%)",
      minHeight: '50vh',
      overflow: 'hidden'
    }
  };
  
  export const card = {
    style: {
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxHeight: '100%',
      overflow: 'hidden'
    }
  };
  
  export const input = {
    borderRadius: '5px',
    borderColor: '#ced4da',
    padding: '8px 15px',
    fontSize: '0.9rem',
    '&:focus': {
      borderColor: '#86b7fe',
      boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'
    }
  };
  
  export const passwordToggle = {
    color: '#6c757d',
    width: '40px',
    '&:hover': {
      color: '#0d6efd'
    }
  };
  
  export const button = {
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
    borderRadius: '5px',
    padding: '8px',
    fontSize: '0.9rem',
    '&:hover': {
      backgroundColor: '#0b5ed7',
      borderColor: '#0a58ca'
    }
  };