import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { useTheme } from '../context/ThemeContext';
import { Building2 } from 'lucide-react';

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const { isDarkMode } = useTheme();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="p-3 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className={`p-6 rounded-lg mb-4 md:mb-0 md:min-w-[300px] ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Building2 className={`h-6 w-6 ${isDarkMode ? 'text-sky-400' : 'text-blue-600'}`} />
                <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Search Properties
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  id="searchTerm"
                  placeholder="Search by address..."
                  className={`w-full p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  value={sidebardata.searchTerm}
                  onChange={handleChange}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="all"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.type === 'all'}
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Rent & Sale</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="rent"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.type === 'rent'}
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Rent</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="sale"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.type === 'sale'}
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Sale</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="offer"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.offer}
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Offer</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.parking}
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Parking</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={sidebardata.furnished}
                  />
                  <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Furnished</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  onChange={handleChange}
                  defaultValue={'created_at_desc'}
                  id="sort_order"
                  className={`p-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="regularPrice_desc">Price high to low</option>
                  <option value="regularPrice_asc">Price low to high</option>
                  <option value="createdAt_desc">Latest</option>
                  <option value="createdAt_asc">Oldest</option>
                </select>
              </div>

              <button
                className={`p-3 rounded-lg font-semibold transition-colors ${
                  isDarkMode 
                    ? 'bg-sky-500 text-white hover:bg-sky-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Search
              </button>

              <Link
                to="/all-properties"
                className={`p-3 rounded-lg font-semibold text-center transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                View All Properties
              </Link>
            </form>
          </div>

          <div className="flex-1 ml-0 md:ml-6">
            <h1 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Search Results
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {!loading && listings.length === 0 && (
                <p className={`col-span-full text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No listings found
                </p>
              )}

              {loading && (
                [...Array(6)].map((_, index) => (
                  <div 
                    key={index}
                    className={`h-[350px] rounded-lg animate-pulse ${
                      isDarkMode ? 'bg-slate-800' : 'bg-gray-200'
                    }`}
                  />
                ))
              )}

              {!loading &&
                listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
            </div>

            {showMore && (
              <button
                onClick={onShowMoreClick}
                className={`w-full text-center py-3 my-4 rounded-lg font-semibold transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-800 text-white hover:bg-slate-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Show more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 