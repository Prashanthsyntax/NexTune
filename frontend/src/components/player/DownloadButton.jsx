import { FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { downloadSong } from '../../api/songsApi';
import useAuthStore from '../../store/authStore';

function DownloadButton({ song }) {
  const { user, token } = useAuthStore();

  const handleDownload = async (e) => {
    e.stopPropagation();

    if (!token) {
      toast.error('Log in to download songs');
      return;
    }

    if (song.premium && !user?.premium) {
      toast.error('Upgrade to Premium to download this song');
      return;
    }

    try {
      const res = await downloadSong(song.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${song.title}.mp3`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      toast.error('Download failed');
    }
  };

  return (
    <button onClick={handleDownload} className="text-neutral-400 hover:text-white text-lg" title="Download">
      <FaDownload />
    </button>
  );
}

export default DownloadButton;