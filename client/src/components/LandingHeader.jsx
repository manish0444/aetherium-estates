import React, { useState, useEffect } from 'react';
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

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
  };

  const containerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.4, delay: 0.3 } },
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="initial"
      animate="animate"
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled ? 'py-2 bg-slate-900/80' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          className={`relative rounded-2xl backdrop-blur-lg transition-all duration-500 ${
            isScrolled
              ? 'bg-slate-800/90 shadow-lg shadow-slate-900/20'
              : 'bg-slate-800/50'
          } px-6 py-3`}
        >
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <div className="relative">
                  <Building2 className="h-8 w-8 text-sky-400" />
                  <motion.div
                    className="absolute -inset-1 rounded-lg bg-sky-400/20 opacity-50"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
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
                      <button className="flex items-center space-x-1 text-slate-300 hover:text-sky-400 transition-colors">
                        <span>{item.title}</span>
                        <motion.div
                          animate={activeDropdown === item.title ? { rotate: 180 } : { rotate: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.title && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-800/90 backdrop-blur-lg shadow-lg ring-1 ring-slate-700/50 p-2"
                          >
                            {item.dropdown.map((dropdownItem) => (
                              <motion.a
                                key={dropdownItem.label}
                                whileHover={{ scale: 1.02, x: 4 }}
                                href={dropdownItem.href}
                                className="block px-4 py-2 text-sm text-slate-300 hover:text-sky-400 hover:bg-slate-700/50 rounded-lg transition-colors"
                              >
                                {dropdownItem.label}
                              </motion.a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={item.href}
                      className="text-slate-300 hover:text-sky-400 transition-colors"
                    >
                      {item.title}
                    </motion.a>
                  )}
                </div>
              ))}
              
              {/* Authentication Buttons */}
              <div className="flex items-center space-x-4">
                {currentUser ? (
                  <motion.div
                    className="relative"
                    initial={false}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-2 bg-slate-700/50 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-slate-700/80 transition-colors"
                    >
                      <img
                        src={currentUser.avatar}
                        alt="profile"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-500/20"
                      />
                      <span className="text-slate-300">{currentUser.username}</span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </motion.button>
                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-lg rounded-xl shadow-lg py-2 ring-1 ring-slate-700/50"
                        >
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-slate-300 hover:text-sky-400 hover:bg-slate-700/50 transition-colors"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={handleSignOut}
                            className="block w-full text-left px-4 py-2 text-slate-300 hover:text-red-400 hover:bg-slate-700/50 transition-colors"
                          >
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/sign-in"
                        className="text-slate-300 hover:text-sky-400 transition-colors"
                      >
                        Sign In
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/sign-up"
                        className="bg-sky-500 text-white px-6 py-2 rounded-xl hover:bg-sky-600 transition-colors"
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
              className="md:hidden p-2 rounded-lg bg-slate-700/50 backdrop-blur-sm hover:bg-slate-700/80 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? (
                <X className="w-6 h-6 text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-300" />
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/80 backdrop-blur-lg mt-2 mx-4 rounded-xl shadow-lg overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="px-4 py-3 space-y-1"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default LandingHeader;