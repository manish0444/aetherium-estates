 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import { Building2, Menu, X, ChevronDown } from 'lucide-react';

const LandingHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/sign-in');
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const menuItems = [
    {
      title: 'Solutions',
      dropdown: [
        { label: 'For Agents', href: '#agents' },
        { label: 'For Property Owners', href: '#owners' },
        { label: 'For Tenants', href: '#tenants' }
      ]
    },
    {
      title: 'Features',
      dropdown: [
        { label: 'Smart Search', href: '#search' },
        { label: 'Virtual Tours', href: '#tours' },
        { label: 'AI Recommendations', href: '#ai' }
      ]
    },
    { title: 'Pricing', href: '#pricing' },
    { title: 'About', href: '#about' }
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Building2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                Aetherium Estates
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div key={item.title} className="relative">
                {item.dropdown ? (
                  <motion.div
                    className="group"
                    onHoverStart={() => setActiveDropdown(item.title)}
                    onHoverEnd={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600">
                      <span>{item.title}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {activeDropdown === item.title && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1">
                          {item.dropdown.map((dropdownItem) => (
                            <a
                              key={dropdownItem.label}
                              href={dropdownItem.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                            >
                              {dropdownItem.label}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={item.href}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {item.title}
                  </motion.a>
                )}
              </div>
            ))}
            
            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={currentUser.avatar}
                      alt="profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-gray-700">{currentUser.username}</span>
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                      >
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/sign-up"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <div key={item.title} className="py-2">
                  {item.dropdown ? (
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.title ? null : item.title)}
                      className="w-full flex justify-between items-center text-gray-600"
                    >
                      <span>{item.title}</span>
                      <ChevronDown className={`h-4 w-4 transform transition-transform ${
                        activeDropdown === item.title ? 'rotate-180' : ''
                      }`} />
                    </button>
                  ) : (
                    <a href={item.href} className="block text-gray-600">
                      {item.title}
                    </a>
                  )}
                  {item.dropdown && activeDropdown === item.title && (
                    <div className="mt-2 pl-4 space-y-2">
                      {item.dropdown.map((dropdownItem) => (
                        <a
                          key={dropdownItem.label}
                          href={dropdownItem.href}
                          className="block text-sm text-gray-500"
                        >
                          {dropdownItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="block text-gray-600 hover:text-blue-600"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left text-gray-600 hover:text-blue-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/sign-in"
                    className="block text-gray-600 hover:text-blue-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/sign-up"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default LandingHeader;