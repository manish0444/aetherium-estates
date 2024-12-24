import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronLeft, ChevronRight, Search, Filter, Eye } from 'lucide-react';
import Sidebar from '../Navbar/page';
import { Link } from 'react-router-dom';

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [totalListings, setTotalListings] = useState(0);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchListings();
  }, [currentPage, searchTerm, filterType]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { searchTerm }),
        ...(filterType !== 'all' && { type: filterType })
      });

      const response = await fetch(`/api/listing/all?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      
      setListings(data.listings || []);
      setTotalListings(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success === false) {
        throw new Error(data.message);
      }
      
      fetchListings();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-800">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Confirm Deletion</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this listing? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(selectedListing)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-cyan-900 via-gray-900 to-white/5">
        <div className="relative z-10 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Property Listings</h1>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <input
                    type="text"
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-500 h-5 w-5" />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-300"
                >
                  <option value="all">All Types</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="lease">For Lease</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-200 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Content */}
            {!isLoading && !error && (
            <div className="bg-gray-900/70 backdrop-blur-md rounded-lg shadow-xl border border-gray-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                      {listings.length > 0 ? (
                        listings.map((listing) => (
                      <tr key={listing._id} className="text-gray-300 hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={listing.imageUrls[0]} 
                              alt={listing.name}
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-100">{listing.name}</div>
                              <div className="text-sm text-gray-400 truncate max-w-xs">
                                {listing.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            listing.type === 'rent' 
                              ? 'bg-blue-900/50 text-blue-300'
                              : listing.type === 'sale'
                              ? 'bg-purple-900/50 text-purple-300'
                              : listing.type === 'lease'
                              ? 'bg-green-900/50 text-green-300'
                              : 'bg-gray-900/50 text-gray-300'
                          }`}>
                            {listing.type === 'rent' 
                              ? 'For Rent' 
                              : listing.type === 'sale'
                              ? 'For Sale'
                              : listing.type === 'lease'
                              ? 'For Lease'
                              : 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-100">
                              Rs.{listing.regularPrice.toLocaleString()}
                            </div>
                            {listing.offer && (
                              <div className="text-green-400 text-xs">
                                -{listing.discountPrice.toLocaleString()} off
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-gray-300">
                            <Eye className="h-4 w-4 mr-1" />
                            {listing.views || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(listing.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-3">
                            <Link 
                              to={`/update-listing/${listing._id}`}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button 
                              onClick={() => {
                                setSelectedListing(listing._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                            No listings found
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>

                {/* Pagination - only show if there are listings */}
                {listings.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalListings)} of {totalListings} entries
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded ${
                        currentPage === 1 
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded ${
                        currentPage === totalPages
                          ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
                )}
            </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && <DeleteModal />}
    </div>
  );
};

export default ListingsPage;