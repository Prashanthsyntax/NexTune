import { useEffect, useRef, useState } from 'react';
import { getTopSongs, getLatestSongs } from '../../api/songsApi';
import SongCard from '../../components/player/SongCard';

function ScrollRow({ songs }) {
  const ref = useRef(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const onMouseDown = (e) => {
    // eslint-disable-next-line react-hooks/immutability
    isDown = true;
    ref.current.style.cursor = 'grabbing';
    startX = e.pageX - ref.current.offsetLeft;
    scrollLeft = ref.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
    ref.current.style.cursor = 'grab';
  };

  const onMouseUp = () => {
    isDown = false;
    ref.current.style.cursor = 'grab';
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={ref}
      // eslint-disable-next-line react-hooks/immutability
      onMouseDown={onMouseDown}
      // eslint-disable-next-line react-hooks/immutability
      onMouseLeave={onMouseLeave}
      // eslint-disable-next-line react-hooks/immutability
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      className="flex gap-4 select-none"
      style={{
        overflowX: 'scroll',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        cursor: 'grab',
      }}
    >
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      {songs.map((song) => (
        <SongCard key={song.id} song={song} queue={songs} />
      ))}
    </div>
  );
}

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
          <ScrollRow songs={latestSongs} />
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Top tracks</h2>
        {topSongs.length === 0 ? (
          <p className="text-neutral-500 text-sm">No songs available yet.</p>
        ) : (
          <ScrollRow songs={topSongs} />
        )}
      </section>
    </div>
  );
}

export default Home;