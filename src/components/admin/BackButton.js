// src/components/common/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css'; // Import the corresponding CSS

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigates back one step in the history
  };

  return (
    <button
      className="button button--secondary back-button"
      onClick={handleBack}
      aria-label="Go back to the previous page"
    >
      <i className="fas fa-arrow-left" aria-hidden="true"></i> Back
    </button>
  );
};

export default BackButton;