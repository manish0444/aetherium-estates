import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Home, Tag, Eye, Video } from 'lucide-react';

const EnhancedPropertyListing = ({ listings, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {!loading && listings.map((listing) => (
        <motion.div
          key={listing._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300"
        >
          <Link to={`/listing/${listing._id}`}>
            <div className="relative aspect-[4/3]">
              <img
                src={listing.imageUrls[0]}
                alt={listing.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Offer Badge */}
              {listing.offer && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  Special Offer
                </div>
              )}

              {/* Type Badge */}
              <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
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
              </div>

              {/* Views Counter and Video Icon */}
              <div className="absolute bottom-2 right-2 flex gap-2">
                <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{listing.views || 0}</span>
                </div>
                {listing.videoUrl && (
                  <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg">
                    <Video className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {listing.name}
                </h3>
                <div className="flex items-center text-green-600 font-semibold whitespace-nowrap">
                  Rs.{listing.offer 
                    ? (listing.regularPrice - listing.discountPrice).toLocaleString()
                    : listing.regularPrice.toLocaleString()}
                  {listing.type === 'rent' && '/mo'}
                </div>
              </div>

              <div className="flex items-center text-gray-500 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="line-clamp-1">{listing.address}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex items-center text-gray-600 text-sm">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{listing.bedrooms} Beds</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{listing.bathrooms} Baths</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Home className="w-4 h-4 mr-1" />
                  <span>{listing.totalArea} sq.ft</span>
                </div>
              </div>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-2">
                {listing.furnished && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    Furnished
                  </span>
                )}
                {listing.parking && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    Parking
                  </span>
                )}
                {listing.offer && (
                  <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">
                    Save Rs.{listing.discountPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      {/* Loading State */}
      {loading && (
        <div className="col-span-full flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="max-w-md mx-auto">
            <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search filters or explore different criteria
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPropertyListing;