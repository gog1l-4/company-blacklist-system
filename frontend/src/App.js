import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import WaitingPage from './pages/Dashboard/WaitingPage';
import MainDashboard from './pages/Dashboard/MainDashboard';
import AdminPanel from './pages/Admin/AdminPanel';

// Protected admin route
const AdminRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Waiting page (for pending users) */}
                    <Route path="/waiting" element={<WaitingPage />} />

                    {/* Protected routes (approved users only) */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <MainDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin route */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminRoute>
                                    <AdminPanel />
                                </AdminRoute>
                            </ProtectedRoute>
                        }
                    />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
