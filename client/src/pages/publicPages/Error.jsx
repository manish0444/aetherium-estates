import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated House */}
        <div className="animate-bounce">
          <div className="relative mx-auto w-48 h-48">
            {/* House shape using divs */}
            <div className="absolute bottom-0 w-48 h-32 bg-blue-500 rounded-lg" />
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[96px] border-l-transparent border-b-[64px] border-b-red-500 border-r-[96px] border-r-transparent" />
            {/* Door */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-20 bg-yellow-500 rounded-t-lg" />
            {/* Windows */}
            <div className="absolute bottom-16 left-8 w-8 h-8 bg-white rounded-sm" />
            <div className="absolute bottom-16 right-8 w-8 h-8 bg-white rounded-sm" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Looks like this property is off the market!
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The house you're looking for seems to have moved neighborhoods. 
            Don't worry, we have plenty of other dream homes waiting for you!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Homepage
          </a>
          <a 
            href="/listings"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            View Available Properties
          </a>
        </div>

        {/* Fun Message */}
        <p className="text-sm text-gray-500 italic animate-pulse">
          Plot twist: Even our 404 page has better curb appeal than some listings!
        </p>
      </div>
    </div>
  );
};

export default NotFound;