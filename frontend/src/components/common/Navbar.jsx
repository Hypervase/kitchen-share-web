import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout, becomeCook } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBecomeCook = async () => {
    try {
      await becomeCook();
    } catch (err) {
      console.error('Failed to become cook:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="text-white text-xl">🍳</span>
            </div>
            <div>
              <span className="font-display text-2xl" style={{ color: 'var(--color-dark)' }}>
                Kitchen
              </span>
              <span className="font-display text-2xl" style={{ color: 'var(--color-primary)' }}>
                Share
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/listings"
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                isActive('/listings')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Browse
            </Link>

            {user ? (
              <>
                {user.is_cook ? (
                  <Link
                    to="/create-listing"
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      isActive('/create-listing')
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Add Dish
                  </Link>
                ) : (
                  <button
                    onClick={handleBecomeCook}
                    className="px-4 py-2 rounded-full font-medium text-orange-600 hover:bg-orange-50 transition-all"
                  >
                    Become a Cook
                  </button>
                )}
                <Link
                  to="/orders"
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    isActive('/orders')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Orders
                </Link>
                
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-semibold text-sm">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-700">{user.username}</span>
                </div>
                
                <button
                  onClick={logout}
                  className="ml-2 px-4 py-2 rounded-full font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-2">
              <Link to="/listings" className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium">
                Browse
              </Link>
              {user ? (
                <>
                  {user.is_cook && (
                    <Link to="/create-listing" className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium">
                      Add Dish
                    </Link>
                  )}
                  <Link to="/orders" className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium">
                    Orders
                  </Link>
                  <button onClick={logout} className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-left text-gray-500">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-3 rounded-xl bg-orange-500 text-white font-medium text-center">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;