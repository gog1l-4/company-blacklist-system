import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Users, FileText } from 'lucide-react';
import Navbar from '../../components/Navbar';
import DebtApprovalPanel from './DebtApprovalPanel';
import { getPendingUsers, approveUser, rejectUser } from '../../api/admin';
import './AdminPanel.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (activeTab === 'users') {
            loadPendingUsers();
        }
    }, [activeTab]);

    const loadPendingUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getPendingUsers();
            setUsers(data);
        } catch (err) {
            setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const response = await approveUser(id);
            setMessage(response.message);
            loadPendingUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'დამტკიცება ვერ მოხერხდა');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('დარწმუნებული ხართ რომ გსურთ უარყოფა?')) {
            return;
        }
        try {
            const response = await rejectUser(id);
            setMessage(response.message);
            loadPendingUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'უარყოფა ვერ მოხერხდა');
        }
    };

    return (
        <div className="admin-panel">
            <Navbar />
            <div className="admin-container">
                <div className="admin-header">
                    <h1>ადმინისტრატორის პანელი</h1>
                    <p>მომხმარებლებისა და დავალიანებების მართვა</p>
                </div>
                <div className="admin-tabs">
                    <button className={`tab-button ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                        <Users size={20} />
                        მომხმარებლების დამტკიცება
                    </button>
                    <button className={`tab-button ${activeTab === 'debts' ? 'active' : ''}`} onClick={() => setActiveTab('debts')}>
                        <FileText size={20} />
                        დავალიანებების მართვა
                    </button>
                </div>
                {activeTab === 'users' ? (
                    <div className="admin-panel-content">
                        <div className="admin-panel-header">
                            <div>
                                <h2>მომხმარებლების დამტკიცება</h2>
                                <p>მოლოდინში: {users.length} მომხმარებელი</p>
                            </div>
                            <button className="refresh-btn" onClick={loadPendingUsers}>
                                <RefreshCw size={18} />
                                განახლება
                            </button>
                        </div>
                        {message && <div className="success-message">{message}</div>}
                        {error && <div className="error-message">{error}</div>}
                        {loading ? (
                            <div className="loading">
                                <div className="loading-spinner"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">
                                    <Users />
                                </div>
                                <h3>მომხმარებლები ვერ მოიძებნა</h3>
                                <p>მოლოდინში მყოფი მომხმარებლები არ არის</p>
                            </div>
                        ) : (
                            <div className="users-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>ს/კ</th>
                                            <th>კომპანია</th>
                                            <th>პასუხისმგებელი პირი</th>
                                            <th>ელ-ფოსტა</th>
                                            <th>ტელეფონი</th>
                                            <th>მისამართი</th>
                                            <th>ქმედებები</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.taxId}</td>
                                                <td>{user.companyName}</td>
                                                <td>{user.authorizedPersonName}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>{user.legalAddress || '-'}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn-icon btn-success" onClick={() => handleApprove(user.id)} title="დამტკიცება">
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button className="btn-icon btn-danger" onClick={() => handleReject(user.id)} title="უარყოფა">
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <DebtApprovalPanel />
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
