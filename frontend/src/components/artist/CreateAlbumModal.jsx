import { useState } from 'react';
import toast from 'react-hot-toast';
import { createAlbum } from '../../api/albumApi';
import Input from '../common/Input';
import Button from '../common/Button';

function CreateAlbumModal({ onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [albumType, setAlbumType] = useState('ALBUM');
  const [releaseDate, setReleaseDate] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('albumType', albumType);
      if (releaseDate) formData.append('releaseDate', releaseDate);
      if (coverImage) formData.append('coverImage', coverImage);

      const res = await createAlbum(formData);
      toast.success('Album created');
      onCreated(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Create album</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Album title" />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Type</label>
            <select
              value={albumType}
              onChange={(e) => setAlbumType(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-green-500"
            >
              <option value="ALBUM">Album</option>
              <option value="EP">EP</option>
              <option value="SINGLE">Single</option>
            </select>
          </div>

          <Input
            label="Release date"
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Cover image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="text-sm text-neutral-400" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-full py-2.5 transition">
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

export default CreateAlbumModal;