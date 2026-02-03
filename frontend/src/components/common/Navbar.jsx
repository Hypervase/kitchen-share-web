import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-orange-500">
            Kitchen Share
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/listings" className="text-gray-700 hover:text-orange-500">
              Browse
            </Link>

            {user ? (
              <>
                {user.is_cook && (
                  <Link to="/my-listings" className="text-gray-700 hover:text-orange-500">
                    My Listings
                  </Link>
                )}
                <Link to="/orders" className="text-gray-700 hover:text-orange-500">
                  Orders
                </Link>
                <span className="text-gray-600">Hi, {user.username}</span>
                <button
                  onClick={logout}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-orange-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;