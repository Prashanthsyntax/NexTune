import { useEffect, useState } from 'react';
import { getTopSongs, getLatestSongs } from '../../api/songsApi';
import SongCard from '../../components/player/SongCard';

function Home() {
  const [topSongs, setTopSongs] = useState([]);
  const [latestSongs, setLatestSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const [topRes, latestRes] = await Promise.all([
          getTopSongs(10),
          getLatestSongs(10),
        ]);
        setTopSongs(topRes.data.data);
        setLatestSongs(latestRes.data.data);
      } catch (err) {
        console.error('Failed to fetch songs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (loading) {
    return <div className="p-6 text-neutral-400">Loading...</div>;
  }

  return (
    <div className="p-6 flex flex-col gap-8">
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Latest releases</h2>
        {latestSongs.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            No songs available yet. Upload and approve a song to see it here.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {latestSongs.map((song) => (
              <SongCard key={song.id} song={song} queue={latestSongs} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Top tracks</h2>
        {topSongs.length === 0 ? (
          <p className="text-neutral-500 text-sm">No songs available yet.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {topSongs.map((song) => (
              <SongCard key={song.id} song={song} queue={topSongs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;