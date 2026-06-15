import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-xl w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-green-500 mb-2">Forgot password</h1>
        <p className="text-neutral-400 text-sm mb-6">
          Password reset via email isn't set up yet. This will be added in a later step
          once email delivery is configured on the backend.
        </p>
        <Link to="/login" className="text-green-400 hover:underline text-sm">
          Back to login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;