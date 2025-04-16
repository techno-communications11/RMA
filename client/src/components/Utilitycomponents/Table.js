import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "../Dashboard/AdminDashboard";
import { Col, Row } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";

import { useUserContext } from "./MyContext";

import TableBody from "../RMAdata/TableBody";
const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalFields, setModalFields] = useState({
    RMADate: "",
    RMANumber: "",
    UPSTrackingNumber: "",
  });
  const [ntid, setNtid] = useState({});
  const [serial, setSerial] = useState({ serial: "" });
  const [stores, setStores] = useState([]);
  const [store, setStore] = useState(null);
  const [search, setSearch] = useState("");
  let [filteredData, setFilteredData] = useState([]);
   
  // const location = useLocation();
   const {userData}=useUserContext();

 
  const storeid = userData.storeid;



  useEffect(() => {
    const getStores = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getstores`,{
            withCredentials:true
          }
        );
        setStores(response.data);
      } catch (err) {
        console.error("Failed to fetch stores:", err);
      }
    };
    getStores();
  }, []);

  // Set store when stores are fetched
  useEffect(() => {
    if (stores.length > 0) {
      const currentStore = stores.find((s) => s.id === storeid);
      if (currentStore) {
        setStore(currentStore.Store);
        // console.log(currentStore, "currentStore");
      } else {
        setStore(null); // You can set it to null or handle it as needed
        // console.log("Store not found for the given storeid");
      }
    } else {
      setStore(null); // If stores array is empty, set store to null
      // console.log("No stores available");
    }
  }, [stores, storeid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getdata`,{
            withCredentials:true
          }
        );

        let filtered = response.data;

        if (store!==null) {
          filtered = filtered.filter((row) => row.storename === store);
        }

        // if (contextstore!=='') {
        //   filtered = filtered.filter((row) => row.storename === contextstore);
        // }

        setData(filtered);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [store, ]);
   

  // Search functionality
  useEffect(() => {
    if (search === "") {
      setFilteredData(data);
    } else {
      const lowercasedSearch = search.toLowerCase();
      setFilteredData(
        data.filter((row) =>
          Object.values(row).join(" ").toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [search, data]);

  const handleFileUpload = async (e, row) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    if (ntid[row.serial].length !== 8) {
      // Create the toast element
      const toast = document.createElement("div");
      toast.className = "toast show position-fixed top-0 end-0 m-3";
      toast.setAttribute("role", "alert");
    
      // Set the toast HTML content
      toast.innerHTML = `
        <div class="toast-header bg-warning text-white">
          <strong class="me-auto">Warning</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          NTID must be 8 characters long.
        </div>
      `;
    
      // Append the toast to the body or a specific container
      document.body.appendChild(toast);
    
      // Automatically dismiss the toast after 5 seconds (optional)
      setTimeout(() => {
        toast.classList.remove("show");
      }, 5000);
        return;
    }
    
    formData.append("file", file);
    formData.append("serial", row.serial);
    formData.append("ntid", ntid[row.serial]);
    //  console.log(ntid[row.serial], "ntid");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/uploadimage`,{
          withCredentials:true,
        },
        formData,
        
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
       
      );
 if(response.status === 200){
  const toast = document.createElement("div");
      toast.className = "toast show position-fixed top-0 end-0 m-3";
      toast.setAttribute("role", "alert");
      toast.innerHTML = `
        <div class="toast-header bg-success text-white">
          <strong class="me-auto">Success</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          File uploaded successfully!
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      setData((prev) =>
        prev.map((item) =>
          item.serial === row.serial
            ? { ...item, imageurl: file, ntid: ntid[row.serial] }
            : item
        )
      )
      window.location.reload();
 }
      // Show success toast
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Error uploading file.";
      const toast = document.createElement("div");
      toast.className = "toast show position-fixed top-0 end-0 m-3";
      toast.setAttribute("role", "alert");
      toast.innerHTML = `
        <div class="toast-header bg-danger text-white">
          <strong class="me-auto">Error</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          ${errorMessage}
        </div>
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } finally {
      setNtid("");
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setModalFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = async () => {
    if (modalData) {
      try {
        // Prepare the data to be sent to the server
        const updatedData = { ...modalData, ...modalFields };
        updatedData.serial = serial;

        // Send the updated data to the server
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/updateData`,{
            withCredentials:true

          },
          updatedData
        );
//  console.log(modalFields,'mfs')
        // Check if the update was successful
        if (response.status === 200) {
          // Update local state with the new data
          setData((prev) =>
            prev.map((row) =>
              row.serial === modalData.serial ? { ...row, ...modalFields } : row
            )
          );
          //  console.log(data,'data')

          // Clear modal data and fields after successful submission
          setModalData(null);
          setModalFields({ RMADate: "", RMANumber: "", UPSTrackingNumber: "" });

          // Show a success message
          const toast = document.createElement("div");
          toast.className = "toast show position-fixed top-0 end-0 m-3";
          toast.setAttribute("role", "alert");
          toast.innerHTML = `
          <div class="toast-header bg-success text-white">
            <strong class="me-auto">Success</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
          </div>
          <div class="toast-body">
            Data updated successfully!
          </div>
        `;
          document.body.appendChild(toast);
          setTimeout(() => toast.remove(), 3000);
        } else {
          // Handle any errors if response status is not 200
          throw new Error("Failed to update data.");
        }
      } catch (err) {
        console.error("Error updating data:", err);

        // Show an error message if the update fails
        const toast = document.createElement("div");
        toast.className = "toast show position-fixed top-0 end-0 m-3";
        toast.setAttribute("role", "alert");
        toast.innerHTML = `
        <div class="toast-header bg-danger text-white">
          <strong class="me-auto">Error</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          ${err.message || "Error updating data."}
        </div>
      `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
  };

  const handleNtidChange = (e, rowSerial) => {
    const value = e.target.value;
    setNtid((prev) => ({
      ...prev,
      [rowSerial]: value, // Update NTID for the specific row
    }));
  };

  if (error)
    return (
      <div className="alert alert-danger m-4" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );

  return (
    <div className="container-fluid p-1">
      <Row className="justify-content-center">
        <Col md={6} sm={8} className="mb-2 mt-2">
          <div className="d-flex justify-content-center border border-2 rounded-pill px-2">
            <input
              type="text"
              className="form-control shadow-none  border-0"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
            />
            <CiSearch
              style={{
                marginTop: "0.6rem",
                color: "orange",
                fontWeight: "bolder",
                fontSize: "1.6rem",
              }}
            />
          </div>
        </Col>
      </Row>
      <div
        className="table-responsive animate__animated animate__fadeIn"
        style={{ maxHeight: "800px", overflowY: "auto" }}
      >
        <TableBody
          loading={loading}
          ntid={ntid}
          setModalData={setModalData}
          filteredData={filteredData}
          handleFileUpload={handleFileUpload}
          handleNtidChange={handleNtidChange}
          setSerial={setSerial}
        />
      </div>

      {modalData && (
        <div
          className="modal show d-block animate__animated animate__fadeIn"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2"></i>
                  Enter Additional Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalData(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar me-2"></i>
                    RMADate
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="RMADate"
                    value={modalFields.RMADate}
                    onChange={handleModalChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-hash me-2"></i>
                    RMANumber
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="RMANumber"
                    value={modalFields.RMANumber}
                    onChange={handleModalChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-truck me-2"></i>
                    UPSTrackingNumber
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="UPSTrackingNumber"
                    value={modalFields.UPSTrackingNumber}
                    onChange={handleModalChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalData(null)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalSubmit}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
