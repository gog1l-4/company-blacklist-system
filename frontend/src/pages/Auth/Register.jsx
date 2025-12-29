import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Shield, Building, MapPin, User, Mail, Phone } from 'lucide-react';
import './Auth.css';
import './RegisterStyles.css';

const Register = () => {
    // კომპანიის იურიდიული მონაცემები
    const [taxId, setTaxId] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [legalAddress, setLegalAddress] = useState('');

    // ავტორიზებული პირის მონაცემები
    const [authorizedPersonName, setAuthorizedPersonName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // უსაფრთხოება
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        // ს/კ ვალიდაცია - მხოლოდ 9 ციფრი
        if (!/^\d{9}$/.test(taxId)) {
            setError('საიდენტიფიკაციო კოდი უნდა იყოს 9 ციფრი');
            return false;
        }

        // მობილური ვალიდაცია
        if (!/^5\d{8}$/.test(phoneNumber)) {
            setError('მობილურის ნომერი უნდა იყოს ფორმატში: 5XXXXXXXX');
            return false;
        }

        // პაროლების შედარება
        if (password !== confirmPassword) {
            setError('პაროლები არ ემთხვევა');
            return false;
        }

        // პაროლის სიგრძე
        if (password.length < 8) {
            setError('პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const data = await register({
                taxId,
                companyName,
                legalAddress,
                authorizedPersonName,
                email,
                phoneNumber,
                password,
            });

            setSuccess(data.message);

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'რეგისტრაცია ვერ მოხერხდა');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card register-card">
                <div className="auth-header">
                    <Shield size={48} color="#6366f1" />
                    <h1>რეგისტრაცია</h1>
                    <p>შექმენით ახალი ანგარიში</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* კომპანიის იურიდიული მონაცემები */}
                    <div className="form-section">
                        <h3><Building size={20} /> კომპანიის იურიდიული მონაცემები</h3>

                        <div className="form-group">
                            <label>საიდენტიფიკაციო კოდი (ს/კ) *</label>
                            <input
                                type="text"
                                className="input"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                placeholder="123456789"
                                maxLength="9"
                                required
                            />
                            <small>9-ნიშნა ციფრული კოდი</small>
                        </div>

                        <div className="form-group">
                            <label>კომპანიის იურიდიული დასახელება *</label>
                            <input
                                type="text"
                                className="input"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder='შპს "მაგალითი ჯგუფი"'
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><MapPin size={16} /> იურიდიული მისამართი</label>
                            <input
                                type="text"
                                className="input"
                                value={legalAddress}
                                onChange={(e) => setLegalAddress(e.target.value)}
                                placeholder="თბილისი, ვაჟა-ფშაველას გამზ. 1"
                            />
                            <small>სურვილისამებრ, მაგრამ სანდოობისთვის რეკომენდირებულია</small>
                        </div>
                    </div>

                    {/* ავტორიზებული პირის მონაცემები */}
                    <div className="form-section">
                        <h3><User size={20} /> ავტორიზებული პირის მონაცემები</h3>

                        <div className="form-group">
                            <label>სახელი და გვარი *</label>
                            <input
                                type="text"
                                className="input"
                                value={authorizedPersonName}
                                onChange={(e) => setAuthorizedPersonName(e.target.value)}
                                placeholder="გიორგი ბერიძე"
                                required
                            />
                            <small>პასუხისმგებელი პირი (დირექტორი ან მენეჯერი)</small>
                        </div>

                        <div className="form-group">
                            <label><Mail size={16} /> ელექტრონული ფოსტა *</label>
                            <input
                                type="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="info@company.ge"
                                required
                            />
                            <small>კომპანიის სამუშაო ელ-ფოსტა</small>
                        </div>

                        <div className="form-group">
                            <label><Phone size={16} /> მობილურის ნომერი *</label>
                            <input
                                type="tel"
                                className="input"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                placeholder="555123456"
                                maxLength="9"
                                required
                            />
                            <small>ფორმატი: 5XXXXXXXX (9 ციფრი)</small>
                        </div>
                    </div>

                    {/* უსაფრთხოება */}
                    <div className="form-section">
                        <h3>🔒 უსაფრთხოება</h3>

                        <div className="form-group">
                            <label>პაროლი *</label>
                            <input
                                type="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <small>მინიმუმ 8 სიმბოლო</small>
                        </div>

                        <div className="form-group">
                            <label>გაიმეორეთ პაროლი *</label>
                            <input
                                type="password"
                                className="input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {success && <div className="auth-success">{success}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading"></span>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                რეგისტრაცია
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>უკვე გაქვთ ანგარიში? <Link to="/login">შესვლა</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
