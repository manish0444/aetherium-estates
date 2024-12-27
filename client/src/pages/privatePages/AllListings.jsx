import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Edit, Plus, Search, Filter, SortAsc, Eye, Check, Clock, Ban, Tag, MoreVertical, Video } from 'lucide-react';
import { UserRestrictionNotice } from "../privatePages/CreateListing";

export default function AllListings() {
  const { currentUser } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [filterType, setFilterType] = useState('all');
  const [userListingsCount, setUserListingsCount] = useState(0);
  const [remainingListings, setRemainingListings] = useState(3);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  // Add effect to fetch listing count
  useEffect(() => {
    const fetchListingsCount = async () => {
      try {
        const res = await fetch(`/api/user/listings/count/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserListingsCount(data.totalCount || 0);
          setRemainingListings(data.remainingListings || 0);
          setHasReachedLimit(data.hasReachedLimit || false);
        }
      } catch (error) {
        console.error('Error fetching listings count:', error);
      }
    };

    if (currentUser?._id) {
      fetchListingsCount();
    }
  }, [currentUser?._id]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setError("Failed to fetch listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      setUserListings(prev => prev.filter(listing => listing._id !== listingId));
      
      // Refetch the listings count to update the restrictions notice
      const countRes = await fetch(`/api/user/listings/count/${currentUser._id}`);
      const countData = await countRes.json();
      if (countRes.ok) {
        setUserListingsCount(countData.totalCount || 0);
        setRemainingListings(countData.remainingListings || 0);
        setHasReachedLimit(countData.hasReachedLimit || false);
      }
    } catch (error) {
      setError("Failed to delete listing");
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

  const filteredListings = userListings
    .filter(listing => {
      const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || listing.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.regularPrice - a.regularPrice;
      if (sortBy === 'views') return b.views - a.views;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Show restriction notice for non-agent users */}
        {currentUser.role !== 'agent' && (
          <UserRestrictionNotice 
            listingsCount={userListingsCount}
            remainingListings={remainingListings}
            hasReachedLimit={hasReachedLimit}
          />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Listings</h1>
          <Link
            to="/create-listing"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Property
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <SortAsc className="text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Latest First</option>
                <option value="price">Price</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500">Start by creating your first property listing</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
              >
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
                  <div className="relative aspect-video">
                    <img
                      src={listing.imageUrls[0]}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                        <Eye className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">{listing.views || 0}</span>
                      </div>
                      {listing.videoUrl && (
                        <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {listing.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}