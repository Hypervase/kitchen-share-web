import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ListingsMap from '../components/common/ListingsMap';

function Listings() {
  const[search, setSearch] = useState('');
  const[cuisine, setCuisine] = useState('');  
  const[minPrice, setMinPrice] = useState('');  
  const[maxPrice, setMaxPrice] = useState(''); 

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [viewMode, setViewMode] = useState('split');
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('all');
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  const cuisineOptions = [
    { value: 'all', label: 'All Cuisines' },
    { value: 'american', label: 'American' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'italian', label: 'Italian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'indian', label: 'Indian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'other', label: 'Other' },
  ];

  const dietaryOptions = [
    { value: '', label: 'Any Dietary' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Gluten-Free', label: 'Gluten-Free' },
    { value: 'Dairy-Free', label: 'Dairy-Free' },
    { value: 'Halal', label: 'Halal' },
    { value: 'Kosher', label: 'Kosher' },
  ];

  useEffect(() => {
    getUserLocation();
  }, []);

 useEffect(() => {
    if (userLocation || locationError) {
      fetchListings();
    }
<<<<<<< HEAD
  }, [userLocation, maxDistance, search, cuisine, minPrice, maxPrice]);
=======
  }, [userLocation, locationError, maxDistance, cuisine, selectedDietary]);
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userLocation || locationError) {
        fetchListings();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);
