import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../Styles/UserImageUploads.css';
import { BsUpload } from "react-icons/bs";
import { GoX } from "react-icons/go";
import { useParams } from 'react-router-dom';
import Button from '../Components/Events/Button';


function UserImageUploads() {
  const [uploadedFiles, setUploadedFiles] = useState({});
   const {key,value}=useParams();
   console.log(key,value)
  
  const images = [
    { id: 1, image: '/phone-front.png', label: 'Front', note: 'Upload image' },
    { id: 2, image: '/phone-back.png', label: 'Back', note: 'Upload image' },
    { id: 3, image: '/imei.png', label: 'IMEI', note: '12345678901245' },
    { id: 4, image: '/label.png', label: 'Label', note: 'Upload image' }
  ];

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [id]: file.name
      }));
    }
  };

  const handleImagesSubmit = () => {
    alert("Images submitted");
     console.log(uploadedFiles)
  };

   const handleDelete=(id)=>{
    setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[id]; // remove the key
        return updated;
      });

   }

  return (
    <div className='mt-5 px-3'>
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
                <div className="uploaded-file-name mb-2">
                  <small>Uploaded: {uploadedFiles[item.id]}</small><span><GoX  onClick={()=>handleDelete(item.id)}  style={{cursor:'pointer'}} className='fs-2 text-danger'/></span>
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
        <Col className="text-end me-5 ">
        <Button onClick={handleImagesSubmit}  
        variant="btn-md btn-primary brn-sm px-5" 
        label="Submit"/>
        </Col>
      </Row>
    </div>
  );
}

export default UserImageUploads;