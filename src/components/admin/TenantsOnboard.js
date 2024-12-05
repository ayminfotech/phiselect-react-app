import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllTenants,
  deleteTenant,
  activateTenant,
  deactivateTenant,
} from "../../services/TenantService";
import { AuthContext } from "../auth/AuthContext";
import TenantSidebar from "./TenantSidebar";
import TenantList from "./TenantList";
import "./TenantsOnboard.css";

const TenantsOnboard = () => {
  const [tenants, setTenants] = useState([]);
  const [activeItem, setActiveItem] = useState("Tenants");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const data = await getAllTenants();
        setTenants(data);
      } catch (error) {
        console.error("Error fetching tenants:", error);
      }
    };
    fetchTenants();
  }, []);

  const handleEditTenant = (tenant) => {
    // Navigate to the edit page with tenant data passed via state
    navigate(`/super-admin/tenants/${tenant.id}/edit`, { state: { tenant } });
  };

  const handleAddTenant = () => {
    navigate("/super-admin/tenants/add");
  };

  const handleDeleteTenant = async (tenantId) => {
    try {
      // Delete the tenant and update the list
      await deleteTenant(tenantId);
      setTenants((prev) => prev.filter((t) => t.id !== tenantId));
      alert("Tenant deleted successfully.");
    } catch (error) {
      console.error("Error deleting tenant:", error);
      alert("Failed to delete tenant. Please try again.");
    }
  };

  const handleActivateTenant = async (organizationRefId) => {
    try {
      // Activate the tenant and update the UI
      await activateTenant(organizationRefId);
      setTenants((prev) =>
        prev.map((t) =>
          t.organizationRefId === organizationRefId
            ? { ...t, status: "Active" }
            : t
        )
      );
      alert("Tenant activated successfully.");
    } catch (error) {
      console.error("Error activating tenant:", error);
      alert("Failed to activate tenant. Please try again.");
    }
  };

  const handleDeactivateTenant = async (organizationRefId) => {
    try {
      // Deactivate the tenant and update the UI
      await deactivateTenant(organizationRefId);
      setTenants((prev) =>
        prev.map((t) =>
          t.organizationRefId === organizationRefId
            ? { ...t, status: "Inactive" }
            : t
        )
      );
      alert("Tenant deactivated successfully.");
    } catch (error) {
      console.error("Error deactivating tenant:", error);
      alert("Failed to deactivate tenant. Please try again.");
    }
  };

  return (
    <div className="tenants-onboard-container">
      <TenantSidebar
        activeItem={activeItem}
        onMenuClick={setActiveItem}
        onLogout={logout}
      />
      <main className="content">
        <header className="header">
          <h1>Manage Tenants</h1>
          <button className="primary-button" onClick={handleAddTenant}>
            Add Tenant
          </button>
        </header>
        <section className="tenant-list-container">
          <TenantList
            tenants={tenants}
            onEditTenant={handleEditTenant}
            onDeleteTenant={handleDeleteTenant}
            onActivateTenant={handleActivateTenant}
            onDeactivateTenant={handleDeactivateTenant}
          />
        </section>
      </main>
    </div>
  );
};

export default TenantsOnboard;