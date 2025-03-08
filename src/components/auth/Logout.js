import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      navigate('/login'); // Redirect to the login page
    };

    handleLogout();
  }, [logout, navigate]);

  return (
    <div>
      <h1>Logging Out...</h1>
    </div>
  );
};

export default Logout;