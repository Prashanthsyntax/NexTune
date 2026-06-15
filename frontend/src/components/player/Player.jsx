import { useEffect, useRef, useState } from 'react';
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaRandom, FaRedo, FaVolumeUp, FaVolumeMute, FaMusic
} from 'react-icons/fa';
import usePlayerStore from '../../store/playerStore';
import useAuthStore from '../../store/authStore';
import { getFileUrl } from '../../utils/constants';
import { incrementPlayCount } from '../../api/songsApi';
import { recordHistory } from '../../api/historyApi';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function Player() {
  const audioRef = useRef(null);
  const {
    currentSong, isPlaying, volume, repeat, shuffle,
    togglePlay, setVolume, toggleRepeat, toggleShuffle,
    playNext, playPrevious,
  } = usePlayerStore();

  const { token } = useAuthStore();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load new song whenever currentSong changes
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    audioRef.current.src = getFileUrl(currentSong.audioUrl);
    audioRef.current.play().catch(() => {});
    setCurrentTime(0);

    // Track play count (public-ish) + listening history (auth only)
    incrementPlayCount(currentSong.id).catch(() => {});
    if (token) {
      recordHistory(currentSong.id).catch(() => {});
    }
  }, [currentSong]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
  const handleLoadedMetadata = () => setDuration(audioRef.current.duration);

  const handleEnded = () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      playNext();
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  if (!currentSong) {
    return (
      <footer className="h-20 bg-neutral-900 border-t border-neutral-800 flex items-center justify-center">
        <span className="text-neutral-500 text-sm">No song playing</span>
        <audio ref={audioRef} />
      </footer>
    );
  }

  return (
    <footer className="h-20 bg-neutral-900 border-t border-neutral-800 flex items-center px-4 gap-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Song info */}
      <div className="flex items-center gap-3 w-56 flex-shrink-0">
        <div className="w-12 h-12 rounded bg-neutral-800 flex items-center justify-center overflow-hidden">
          {currentSong.coverImage ? (
            <img
              src={getFileUrl(currentSong.coverImage)}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaMusic className="text-neutral-600" />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="text-white text-sm truncate">{currentSong.title}</p>
          <p className="text-neutral-400 text-xs truncate">{currentSong.artistName}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center flex-1 max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleShuffle}
            className={`text-sm ${shuffle ? 'text-green-400' : 'text-neutral-400 hover:text-white'}`}
            title="Shuffle"
          >
            <FaRandom />
          </button>
          <button onClick={playPrevious} className="text-neutral-300 hover:text-white text-lg" title="Previous">
            <FaStepBackward />
          </button>
          <button
            onClick={togglePlay}
            className="bg-white text-black rounded-full w-9 h-9 flex items-center justify-center hover:scale-105 transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={playNext} className="text-neutral-300 hover:text-white text-lg" title="Next">
            <FaStepForward />
          </button>
          <button
            onClick={toggleRepeat}
            className={`text-sm ${repeat ? 'text-green-400' : 'text-neutral-400 hover:text-white'}`}
            title="Repeat"
          >
            <FaRedo />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full mt-2">
          <span className="text-xs text-neutral-400 w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 accent-green-500 cursor-pointer"
          />
          <span className="text-xs text-neutral-400 w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-32 flex-shrink-0 justify-end">
        {volume === 0 ? (
          <FaVolumeMute className="text-neutral-400" />
        ) : (
          <FaVolumeUp className="text-neutral-400" />
        )}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 h-1 accent-green-500 cursor-pointer"
        />
      </div>
    </footer>
  );
}

export default Player;