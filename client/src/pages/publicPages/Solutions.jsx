import React from 'react';
import { motion } from 'framer-motion';

const Solutions = () => {
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
            Our Solutions
          </h1>
          <p className="text-xl text-gray-600">
            Discover how we're revolutionizing real estate
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Advanced algorithms analyze market trends and property data to provide accurate valuations and predictions.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Virtual Tours</h3>
            <p className="text-gray-600">
              Immersive 3D virtual tours allow buyers to explore properties from anywhere in the world.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Smart Matching</h3>
            <p className="text-gray-600">
              Our intelligent matching system connects buyers with their perfect properties based on preferences and behavior.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
