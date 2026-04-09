import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Home() {
  const { user } = useAuth();
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/listings/?limit=3');
        setFeaturedListings((response.data.results || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to fetch featured listings');
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 text-8xl">🥘</div>
          <div className="absolute top-40 right-20 text-7xl">🍲</div>
          <div className="absolute bottom-20 left-1/4 text-6xl">🥗</div>
          <div className="absolute bottom-40 right-1/3 text-8xl">🍜</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <h1 
              className="font-display text-5xl md:text-7xl leading-tight mb-6"
              style={{ color: 'var(--color-dark)' }}
            >
              Homemade food from your{' '}
              <span style={{ color: 'var(--color-primary)' }}>neighbors</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10" style={{ color: 'var(--color-gray-700)' }}>
              Discover delicious home-cooked meals made with love by people in your community. 
              Fresh, local, and just around the corner.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/listings" className="btn-primary text-lg">
                <span>Browse Dishes</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              {!user && (
                <Link to="/register" className="btn-secondary text-lg">
                  Start Cooking
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-white)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-16" style={{ color: 'var(--color-dark)' }}>
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: '🔍',
                title: 'Discover',
                description: 'Browse homemade dishes from cooks in your neighborhood. Filter by cuisine, distance, and dietary needs.'
              },
              {
                icon: '📱',
                title: 'Order',
                description: 'Place your order with just a few taps. Choose your pickup time and add any special requests.'
              },
              {
                icon: '🥡',
                title: 'Enjoy',
                description: 'Pick up your fresh, homemade meal from your neighbor. Enjoy restaurant-quality food made with care.'
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="text-center p-8 rounded-2xl transition-all hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-cream)' }}
              >
                <div className="text-6xl mb-6">{step.icon}</div>
                <h3 className="font-display text-2xl mb-4" style={{ color: 'var(--color-dark)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--color-gray-600)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="py-20" style={{ backgroundColor: 'var(--color-cream)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-display text-4xl md:text-5xl mb-2" style={{ color: 'var(--color-dark)' }}>
                  Fresh from the kitchen
                </h2>
                <p style={{ color: 'var(--color-gray-600)' }}>
                  Discover what your neighbors are cooking today
                </p>
              </div>
              <Link 
                to="/listings" 
                className="hidden md:flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                style={{ color: 'var(--color-primary)' }}
              >
                View all
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredListings.map((listing, index) => (
                <Link
                  key={listing.id}
                  to={`/listings/${listing.id}`}
                  className="card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    {listing.image ? (
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <span className="badge badge-primary">
                        ${listing.price}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl mb-2" style={{ color: 'var(--color-dark)' }}>
                      {listing.title}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-gray-600)' }}>
                      {listing.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-sm">👨‍🍳</span>
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-gray-700)' }}>
                          {listing.cook_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--color-gray-500)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {listing.prep_time} min
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="md:hidden mt-8 text-center">
              <Link to="/listings" className="btn-primary">
                View all dishes
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
            Share your cooking with the neighborhood
          </h2>
          <p className="text-xl text-orange-100 mb-10">
            Turn your passion for cooking into a way to connect with your community. 
            Set your own prices, hours, and menu.
          </p>
          {user ? (
            user.is_cook ? (
              <Link to="/create-listing" className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all">
                Create a listing
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={async () => {
                  try {
                    await api.post('/auth/become-cook/');
                    window.location.reload();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all"
              >
                Become a cook
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            )
          ) : (
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all">
              Get started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: 'var(--color-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                <span className="text-white text-xl">🍳</span>
              </div>
              <span className="font-display text-2xl text-white">
                Kitchen<span style={{ color: 'var(--color-primary)' }}>Share</span>
              </span>
            </div>
            <div className="flex gap-8 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 Kitchen Share. Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;