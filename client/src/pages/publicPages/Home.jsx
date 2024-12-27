import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Home as HomeIcon, Building2, TrendingUp, Award, CheckCircle } from 'lucide-react';
import ListingItem from '../../components/ListingItem';
import NearbyListings from '../../components/NearbyListings';
import ListingsMap from '../../components/ListingsMap';
import FeaturedAgents from '../../components/FeaturedAgents';
import { useTheme } from '../../context/ThemeContext';

// Cache for listings data
const CACHE_KEY = 'homeListingsCache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [leaseListings, setLeaseListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { isDarkMode } = useTheme();

  const stats = [
    { label: 'Properties', value: '2.5K+' },
    { label: 'Customers', value: '8K+' },
    { label: 'Cities', value: '50+' }
  ];

  const features = [
    {
      icon: <HomeIcon className="h-6 w-6" />,
      title: 'Wide Selection',
      description: 'Browse through thousands of properties across different locations'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Quality Assured',
      description: 'All properties are verified and meet our quality standards'
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: 'Easy Process',
      description: 'Simple and straightforward buying and renting process'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 20;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        setLoading(true);

        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setOfferListings(data.offerListings);
            setRentListings(data.rentListings);
            setSaleListings(data.saleListings);
            setLeaseListings(data.leaseListings);
            setLoading(false);
            return;
          }
        }

        // If no cache or expired, fetch new data
        const [offerRes, rentRes, saleRes, leaseRes] = await Promise.all([
          fetch('/api/listing/get?offer=true&limit=4&fields=name,address,type,price,imageUrls,offer'),
          fetch('/api/listing/get?type=rent&limit=4&fields=name,address,type,price,imageUrls'),
          fetch('/api/listing/get?type=sale&limit=4&fields=name,address,type,price,imageUrls'),
          fetch('/api/listing/get?type=lease&limit=4&fields=name,address,type,price,imageUrls')
        ]);

        const [offerData, rentData, saleData, leaseData] = await Promise.all([
          offerRes.json(),
          rentRes.json(),
          saleRes.json(),
          leaseRes.json()
        ]);

        // Update state
        setOfferListings(offerData);
        setRentListings(rentData);
        setSaleListings(saleData);
        setLeaseListings(leaseData);

        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: {
            offerListings: offerData,
            rentListings: rentData,
            saleListings: saleData,
            leaseListings: leaseData
          },
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // Loading skeleton component
  const ListingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, index) => (
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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className={`absolute top-0 -right-40 h-96 w-96 rounded-full ${
            isDarkMode ? 'bg-sky-900/20' : 'bg-blue-50'
          } mix-blend-multiply blur-2xl opacity-70 animate-blob`}></div>
          <div className={`absolute -bottom-8 -left-40 h-96 w-96 rounded-full ${
            isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'
          } mix-blend-multiply blur-2xl opacity-70 animate-blob animation-delay-2000`}></div>
          <div className={`absolute top-1/2 left-1/2 h-96 w-96 rounded-full ${
            isDarkMode ? 'bg-sky-800/20' : 'bg-blue-100'
          } mix-blend-multiply blur-2xl opacity-70 animate-blob animation-delay-4000`}></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-24 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="mx-auto max-w-2xl space-y-8 sm:space-y-12">
              <div className="space-y-6 sm:space-y-8">
                <div className={`inline-flex items-center rounded-full px-4 py-2 shadow-md ${
                  isDarkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-gradient-to-r from-blue-50 to-gray-50'
                }`}>
                  <span className={`text-sm font-semibold ${
                    isDarkMode ? 'text-sky-400' : 'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'
                  }`}>
                    Find your dream home today
                  </span>
                </div>
                <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight lg:text-6xl ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Discover Your Perfect{' '}
                  <span className="relative">
                    <span className={`relative ${
                      isDarkMode ? 'text-sky-400' : 'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'
                    }`}>
                      Living Space
                    </span>
                  </span>
                </h1>
                <p className={`text-lg sm:text-xl ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Your journey to finding the perfect home starts here. Browse through our curated selection 
                  of premium properties.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-20 animate-pulse ${
                  isDarkMode ? 'bg-sky-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                }`}></div>
                <form 
                  onSubmit={handleSubmit}
                  className={`relative flex items-center gap-2 sm:gap-4 rounded-2xl p-2 sm:p-3 shadow-xl ${
                    isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
                  }`}
                >
                  <div className="flex-1 flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4">
                    <MapPin className={`h-5 w-5 sm:h-6 sm:w-6 ${
                      isDarkMode ? 'text-sky-400' : 'text-blue-500'
                    }`} />
                    <input
                      type="text"
                      placeholder="Enter location..."
                      className={`w-full bg-transparent outline-none placeholder:text-gray-400 text-base sm:text-lg ${
                        isDarkMode ? 'text-white' : 'text-gray-700'
                      }`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit"
                    className={`px-4 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 text-sm sm:text-base ${
                      isDarkMode 
                        ? 'bg-sky-500 hover:bg-sky-600' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    }`}
                  >
                    Search
                  </button>
                </form>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8">
                {stats.map((stat) => (
                  <div 
                    key={stat.label}
                    className={`rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      isDarkMode 
                        ? 'bg-slate-800 border border-slate-700' 
                        : 'bg-white border border-gray-100'
                    }`}
                  >
                    <p className={`text-xl sm:text-3xl font-bold ${
                      isDarkMode ? 'text-sky-400' : 'bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent'
                    }`}>
                      {stat.value}
                    </p>
                    <p className={`text-xs sm:text-sm mt-2 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Image Grid */}
            <div className="relative grid grid-cols-2 gap-4 sm:gap-8 mt-8 lg:mt-0">
              <div className="space-y-4 sm:space-y-8">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://imgs.search.brave.com/QfAg6YdL2mhnhoiRI8B2RdAenmPjvpbcH04oi-pMWs0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNTIy/NTg0NTQ1L3Bob3Rv/L21vZGVybi1yZWFs/LWVzdGF0ZS5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9RWht/aHMwSTEwTUs5cl9f/eXFaMVN0Sy0yUlpL/T1JGbFpRcWRfY3dr/RWpiYz0" 
                    alt="Modern apartment"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://imgs.search.brave.com/X-3ZR3Fft0fpTzBWz_dBp_8C4jq0bPN5z2ViAsq7SM4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9sdXh1cnktdmls/bGEtd2l0aC1mbG9v/cnRvY2VpbGluZy13/aW5kb3dzLW1pbmlf/MTE2OTg4MC0yOTk2/MjAuanBnP3NlbXQ9/YWlzX2h5YnJpZA" 
                    alt="Luxury villa"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-8 sm:mt-16 space-y-4 sm:space-y-8">
                <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://imgs.search.brave.com/UFkngGGLjpzDVOQd5wvcGVw-r-0BnwMpcBlC4-p5zYM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDgw/Mjg4NjM0L3Bob3Rv/L2JlYXV0aWZ1bC1t/b2Rlcm4taG91c2Ut/aW4tdGhlLWZvcmVz/dC1vdXRkb29yLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz01/NXphSmlscjR3MGVk/ZW5GdjBud3hEVE5p/aWl0UzJXSUFnR0Mz/ZVJ6a19rPQ" 
                    alt="Modern house"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <img 
                    src="https://imgs.search.brave.com/Bx70luUgAPk4VdMzR56KB2sgG-UrzecBab6I6ow0LrA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI4/NzUwMjA4My9waG90/by9jb3p5LXBsYWNl/LWZvci1yZXN0Lmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1s/SEZhUjhndlNhYi1L/b09DUm9XbzdLZm5Q/VWRsb2NkTFZkbkNY/M2t2a053PQ" 
                    alt="Cozy home"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className={`py-16 sm:py-32 transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-800/50' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className={`text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Why Choose Us</h2>
            <p className={`text-lg sm:text-xl max-w-2xl mx-auto ${
              isDarkMode ? 'text-slate-300' : 'text-gray-600'
            }`}>
              We provide the best real estate experience with our comprehensive services and dedicated support.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`p-6 sm:p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  isDarkMode 
                    ? 'bg-slate-800 border border-slate-700' 
                    : 'bg-white border border-gray-100'
                }`}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 ${
                  isDarkMode ? 'bg-sky-900/50 text-sky-400' : 'bg-blue-50 text-blue-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{feature.title}</h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Sections */}
      <NearbyListings/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
        {/* Special Offers Section */}
        {loading ? (
          <section className="pt-8 sm:pt-16">
            <ListingSkeleton />
          </section>
        ) : offerListings && offerListings.length > 0 && (
          <section className="pt-8 sm:pt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center gap-3 mb-2 sm:mb-4">
                  <TrendingUp className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`} />
                  <span className={`font-semibold text-base sm:text-lg ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`}>Hot Deals</span>
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Special Offers</h2>
              </div>
              <Link 
                className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                to={'/search?offer=true'}
              >
                View all offers
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {offerListings.map((listing) => (
                <div key={listing._id} className={`transform hover:-translate-y-2 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* For Rent Section */}
        {loading ? (
          <section className="pt-8 sm:pt-16">
            <ListingSkeleton />
          </section>
        ) : rentListings && rentListings.length > 0 && (
          <section className="pt-8 sm:pt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center gap-3 mb-2 sm:mb-4">
                  <Building2 className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`} />
                  <span className={`font-semibold text-base sm:text-lg ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`}>For Rent</span>
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Latest Rental Properties</h2>
              </div>
              <Link 
                className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                to={'/search?type=rent'}
              >
                View all rentals
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {rentListings.map((listing) => (
                <div key={listing._id} className={`transform hover:-translate-y-2 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* For Sale Section */}
        {loading ? (
          <section className="pt-8 sm:pt-16">
            <ListingSkeleton />
          </section>
        ) : saleListings && saleListings.length > 0 && (
          <section className="pt-8 sm:pt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center gap-3 mb-2 sm:mb-4">
                  <HomeIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`} />
                  <span className={`font-semibold text-base sm:text-lg ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`}>For Sale</span>
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Properties for Sale</h2>
              </div>
              <Link 
                className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                to={'/search?type=sale'}
              >
                View all properties
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {saleListings.map((listing) => (
                <div key={listing._id} className={`transform hover:-translate-y-2 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* For Lease Section */}
        {loading ? (
          <section className="pt-8 sm:pt-16">
            <ListingSkeleton />
          </section>
        ) : leaseListings && leaseListings.length > 0 && (
          <section className="pt-8 sm:pt-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-16 space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center gap-3 mb-2 sm:mb-4">
                  <Building2 className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`} />
                  <span className={`font-semibold text-base sm:text-lg ${
                    isDarkMode ? 'text-sky-400' : 'text-blue-600'
                  }`}>For Lease</span>
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Properties for Lease</h2>
              </div>
              <Link 
                className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                to={'/search?type=lease'}
              >
                View all lease properties
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {leaseListings.map((listing) => (
                <div key={listing._id} className={`transform hover:-translate-y-2 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl p-3 sm:p-4 ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                  <ListingItem listing={listing} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Call to Action Section */}
      <section className={`py-16 sm:py-24 mt-16 sm:mt-32 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-sky-900 to-blue-900' 
          : 'bg-gradient-to-r from-blue-600 to-blue-700'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8">Ready to Find Your Dream Home?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-12 max-w-2xl mx-auto">
            Start your journey today and discover the perfect property that matches your lifestyle and preferences.
          </p>
          <button 
            onClick={() => navigate('/search')}
            className={`px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 text-sm sm:text-base ${
              isDarkMode 
                ? 'bg-sky-500 text-white hover:bg-sky-600' 
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Start Browsing
          </button>
        </div>
      </section>

      {/* Add map section */}
      <ListingsMap />
      
      {/* Add featured agents section */}
      <FeaturedAgents />
    </div>
  );
}