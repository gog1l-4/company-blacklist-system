import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import CompanyCard from './CompanyCard';
import './DuplicateWarning.css';

const DuplicateWarning = ({ duplicateData, onProceed, onCancel }) => {
    return (
        <div className="duplicate-modal-overlay">
            <div className="duplicate-modal">
                <button className="duplicate-modal-close" onClick={onCancel}>
                    <X size={24} />
                </button>

                <div className="duplicate-header">
                    <div className="duplicate-icon">
                        <AlertTriangle size={48} />
                    </div>
                    <h2>შესაძლო დუბლიკატი ნაპოვნია!</h2>
                    <p className="duplicate-message">{duplicateData.message}</p>
                </div>

                <div className="duplicate-body">
                    {duplicateData.type === 'exact' ? (
                        <div className="exact-match">
                            <div className="warning-badge exact-badge">
                                <strong>ზუსტი დამთხვევა:</strong> ეს საიდენტიფიკაციო ნომერი უკვე {duplicateData.count}-ჯერ არის დამატებული
                            </div>
                            <div className="duplicate-list">
                                {duplicateData.existing.map((company) => (
                                    <CompanyCard key={company.id} company={company} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="similar-matches">
                            <div className="warning-badge similar-badge">
                                <strong>მსგავსი სახელები:</strong> {duplicateData.count} კომპანია ნაპოვნია მსგავსი სახელით
                            </div>
                            <div className="duplicate-list">
                                {duplicateData.existing.map((company) => (
                                    <CompanyCard key={company.id} company={company} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="duplicate-actions">
                    <button onClick={onCancel} className="btn btn-cancel">
                        <X size={18} />
                        გაუქმება
                    </button>
                    <button onClick={onProceed} className="btn btn-proceed">
                        <AlertTriangle size={18} />
                        მაინც დამატება
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuplicateWarning;
