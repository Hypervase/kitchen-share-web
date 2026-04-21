import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CookSetup() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    bio: '',
    years_experience: 0,
    cuisine_specialties: [],
    signature_dishes: '',
    kitchen_description: '',
    food_safety_certified: false,
    certified_details: '',
    accepted_payments: [],
    payment_notes: '',
    available_days: [],
    pickup_instructions: '',
  });

  const cuisineOptions = [
    { value: 'american', label: '🍔 American' },
    { value: 'mexican', label: '🌮 Mexican' },
    { value: 'italian', label: '🍝 Italian' },
    { value: 'chinese', label: '🥡 Chinese' },
    { value: 'indian', label: '🍛 Indian' },
    { value: 'japanese', label: '🍱 Japanese' },
    { value: 'mediterranean', label: '🥙 Mediterranean' },
    { value: 'caribbean', label: '🥥 Caribbean' },
    { value: 'korean', label: '🍜 Korean' },
    { value: 'thai', label: '🍲 Thai' },
    { value: 'vietnamese', label: '🍜 Vietnamese' },
    { value: 'middle_eastern', label: '🧆 Middle Eastern' },
    { value: 'african', label: '🍖 African' },
    { value: 'french', label: '🥐 French' },
    { value: 'other', label: '🍽️ Other' },
  ];

  const paymentOptions = [
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'venmo', label: 'Venmo', icon: '📱' },
    { value: 'zelle', label: 'Zelle', icon: '📱' },
    { value: 'paypal', label: 'PayPal', icon: '💳' },
    { value: 'cashapp', label: 'Cash App', icon: '📱' },
    { value: 'apple_pay', label: 'Apple Pay', icon: '🍎' },
    { value: 'card', label: 'Card (Square/Stripe)', icon: '💳' },
  ];

  const dayOptions = [
    { value: 'monday', label: 'Mon' },
    { value: 'tuesday', label: 'Tue' },
    { value: 'wednesday', label: 'Wed' },
    { value: 'thursday', label: 'Thu' },
    { value: 'friday', label: 'Fri' },
    { value: 'saturday', label: 'Sat' },
    { value: 'sunday', label: 'Sun' },
  ];

  useEffect(() => {
    // If already a cook, redirect to profile
    if (user?.is_cook) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async () => {
    if (formData.accepted_payments.length === 0) {
      setError('Please select at least one payment method');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      // Step 1: Become a cook
      await api.post('/auth/become-cook/');
      
      // Step 2: Save cook profile
      await api.patch('/auth/cook-profile/', formData);
      
      // Step 3: Refresh user data
      const userResponse = await api.get('/auth/me/');
      setUser(userResponse.data);
      
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to complete setup');
    } finally {
      setSaving(false);
    }
  };

  // Not logged in - show login prompt
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="card p-8 max-w-md text-center">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h1 className="font-display text-2xl mb-4" style={{ color: 'var(--color-dark)' }}>
            Become a Cook
          </h1>
          <p className="mb-6" style={{ color: 'var(--color-gray-600)' }}>
            Share your homemade dishes with your neighbors! Create an account or log in to get started.
          </p>
         <div className="flex flex-col gap-3">
                    <Link 
                        to="/register" 
                        className="btn-primary w-full"
                        onClick={() => sessionStorage.setItem('redirectAfterLogin', '/cook-setup')}
                    >
                        Create Account
                    </Link>
                    <Link 
                        to="/login" 
                        className="btn-secondary w-full"
                        onClick={() => sessionStorage.setItem('redirectAfterLogin', '/cook-setup')}
                    >
                        Log In
                    </Link>
            </div>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-gray-500)' }}>
            Already have an account? You'll be redirected back here after logging in.
          </p>
        </div>
      </div>
    );
  }

  // Already a cook
  if (user.is_cook) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--color-dark)' }}>
            Become a Cook
          </h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            Hey {user.username}! Let's set up your cook profile
          </p>
        </div>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                step >= s ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Step 1: About You */}
        {step === 1 && (
          <div className="card p-6 space-y-6">
            <h2 className="font-display text-xl" style={{ color: 'var(--color-dark)' }}>
              Step 1: Tell us about yourself
            </h2>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                Your Bio *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input"
                rows={4}
                placeholder="Hi! I'm a home cook who loves making authentic Mexican food using my grandmother's recipes..."
              />
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                Years of Cooking Experience
              </label>
              <input
                type="number"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                className="input w-32"
                min="0"
              />
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                Cuisine Specialties (select all that apply) *
              </label>
              <div className="flex flex-wrap gap-2">
                {cuisineOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleToggle('cuisine_specialties', opt.value)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      formData.cuisine_specialties.includes(opt.value)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                Signature Dishes
              </label>
              <textarea
                value={formData.signature_dishes}
                onChange={(e) => setFormData({ ...formData, signature_dishes: e.target.value })}
                className="input"
                rows={2}
                placeholder="What are you most famous for? e.g. Birria tacos, Homemade pasta..."
              />
            </div>

            <button 
              onClick={() => setStep(2)} 
              disabled={!formData.bio || formData.cuisine_specialties.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Kitchen Info */}
        {step === 2 && (
          <div className="card p-6 space-y-6">
            <h2 className="font-display text-xl" style={{ color: 'var(--color-dark)' }}>
              Step 2: Your Kitchen
            </h2>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                Kitchen Description
              </label>
              <textarea
                value={formData.kitchen_description}
                onChange={(e) => setFormData({ ...formData, kitchen_description: e.target.value })}
                className="input"
                rows={3}
                placeholder="Tell customers about your kitchen setup, cleanliness standards..."
              />
            </div>

            <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--color-cream)' }}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.food_safety_certified}
                  onChange={(e) => setFormData({ ...formData, food_safety_certified: e.target.checked })}
                  className="w-5 h-5 rounded"
                />
                <div>
                  <span className="font-medium" style={{ color: 'var(--color-dark)' }}>
                    Food Safety Certified
                  </span>
                  <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
                    Do you have a food handler's certificate?
                  </p>
                </div>
              </label>

              {formData.food_safety_certified && (
                <input
                  type="text"
                  value={formData.certified_details}
                  onChange={(e) => setFormData({ ...formData, certified_details: e.target.value })}
                  className="input mt-3"
                  placeholder="Certificate details (e.g. ServSafe, state, expiration)"
                />
              )}
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Methods */}
        {step === 3 && (
          <div className="card p-6 space-y-6">
            <h2 className="font-display text-xl" style={{ color: 'var(--color-dark)' }}>
              Step 3: Payment Methods
            </h2>
            <p style={{ color: 'var(--color-gray-600)' }}>
              Let customers know how they can pay you
            </p>

            <div>
              <label className="block font-medium mb-3" style={{ color: 'var(--color-gray-700)' }}>
                Accepted Payment Methods *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleToggle('accepted_payments', opt.value)}
                    className={`p-4 rounded-xl text-left flex items-center gap-3 transition-all border-2 ${
                      formData.accepted_payments.includes(opt.value)
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="font-medium" style={{ color: 'var(--color-dark)' }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                Payment Details
              </label>
              <input
                type="text"
                value={formData.payment_notes}
                onChange={(e) => setFormData({ ...formData, payment_notes: e.target.value })}
                className="input"
                placeholder="e.g. Venmo: @yourname, Zelle: phone number"
              />
              <p className="text-sm mt-1" style={{ color: 'var(--color-gray-500)' }}>
                This will be shown to customers on your listings
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button 
                onClick={() => setStep(4)} 
                disabled={formData.accepted_payments.length === 0}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Availability & Pickup */}
        {step === 4 && (
          <div className="card p-6 space-y-6">
            <h2 className="font-display text-xl" style={{ color: 'var(--color-dark)' }}>
              Step 4: Availability & Pickup
            </h2>

            <div>
              <label className="block font-medium mb-3" style={{ color: 'var(--color-gray-700)' }}>
                Available Days
              </label>
              <div className="flex gap-2">
                {dayOptions.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleToggle('available_days', day.value)}
                    className={`w-12 h-12 rounded-xl font-medium transition-all ${
                      formData.available_days.includes(day.value)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-2" style={{ color: 'var(--color-gray-700)' }}>
                Pickup Instructions
              </label>
              <textarea
                value={formData.pickup_instructions}
                onChange={(e) => setFormData({ ...formData, pickup_instructions: e.target.value })}
                className="input"
                rows={3}
                placeholder="e.g. Ring doorbell when you arrive. I'll bring the food out. Located in the blue house with white fence."
              />
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="btn-secondary flex-1">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? 'Setting up...' : 'Complete Setup 🎉'}
              </button>
            </div>
          </div>
        )}

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link to="/" className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
            ← Back to browsing
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CookSetup;