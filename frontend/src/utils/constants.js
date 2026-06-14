export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

// Convert a relative path like "/uploads/songs/audio/x.mp3" into a full URL
export const getFileUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${FILE_BASE_URL}${path}`;
};

export const ROLES = {
  LISTENER: 'LISTENER',
  ARTIST: 'ARTIST',
  ADMIN: 'ADMIN',
};