import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaMusic, FaTrash, FaPlus } from 'react-icons/fa';
import { getAllGenres, createGenre, deleteGenre } from '../../api/genreApi';
import { getFileUrl } from '../../utils/constants';
import Input from '../common/Input';
import Button from '../common/Button';

function GenreManager() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await getAllGenres();
      setGenres(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Genre name is required');
      return;
    }
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image) formData.append('image', image);

      const res = await createGenre(formData);
      setGenres((prev) => [...prev, res.data.data]);
      setName('');
      setDescription('');
      setImage(null);
      toast.success('Genre created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create genre');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this genre?')) return;
    try {
      await deleteGenre(id);
      setGenres((prev) => prev.filter((g) => g.id !== id));
      toast.success('Genre deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete genre');
    }
  };

  return (
    <div>
      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-3 mb-6 bg-neutral-900 p-4 rounded-lg">
        <div className="w-40">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Pop" />
        </div>
        <div className="w-48">
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-300">Image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm text-neutral-400" />
        </div>
        <Button type="submit" loading={creating} className="px-4 flex items-center gap-2">
          <FaPlus size={12} /> Add genre
        </Button>
      </form>

      {loading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : genres.length === 0 ? (
        <p className="text-neutral-500 text-sm">No genres yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <div key={genre.id} className="bg-neutral-900 rounded-lg p-3 relative group">
              <div className="w-full aspect-square rounded-md mb-2 bg-neutral-800 flex items-center justify-center overflow-hidden">
                {genre.imageUrl ? (
                  <img src={getFileUrl(genre.imageUrl)} alt={genre.name} className="w-full h-full object-cover" />
                ) : (
                  <FaMusic className="text-neutral-600 text-2xl" />
                )}
              </div>
              <h3 className="text-white text-sm font-medium truncate">{genre.name}</h3>
              {genre.description && <p className="text-neutral-400 text-xs truncate">{genre.description}</p>}
              <button
                onClick={() => handleDelete(genre.id)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                title="Delete genre"
              >
                <FaTrash size={11} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GenreManager;