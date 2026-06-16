import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaMusic, FaCheck, FaTimes } from 'react-icons/fa';
import { approveSong, rejectSong } from '../../api/songsApi';
import { getFileUrl } from '../../utils/constants';

function PendingSongsList({ songs, onUpdate }) {
  const [processing, setProcessing] = useState(null);

  const handleApprove = async (songId) => {
    setProcessing(songId);
    try {
      await approveSong(songId);
      toast.success('Song approved');
      onUpdate(songId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (songId) => {
    setProcessing(songId);
    try {
      await rejectSong(songId);
      toast.success('Song rejected');
      onUpdate(songId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    } finally {
      setProcessing(null);
    }
  };

  if (songs.length === 0) {
    return <p className="text-neutral-500 text-sm">No pending songs to review.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
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
            <p className="text-neutral-400 text-xs truncate">{song.artistName}</p>
          </div>
          <audio controls src={getFileUrl(song.audioUrl)} className="h-8 w-48" />
          <button
            onClick={() => handleApprove(song.id)}
            disabled={processing === song.id}
            className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full px-3 py-1.5 text-xs transition"
          >
            <FaCheck size={11} /> Approve
          </button>
          <button
            onClick={() => handleReject(song.id)}
            disabled={processing === song.id}
            className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-full px-3 py-1.5 text-xs transition"
          >
            <FaTimes size={11} /> Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default PendingSongsList;