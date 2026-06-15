import api from './axios';

export const recordHistory = (songId) => api.post(`/history/${songId}`);
export const getHistory = (limit = 50) => api.get(`/history?limit=${limit}`);
export const clearHistory = () => api.delete('/history');