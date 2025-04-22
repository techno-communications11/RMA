import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../Styles/UserImageUploads.css';
import { BsUpload } from "react-icons/bs";
import { GoX } from "react-icons/go";
import { useParams } from 'react-router-dom';
import Button from '../Components/Events/Button';
import images from '../Constants/Images';
import SubmitImageApi from '../Components/Apis/SubmitImageApi';
import AlertMessage from '../Components/Messages/AlertMessage';

function UserImageUploads() {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileObjects, setFileObjects] = useState({}); // Store actual File objects
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const { key, value } = useParams();

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError(true);
        setMessage("Only image files are allowed");
        return;
      }

      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError(true);
        setMessage("File size must be less than 5MB");
        return;
      }

      setUploadedFiles(prev => ({
        ...prev,
        [id]: file.name
      }));

      setFileObjects(prev => ({
        ...prev,
        [id]: file
      }));
    }
  };

  const handleImagesSubmit = async () => {
    try {
      if (Object.keys(fileObjects).length === 0) {
        setError(true);
        setMessage("Please upload at least one image");
        return;
      }

      const formData = new FormData();
      formData.append('ntid', value);
      formData.append('old_imei', key);
      
      // Append all files
      Object.entries(fileObjects).forEach(([id, file]) => {
        formData.append(`image_${id}`, file);
      });
       console.log(formData,'ffffff')

      const response = await SubmitImageApi(formData);
      
      if (response.success) {
        setSuccess(true);
        setMessage(response.message);
        // Reset form on success
        setUploadedFiles({});
        setFileObjects({});
      } else {
        setError(true);
        setMessage(response.message || "Failed to upload images");
      }
    } catch (err) {
      setError(true);
      setMessage("An error occurred while uploading images");
      console.error("Upload error:", err);
    }
  };

  const handleDelete = (id) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setFileObjects(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleAlertClose = () => {
    setSuccess(false);
    setError(false);
    setMessage("");
  };

  return (
    <div className='mt-5 px-3'>
      {(success || error) && (
        <AlertMessage 
          message={message} 
          type={success ? 'success' : 'danger'} 
          onClose={handleAlertClose}
        />
      )}

      <Row>
        {images.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={6} lg={3} className="mb-4 d-flex">
            <div className="upload-card w-100">
              <p className="upload-note">{item.note}</p>
              
              {/* Image Preview */}
              <div className="image-container mb-3">
                <img 
                  src={item.image} 
                  alt={item.label} 
                  className="preview-image"
                />
              </div>
              
              <p className="image-label">{item.label}</p>
              
              {/* Show uploaded file name if exists */}
              {uploadedFiles[item.id] && (
                <div className="uploaded-file-name mb-2 d-flex justify-content-between align-items-center">
                  <small>Uploaded: {uploadedFiles[item.id]}</small>
                  <GoX 
                    onClick={() => handleDelete(item.id)}  
                    style={{ cursor: 'pointer' }} 
                    className='fs-6 text-danger'
                  />
                </div>
              )}
              
              <div className="file-upload-wrapper">
                <input 
                  type="file" 
                  id={`fileUpload-${item.id}`}
                  className="file-upload-input" 
                  onChange={(e) => handleFileChange(e, item.id)}
                  accept="image/*"
                />
                <label htmlFor={`fileUpload-${item.id}`} className="file-upload-label">
                  <BsUpload className='me-2' />
                  <span>Upload image</span>
                </label>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col className="text-end me-5">
          <Button 
            onClick={handleImagesSubmit}  
            variant="btn-md btn-primary brn-sm px-5" 
            label="Submit"
            disabled={Object.keys(uploadedFiles).length === 0}
          />
        </Col>
      </Row>
    </div>
  );
}

export default UserImageUploads;