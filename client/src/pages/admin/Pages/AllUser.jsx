import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Shield, 
  UserX, 
  CheckCircle, 
  XCircle,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import Sidebar from '../Navbar/page';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    console.log('Component mounted, fetching users...');
    fetchUsers();
    
    const handleClick = (e) => {
      if (!e.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Starting to fetch users...');
      
      const response = await fetch('/api/user/list', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized access. Please log in as admin.');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      
      if (Array.isArray(data)) {
        console.log('Number of users fetched:', data.length);
        setUsers(data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError(err.message || 'Failed to fetch users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Log state changes
  useEffect(() => {
    console.log('Current state:', {
      usersCount: users.length,
      loading,
      error,
      filteredUsersCount: filteredUsers.length
    });
  }, [users, loading, error]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      console.log('Attempting to delete user:', userId);
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      console.log('Delete response:', data);

      if (res.ok) {
        setUsers(users.filter(user => user._id !== userId));
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message);
    }
  };

  const handleRoleChange = async (userId, currentRole, newRole) => {
    // Prevent changing to admin role
    if (newRole === 'admin') {
      alert('Cannot change user to admin role');
      return;
    }

    try {
      console.log(`Changing user ${userId} role from ${currentRole} to ${newRole}`);
      const res = await fetch(`/api/user/update/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
        // Log the action
        await fetch('/api/user/admin-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            actionType: 'UPDATE',
            targetType: 'USER',
            targetId: userId,
            details: {
              action: 'role_change',
              from: currentRole,
              to: newRole
            }
          })
        });
      } else {
        throw new Error(data.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      alert(error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesVerification = verificationFilter === 'all' || 
                               (verificationFilter === 'verified' && user.isVerified) ||
                               (verificationFilter === 'unverified' && !user.isVerified);
    return matchesSearch && matchesRole && matchesVerification;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="flex items-center justify-center h-[80vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <div className="ml-4 text-gray-400">Loading users...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
              Error: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          {loading && (
            <div className="flex items-center justify-center h-[80vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              <div className="ml-4 text-gray-400">Loading users...</div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
              Error: {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-gray-400 mt-2">
                  Total Users: {users.length} | Filtered: {filteredUsers.length}
                </p>
              </div>

              {/* Filters */}
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="agent">Agents</option>
                  <option value="admin">Admins</option>
                </select>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-700/30">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.photo}
                                alt={user.username}
                              />
                              <div className="ml-4">
                                <div className="font-medium">{user.username}</div>
                                <div className="text-sm text-gray-400">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                              ${user.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                                user.role === 'manager' ? 'bg-purple-500/10 text-purple-500' :
                                user.role === 'agent' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-green-500/10 text-green-500'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {user.isVerified ? (
                              <span className="flex items-center text-green-500">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="flex items-center text-yellow-500">
                                <XCircle className="w-4 h-4 mr-1" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="dropdown-container relative">
                              <button
                                onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)}
                                className="text-gray-400 hover:text-white"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </button>

                              {activeDropdown === user._id && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700">
                                  <div className="py-1">
                                    {user.role !== 'admin' && (
                                      <>
                                        {user.role !== 'manager' && (
                                          <button
                                            className="w-full px-4 py-2 text-left text-sm text-purple-400 hover:bg-gray-800/50 flex items-center gap-2"
                                            onClick={() => handleRoleChange(user._id, user.role, 'manager')}
                                          >
                                            <Shield size={16} />
                                            Make Manager
                                          </button>
                                        )}
                                        {user.role !== 'agent' && (
                                          <button
                                            className="w-full px-4 py-2 text-left text-sm text-blue-400 hover:bg-gray-800/50 flex items-center gap-2"
                                            onClick={() => handleRoleChange(user._id, user.role, 'agent')}
                                          >
                                            <Shield size={16} />
                                            Make Agent
                                          </button>
                                        )}
                                        {user.role !== 'user' && (
                                          <button
                                            className="w-full px-4 py-2 text-left text-sm text-green-400 hover:bg-gray-800/50 flex items-center gap-2"
                                            onClick={() => handleRoleChange(user._id, user.role, 'user')}
                                          >
                                            <User size={16} />
                                            Make User
                                          </button>
                                        )}
                                        <button
                                          className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-800/50 flex items-center gap-2"
                                          onClick={() => handleDeleteUser(user._id)}
                                        >
                                          <UserX size={16} />
                                          Delete User
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}