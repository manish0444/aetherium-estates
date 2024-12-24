import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Heart, MapPin, Bed, Bath, Currency } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useFavorites } from '../../context/FavoritesContext';

export default function Favorites() {
  const { currentUser } = useSelector((state) => state.user);
  const { favorites } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-6 h-6 text-red-500" />
        <h1 className="text-2xl font-bold text-slate-900">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-slate-50 rounded-lg p-8 text-center">
          <p className="text-slate-600">You haven't added any properties to your favorites yet.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <Link
              key={property._id}
              to={`/listing/${property._id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative">
                <img
                  src={property.imageUrls[0]}
                  alt={property.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute top-4 right-4">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  {property.name}
                </h3>
                
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}</span>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4 text-slate-400" />
                    <span className="text-sm">{property.bathrooms}</span>
                  </div>
                </div>
                
                <div className="font-semibold text-lg">
                  Rs. {property.offer 
                    ? property.regularPrice - property.discountPrice 
                    : property.regularPrice}
                  {property.type === "rent" && " / month"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}