import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'; // Ensure this path is correct

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { auth } = useContext(AuthContext);

    // Redirect to login if not authenticated
    if (!auth || !auth.roles) {
        return <Navigate to="/login" />;
    }

    // Check if the user's roles include any of the allowed roles
    const hasAccess = allowedRoles.some(role => auth.roles.includes(role));

    if (!hasAccess) {
        // Redirect if the user's role is not authorized
        return <Navigate to="/login" />;
    }

    // Render the children or outlet if authorized
    return children ? children : <Outlet />;
};

export default ProtectedRoute;