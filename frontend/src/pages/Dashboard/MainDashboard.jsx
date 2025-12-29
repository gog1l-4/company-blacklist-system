import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Upload, FileCheck, Shield, CheckCircle, Clock, Calendar, DollarSign, Building2, FileText as FileTextIcon } from 'lucide-react';
import Navbar from '../../components/Navbar';
import CompanyCard from '../../components/CompanyCard';
import { useAuth } from '../../context/AuthContext';
import { searchCompanies, addCompany, getAllCompanies, checkDuplicate } from '../../api/blacklist';
import DuplicateWarning from '../../components/DuplicateWarning';
import './MainDashboard.css';
import './ModalForm.css';

const MainDashboard = () => {
    const { user } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const [formData, setFormData] = useState({
        targetTaxId: '',
        targetCompanyName: '',
        debtAmount: '',
        reason: '',
        debtDate: '',
    });

    useEffect(() => {
        loadAllCompanies();
    }, []);

    const loadAllCompanies = async () => {
        setLoading(true);
        try {
            const data = await getAllCompanies();
            setCompanies(data);
        } catch (err) {
            setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadAllCompanies();
            return;
        }

        setLoading(true);
        try {
            const data = await searchCompanies(searchQuery);
            setCompanies(data);
        } catch (err) {
            setError('ძიება ვერ მოხერხდა');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            const maxSize = 5 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                setError('მხოლოდ PDF, JPG და PNG ფაილები დაშვებულია');
                return;
            }

            if (file.size > maxSize) {
                setError('ფაილის ზომა არ უნდა აღემატებოდეს 5MB-ს');
                return;
            }

            setSelectedFile(file);
            setError('');
        }
    };

    const handleAddCompany = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedFile) {
            setError('დამადასტურებელი საბუთი (ფაილი) აუცილებელია');
            return;
        }

        // Check for duplicates first
        try {
            const duplicateCheck = await checkDuplicate(
                formData.targetTaxId,
                formData.targetCompanyName
            );

            if (duplicateCheck.isDuplicate) {
                // Show warning modal
                setDuplicateWarning(duplicateCheck);
                return;
            }

            // No duplicates, proceed with submission
            await submitCompany();
        } catch (err) {
            setError('დუბლიკატების შემოწმება ვერ მოხერხდა');
        }
    };

    const submitCompany = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('targetTaxId', formData.targetTaxId);
            formDataToSend.append('targetCompanyName', formData.targetCompanyName);
            formDataToSend.append('debtAmount', parseFloat(formData.debtAmount));
            formDataToSend.append('reason', formData.reason);
            formDataToSend.append('debtDate', formData.debtDate);
            formDataToSend.append('evidenceFile', selectedFile);

            const response = await addCompany(formDataToSend);

            setSuccess(response.message || 'თქვენი მოთხოვნა გაიგზავნა ადმინისტრატორთან დასამტკიცებლად');
            setShowModal(false);
            setDuplicateWarning(null);
            setFormData({
                targetTaxId: '',
                targetCompanyName: '',
                debtAmount: '',
                reason: '',
                debtDate: '',
            });
            setSelectedFile(null);

            setTimeout(() => {
                loadAllCompanies();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'კომპანიის დამატება ვერ მოხერხდა');
        }
    };

    const handleProceedWithDuplicate = async () => {
        setDuplicateWarning(null);
        await submitCompany();
    };

    const handleCancelDuplicate = () => {
        setDuplicateWarning(null);
    };

    const resetModal = () => {
        setShowModal(false);
        setFormData({
            targetTaxId: '',
            targetCompanyName: '',
            debtAmount: '',
            reason: '',
            debtDate: '',
        });
        setSelectedFile(null);
        setError('');
    };

    return (
        <div>
            <Navbar />

            {/* Hero Section with Glassmorphism */}
            <div className="dashboard-hero">
                <div className="dashboard-hero-content">
                    <div className="dashboard-title">
                        <h1>კომპანიების ბლექლისტი</h1>
                        <p>მოძებნეთ და დაამატეთ კომპანიები დავალიანებით</p>
                    </div>

                    {/* Glassmorphism Search */}
                    <form onSubmit={handleSearch} className="search-glass">
                        <div className="search-form-group">
                            <div className="search-input-wrapper">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="ძებნა კომპანიის სახელით ან ს/კ-თ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary search-btn">
                                <Search size={20} />
                                ძიება
                            </button>
                            <button
                                type="button"
                                className="btn btn-success search-btn"
                                onClick={() => setShowModal(true)}
                            >
                                <Plus size={20} />
                                დამატება
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {/* Stats Bento Grid */}
                <div className="stats-grid">
                    <div className="stat-card blue">
                        <div className="stat-card-header">
                            <div className="stat-icon">
                                <Shield />
                            </div>
                        </div>
                        <div>
                            <p className="stat-value">{companies.length}+</p>
                            <p className="stat-label">ბაზაში კომპანიები</p>
                        </div>
                    </div>

                    <div className="stat-card green">
                        <div className="stat-card-header">
                            <div className="stat-icon">
                                <CheckCircle />
                            </div>
                        </div>
                        <div>
                            <p className="stat-value">100%</p>
                            <p className="stat-label">ვერიფიცირებული</p>
                        </div>
                    </div>

                    <div className="stat-card orange">
                        <div className="stat-card-header">
                            <div className="stat-icon">
                                <Clock />
                            </div>
                        </div>
                        <div>
                            <p className="stat-value">ახლახან</p>
                            <p className="stat-label">ბოლო ძებნა</p>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="alert alert-success">{success}</div>
                )}

                {/* Content */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                        <div className="loading"></div>
                    </div>
                ) : companies.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <Search />
                        </div>
                        <h3>კომპანიები ვერ მოიძებნა</h3>
                        <p>სცადეთ სხვა ძიების პარამეტრები ან დაამატეთ ახალი კომპანია</p>
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                            <Plus size={20} />
                            კომპანიის დამატება
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="section-header" style={{
                            marginTop: '3rem',
                            marginBottom: '2rem',
                            textAlign: 'center',
                        }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#0f172a',
                                marginBottom: '0.5rem',
                            }}>📋 ბლექლისტში მყოფი კომპანიები</h2>
                            <p style={{
                                fontSize: '1rem',
                                color: '#64748b',
                            }}>სულ ნაპოვნია: {companies.length} კომპანია</p>
                        </div>
                        <div className="companies-grid">
                            {companies.map((company) => (
                                <CompanyCard key={company.id} company={company} isAdmin={user?.role === 'admin'} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={resetModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>ახალი კომპანიის დამატება</h2>
                            <button onClick={resetModal} className="modal-close">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddCompany} className="modal-body">
                            <div className="form-group">
                                <label>
                                    <FileTextIcon size={18} />
                                    საიდენტიფიკაციო კოდი (ს/კ) *
                                </label>
                                <input
                                    type="text"
                                    name="targetTaxId"
                                    className="input"
                                    placeholder="მაგ: 123456789"
                                    value={formData.targetTaxId}
                                    onChange={handleInputChange}
                                    maxLength="9"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Building2 size={18} />
                                    კომპანიის სახელი *
                                </label>
                                <input
                                    type="text"
                                    name="targetCompanyName"
                                    className="input"
                                    placeholder="კომპანიის სრული დასახელება"
                                    value={formData.targetCompanyName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <DollarSign size={18} />
                                    დავალიანების თანხა (₾) *
                                </label>
                                <input
                                    type="number"
                                    name="debtAmount"
                                    className="input"
                                    placeholder="0.00"
                                    step="0.01"
                                    value={formData.debtAmount}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <Calendar size={18} />
                                    დავალიანების თარიღი *
                                </label>
                                <input
                                    type="date"
                                    name="debtDate"
                                    className="input"
                                    value={formData.debtDate}
                                    onChange={handleInputChange}
                                    min="2000-01-01"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>მიზეზი *</label>
                                <textarea
                                    name="reason"
                                    className="input"
                                    style={{ minHeight: '100px' }}
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>
                                    <Upload size={18} />
                                    დამადასტურებელი საბუთი *
                                </label>
                                {!selectedFile ? (
                                    <div className="file-upload-zone" onClick={() => document.getElementById('fileInput').click()}>
                                        <div className="file-upload-icon">
                                            <Upload />
                                        </div>
                                        <div className="file-upload-text">
                                            <strong>დააჭირეთ ასარჩევად</strong> ან<br />
                                            გადაათრიეთ ფაილი აქ
                                        </div>
                                        <div className="file-upload-hint">
                                            PDF, JPG, PNG • მაქს. 5MB
                                        </div>
                                        <input
                                            id="fileInput"
                                            type="file"
                                            className="file-input-hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="file-selected">
                                        <FileCheck />
                                        <span className="file-selected-name">{selectedFile.name}</span>
                                        <span className="file-size">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="alert alert-error" style={{ fontSize: '0.875rem' }}>
                                    {error}
                                </div>
                            )}

                            <div className="modal-actions">
                                <button type="button" onClick={resetModal} className="btn">
                                    გაუქმება
                                </button>
                                <button type="submit" className="btn btn-success">
                                    <Plus size={20} />
                                    დამატება
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Duplicate Warning Modal */}
            {duplicateWarning && (
                <DuplicateWarning
                    duplicateData={duplicateWarning}
                    onProceed={handleProceedWithDuplicate}
                    onCancel={handleCancelDuplicate}
                />
            )}
        </div>
    );
};

export default MainDashboard;
