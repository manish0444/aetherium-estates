import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../Navbar/page';
import {
  Check,
  X,
  Building2,
  Clock,
  AlertCircle,
  Eye
} from 'lucide-react';

export default function ReviewListings() {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchPendingListings();
  }, []);

  const fetchPendingListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/listing/pending', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch pending listings');
      }
      
      const { data } = await response.json();
      setPendingListings(data || []);
    } catch (error) {
      console.error('Error fetching pending listings:', error);
      setError(error.message || 'Failed to load pending listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (listingId, status) => {
    try {
      const response = await fetch(`/api/listing/review/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update listing status');
      }

      setNotification({
        show: true,
        message: `Listing ${status} successfully`,
        type: 'success'
      });

      fetchPendingListings();

      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating listing status:', error);
      setNotification({
        show: true,
        message: error.message || 'Failed to update listing status',
        type: 'error'
      });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Review Listings</h1>
            <p className="text-gray-400 mt-1">
              Review and manage pending property listings
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Pending</p>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {pendingListings?.length || 0}
                  </h3>
                </div>
                <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-500">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading pending listings...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/50 text-red-200 p-6 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-6 w-6" />
                <p>{error}</p>
              </div>
            ) : pendingListings?.length === 0 ? (
              <div className="text-center py-12 bg-white/5 rounded-lg">
                <Building2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No listings pending review</p>
              </div>
            ) : (
              pendingListings?.map(listing => (
                <div key={listing._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {listing.imageUrls?.[0] ? (
                          <img 
                            src={listing.imageUrls[0]} 
                            alt={listing.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-gray-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white">{listing.name}</h3>
                          <p className="text-gray-400 mt-1 line-clamp-2">{listing.description}</p>
                          <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-400">
                            <p>Price: ${listing.regularPrice?.toLocaleString()}</p>
                            <p>Location: {listing.address}</p>
                            <p>Type: {listing.propertyType}</p>
                            <p>Created by: {listing.userRef?.username}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-4 justify-end">
                      <button
                        onClick={() => handleReview(listing._id, 'approved')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-500 rounded-lg hover:bg-green-600/30 transition-colors"
                      >
                        <Check className="h-5 w-5" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReview(listing._id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors"
                      >
                        <X className="h-5 w-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${
          notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white shadow-lg transition-all duration-500 transform translate-y-0`}>
          {notification.message}
        </div>
      )}
    </div>
  );
} 