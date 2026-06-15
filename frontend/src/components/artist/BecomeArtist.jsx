import { useState } from 'react';
import toast from 'react-hot-toast';
import { createArtistProfile } from '../../api/artistApi';
import Input from '../common/Input';
import Button from '../common/Button';

function BecomeArtist({ onSuccess }) {
  const [artistName, setArtistName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!artistName.trim()) {
      toast.error('Artist name is required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('artistName', artistName);
      formData.append('bio', bio);
      if (profileImage) formData.append('profileImage', profileImage);
      if (coverImage) formData.append('coverImage', coverImage);

      const res = await createArtistProfile(formData);
      const { artist, token } = res.data.data;

      toast.success('Welcome, artist!');
      onSuccess(artist, token);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create artist profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-2">Become an artist</h1>
      <p className="text-neutral-400 text-sm mb-6">
        Set up your artist profile to start uploading songs and albums.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Artist name"
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Your stage name"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell listeners about yourself"
            rows={3}
            className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">Profile image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} className="text-sm text-neutral-400" />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">Cover image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} className="text-sm text-neutral-400" />
        </div>

        <Button type="submit" loading={loading}>
          Create artist profile
        </Button>
      </form>
    </div>
  );
}

export default BecomeArtist;