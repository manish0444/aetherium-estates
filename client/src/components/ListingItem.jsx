import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Home, Eye } from 'lucide-react';

export default function ListingItem({ listing }) {
  // Add a type badge only if it's a rental property
  const renderTypeBadge = () => {
    return (
      <div className="absolute top-2 right-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
          listing.type === 'rent' 
            ? 'bg-blue-500 text-white' 
            : listing.type === 'sale'
            ? 'bg-purple-500 text-white'
            : listing.type === 'lease'
            ? 'bg-green-500 text-white'
            : 'bg-gray-500 text-white'
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
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <Link to={`/listing/${listing._id}`} className="block">
        <div className="relative aspect-video">
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="w-full h-full object-cover"
          />

          {/* Only show offer badge if there's a discount */}
          {listing.offer && (
            <div className="absolute top-2 left-2">
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium shadow-lg">
                {((listing.regularPrice - listing.discountPrice) / listing.regularPrice * 100).toFixed(0)}% OFF
              </span>
            </div>
          )}

          {/* Type badge only for rentals */}
          {renderTypeBadge()}

          {/* Views Counter */}
          <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{listing.views || 0}</span>
          </div>
        </div>

        <div className="p-4">
          {/* Title and Price */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {listing.name}
            </h3>
            <div className="flex flex-col items-end">
              <span className="text-green-600 font-semibold whitespace-nowrap">
                Rs.{listing.offer 
                  ? (listing.regularPrice - listing.discountPrice).toLocaleString()
                  : listing.regularPrice.toLocaleString()}
                {listing.type === 'rent' && '/mo'}
              </span>
              {listing.offer && (
                <span className="text-sm text-gray-500 line-through">
                  Rs.{listing.regularPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{listing.address}</span>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-3 gap-2">
            {listing.bedrooms > 0 && (
              <div className="flex items-center text-gray-600 text-sm">
                <Bed className="w-4 h-4 mr-1" />
                <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}
            {listing.bathrooms > 0 && (
              <div className="flex items-center text-gray-600 text-sm">
                <Bath className="w-4 h-4 mr-1" />
                <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}
            {listing.totalArea > 0 && (
              <div className="flex items-center text-gray-600 text-sm">
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