import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Navbar() {
  const { user, logout, becomeCook } = useAuth();

  const handleBecomeCook = async () => {
    try {
      await becomeCook();
    } catch (err) {
      console.error('Failed to become cook:', err);
    }
  };

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
                {user.is_cook ? (
                  <Link to="/create-listing" className="text-gray-700 hover:text-orange-500">
                    Add Dish
                  </Link>
                ) : (
                  <button
                    onClick={handleBecomeCook}
                    className="text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Become a Cook
                  </button>
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