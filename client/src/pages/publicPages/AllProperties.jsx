import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, Navigation, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import ListingItem from "../../components/ListingItem";
import { useTheme } from "../../context/ThemeContext";

const ITEMS_PER_PAGE = 12; // Show 12 items per page

const LoadingSkeleton = ({ isDarkMode }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(12)].map((_, index) => (
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

export default function AllProperties() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    setCurrentPage(page);

    if (urlParams.get('nearby') === 'true') {
      getUserLocation();
    }
    fetchAllListings(urlParams);
  }, [location.search]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Error getting your location. Please try again.');
      }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
  };

  const fetchAllListings = async (params) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/listing/get?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      
      let data = await res.json();

      // Filter by address if searchTerm exists
      if (params.get('searchTerm')) {
        const searchTerms = params.get('searchTerm').toLowerCase().split(' ');
        data = data.filter(listing => 
          searchTerms.some(term => 
            listing.address.toLowerCase().includes(term)
          )
        );
      }

      // Sort by distance if nearby is true
      if (params.get('nearby') === 'true' && userLocation) {
        data = data
          .map(listing => ({
            ...listing,
            distance: calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              parseFloat(listing.latitude),
              parseFloat(listing.longitude)
            )
          }))
          .sort((a, b) => a.distance - b.distance);
      }

      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', newPage.toString());
    navigate(`${location.pathname}?${urlParams.toString()}`);
    window.scrollTo(0, 0);
  };

  // Get current page's listings
  const getCurrentPageListings = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return listings.slice(startIndex, endIndex);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className={`mb-4 flex items-center gap-2 ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Search
            </button>
            <h2 className={`text-2xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Loading...
                </div>
              ) : (
                `All Properties (${listings.length})`
              )}
            </h2>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton isDarkMode={isDarkMode} />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {getCurrentPageListings().map((listing) => (
                <div key={listing._id} className={`transform hover:-translate-y-2 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                  <ListingItem listing={listing} />
                  {listing.distance && (
                    <div className={`px-4 py-2 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      <Navigation className="inline-block w-4 h-4 mr-2" />
                      {listing.distance.toFixed(1)}km away
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg disabled:opacity-50 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-800 text-white hover:bg-slate-700 disabled:hover:bg-slate-800 border border-slate-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-50 disabled:hover:bg-white border border-gray-300'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrentPage = pageNumber === currentPage;
                    const isNearCurrent = Math.abs(pageNumber - currentPage) <= 1;
                    const isEndPage = pageNumber === 1 || pageNumber === totalPages;

                    if (!isNearCurrent && !isEndPage) {
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
                        return <span key={pageNumber} className="text-gray-500">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                          isCurrentPage
                            ? isDarkMode
                              ? 'bg-sky-500 text-white'
                              : 'bg-blue-600 text-white'
                            : isDarkMode
                              ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                              : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg disabled:opacity-50 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-800 text-white hover:bg-slate-700 disabled:hover:bg-slate-800 border border-slate-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-50 disabled:hover:bg-white border border-gray-300'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}

        {!loading && listings.length === 0 && (
          <div className={`text-center py-12 rounded-xl ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-500 text-sm">
                  Try adjusting your search filters
                </p>
              </div>
              <button
                onClick={() => navigate('/search')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Back to Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 