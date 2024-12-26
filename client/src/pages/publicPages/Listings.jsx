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
  Clock,
  MapPinned,
  Ruler,
  Users,
  MessageCircle
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
import { formatDistanceToNow } from 'date-fns';

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
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [showMobileGallery, setShowMobileGallery] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

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

  // Format address for mobile view
  const formatAddress = (address) => {
    const parts = address.split(',');
    return {
      main: parts[0],
      secondary: parts.slice(1).join(',').trim()
    };
  };

  // Mobile share handler
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.name,
          text: `Check out this property: ${listing.name}`,
          url: window.location.href
        });
      } catch (err) {
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : listing ? (
        <>
          {/* Mobile View */}
          <div className="lg:hidden">
            {/* Mobile Header */}
            <div className="relative">
              <Swiper
                navigation
                effect="fade"
                className="h-[300px]"
              >
                {listing.imageUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className="h-full w-full bg-center bg-cover"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Mobile Header Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/90 shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowMobileGallery(true)}
                  className="p-2 rounded-full bg-white/90 shadow-lg"
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Content */}
            <div className="px-4 py-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{listing.name}</h1>
                <div className="mt-2 flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <div>
                    <p className="font-medium">{formatAddress(listing.address).main}</p>
                    <p className="text-sm">{formatAddress(listing.address).secondary}</p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y">
                <div className="text-center">
                  <Bed className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <span className="text-sm font-medium">{listing.bedrooms} Beds</span>
                </div>
                <div className="text-center">
                  <Bath className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <span className="text-sm font-medium">{listing.bathrooms} Baths</span>
                </div>
                <div className="text-center">
                  <Maximize2 className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                  <span className="text-sm font-medium">
                    {listing.area || 'N/A'} sq.ft
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${listing.regularPrice.toLocaleString()}
                      {listing.type === 'rent' && '/month'}
                    </p>
                  </div>
                  {listing.offer && (
                    <div className="bg-green-50 px-3 py-1 rounded-full">
                      <p className="text-green-700 font-medium">
                        Save ${listing.discountPrice.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Property Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{listing.propertyType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{listing.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">
                      Listed {formatDistanceToNow(new Date(listing.createdAt))} ago
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">{listing.views} views</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Map Toggle Button */}
              <button
                onClick={() => setShowMobileMap(!showMobileMap)}
                className="w-full py-3 px-4 bg-white border rounded-lg flex items-center justify-center gap-2"
              >
                <MapPinned className="w-5 h-5" />
                {showMobileMap ? 'Hide Map' : 'Show Map'}
              </button>

              {/* Collapsible Map */}
              {showMobileMap && (
                <div className="h-[300px] rounded-lg overflow-hidden">
                  <MapContainer
                    center={[listing.latitude, listing.longitude]}
                    zoom={15}
                    className="h-full w-full"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[listing.latitude, listing.longitude]}>
                      <Popup>{listing.address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}

              {/* Contact Buttons */}
              {listing?.userRef !== currentUser?._id && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg">
                  <div className="flex gap-2">
                    <button
                      onClick={() => currentUser ? setShowLandlordModal(true) : handleNonLoggedUserClick("profile")}
                      className="flex-1 py-3 px-4 bg-white border border-gray-300 rounded-lg font-medium"
                    >
                      View Landlord Info
                    </button>
                    <button
                      onClick={() => currentUser ? setShowContactModal(true) : handleNonLoggedUserClick("contact")}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium"
                    >
                      Contact Landlord
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop View - Keep Existing Code */}
          <div className="hidden lg:block">
            {/* Your existing desktop view code */}
          </div>

          {/* Modals */}
          {showLandlordModal && (
            <LandlordInfoModal
              listing={listing}
              onClose={() => setShowLandlordModal(false)}
            />
          )}

          {showContactModal && (
            <Contact 
              listing={listing}
              onClose={() => setShowContactModal(false)}
            />
          )}

          {/* Mobile Gallery Modal */}
          {showMobileGallery && (
            <div className="fixed inset-0 bg-black z-50">
              <div className="relative h-full">
                <button
                  onClick={() => setShowMobileGallery(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <Swiper
                  navigation
                  className="h-full"
                  initialSlide={activeImageIndex}
                >
                  {listing.imageUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                      <div className="h-full flex items-center justify-center">
                        <img
                          src={url}
                          alt={`Property ${index + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          )}
        </>
      ) : null}

      {showAlert && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-fade-in">
          <p>{alertText}</p>
        </div>
      )}

      {showShareOptions && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out animate-fade-in">
          <p>Share options not available</p>
        </div>
      )}
    </main>
  );
}
