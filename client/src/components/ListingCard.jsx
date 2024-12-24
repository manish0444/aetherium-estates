import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ListingCard({ listing, onDelete }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/50 text-white rounded-full text-sm">
            {listing.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{listing.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{listing.address}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-semibold">
            ${listing.regularPrice.toLocaleString()}
            {listing.type === 'rent' && '/month'}
          </span>
          
          <div className="flex gap-2">
            <Link
              to={`/update-listing/${listing._id}`}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <FaEdit />
            </Link>
            <button
              onClick={() => onDelete(listing._id)}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 