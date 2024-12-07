// src/components/admin/TenantAddPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTenet } from "../../services/TenantService"; // Corrected function name
import ConfirmDialog from "./ConfirmDialog"; // Import ConfirmDialog component
import BackButton from "./BackButton"; // Import BackButton component
import "./TenantAddPage.css"; // Corrected CSS filename

const TenantAddPage = () => {
  const navigate = useNavigate();
  const [tenantDetails, setTenantDetails] = useState({
    name: "",
    registrationNumber: "",
    industryType: "",
    website: "",
    dateEstablished: "",
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
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTenantDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, name, value) => {
    setTenantDetails((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const validateForm = () => {
    const errors = {};
    // Basic validation
    if (!tenantDetails.name.trim()) {
      errors.name = "Tenant name is required.";
    }
    if (!tenantDetails.registrationNumber.trim()) {
      errors.registrationNumber = "Registration number is required.";
    }
    if (!tenantDetails.industryType.trim()) {
      errors.industryType = "Industry type is required.";
    }
    if (!tenantDetails.website.trim()) {
      errors.website = "Website is required.";
    }
    if (!tenantDetails.dateEstablished) {
      errors.dateEstablished = "Date established is required.";
    }
    // Address validation
    const address = tenantDetails.address;
    if (!address.street.trim()) errors.street = "Street is required.";
    if (!address.city.trim()) errors.city = "City is required.";
    if (!address.state.trim()) errors.state = "State is required.";
    if (!address.country.trim()) errors.country = "Country is required.";
    if (!address.zipCode.trim()) errors.zipCode = "Zip Code is required.";
    // Contact Details validation
    const contact = tenantDetails.contactDetails;
    if (!contact.name.trim()) errors.contactName = "Contact name is required.";
    if (!contact.email.trim()) {
      errors.contactEmail = "Contact email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(contact.email)
    ) {
      errors.contactEmail = "Invalid email address.";
    }
    if (!contact.phone.trim()) errors.contactPhone = "Contact phone is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      await createTenet(tenantDetails); // Corrected function name
      alert("Tenant successfully added!");
      navigate("/super-admin/tenants");
    } catch (error) {
      console.error("Error creating tenant:", error);
      setConfirmAction(() => () => {
        alert("Failed to create tenant. Please try again.");
        setShowConfirm(false);
      });
      setShowConfirm(true);
    }
  };

  const handleCancel = () => {
    navigate("/super-admin/tenants");
  };

  return (
    <div className="tenant-add-page">
      {showConfirm && (
        <ConfirmDialog
          title="Error"
          message="An error occurred while creating the tenant. Please try again."
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li onClick={() => navigate("/super-admin/overview")}>Overview</li>
          <li
            onClick={() => navigate("/super-admin/tenants")}
            className="active"
          >
            Tenants
          </li>
          <li onClick={() => navigate("/super-admin/onboarding")}>
            Onboarding
          </li>
          <li onClick={() => navigate("/super-admin/reports")}>Reports</li>
          <li onClick={() => navigate("/super-admin/settings")}>Settings</li>
        </ul>
      </aside>

      <main className="content">
        <header className="page-header">
          <h1>Add New Tenant</h1>
          <BackButton /> {/* Integrated BackButton */}
        </header>

        <form onSubmit={handleSubmit} className="tenant-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Tenant Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={tenantDetails.name}
                  onChange={handleChange}
                  required
                  className={formErrors.name ? "input-error" : ""}
                />
                {formErrors.name && (
                  <span className="error-text">{formErrors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="registrationNumber">Registration Number</label>
                <input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={tenantDetails.registrationNumber}
                  onChange={handleChange}
                  required
                  className={
                    formErrors.registrationNumber ? "input-error" : ""
                  }
                />
                {formErrors.registrationNumber && (
                  <span className="error-text">
                    {formErrors.registrationNumber}
                  </span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="industryType">Industry Type</label>
                <input
                  type="text"
                  id="industryType"
                  name="industryType"
                  value={tenantDetails.industryType}
                  onChange={handleChange}
                  required
                  className={formErrors.industryType ? "input-error" : ""}
                />
                {formErrors.industryType && (
                  <span className="error-text">{formErrors.industryType}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={tenantDetails.website}
                  onChange={handleChange}
                  required
                  className={formErrors.website ? "input-error" : ""}
                />
                {formErrors.website && (
                  <span className="error-text">{formErrors.website}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateEstablished">Date Established</label>
                <input
                  type="date"
                  id="dateEstablished"
                  name="dateEstablished"
                  value={tenantDetails.dateEstablished}
                  onChange={handleChange}
                  required
                  className={
                    formErrors.dateEstablished ? "input-error" : ""
                  }
                />
                {formErrors.dateEstablished && (
                  <span className="error-text">
                    {formErrors.dateEstablished}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Address</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="street">Street</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={tenantDetails.address.street}
                  onChange={(e) =>
                    handleNestedChange("address", "street", e.target.value)
                  }
                  required
                  className={formErrors.street ? "input-error" : ""}
                />
                {formErrors.street && (
                  <span className="error-text">{formErrors.street}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={tenantDetails.address.city}
                  onChange={(e) =>
                    handleNestedChange("address", "city", e.target.value)
                  }
                  required
                  className={formErrors.city ? "input-error" : ""}
                />
                {formErrors.city && (
                  <span className="error-text">{formErrors.city}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={tenantDetails.address.state}
                  onChange={(e) =>
                    handleNestedChange("address", "state", e.target.value)
                  }
                  required
                  className={formErrors.state ? "input-error" : ""}
                />
                {formErrors.state && (
                  <span className="error-text">{formErrors.state}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={tenantDetails.address.country}
                  onChange={(e) =>
                    handleNestedChange("address", "country", e.target.value)
                  }
                  required
                  className={formErrors.country ? "input-error" : ""}
                />
                {formErrors.country && (
                  <span className="error-text">{formErrors.country}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={tenantDetails.address.zipCode}
                  onChange={(e) =>
                    handleNestedChange("address", "zipCode", e.target.value)
                  }
                  required
                  className={formErrors.zipCode ? "input-error" : ""}
                />
                {formErrors.zipCode && (
                  <span className="error-text">{formErrors.zipCode}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactName">Contact Name</label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={tenantDetails.contactDetails.name}
                  onChange={(e) =>
                    handleNestedChange("contactDetails", "name", e.target.value)
                  }
                  required
                  className={formErrors.contactName ? "input-error" : ""}
                />
                {formErrors.contactName && (
                  <span className="error-text">{formErrors.contactName}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={tenantDetails.contactDetails.email}
                  onChange={(e) =>
                    handleNestedChange("contactDetails", "email", e.target.value)
                  }
                  required
                  className={formErrors.contactEmail ? "input-error" : ""}
                />
                {formErrors.contactEmail && (
                  <span className="error-text">{formErrors.contactEmail}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPhone">Phone</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={tenantDetails.contactDetails.phone}
                  onChange={(e) =>
                    handleNestedChange("contactDetails", "phone", e.target.value)
                  }
                  required
                  className={formErrors.contactPhone ? "input-error" : ""}
                />
                {formErrors.contactPhone && (
                  <span className="error-text">{formErrors.contactPhone}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Save Tenant
            </button>
            <button type="button" className="secondary-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default TenantAddPage;