import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../../api/authApi';
import useAuthStore from '../../store/authStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data.data);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message);

      const data = err.response?.data?.data;
      if (data && typeof data === 'object') {
        setErrors(data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm">
        <h1 className="text-3xl font-bold text-green-500 mb-1 text-center">NexTune</h1>
        <p className="text-neutral-400 text-center mb-6">Log in to continue</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="text-right -mt-2">
            <Link to="/forgot-password" className="text-xs text-neutral-400 hover:text-green-400">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={loading}>
            Log In
          </Button>
        </form>

        <p className="text-center text-neutral-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;