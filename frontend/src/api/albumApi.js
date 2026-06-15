import api from './axios';

export const createAlbum = (formData) =>
  api.post('/albums', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getAlbumById = (id) => api.get(`/albums/${id}`);
export const getAlbumsByArtist = (artistId) => api.get(`/albums/artist/${artistId}`);
export const getAllAlbums = () => api.get('/albums');