import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Mail, Phone, MapPin, ArrowLeft, Crown, Badge, User, Star, Activity, Eye, ListChecks, Calendar, Building2 } from "lucide-react";
import { RoleBadge } from '../../components/RoleBadge';

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("about");
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    bio: "No bio available",
    languages: [],
    certifications: [],
    stats: {
      totalListings: 0,
      listingsViews: 0,
      likes: 0,
      rating: 0
    },
    comments: [],
    role: "user",
    achievements: []
  });

  useEffect(() => {
    if (!id) {
      setError('User ID is required');
      return;
    }
    fetchProfileData();
  }, [id]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user profile data
      const userRes = await fetch(`/api/user/${id}`);
      const userData = await userRes.json();
      
      if (!userRes.ok) {
        throw new Error(userData.message || 'Failed to fetch user data');
      }

      // Fetch stats based on user role
      let statsData = {};
      if (userData.role === 'admin') {
        const adminStatsRes = await fetch(`/api/user/admin-stats/${id}`);
        if (!adminStatsRes.ok) {
          console.error('Failed to fetch admin stats');
        } else {
          statsData = await adminStatsRes.json();
        }
      } else {
        const statsRes = await fetch(`/api/user/stats/${id}`);
        if (statsRes.ok) {
          statsData = await statsRes.json();
        }
      }

      setProfileData({
        ...userData,
        stats: statsData,
        role: userData.role || 'user' // Ensure role is set
      });

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      navigate('/sign-in');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const res = await fetch('/api/user/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: id,
          authorId: currentUser._id,
          text: newComment,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Add new comment to the list
        setProfileData(prev => ({
          ...prev,
          comments: [...prev.comments, {
            id: data.commentId,
            author: currentUser.username,
            text: newComment,
            date: new Date().toLocaleDateString(),
            authorId: currentUser._id
          }]
        }));
        setNewComment("");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const StatsCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-${color}-50 p-6 rounded-xl border border-${color}-100 hover:shadow-lg transition-all`}>
      <div className={`text-${color}-500 mb-2`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className={`text-2xl font-bold text-${color}-700 mb-1`}>{value}</div>
      <div className={`text-${color}-600 text-sm`}>{title}</div>
    </div>
  );

  const renderRoleSpecificInfo = () => {
    if (profileData.role === 'admin') {
      return (
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-xl shadow-sm mt-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Administrative Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-purple-800">
                <span className="font-medium">Access Level:</span> Full Administrative
              </p>
              <p className="text-purple-800">
                <span className="font-medium">Department:</span> {profileData.department || 'General Administration'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-purple-800">
                <span className="font-medium">Managed Properties:</span> {profileData.stats.managedProperties || 0}
              </p>
              <p className="text-purple-800">
                <span className="font-medium">Total Actions:</span> {profileData.stats.totalActions || 0}
              </p>
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-lg shadow-lg">
        {/* Hero section */}
        <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-8 left-8 flex items-end">
            <div className="relative">
              <img
                src={profileData.photo || "/default-avatar.png"}
                alt={profileData.username}
                className="w-40 h-40 rounded-xl border-4 border-white shadow-2xl object-cover"
              />
              <div className="absolute -bottom-2 -right-2">
                <RoleBadge role={profileData.role} />
              </div>
            </div>
            <div className="ml-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{profileData.username}</h1>
              <p className="text-blue-100 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {profileData.address || "Location not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 p-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-blue-600">
                {profileData.stats.totalListings}
              </div>
              <div className="text-sm text-gray-600">Listings</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-purple-600">
                {profileData.stats.listingsViews}
              </div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-pink-600">
                {profileData.stats.likes}
              </div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="text-2xl font-bold text-green-600">
                {profileData.stats.rating || "N/A"}
              </div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("about")}
                className={`pb-2 ${
                  activeTab === "about"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`pb-2 ${
                  activeTab === "contact"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Contact
              </button>
              <button
                onClick={() => setActiveTab("comments")}
                className={`pb-2 ${
                  activeTab === "comments"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Comments
              </button>
            </div>
          </div>

          {/* Tab content */}
          <div className="mb-8">
            {activeTab === "about" && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Bio</h3>
                  <p>{profileData.bio}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">
                      Certifications
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profileData.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{profileData.address}</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "comments" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {profileData.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">
                          {comment.author}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {comment.date}
                        </span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  ))}
                </div>

                {currentUser && currentUser._id !== id && (
                  <form onSubmit={handleSubmitComment} className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Leave a Comment
                    </h3>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Write your comment here..."
                    />
                    <button
                      type="submit"
                      className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Comment
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {renderRoleSpecificInfo()}

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        .animate-shimmer-fast {
          animation: shimmer 2s linear infinite;
          background-size: 200% auto;
        }

        .animate-shimmer-medium {
          animation: shimmer 3s linear infinite;
          background-size: 200% auto;
        }

        .animate-shimmer-slow {
          animation: shimmer 4s linear infinite;
          background-size: 200% auto;
        }
      `}</style>
    </div>
  );
}