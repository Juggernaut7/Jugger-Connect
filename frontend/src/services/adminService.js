import api from './api';

export const adminService = {
  // Get admin dashboard stats
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all users
  getAllUsers: async (page = 1, limit = 20, search = '') => {
    const response = await api.get(`/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Ban/Unban user
  banUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/ban`);
    return response.data;
  },

  // Verify/Unverify user
  verifyUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/verify`);
    return response.data;
  }
}; 