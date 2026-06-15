import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Search from './pages/search/Search';
import PlaylistDetail from './pages/playlist/PlaylistDetail';
import ArtistDashboard from './pages/artist/ArtistDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Profile from './pages/profile/Profile';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#262626', color: '#fff' },
      }} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/playlist/:id" element={<PlaylistDetail />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/artist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ARTIST', 'ADMIN']}>
                <ArtistDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;