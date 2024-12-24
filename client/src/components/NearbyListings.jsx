import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const NearbyListings = () => {
  const [nearbyListings, setNearbyListings] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [maxDistance, setMaxDistance] = useState(20);
  const [isAnimating, setIsAnimating] = useState(false);

  // Existing calculateDistance function remains the same
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    try {
      if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
      
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return Infinity;
    }
  };

  const getUserLocation = () => {
    setLoading(true);
    setLocationError(null);
    setIsAnimating(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setHasPermission(true);
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError(
          error.code === 1 
            ? "Location access denied. Please enable location services to see nearby listings."
            : "Error getting location. Please try again."
        );
        setHasPermission(false);
        setLoading(false);
        setIsAnimating(false);
      },
      options
    );
  };

  // Existing useEffect and fetchNearbyListings remain the same
  useEffect(() => {
    const fetchNearbyListings = async () => {
      if (!userLocation) return;

      try {
        setLoading(true);
        const response = await fetch('/api/listing/get');
        if (!response.ok) throw new Error('Failed to fetch listings');
        
        const allListings = await response.json();

        const nearby = allListings
          .map(listing => {
            const lat = parseFloat(listing.latitude);
            const lng = parseFloat(listing.longitude);
            
            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`Invalid coordinates for listing ${listing._id}`);
              return { ...listing, distance: Infinity };
            }

            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              lat,
              lng
            );

            return { ...listing, distance };
          })
          .filter(listing => listing.distance <= maxDistance)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 8);

        setNearbyListings(nearby);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nearby listings:', error);
        setLocationError('Error loading listings. Please try again.');
        setLoading(false);
      }
    };

    fetchNearbyListings();
  }, [userLocation, maxDistance]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
      <section className="pt-8 sm:pt-16 relative">
        {/* Title section - only show when permission granted */}
        <div className={`transition-opacity duration-700 ${hasPermission ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 mb-2 sm:mb-4">
            <Navigation className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <span className="text-blue-600 font-semibold text-base sm:text-lg">
              Properties Near You (Within {maxDistance}km)
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Nearby Properties</h2>
        </div>

        {/* Button container with absolute positioning for animation */}
        <div className={`
          ${!hasPermission ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'absolute top-0 right-0'}
          transition-all duration-700 ease-in-out
        `}>
          {!hasPermission ? (
            <button
              onClick={getUserLocation}
              className={`
                inline-flex items-center px-8 py-4 rounded-full 
                bg-blue-600 text-white hover:bg-blue-700 
                transition-all duration-300 font-medium text-lg
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}
                shadow-lg hover:shadow-xl
              `}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Getting Location...
                </>
              ) : (
                <>
                  Show Nearby Listings
                  <MapPin className="w-5 h-5 ml-3" />
                </>
              )}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>Within 5km</option>
                <option value={10}>Within 10km</option>
                <option value={20}>Within 20km</option>
                <option value={50}>Within 50km</option>
              </select>
              <Link 
                className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-300 font-medium"
                to="/search"
              >
                View all nearby
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Error message */}
        {locationError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 mt-20">
            <p className="text-red-700">{locationError}</p>
          </div>
        )}

        {/* Listings grid */}
        {!loading && nearbyListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mt-20">
            {nearbyListings.map((listing) => (
              <div key={listing._id} className="transform hover:-translate-y-2 transition-all duration-300 bg-white rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4">
                <ListingItem listing={listing} />
                <div className="mt-3 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 text-sm">{listing.address}</p>
                    <p className="text-blue-600 text-sm font-medium">
                      {listing.distance.toFixed(1)}km away
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No listings message */}
        {!loading && hasPermission && nearbyListings.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl mt-20">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No listings found within {maxDistance}km of your location.</p>
            <button
              onClick={() => setMaxDistance(prev => Math.min(prev * 2, 50))}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Try increasing the search radius
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default NearbyListings;