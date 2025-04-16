import React from 'react';

const RegisterHeader = () => (
  <div
    className="ms-2 rounded me-2 mb-1"
    style={{
      backgroundImage: "url(/register.jpg)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      height: "150px",
      width: "99.5%",
      opacity: "0.9",
    }}
  >
    <h4 className="text-white  fs-1 text-center animate__animated animate__fadeIn pt-5">
      Register User
    </h4>
  </div>
);

export { RegisterHeader };