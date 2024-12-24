import { FaCamera } from "react-icons/fa";
import { RoleBadge } from './RoleBadge';

export default function ProfileHeader({ 
  currentUser, 
  formData, 
  fileRef, 
  handleFileUpload, 
  fileUploadError 
}) {
  return (
    <div className="relative mb-8">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
      
      {/* Profile Info Container */}
      <div className="absolute -bottom-16 left-0 right-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={formData.photo || currentUser?.photo || "/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <input
                onChange={handleFileUpload}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <FaCamera className="w-4 h-4 text-gray-600" />
              </label>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {currentUser?.username}
              </h1>
              <div className="flex items-center gap-4 mb-2">
                <RoleBadge role={currentUser?.role} />
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fileUploadError && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-700 text-center py-2">
          Error uploading image. Please try again.
        </div>
      )}
    </div>
  );
} 