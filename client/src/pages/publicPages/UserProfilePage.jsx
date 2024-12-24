import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  MapPin, Mail, Phone, Calendar, 
  ListChecks, Eye, Star, Activity,
  Building2, DollarSign, Heart, Share2, Trophy
} from 'lucide-react';
import { RoleBadge } from '../../components/RoleBadge';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Starting to fetch user data for ID:', userId);
        if (!userId) {
          console.log('No userId provided');
          setError('User ID is required');
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Fetch user data
        console.log('Fetching user data...');
        const userRes = await fetch(`/api/user/${userId}`);
        const userData = await userRes.json();
        console.log('User data response:', userData);
        
        if (!userRes.ok) {
          console.error('User fetch failed:', userData);
          throw new Error(userData.message || 'Failed to fetch user data');
        }

        setUserData(userData);

        // Fetch user's listings
        console.log('Fetching user listings...');
        try {
          const listingsRes = await fetch(`/api/user/listings/${userId}`);
          const listingsData = await listingsRes.json();
          console.log('Listings data response:', listingsData);

          if (listingsRes.ok) {
            setUserListings(Array.isArray(listingsData) ? listingsData : []);
          } else {
            console.warn('Failed to fetch listings:', listingsData);
            setUserListings([]);
          }
        } catch (listingError) {
          console.error('Error fetching listings:', listingError);
          setUserListings([]);
        }

        // Fetch reviews if user is an agent
        if (userData.role === 'agent') {
          console.log('Fetching agent reviews...');
          try {
            const reviewsRes = await fetch(`/api/user/reviews/${userId}`);
            if (reviewsRes.ok) {
              const reviewsData = await reviewsRes.json();
              console.log('Reviews data response:', reviewsData);
              setReviews(reviewsData);
            } else {
              setReviews([]);
            }
          } catch (reviewError) {
            console.error('Error fetching reviews:', reviewError);
            setReviews([]);
          }
        }

        console.log('All data fetched successfully');
      } catch (err) {
        console.error('Error in fetchUserData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    console.log('UserProfilePage mounted with userId:', userId);
    if (userId) {
      fetchUserData();
    } else {
      setLoading(false);
      setError('User ID is required');
    }
  }, [userId]);

  // Add loading state logging
  useEffect(() => {
    console.log('Current state:', {
      loading,
      error,
      userData: userData ? 'exists' : 'null',
      listingsCount: userListings.length,
      reviewsCount: reviews.length
    });
  }, [loading, error, userData, userListings, reviews]);

  const renderAdminDashboard = () => {
    if (userData?.role === 'admin') {
      return (
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-6">Administrative Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-900 mb-2">Managed Properties</h3>
              <p className="text-2xl font-bold text-purple-700">
                {userData.adminStats?.totalManaged || 0}
              </p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-indigo-900 mb-2">Recent Activity</h3>
              <div className="space-y-2">
                {userData.adminStats?.recentActivity?.map((activity, index) => (
                  <p key={index} className="text-sm text-indigo-700">
                    {activity.action}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Access Level</h3>
              <p className="text-lg font-semibold text-blue-700">Full Administrative</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
          <p className="text-sm text-gray-500 mt-2">User ID: {userId}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-semibold mb-2">User not found</p>
          <p className="text-sm text-gray-400">ID: {userId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced User Profile Header */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="p-6 -mt-20">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <img
                src={userData.photo || "/default-avatar.png"}
                alt={userData.username}
                className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
              />
              
              {/* User Info */}
              <div className="pt-14">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">{userData.username}</h1>
                  <RoleBadge role={userData.role} />
                  {userData.isVerified && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {userData.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{userData.email}</span>
                    </div>
                  )}
                  {userData.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  {userData.address && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.address}</span>
                    </div>
                  )}
                  {userData.experience > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{userData.experience} years experience</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold">{userListings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">
                  {userListings.reduce((acc, listing) => acc + (listing.views || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          {userData.role === 'agent' && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reviews</p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Likes</p>
                    <p className="text-2xl font-bold">{userData.likesCount || 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Agent Specific Information */}
        {userData.role === 'agent' && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">Agent Information</h2>
            
            {userData.bio && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">About</h3>
                <p className="text-gray-800">{userData.bio}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userData.specialization && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Specialization</h3>
                  <div className="flex gap-2 flex-wrap">
                    {userData.specialization.split(',').map((spec, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {spec.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {userData.languages && userData.languages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Languages</h3>
                  <div className="flex gap-2 flex-wrap">
                    {userData.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews Section for Agents */}
        {userData.role === 'agent' && reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={review.user.photo || "/default-avatar.png"}
                      alt={review.user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{review.user.username}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Listings Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Listed Properties</h2>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {userListings.length} {userListings.length === 1 ? 'Property' : 'Properties'}
            </span>
          </div>
          
          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <Link
                  key={listing._id}
                  to={`/listing/${listing._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={listing.imageUrls[0]}
                        alt={listing.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black/50 text-white rounded-full text-sm">
                          {listing.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {listing.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">{listing.address}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-semibold">
                          ${listing.regularPrice.toLocaleString()}
                          {listing.type === 'rent' && '/month'}
                        </span>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Eye className="w-4 h-4" />
                          <span>{listing.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No listings available</p>
              <p className="text-sm text-gray-400">
                This user hasn't posted any properties yet
              </p>
            </div>
          )}
        </div>

        {renderAdminDashboard()}
      </div>
    </div>
  );
} 