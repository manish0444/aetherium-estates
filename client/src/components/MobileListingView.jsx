import React, { useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Bath,
  Bed,
  MapPin,
  Share2,
  Info,
  Loader2,
  User,
  Mail,
  Eye,
  Heart,
  Home,
  Maximize2,
  Grid,
  ArrowUpDown,
  Wrench,
  Shield,
  Calendar,
  Check,
  DollarSign,
  Car,
  Clock,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import { formatDistanceToNow } from 'date-fns';

const MobileListingView = ({ 
  listing, 
  loading, 
  error, 
  currentUser,
  handleFavoriteClick,
  favoritesContextIsFavorite,
  setShowLandlordModal,
  setShowContactModal,
  handleNonLoggedUserClick,
  formatAddress,
  viewCount,
  copied,
  setCopied,
  navigate,
  customMarkerIcon
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!listing) return null;

  const createdAt = new Date(listing.createdAt);
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white z-50 px-4 py-3 flex items-center justify-between border-b">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Share2 className="w-6 h-6" />
          </button>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full ${
              favoritesContextIsFavorite(listing._id)
                ? "text-red-500"
                : "hover:bg-gray-100"
            }`}
          >
            <Heart
              className={`w-6 h-6 ${
                favoritesContextIsFavorite(listing._id) ? "fill-current" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="pt-14">
        <div className="relative">
          <Swiper
            navigation
            effect="fade"
            className="aspect-[4/3]"
          >
            {listing.imageUrls.slice(0, showAllImages ? undefined : 5).map((url, index) => (
              <SwiperSlide key={url}>
                <img
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {!showAllImages && listing.imageUrls.length > 5 && (
            <button
              onClick={() => setShowAllImages(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              +{listing.imageUrls.length - 5} more
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {listing.name}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-sm">{formatAddress(listing.address)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{viewCount}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-lg font-semibold bg-slate-100 text-slate-900">
              {listing.currency === 'custom' ? listing.customCurrency :
               listing.currency === 'NPR' ? 'Rs.' :
               listing.currency === 'USD' ? '$' : '₹'}
              {listing.offer
                ? (listing.regularPrice - listing.discountPrice).toLocaleString()
                : listing.regularPrice.toLocaleString()}
              {listing.type === "rent" && " / month"}
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full font-semibold bg-blue-100 text-blue-800">
              For {listing.type === "rent" 
                ? "Rent" 
                : listing.type === "lease" 
                ? "Lease" 
                : "Sale"}
            </span>
          </div>

          {listing.offer && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-emerald-600 mt-0.5" />
              <div>
                <p className="text-emerald-700 text-sm">
                  Save {listing.currency === 'custom' ? listing.customCurrency :
                       listing.currency === 'NPR' ? 'Rs.' :
                       listing.currency === 'USD' ? '$' : '₹'}
                  {listing.discountPrice.toLocaleString()} on this property
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section Navigation */}
        <div className="flex overflow-x-auto gap-4 pb-2 -mx-4 px-4 border-b">
          {['overview', 'details', 'amenities', 'location'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-4 py-2 font-medium whitespace-nowrap ${
                activeSection === section
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {activeSection === 'overview' && (
            <>
              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className={`text-gray-600 leading-relaxed ${
                  !showFullDescription && 'line-clamp-3'
                }`}>
                  {listing.description}
                </p>
                {listing.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-blue-600 font-medium flex items-center gap-1"
                  >
                    {showFullDescription ? (
                      <>Show less <ChevronUp className="w-4 h-4" /></>
                    ) : (
                      <>Show more <ChevronDown className="w-4 h-4" /></>
                    )}
                  </button>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                {listing.bedrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Bed className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Bedrooms</p>
                      <p className="font-medium">{listing.bedrooms}</p>
                    </div>
                  </div>
                )}

                {listing.bathrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Bath className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Bathrooms</p>
                      <p className="font-medium">{listing.bathrooms}</p>
                    </div>
                  </div>
                )}

                {listing.totalArea > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Maximize2 className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Area</p>
                      <p className="font-medium">{listing.totalArea} sq ft</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Listed</p>
                    <p className="font-medium">{timeAgo}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'details' && (
            <div className="space-y-6">
              {/* Property Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Home className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Property Type</p>
                      <p className="font-medium capitalize">
                        {listing.propertyType}
                      </p>
                    </div>
                  </div>

                  {listing.builtUpArea > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Grid className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Built-up Area</p>
                        <p className="font-medium">{listing.builtUpArea} sq ft</p>
                      </div>
                    </div>
                  )}

                  {listing.floorNumber && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <ArrowUpDown className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Floor</p>
                        <p className="font-medium">{listing.floorNumber}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Car className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Parking</p>
                      <p className="font-medium">
                        {listing.parking ? 'Available' : 'Not Available'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Financial Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Regular Price</p>
                      <p className="font-medium">
                        {listing.currency === 'custom' ? listing.customCurrency :
                         listing.currency === 'NPR' ? 'Rs.' :
                         listing.currency === 'USD' ? '$' : '₹'}
                        {listing.regularPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {listing.maintenanceFees > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Wrench className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Maintenance</p>
                        <p className="font-medium">
                          {listing.currency === 'custom' ? listing.customCurrency :
                           listing.currency === 'NPR' ? 'Rs.' :
                           listing.currency === 'USD' ? '$' : '₹'}
                          {listing.maintenanceFees.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {listing.deposit > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Shield className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Security Deposit</p>
                        <p className="font-medium">
                          {listing.currency === 'custom' ? listing.customCurrency :
                           listing.currency === 'NPR' ? 'Rs.' :
                           listing.currency === 'USD' ? '$' : '₹'}
                          {listing.deposit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Payment</p>
                      <p className="font-medium capitalize">
                        {listing.paymentFrequency || 'Monthly'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'amenities' && listing.amenities && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(listing.amenities)
                  .filter(([_, value]) => value)
                  .map(([key]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeSection === 'location' && (
            <div className="h-[300px]">
              <MapContainer
                className="h-full w-full rounded-lg"
                center={[listing.latitude, listing.longitude]}
                zoom={15}
                scrollWheelZoom={false}
                dragging={true}
                doubleClickZoom={true}
                zoomControl={false}
              >
                <ZoomControl position="bottomright" />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker 
                  position={[listing.latitude, listing.longitude]} 
                  icon={customMarkerIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <img 
                        src={listing.imageUrls[0]} 
                        alt={listing.name}
                        className="w-24 h-20 object-cover rounded mb-2"
                      />
                      <p className="font-medium text-sm">{listing.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatAddress(listing.address)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      {listing?.userRef !== currentUser?._id && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3">
          <button
            onClick={() =>
              currentUser
                ? setShowLandlordModal(true)
                : handleNonLoggedUserClick("profile")
            }
            className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <User className="w-5 h-5" />
            View Landlord
          </button>
          <button
            onClick={() =>
              currentUser
                ? setShowContactModal(true)
                : handleNonLoggedUserClick("contact")
            }
            className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Contact
          </button>
        </div>
      )}

      {/* Copy Link Toast */}
      {copied && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-lg text-sm">
          Link copied!
        </div>
      )}
    </div>
  );
};

export default MobileListingView; 