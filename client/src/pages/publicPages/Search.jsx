import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import EnhancedPropertyListing from "../../components/EnhancedPropertyListing";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "border hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default function Search() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

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

    fetchListings(urlParams);
  }, [location.search]);

  const fetchListings = async (params) => {
    try {
      setLoading(true);
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      params.append('startIndex', startIndex);
      params.append('limit', ITEMS_PER_PAGE);

      const res = await fetch(`/api/listing/get?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch listings');
      
      const data = await res.json();
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
    if (["parking", "furnished", "offer"].includes(e.target.id)) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Top Filter Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Search properties..."
                  className="w-full px-4 py-2.5 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={sidebardata.searchTerm}
                  onChange={handleChange}
                />
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2.5 border rounded-lg flex items-center gap-2 hover:bg-gray-50 bg-white"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <select
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
              id="sort_order"
              className="px-4 py-2.5 border rounded-lg bg-white hover:bg-gray-50"
            >
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Enhanced Filters Section */}
          {isFilterOpen && (
            <div className="border-t border-gray-200 bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 py-6">
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
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {loading ? (
              "Loading..."
            ) : listings.length > 0 ? (
              `${listings.length} Properties Found`
            ) : (
              "No Properties Found"
            )}
          </h2>
        </div>

        <EnhancedPropertyListing listings={listings} loading={loading} />

        {/* Pagination */}
        {!loading && listings.length > 0 && (
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
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