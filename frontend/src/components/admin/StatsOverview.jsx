import {
  FaUsers, FaMicrophone, FaUserShield, FaCrown, FaMusic,
  FaClock, FaCheckCircle, FaTimesCircle, FaCompactDisc, FaListUl, FaPlay
} from 'react-icons/fa';

function StatsOverview({ stats }) {
  const cards = [
    { icon: <FaUsers />, label: 'Total users', value: stats.totalUsers },
    { icon: <FaUsers />, label: 'Listeners', value: stats.totalListeners },
    { icon: <FaMicrophone />, label: 'Artists', value: stats.totalArtists },
    { icon: <FaUserShield />, label: 'Admins', value: stats.totalAdmins },
    { icon: <FaCrown />, label: 'Premium users', value: stats.premiumUsers },
    { icon: <FaMusic />, label: 'Total songs', value: stats.totalSongs },
    { icon: <FaClock />, label: 'Pending songs', value: stats.pendingSongs },
    { icon: <FaCheckCircle />, label: 'Approved songs', value: stats.approvedSongs },
    { icon: <FaTimesCircle />, label: 'Rejected songs', value: stats.rejectedSongs },
    { icon: <FaCompactDisc />, label: 'Albums', value: stats.totalAlbums },
    { icon: <FaListUl />, label: 'Playlists', value: stats.totalPlaylists },
    { icon: <FaPlay />, label: 'Total plays', value: stats.totalPlays },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-neutral-900 rounded-lg p-4 flex items-center gap-3">
          <div className="text-green-400 text-xl">{c.icon}</div>
          <div>
            <p className="text-white text-xl font-bold">{c.value}</p>
            <p className="text-neutral-400 text-xs">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsOverview;