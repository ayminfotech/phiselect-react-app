// src/components/common/BackToHomeButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackToHomeButton.css'; // Import the corresponding CSS

const BackToHomeButton = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/'); // Adjust the path if your home route is different
  };

  return (
    <button
      className="button button--secondary back-to-home"
      onClick={handleBackToHome}
      aria-label="Navigate back to the home page"
    >
      <i className="fas fa-home" aria-hidden="true"></i> Home
    </button>
  );
};

export default BackToHomeButton;