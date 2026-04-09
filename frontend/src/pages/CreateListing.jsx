import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    cuisine_type: 'other',
    prep_time: '',
    servings: 1,
    dietary_tags: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('getting');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cuisineOptions = [
    { value: 'american', label: 'American' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'italian', label: 'Italian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'indian', label: 'Indian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'other', label: 'Other' },
  ];

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationStatus('success');
        },
        (error) => {
          setLocationStatus('denied');
        }
      );
    } else {
      setLocationStatus('unavailable');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDietaryToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      dietary_tags: prev.dietary_tags.includes(tag)
        ? prev.dietary_tags.filter(t => t !== tag)
        : [...prev.dietary_tags, tag]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('cuisine_type', formData.cuisine_type);
      data.append('prep_time', formData.prep_time);
      data.append('servings', formData.servings);
      data.append('available', true);
      data.append('dietary_tags', JSON.stringify(formData.dietary_tags));
      
     if (location) {
        data.append('latitude', location.lat.toFixed(6));
        data.append('longitude', location.lng.toFixed(6));
      }
      
      if (image) {
        data.append('image', image);
      }

      await api.post('/listings/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/listings');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not a cook
  if (!user?.is_cook) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-4">Become a Cook First</h2>
          <p className="text-gray-600 mb-4">You need to register as a cook to create listings.</p>
          <button
            onClick={async () => {
              try {
                await api.post('/auth/become-cook/');
                window.location.reload();
              } catch (err) {
                setError('Failed to become a cook');
              }
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Become a Cook
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        {/* Location Status */}
        <div className="mb-4">
          {locationStatus === 'getting' && (
            <div className="bg-blue-100 text-blue-700 p-3 rounded">
              📍 Getting your location...
            </div>
          )}
          {locationStatus === 'success' && (
            <div className="bg-green-100 text-green-700 p-3 rounded">
              ✓ Location set - neighbors will be able to find your dish!
            </div>
          )}
          {locationStatus === 'denied' && (
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded">
              ⚠️ Location access denied. Your dish won't appear in nearby searches.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Dish Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g. Homemade Tacos"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              placeholder="Describe your dish, ingredients, what makes it special..."
              required
            />
          </div>

          {/* Price and Prep Time */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="0"
                step="0.01"
                placeholder="12.99"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Prep Time (mins)</label>
              <input
                type="number"
                name="prep_time"
                value={formData.prep_time}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="1"
                placeholder="30"
                required
              />
            </div>
          </div>

          {/* Cuisine and Servings */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Cuisine Type</label>
              <select
                name="cuisine_type"
                value={formData.cuisine_type}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {cuisineOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                min="1"
                required
              />
            </div>
          </div>

          {/* Dietary Tags */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleDietaryToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.dietary_tags.includes(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-48 object-cover rounded"
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 disabled:bg-orange-300"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateListing;