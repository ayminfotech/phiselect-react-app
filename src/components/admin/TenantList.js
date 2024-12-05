// src/components/admin/TenetList.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import './TenetList.css';

const TenetList = ({
  tenets,
  onDeleteTenet,
  onActivateTenet,
  onDeactivateTenet,
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [tenetToDelete, setTenetToDelete] = useState(null);

  const handleEditTenet = (tenetId) => {
    navigate(`/super-admin/tenets/${tenetId}/edit`);
  };

  const handleDeleteClick = (tenetId) => {
    setTenetToDelete(tenetId);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDeleteTenet(tenetToDelete);
    setShowConfirm(false);
    setTenetToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setTenetToDelete(null);
  };

  return (
    <div className="tenet-list">
      {showConfirm && (
        <ConfirmDialog
          title="Delete Tenet"
          message="Are you sure you want to delete this tenet? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenets.map((tenet) => (
            <tr key={tenet.id}>
              <td>{tenet.name}</td>
              <td>{tenet.status}</td>
              <td className="actions">
                <button className="edit" onClick={() => handleEditTenet(tenet.id)}>
                  Edit
                </button>
                <button
                  className="delete"
                  onClick={() => handleDeleteClick(tenet.id)}
                >
                  Delete
                </button>
                {tenet.status === 'Active' ? (
                  <button
                    className="deactivate"
                    onClick={() => onDeactivateTenet(tenet.id)}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="activate"
                    onClick={() => onActivateTenet(tenet.id)}
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TenetList.propTypes = {
  tenets: PropTypes.array.isRequired,
  onDeleteTenet: PropTypes.func.isRequired,
  onActivateTenet: PropTypes.func.isRequired,
  onDeactivateTenet: PropTypes.func.isRequired,
};

export default TenetList;