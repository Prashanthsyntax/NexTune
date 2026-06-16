import { useState } from 'react';
import toast from 'react-hot-toast';
import { toggleUserStatus, updateUserRole } from '../../api/adminApi';

function UsersTable({ users, onUpdate }) {
  const [updating, setUpdating] = useState(null);

  const handleToggleStatus = async (user) => {
    setUpdating(user.id);
    try {
      const res = await toggleUserStatus(user.id, !user.active);
      onUpdate(res.data.data);
      toast.success(`User ${res.data.data.active ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    if (newRole === user.role) return;
    setUpdating(user.id);
    try {
      const res = await updateUserRole(user.id, newRole);
      onUpdate(res.data.data);
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-neutral-400 text-left border-b border-neutral-800">
            <th className="py-2 px-3">Username</th>
            <th className="py-2 px-3">Email</th>
            <th className="py-2 px-3">Role</th>
            <th className="py-2 px-3">Premium</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-neutral-900 hover:bg-neutral-900">
              <td className="py-2 px-3 text-white">{user.username}</td>
              <td className="py-2 px-3 text-neutral-400">{user.email}</td>
              <td className="py-2 px-3">
                <select
                  value={user.role}
                  disabled={updating === user.id}
                  onChange={(e) => handleRoleChange(user, e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-green-500"
                >
                  <option value="LISTENER">LISTENER</option>
                  <option value="ARTIST">ARTIST</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td className="py-2 px-3 text-neutral-400">{user.premium ? 'Yes' : 'No'}</td>
              <td className="py-2 px-3">
                <button
                  onClick={() => handleToggleStatus(user)}
                  disabled={updating === user.id}
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {user.active ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td className="py-2 px-3 text-neutral-400 text-xs">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;