import { FaPlay, FaPause, FaMusic, FaTrash } from 'react-icons/fa';
import usePlayerStore from '../../store/playerStore';
import { getFileUrl } from '../../utils/constants';
import LikeButton from './LikeButton';
import AddToPlaylistMenu from './AddToPlaylistMenu';

function formatDuration(seconds) {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function SongListItem({ song, queue, index, onRemove, showRemove = false }) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  return (
    <div className="group flex items-center gap-4 px-3 py-2 rounded-md hover:bg-neutral-800 transition">
      <div className="w-8 flex justify-center text-neutral-400 text-sm">
        <span className="group-hover:hidden">{index}</span>
        <button onClick={handlePlay} className="hidden group-hover:block text-white">
          {isCurrentSong && isPlaying ? <FaPause /> : <FaPlay />}
        </button>
      </div>

      <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
        {song.coverImage ? (
          <img src={getFileUrl(song.coverImage)} alt={song.title} className="w-full h-full object-cover" />
        ) : (
          <FaMusic className="text-neutral-600 text-sm" />
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <p className={`text-sm truncate ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>{song.title}</p>
        <p className="text-neutral-400 text-xs truncate">{song.artistName}</p>
      </div>

      <div className="hidden md:block text-neutral-400 text-xs w-32 truncate">
        {song.albumTitle || '-'}
      </div>

      <LikeButton songId={song.id} />
      <AddToPlaylistMenu songId={song.id} />

      {showRemove && (
        <button onClick={() => onRemove(song.id)} className="text-neutral-500 hover:text-red-400" title="Remove">
          <FaTrash size={13} />
        </button>
      )}

      <div className="text-neutral-400 text-xs w-12 text-right">{formatDuration(song.duration)}</div>
    </div>
  );
}

export default SongListItem;