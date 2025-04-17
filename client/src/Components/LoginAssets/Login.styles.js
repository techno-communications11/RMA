export const container = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6 },
    style: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f3e7e9 100%)',
      overflow: 'hidden'
    }
  };
  
  export const logoContainer = {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5, delay: 0.2 }
  };
  
  export const logo = {
    transition: { type: "spring", stiffness: 300 }
  };
  
  export const formContainer = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5, delay: 0.2 }
  };
  
  export const card = {
    style: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(225, 1, 116, 0.1)'
    }
  };
  
  export const error = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };
  
  export const formTitle = {
    color: '#E10174'
  };
  
  export const input = {
    borderColor: '#E10174',
    borderRadius: '20px',
    padding: '12px 15px'
  };
  
  export const passwordToggle = {
    cursor: "pointer",
    color: '#E10174',
    bottom: '1rem'
  };
  
  export const button = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    style: {
      backgroundColor: "#E10174",
      borderColor: "#E10174",
      borderRadius: '25px',
      padding: '12px',
      boxShadow: '0 10px 20px rgba(225, 1, 116, 0.3)',
      transition: 'all 0.3s ease'
    }
  };