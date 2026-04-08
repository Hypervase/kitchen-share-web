import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function EditListing() {
  const { id } = useParams();
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
    available: true,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}/`);
        const listing = response.data;
        
        // Check if user owns this listing
        if (listing.cook !== user?.id) {
          navigate('/listings');
          return;
        }

        setFormData({
          title: listing.title,
          description: listing.description,
          price: listing.price,
          cuisine_type: listing.cuisine_type,
          prep_time: listing.prep_time,
          servings: listing.servings,
          dietary_tags: listing.dietary_tags || [],
          available: listing.available,
        });
        
        if (listing.image) {
          setImagePreview(listing.image);
        }
      } catch (err) {
        setError('Listing not found');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
    setSaving(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('cuisine_type', formData.cuisine_type);
      data.append('prep_time', formData.prep_time);
      data.append('servings', formData.servings);
      data.append('available', formData.available);
      data.append('dietary_tags', JSON.stringify(formData.dietary_tags));
      if (image) {
        data.append('image', image);
      }

      await api.patch(`/listings/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await api.delete(`/listings/${id}/`);
      navigate('/listings');
    } catch (err) {
      setError('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Edit Listing</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

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

          {/* Available Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="available"
                checked={formData.available}
                onChange={handleChange}
                className="w-5 h-5 text-orange-500"
              />
              <span className="text-gray-700 font-medium">Available for orders</span>
            </label>
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
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mb-2 w-full h-48 object-cover rounded"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
            >
              Delete Listing
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 disabled:bg-orange-300"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditListing;