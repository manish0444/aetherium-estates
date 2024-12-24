import { Home, Users, Info, Phone, PlusCircle, Settings, LogOut, User, Building2, X, Menu, Search, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import RealEstateImage from '../images/RealEstate.png';

import {
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  // Hide header on admin/manager pages
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/manager')) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      setIsSidebarOpen(false);
      setIsDropdownOpen(false);
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const UserDropdown = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
      <Link
        to="/profile"
        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        onClick={() => setIsDropdownOpen(false)}
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </div>
      </Link>
      <Link
        to="/settings"
        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        onClick={() => setIsDropdownOpen(false)}
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
      </Link>
      <button
        onClick={handleSignOut}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
      >
        <div className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </button>
    </div>
  );

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
          {/* Logo Section - Unchanged */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={RealEstateImage}
              alt="GharSathi Logo"
              className="h-8 w-auto md:h-10 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/80/80";
              }}
            />
          </Link>

          {/* Search Form - Unchanged */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 py-2 px-4 rounded-lg flex items-center"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-32 md:w-64 text-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="text-gray-600 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="group text-gray-700 hover:text-blue-600 transition-colors">
                <span className="relative">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>
              <Link to="/agents" className="group text-gray-700 hover:text-blue-600 transition-colors">
                <span className="relative">
                  Agents
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>
              <Link to="/about" className="group text-gray-700 hover:text-blue-600 transition-colors">
                <span className="relative">
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>
              <Link to="/contact" className="group text-gray-700 hover:text-blue-600 transition-colors">
                <span className="relative">
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </span>
              </Link>
              
              {currentUser && (
    (currentUser.role === 'admin' || currentUser.role === 'manager') ? (
      <Link
        to={currentUser.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard'}
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Dashboard
      </Link>
    ) : (
      <Link
        to="/create-listing"
        className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
      >
        Add Property
      </Link>
    )
  )}
</nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop User Section with Dropdown */}
            <div className="hidden md:block relative user-dropdown">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    <img
                      className="rounded-full h-10 w-10 object-cover"
                      src={currentUser.photo}
                      alt="profile"
                    />
                    <span className="font-medium">{currentUser.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isDropdownOpen && <UserDropdown />}
                </div>
              ) : (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <img
                  src={currentUser.photo}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{currentUser.name}</h3>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            ) : (
              <Link
                to="/profile"
                className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={closeSidebar}
              >
                <User className="w-16 h-16" />
                <span className="text-lg font-medium">Sign In</span>
              </Link>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={closeSidebar}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/agents"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={closeSidebar}
            >
              <Users className="w-5 h-5" />
              <span>Agents</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={closeSidebar}
            >
              <Info className="w-5 h-5" />
              <span>About Us</span>
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={closeSidebar}
            >
              <Phone className="w-5 h-5" />
              <span>Contact</span>
            </Link>
            
            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={closeSidebar}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={closeSidebar}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Link>
                {currentUser.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={closeSidebar}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <div className="mt-6">
                    <Link
                      to="/create-listing"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors w-full"
                      onClick={closeSidebar}
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Add Property</span>
                    </Link>
                  </div>
                )}
              </>
            )}
          </nav>

          {/* Footer Section */}
          {currentUser && (
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}