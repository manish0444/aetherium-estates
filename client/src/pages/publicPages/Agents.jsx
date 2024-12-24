import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Home,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  Award,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';

// Enhanced dummy data
const agentsData = [
  {
    id: 1,
    name: "Amrita Khanal",
    email: "amrita.k@realestate.com",
    phone: "(981) 123-4567",
    avatar: "/api/placeholder/150/150",
    totalListings: 24,
    listingsViews: 1250,
    commentsCount: 47,
    likes: 156,
    experience: "8 years",
    specialization: "Luxury Homes",
    location: "Kathmandu Metropolitan",
    rating: 4.8,
    languages: ["Nepali", "English"],
    certifications: [
      "Certified Luxury Home Specialist",
      "Real Estate Negotiator",
    ],
    recentSales: 8,
    bio: "Dedicated real estate professional with expertise in luxury properties and a track record of exceptional client service.",
    comments: [
      {
        id: 1,
        author: "Raju Shrestha",
        date: "2024-03-15",
        text: "Amrita was amazing in helping us find our dream home!",
      },
      {
        id: 2,
        author: "Rima Tamang",
        date: "2024-03-10",
        text: "Very professional and knowledgeable about the market.",
      },
    ],
  },
  {
    id: 2,
    name: "Ramesh Adhikari",
    email: "ramesh.a@realestate.com",
    phone: "(981) 987-6543",
    avatar: "/api/placeholder/150/150",
    totalListings: 18,
    listingsViews: 980,
    commentsCount: 32,
    likes: 98,
    experience: "5 years",
    specialization: "First-time Buyers",
    location: "Lalitpur",
    rating: 4.6,
    languages: ["Nepali", "English"],
    certifications: ["First-time Homebuyer Specialist"],
    recentSales: 5,
    bio: "Passionate about helping first-time homebuyers navigate the real estate market with confidence.",
    comments: [
      {
        id: 1,
        author: "Sita Bhandari",
        date: "2024-03-12",
        text: "Ramesh made our first home purchase so smooth!",
      },
    ],
  },
  {
    id: 3,
    name: "Sujata Pandey",
    email: "sujata.p@realestate.com",
    phone: "(981) 765-4321",
    avatar: "/api/placeholder/150/150",
    totalListings: 31,
    listingsViews: 1580,
    commentsCount: 54,
    likes: 203,
    experience: "10 years",
    specialization: "Commercial Properties",
    location: "Bhaktapur",
    rating: 4.9,
    languages: ["Nepali", "English"],
    certifications: [
      "Commercial Real Estate Specialist",
      "Property Management",
    ],
    recentSales: 12,
    bio: "Experienced commercial real estate agent specializing in business properties and investment opportunities.",
    comments: [
      {
        id: 1,
        author: "Kiran Sharma",
        date: "2024-03-08",
        text: "Sujata is the best! She really understood what we needed.",
      },
      {
        id: 2,
        author: "Anita Thapa",
        date: "2024-02-28",
        text: "Knowledgeable, friendly, and very efficient!",
      },
    ],
  },
];

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterLocation, setFilterLocation] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/user/agents');
        const data = await res.json();
        
        if (res.ok) {
          console.log('Fetched agents:', data);
          setAgents(data);
        } else {
          throw new Error(data.message || 'Failed to fetch agents');
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Error loading agents</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-center">
          <p className="text-xl font-semibold mb-2">No agents found</p>
          <p>There are currently no real estate agents available.</p>
        </div>
      </div>
    );
  }

  // Filter and sort agents
  const filteredAndSortedAgents = agents
    .filter((agent) => {
      if (!agent) return false;
      
      const matchesSearch = searchTerm ? (
        (agent.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (agent.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      ) : true;

      const matchesLocation = filterLocation ? 
        agent.address === filterLocation : true;

      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return order * ((a.username || '').localeCompare(b.username || ''));
      }
      if (sortBy === "listings") {
        return order * ((a.listingsCount || 0) - (b.listingsCount || 0));
      }
      if (sortBy === "likes") {
        return order * ((a.likesCount || 0) - (b.likesCount || 0));
      }
      return 0;
    });

  // Update the uniqueLocations to use address instead of location
  const uniqueLocations = [...new Set(agents
    .filter(agent => agent?.address)
    .map(agent => agent.address))];

  const handleAgentClick = (agent) => {
    navigate(`/user-profile/${agent._id}`);
  };

  const handleBack = () => {
    setSelectedAgent(null);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        id: selectedAgent.comments.length + 1,
        author: "User",
        date: new Date().toISOString().split("T")[0],
        text: newComment,
      };
      setAgents(
        agents.map((agent) =>
          agent.id === selectedAgent.id
            ? {
                ...agent,
                comments: [...agent.comments, newCommentObj],
                commentsCount: agent.commentsCount + 1,
              }
            : agent
        )
      );
      setSelectedAgent({
        ...selectedAgent,
        comments: [...selectedAgent.comments, newCommentObj],
        commentsCount: selectedAgent.commentsCount + 1,
      });
      setNewComment("");
    }
  };

  const handleLike = async (agentId) => {
    if (!currentUser) {
      setShowAlert(true);
      setAlertText('Please sign in to like agents');
      return;
    }

    try {
      const res = await fetch(`/api/user/like/${agentId}`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();

      if (data.success) {
        setAgents(agents.map(agent => 
          agent._id === agentId 
            ? { ...agent, likesCount: data.liked ? agent.likesCount + 1 : agent.likesCount - 1 }
            : agent
        ));
      }
    } catch (error) {
      console.error('Error liking agent:', error);
    }
  };

  if (selectedAgent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleBack}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Agents
        </button>

        <div className="bg-white rounded-lg shadow-lg">
          {/* Hero section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
            <div className="absolute -bottom-16 left-8 flex items-end">
              <img
                src={selectedAgent.avatar}
                alt={selectedAgent.name}
                className="w-32 h-32 rounded-lg border-4 border-white shadow-lg"
              />
              <div className="ml-4 mb-4 text-white">
                <h2 className="text-3xl font-bold text-black">{selectedAgent.name}</h2>
                <p className="text-blue-600">{selectedAgent.specialization}</p>
              </div>
            </div>
          </div>

          <div className="mt-20 p-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedAgent.totalListings}
                </div>
                <div className="text-sm text-gray-600">Listings</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedAgent.listingsViews}
                </div>
                <div className="text-sm text-gray-600">Views</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-pink-600">
                  {selectedAgent.likes}
                </div>
                <div className="text-sm text-gray-600">Likes</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="text-2xl font-bold text-green-600">
                  {selectedAgent.rating}
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
                    <p>{selectedAgent.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAgent.languages.map((lang) => (
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
                        {selectedAgent.certifications.map((cert) => (
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
                    <span>{selectedAgent.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span>{selectedAgent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span>{selectedAgent.location}</span>
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {selectedAgent.comments.map((comment) => (
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Our Real Estate Agents
        </h1>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name">Name</option>
              <option value="listings">Listings</option>
              <option value="likes">Likes</option>
            </select>
            <button
              onClick={() =>
                setSortOrder((order) => (order === "asc" ? "desc" : "asc"))
              }
              className="p-2 border rounded-lg hover:bg-gray-50"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="w-5 h-5" />
              ) : (
                <SortDesc className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Filter by location */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-6 text-gray-600">
        Showing {filteredAndSortedAgents.length} agents
      </div>

      {/* Agents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedAgents.map((agent) => (
          <div
            key={agent._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Agent card header */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{agent.averageRating || '0.0'}</span>
                </div>
              </div>
            </div>

            {/* Agent info */}
            <div className="p-6">
              <div className="flex items-start gap-4 -mt-12">
                <img
                  src={agent.photo || "/default-avatar.png"}
                  alt={agent.username}
                  className="w-20 h-20 rounded-lg border-4 border-white shadow-lg object-cover"
                />
                <div className="pt-8">
                  <h2 className="text-xl font-semibold">{agent.username}</h2>
                  <p className="text-gray-600 text-sm">
                    {agent.specialization || 'Real Estate Agent'}
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-gray-800">
                    <Home className="w-4 h-4" />
                    <span className="font-semibold">{agent.listingsCount || 0}</span>
                  </div>
                  <div className="text-xs text-gray-600">Listings</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-gray-800">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-semibold">{agent.reviewsCount || 0}</span>
                  </div>
                  <div className="text-xs text-gray-600">Reviews</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => handleAgentClick(agent)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(agent._id);
                  }}
                  className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      agent.likesCount > 0
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span>{agent.likesCount || 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
