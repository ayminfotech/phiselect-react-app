// src/components/admin/TenantEditPage.js

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getTenetById, updateTenet } from "../../services/TenantService"; // Corrected function names
import "./TenetEditPage.css"; // Corrected file name

const TenantEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Fetch Tenant ID from URL
  const [tenantDetails, setTenantDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tenant data
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true);
        const data = await getTenetById(id); // Corrected function name
        setTenantDetails({
          id: data.id || "",
          name: data.name || "",
          registrationNumber: data.registrationNumber || "",
          industryType: data.industryType || "",
          email: data.contactDetails?.email || "",
          phone: data.contactDetails?.phone || "",
          address: {
            id: data.address?.id || "",
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            country: data.address?.country || "",
            zipCode: data.address?.zipCode || "",
          },
          contactDetails: {
            id: data.contactDetails?.id || "",
            name: data.contactDetails?.name || "",
            email: data.contactDetails?.email || "",
            phone: data.contactDetails?.phone || "",
          },
          website: data.website || "",
          dateEstablished: data.dateEstablished
            ? data.dateEstablished.substring(0, 10)
            : "", // Format date for input[type="date"]
          organizationRefId: data.organizationRefId || "",
          tenant: {
            id: data.tenant?.id || "",
            name: data.tenant?.name || "",
            tenantId: data.tenant?.tenantId || "",
          },
          active: data.active ? "true" : "false", // Ensure it's a string
          deactivationReason: data.deactivationReason || "",
        });
      } catch (error) {
        console.error("Error fetching tenant:", error);
        alert("Failed to load tenant data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id]);

  // Validation schema (without tenantId)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tenant name is required"),
    registrationNumber: Yup.string().required("Registration number is required"),
    industryType: Yup.string().required("Industry type is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.object().shape({
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      zipCode: Yup.string().required("Zip Code is required"),
    }),
    contactDetails: Yup.object().shape({
      name: Yup.string().required("Contact name is required"),
      email: Yup.string()
        .email("Invalid email")
        .required("Contact email is required"),
      phone: Yup.string().required("Contact phone is required"),
    }),
    website: Yup.string().url("Invalid URL").nullable(),
    dateEstablished: Yup.date().required("Date established is required"),
    active: Yup.string()
      .oneOf(["true", "false"], "Invalid status")
      .required("Status is required"),
    deactivationReason: Yup.string().when("active", {
      is: "false",
      then: () => Yup.string().required("Deactivation reason is required"),
      otherwise: () => Yup.string().nullable(),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("Form submission triggered with values:", values); // Debugging log

    // Construct the payload to match the backend structure
    const updatedValues = {
      id: values.id, // Ensure the ID is included if needed
      name: values.name,
      registrationNumber: values.registrationNumber,
      industryType: values.industryType,
      contactDetails: {
        id: values.contactDetails.id, // Include contactDetails ID
        name: values.contactDetails.name,
        email: values.contactDetails.email,
        phone: values.contactDetails.phone,
      },
      address: {
        id: values.address.id, // Include address ID
        street: values.address.street,
        city: values.address.city,
        state: values.address.state,
        country: values.address.country,
        zipCode: values.address.zipCode,
      },
      website: values.website,
      dateEstablished: values.dateEstablished,
      active: values.active === "true",
      deactivationReason: values.deactivationReason,
      organizationRefId: values.organizationRefId, // Include if necessary
      tenant: {
        id: values.tenant.id, // Include tenant ID
        name: values.tenant.name,
        tenantId: values.tenant.tenantId,
      },
    };

    try {
      await updateTenet(id, updatedValues); // Corrected function name
      alert("Tenant updated successfully!");
      navigate("/super-admin/tenants");
    } catch (error) {
      console.error("Error updating tenant:", error);
      if (error.response) {
        // The request was made, and the server responded with a status code outside 2xx
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);

        if (error.response.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else {
          alert(
            `Failed to update tenant: ${
              error.response.data.message || "Unknown error."
            }`
          );
        }
      } else if (error.request) {
        // The request was made, but no response was received
        console.error("Request data:", error.request);
        alert("No response from the server. Please try again later.");
      } else {
        // Something happened in setting up the request
        console.error("Error message:", error.message);
        alert("An error occurred while setting up the request.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tenantDetails) {
    return <div>No tenant data available.</div>;
  }

  return (
    <div className="tenant-edit-page">
      <h2>Edit Tenant</h2>

      {/* Show Tenant Summary */}
      <div className="tenant-summary">
        <h3>Tenant Details</h3>
        <p>
          <strong>Name:</strong> {tenantDetails.name}
        </p>
        <p>
          <strong>Email:</strong> {tenantDetails.contactDetails.email}
        </p>
        <p>
          <strong>Phone:</strong> {tenantDetails.contactDetails.phone}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {tenantDetails.active === "true" ? "Active" : "Inactive"}
        </p>
        <button
          className="secondary-button"
          onClick={() => navigate("/super-admin/tenants")}
        >
          Back to Tenant List
        </button>
      </div>

      {/* Edit Form */}
      <Formik
        initialValues={
          tenantDetails || {
            id: "",
            name: "",
            registrationNumber: "",
            industryType: "",
            email: "",
            phone: "",
            address: {
              id: "",
              street: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            },
            contactDetails: {
              id: "",
              name: "",
              email: "",
              phone: "",
            },
            website: "",
            dateEstablished: "",
            organizationRefId: "",
            tenant: {
              id: "",
              name: "",
              tenantId: "",
            },
            active: "true",
            deactivationReason: "",
          }
        }
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, values }) => {
          console.log("Formik State:", { errors, touched, values }); // Debugging validation errors
          return (
            <Form>
              {/* Hidden Fields for IDs */}
              <Field type="hidden" name="id" />
              <Field type="hidden" name="address.id" />
              <Field type="hidden" name="contactDetails.id" />
              <Field type="hidden" name="tenant.id" />
              <Field type="hidden" name="tenant.tenantId" />
              <Field type="hidden" name="organizationRefId" />

              <div className="form-group">
                <label>Tenant Name</label>
                <Field type="text" name="name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Registration Number</label>
                <Field type="text" name="registrationNumber" />
                <ErrorMessage
                  name="registrationNumber"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Industry Type</label>
                <Field type="text" name="industryType" />
                <ErrorMessage
                  name="industryType"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <Field type="email" name="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <Field type="text" name="phone" />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="error-message"
                />
              </div>

              <h3>Address</h3>
              <div className="form-group">
                <label>Street</label>
                <Field type="text" name="address.street" />
                <ErrorMessage
                  name="address.street"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <Field type="text" name="address.city" />
                <ErrorMessage
                  name="address.city"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <Field type="text" name="address.state" />
                <ErrorMessage
                  name="address.state"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Country</label>
                <Field type="text" name="address.country" />
                <ErrorMessage
                  name="address.country"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <Field type="text" name="address.zipCode" />
                <ErrorMessage
                  name="address.zipCode"
                  component="div"
                  className="error-message"
                />
              </div>

              <h3>Contact Details</h3>
              <div className="form-group">
                <label>Contact Name</label>
                <Field type="text" name="contactDetails.name" />
                <ErrorMessage
                  name="contactDetails.name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Contact Email</label>
                <Field type="email" name="contactDetails.email" />
                <ErrorMessage
                  name="contactDetails.email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <Field type="text" name="contactDetails.phone" />
                <ErrorMessage
                  name="contactDetails.phone"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Website</label>
                <Field type="text" name="website" />
                <ErrorMessage
                  name="website"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Date Established</label>
                <Field type="date" name="dateEstablished" />
                <ErrorMessage
                  name="dateEstablished"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <Field as="select" name="active">
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Field>
                <ErrorMessage
                  name="active"
                  component="div"
                  className="error-message"
                />
              </div>

              {values.active === "false" && (
                <div className="form-group">
                  <label>Deactivation Reason</label>
                  <Field type="text" name="deactivationReason" />
                  <ErrorMessage
                    name="deactivationReason"
                    component="div"
                    className="error-message"
                  />
                </div>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default TenantEditPage;