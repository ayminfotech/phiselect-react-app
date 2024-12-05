import React, { useState } from "react";
import "./TenantModal.css";

const TenantModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
    contactDetails: {
      name: "",
      email: "",
      phone: "",
    },
    registrationNumber: "",
    industryType: "",
    website: "",
    dateEstablished: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [key, subKey] = name.split(".");
    if (subKey) {
      setFormData((prevState) => ({
        ...prevState,
        [key]: { ...prevState[key], [subKey]: value },
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [key]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Tenant</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Organization Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Street:
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
            />
          </label>
          <label>
            State:
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
            />
          </label>
          <label>
            Contact Name:
            <input
              type="text"
              name="contactDetails.name"
              value={formData.contactDetails.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Contact Email:
            <input
              type="email"
              name="contactDetails.email"
              value={formData.contactDetails.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Website:
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </label>
          <label>
            Date Established:
            <input
              type="date"
              name="dateEstablished"
              value={formData.dateEstablished}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="primary-button">
            Save
          </button>
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default TenantModal;