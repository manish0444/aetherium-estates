import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import ChatBox from './ChatBox';

export default function ListingsMap() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/get');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const customIcon = new Icon({
    iconUrl: '/house-icon.png', // Make sure this icon exists in your public folder
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Explore Properties on Map
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find properties in your desired location and explore the neighborhood
          </p>
        </div>

        <div className="h-[600px] rounded-xl overflow-hidden shadow-xl">
          <MapContainer
            center={[27.7172, 85.3240]} // Centered on Bagmati Province, Nepal
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-10" // Lower z-index to prevent overlap with header
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {listings.map((listing) => (
              <Marker
                key={listing._id}
                position={[listing.latitude, listing.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-2 max-w-xs">
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    <h3 className="font-semibold text-lg">{listing.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{listing.address}</p>
                    <p className="text-blue-600 font-semibold mb-2">
                      Rs.{listing.regularPrice.toLocaleString()}
                      {listing.type === 'rent' && '/month'}
                    </p>
                    <Link
                      to={`/listing/${listing._id}`}
                      className="block text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Chat Button */}
        {!showChat && !minimized && (
          <button
            onClick={() => setShowChat(true)}
            className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
            </svg>
          </button>
        )}

        {/* Chat Box */}
        {showChat && (
          <ChatBox
            onClose={() => setShowChat(false)}
            minimized={minimized}
            onMinimize={() => setMinimized(!minimized)}
          />
        )}
      </div>
    </section>
  );
} 