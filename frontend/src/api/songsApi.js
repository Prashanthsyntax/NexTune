import api from './axios';

export const getTopSongs = (limit = 10) => api.get(`/songs/public/top?limit=${limit}`);
export const getLatestSongs = (limit = 10) => api.get(`/songs/public/latest?limit=${limit}`);
export const searchSongs = (query, page = 0, size = 10) =>
  api.get(`/songs/public/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`);
export const getSongById = (id) => api.get(`/songs/${id}`);
export const incrementPlayCount = (id) => api.post(`/songs/${id}/play`);