import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX, FiFile } from "react-icons/fi";
import { FaExclamationCircle } from "react-icons/fa";
import "../Styles/Upload.css";
import FileTypes from "../Constants/FileTypes";
import LoadingSpinner from "../Components/Messages/LoadingSpinner";
import Button from "../Components/Events/Button";
import AlertMessage from "../Components/Messages/AlertMessage"; // Custom Alert
import { handleUpload, validateFile } from "../Components/Apis/uploadUtils";

function FileUpload() {
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: selectedType?.accept || "",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (selectedType && acceptedFiles.length > 0) {
        const fileValidation = validateFile(acceptedFiles[0], [
          selectedType.accept,
        ]);
        if (fileValidation.valid) {
          setFile(acceptedFiles[0]);
          setError(null);
          setSuccess(null);
        } else {
          setError({
            title: "Invalid File",
            message: fileValidation.error,
          });
        }
      }
    },
    disabled: !selectedType || isLoading,
  });

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleUploadClick = async () => {
    if (!file || !selectedType) {
      setError({
        title: "Missing Data",
        message: "Please select a file and data type",
      });
      return;
    }

     console.log("Uploading file:", file.name, "Type:", selectedType.label);

    try {
      const result = await handleUpload({
        file ,
        type: selectedType,
        onSuccess: (successData) => {
          setSuccess(successData);
          setFile(null);
          setSelectedType(null);
          setError(null);
        },
        onError: (errorData) => {
          setError(errorData);
        },
        onFinally: () => {
          setIsLoading(false);
        },
      });

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError({
        title: "Upload Failed",
        message: "An unexpected error occurred during upload",
      });
      console.error("Upload error:", err);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setFile(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="upload-container container-fluid py-4">
      <h2 className="text-pink-600 fw-bold text-center">Data Upload Center</h2>
      <p className="text-muted text-center instruction">
        Select data type to upload
      </p>

      <div className="type-selector d-flex flex-wrap justify-content-center gap-2 mb-4">
        {FileTypes.map((type) => (
          <Button
            key={type.id}
            label={type.label}
            variant={`btn ${
              selectedType?.id === type.id
                ? "btn-primary"
                : "btn-outline-primary"
            } p-2 text-pink-600`}
            onClick={() => handleTypeSelect(type)}
            disabled={isLoading && selectedType?.id !== type.id}
          />
        ))}
      </div>

      {!selectedType && (
        <AlertMessage
          message="Please select a data type first"
          type="info"
          icon={<FaExclamationCircle className="me-2" />}
          onClose={() => setError(null)}
        />
      )}

      {selectedType && (
        <>
          <div className="type-info text-center mb-4">
            <h3 className="text-pink-600">{selectedType.label}</h3>
            <p className="text-muted">{selectedType.description}</p>
          </div>

          <div
            {...getRootProps()}
            className={`dropzone ${
              isDragActive ? "active" : ""
            } ${!selectedType || isLoading ? "disabled" : ""}`}
          >
            <input {...getInputProps()} />
            <div className="upload-content text-center">
              <FiUpload size={48} className="upload-icon text-pink-600" />
              {isDragActive ? (
                <p>Drop {selectedType.label} file here...</p>
              ) : (
                <>
                  <p>Drag & drop file here, or click to browse</p>
                  <small>Accepted format: {selectedType.accept}</small>
                </>
              )}
            </div>
          </div>

          {file && (
            <div className="file-preview mt-3">
              <div className="file-info d-flex align-items-center gap-2">
                <FiFile className="file-icon text-pink-600" />
                <div>
                  <p className="filename mb-0">{file.name}</p>
                  <p className="file-meta text-muted mb-0">
                    {(file.size / 1024).toFixed(2)} KB • {selectedType.label}
                  </p>
                </div>
                <Button
                  label={<FiX />}
                  variant="btn-danger btn-sm"
                  onClick={removeFile}
                  disabled={isLoading}
                />
              </div>

              <div className="d-flex gap-2 mt-3">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Button
                      label={`Upload ${selectedType.label}`}
                      variant="btn-success w-100"
                      onClick={handleUploadClick}
                      disabled={!file || isLoading}
                    />
                    <Button
                      label="Reset"
                      variant="btn-secondary w-100"
                      onClick={handleReset}
                      disabled={isLoading}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {(error || success) && (
        <AlertMessage
          message={error?.message || success?.message}
          type={error ? "danger" : "success"}
          icon={error ? <FaExclamationCircle className="me-2" /> : null}
          onClose={() => {
            setError(null);
            setSuccess(null);
          }}
        />
      )}
    </div>
  );
}

export default FileUpload;