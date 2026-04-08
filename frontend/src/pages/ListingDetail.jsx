import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}/`);
        setListing(response.data);
      } catch (err) {
        setError('Listing not found');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    setError('');
    setOrdering(true);

    try {
      await api.post('/orders/', {
        listing: id,
        quantity,
        pickup_time: pickupTime,
        notes,
      });
      setSuccess('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const isOwner = user?.id === listing.cook;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {listing.image && (
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-64 object-cover"
            />
          )}
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <p className="text-gray-600">By {listing.cook_name}</p>
              </div>
              <p className="text-3xl font-bold text-orange-500">${listing.price}</p>
            </div>

            <p className="text-gray-700 mb-4">{listing.description}</p>

            <div className="flex gap-4 mb-4 text-sm text-gray-600">
              <span className="bg-gray-100 px-3 py-1 rounded">{listing.cuisine_type}</span>
              <span className="bg-gray-100 px-3 py-1 rounded">{listing.prep_time} mins</span>
              <span className="bg-gray-100 px-3 py-1 rounded">{listing.servings} servings</span>
            </div>

            {listing.dietary_tags && listing.dietary_tags.length > 0 && (
              <div className="flex gap-2 mb-6">
                {listing.dietary_tags.map(tag => (
                  <span key={tag} className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="border-t pt-4 mt-4">
                <p className="text-gray-600 mb-2">This is your listing</p>
                <button
                  onClick={() => navigate(`/edit-listing/${id}`)}
                  className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Edit Listing
                </button>
              </div>
            )}

            {/* Order Form */}
            {user && !isOwner && (
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Place Order</h2>

                {success && (
                  <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>
                )}
                {error && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
                )}

                <form onSubmit={handleOrder}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Quantity</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        min="1"
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Pickup Time</label>
                      <input
                        type="datetime-local"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Special Instructions (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows={3}
                      placeholder="Any allergies or special requests?"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">
                      Total: ${(listing.price * quantity).toFixed(2)}
                    </p>
                    <button
                      type="submit"
                      disabled={ordering}
                      className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 disabled:bg-orange-300"
                    >
                      {ordering ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Not logged in */}
            {!user && (
              <div className="border-t pt-6 mt-6 text-center">
                <p className="text-gray-600 mb-4">Login to order this dish</p>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;