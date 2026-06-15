import api from './axios';

export const likeSong = (songId) => api.post(`/likes/${songId}`);
export const unlikeSong = (songId) => api.delete(`/likes/${songId}`);
export const getLikedSongs = () => api.get('/likes');
export const checkLikeStatus = (songId) => api.get(`/likes/${songId}/status`);