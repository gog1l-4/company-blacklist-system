import React, { useState } from 'react';
import { Calendar, DollarSign, AlertCircle, User, Trash2 } from 'lucide-react';
import { updateDebtStatus, deleteCompany } from '../api/blacklist';
import './CompanyCard.css';

const CompanyCard = ({ company, isAdmin = false }) => {
    const [status, setStatus] = useState(company.debtStatus || 'under_review');
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('ka-GE');
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('ka-GE', {
            style: 'currency',
            currency: 'GEL',
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return { emoji: '🔴', text: 'აქტიური', color: '#ef4444' };
            case 'under_review':
                return { emoji: '🟠', text: 'გადამოწმება', color: '#f59e0b' };
            case 'closed':
                return { emoji: '🟢', text: 'დახურული', color: '#10b981' };
            default:
                return { emoji: '🟠', text: 'გადამოწმება', color: '#f59e0b' };
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateDebtStatus(company.id, newStatus);
            setStatus(newStatus);
        } catch (err) {
            console.error('Status update failed:', err);
            alert('სტატუსის შეცვლა ვერ მოხერხდა');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`დარწმუნებული ხართ რომ გსურთ "${company.targetCompanyName}"-ის წაშლა?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteCompany(company.id);
            alert('ჩანაწერი წარმატებით წაიშალა');
            window.location.reload(); // Reload to update list
        } catch (err) {
            console.error('Delete failed:', err);
            alert('წაშლა ვერ მოხერხდა');
            setIsDeleting(false);
        }
    };

    return (
        <div className="company-card">
            <div className="company-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <h3>{company.targetCompanyName}</h3>
                    {company.occurrenceCount > 1 && (
                        <span
                            className="occurrence-badge"
                            style={{
                                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                                color: 'white',
                                padding: '0.25rem 0.625rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                whiteSpace: 'nowrap',
                            }}
                            title={`ეს კომპანია ${company.occurrenceCount}-ჯერ არის blacklist-ში`}
                        >
                            ⚠️ {company.occurrenceCount}x
                        </span>
                    )}
                </div>
                {isAdmin ? (
                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="status-select-inline"
                        style={{
                            background: `linear-gradient(135deg, ${getStatusBadge(status).color}dd, ${getStatusBadge(status).color})`,
                            color: 'white',
                            padding: '0.5rem 0.875rem',
                            borderRadius: '999px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="active" style={{ color: 'black' }}>აქტიური</option>
                        <option value="under_review" style={{ color: 'black' }}>გადამოწმება</option>
                        <option value="closed" style={{ color: 'black' }}>დახურული</option>
                    </select>
                ) : (
                    <span
                        className="status-badge"
                        style={{
                            background: `linear-gradient(135deg, ${getStatusBadge(status).color}dd, ${getStatusBadge(status).color})`,
                            color: 'white',
                            padding: '0.375rem 0.875rem',
                            borderRadius: '999px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                        }}
                    >
                        {getStatusBadge(status).emoji} {getStatusBadge(status).text}
                    </span>
                )}
            </div>

            <div className="company-card-body">
                <div className="info-row">
                    <User size={18} />
                    <span>ს/კ: {company.targetTaxId}</span>
                </div>

                <div className="info-row">
                    <DollarSign size={18} />
                    <span className="debt-amount">{formatAmount(company.debtAmount)}</span>
                </div>

                <div className="info-row">
                    <Calendar size={18} />
                    <span>თარიღი: {formatDate(company.debtDate)}</span>
                </div>

                <div className="info-row">
                    <AlertCircle size={18} />
                    <span>{company.reason}</span>
                </div>
            </div>

            <div className="company-card-footer">
                {company.reporter && (
                    <small>დაამატა: {company.reporter.companyName}</small>
                )}
                {isAdmin && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn-delete-compact"
                        style={{
                            marginLeft: 'auto',
                            padding: '0.375rem 0.75rem',
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                        }}
                    >
                        <Trash2 size={14} />
                        {isDeleting ? 'იშლება...' : 'წაშლა'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CompanyCard;
