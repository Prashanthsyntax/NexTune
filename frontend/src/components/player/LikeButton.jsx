import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { likeSong, unlikeSong, checkLikeStatus } from '../../api/likeApi';
import useAuthStore from '../../store/authStore';

function LikeButton({ songId, className = '' }) {
  const { token } = useAuthStore();
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    checkLikeStatus(songId)
      .then((res) => setLiked(res.data.data))
      .catch(() => {});
  }, [songId, token]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (!token) {
      toast.error('Log in to like songs');
      return;
    }
    setLoading(true);
    try {
      if (liked) {
        await unlikeSong(songId);
        setLiked(false);
      } else {
        await likeSong(songId);
        setLiked(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-lg ${liked ? 'text-green-500' : 'text-neutral-400 hover:text-white'} ${className}`}
      title={liked ? 'Unlike' : 'Like'}
    >
      {liked ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}

export default LikeButton;