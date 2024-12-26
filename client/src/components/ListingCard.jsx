import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ListingCard({ listing, onDelete }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking edit or delete buttons
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/listing/${listing._id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="relative aspect-[4/3]">
        <img
          src={listing.imageUrls[0]}
          alt={listing.name}
          className="w-full h-full object-cover"
        />
        {onDelete && (
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <Link
              to={`/update-listing/${listing._id}`}
              className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(listing._id);
              }}
              className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{listing.name}</h3>
        <p className="text-gray-500 text-sm truncate">{listing.address}</p>
        <div className="mt-2">
          <p className="text-lg font-bold">
            ${listing.regularPrice.toLocaleString()}
            {listing.type === 'rent' && ' /month'}
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <span>{listing.bedrooms} beds</span>
            <span>•</span>
            <span>{listing.bathrooms} baths</span>
          </div>
        </div>
      </div>
    </div>
  );
} 