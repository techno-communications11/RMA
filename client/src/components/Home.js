import React from "react";
 // Correct import (no curly braces for default export)
import Upload from "./RMAdata/Upload";
import Table from "../components/Utilitycomponents/Table";
import { useUserContext } from "./Utilitycomponents/MyContext";



function Home() {
 const {userData}=useUserContext();
  const role=userData.role;


  return (
    <div>
      {/* Header Section */}
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
          RMA Report
        </h4>
      </div>

      {/* Conditional Rendering Based on Role */}
      {role === "manager" && <Upload />}
      <Table />
    </div>
  );
}

export default Home;
