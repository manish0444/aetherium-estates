import React, { useEffect, useState } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingItem from './ListingItem';
import { useTheme } from '../context/ThemeContext';

const NEARBY_CACHE_KEY = 'nearbyListingsCache';
const NEARBY_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const LOCATION_CACHE_KEY = 'userLocationCache';
const LOCATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const NearbyListings = () => {
  const [nearbyListings, setNearbyListings] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [maxDistance, setMaxDistance] = useState(20);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fetchingListings, setFetchingListings] = useState(false);
  const { isDarkMode } = useTheme();

  // Truncate address to exactly 3 words
  const truncateAddress = (address) => {
    if (!address) return '';
    const words = address.split(' ');
    return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
  };

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

    // Check for cached location first
    const cachedLocation = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cachedLocation) {
      const { data, timestamp } = JSON.parse(cachedLocation);
      if (Date.now() - timestamp < LOCATION_CACHE_DURATION) {
        setUserLocation(data);
        setHasPermission(true);
        setLoading(false);
        setIsAnimating(false);
        return;
      }
    }

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000, // Reduced timeout
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Cache the location
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
          data: locationData,
          timestamp: Date.now()
        }));

        setUserLocation(locationData);
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

  useEffect(() => {
    const fetchNearbyListings = async () => {
      if (!userLocation) return;

      try {
        setFetchingListings(true);

        // Check cache first
        const cacheKey = `${NEARBY_CACHE_KEY}_${maxDistance}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const { data, timestamp, userLoc } = JSON.parse(cachedData);
          const locationUnchanged = 
            userLoc.latitude === userLocation.latitude && 
            userLoc.longitude === userLocation.longitude;
          
          if (Date.now() - timestamp < NEARBY_CACHE_DURATION && locationUnchanged) {
            setNearbyListings(data);
            setFetchingListings(false);
            return;
          }
        }

        // If no cache or expired, fetch new data
        const response = await fetch('/api/listing/get?limit=10&fields=name,address,type,price,imageUrls,latitude,longitude');
        if (!response.ok) throw new Error('Failed to fetch listings');
        
        const allListings = await response.json();

        // Process listings efficiently
        const nearbyListings = allListings
          .reduce((acc, listing) => {
            const lat = parseFloat(listing.latitude);
            const lng = parseFloat(listing.longitude);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                lat,
                lng
              );
              
              if (distance <= maxDistance) {
                acc.push({ ...listing, distance });
              }
            }
            return acc;
          }, [])
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        // Cache the results
        localStorage.setItem(cacheKey, JSON.stringify({
          data: nearbyListings,
          timestamp: Date.now(),
          userLoc: userLocation
        }));

        setNearbyListings(nearbyListings);
      } catch (error) {
        console.error('Error fetching nearby listings:', error);
        setLocationError('Error loading listings. Please try again.');
      } finally {
        setFetchingListings(false);
      }
    };

    if (userLocation) {
      fetchNearbyListings();
    }
  }, [userLocation, maxDistance]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-20">
      {[...Array(3)].map((_, index) => (
        <div 
          key={index} 
          className={`rounded-xl overflow-hidden ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="grid grid-cols-3 gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
      <section className="pt-8 sm:pt-16 relative">
        {/* Title section - only show when permission granted */}
        <div className={`transition-opacity duration-700 ${hasPermission ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3 mb-2 sm:mb-4">
            <Navigation className={`h-5 w-5 sm:h-6 sm:w-6 ${
              isDarkMode ? 'text-sky-400' : 'text-blue-600'
            }`} />
            <span className={`font-semibold text-base sm:text-lg ${
              isDarkMode ? 'text-sky-400' : 'text-blue-600'
            }`}>
              Closest Properties (Within {maxDistance}km)
            </span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-8 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Nearby Properties</h2>
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
                transition-all duration-300 font-medium text-lg
                shadow-lg hover:shadow-xl
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}
                ${isDarkMode 
                  ? 'bg-sky-500 text-white hover:bg-sky-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'}
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
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className={`px-4 py-2 rounded-lg border focus:ring-2 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white focus:ring-sky-500 focus:border-sky-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                }`}
              >
                <option value={5}>Within 5km</option>
                <option value={10}>Within 10km</option>
                <option value={20}>Within 20km</option>
                <option value={50}>Within 50km</option>
              </select>
              <Link 
                className={`inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
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
          <div className={`rounded-lg p-4 mb-6 mt-20 ${
            isDarkMode 
              ? 'bg-red-900/50 border border-red-800' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={isDarkMode ? 'text-red-400' : 'text-red-700'}>{locationError}</p>
          </div>
        )}

        {/* Loading State */}
        {fetchingListings && <LoadingSkeleton />}

        {/* Listings grid */}
        {!loading && !fetchingListings && nearbyListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-20">
            {nearbyListings.map((listing) => (
              <div key={listing._id} className="relative">
                <ListingItem listing={{...listing, address: truncateAddress(listing.address)}} />
                {/* Distance Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                  isDarkMode ? 'bg-sky-500/90 text-white' : 'bg-blue-600/90 text-white'
                }`}>
                  {listing.distance.toFixed(1)}km away
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No listings message */}
        {!loading && !fetchingListings && hasPermission && nearbyListings.length === 0 && (
          <div className={`text-center py-12 rounded-xl mt-20 ${
            isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
          }`}>
            <MapPin className={`w-12 h-12 mx-auto mb-4 ${
              isDarkMode ? 'text-slate-600' : 'text-gray-400'
            }`} />
            <p className={`text-lg ${
              isDarkMode ? 'text-slate-300' : 'text-gray-600'
            }`}>No listings found within {maxDistance}km of your location.</p>
            <button
              onClick={() => setMaxDistance(prev => Math.min(prev * 2, 50))}
              className={`mt-4 font-medium hover:underline ${
                isDarkMode ? 'text-sky-400 hover:text-sky-500' : 'text-blue-600 hover:text-blue-700'
              }`}
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