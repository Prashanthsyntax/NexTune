import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaHeart, FaMusic } from 'react-icons/fa';
import { getMyPlaylists } from '../../api/playlistApi';
import { getFileUrl } from '../../utils/constants';
import CreatePlaylistModal from '../../components/playlist/CreatePlaylistModal';

function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await getMyPlaylists();
      setPlaylists(res.data.data);
    } catch (err) {
      console.error('Failed to load playlists', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreated = (playlist) => {
    setPlaylists((prev) => [playlist, ...prev]);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full px-4 py-2 text-sm transition"
        >
          <FaPlus size={12} /> Create playlist
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <Link to="/liked-songs" className="bg-neutral-900 hover:bg-neutral-800 rounded-lg p-4 transition">
            <div className="w-full aspect-square rounded-md mb-3 bg-gradient-to-br from-green-600 to-emerald-900 flex items-center justify-center">
              <FaHeart className="text-white text-3xl" />
            </div>
            <h3 className="text-white text-sm font-medium truncate">Liked Songs</h3>
            <p className="text-neutral-400 text-xs">Your favorites</p>
          </Link>

          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className="bg-neutral-900 hover:bg-neutral-800 rounded-lg p-4 transition"
            >
              <div className="w-full aspect-square rounded-md mb-3 bg-neutral-800 flex items-center justify-center overflow-hidden">
                {playlist.coverImage ? (
                  <img src={getFileUrl(playlist.coverImage)} alt={playlist.name} className="w-full h-full object-cover" />
                ) : (
                  <FaMusic className="text-neutral-600 text-3xl" />
                )}
              </div>
              <h3 className="text-white text-sm font-medium truncate">{playlist.name}</h3>
              <p className="text-neutral-400 text-xs">
                {playlist.songCount} songs · {playlist.isPublic ? 'Public' : 'Private'}
              </p>
            </Link>
          ))}
        </div>
      )}

      {showModal && <CreatePlaylistModal onClose={() => setShowModal(false)} onCreated={handleCreated} />}
    </div>
  );
}

export default Library;