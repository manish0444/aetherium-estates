import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
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
            Platform Features
          </h1>
          <p className="text-xl text-gray-600">
            Everything you need to succeed in real estate
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">For Buyers</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Advanced property search filters
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Virtual property tours
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Saved searches and alerts
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Neighborhood insights
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-8 rounded-xl shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-4">For Agents</h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Listing management dashboard
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Client communication tools
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Analytics and reporting
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Marketing automation
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Features;
