import { useState, useEffect } from 'react';
import { FaMusic, FaUpload, FaPlus, FaUsers, FaPlay, FaHeart, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getMyArtistProfile } from '../../api/artistApi';
import { getSongsByArtist, deleteSong } from '../../api/songsApi';
import { getAlbumsByArtist } from '../../api/albumApi';
import { getFileUrl } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import BecomeArtist from './BecomeArtist';
import UploadSongModal from './UploadSongModal';
import CreateAlbumModal from './CreateAlbumModal';
import EditArtistModal from './EditArtistModal';

function ArtistDashboard() {
  const { user, login } = useAuthStore();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const [showUpload, setShowUpload] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getMyArtistProfile();
      setArtist(res.data.data);
      setHasProfile(true);
      fetchSongsAndAlbums(res.data.data.id);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setHasProfile(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSongsAndAlbums = async (artistId) => {
    try {
      const [songsRes, albumsRes] = await Promise.all([
        getSongsByArtist(artistId),
        getAlbumsByArtist(artistId),
      ]);
      setSongs(songsRes.data.data);
      setAlbums(albumsRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileCreated = (newArtist, newToken) => {
    login({ ...user, token: newToken, role: 'ARTIST' });
    setArtist(newArtist);
    setHasProfile(true);
    fetchSongsAndAlbums(newArtist.id);
  };

  const handleDeleteSong = async (songId) => {
    if (!window.confirm('Delete this song?')) return;
    try {
      await deleteSong(songId);
      toast.success('Song deleted');
      setSongs((prev) => prev.filter((s) => s.id !== songId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete song');
    }
  };

  if (loading) return <div className="p-6 text-neutral-400">Loading...</div>;

  if (!hasProfile) {
    return <BecomeArtist onSuccess={handleProfileCreated} />;
  }

  const totalPlays = songs.reduce((sum, s) => sum + (s.playCount || 0), 0);
  const totalLikes = songs.reduce((sum, s) => sum + (s.likeCount || 0), 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-end gap-6 mb-6">
        <div className="w-32 h-32 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {artist.profileImage ? (
            <img src={getFileUrl(artist.profileImage)} alt={artist.artistName} className="w-full h-full object-cover" />
          ) : (
            <FaMusic className="text-neutral-600 text-4xl" />
          )}
        </div>
        <div>
          <p className="text-neutral-400 text-sm uppercase tracking-wide">
            {artist.verified ? 'Verified artist' : 'Artist'}
          </p>
          <h1 className="text-3xl font-bold text-white mt-1">{artist.artistName}</h1>
          {artist.bio && <p className="text-neutral-400 text-sm mt-1 max-w-lg">{artist.bio}</p>}
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm mt-2"
          >
            <FaEdit size={12} /> Edit profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FaMusic />} label="Songs" value={songs.length} />
        <StatCard icon={<FaPlay />} label="Total plays" value={totalPlays} />
        <StatCard icon={<FaHeart />} label="Total likes" value={totalLikes} />
        <StatCard icon={<FaUsers />} label="Followers" value={artist.followers} />
      </div>

      {/* Songs */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Your songs</h2>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-semibold rounded-full px-4 py-2 text-sm transition"
        >
          <FaUpload size={12} /> Upload song
        </button>
      </div>

      {songs.length === 0 ? (
        <p className="text-neutral-500 text-sm mb-8">You haven't uploaded any songs yet.</p>
      ) : (
        <div className="flex flex-col gap-1 mb-8">
          {songs.map((song) => (
            <div key={song.id} className="flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-800 transition">
              <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {song.coverImage ? (
                  <img src={getFileUrl(song.coverImage)} alt={song.title} className="w-full h-full object-cover" />
                ) : (
                  <FaMusic className="text-neutral-600 text-sm" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-white text-sm truncate">{song.title}</p>
                <p className="text-neutral-400 text-xs truncate">{song.albumTitle || 'Single'}</p>
              </div>
              <StatusBadge status={song.status} />
              <div className="text-neutral-400 text-xs w-20 text-right">{song.playCount} plays</div>
              <div className="text-neutral-400 text-xs w-20 text-right">{song.likeCount} likes</div>
              <button
                onClick={() => handleDeleteSong(song.id)}
                className="text-neutral-500 hover:text-red-400 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Albums */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Your albums</h2>
        <button
          onClick={() => setShowAlbumModal(true)}
          className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-full px-4 py-2 text-sm transition"
        >
          <FaPlus size={12} /> Create album
        </button>
      </div>

      {albums.length === 0 ? (
        <p className="text-neutral-500 text-sm">No albums yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <div key={album.id} className="bg-neutral-900 rounded-lg p-4">
              <div className="w-full aspect-square rounded-md mb-3 bg-neutral-800 flex items-center justify-center overflow-hidden">
                {album.coverImage ? (
                  <img src={getFileUrl(album.coverImage)} alt={album.title} className="w-full h-full object-cover" />
                ) : (
                  <FaMusic className="text-neutral-600 text-3xl" />
                )}
              </div>
              <h3 className="text-white text-sm font-medium truncate">{album.title}</h3>
              <p className="text-neutral-400 text-xs">{album.albumType}</p>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <UploadSongModal
          albums={albums}
          onClose={() => setShowUpload(false)}
          onUploaded={(song) => setSongs((prev) => [song, ...prev])}
        />
      )}

      {showAlbumModal && (
        <CreateAlbumModal
          onClose={() => setShowAlbumModal(false)}
          onCreated={(album) => setAlbums((prev) => [album, ...prev])}
        />
      )}

      {showEditModal && (
        <EditArtistModal
          artist={artist}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => setArtist(updated)}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-neutral-900 rounded-lg p-4 flex items-center gap-3">
      <div className="text-green-400 text-xl">{icon}</div>
      <div>
        <p className="text-white text-xl font-bold">{value}</p>
        <p className="text-neutral-400 text-xs">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    APPROVED: 'bg-green-500/20 text-green-400',
    REJECTED: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status] || 'bg-neutral-700 text-neutral-300'}`}>
      {status}
    </span>
  );
}

export default ArtistDashboard;
