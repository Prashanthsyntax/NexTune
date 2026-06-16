import api from './axios';

export const getMyProfile = () => api.get('/users/me');
export const updateProfile = (formData) =>
  api.put('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const upgradeToPremium = () => api.put('/users/me/premium');
export const cancelPremium = () => api.put('/users/me/premium/cancel');