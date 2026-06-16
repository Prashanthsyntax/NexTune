import { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaClock, FaTags } from 'react-icons/fa';
import { getAllUsers, getPendingSongs, getPlatformStats } from '../../api/adminApi';
import StatsOverview from '../../components/admin/StatsOverview';
import UsersTable from '../../components/admin/UsersTable';
import PendingSongsList from '../../components/admin/PendingSongsList';
import GenreManager from '../../components/admin/GenreManager';

const TABS = [
  { key: 'overview', label: 'Overview', icon: <FaChartBar /> },
  { key: 'users', label: 'Users', icon: <FaUsers /> },
  { key: 'pending', label: 'Pending songs', icon: <FaClock /> },
  { key: 'genres', label: 'Genres', icon: <FaTags /> },
];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingSongs, setPendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, pendingRes] = await Promise.all([
        getPlatformStats(),
        getAllUsers(),
        getPendingSongs(),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setPendingSongs(pendingRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdate = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  const handlePendingSongUpdate = (songId) => {
    setPendingSongs((prev) => prev.filter((s) => s.id !== songId));
    getPlatformStats().then((res) => setStats(res.data.data)).catch(() => {});
  };

  if (loading) return <div className="p-6 text-neutral-400">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6 border-b border-neutral-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition border-b-2 ${
              activeTab === tab.key
                ? 'text-green-400 border-green-400'
                : 'text-neutral-400 border-transparent hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.key === 'pending' && pendingSongs.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {pendingSongs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && <StatsOverview stats={stats} />}
      {activeTab === 'users' && <UsersTable users={users} onUpdate={handleUserUpdate} />}
      {activeTab === 'pending' && <PendingSongsList songs={pendingSongs} onUpdate={handlePendingSongUpdate} />}
      {activeTab === 'genres' && <GenreManager />}
    </div>
  );
}

export default AdminDashboard;