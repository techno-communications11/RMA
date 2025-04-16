import React from 'react';
import Lottie from "lottie-react";
import Animation from "./RegisterAnimation.json";

const RegisterAnimation = () => (
  <div className="col-lg-3 me-5 col-md-3  mb-5 d-flex justify-content-center align-items-center">
    <Lottie
      className="mb-5"
      autoplay
      loop
      animationData={Animation}
      style={{ height: "100%", width: "100%" }}
    />
  </div>
);

export { RegisterAnimation };