import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Search companies by tax ID
export const searchCompanies = async (taxId) => {
    try {
        const response = await axios.get(`${API_URL}/blacklist/search`, {
            params: { q: taxId },
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all companies
export const getAllCompanies = async () => {
    try {
        const response = await axios.get(`${API_URL}/blacklist`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add a new company to blacklist
export const addCompany = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/blacklist/add`, formData, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update debt status (admin only)
export const updateDebtStatus = async (id, status) => {
    try {
        const response = await axios.patch(
            `${API_URL}/blacklist/${id}/status`,
            { status },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete company (admin only)
export const deleteCompany = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/blacklist/${id}`, {
            headers: getAuthHeader(),
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Check for duplicate entries
export const checkDuplicate = async (targetTaxId, targetCompanyName) => {
    try {
        const response = await axios.post(
            `${API_URL}/blacklist/check-duplicate`,
            { targetTaxId, targetCompanyName },
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
