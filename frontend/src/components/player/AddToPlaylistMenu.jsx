import { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getMyPlaylists, addSongToPlaylist } from '../../api/playlistApi';
import useAuthStore from '../../store/authStore';

function AddToPlaylistMenu({ songId }) {
  const { token } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error('Log in to use playlists');
      return;
    }
    if (!open) {
      try {
        const res = await getMyPlaylists();
        setPlaylists(res.data.data);
      } catch {
        toast.error('Failed to load playlists');
      }
    }
    setOpen(!open);
  };

  const handleAdd = async (playlistId, e) => {
    e.stopPropagation();
    try {
      await addSongToPlaylist(playlistId, songId);
      toast.success('Added to playlist');
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add song');
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleOpen} className="text-neutral-400 hover:text-white text-lg" title="Add to playlist">
        <FaPlus />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-neutral-800 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
          {playlists.length === 0 ? (
            <p className="text-neutral-400 text-sm p-3">No playlists yet</p>
          ) : (
            playlists.map((p) => (
              <button
                key={p.id}
                onClick={(e) => handleAdd(p.id, e)}
                className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 truncate"
              >
                {p.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AddToPlaylistMenu;