import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaMusic, FaEdit, FaCrown, FaHistory, FaTrash } from 'react-icons/fa';
import { getMyProfile, updateProfile, upgradeToPremium, cancelPremium } from '../../api/userApi';
import { getHistory, clearHistory } from '../../api/historyApi';
import { getFileUrl } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import SongListItem from '../../components/player/SongListItem';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

function Profile() {
  const { login, user: authUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, historyRes] = await Promise.all([getMyProfile(), getHistory(50)]);
      setProfile(profileRes.data.data);
      setUsername(profileRes.data.data.username);
      setBio(profileRes.data.data.bio || '');
      setHistory(historyRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      if (username !== profile.username) formData.append('username', username);
      formData.append('bio', bio);
      if (profileImage) formData.append('profileImage', profileImage);

      const res = await updateProfile(formData);
      setProfile(res.data.data);
      login({ ...authUser, username: res.data.data.username });
      toast.success('Profile updated');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setPremiumLoading(true);
    try {
      const res = await upgradeToPremium();
      setProfile(res.data.data);
      login({ ...authUser, premium: true });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upgrade failed');
    } finally {
      setPremiumLoading(false);
    }
  };

  const handleCancelPremium = async () => {
    if (!window.confirm('Cancel your Premium subscription?')) return;
    setPremiumLoading(true);
    try {
      const res = await cancelPremium();
      setProfile(res.data.data);
      login({ ...authUser, premium: false });
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setPremiumLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear your entire listening history?')) return;
    try {
      await clearHistory();
      setHistory([]);
      toast.success('History cleared');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to clear history');
    }
  };

  if (loading) return <div className="p-6 text-neutral-400">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {profile.profileImage ? (
            <img src={getFileUrl(profile.profileImage)} alt={profile.username} className="w-full h-full object-cover" />
          ) : (
            <FaMusic className="text-neutral-600 text-3xl" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
            {profile.premium && (
              <span className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                <FaCrown size={10} /> Premium
              </span>
            )}
            <span className="bg-neutral-800 text-neutral-300 text-xs px-2 py-1 rounded-full">{profile.role}</span>
          </div>
          <p className="text-neutral-400 text-sm">{profile.email}</p>
          {profile.bio && !editing && <p className="text-neutral-400 text-sm mt-1 max-w-md">{profile.bio}</p>}
          {!editing && (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm mt-2">
              <FaEdit size={12} /> Edit profile
            </button>
          )}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <form onSubmit={handleSave} className="bg-neutral-900 rounded-lg p-4 mb-8 flex flex-col gap-4 max-w-sm">
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

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

          <div className="flex gap-3">
            <button type="button" onClick={() => setEditing(false)} className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold rounded-full py-2.5 transition">
              Cancel
            </button>
            <Button type="submit" loading={saving} className="flex-1">
              Save
            </Button>
          </div>
        </form>
      )}

      {/* Premium section */}
      <div className="bg-neutral-900 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <FaCrown className="text-yellow-400" /> Premium
        </h2>
        {profile.premium ? (
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-neutral-400 text-sm">
              You're a Premium member — enjoy downloads and ad-free listening.
            </p>
            <button onClick={handleCancelPremium} disabled={premiumLoading} className="text-sm text-red-400 hover:text-red-300">
              Cancel subscription
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-neutral-400 text-sm">
              Upgrade to Premium to download songs and remove limitations.
            </p>
            <Button type="button" onClick={handleUpgrade} loading={premiumLoading} className="px-4">
              Upgrade
            </Button>
          </div>
        )}
      </div>

      {/* Listening history */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FaHistory /> Listening history
        </h2>
        {history.length > 0 && (
          <button onClick={handleClearHistory} className="flex items-center gap-2 text-neutral-400 hover:text-red-400 text-sm">
            <FaTrash size={12} /> Clear history
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-neutral-500 text-sm">Songs you listen to will appear here.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {history.map((entry, i) => (
            <SongListItem key={entry.id} song={entry.song} queue={history.map((h) => h.song)} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;