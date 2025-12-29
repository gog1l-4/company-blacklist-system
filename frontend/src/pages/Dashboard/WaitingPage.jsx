import React from 'react';
import { Clock, Shield } from 'lucide-react';
import './WaitingPage.css';

const WaitingPage = () => {
    return (
        <div className="waiting-container">
            <div className="waiting-card">
                <Shield size={80} color="#6366f1" className="shield-icon" />

                <h1>მიმდინარეობს ვერიფიკაცია...</h1>

                <div className="waiting-spinner">
                    <div className="spinner"></div>
                </div>

                <p className="waiting-message">
                    თქვენი რეგისტრაცია წარმატებით დასრულდა!
                </p>

                <p className="waiting-submessage">
                    <Clock size={18} />
                    გთხოვთ დაელოდოთ ადმინისტრატორის დამტკიცებას
                </p>

                <div className="waiting-info">
                    <p>📧 თქვენ მიიღებთ შეტყობინებას როგორც კი თქვენი ანგარიში დამტკიცდება</p>
                </div>
            </div>
        </div>
    );
};

export default WaitingPage;
