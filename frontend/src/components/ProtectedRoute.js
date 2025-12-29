import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="loading" style={{ width: '40px', height: '40px' }}></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // თუ მომხმარებელი pending-ია, გადამისამართება waiting page-ზე
    if (user.status === 'pending') {
        return <Navigate to="/waiting" replace />;
    }

    // თუ მომხმარებელი rejected-ია
    if (user.status === 'rejected') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
