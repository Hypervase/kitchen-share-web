import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function CookProfile() {
  const { id } = useParams();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCook = async () => {
      try {
        const response = await api.get(`/auth/cook/${id}/`);
        setCook(response.data);
      } catch (err) {
        setError('Cook not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="text-6xl animate-bounce">👨‍🍳</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
      {/* Cook Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-6">
            {cook.profile_image ? (
              <img src={cook.profile_image} alt={cook.username} className="w-24 h-24 rounded-2xl object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl" style={{ backgroundColor: 'var(--color-primary)' }}>
                👨‍🍳
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-3xl" style={{ color: 'var(--color-dark)' }}>
                  {cook.first_name && cook.last_name ? `${cook.first_name} ${cook.last_name}` : cook.username}
                </h1>
                {cook.is_verified && <span className="badge badge-primary">✓ Verified</span>}
              </div>
              <p className="mb-2" style={{ color: 'var(--color-gray-500)' }}>@{cook.username}</p>
              {cook.rating > 0 && (
                <p className="text-lg">
                  {'⭐'.repeat(Math.round(cook.rating))}
                  <span className="ml-2 text-sm" style={{ color: 'var(--color-gray-500)' }}>
                    {cook.rating}/5 ({cook.total_reviews} reviews)
                  </span>
                </p>
              )}
            </div>
          </div>

          {cook.bio && (
            <p className="mt-4 italic" style={{ color: 'var(--color-gray-600)' }}>"{cook.bio}"</p>
          )}
          {cook.kitchen_description && (
            <p className="mt-2 text-sm" style={{ color: 'var(--color-gray-500)' }}>{cook.kitchen_description}</p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Listings */}
        <section>
          <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--color-dark)' }}>
            🍽️ Dishes
          </h2>
          {cook.listings.length === 0 ? (
            <p style={{ color: 'var(--color-gray-500)' }}>No active dishes right now.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {cook.listings.map(listing => (
                <Link
                  key={listing.id}
                  to={`/listings/${listing.id}`}
                  className="card p-4 flex gap-4 hover:shadow-lg transition-shadow"
                >
                  {listing.image ? (
                    <img src={listing.image} alt={listing.title} className="w-20 h-20 rounded-xl object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-orange-50 flex items-center justify-center text-2xl">🍽️</div>
                  )}
                  <div>
                    <h3 className="font-display text-lg" style={{ color: 'var(--color-dark)' }}>{listing.title}</h3>
                    <p className="font-bold" style={{ color: 'var(--color-primary)' }}>${listing.price}</p>
                    <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>⏱️ {listing.prep_time} min</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Reviews */}
        <section>
          <h2 className="font-display text-2xl mb-4" style={{ color: 'var(--color-dark)' }}>
            ⭐ Reviews ({cook.total_reviews})
          </h2>
          {cook.reviews.length === 0 ? (
            <p style={{ color: 'var(--color-gray-500)' }}>No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {cook.reviews.map(review => (
                <div key={review.id} className="card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: 'var(--color-dark)' }}>
                        {review.reviewer_name}
                      </span>
                      <span className="text-lg">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--color-gray-400)' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="italic" style={{ color: 'var(--color-gray-600)' }}>"{review.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CookProfile;