import api from './axios';

export const createPlaylist = (formData) =>
  api.post('/playlists', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getMyPlaylists = () => api.get('/playlists/my');
export const getPlaylistById = (id) => api.get(`/playlists/${id}`);
export const updatePlaylist = (id, formData) =>
  api.put(`/playlists/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePlaylist = (id) => api.delete(`/playlists/${id}`);
export const addSongToPlaylist = (playlistId, songId) =>
  api.post(`/playlists/${playlistId}/songs/${songId}`);
export const removeSongFromPlaylist = (playlistId, songId) =>
  api.delete(`/playlists/${playlistId}/songs/${songId}`);
export const getPublicPlaylists = () => api.get('/playlists/public');