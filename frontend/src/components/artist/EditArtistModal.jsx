import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateArtist } from '../../api/artistApi';
import Button from '../common/Button';

function EditArtistModal({ artist, onClose, onUpdated }) {
  const [bio, setBio] = useState(artist.bio || '');
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (profileImage) formData.append('profileImage', profileImage);
      if (coverImage) formData.append('coverImage', coverImage);

      const res = await updateArtist(artist.id, formData);
      toast.success('Profile updated');
      onUpdated(res.data.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-neutral-900 rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white mb-4">Edit artist profile</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Profile image</label>
            <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} className="text-sm text-neutral-400" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-neutral-300">Cover image</label>
            <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="text-sm text-neutral-400" />
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-full py-2.5 transition">
              Cancel
            </button>
            <Button type="submit" loading={loading} className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditArtistModal;