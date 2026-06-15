import { useState } from 'react';
import toast from 'react-hot-toast';
import { createPlaylist } from '../../api/playlistApi';
import Input from '../common/Input';
import Button from '../common/Button';

function CreatePlaylistModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Playlist name is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('isPublic', isPublic);
      if (coverImage) formData.append('coverImage', coverImage);

      const res = await createPlaylist(formData);
      toast.success('Playlist created');
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Create playlist</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Playlist" />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Cover image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="text-sm text-neutral-400"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="accent-green-500"
            />
            Make this playlist public
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-full py-2.5 transition"
            >
              Cancel
            </button>
            <Button type="submit" loading={loading} className="flex-1">
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePlaylistModal;