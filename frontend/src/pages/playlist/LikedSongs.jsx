import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { getLikedSongs } from '../../api/likeApi';
import SongListItem from '../../components/player/SongListItem';

function LikedSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLikedSongs()
      .then((res) => setSongs(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-neutral-400">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-600 to-emerald-900 flex items-center justify-center">
          <FaHeart className="text-white text-2xl" />
        </div>
        <div>
          <p className="text-neutral-400 text-sm uppercase tracking-wide">Playlist</p>
          <h1 className="text-3xl font-bold text-white">Liked Songs</h1>
          <p className="text-neutral-400 text-sm">{songs.length} songs</p>
        </div>
      </div>

      {songs.length === 0 ? (
        <p className="text-neutral-500 text-sm">Songs you like will appear here.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {songs.map((song, i) => (
            <SongListItem key={song.id} song={song} queue={songs} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LikedSongs;