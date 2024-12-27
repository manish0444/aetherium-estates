import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight,
  Building2
} from 'lucide-react';

const ModernFooter = () => {
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

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' }
  ];

  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_50%)]" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-sky-500" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
                Aetherium Estates
              </span>
            </div>
            <p className="text-slate-400">
              Your trusted partner in finding the perfect property. We provide comprehensive real estate services across the nation.
            </p>
            <div className="space-y-4">
              {[
                { icon: Phone, text: '+1 234 567 890' },
                { icon: Mail, text: 'contact@aetheriumestates.com' },
                { icon: MapPin, text: '123 Quantum Boulevard, Digital City' },
                { icon: Clock, text: 'Mon - Fri: 9:00 AM - 6:00 PM' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                >
                  <item.icon className="h-5 w-5 text-sky-500 group-hover:text-sky-400 transition-colors" />
                  <span className="group-hover:text-sky-400 transition-colors">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors group"
                  >
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Property Types</h3>
            <ul className="space-y-4">
              {propertyTypes.map((type, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <Link 
                    to={type.path}
                    className="flex items-center gap-2 text-slate-400 hover:text-sky-400 transition-colors group"
                  >
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    {type.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Stay Updated</h3>
            <p className="text-slate-400 mb-6">
              Subscribe to our newsletter for the latest property updates and market insights.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-400 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-slate-400 hover:text-sky-400 transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <Link to="/privacy" className="hover:text-sky-400 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-sky-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>© {currentYear} Aetherium Estates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter; 