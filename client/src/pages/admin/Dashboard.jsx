import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Users,
  Building2,
  Eye,
  DollarSign,
  UserPlus,
  ListPlus
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Sidebar from './Navbar/page';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalViews: 0,
    totalRevenue: 0,
    userGrowth: 0,
    listingGrowth: 0,
    viewsGrowth: 0,
    revenueGrowth: 0,
    recentUsers: [],
    recentListings: [],
    monthlyStats: []
  });
  
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('/api/user/all', {
        credentials: 'include'
      });
      const usersData = await usersResponse.json();

      // Fetch listings
      const listingsResponse = await fetch('/api/listing/all', {
        credentials: 'include'
      });
      const listingsData = await listingsResponse.json();

      // Calculate total views and revenue
      const totalViews = listingsData.reduce((sum, listing) => sum + (listing.views || 0), 0);
      const totalRevenue = listingsData.reduce((sum, listing) => sum + (parseFloat(listing.regularPrice) || 0), 0);

      // Get recent items (last 5)
      const recentUsers = usersData
        .slice(-5)
        .map(user => ({
          id: user._id,
          name: user.username,
          timestamp: new Date(user.createdAt).toLocaleDateString(),
          type: 'user'
        }));

      const recentListings = listingsData
        .slice(-5)
        .map(listing => ({
          id: listing._id,
          name: listing.name,
          timestamp: new Date(listing.createdAt).toLocaleDateString(),
          type: 'listing',
          views: listing.views || 0
        }));

      // Calculate monthly stats
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toLocaleString('default', { month: 'short' });
      }).reverse();

      const monthlyStats = last6Months.map(month => {
        const monthUsers = usersData.filter(user => 
          new Date(user.createdAt).toLocaleString('default', { month: 'short' }) === month
        ).length;

        const monthListings = listingsData.filter(listing =>
          new Date(listing.createdAt).toLocaleString('default', { month: 'short' }) === month
        );

        const monthViews = monthListings.reduce((sum, listing) => sum + (listing.views || 0), 0);
        const monthRevenue = monthListings.reduce((sum, listing) => sum + (parseFloat(listing.regularPrice) || 0), 0);

        return {
          month,
          users: monthUsers,
          listings: monthListings.length,
          views: monthViews,
          revenue: monthRevenue
        };
      });

      // Calculate growth percentages
      const calculateGrowth = (current, previous) => {
        if (!previous) return 0;
        return Number((((current - previous) / previous) * 100).toFixed(1));
      };

      const currentMonth = monthlyStats[monthlyStats.length - 1];
      const previousMonth = monthlyStats[monthlyStats.length - 2];

      setStats({
        totalUsers: usersData.length,
        totalListings: listingsData.length,
        totalViews,
        totalRevenue,
        userGrowth: calculateGrowth(currentMonth?.users || 0, previousMonth?.users || 0),
        listingGrowth: calculateGrowth(currentMonth?.listings || 0, previousMonth?.listings || 0),
        viewsGrowth: calculateGrowth(currentMonth?.views || 0, previousMonth?.views || 0),
        revenueGrowth: calculateGrowth(currentMonth?.revenue || 0, previousMonth?.revenue || 0),
        recentUsers,
        recentListings,
        monthlyStats
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color }) => {
    const formatValue = (val) => {
      if (typeof val === 'number') {
        if (val >= 1000) {
          return `${(val / 1000).toFixed(1)}K`;
        }
        return val.toString();
      }
      return val;
    };

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-white mt-1">
              {title.includes('Revenue') ? `$${formatValue(value)}` : formatValue(value)}
            </h3>
            {trend !== undefined && (
              <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {trend > 0 ? '+' : ''}{trend}% from last month
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </div>
    );
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  const lineChartData = {
    labels: stats.monthlyStats?.map(stat => stat.month) || [],
    datasets: [
      {
        label: 'Users',
        data: stats.monthlyStats?.map(stat => stat.users) || [],
        borderColor: '#3B82F6',
        tension: 0.4
      },
      {
        label: 'Revenue ($)',
        data: stats.monthlyStats?.map(stat => stat.revenue) || [],
        borderColor: '#10B981',
        tension: 0.4
      }
    ]
  };

  const barChartData = {
    labels: stats.monthlyStats?.map(stat => stat.month) || [],
    datasets: [
      {
        label: 'Properties',
        data: stats.monthlyStats?.map(stat => stat.listings) || [],
        backgroundColor: '#8B5CF6'
      },
      {
        label: 'Views',
        data: stats.monthlyStats?.map(stat => stat.views) || [],
        backgroundColor: '#F59E0B'
      }
    ]
  };

  const RecentActivityCard = ({ title, data, icon: Icon }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {data?.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
              {item.type === 'user' ? (
                <UserPlus className="h-5 w-5 text-white" />
              ) : (
                <ListPlus className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-gray-400">{item.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 animate-gradient-slow flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-gray-900 animate-gradient-slow">
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
                Here's what's happening with your properties today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                trend={stats.userGrowth}
                color="text-blue-500"
              />
              <StatCard
                title="Total Properties"
                value={stats.totalListings}
                icon={Building2}
                trend={stats.listingGrowth}
                color="text-purple-500"
              />
              <StatCard
                title="Total Views"
                value={stats.totalViews}
                icon={Eye}
                trend={stats.viewsGrowth}
                color="text-green-500"
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats.totalRevenue}`}
                icon={DollarSign}
                trend={stats.revenueGrowth}
                color="text-yellow-500"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
                <div className="h-80">
                  <Line options={chartOptions} data={lineChartData} />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Property Statistics</h3>
                <div className="h-80">
                  <Bar options={chartOptions} data={barChartData} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentActivityCard
                title="Recent Users"
                data={stats.recentUsers}
                icon={Users}
              />
              <RecentActivityCard
                title="Recent Properties"
                data={stats.recentListings}
                icon={Building2}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}