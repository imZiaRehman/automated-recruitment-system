import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaSpinner } from 'react-icons/fa';
import './ApplyModal.css';

const ApplyModal = ({ isOpen, onClose, onSubmit, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    onFileUpload(file); // Call the callback function with the file data
  };

  const handleSubmit = async () => {
    setIsLoading(true); // Set loading state to true
    await onSubmit(selectedFile); // Wait for the submit function to finish
    setIsLoading(false); // Set loading state to false
    console.log("Handle Submit of Apply Modal Called");
  };

  // Style configuration for the modal
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles} // Apply the custom styles
      ariaHideApp={false} // Disable accessibility warning
    >
      <div className="apply-modal-container">
        <h3 className="apply-modal-heading">Select your updated resume</h3>
        <p className="apply-modal-instructions">
          Please make sure to have GPA, University, and Contact information in the resume.
          Upload your resume in PDF format.
        </p>
        <form className="apply-modal-form">
          <input type="file" accept=".pdf" onChange={handleFileChange} className="apply-modal-file-input" />
          {isLoading ? (
            <button className="apply-modal-submit-button" disabled>
              <FaSpinner className="apply-modal-spinner" /> Submitting...
            </button>
          ) : (
            <button onClick={handleSubmit} className="apply-modal-submit-button">
              Submit
            </button>
          )}
        </form>
      </div>

    </Modal>
  );
};

export default ApplyModal;
