import { FaPlay, FaMusic } from 'react-icons/fa';
import { getFileUrl } from '../../utils/constants';
import usePlayerStore from '../../store/playerStore';

function SongCard({ song, queue }) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  return (
    <div className="group relative bg-neutral-900 hover:bg-neutral-800 rounded-lg p-3 transition cursor-pointer w-44 flex-shrink-0">
      <div className="relative w-full h-40 rounded-md mb-3 overflow-hidden bg-neutral-800 flex items-center justify-center">
        {song.coverImage ? (
          <img
            src={getFileUrl(song.coverImage)}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <FaMusic className="text-neutral-600 text-3xl" />
        )}

        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 bg-green-500 text-black rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition shadow-lg"
        >
          <FaPlay size={14} />
        </button>
      </div>

      <h3 className={`text-sm font-medium truncate ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>
        {song.title}
      </h3>
      <p className="text-neutral-400 text-xs truncate">{song.artistName}</p>
      {isCurrentSong && isPlaying && (
        <p className="text-green-400 text-xs mt-1">Now playing</p>
      )}
    </div>
  );
}

export default SongCard;