import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation, EffectFade } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css/bundle";
import {
  Bath,
  Bed,
  Sofa,
  MapPin,
  Share2,
  Info,
  Loader2,
  User,
  X,
  Mail,
  Phone,
  HomeIcon,
  Eye,
  Heart,
  Home,
  Tag,
  Maximize2,
  Grid,
  ArrowUpDown,
  Wrench,
  Shield,
  Calendar,
  Check,
  DollarSign,
  Car,
  Star,
  Crown,
  Badge,
  Building2,
} from "lucide-react";
import Contact from "../../components/Contact";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getDeviceId } from '../../utils/deviceId';
import { useFavorites } from '../../context/FavoritesContext';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const customMarkerIcon = L.divIcon({
  className: 'custom-marker',
  html: `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C11.4 0 6 5.4 6 12C6 21 18 36 18 36C18 36 30 21 30 12C30 5.4 24.6 0 18 0ZM18 16.2C15.6 16.2 13.8 14.4 13.8 12C13.8 9.6 15.6 7.8 18 7.8C20.4 7.8 22.2 9.6 22.2 12C22.2 14.4 20.4 16.2 18 16.2Z" 
      fill="#4F46E5" 
      filter="drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))"
    />
    <circle cx="18" cy="12" r="4.5" fill="white"/>
  </svg>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

const RoleBadge = ({ role }) => {
  const badges = {
    admin: {
      class: "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500",
      animation: "animate-shimmer-fast",
      border: "border-purple-300",
      text: "Administrator",
      icon: Crown
    },
    agent: {
      class: "bg-gradient-to-r from-blue-400 via-teal-500 to-blue-600",
      animation: "animate-shimmer-medium",
      border: "border-blue-300",
      text: "Agent",
      icon: Badge
    },
    user: {
      class: "bg-gradient-to-r from-green-400 to-blue-400",
      animation: "animate-shimmer-slow",
      border: "border-green-300",
      text: "User",
      icon: User
    }
  };

  const badge = badges[role?.toLowerCase()] || badges.user;
  const Icon = badge.icon;

  return (
    <div className={`relative overflow-hidden rounded-full`}>
      <div className={`
        ${badge.class} ${badge.animation}
        px-4 py-1 rounded-full border ${badge.border}
        text-white font-medium shadow-lg
        flex items-center gap-2
      `}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </div>
    </div>
  );
};

const LandlordInfoModal = ({ listing, onClose }) => {
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLandlordInfo = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        if (!res.ok) throw new Error('Failed to fetch landlord info');
        
        const data = await res.json();
        setLandlordInfo({
          ...data,
          role: data.role?.toLowerCase() || 'user'
        });
      } catch (error) {
        console.error('Error fetching landlord info:', error);
        setLandlordInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (listing?.userRef) {
      fetchLandlordInfo();
    }
  }, [listing.userRef]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-auto">
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : landlordInfo ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <img
                    src={landlordInfo.avatar || "/default-avatar.png"}
                    alt={landlordInfo.username}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{landlordInfo.username}</h3>
                    <RoleBadge role={landlordInfo.role} />
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Member since</p>
                  <p className="font-medium">
                    {new Date(landlordInfo.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Response rate</p>
                  <p className="font-medium">95%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total listings</p>
                  <p className="font-medium">{landlordInfo.totalListings || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{landlordInfo.email}</p>
                  </div>
                </div>

                {landlordInfo.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-gray-900">{landlordInfo.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate(`/user-profile/${landlordInfo._id}`);
                }}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors"
              >
                View Full Profile
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Failed to load landlord information
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Listing() {
  SwiperCore.use([Navigation, EffectFade]);
  const [listing, setListing] = useState(null);
  const [landlordInfo, setLandlordInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const [showLandlordModal, setShowLandlordModal] = useState(false);
  const [coordinates, setCoordinates] = useState([51.505, -0.09]);
  const [viewCount, setViewCount] = useState(0);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [map, setMap] = useState(null);
  const { toggleFavorite, isFavorite: favoritesContextIsFavorite } = useFavorites();
  const [showFavoritesButton, setShowFavoritesButton] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleNonLoggedUserClick = (action) => {
    const message =
      action === "contact"
        ? "Please login to contact the landlord"
        : "Please login to view landlord information";

    setAlertText(message);
    setShowAlert(true);

    // Redirect after a short delay
    setTimeout(() => {
      navigate("/sign-in");
    }, 2000);
  };
  // Check if property is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async (userId, listingId) => {
      try {
        if (!currentUser) {
          return false;
        }
        
        const res = await fetch(`/api/favorite/check-favorite/${userId}&${listingId}`);
        if (!res.ok) {
          throw new Error('Failed to check favorite status');
        }
        
        const data = await res.json();
        return data.isFavorite;
      } catch (error) {
        console.error('Error checking favorite status:', error);
        return false;
      }
    };

    checkFavoriteStatus(currentUser._id, params.listingId);
  }, [currentUser, params.listingId]);

  // Handle favorite toggle
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setShowAlert(true);
      setAlertText('Please sign in to save favorites');
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const isCurrentlyFavorite = favoritesContextIsFavorite(listing._id);
      await toggleFavorite(listing);
      
      setShowAlert(true);
      setAlertText(isCurrentlyFavorite ? 'Removed from favorites' : 'Added to favorites');
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setShowAlert(true);
      setAlertText('Error updating favorites');
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Function to increment view count
  const incrementViewCount = async (listingId) => {
    try {
      const response = await fetch(
        `/api/listing/increment-views/${listingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setViewCount(data.views);
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  // Geocode address using OpenStreetMap Nominatim
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const fetchLandlordInfo = async (userId) => {
    try {
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch landlord info');
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching landlord info:', error);
      return null;
    }
  };

  // Function to get address from coordinates
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return '';
    }
  };

  // Map click handler component
  const MapClickHandler = () => {
    const map = useMap();

    useEffect(() => {
      if (!map) return;

      const handleMapClick = async (e) => {
        const { lat, lng } = e.latlng;
        try {
          const address = await getAddressFromCoords(lat, lng);
          // Update the coordinates state
          setCoordinates([lat, lng]);
        } catch (error) {
          console.error('Error handling map click:', error);
        }
      };

      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    }, [map]);

    return null;
  };

  // Location search functionality
  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}, Nepal`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    setCoordinates([lat, lon]);
    if (map) {
      map.flyTo([lat, lon], 16);
    }

    setSearchResults([]);
    setSearchQuery(location.display_name);
  };

  const renderAmenities = () => {
    if (!listing || !listing.amenities) return null;

    const hasAmenities = Object.entries(listing.amenities).some(([_, value]) => value);
    
    if (!hasAmenities) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(listing.amenities)
            .filter(([_, value]) => value)
            .map(([key]) => (
              <div key={key} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // Move formatAddress function here, outside of renderPropertyDetails
  const formatAddress = (address) => {
    if (!address) return '';
    
    const parts = address.split(',').map(part => part.trim());
    const reversedParts = parts.reverse(); // Reverse to get country first
    
    // Try to get country, state/district, and city/town
    const country = reversedParts.find(part => 
      part.toLowerCase().includes('nepal') || 
      part.toLowerCase().includes('india') ||
      part.toLowerCase().includes('usa')
    ) || reversedParts[0];
    
    const district = reversedParts.find(part => 
      part.toLowerCase().includes('district') || 
      part.toLowerCase().includes('province') ||
      part.toLowerCase().includes('state')
    ) || reversedParts[1];
    
    const locality = reversedParts.find(part => 
      !part.toLowerCase().includes('nepal') &&
      !part.toLowerCase().includes('district') &&
      !part.toLowerCase().includes('province') &&
      !part.toLowerCase().includes('state')
    ) || reversedParts[2];

    const importantParts = [locality, district, country].filter(Boolean);
    return importantParts.slice(0, 3).join(', ');
  };

  const renderPropertyDetails = () => {
    if (!listing) return null;

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Type */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Home className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Property Type</p>
              <p className="font-semibold capitalize">
                {listing.propertyType} {listing.type === 'rent' 
                  ? 'for Rent' 
                  : listing.type === 'lease' 
                  ? 'for Lease' 
                  : 'for Sale'}
              </p>
            </div>
          </div>

          {/* Bedrooms */}
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Bed className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Bedrooms</p>
                <p className="font-semibold">{listing.bedrooms}</p>
              </div>
            </div>
          )}

          {/* Bathrooms */}
          {listing.bathrooms > 0 && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Bath className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Bathrooms</p>
                <p className="font-semibold">{listing.bathrooms}</p>
              </div>
            </div>
          )}

          {/* Total Area */}
          {listing.totalArea > 0 && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Maximize2 className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Area</p>
                <p className="font-semibold">{listing.totalArea} sq ft</p>
              </div>
            </div>
          )}

          {/* Built-up Area */}
          {listing.builtUpArea > 0 && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Grid className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Built-up Area</p>
                <p className="font-semibold">{listing.builtUpArea} sq ft</p>
              </div>
            </div>
          )}

          {/* Floor Number */}
          {listing.floorNumber && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <ArrowUpDown className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Floor Number</p>
                <p className="font-semibold">{listing.floorNumber}</p>
              </div>
            </div>
          )}

          {/* Total Floors */}
          {listing.totalFloors && (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Building2 className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Floors</p>
                <p className="font-semibold">{listing.totalFloors}</p>
              </div>
            </div>
          )}

          {/* Parking */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Car className="h-6 w-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Parking</p>
              <p className="font-semibold">{listing.parking ? 'Available' : 'Not Available'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const recordView = async () => {
      if (!listing) return;

      try {
        const deviceId = getDeviceId();
        const res = await fetch(`/api/listing/view/${listing._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ deviceId }),
        });
        const data = await res.json();
        if (data.success) {
          setViewCount(data.views);
        }
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    recordView();
  }, [listing?._id]);

  useEffect(() => {
    const fetchListingAndLandlord = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || 'Failed to fetch listing');
          setLoading(false);
          return;
        }
        
        // Fetch landlord info
        const landlordData = await fetchLandlordInfo(data.userRef);
        if (landlordData) {
          setListing({
            ...data,
            landlordEmail: landlordData.email
          });
        } else {
          setListing(data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        setError('Failed to fetch listing details');
        setLoading(false);
      }
    };

    if (params.listingId) {
    fetchListingAndLandlord();
    }
  }, [params.listingId]);

  return (
    <main className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : listing ? (
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-8">
          {/* Mobile View Header - Only visible on mobile */}
          <div className="lg:hidden mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {listing.name}
            </h1>
            <div className="flex items-center gap-2 mb-3 text-slate-600">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span className="text-sm truncate" title={listing.address}>
                {formatAddress(listing.address)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-base font-semibold bg-slate-100 text-slate-900">
                {listing.currency === 'custom' ? listing.customCurrency :
                 listing.currency === 'NPR' ? 'Rs.' :
                 listing.currency === 'USD' ? '$' : '₹'}
                {listing.offer
                  ? (listing.regularPrice - listing.discountPrice).toLocaleString()
                  : listing.regularPrice.toLocaleString()}
                {listing.type === "rent" && " / month"}
              </span>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                For {listing.type === "rent" 
                  ? "Rent" 
                  : listing.type === "lease" 
                  ? "Lease" 
                  : "Sale"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                <Swiper
                  navigation
                  effect="fade"
                  className="rounded-xl listing-swiper"
                  style={{
                    height: "min(50vh, 400px)",
                    minHeight: "250px",
                  }}
                >
                  {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                      <div
                        className="h-full w-full"
                        style={{
                          background: `url(${url}) center/cover no-repeat`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Action buttons container with improved mobile layout */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 flex-wrap">
                  <button
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 group ${
                      favoritesContextIsFavorite(listing._id)
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white/90 text-slate-700 hover:bg-white/75"
                    }`}
                    onClick={handleFavoriteClick}
                  >
                    <Heart
                      className={`h-4 w-4 group-hover:scale-110 transition-transform ${
                        favoritesContextIsFavorite(listing._id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                  
                  {favoritesContextIsFavorite(listing._id) && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/favorites');
                      }}
                      className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 hover:bg-white/75 transition-all duration-300"
                    >
                      View Favorites
                    </button>
                  )}
                </div>

                {/* Share button with mobile optimization */}
                <button
                  className="absolute top-4 left-4 z-20 p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white/75 transition-all duration-300 group"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                >
                  <Share2 className="h-4 w-4 text-slate-700 group-hover:scale-110 transition-transform" />
                </button>

                <div className="absolute bottom-4 left-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                    <Eye className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium">{viewCount} views</span>
                  </div>
                </div>
              </div>

              {/* Desktop-only header */}
              <div className="hidden lg:block space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {listing.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-slate-600">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm truncate" title={listing.address}>
                      {formatAddress(listing.address)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-6 py-2 rounded-full text-lg font-semibold bg-slate-100 text-slate-900">
                    {listing.currency === 'custom' ? listing.customCurrency :
                     listing.currency === 'NPR' ? 'Rs.' :
                     listing.currency === 'USD' ? '$' : '₹'}
                    {listing.offer
                      ? (listing.regularPrice - listing.discountPrice).toLocaleString()
                      : listing.regularPrice.toLocaleString()}
                    {listing.type === "rent" && " / month"}
                  </span>
                  <span className="inline-flex items-center px-6 py-2 rounded-full font-semibold bg-blue-100 text-blue-800">
                    For {listing.type === "rent" 
                      ? "Rent" 
                      : listing.type === "lease" 
                      ? "Lease" 
                      : "Sale"}
                  </span>
                </div>
              </div>

              {/* Mobile-optimized sections */}
              <div className="space-y-4 sm:space-y-6">
                {/* Quick Info Section - Mobile Only */}
                <div className="lg:hidden grid grid-cols-2 gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                  {listing.bedrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bed className="h-5 w-5 text-slate-600" />
                      <span className="text-sm">{listing.bedrooms} Beds</span>
                    </div>
                  )}
                  {listing.bathrooms > 0 && (
                    <div className="flex items-center gap-2">
                      <Bath className="h-5 w-5 text-slate-600" />
                      <span className="text-sm">{listing.bathrooms} Baths</span>
                    </div>
                  )}
                  {listing.totalArea > 0 && (
                    <div className="flex items-center gap-2">
                      <Maximize2 className="h-5 w-5 text-slate-600" />
                      <span className="text-sm">{listing.totalArea} sq ft</span>
                    </div>
                  )}
                  {listing.parking && (
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-slate-600" />
                      <span className="text-sm">Parking</span>
                    </div>
                  )}
                </div>

                {/* Description Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Description</h2>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                {/* Property Details Section */}
                {renderPropertyDetails()}

                {/* Amenities Section */}
                {renderAmenities()}

                {/* Financial Details Section - Mobile Optimized */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Financial Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Regular Price */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-3 bg-slate-100 rounded-lg">
                        <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-slate-600">Regular Price</p>
                        <p className="text-sm sm:text-base font-semibold">
                          {listing.currency === 'custom' ? listing.customCurrency :
                           listing.currency === 'NPR' ? 'Rs.' :
                           listing.currency === 'USD' ? '$' : '₹'}
                          {listing.regularPrice.toLocaleString()}
                          {listing.type === 'rent' && '/month'}
                        </p>
                      </div>
                    </div>

                    {/* Maintenance Fee */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-3 bg-slate-100 rounded-lg">
                        <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-slate-600">Maintenance Fee</p>
                        <p className="text-sm sm:text-base font-semibold">
                          {listing.maintenanceFees > 0 ? (
                            <>
                              {listing.currency === 'custom' ? listing.customCurrency :
                               listing.currency === 'NPR' ? 'Rs.' :
                               listing.currency === 'USD' ? '$' : '₹'}
                              {listing.maintenanceFees.toLocaleString()}
                            </>
                          ) : 'Not Specified'}
                        </p>
                      </div>
                    </div>

                    {/* Security Deposit */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 sm:p-3 bg-slate-100 rounded-lg">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-slate-600">Security Deposit</p>
                        <p className="text-sm sm:text-base font-semibold">
                          {listing.deposit > 0 ? (
                            <>
                              {listing.currency === 'custom' ? listing.customCurrency :
                               listing.currency === 'NPR' ? 'Rs.' :
                               listing.currency === 'USD' ? '$' : '₹'}
                              {listing.deposit.toLocaleString()}
                            </>
                          ) : 'Not Specified'}
                        </p>
                      </div>
                    </div>

                    {/* Minimum Lease Term */}
                    {listing.type === 'rent' && (
                      <div className="flex items-center gap-3">
                        <div className="p-2 sm:p-3 bg-slate-100 rounded-lg">
                          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-slate-600">Minimum Lease Term</p>
                          <p className="text-sm sm:text-base font-semibold">
                            {listing.minLeaseTerm || 'Not Specified'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section - Mobile Optimized */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-4 space-y-4 sm:space-y-6">
                {/* Contact Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0">
                      <img
                        src={listing.userAvatar || "/default-avatar.png"}
                        alt="Landlord"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {listing.userName || "Landlord"}
                      </h3>
                      <p className="text-sm text-gray-500">Property Owner</p>
                    </div>
                    <button
                      onClick={() => setShowLandlordModal(true)}
                      className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Info className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    {currentUser ? (
                      <>
                        <button
                          onClick={() => setShowContactModal(true)}
                          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Contact Landlord
                        </button>
                        <button
                          onClick={() => setShowLandlordModal(true)}
                          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                          View Landlord Info
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNonLoggedUserClick('contact')}
                          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Contact Landlord
                        </button>
                        <button
                          onClick={() => handleNonLoggedUserClick('info')}
                          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                          View Landlord Info
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Location</h2>
                    <div className="relative h-[300px] sm:h-[400px]">
                      <MapContainer
                        center={coordinates}
                        zoom={15}
                        scrollWheelZoom={false}
                        className="h-full w-full rounded-lg"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={coordinates} icon={customMarkerIcon}>
                          <Popup>{listing.address}</Popup>
                        </Marker>
                        <ZoomControl position="bottomright" />
                        <MapClickHandler />
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Modals */}
      {showLandlordModal && (
        <LandlordInfoModal listing={listing} onClose={() => setShowLandlordModal(false)} />
      )}

      {showContactModal && (
        <Contact
          listing={listing}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Alert Message */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg">
            {alertText}
          </div>
        </div>
      )}
    </main>
  );
}
