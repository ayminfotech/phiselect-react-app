// src/components/admin/TenetEditPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTenetById, updateTenet } from '../../services/TenantService';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './TenetEditPage.css';

const TenetEditPage = () => {
  const { tenetId } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTenet = async () => {
      try {
        const data = await getTenetById(tenetId);
        setInitialValues({
          name: data.name,
          // Map other fields
        });
      } catch (error) {
        console.error('Error fetching tenet:', error);
        setError('Failed to load tenet data.');
      }
    };
    fetchTenet();
  }, [tenetId]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Tenet name is required'),
    // Add other validations
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateTenet(tenetId, values);
      alert('Tenet updated successfully.');
      navigate('/onboard');
    } catch (error) {
      console.error('Error updating tenet:', error);
      setError('Failed to update tenet. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tenet-edit-page">
      <h2>Edit Tenet</h2>
      {error && <p className="error">{error}</p>}
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div className="form-group">
              <label>Tenet Name</label>
              <Field type="text" name="name" />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>
            {/* Add more form fields */}
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default TenetEditPage;