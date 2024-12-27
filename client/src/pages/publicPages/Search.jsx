import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, Navigation, Loader2 } from "lucide-react";
import ListingItem from "../../components/ListingItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ITEMS_PER_PAGE = 6;

const LoadingSkeleton = ({ isDarkMode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    {[...Array(6)].map((_, index) => (
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

export default function Search() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
    nearby: false,
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userLocation, setUserLocation] = useState(null);

  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [areaRange, setAreaRange] = useState({ min: '', max: '' });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [propertyStatus, setPropertyStatus] = useState('all');
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [furnishing, setFurnishing] = useState('any');

  const amenitiesOptions = [
    'pool', 'gym', 'garden', 'security', 'elevator', 'parking',
    'airConditioning', 'internet', 'balcony', 'waterSupply'
  ];

  const propertyStatusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'ready', label: 'Ready to Move' },
    { value: 'underConstruction', label: 'Under Construction' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  const propertyTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'rent', label: 'For Rent' },
    { id: 'sale', label: 'For Sale' },
    { id: 'lease', label: 'For Lease' }
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    setSidebardata({
      searchTerm: urlParams.get('searchTerm') || '',
      type: urlParams.get('type') || 'all',
      parking: urlParams.get('parking') === 'true',
      furnished: urlParams.get('furnished') === 'true',
      offer: urlParams.get('offer') === 'true',
      sort: urlParams.get('sort') || 'created_at',
      order: urlParams.get('order') || 'desc',
      nearby: urlParams.get('nearby') === 'true',
    });

    setPriceRange({
      min: urlParams.get('minPrice') || '',
      max: urlParams.get('maxPrice') || ''
    });

    setAreaRange({
      min: urlParams.get('minArea') || '',
      max: urlParams.get('maxArea') || ''
    });

    setBedrooms(urlParams.get('bedrooms') || 'any');
    setBathrooms(urlParams.get('bathrooms') || 'any');
    setPropertyStatus(urlParams.get('propertyStatus') || 'all');
    
    const amenities = urlParams.get('amenities');
    if (amenities) {
      setSelectedAmenities(amenities.split(','));
    }

    if (urlParams.get('nearby') === 'true') {
      getUserLocation();
    }

    fetchListings(urlParams);
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

  const fetchListings = async (params) => {
    try {
      setLoading(true);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      params.append('startIndex', startIndex);
      params.append('limit', ITEMS_PER_PAGE);

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

      setListings(data);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (["all", "rent", "sale", "lease"].includes(e.target.id)) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (["parking", "furnished", "offer", "nearby"].includes(e.target.id)) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.id === "sort_order") {
      const [sort, order] = e.target.value.split("_");
      setSidebardata({ ...sidebardata, sort: sort || "created_at", order: order || "desc" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();

    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
    if (sidebardata.type !== 'all') urlParams.set('type', sidebardata.type);
    if (sidebardata.parking) urlParams.set('parking', 'true');
    if (sidebardata.furnished) urlParams.set('furnished', 'true');
    if (sidebardata.offer) urlParams.set('offer', 'true');
    if (sidebardata.nearby) urlParams.set('nearby', 'true');

    if (priceRange.min) urlParams.set('minPrice', priceRange.min);
    if (priceRange.max) urlParams.set('maxPrice', priceRange.max);

    if (areaRange.min) urlParams.set('minArea', areaRange.min);
    if (areaRange.max) urlParams.set('maxArea', areaRange.max);

    if (bedrooms !== 'any') urlParams.set('bedrooms', bedrooms);
    if (bathrooms !== 'any') urlParams.set('bathrooms', bathrooms);

    if (propertyStatus !== 'all') urlParams.set('propertyStatus', propertyStatus);

    if (selectedAmenities.length > 0) {
      urlParams.set('amenities', selectedAmenities.join(','));
    }

    if (sidebardata.sort !== 'created_at') {
      urlParams.set('sort', sidebardata.sort);
      urlParams.set('order', sidebardata.order);
    }

    urlParams.set('page', '1');
    navigate(`/search?${urlParams.toString()}`);
  };

  const handlePageChange = (page) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page.toString());
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Top Filter Bar */}
      <div className={`sticky top-0 z-10 shadow-sm border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            setIsFilterOpen(false);
            handleSubmit(e);
          }} className="flex flex-col sm:flex-row gap-4">
            {/* Search input */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Search by location..."
                  className={`w-full px-4 py-2.5 pl-10 rounded-lg transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-sky-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }`}
                  value={sidebardata.searchTerm}
                  onChange={handleChange}
                />
                <SearchIcon className={`absolute left-3 top-3 h-5 w-5 ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-400'
                }`} />
              </div>
            </div>

            {/* Filter buttons row */}
            <div className="flex gap-2 sm:gap-4">
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700 text-sky-400 hover:bg-slate-600' 
                    : 'bg-white text-blue-600 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>

              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>

              <select
                onChange={handleChange}
                value={`${sidebardata.sort}_${sidebardata.order}`}
                id="sort_order"
                className={`px-4 py-2.5 rounded-lg transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-700 text-white border-slate-600 focus:border-sky-500' 
                    : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
                }`}
              >
                <option value="regularPrice_desc">Price: High to Low</option>
                <option value="regularPrice_asc">Price: Low to High</option>
                <option value="createdAt_desc">Latest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>

              <button
                type="submit"
                className={`px-6 py-2.5 rounded-lg font-medium transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-sky-500 text-white hover:bg-sky-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Search
              </button>
            </div>
          </form>

          {/* Filter modal with dark mode support */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
              <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={() => setIsFilterOpen(false)} />
              <div className={`fixed inset-x-0 bottom-0 lg:relative transform transition-transform duration-300 ease-in-out ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              } rounded-t-xl lg:rounded-none shadow-xl lg:shadow-none`}>
                <div className="max-h-[80vh] overflow-y-auto p-4 lg:p-6">
                  {/* Filter content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Price Range Filter */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Price Range</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Area Range Filter */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Area (sq ft)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={areaRange.min}
                          onChange={(e) => setAreaRange(prev => ({ ...prev, min: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={areaRange.max}
                          onChange={(e) => setAreaRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Bedrooms & Bathrooms */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                        <select
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="any">Any</option>
                          {[1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num}+ Beds</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                        <select
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="any">Any</option>
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num}+ Baths</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Property Status & Furnishing */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={propertyStatus}
                          onChange={(e) => setPropertyStatus(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          {propertyStatusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
                        <select
                          value={furnishing}
                          onChange={(e) => setFurnishing(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        >
                          <option value="any">Any</option>
                          <option value="furnished">Furnished</option>
                          <option value="semifurnished">Semi-Furnished</option>
                          <option value="unfurnished">Unfurnished</option>
                        </select>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="col-span-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {amenitiesOptions.map(amenity => (
                          <label key={amenity} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedAmenities.includes(amenity)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAmenities(prev => [...prev, amenity]);
                                } else {
                                  setSelectedAmenities(prev => prev.filter(a => a !== amenity));
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 capitalize">
                              {amenity.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Property Type</h3>
                      {propertyTypes.map(type => (
                        <div key={type.id} className="flex gap-2">
                          <input
                            type="checkbox"
                            id={type.id}
                            className="w-5"
                            onChange={handleChange}
                            checked={sidebardata.type === type.id}
                          />
                          <span>{type.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Add nearby filter */}
                    <div className="p-4 border-t space-y-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="nearby"
                          checked={sidebardata.nearby}
                          onChange={handleChange}
                          className={`w-5 h-5 rounded transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-slate-700 border-slate-600 checked:bg-sky-500' 
                              : 'bg-white border-gray-300 checked:bg-blue-600'
                          }`}
                        />
                        <span className={`${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Show Nearby Properties</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin" />
                Loading...
              </div>
            ) : listings.length > 0 ? (
              <div className="flex items-center gap-3">
                <span>{listings.length} Properties Found</span>
                {listings.length > ITEMS_PER_PAGE && (
                  <button
                    onClick={() => navigate(`/all-properties${location.search}`)}
                    className={`ml-4 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    View All Properties
                  </button>
                )}
              </div>
            ) : (
              "No Properties Found"
            )}
          </h2>
        </div>

        {loading ? (
          <LoadingSkeleton isDarkMode={isDarkMode} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {listings.slice(0, ITEMS_PER_PAGE).map((listing) => (
              <div key={listing._id} className={`transform hover:-translate-y-2 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              }`}>
                <ListingItem listing={listing} />
                {sidebardata.nearby && listing.distance && (
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
        )}

        {/* Pagination */}
        {!loading && listings.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg disabled:opacity-50 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' 
                  : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <span className={`text-sm ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg disabled:opacity-50 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700' 
                  : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Empty State */}
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
                <p className="text-gray-500 text-sm mb-4">
                  We couldn't find any properties matching your current filters. Try:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Adjusting the price range</li>
                  <li>• Removing some filters</li>
                  <li>• Checking a different location</li>
                  <li>• Using more general search terms</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  // Reset all filters
                  setSidebardata({
                    searchTerm: "",
                    type: "all",
                    parking: false,
                    furnished: false,
                    offer: false,
                    sort: "created_at",
                    order: "desc",
                    nearby: false,
                  });
                  setPriceRange({ min: '', max: '' });
                  setAreaRange({ min: '', max: '' });
                  setBedrooms('any');
                  setBathrooms('any');
                  setPropertyStatus('all');
                  setSelectedAmenities([]);
                  navigate('/search');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}