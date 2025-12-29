import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, FileText, Download, Trash2, Filter } from 'lucide-react';
import { getPendingDebts, approveDebt, rejectDebt } from '../../api/debt';
import { updateDebtStatus, deleteCompany, getAllCompanies } from '../../api/blacklist';
import './AdminPanel.css';

const DebtApprovalPanel = ({ showAll = false }) => {
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [approvalFilter, setApprovalFilter] = useState(showAll ? 'approved' : 'pending'); // pending/approved/all

    useEffect(() => {
        loadPendingDebts();
    }, []);

    const loadPendingDebts = async () => {
        setLoading(true);
        setError('');
        try {
            let data;
            if (approvalFilter === 'pending') {
                data = await getPendingDebts();
            } else if (approvalFilter === 'approved') {
                data = await getAllCompanies();
            } else {
                // Get all (both pending and approved)
                const [pending, approved] = await Promise.all([
                    getPendingDebts(),
                    getAllCompanies()
                ]);
                data = [...pending, ...approved];
            }
            setDebts(data);
        } catch (err) {
            setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPendingDebts();
    }, [approvalFilter]); // Reload when filter changes

    const handleApprove = async (id) => {
        try {
            const response = await approveDebt(id);
            setMessage(response.message);
            loadPendingDebts();

            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'დამტკიცება ვერ მოხერხდა');
        }
    };

    const openRejectModal = (debt) => {
        setSelectedDebt(debt);
        setShowRejectModal(true);
        setRejectionReason('');
    };

    const handleReject = async (e) => {
        e.preventDefault();
        if (!rejectionReason.trim()) {
            setError('უარყოფის მიზეზი აუცილებელია');
            return;
        }

        try {
            const response = await rejectDebt(selectedDebt.id, rejectionReason);
            setMessage(response.message);
            setShowRejectModal(false);
            setSelectedDebt(null);
            setRejectionReason('');
            loadPendingDebts();

            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'უარყოფა ვერ მოხერხდა');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateDebtStatus(id, newStatus);
            setMessage(`სტატუსი შეიცვალა: ${getStatusLabel(newStatus)}`);
            loadPendingDebts();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'სტატუსის შეცვლა ვერ მოხერხდა');
        }
    };

    const handleDelete = async (id, companyName) => {
        if (!window.confirm(`დარწმუნებული ხართ რომ გსურთ "${companyName}"-ის წაშლა?`)) {
            return;
        }

        try {
            const response = await deleteCompany(id);
            setMessage(response.message);
            loadPendingDebts();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'წაშლა ვერ მოხერხდა');
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return '🔴 აქტიური';
            case 'under_review': return '🟠 გადამოწმების პროცესში';
            case 'closed': return '🟢 დახურული';
            default: return status;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('ka-GE');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('ka-GE', {
            style: 'currency',
            currency: 'GEL',
        }).format(amount);
    };

    return (
        <div className="admin-panel-content">
            <div className="admin-panel-header">
                <div>
                    <h2>დავალიანებების მართვა</h2>
                    <p>
                        {approvalFilter === 'pending' && `მოლოდინში: ${debts.length} ჩანაწერი`}
                        {approvalFilter === 'approved' && `დამტკიცებული: ${debts.length} ჩანაწერი`}
                        {approvalFilter === 'all' && `სულ: ${debts.length} ჩანაწერი`}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {/* Filter Buttons */}
                    <div className="filter-group" style={{
                        display: 'flex',
                        gap: '0.5rem',
                        background: '#f1f5f9',
                        padding: '0.375rem',
                        borderRadius: '10px',
                    }}>
                        <button
                            className={`filter-btn ${approvalFilter === 'pending' ? 'active' : ''}`}
                            onClick={() => setApprovalFilter('pending')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: approvalFilter === 'pending' ? 'white' : 'transparent',
                                color: approvalFilter === 'pending' ? '#6366f1' : '#64748b',
                                fontWeight: approvalFilter === 'pending' ? '600' : '500',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                boxShadow: approvalFilter === 'pending' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            მოლოდინში
                        </button>
                        <button
                            className={`filter-btn ${approvalFilter === 'approved' ? 'active' : ''}`}
                            onClick={() => setApprovalFilter('approved')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: approvalFilter === 'approved' ? 'white' : 'transparent',
                                color: approvalFilter === 'approved' ? '#10b981' : '#64748b',
                                fontWeight: approvalFilter === 'approved' ? '600' : '500',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                boxShadow: approvalFilter === 'approved' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            დამტკიცებული
                        </button>
                        <button
                            className={`filter-btn ${approvalFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setApprovalFilter('all')}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: approvalFilter === 'all' ? 'white' : 'transparent',
                                color: approvalFilter === 'all' ? '#0f172a' : '#64748b',
                                fontWeight: approvalFilter === 'all' ? '600' : '500',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                transition: 'all 0.2s',
                                boxShadow: approvalFilter === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            ყველა
                        </button>
                    </div>
                    <button className="refresh-btn" onClick={loadPendingDebts}>
                        <RefreshCw size={18} />
                        განახლება
                    </button>
                </div>
            </div>

            {message && (
                <div className="success-message">{message}</div>
            )}

            {error && (
                <div className="error-message">{error}</div>
            )}

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                </div>
            ) : debts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <FileText />
                    </div>
                    <h3>ჩანაწერები ვერ მოიძებნა</h3>
                    <p>მოლოდინში მყოფი ჩანაწერები არ არის</p>
                </div>
            ) : (
                <div className="users-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>კომპანია</th>
                                <th>ს/კ</th>
                                <th>თანხა</th>
                                <th>თარიღი</th>
                                <th>მიზეზი</th>
                                <th>მომხსენებელი</th>
                                <th>საბუთი</th>
                                <th>სტატუსი</th>
                                <th>ქმედებები</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debts.map((debt) => (
                                <tr key={debt.id}>
                                    <td>{debt.id}</td>
                                    <td>{debt.targetCompanyName}</td>
                                    <td>{debt.targetTaxId}</td>
                                    <td className="amount">{formatCurrency(debt.debtAmount)}</td>
                                    <td>{formatDate(debt.debtDate)}</td>
                                    <td>
                                        <div className="reason-cell">
                                            {debt.reason.length > 50
                                                ? debt.reason.substring(0, 50) + '...'
                                                : debt.reason}
                                        </div>
                                    </td>
                                    <td>{debt.reporter?.companyName || 'N/A'}</td>
                                    <td>
                                        <a
                                            href={`http://localhost:3001/uploads/${debt.evidenceFile}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-link"
                                        >
                                            <Download size={16} />
                                            ნახვა
                                        </a>
                                    </td>
                                    <td>
                                        {debt.approvalStatus === 'approved' ? (
                                            <select
                                                value={debt.debtStatus || 'under_review'}
                                                onChange={(e) => handleStatusChange(debt.id, e.target.value)}
                                                className="status-select"
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e2e8f0',
                                                    fontSize: '0.875rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <option value="active" style={{ color: 'black' }}>აქტიური</option>
                                                <option value="under_review" style={{ color: 'black' }}>გადამოწმება</option>
                                                <option value="closed" style={{ color: 'black' }}>დახურული</option>
                                            </select>
                                        ) : (
                                            <span className="badge badge-warning">მოლოდინში</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {debt.approvalStatus === 'pending' ? (
                                                <>
                                                    <button
                                                        className="btn-icon btn-success"
                                                        onClick={() => handleApprove(debt.id)}
                                                        title="დამტკიცება"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        className="btn-icon btn-danger"
                                                        onClick={() => openRejectModal(debt)}
                                                        title="უარყოფა"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="btn-icon"
                                                    onClick={() => handleDelete(debt.id, debt.targetCompanyName)}
                                                    title="წაშლა"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                                    }}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && selectedDebt && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>ჩანაწერის უარყოფა</h2>
                        </div>

                        <div className="debt-info">
                            <p><strong>კომპანია:</strong> {selectedDebt.targetCompanyName}</p>
                            <p><strong>ს/კ:</strong> {selectedDebt.targetTaxId}</p>
                            <p><strong>თანხა:</strong> {formatCurrency(selectedDebt.debtAmount)}</p>
                        </div>

                        <form onSubmit={handleReject}>
                            <div className="form-group">
                                <label>უარყოფის მიზეზი *</label>
                                <textarea
                                    className="input"
                                    rows="4"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="მიუთითეთ რატომ არ დაადასტურეთ ეს ჩანაწერი..."
                                    required
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setShowRejectModal(false)}
                                >
                                    გაუქმება
                                </button>
                                <button type="submit" className="btn btn-danger">
                                    <XCircle size={18} />
                                    უარყოფა
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DebtApprovalPanel;
