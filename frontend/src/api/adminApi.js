import api from './axios';

export const getAllUsers = () => api.get('/admin/users');
export const getUser = (id) => api.get(`/admin/users/${id}`);
export const toggleUserStatus = (id, active) => api.put(`/admin/users/${id}/status?active=${active}`);
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role?role=${role}`);
export const getPendingSongs = () => api.get('/admin/songs/pending');
export const getPlatformStats = () => api.get('/admin/stats');