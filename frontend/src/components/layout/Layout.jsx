import { Outlet, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

function Layout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-neutral-950 p-4 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-green-500">NexTune</h1>

          <nav className="flex flex-col gap-2 mt-4">
            <Link to="/" className="hover:text-green-400">Home</Link>
            <Link to="/search" className="hover:text-green-400">Search</Link>
            <Link to="/profile" className="hover:text-green-400">Profile</Link>

            {user?.role === 'ARTIST' && (
              <Link to="/artist/dashboard" className="hover:text-green-400">
                Artist Dashboard
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="hover:text-green-400">
                Admin Panel
              </Link>
            )}
          </nav>

          <div className="mt-auto">
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-neutral-400">
                  {user.username} ({user.role})
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-red-400 hover:text-red-300 text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-green-400 hover:text-green-300">
                Login
              </Link>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Player bar placeholder */}
      <footer className="h-20 bg-neutral-900 border-t border-neutral-800 flex items-center px-4">
        <span className="text-neutral-500 text-sm">Player bar (Step 10)</span>
      </footer>
    </div>
  );
}

export default Layout;