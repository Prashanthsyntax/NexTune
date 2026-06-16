import api from './axios';

export const getAllGenres = () => api.get('/genres');
export const createGenre = (formData) =>
  api.post('/genres', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateGenre = (id, formData) =>
  api.put(`/genres/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteGenre = (id) => api.delete(`/genres/${id}`);