import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import ListingItem from '../components/ListingItem';
import { Building2 } from 'lucide-react';

export default function AllProperties() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    bedrooms: 'all'
  });
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/listing/get');
        const data = await res.json();
        
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        
        setListings(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError('Failed to fetch listings');
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const filteredListings = listings.filter(listing => {
    if (filters.type !== 'all' && listing.type !== filters.type) return false;
    
    if (filters.priceRange !== 'all') {
      const price = listing.regularPrice;
      switch (filters.priceRange) {
        case 'under100k':
          if (price >= 100000) return false;
          break;
        case '100k-500k':
          if (price < 100000 || price >= 500000) return false;
          break;
        case '500k-1m':
          if (price < 500000 || price >= 1000000) return false;
          break;
        case 'over1m':
          if (price < 1000000) return false;
          break;
        default:
          break;
      }
    }

    if (filters.bedrooms !== 'all' && listing.bedrooms !== parseInt(filters.bedrooms)) {
      return false;
    }

    return true;
  });

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Building2 className={`h-8 w-8 ${isDarkMode ? 'text-sky-400' : 'text-blue-600'}`} />
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            All Properties
          </h1>
        </div>

        {/* Filters */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 rounded-lg ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className={`p-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
          </select>

          <select
            value={filters.priceRange}
            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
            className={`p-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Prices</option>
            <option value="under100k">Under $100k</option>
            <option value="100k-500k">$100k - $500k</option>
            <option value="500k-1m">$500k - $1M</option>
            <option value="over1m">Over $1M</option>
          </select>

          <select
            value={filters.bedrooms}
            onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
            className={`p-2 rounded-lg border transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">All Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4+ Bedrooms</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div 
                key={n}
                className={`h-[400px] rounded-lg animate-pulse ${
                  isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        ) : (
          <>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {filteredListings.length} properties found
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className={`text-center py-12 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>No properties found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 