import React, { useEffect, useState, useCallback } from 'react';
import GetUserUploadedImages from '../Components/Apis/GetUserUploadedImages';
import LoadingSpinner from '../Components/Messages/LoadingSpinner';
import { format } from 'date-fns';
import { Modal, Button } from 'react-bootstrap'; // Ensure react-bootstrap is installed

function ShowUserUploadedData({ showntid }) {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const normalizedShowntid = showntid ? String(showntid).trim() : '';
  console.log('showntid:', showntid, 'normalizedShowntid:', normalizedShowntid);

  const fetchUploadedImages = useCallback(async () => {
    if (!normalizedShowntid) {
      setError('Invalid or missing showntid');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await GetUserUploadedImages(normalizedShowntid);
      console.log('Uploaded Images response:', response);
      setUploadedImages(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, [normalizedShowntid]);

  useEffect(() => {
    fetchUploadedImages();
  }, [fetchUploadedImages]);

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  if (!normalizedShowntid && !loading && !uploadedImages.length) {
    return null;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Error: {error}
        {error.includes('No images found') && (
          <div className="mt-2">
            <small>No images are available for this device.</small>
          </div>
        )}
      </div>
    );
  }

  const imageTypes = {
    1: { label: 'Front Image', url: null },
    2: { label: 'Back Image', url: null },
    3: { label: 'IMEI Image', url: null },
    4: { label: 'Label Image', url: null },
  };

  uploadedImages.forEach((image) => {
    const typeId = Number(image.image_type_id);
    if (imageTypes[typeId]) {
      imageTypes[typeId].url = image.signedImageUrl || null;
    }
  });

  return (
    <div className="container mt-5 mb-5">
      <h3 className="text-center mb-1 text-primary ">Device Images</h3>
      <div className="text-center mb-5">
        <h4 className="text-muted">For IMEI: {normalizedShowntid || 'N/A'}</h4>
      </div>

      <div className="row">
        {Object.entries(imageTypes).map(([typeId, imageData]) => (
          <div key={typeId} className="col-md-3 col-sm-6 mb-4">
            <div
              className="card h-100 shadow-sm border-0"
              style={{
                borderRadius: '15px',
                transition: 'transform 0.3s',
                cursor: imageData.url ? 'pointer' : 'default',
              }}
              onClick={() => imageData.url && handleImageClick(imageData.url)}
              onMouseEnter={(e) =>
                imageData.url && (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                imageData.url && (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              <div
                className="card-header  text-muted text-center "
              
              >
                <h5 className=" mb-0 small">{imageData.label}</h5>
              </div>
              <div
                className="card-body d-flex align-items-center justify-content-center"
                style={{ minHeight: '200px' }}
              >
                {imageData.url ? (
                  <img
                    src={imageData.url}
                    alt={imageData.label}
                    className="img-fluid rounded"
                    style={{ maxHeight: '180px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                      console.warn(`Failed to load image: ${imageData.url}`);
                    }}
                  />
                ) : (
                  <div className="text-muted">No image available</div>
                )}
              </div>
              <div
                className="card-footer text-center"
                style={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}
              >
                <small className="text-muted">
                  {imageData.url ? 'Uploaded' : 'Not uploaded'}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h4 className="text-center text-primary mb-4">Upload Details</h4>
        {uploadedImages.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-hover table-bordered shadow-sm">
              <thead className="bg-light">
                <tr className='text-center'>
                  <th>Image Type</th>
                  <th>Uploaded At</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {uploadedImages.map((image) => (
                  <tr key={image.id} className='text-center'>
                    <td>
                      {imageTypes[Number(image.image_type_id)]?.label ||
                        `Type ${image.image_type_id}`}
                    </td>
                    <td>
                      {image.created_at
                        ? format(new Date(image.created_at), 'PPp')
                        : 'N/A'}
                    </td>
                    <td>
                      {image.updated_at
                        ? format(new Date(image.updated_at), 'PPp')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-muted">No upload details available</div>
        )}
      </div>

      {/* Modal for displaying full-size image */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>View Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex justify-content-center align-items-center p-4">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Full-size view"
              className="img-fluid"
              style={{ maxHeight: '70vh', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = '/placeholder-image.png';
                console.warn(`Failed to load full-size image: ${selectedImage}`);
              }}
            />
          ) : (
            <div className="text-muted">Image not available</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ShowUserUploadedData;