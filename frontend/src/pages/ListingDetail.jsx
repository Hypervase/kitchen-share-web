import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Order state
  const [showOrderPanel, setShowOrderPanel] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listings/${id}/`);
      setListing(response.data);
      
      // Initialize required options
      const initialOptions = {};
      (response.data.customization_options || []).forEach(opt => {
        if (opt.required && opt.options.length > 0) {
          initialOptions[opt.name] = opt.options[0];
        }
      });
      setSelectedOptions(initialOptions);
    } catch (err) {
      setError('Listing not found');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!listing) return 0;
    
    let total = parseFloat(listing.price) * quantity;
    
    // Add option prices
    Object.values(selectedOptions).forEach(option => {
      if (option?.price) total += option.price * quantity;
    });
    
    // Add add-on prices
    selectedAddOns.forEach(addon => {
      total += addon.price * quantity;
    });
    
    return total.toFixed(2);
  };

  const handleOptionSelect = (optionName, choice) => {
    setSelectedOptions({ ...selectedOptions, [optionName]: choice });
  };

  const handleAddOnToggle = (addon) => {
    if (selectedAddOns.find(a => a.name === addon.name)) {
      setSelectedAddOns(selectedAddOns.filter(a => a.name !== addon.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleOrder = async () => {
    if (!pickupTime) {
      setError('Please select a pickup time');
      return;
    }

    setOrdering(true);
    setError('');

    try {
      await api.post('/orders/', {
        listing: id,
        quantity,
        pickup_time: pickupTime,
        notes,
        selected_options: selectedOptions,
        selected_add_ons: selectedAddOns,
      });
      
      setOrderSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="text-6xl animate-bounce">🍽️</div>
      </div>
    );
  }

  if (error && !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-500">{error}</p>
          <Link to="/" className="btn-primary mt-4">Back to Browse</Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === listing.cook;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-8 text-center max-w-md animate-fadeInUp">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--color-dark)' }}>
              Order Placed!
            </h2>
            <p style={{ color: 'var(--color-gray-600)' }}>
              Redirecting to your orders...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="card overflow-hidden">
              {listing.image ? (
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                  <span className="text-8xl">🍽️</span>
                </div>
              )}
            </div>

            {/* Title & Cook */}
            <div className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--color-dark)' }}>
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      {listing.cook_image ? (
                        <img src={listing.cook_image} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>👨‍🍳</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium" style={{ color: 'var(--color-dark)' }}>{listing.cook_name}</p>
                      <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>Home Cook</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl" style={{ color: 'var(--color-primary)' }}>
                    ${listing.price}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
                    {listing.servings} serving{listing.servings > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <p className="mb-4" style={{ color: 'var(--color-gray-700)' }}>
                {listing.description}
              </p>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-3">
                <span className="badge" style={{ backgroundColor: 'var(--color-cream)' }}>
                  ⏱️ {listing.prep_time} min
                </span>
                <span className="badge" style={{ backgroundColor: 'var(--color-cream)' }}>
                  🍽️ {listing.cuisine_type}
                </span>
                {listing.spice_level && (
                  <span className="badge" style={{ backgroundColor: 'var(--color-cream)' }}>
                    {listing.spice_level === 'none' && '🌱 Not Spicy'}
                    {listing.spice_level === 'mild' && '🌶️ Mild'}
                    {listing.spice_level === 'medium' && '🌶️🌶️ Medium'}
                    {listing.spice_level === 'hot' && '🌶️🌶️🌶️ Hot'}
                    {listing.spice_level === 'extra_hot' && '🔥 Extra Hot'}
                  </span>
                )}
                {listing.calories && (
                  <span className="badge" style={{ backgroundColor: 'var(--color-cream)' }}>
                    🔥 {listing.calories} cal
                  </span>
                )}
              </div>
            </div>

            {/* Dietary & Allergens */}
            {(listing.dietary_tags?.length > 0 || listing.allergens?.length > 0) && (
              <div className="card p-6">
                {listing.dietary_tags?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>Dietary</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.dietary_tags.map(tag => (
                        <span key={tag} className="badge badge-success">✓ {tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {listing.allergens?.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>Allergen Warning</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.allergens.map(allergen => (
                        <span key={allergen} className="badge bg-red-100 text-red-700">⚠️ {allergen}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ingredients */}
            {listing.ingredients && (
              <div className="card p-6">
                <h3 className="font-display text-xl mb-3" style={{ color: 'var(--color-dark)' }}>
                  Ingredients
                </h3>
                <p style={{ color: 'var(--color-gray-700)' }}>{listing.ingredients}</p>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="card p-6">
                <p className="mb-4" style={{ color: 'var(--color-gray-600)' }}>This is your listing</p>
                <Link to={`/edit-listing/${id}`} className="btn-secondary">
                  Edit Listing
                </Link>
              </div>
            )}
          </div>

          {/* Order Panel */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {user && !isOwner ? (
                <>
                  <h3 className="font-display text-xl mb-4" style={{ color: 'var(--color-dark)' }}>
                    Your Order
                  </h3>

                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</div>
                  )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl"
                      >
                        −
                      </button>
                      <span className="text-2xl font-bold" style={{ color: 'var(--color-dark)' }}>{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Customization Options */}
                  {listing.customization_options?.length > 0 && (
                    <div className="mb-6 space-y-4">
                      {listing.customization_options.map((option, idx) => (
                        <div key={idx}>
                          <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                            {option.name} {option.required && <span className="text-red-500">*</span>}
                          </label>
                          <div className="space-y-2">
                            {option.options.map((choice, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={() => handleOptionSelect(option.name, choice)}
                                className={`w-full p-3 rounded-xl text-left flex justify-between items-center transition-all ${
                                  selectedOptions[option.name]?.label === choice.label
                                    ? 'bg-orange-100 border-2 border-orange-500'
                                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                }`}
                              >
                                <span>{choice.label}</span>
                                {choice.price > 0 && (
                                  <span style={{ color: 'var(--color-gray-500)' }}>+${choice.price.toFixed(2)}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add-ons */}
                  {listing.add_ons?.length > 0 && (
                    <div className="mb-6">
                      <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                        Add-ons
                      </label>
                      <div className="space-y-2">
                        {listing.add_ons.map((addon, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddOnToggle(addon)}
                            className={`w-full p-3 rounded-xl text-left flex justify-between items-center transition-all ${
                              selectedAddOns.find(a => a.name === addon.name)
                                ? 'bg-orange-100 border-2 border-orange-500'
                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                            }`}
                          >
                            <span>{addon.name}</span>
                            <span style={{ color: 'var(--color-gray-500)' }}>+${addon.price.toFixed(2)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pickup Time */}
                  <div className="mb-6">
                    <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                      Pickup Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="input"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                      Special Instructions
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="input"
                      rows={2}
                      placeholder="Any allergies or special requests?"
                    />
                  </div>

                  {/* Total & Order Button */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium" style={{ color: 'var(--color-gray-700)' }}>Total</span>
                      <span className="font-display text-2xl" style={{ color: 'var(--color-primary)' }}>
                        ${calculateTotal()}
                      </span>
                    </div>
                    <button
                      onClick={handleOrder}
                      disabled={ordering}
                      className="btn-primary w-full text-lg py-4"
                    >
                      {ordering ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </>
              ) : !user ? (
                <div className="text-center py-4">
                  <p className="mb-4" style={{ color: 'var(--color-gray-600)' }}>Login to order this dish</p>
                  <Link to="/login" className="btn-primary w-full">Login</Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p style={{ color: 'var(--color-gray-600)' }}>This is your listing</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;