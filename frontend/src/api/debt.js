import api from './axios';

// Admin debt approval
export const getPendingDebts = async () => {
    const response = await api.get('/admin/pending-debts');
    return response.data;
};

export const approveDebt = async (id) => {
    const response = await api.post(`/admin/approve-debt/${id}`);
    return response.data;
};

export const rejectDebt = async (id, reason) => {
    const response = await api.post(`/admin/reject-debt/${id}`, { reason });
    return response.data;
};
