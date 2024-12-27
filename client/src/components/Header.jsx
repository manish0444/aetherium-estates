import { Home, Users, Info, Phone, PlusCircle, Settings, LogOut, User, Building2, X, Menu, Search, ChevronDown, Sun, Moon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import RealEstateImage from '../images/RealEstate.png';
import { useTheme } from '../context/ThemeContext';
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
  const { isDarkMode, toggleTheme } = useTheme();

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

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-900 border-b border-slate-800' 
          : 'bg-white border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
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

            {/* Search Form */}
            <form
              onSubmit={handleSubmit}
              className={`hidden md:flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border border-slate-700' 
                  : 'bg-slate-100'
              }`}
            >
              <input
                type="text"
                placeholder="Search properties..."
                className={`w-64 bg-transparent focus:outline-none transition-colors ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-900'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={`transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'
              }`}>
                <Search className="w-5 h-5" />
              </button>
            </form>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-4">
                {['Home', 'Agents', 'About', 'All Properties'].map((item) => (
                  <Link
                    key={item}
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'text-slate-300 hover:text-sky-400 hover:bg-slate-800' 
                        : 'text-slate-700 hover:text-sky-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="relative z-10">{item}</span>
                  </Link>
                ))}
              </nav>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Section */}
              {currentUser ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'text-slate-300 hover:text-sky-400 hover:bg-slate-800' 
                        : 'text-slate-700 hover:text-sky-600 hover:bg-slate-100'
                    }`}
                  >
                    <img
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500"
                      src={currentUser.photo}
                      alt="profile"
                    />
                    <span className="font-medium">{currentUser.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-800 border border-slate-700' 
                        : 'bg-white border border-slate-200'
                    }`}>
                      <Link
                        to="/profile"
                        className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                          isDarkMode 
                            ? 'text-slate-300 hover:bg-slate-700 hover:text-sky-400' 
                            : 'text-slate-700 hover:bg-slate-100 hover:text-sky-600'
                        }`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                          isDarkMode 
                            ? 'text-slate-300 hover:bg-slate-700 hover:text-sky-400' 
                            : 'text-slate-700 hover:bg-slate-100 hover:text-sky-600'
                        }`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className={`w-full flex items-center gap-2 px-4 py-2 transition-colors ${
                          isDarkMode 
                            ? 'text-red-400 hover:bg-red-500/10' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/sign-in"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  Sign In
                </Link>
              )}

              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager') ? (
                <Link
                  to={currentUser.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard'}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  Dashboard
                </Link>
              ) : currentUser && (
                <Link
                  to="/create-listing"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                >
                  Add Property
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-slate-300 hover:bg-slate-800' 
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-50 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      <div
        className={`fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}
      >
        {/* Mobile Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <img
              src={RealEstateImage}
              alt="GharSathi Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            onClick={closeSidebar}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="p-4">
          <form
            onSubmit={handleSubmit}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border border-slate-700' 
                : 'bg-slate-100'
            }`}
          >
            <input
              type="text"
              placeholder="Search properties..."
              className={`flex-1 bg-transparent focus:outline-none transition-colors ${
                isDarkMode ? 'text-slate-200' : 'text-slate-900'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className={`transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-sky-400' : 'text-slate-600 hover:text-sky-600'
            }`}>
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Mobile Navigation Links */}
        <nav className={`flex flex-col p-4 ${
          isDarkMode ? 'text-slate-300' : 'text-slate-700'
        }`}>
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-slate-800 hover:text-sky-400' 
                : 'hover:bg-slate-100 hover:text-sky-600'
            }`}
            onClick={closeSidebar}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/agents"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-slate-800 hover:text-sky-400' 
                : 'hover:bg-slate-100 hover:text-sky-600'
            }`}
            onClick={closeSidebar}
          >
            <Users className="w-5 h-5" />
            <span>Agents</span>
          </Link>
          <Link
            to="/about"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-slate-800 hover:text-sky-400' 
                : 'hover:bg-slate-100 hover:text-sky-600'
            }`}
            onClick={closeSidebar}
          >
            <Info className="w-5 h-5" />
            <span>About</span>
          </Link>
          <Link
            to="/all-properties"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-slate-800 hover:text-sky-400' 
                : 'hover:bg-slate-100 hover:text-sky-600'
            }`}
            onClick={closeSidebar}
          >
            <Building2 className="w-5 h-5" />
            <span>All Properties</span>
          </Link>
        </nav>

        {/* Mobile Theme Toggle */}
        <div className="p-4">
          <button
            onClick={() => {
              toggleTheme();
              closeSidebar();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-slate-800 text-sky-400 hover:bg-slate-700' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }">
          {currentUser ? (
            <div className="space-y-2">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
              }`}>
                <img
                  src={currentUser.photo}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500"
                />
                <div className="flex-1">
                  <p className={`font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-900'
                  }`}>{currentUser.name}</p>
                </div>
              </div>
              
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager') ? (
                <Link
                  to={currentUser.role === 'admin' ? '/admin/dashboard' : '/manager/dashboard'}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                  onClick={closeSidebar}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              ) : currentUser && (
                <Link
                  to="/create-listing"
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-sky-500 text-white hover:bg-sky-600' 
                      : 'bg-sky-600 text-white hover:bg-sky-700'
                  }`}
                  onClick={closeSidebar}
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Add Property</span>
                </Link>
              )}
              
              <button
                onClick={() => {
                  handleSignOut();
                  closeSidebar();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-red-400 hover:bg-red-500/10' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-sky-500 text-white hover:bg-sky-600' 
                  : 'bg-sky-600 text-white hover:bg-sky-700'
              }`}
              onClick={closeSidebar}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}