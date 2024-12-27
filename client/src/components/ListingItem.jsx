import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Home, Eye, Video, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ListingItem({ listing }) {
  const { isDarkMode } = useTheme();

  // Truncate address to exactly 4 words
  const truncateAddress = (address) => {
    if (!address) return '';
    const words = address.split(' ');
    return words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
  };

  const renderTypeBadge = () => {
    return (
      <div className="absolute top-2 right-2 z-10">
        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
          listing.type === 'rent' 
            ? 'bg-blue-500/90 text-white' 
            : listing.type === 'sale'
            ? 'bg-purple-500/90 text-white'
            : listing.type === 'lease'
            ? 'bg-green-500/90 text-white'
            : 'bg-gray-500/90 text-white'
        }`}>
          {listing.type === 'rent' 
            ? 'For Rent' 
            : listing.type === 'sale'
            ? 'For Sale'
            : listing.type === 'lease'
            ? 'For Lease'
            : 'Unknown'}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}
    >
      <Link to={`/listing/${listing._id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges Container */}
          <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
            {/* Left side badges */}
            <div className="space-y-2">
              {listing.offer && (
                <span className="inline-block px-3 py-1 bg-green-500/90 text-white rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
                  {((listing.regularPrice - listing.discountPrice) / listing.regularPrice * 100).toFixed(0)}% OFF
                </span>
              )}
            </div>
            {/* Right side badge */}
            {renderTypeBadge()}
          </div>

          {/* Bottom Stats */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-white text-sm">
                <Eye className="w-4 h-4" />
                <span>{listing.views || 0}</span>
              </div>
              {listing.videoUrl && (
                <div className="flex items-center gap-1 text-white text-sm">
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </div>
              )}
            </div>
            <Heart className="w-5 h-5 text-white hover:text-red-500 transition-colors cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className={`font-semibold text-lg line-clamp-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {listing.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className={`font-semibold whitespace-nowrap ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                Rs.{listing.offer 
                  ? (listing.regularPrice - listing.discountPrice).toLocaleString()
                  : listing.regularPrice.toLocaleString()}
                {listing.type === 'rent' && '/mo'}
              </span>
              {listing.offer && (
                <span className={`text-sm line-through ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  Rs.{listing.regularPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className={`flex items-center text-sm mb-3 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-500'
          }`}>
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{truncateAddress(listing.address)}</span>
          </div>

          {/* Property Details */}
          <div className={`grid grid-cols-3 gap-2 py-3 mt-3 border-t ${
            isDarkMode ? 'border-slate-700' : 'border-gray-100'
          }`}>
            {listing.bedrooms > 0 && (
              <div className={`flex items-center text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                <Bed className="w-4 h-4 mr-1" />
                <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}
            {listing.bathrooms > 0 && (
              <div className={`flex items-center text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                <Bath className="w-4 h-4 mr-1" />
                <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}
            {listing.totalArea > 0 && (
              <div className={`flex items-center text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                <Home className="w-4 h-4 mr-1" />
                <span>{listing.totalArea} sq.ft</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}