>>>>>>> upstream/main

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
        }
      );
    } else {
      setLocationError('Geolocation not supported. Showing all listings.');
    }
  };

  const fetchListings = async () => {
    try {
<<<<<<< HEAD
      let url = '/listings/?';
        if (userLocation) 
        {
          url += `lat=${userLocation.lat}&lng=${userLocation.lng}&distance=${maxDistance}&`;
        }
        if(search) url+= `search=${search}&`;
        if(cuisine) url+= `cuisine=${cuisine}&`;
        if(minPrice) url+= `min_price=${minPrice}&`;
        if(maxPrice) url+= `max_price=${maxPrice}&`;
      
      const response = await api.get(url);
=======
      let params = new URLSearchParams();
      
      if (userLocation) {
        params.append('lat', userLocation.lat);
        params.append('lng', userLocation.lng);
        params.append('distance', maxDistance);
      }
      if (search) params.append('search', search);
      if (cuisine && cuisine !== 'all') params.append('cuisine', cuisine);
      if (selectedDietary.length > 0) {
        selectedDietary.forEach(d => params.append('dietary', d));
      }
      
      const response = await api.get(`/listings/?${params.toString()}`);
>>>>>>> upstream/main
      setListings(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setCuisine('all');
    setSelectedDietary([]);
    setMaxDistance(10);
  };

  const hasActiveFilters = search || cuisine !== 'all' || selectedDietary.length > 0 || maxDistance !== 10;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🍳</div>
          <p className="text-lg font-medium" style={{ color: 'var(--color-dark)' }}>Finding dishes near you...</p>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {/* Cuisine Filter */}
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Cuisines</option>
              <option value="italian">Italian</option>
              <option value="mexican">Mexican</option>
              <option value="indian">Indian</option>
            </select>

            {/*Price Range Filter*/}
            <input 
              type = "number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input 
              type = "number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {/* Distance Filter */}
            {userLocation && (
              <div className="flex items-center gap-2">
                <label className="text-gray-600">Within:</label>
                <select
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
=======
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
{/* Header */}
      <div className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="🔍 Search for tacos, pasta, curry..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 flex items-center justify-center text-sm"
>>>>>>> upstream/main
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>⚙️</span>
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              )}
            </button>
          </div>

          {/* Filter Row */}
          {showFilters && (
            <div className="pb-4 space-y-4 animate-fadeInUp">
              {/* Cuisine Chips */}
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>Cuisine</p>
                <div className="flex flex-wrap gap-2">
                  {cuisineOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setCuisine(cuisine === opt.value ? 'all' : opt.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        cuisine === opt.value
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Chips - Multi-select */}
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>Dietary</p>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.filter(opt => opt.value).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (selectedDietary.includes(opt.value)) {
                          setSelectedDietary(selectedDietary.filter(d => d !== opt.value));
                        } else {
                          setSelectedDietary([...selectedDietary, opt.value]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedDietary.includes(opt.value)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Slider */}
              {userLocation && (
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-gray-600)' }}>
                    Distance: <span className="text-orange-600">{maxDistance} miles</span>
                  </p>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-gray-400)' }}>
                    <span>1 mi</span>
                    <span>50 mi</span>
                  </div>
                </div>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Results & View Toggle */}
          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
              {listings.length} {listings.length === 1 ? 'dish' : 'dishes'} found
              {search && <span> for "<strong>{search}</strong>"</span>}
            </p>
            
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-full p-1">
              {[
                { id: 'list', icon: '☰' },
                { id: 'split', icon: '◧' },
                { id: 'map', icon: '🗺️' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    viewMode === mode.id 
                      ? 'bg-white shadow text-gray-900' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {mode.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {locationError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            {locationError}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'split' ? (
          <div className="flex gap-6 h-[calc(100vh-280px)]">
            <div className="w-full md:w-2/5 overflow-y-auto pr-2 space-y-4">
              {listings.length === 0 ? (
                <EmptyState search={search} onClear={clearFilters} />
              ) : (
                listings.map((listing) => (
                  <ListingCard 
                    key={listing.id} 
                    listing={listing} 
                    isSelected={selectedListing?.id === listing.id}
                    onClick={() => setSelectedListing(listing)}
                  />
                ))
              )}
            </div>
            <div className="hidden md:block w-3/5 h-full">
              <ListingsMap 
                listings={listings} 
                userLocation={userLocation} 
                selectedListing={selectedListing}
                onSelectListing={setSelectedListing}
              />
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-[calc(100vh-280px)] rounded-2xl overflow-hidden">
            <ListingsMap 
              listings={listings} 
              userLocation={userLocation}
              selectedListing={selectedListing}
              onSelectListing={setSelectedListing}
            />
          </div>
        ) : (
          <>
            {listings.length === 0 ? (
              <EmptyState search={search} onClear={clearFilters} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing, index) => (
                  <Link
                    key={listing.id}
                    to={`/listings/${listing.id}`}
                    className="card group animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative overflow-hidden">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                          <span className="text-5xl">🍽️</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="badge badge-primary">${listing.price}</span>
                      </div>
                      {listing.distance !== null && (
                        <div className="absolute top-3 left-3">
                          <span className="badge badge-success">{listing.distance} mi</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl" style={{ color: 'var(--color-dark)' }}>
                          {listing.title}
                        </h3>
                        <span className="badge text-xs" style={{ backgroundColor: 'var(--color-cream)' }}>
                          {listing.cuisine_type}
                        </span>
                      </div>
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
                        <span className="text-sm" style={{ color: 'var(--color-gray-500)' }}>
                          ⏱️ {listing.prep_time} min
                        </span>
                      </div>
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

function ListingCard({ listing, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-orange-500 shadow-lg' : ''
      }`}
    >
      <div className="flex gap-4 p-4">
        {listing.image ? (
          <img
            src={listing.image}
            alt={listing.title}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🍽️</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-display text-lg truncate" style={{ color: 'var(--color-dark)' }}>
              {listing.title}
            </h3>
            <span className="font-bold flex-shrink-0" style={{ color: 'var(--color-primary)' }}>
              ${listing.price}
            </span>
          </div>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-2" style={{ backgroundColor: 'var(--color-cream)', color: 'var(--color-gray-600)' }}>
            {listing.cuisine_type}
          </span>
          <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--color-gray-500)' }}>
            <span>👨‍🍳 {listing.cook_name}</span>
            <span>•</span>
            <span>⏱️ {listing.prep_time} min</span>
            {listing.distance !== null && (
              <>
                <span>•</span>
                <span className="font-medium" style={{ color: 'var(--color-success)' }}>
                  {listing.distance} mi
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <Link
        to={`/listings/${listing.id}`}
        className="block w-full py-3 text-center font-semibold border-t transition-colors hover:bg-orange-50"
        style={{ color: 'var(--color-primary)' }}
        onClick={(e) => e.stopPropagation()}
      >
        View Details →
      </Link>
    </div>
  );
}

function EmptyState({ search, onClear }) {
  return (
    <div className="bg-white p-12 rounded-2xl shadow text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="font-display text-2xl mb-2" style={{ color: 'var(--color-dark)' }}>
        {search ? `No dishes found for "${search}"` : 'No dishes nearby'}
      </h3>
      <p className="mb-6" style={{ color: 'var(--color-gray-600)' }}>
        {search 
          ? 'Try a different search or adjust your filters'
          : 'Try increasing the distance or check back later!'
        }
      </p>
      <button onClick={onClear} className="btn-primary">
        Clear filters
      </button>
    </div>
  );
}

export default Listings;