// src/context/UserContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUsersByTenantId } from '../../services/UserService';
import { AuthContext } from '../../components/auth/AuthContext';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { auth } = useContext(AuthContext);
  console.log('Auth in UserProvider:', auth); // Debugging line
  const { tenantId } = auth || {};

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    if (!tenantId) {
      setError('No tenant ID found.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getUsersByTenantId(tenantId);
      console.log('Fetched Users:', data); // Debugging line
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [tenantId]);

  console.log('Providing UserContext:', { users, setUsers, loading, error, loadUsers }); // Debugging line

  return (
    <UserContext.Provider value={{ users, setUsers, loading, error, loadUsers }}>
      {children}
    </UserContext.Provider>
  );
};