// src/components/admin/TenantEditPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getTenetById, updateTenet } from '../../services/TenantService';
import BackButton from './BackButton'; // Import BackButton component
import './TenantEditPage.css'; // Import corresponding CSS

const TenantEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tenantDetails, setTenantDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        setLoading(true);
        const data = await getTenetById(id);
        setTenantDetails({
          id: data.id || '',
          name: data.name || '',
          registrationNumber: data.registrationNumber || '',
          industryType: data.industryType || '',
          email: data.contactDetails?.email || '',
          phone: data.contactDetails?.phone || '',
          address: {
            id: data.address?.id || '',
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            country: data.address?.country || '',
            zipCode: data.address?.zipCode || '',
          },
          contactDetails: {
            id: data.contactDetails?.id || '',
            name: data.contactDetails?.name || '',
            email: data.contactDetails?.email || '',
            phone: data.contactDetails?.phone || '',
          },
          website: data.website || '',
          dateEstablished: data.dateEstablished
            ? data.dateEstablished.substring(0, 10)
            : '',
          organizationRefId: data.organizationRefId || '',
          tenant: {
            id: data.tenant?.id || '',
            name: data.tenant?.name || '',
            tenantId: data.tenant?.tenantId || '',
          },
          active: data.active ? 'true' : 'false',
          deactivationReason: data.deactivationReason || '',
        });
      } catch (error) {
        console.error('Error fetching tenant:', error);
        alert('Failed to load tenant data.');
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Tenant name is required'),
    registrationNumber: Yup.string().required('Registration number is required'),
    industryType: Yup.string().required('Industry type is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    address: Yup.object().shape({
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      country: Yup.string().required('Country is required'),
      zipCode: Yup.string().required('Zip Code is required'),
    }),
    contactDetails: Yup.object().shape({
      name: Yup.string().required('Contact name is required'),
      email: Yup.string()
        .email('Invalid email')
        .required('Contact email is required'),
      phone: Yup.string().required('Contact phone is required'),
    }),
    website: Yup.string().url('Invalid URL').nullable(),
    dateEstablished: Yup.date().required('Date established is required'),
    active: Yup.string()
      .oneOf(['true', 'false'], 'Invalid status')
      .required('Status is required'),
    deactivationReason: Yup.string().when('active', {
      is: 'false',
      then: () => Yup.string().required('Deactivation reason is required'),
      otherwise: () => Yup.string().nullable(),
    }),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log('Form submission triggered with values:', values);

    const updatedValues = {
      id: values.id,
      name: values.name,
      registrationNumber: values.registrationNumber,
      industryType: values.industryType,
      contactDetails: {
        id: values.contactDetails.id,
        name: values.contactDetails.name,
        email: values.contactDetails.email,
        phone: values.contactDetails.phone,
      },
      address: {
        id: values.address.id,
        street: values.address.street,
        city: values.address.city,
        state: values.address.state,
        country: values.address.country,
        zipCode: values.address.zipCode,
      },
      website: values.website,
      dateEstablished: values.dateEstablished,
      active: values.active === 'true',
      deactivationReason: values.deactivationReason,
      organizationRefId: values.organizationRefId,
      tenant: {
        id: values.tenant.id,
        name: values.tenant.name,
        tenantId: values.tenant.tenantId,
      },
    };

    try {
      await updateTenet(id, updatedValues);
      alert('Tenant updated successfully!');
      navigate('/super-admin/tenants');
    } catch (error) {
      console.error('Error updating tenant:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);

        if (error.response.status === 401) {
          alert('Session expired. Please log in again.');
          navigate('/login');
        } else {
          alert(
            `Failed to update tenant: ${
              error.response.data.message || 'Unknown error.'
            }`
          );
        }
      } else if (error.request) {
        console.error('Request data:', error.request);
        alert('No response from the server. Please try again later.');
      } else {
        console.error('Error message:', error.message);
        alert('An error occurred while setting up the request.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!tenantDetails) {
    return <div className="error-message">No tenant data available.</div>;
  }

  return (
    <div className="tenant-edit-page">
      <header className="tenant-edit-page__header">
        <div className="tenant-edit-page__header-left">
          <BackButton /> {/* BackButton Component */}
          <h2>Edit Tenant</h2>
        </div>
        <button
          className="button button--secondary tenant-edit-page__back-button"
          onClick={() => navigate('/super-admin/tenants')}
        >
          <i className="fas fa-arrow-left" aria-hidden="true"></i> Back to Tenant List
        </button>
      </header>

      <div className="tenant-edit-page__summary">
        <h3>Tenant Summary</h3>
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
          <strong>Status:</strong>{' '}
          {tenantDetails.active === 'true' ? 'Active' : 'Inactive'}
        </p>
      </div>

      <div className="tenant-edit-page__form">
        <Formik
          initialValues={tenantDetails}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form>
              {/* Hidden Fields for IDs */}
              <Field type="hidden" name="id" />
              <Field type="hidden" name="address.id" />
              <Field type="hidden" name="contactDetails.id" />
              <Field type="hidden" name="tenant.id" />
              <Field type="hidden" name="tenant.tenantId" />
              <Field type="hidden" name="organizationRefId" />

              <div className="form-group">
                <label htmlFor="name">Tenant Name</label>
                <Field type="text" name="name" id="name" />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="registrationNumber">Registration Number</label>
                <Field
                  type="text"
                  name="registrationNumber"
                  id="registrationNumber"
                />
                <ErrorMessage
                  name="registrationNumber"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="industryType">Industry Type</label>
                <Field
                  type="text"
                  name="industryType"
                  id="industryType"
                />
                <ErrorMessage
                  name="industryType"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" id="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <Field type="text" name="phone" id="phone" />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="error-message"
                />
              </div>

              <h3>Address</h3>
              <div className="form-group">
                <label htmlFor="address.street">Street</label>
                <Field
                  type="text"
                  name="address.street"
                  id="address.street"
                />
                <ErrorMessage
                  name="address.street"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.city">City</label>
                <Field type="text" name="address.city" id="address.city" />
                <ErrorMessage
                  name="address.city"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <Field type="text" name="address.state" id="address.state" />
                <ErrorMessage
                  name="address.state"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.country">Country</label>
                <Field
                  type="text"
                  name="address.country"
                  id="address.country"
                />
                <ErrorMessage
                  name="address.country"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.zipCode">Zip Code</label>
                <Field
                  type="text"
                  name="address.zipCode"
                  id="address.zipCode"
                />
                <ErrorMessage
                  name="address.zipCode"
                  component="div"
                  className="error-message"
                />
              </div>

              <h3>Contact Details</h3>
              <div className="form-group">
                <label htmlFor="contactDetails.name">Contact Name</label>
                <Field
                  type="text"
                  name="contactDetails.name"
                  id="contactDetails.name"
                />
                <ErrorMessage
                  name="contactDetails.name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactDetails.email">Contact Email</label>
                <Field
                  type="email"
                  name="contactDetails.email"
                  id="contactDetails.email"
                />
                <ErrorMessage
                  name="contactDetails.email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactDetails.phone">Contact Phone</label>
                <Field
                  type="text"
                  name="contactDetails.phone"
                  id="contactDetails.phone"
                />
                <ErrorMessage
                  name="contactDetails.phone"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <Field type="text" name="website" id="website" />
                <ErrorMessage
                  name="website"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dateEstablished">Date Established</label>
                <Field
                  type="date"
                  name="dateEstablished"
                  id="dateEstablished"
                />
                <ErrorMessage
                  name="dateEstablished"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="active">Status</label>
                <Field as="select" name="active" id="active">
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

              {values.active === 'false' && (
                <div className="form-group">
                  <label htmlFor="deactivationReason">Deactivation Reason</label>
                  <Field
                    type="text"
                    name="deactivationReason"
                    id="deactivationReason"
                  />
                  <ErrorMessage
                    name="deactivationReason"
                    component="div"
                    className="error-message"
                  />
                </div>
              )}

              <div className="form-actions">
                <button
                  type="submit"
                  className="button button--primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => navigate('/super-admin/tenants')}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TenantEditPage;