import React from 'react';

const ModalForm = ({ modalData, modalFields, handleModalChange, handleModalSubmit, onHide }) => {
  if (!modalData) return null;

  return (
    <div className="modal show d-block animate__animated animate__fadeIn" tabIndex="-1">
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
              onClick={onHide}
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
              onClick={onHide}
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
  );
};

export default ModalForm;