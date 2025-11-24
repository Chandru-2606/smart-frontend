import apiClient from "./http";

const getSuperAdminSummary = async () => {
    try {
        const response = await apiClient().get('/reports/superadmin/summary');
        return response;
    } catch (error) {
        throw error;
    }
};

const getSchoolAdminSummary = async (schoolId) => {
    try {
        const response = await apiClient().get(`/reports/schooladmin/summary/${schoolId}`);
        return response;
    } catch (error) {
        throw error;
    }
};

const getFilteredTransactions = async (params) => {
    try {
        const response = await apiClient().get('/reports/transactions', { params });
        return response;
    } catch (error) {
        throw error;
    }
}

export { getSuperAdminSummary, getSchoolAdminSummary, getFilteredTransactions };
