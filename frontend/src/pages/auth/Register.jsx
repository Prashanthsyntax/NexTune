import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../../api/authApi';
import useAuthStore from '../../store/authStore';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Minimum 3 characters';

    if (!formData.email) newErrors.email = 'Email is required';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

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
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = formData;
      const res = await registerUser(payload);
      login(res.data.data);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
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
        <p className="text-neutral-400 text-center mb-6">Create your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username"
            name="username"
            placeholder="yourname"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />
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
          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button type="submit" loading={loading}>
            Sign Up
          </Button>
        </form>

        <p className="text-center text-neutral-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;