import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaMusic, FaPlay, FaTrash } from 'react-icons/fa';
import { getPlaylistById, removeSongFromPlaylist, deletePlaylist } from '../../api/playlistApi';
import { getFileUrl } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import usePlayerStore from '../../store/playerStore';
import SongListItem from '../../components/player/SongListItem';

function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { playSong } = usePlayerStore();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const res = await getPlaylistById(id);
      setPlaylist(res.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSong = async (songId) => {
    try {
      await removeSongFromPlaylist(id, songId);
      toast.success('Song removed');
      fetchPlaylist();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove song');
    }
  };

  const handleDeletePlaylist = async () => {
    if (!window.confirm('Delete this playlist? This cannot be undone.')) return;
    try {
      await deletePlaylist(id);
      toast.success('Playlist deleted');
      navigate('/library');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete playlist');
    }
  };

  const handlePlayAll = () => {
    if (playlist.songs?.length > 0) {
      playSong(playlist.songs[0], playlist.songs);
    }
  };

  if (loading) return <div className="p-6 text-neutral-400">Loading...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  const isOwner = user?.username === playlist.username;

  return (
    <div className="p-6">
      <div className="flex items-end gap-6 mb-6">
        <div className="w-44 h-44 rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {playlist.coverImage ? (
            <img src={getFileUrl(playlist.coverImage)} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <FaMusic className="text-neutral-600 text-5xl" />
          )}
        </div>

        <div>
          <p className="text-neutral-400 text-sm uppercase tracking-wide">
            {playlist.isPublic ? 'Public playlist' : 'Private playlist'}
          </p>
          <h1 className="text-4xl font-bold text-white mt-1 mb-2">{playlist.name}</h1>
          {playlist.description && <p className="text-neutral-400 text-sm mb-2">{playlist.description}</p>}
          <p className="text-neutral-400 text-sm">
            {playlist.username} · {playlist.songCount} songs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handlePlayAll}
          disabled={!playlist.songs?.length}
          className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black rounded-full w-12 h-12 flex items-center justify-center"
        >
          <FaPlay />
        </button>

        {isOwner && (
          <button
            onClick={handleDeletePlaylist}
            className="text-neutral-400 hover:text-red-400 flex items-center gap-2 text-sm"
          >
            <FaTrash size={12} /> Delete playlist
          </button>
        )}
      </div>

      {playlist.songs?.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          This playlist is empty. Add songs from the Search page.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {playlist.songs.map((song, i) => (
            <SongListItem
              key={song.id}
              song={song}
              queue={playlist.songs}
              index={i + 1}
              showRemove={isOwner}
              onRemove={handleRemoveSong}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlaylistDetail;