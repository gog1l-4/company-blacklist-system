import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Home } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Shield size={28} />
                    <span>Blacklist System</span>
                </div>

                <div className="navbar-actions">
                    {user && (
                        <>
                            <span className="navbar-user">{user.companyName}</span>

                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/dashboard')}
                            >
                                <Home size={18} />
                                მთავარი
                            </button>

                            {user.role === 'admin' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/admin')}
                                >
                                    Admin Panel
                                </button>
                            )}

                            <button
                                className="btn btn-danger"
                                onClick={handleLogout}
                            >
                                <LogOut size={18} />
                                გასვლა
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
