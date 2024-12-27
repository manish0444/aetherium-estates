import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/user/userSlice";
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";
import { ListChecks, Eye, Star, Check, Clock, Ban, Tag, MoreVertical } from "lucide-react";
import { Building2, Heart } from "lucide-react";
import ProfileHeader from "../../components/ProfileHeader";
import StatsCard from "../../components/StatsCard";

const getStatusBadge = (status, type) => {
  const badges = {
    available: { bg: 'bg-green-100', text: 'text-green-700', icon: Check },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
    booked: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Tag },
    sold: { bg: 'bg-purple-100', text: 'text-purple-700', icon: Tag },
    rented: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Tag },
    leased: { bg: 'bg-teal-100', text: 'text-teal-700', icon: Tag },
    unavailable: { bg: 'bg-red-100', text: 'text-red-700', icon: Ban },
  };

  const badge = badges[status] || badges.available;
  const Icon = badge.icon;

  return (
    <span className={`px-2 py-1 rounded-full ${badge.bg} ${badge.text} text-xs font-medium flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">
        {status === 'available' ? type === 'rent' ? 'For Rent' : type === 'sale' ? 'For Sale' : 'For Lease' : status}
      </span>
    </span>
  );
};

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [userStats, setUserStats] = useState({
    totalListings: 0,
    totalViews: 0,
    averageRating: 0,
    totalLikes: 0,
    reviewsCount: 0
  });
  const [listingsLoading, setListingsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await fetch(`/api/user/stats/${currentUser._id}`);
        if (res.ok) {
          const data = await res.json();
          setUserStats(data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (currentUser) {
      fetchUserStats();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchUserListings = async () => {
      if (!currentUser?._id) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        
        if (res.ok) {
          setUserListings(data || []);
        } else {
          setError(data.message || 'Failed to fetch listings');
          setUserListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to fetch listings');
        setUserListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?._id && activeTab === 'listings') {
      fetchUserListings();
    }
  }, [currentUser?._id, activeTab]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      
      // Immediately update user with new photo
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photo: base64 }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message);
      }

      dispatch(updateUserSuccess(data));
      setFormData(prev => ({ ...prev, photo: base64 }));
    } catch (error) {
      console.error('Error updating profile photo:', error);
      setFileUploadError(true);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: base64 }),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListings = async (pageNum = page) => {
    try {
      setListingsLoading(true);
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}?page=${pageNum}&limit=${pageSize}`);
      const data = await res.json();
      
      if (pageNum === 1) {
        setUserListings(data.listings);
      } else {
        setUserListings(prev => [...prev, ...data.listings]);
      }
      
      setHasMore(data.listings.length === pageSize);
      setPage(pageNum);
    } catch (error) {
      setShowListingsError(true);
    } finally {
      setListingsLoading(false);
    }
  };

  const loadMore = () => {
    if (!listingsLoading && hasMore) {
      handleShowListings(page + 1);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Failed to delete listing:", data.message);
        return;
      }
      
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
    }
  };

  const handleStatusUpdate = async (listingId, status) => {
    try {
      const res = await fetch(`/api/listing/update/${listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setUserListings(prev => prev.map(listing => 
        listing._id === listingId ? { ...listing, status } : listing
      ));
    } catch (error) {
      setError("Failed to update listing status");
    }
  };

  // Convert userStats object to array for mapping
  const statsArray = [
    {
      title: "Total Listings",
      value: userStats.totalListings,
      icon: ListChecks,
      color: "blue"
    },
    {
      title: "Total Views",
      value: userStats.totalViews,
      icon: Eye,
      color: "green"
    },
    {
      title: "Average Rating",
      value: `${userStats.averageRating} (${userStats.reviewsCount})`,
      icon: Star,
      color: "yellow"
    },
    {
      title: "Total Likes",
      value: userStats.totalLikes,
      icon: Heart,
      color: "red"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader
        currentUser={currentUser}
        formData={formData}
        fileRef={fileRef}
        handleFileUpload={handleFileUpload}
        fileUploadError={fileUploadError}
      />

      <div className="container mx-auto px-4 mt-24">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-md">
            {['Profile', 'Listings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.toLowerCase()
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsArray.map((stat) => (
            <StatsCard 
              key={stat.title}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              color={stat.color}
            />
          ))}
        </div>

        {activeTab === 'profile' ? (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
            {/* Profile Form Sections */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username*
                  </label>
                  <input
                    type="text"
                    id="username"
                    onChange={handleChange}
                    defaultValue={currentUser?.username}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    onChange={handleChange}
                    defaultValue={currentUser?.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email"
                  />
                </div>
              </div>
            </div>

            {currentUser?.role === 'agent' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Agent Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      onChange={handleChange}
                      defaultValue={currentUser?.bio}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      onChange={handleChange}
                      defaultValue={currentUser?.specialization}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (years)
                    </label>
                    <input
                      type="text"
                      id="experience"
                      onChange={handleChange}
                      defaultValue={currentUser?.experience}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Languages (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="languages"
                      onChange={(e) => setFormData({
                        ...formData,
                        languages: e.target.value.split(',').map(lang => lang.trim())
                      })}
                      defaultValue={currentUser?.languages?.join(', ')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="certifications"
                      onChange={(e) => setFormData({
                        ...formData,
                        certifications: e.target.value.split(',').map(cert => cert.trim())
                      })}
                      defaultValue={currentUser?.certifications?.join(', ')}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <ReactLoading type="spin" color="#ffffff" height={20} width={20} className="mx-auto" />
              ) : (
                'Update Profile'
              )}
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* Listings Section */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Listings</h2>
              <Link
                to="/create-listing"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
              >
                Create New Listing
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : userListings && userListings.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {userListings.map((listing) => (
                  <div key={listing._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative">
                    {(listing.status === 'rented' || listing.status === 'unavailable') && (
                      <div className="absolute inset-0 z-10 bg-black/5 backdrop-blur-[1px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-500/90 text-white px-4 py-2 rounded-full font-bold transform -rotate-45 text-lg shadow-lg">
                            {listing.status === 'rented' ? 'RENTED' : 'UNAVAILABLE'}
                          </div>
                        </div>
                      </div>
                    )}
                    <Link to={`/listing/${listing._id}`} className="block">
                      <div className="relative">
                        <img
                          src={listing.imageUrls[0]}
                          alt={listing.name}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(listing.status || 'available', listing.type)}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{listing.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-600 font-medium">
                            ${listing.regularPrice.toLocaleString()}
                            {listing.type === 'rent' && '/month'}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <div className="absolute top-2 right-2 z-20">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowStatusMenu(showStatusMenu === listing._id ? null : listing._id);
                          }}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {showStatusMenu === listing._id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
                            <div className="py-1" role="menu">
                              <Link
                                to={`/update-listing/${listing._id}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit Listing
                              </Link>
                              {listing.type === 'rent' ? (
                                <>
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(listing._id, 'available');
                                      setShowStatusMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Mark as Available
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(listing._id, 'rented');
                                      setShowStatusMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Mark as Rented
                                  </button>
                                </>
                              ) : listing.type === 'sale' ? (
                                <>
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(listing._id, 'available');
                                      setShowStatusMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Mark as Available
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(listing._id, 'sold');
                                      setShowStatusMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Mark as Sold
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(listing._id, 'available');
                                      setShowStatusMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Mark as Available
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleStatusUpdate(listing._id, 'leased');
                                      setShowStatusMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Mark as Leased
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  handleStatusUpdate(listing._id, 'unavailable');
                                  setShowStatusMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark as Unavailable
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg mb-2">No listings found</p>
                <p className="text-sm text-gray-400">
                  Create your first listing to get started
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        {(updateSuccess || error) && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            updateSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {updateSuccess ? 'Profile updated successfully!' : error}
          </div>
        )}
      </div>
      <div className='flex flex-col gap-4'>
        <input
          onChange={handleImageUpload}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={currentUser.avatar || '/default-avatar.png'}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
      </div>
     
    </div>
  );
}
