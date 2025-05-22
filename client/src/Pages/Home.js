import React from "react";



function Home({ label }) {
 
  return (
    <div>
      <div
        className="dashboard-header1"
        style={{
          backgroundImage: "url(/accessories.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h4 className="text-white mb-1 fs-1 text-center animate__animated animate__fadeIn">
          {label}
        </h4>
      </div>

  
     
      
    </div>
  );
}

export default Home;
