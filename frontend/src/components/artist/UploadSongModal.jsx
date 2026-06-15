import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadSong } from '../../api/songsApi';
import Input from '../common/Input';
import Button from '../common/Button';

function UploadSongModal({ albums, onClose, onUploaded }) {
  const [title, setTitle] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [premium, setPremium] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!audioFile) {
      toast.error('Audio file is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (albumId) formData.append('albumId', albumId);
      formData.append('premium', premium);
      formData.append('audioFile', audioFile);
      if (coverImage) formData.append('coverImage', coverImage);

      const res = await uploadSong(formData);
      toast.success('Song uploaded! Awaiting admin approval.');
      onUploaded(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Upload song</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Song title" />

          {albums.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300">Album (optional)</label>
              <select
                value={albumId}
                onChange={(e) => setAlbumId(e.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-green-500"
              >
                <option value="">Single (no album)</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Audio file (mp3, wav)</label>
            <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} className="text-sm text-neutral-400" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Cover image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="text-sm text-neutral-400" />
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={premium} onChange={(e) => setPremium(e.target.checked)} className="accent-green-500" />
            Premium only
          </label>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-full py-2.5 transition">
              Cancel
            </button>
            <Button type="submit" loading={loading} className="flex-1">
              Upload
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadSongModal;