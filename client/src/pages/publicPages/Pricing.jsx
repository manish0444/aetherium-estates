import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Pricing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/sign-up');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that's right for you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">Basic</h3>
            <div className="text-4xl font-bold mb-4">Free</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Up to 3 listings
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Basic search features
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Property alerts
              </li>
            </ul>
            <button
              onClick={handleGetStarted}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white p-8 rounded-xl shadow-lg relative"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-semibold mb-4">Pro</h3>
            <div className="text-4xl font-bold mb-4">$29/mo</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                Unlimited listings
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                Advanced search
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                Virtual tours
              </li>
              <li className="flex items-center">
                <span className="text-yellow-400 mr-2">✓</span>
                Priority support
              </li>
            </ul>
            <button
              onClick={handleGetStarted}
              className="w-full bg-white text-blue-600 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started
            </button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
            <div className="text-4xl font-bold mb-4">Custom</div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                All Pro features
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom integrations
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Dedicated support
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Custom branding
              </li>
            </ul>
            <button
              onClick={() => navigate('/contact')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Sales
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
