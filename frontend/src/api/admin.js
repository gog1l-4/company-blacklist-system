import api from './axios';

export const getPendingUsers = async () => {
    const response = await api.get('/admin/pending');
    return response.data;
};

export const approveUser = async (userId) => {
    const response = await api.post(`/admin/approve/${userId}`);
    return response.data;
};

export const rejectUser = async (userId) => {
    const response = await api.post(`/admin/reject/${userId}`);
    return response.data;
};
