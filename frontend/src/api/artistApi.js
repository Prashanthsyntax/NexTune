import api from './axios';

export const getMyArtistProfile = () => api.get('/artists/me');
export const createArtistProfile = (formData) =>
  api.post('/artists', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getArtistById = (id) => api.get(`/artists/${id}`);
export const updateArtist = (id, formData) =>
  api.put(`/artists/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAllArtists = () => api.get('/artists');