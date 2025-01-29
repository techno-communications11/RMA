import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { BsUpload } from "react-icons/bs";
import axios from "axios";
import Lottie from "lottie-react";
import Animation from "./Animation.json";
import time from "./timeloading.json";

// Comprehensive File Upload Component
const Upload = () => {
  // State Management
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Accepted File Types Configuration
  const ACCEPTED_FILE_TYPES = {
    "text/csv": [".csv"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
      ".xlsx",
    ],
  };

  // Enhanced File Upload Handler
  const handleFileUpload = useCallback(async (acceptedFiles, endpoint) => {
    const file = acceptedFiles[0];

    if (!file) {
      setUploadStatus("No file selected");
      return;
    }

    // File Validation
    const validFileTypes = Object.values(ACCEPTED_FILE_TYPES).flat();
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!validFileTypes.includes(`.${fileExtension}`)) {
      setUploadStatus("Invalid file type");
      return;
    }

    // File Size Validation (Optional)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxFileSize) {
      setUploadStatus("File too large. Max 5MB allowed.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Optional: Add timeout and progress tracking
          
        }
      );

      // Success Handling
      setTimeout(()=>{
        setUploadStatus("File uploaded successfully!");
        setUploadedFile(file);
      },[2000])
   
      window.location.reload();

      // Optional: Additional success logic
      // Trigger any post-upload actions or state updates
    } catch (error) {
      // Comprehensive Error Handling
      console.error("Upload Error:", error);

      if (error.response) {
        // Server responded with an error status
        setUploadStatus(error.response.data.message || "Server upload error");
      } else if (error.request) {
        // Request made but no response received
        setUploadStatus("No response from server");
      } else {
        // Network or configuration error
        setUploadStatus("Upload failed. Please check your connection.");
      }
    } finally {
      // Always reset uploading state
      setIsUploading(false);
    }
  }, []);

  // Dropzone Configuration for File Upload
  const {
    getRootProps: getRootPropsFile,
    getInputProps: getInputPropsFile,
    isDragActive: isDragActiveFile,
  } = useDropzone({
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles, "uploaddata"),
    accept: ACCEPTED_FILE_TYPES,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  // Similar configuration for RMA Data Upload
  const { getRootProps: getRootPropsData, getInputProps: getInputPropsData } =
    useDropzone({
      onDrop: (acceptedFiles) =>
        handleFileUpload(acceptedFiles, "uploaddata-details"),
      accept: ACCEPTED_FILE_TYPES,
      multiple: false,
    });

  return (
    <div className="container-fluid">
      <div
        className="row justify-content-between align-items-center"
        style={{ height: "15rem" }}
      >
        {/* Insert Data Upload Section */}
        <div className=" ms-5 col-lg-3 col-md-4  shadow-lg p-2 rounded">
          <h3 className="text-center">Insert Data</h3>
          <div
            {...getRootPropsFile()}
            className={`card shadow-sm p-1 text-center border-dashed ${
              isDragActiveFile ? "border-success" : "border-primary"
            }`}
            style={{
              cursor: "pointer",
              borderStyle: "dashed",
              borderWidth: "2px",
            }}
          >
            <input {...getInputPropsFile()} />
            <BsUpload size={50} className="text-primary  mx-auto" />
            <p className="text-muted">
              {isDragActiveFile
                ? "Drop file here"
                : "Drag & drop file or click to select"}
            </p>
          </div>

          {/* Status Messages */}
        </div>

        {/* Animation Section */}
        <div
          className="col-lg-3 col-md-4  text-center bg-warning rounded"
          style={{ position: "relative", bottom: "3.2rem" }}
        >
          <Lottie
            animationData={Animation}
            loop
            autoplay
            style={{
              maxHeight: "200px",
              position: "relative",
              bottom: "4.7rem",
            }}
          />

          {uploadStatus && (
            <div
              className={`alert ${
                uploadStatus.includes("successfully")
                  ? "alert-success"
                  : "alert-danger"
              } mt-1`}
            >
              {uploadStatus}
            </div>
          )}
        </div>

        {/* RMA Data Upload Section */}
        <div className=" me-5 col-lg-3 col-md-4 shadow-lg p-3 rounded">
          {/* Similar structure to first upload section */}
          <h3 className="text-center font-calibra">Upload RMA Data</h3>

          <div
            {...getRootPropsData()}
            className="card shadow-sm p-1 text-center border-dashed border-primary"
            style={{
              cursor: "pointer",
              borderStyle: "dashed",
              borderWidth: "2px",
            }}
          >
            <input {...getInputPropsData()} />
            <BsUpload size={50} className="text-primary mx-auto" />
            <p className="text-muted">Upload RMA Data</p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light"
          style={{ zIndex: 1050 }}
        >
          <div className="text-center">
            <Lottie
              animationData={time}
              loop
              autoplay
              style={{ maxHeight: "200px" }}
            />
            <h3 className="mt-3">Uploading... Please wait</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
