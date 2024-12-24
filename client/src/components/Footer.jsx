import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Blog', path: '/blog' }
  ];

  const propertyTypes = [
    { name: 'Apartments', path: '/search?type=apartment' },
    { name: 'Houses', path: '/search?type=house' },
    { name: 'Villas', path: '/search?type=villa' },
    { name: 'Commercial', path: '/search?type=commercial' },
    { name: 'Luxury Homes', path: '/search?type=luxury' }
  ];

  const popularSearches = [
    { name: 'Properties for Sale', path: '/search?type=sale' },
    { name: 'Properties for Rent', path: '/search?type=rent' },
    { name: 'New Projects', path: '/search?category=new' },
    { name: 'Featured Properties', path: '/search?featured=true' },
    { name: 'Special Offers', path: '/search?offer=true' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Estate Elite</h3>
            <p className="mb-6 text-gray-400">
              Your trusted partner in finding the perfect property. We provide comprehensive real estate services across the nation.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <span>+000000</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>contact@.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>123 Real Estate </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Property Types</h3>
            <ul className="space-y-4">
              {propertyTypes.map((type, index) => (
                <li key={index}>
                  <Link 
                    to={type.path}
                    className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {type.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Searches */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Popular Searches</h3>
            <ul className="space-y-4">
              {popularSearches.map((search, index) => (
                <li key={index}>
                  <Link 
                    to={search.path}
                    className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {search.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

       
        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-white text-lg font-semibold mb-4">List Your Property for Sale</h3>
            <p className="text-gray-400 mb-6">
            To list a property for sale, please contact our admin team for assistance.
            </p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 mt-12 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-blue-500 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/privacy" className="hover:text-blue-500 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-blue-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>© {currentYear} Estate Elite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;