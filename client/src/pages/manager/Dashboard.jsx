import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../admin/Navbar/page';
import {
  Building2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  FileText
} from 'lucide-react';

export default function ManagerDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    totalListings: 0,
    pendingReviews: 0,
    approvedListings: 0,
    rejectedListings: 0,
    recentListings: []
  });

  useEffect(() => {
    fetchManagerStats();
  }, []);

  const fetchManagerStats = async () => {
    try {
      const response = await fetch('/api/listing/manager/stats', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching manager stats:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, link }) => (
    <Link
      to={link}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-blue-600/20 text-blue-500">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {currentUser?.username}
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your properties and content
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Properties"
                value={stats.totalListings}
                icon={Building2}
                color="text-blue-500"
              />
              <StatCard
                title="Pending Review"
                value={stats.pendingReviews}
                icon={Clock}
                color="text-yellow-500"
              />
              <StatCard
                title="Approved"
                value={stats.approvedListings}
                icon={CheckCircle}
                color="text-green-500"
              />
              <StatCard
                title="Rejected"
                value={stats.rejectedListings}
                icon={XCircle}
                color="text-red-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <QuickAction
                title="Create Listing"
                description="Add new property for review"
                icon={PlusCircle}
                link="/create"
              />
              <QuickAction
                title="Create Blog"
                description="Write and publish blog posts"
                icon={FileText}
                link="/create-blog"
              />
              <QuickAction
                title="My Listings"
                description="View and manage your properties"
                icon={Building2}
                link="/my-listings"
              />
            </div>

            {/* Recent Listings */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Listings</h3>
              <div className="space-y-4">
                {stats.recentListings.map((listing, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{listing.name}</h4>
                        <p className="text-gray-400 text-sm">{listing.status}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-400">{listing.views || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 