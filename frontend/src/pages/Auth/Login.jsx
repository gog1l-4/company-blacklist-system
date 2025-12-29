import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Shield } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [taxId, setTaxId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(taxId, password);

            // თუ მომხმარებელი pending-ია, გადამისამართდება waiting page-ზე
            if (data.user.status === 'pending') {
                navigate('/waiting');
            } else if (data.user.status === 'approved') {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'შესვლა ვერ მოხერხდა');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Shield size={48} color="#6366f1" />
                    <h1>შესვლა</h1>
                    <p>კომპანიების ბლექლისტ სისტემა</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>საიდენტიფიკაციო კოდი (ს/კ)</label>
                        <input
                            type="text"
                            className="input"
                            value={taxId}
                            onChange={(e) => setTaxId(e.target.value.replace(/\D/g, '').slice(0, 9))}
                            placeholder="123456789"
                            maxLength="9"
                            required
                        />
                        <small>9 ციფრი</small>
                    </div>

                    <div className="form-group">
                        <label>პაროლი</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

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
                                <LogIn size={18} />
                                შესვლა
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>არ გაქვთ ანგარიში? <Link to="/register">რეგისტრაცია</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
