import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Kitchen Share
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Homemade food from your neighbors
        </p>

        {user ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-lg mb-4">Welcome back, <strong>{user.username}</strong>!</p>
            <p className="text-gray-600 mb-4">
              {user.is_cook ? "You're registered as a cook" : "You're browsing as a buyer"}
            </p>
            <Link
              to="/listings"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Browse Listings
            </Link>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;