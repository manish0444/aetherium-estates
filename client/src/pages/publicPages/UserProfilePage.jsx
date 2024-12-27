import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  MapPin, Mail, Phone, Calendar, 
  ListChecks, Eye, Star, Activity,
  Building2, DollarSign, ThumbsUp, Share2, Trophy,
  ThumbsDown, Edit2, Trash2, MessageCircle, Check, X
} from 'lucide-react';
import { RoleBadge } from '../../components/RoleBadge';

export default function UserProfilePage() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const { currentUser } = useSelector((state) => state.user);
  const [editingReview, setEditingReview] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [replyForm, setReplyForm] = useState({
    reviewId: null,
    text: ''
  });

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

          // Fetch likes count and status
          try {
            const likesRes = await fetch(`/api/user/likes/${userId}`);
            const likesData = await likesRes.json();
            setLikesCount(likesData.likes);

            if (currentUser) {
              const likeStatusRes = await fetch(`/api/user/like/status/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${currentUser.token}`
                }
              });
              const likeStatusData = await likeStatusRes.json();
              setIsLiked(likeStatusData.isLiked);
            }
          } catch (likeError) {
            console.error('Error fetching likes:', likeError);
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
  }, [userId, currentUser]);

  const handleLikeToggle = async () => {
    if (!currentUser) {
      // Show sign-in prompt or redirect to login
      return;
    }

    try {
      const response = await fetch(`/api/user/like/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
        setLikesCount(prev => data.liked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      return;
    }

    try {
      const response = await fetch(`/api/user/review/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(reviewForm)
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews(prev => [newReview.review, ...prev]);
        setReviewForm({ rating: 5, comment: '' });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

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

  const handleEditReview = async (reviewId, updatedData) => {
    try {
      const response = await fetch(`/api/user/review/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        const { review } = await response.json();
        setReviews(prev => prev.map(r => r._id === reviewId ? review : r));
        setEditingReview(null);
      }
    } catch (error) {
      console.error('Error editing review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const response = await fetch(`/api/user/review/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (response.ok) {
        setReviews(prev => prev.filter(r => r._id !== reviewId));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleReplySubmit = async (reviewId) => {
    try {
      const response = await fetch(`/api/user/review/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ text: replyForm.text })
      });

      if (response.ok) {
        const { reply } = await response.json();
        setReviews(prev => prev.map(r => {
          if (r._id === reviewId) {
            return { ...r, replies: [...r.replies, reply] };
          }
          return r;
        }));
        setReplyForm({ reviewId: null, text: '' });
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const handleEditReply = async (reviewId, replyId, text) => {
    try {
      const response = await fetch(`/api/user/review/${reviewId}/reply/${replyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const { review } = await response.json();
        setReviews(prev => prev.map(r => r._id === reviewId ? review : r));
        setEditingReply(null);
      }
    } catch (error) {
      console.error('Error editing reply:', error);
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      const response = await fetch(`/api/user/review/${reviewId}/reply/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });

      if (response.ok) {
        setReviews(prev => prev.map(r => {
          if (r._id === reviewId) {
            return { ...r, replies: r.replies.filter(reply => reply._id !== replyId) };
          }
          return r;
        }));
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleReaction = async (reviewId, replyId = null, reaction) => {
    try {
      const endpoint = replyId 
        ? `/api/user/review/${reviewId}/reply/${replyId}/reaction`
        : `/api/user/review/${reviewId}/reaction`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({ reaction })
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(prev => prev.map(r => {
          if (r._id === reviewId) {
            if (replyId) {
              return {
                ...r,
                replies: r.replies.map(reply => {
                  if (reply._id === replyId) {
                    return {
                      ...reply,
                      likes: data.likes,
                      dislikes: data.dislikes,
                      userReaction: data.userReaction
                    };
                  }
                  return reply;
                })
              };
            }
            return {
              ...r,
              likes: data.likes,
              dislikes: data.dislikes,
              userReaction: data.userReaction
            };
          }
          return r;
        }));
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ThumbsUp className={`w-6 h-6 ${isLiked ? 'text-blue-600 fill-blue-600' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Likes</p>
                      <p className="text-2xl font-bold">{likesCount}</p>
                    </div>
                  </div>
                  {currentUser && currentUser._id !== userId && (
                    <button
                      onClick={handleLikeToggle}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isLiked 
                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-blue-600' : ''}`} />
                    </button>
                  )}
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

        {/* Add Review Form */}
        {userData?.role === 'agent' && currentUser && currentUser._id !== userId && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">Write a Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewForm.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Write your review here..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        {/* Reviews Section */}
        {userData?.role === 'agent' && reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6">Reviews</h2>
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
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
                          {review.isEdited && (
                            <span className="text-xs text-gray-500 ml-2">
                              (edited {new Date(review.editedAt).toLocaleDateString()})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {currentUser && currentUser._id === review.user._id && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingReview(review)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingReview?._id === review._id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditReview(review._id, {
                          rating: editingReview.rating,
                          comment: editingReview.comment
                        });
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditingReview(prev => ({ ...prev, rating: star }))}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= editingReview.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={editingReview.comment}
                        onChange={(e) => setEditingReview(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingReview(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="text-gray-600 mb-4">{review.comment}</p>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReaction(review._id, null, 'like')}
                            className={`p-1 rounded-full ${
                              review.userReaction === 'like'
                                ? 'bg-blue-100 text-blue-600'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <ThumbsUp className={`w-4 h-4 ${
                              review.userReaction === 'like' ? 'fill-blue-600' : ''
                            }`} />
                          </button>
                          <span className="text-sm text-gray-600">{review.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReaction(review._id, null, 'dislike')}
                            className={`p-1 rounded-full ${
                              review.userReaction === 'dislike'
                                ? 'bg-red-100 text-red-600'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <ThumbsDown className={`w-4 h-4 ${
                              review.userReaction === 'dislike' ? 'fill-red-600' : ''
                            }`} />
                          </button>
                          <span className="text-sm text-gray-600">{review.dislikes?.length || 0}</span>
                        </div>
                        {currentUser && (
                          <button
                            onClick={() => setReplyForm({ reviewId: review._id, text: '' })}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Reply
                          </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* Reply Form */}
                  {replyForm.reviewId === review._id && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleReplySubmit(review._id);
                      }}
                      className="ml-12 mb-4"
                    >
                      <textarea
                        value={replyForm.text}
                        onChange={(e) => setReplyForm(prev => ({ ...prev, text: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows="2"
                        placeholder="Write your reply..."
                        required
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setReplyForm({ reviewId: null, text: '' })}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          Reply
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Replies */}
                  {review.replies?.length > 0 && (
                    <div className="ml-12 space-y-4">
                      {review.replies.map((reply) => (
                        <div key={reply._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={reply.user.photo || "/default-avatar.png"}
                                alt={reply.user.username}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="font-medium text-sm">{reply.user.username}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                  {reply.isEdited && ' (edited)'}
                                </p>
                              </div>
                            </div>
                            {currentUser && currentUser._id === reply.user._id && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingReply(reply)}
                                  className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                  <Edit2 className="w-3 h-3 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => handleDeleteReply(review._id, reply._id)}
                                  className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </button>
                              </div>
                            )}
                          </div>

                          {editingReply?._id === reply._id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editingReply.text}
                                onChange={(e) => setEditingReply(prev => ({ ...prev, text: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                rows="2"
                                required
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingReply(null)}
                                  className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                  <X className="w-4 h-4 text-gray-500" />
                                </button>
                                <button
                                  onClick={() => handleEditReply(review._id, reply._id, editingReply.text)}
                                  className="p-1 hover:bg-gray-200 rounded-full"
                                >
                                  <Check className="w-4 h-4 text-green-500" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-600 mb-2">{reply.text}</p>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleReaction(review._id, reply._id, 'like')}
                                    className={`p-1 rounded-full ${
                                      reply.userReaction === 'like'
                                        ? 'bg-blue-100 text-blue-600'
                                        : 'hover:bg-gray-200'
                                    }`}
                                  >
                                    <ThumbsUp className={`w-3 h-3 ${
                                      reply.userReaction === 'like' ? 'fill-blue-600' : ''
                                    }`} />
                                  </button>
                                  <span className="text-xs text-gray-600">{reply.likes?.length || 0}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleReaction(review._id, reply._id, 'dislike')}
                                    className={`p-1 rounded-full ${
                                      reply.userReaction === 'dislike'
                                        ? 'bg-red-100 text-red-600'
                                        : 'hover:bg-gray-200'
                                    }`}
                                  >
                                    <ThumbsDown className={`w-3 h-3 ${
                                      reply.userReaction === 'dislike' ? 'fill-red-600' : ''
                                    }`} />
                                  </button>
                                  <span className="text-xs text-gray-600">{reply.dislikes?.length || 0}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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