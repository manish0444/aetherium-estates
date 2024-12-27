import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
    resources: [
      { name: 'Properties', href: '/listings' },
      { name: 'Agents', href: '/agents' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'FAQs', href: '/faqs' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'LinkedIn', icon: FaLinkedin, href: '#' },
    { name: 'GitHub', icon: FaGithub, href: '#' },
  ];

  return (
    <footer className="transition-colors duration-300">
      {/* Gradient Border */}
      <div className={`h-1 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-sky-600 via-blue-500 to-sky-600'
          : 'bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600'
      }`} />

      <div className={`transition-colors duration-300 ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                <span className={`text-xl font-bold ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-sky-400 to-blue-500'
                    : 'bg-gradient-to-r from-purple-600 to-blue-500'
                } bg-clip-text text-transparent`}>
                  Aetherium Estates
                </span>
              </Link>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Experience the future of real estate with our innovative platform. Find your dream property with advanced search and virtual tours.
              </p>
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`transition-colors ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-sky-400' 
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <social.icon className="h-6 w-6" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className={`font-semibold uppercase tracking-wider mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className={`transition-colors ${
                          isDarkMode 
                            ? 'text-slate-400 hover:text-white' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className={`mt-12 pt-8 border-t ${
            isDarkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <div className="max-w-md mx-auto lg:max-w-none">
              <h3 className={`font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Subscribe to our newsletter
              </h3>
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-gray-100 border-transparent text-gray-900 focus:ring-purple-500 focus:border-purple-500'
                  }`}
                />
                <button
                  type="submit"
                  className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700' 
                      : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600'
                  }`}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`mt-12 pt-8 border-t ${
            isDarkMode ? 'border-slate-800' : 'border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                © {new Date().getFullYear()} Aetherium Estates. All rights reserved.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <Link
                  to="/privacy"
                  className={`text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className={`text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;