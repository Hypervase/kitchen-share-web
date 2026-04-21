import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../api/axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const { register, setUser } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  if (password !== passwordConfirm) {
    setError('Passwords do not match');
    return;
  }
  
  try {
    await register(username, email, password, passwordConfirm);
    
    // Check if there's a redirect path stored
    const redirectPath = sessionStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } else {
      navigate('/');
    }
  } catch (err) {
    setError(err.response?.data?.detail || 'Registration failed');
  }
};

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api.post('/auth/google/', {
        token: credentialResponse.credential,
      });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError('Google sign up failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Google Sign Up Button */}
        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google sign up failed')}
            width="100%"
            text="signup_with"
          />
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Register;