import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTenant } from "../../services/TenantService";
import "./TenantAddPage.css";

const TenantAddPage = () => {
  const navigate = useNavigate();
  const [tenantDetails, setTenantDetails] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTenant(tenantDetails);
      alert("Tenant successfully added!");
      navigate("/super-admin/tenants");
    } catch (error) {
      console.error("Error creating tenant:", error);
      alert("Failed to create tenant. Please try again.");
    }
  };

  return (
    <div className="tenant-add-page">
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li onClick={() => navigate("/super-admin/overview")}>Overview</li>
          <li onClick={() => navigate("/super-admin/tenants")} className="active">
            Tenants
          </li>
          <li onClick={() => navigate("/super-admin/onboarding")}>Onboarding</li>
          <li onClick={() => navigate("/super-admin/reports")}>Reports</li>
          <li onClick={() => navigate("/super-admin/settings")}>Settings</li>
        </ul>
      </aside>

      <main className="content">
        <header className="page-header">
          <h1>Add New Tenant</h1>
        </header>

        <form onSubmit={handleSubmit} className="tenant-form">
          <div className="form-row">
            <label>
              Tenant Name:
              <input
                type="text"
                name="name"
                value={tenantDetails.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Registration Number:
              <input
                type="text"
                name="registrationNumber"
                value={tenantDetails.registrationNumber}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Industry Type:
              <input
                type="text"
                name="industryType"
                value={tenantDetails.industryType}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Website:
              <input
                type="text"
                name="website"
                value={tenantDetails.website}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Date Established:
              <input
                type="date"
                name="dateEstablished"
                value={tenantDetails.dateEstablished}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <h3>Address</h3>
          <div className="form-row">
            <label>
              Street:
              <input
                type="text"
                name="street"
                value={tenantDetails.address.street}
                onChange={(e) =>
                  handleNestedChange("address", "street", e.target.value)
                }
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={tenantDetails.address.city}
                onChange={(e) =>
                  handleNestedChange("address", "city", e.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              State:
              <input
                type="text"
                name="state"
                value={tenantDetails.address.state}
                onChange={(e) =>
                  handleNestedChange("address", "state", e.target.value)
                }
                required
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                name="country"
                value={tenantDetails.address.country}
                onChange={(e) =>
                  handleNestedChange("address", "country", e.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Zip Code:
              <input
                type="text"
                name="zipCode"
                value={tenantDetails.address.zipCode}
                onChange={(e) =>
                  handleNestedChange("address", "zipCode", e.target.value)
                }
                required
              />
            </label>
          </div>

          <h3>Contact Details</h3>
          <div className="form-row">
            <label>
              Contact Name:
              <input
                type="text"
                name="name"
                value={tenantDetails.contactDetails.name}
                onChange={(e) =>
                  handleNestedChange("contactDetails", "name", e.target.value)
                }
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={tenantDetails.contactDetails.email}
                onChange={(e) =>
                  handleNestedChange("contactDetails", "email", e.target.value)
                }
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Phone:
              <input
                type="tel"
                name="phone"
                value={tenantDetails.contactDetails.phone}
                onChange={(e) =>
                  handleNestedChange("contactDetails", "phone", e.target.value)
                }
                required
              />
            </label>
          </div>

          <button type="submit" className="primary-button">
            Save Tenant
          </button>
        </form>
      </main>
    </div>
  );
};

export default TenantAddPage;