import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import L from 'leaflet';

// Rest of the file stays the same...import { Link } from 'react-router-dom';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icon for listings
const listingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function ListingsMap({ listings, userLocation }) {
  if (!userLocation) {
    return (
      <div className="h-96 bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Enable location to see map</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      className="h-96 rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* User location marker */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <strong>You are here</strong>
        </Popup>
      </Marker>

      {/* Listing markers */}
      {listings.map((listing) => (
        listing.latitude && listing.longitude && (
          <Marker
            key={listing.id}
            position={[parseFloat(listing.latitude), parseFloat(listing.longitude)]}
            icon={listingIcon}
          >
            <Popup>
              <div className="min-w-48">
                {listing.image && (
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-bold text-lg">{listing.title}</h3>
                <p className="text-orange-500 font-bold">${listing.price}</p>
                <p className="text-sm text-gray-600">{listing.distance} mi away</p>
                <p className="text-sm text-gray-500">By {listing.cook_name}</p>
                <Link
                  to={`/listings/${listing.id}`}
                  className="mt-2 inline-block bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}

export default ListingsMap;