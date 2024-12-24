import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../../redux/user/userSlice";
import { Link } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import ReactLoading from "react-loading";
import { ListChecks, Eye, Star, Activity } from "lucide-react";
import { Crown, Badge, User } from "lucide-react";
import { Building2, Heart } from "lucide-react";
import ProfileHeader from "../../components/ProfileHeader";
import StatsCard from "../../components/StatsCard";
import ListingCard from "../../components/ListingCard";
import { RoleBadge } from '../../components/RoleBadge';

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userStats, setUserStats] = useState({
    totalListings: 0,
    totalViews: 0,
    averageRating: 0,
    totalLikes: 0,
    reviewsCount: 0
  });
  const [listingsLoading, setListingsLoading] = useState(false);

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
    if (activeTab === 'listings') {
      handleShowListings();
    }
  }, [activeTab]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error('Upload error:', error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Immediately update user with new photo
          const res = await fetch(`/api/user/update/${currentUser._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photo: downloadURL }),
          });

          const data = await res.json();
          
          if (!res.ok) {
            throw new Error(data.message);
          }

          dispatch(updateUserSuccess(data));
          setFormData(prev => ({ ...prev, photo: downloadURL }));
        } catch (error) {
          console.error('Error updating profile photo:', error);
          setFileUploadError(true);
        }
      }
    );
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

  const handleShowListings = async () => {
    try {
      setListingsLoading(true);
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      
      if (!res.ok) {
        setShowListingsError(true);
        return;
      }
      
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
      console.error('Error fetching listings:', error);
    } finally {
      setListingsLoading(false);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

            {listingsLoading ? (
              <div className="flex justify-center py-8">
                <ReactLoading type="spin" color="#3B82F6" height={40} width={40} />
              </div>
            ) : userListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    onDelete={handleListingDelete}
                  />
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
    </div>
  );
}
