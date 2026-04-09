import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ListingsMap from '../components/common/ListingsMap';

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchListings();
    }
  }, [userLocation, maxDistance]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Location access denied. Showing all listings.');
          fetchListings();
        }
      );
    } else {
      setLocationError('Geolocation not supported. Showing all listings.');
      fetchListings();
    }
  };

  const fetchListings = async () => {
    try {
      let url = '/listings/';
      if (userLocation) {
        url += `?lat=${userLocation.lat}&lng=${userLocation.lng}&distance=${maxDistance}`;
      }
      const response = await api.get(url);
      setListings(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-2">Finding dishes near you...</p>
          <p className="text-gray-500 text-sm">Please allow location access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Dishes Near You</h1>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-300'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'map' ? 'bg-white shadow' : 'hover:bg-gray-300'
                }`}
              >
                Map
              </button>
            </div>

            {/* Distance Filter */}
            {userLocation && (
              <div className="flex items-center gap-2">
                <label className="text-gray-600">Within:</label>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={1}>1 mile</option>
                  <option value={5}>5 miles</option>
                  <option value={10}>10 miles</option>
                  <option value={25}>25 miles</option>
                  <option value={50}>50 miles</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {locationError && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
            {locationError}
          </div>
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="mb-6">
            <ListingsMap listings={listings} userLocation={userLocation} />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {listings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">No dishes available nearby.</p>
                <p className="text-gray-500 mt-2">Try increasing the distance or check back later!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <Link
                    key={listing.id}
                    to={`/listings/${listing.id}`}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {listing.image ? (
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-orange-500 font-bold">${listing.price}</p>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{listing.prep_time} mins</p>
                          {listing.distance !== null && (
                            <p className="text-sm text-green-600 font-medium">{listing.distance} mi away</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">By {listing.cook_name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Listings;