import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { searchSongs } from '../../api/songsApi';
import { useDebounce } from '../../hooks/useDebounce';
import SongListItem from '../../components/player/SongListItem';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await searchSongs(debouncedQuery);
        setResults(res.data.data.content);
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  return (
    <div className="p-6">
      <div className="relative max-w-md mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Search songs, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-full pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500"
        />
      </div>

      {loading && <p className="text-neutral-400 text-sm">Searching...</p>}

      {!loading && debouncedQuery && results.length === 0 && (
        <p className="text-neutral-400 text-sm">No results found for "{debouncedQuery}"</p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-1">
          {results.map((song, i) => (
            <SongListItem key={song.id} song={song} queue={results} index={i + 1} />
          ))}
        </div>
      )}

      {!debouncedQuery && (
        <p className="text-neutral-500 text-sm">Start typing to search the NexTune library.</p>
      )}
    </div>
  );
}

export default Search;