import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pannellum } from 'pannellum-react';

const VirtualTour = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [activeScene, setActiveScene] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFloorPlan, setShowFloorPlan] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListing();
  }, [listingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const scenes = [
    {
      id: 'livingRoom',
      title: 'Living Room',
      panorama: listing?.virtualTourImages?.[0] || 'default-360-image.jpg',
      hotSpots: [
        {
          pitch: 10,
          yaw: 110,
          type: 'scene',
          text: 'Go to Kitchen',
          sceneId: 'kitchen'
        }
      ]
    },
    {
      id: 'kitchen',
      title: 'Kitchen',
      panorama: listing?.virtualTourImages?.[1] || 'default-360-image.jpg',
      hotSpots: [
        {
          pitch: -10,
          yaw: -130,
          type: 'scene',
          text: 'Back to Living Room',
          sceneId: 'livingRoom'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tour Controls */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Virtual Tour: {listing?.name}
              </h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowFloorPlan(!showFloorPlan)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showFloorPlan ? 'Hide Floor Plan' : 'Show Floor Plan'}
                </button>
                <select
                  value={activeScene}
                  onChange={(e) => setActiveScene(Number(e.target.value))}
                  className="px-4 py-2 border rounded-lg"
                >
                  {scenes.map((scene, index) => (
                    <option key={scene.id} value={index}>
                      {scene.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Virtual Tour Viewer */}
          <div className="relative" style={{ height: '70vh' }}>
            <Pannellum
              width="100%"
              height="100%"
              image={scenes[activeScene].panorama}
              pitch={10}
              yaw={180}
              hfov={110}
              autoLoad
              onLoad={() => {
                console.log('panorama loaded');
              }}
              hotSpots={scenes[activeScene].hotSpots}
            />
          </div>

          {/* Floor Plan Overlay */}
          {showFloorPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Interactive Floor Plan</h3>
                  <button
                    onClick={() => setShowFloorPlan(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={listing?.floorPlan || '/default-floor-plan.jpg'}
                  alt="Floor Plan"
                  className="w-full h-auto"
                />
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Property Details</h4>
                    <p>Total Area: {listing?.area} sq ft</p>
                    <p>Bedrooms: {listing?.bedrooms}</p>
                    <p>Bathrooms: {listing?.bathrooms}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Room Dimensions</h4>
                    <p>Living Room: 20' × 15'</p>
                    <p>Kitchen: 12' × 10'</p>
                    <p>Master Bedroom: 15' × 12'</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Property Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Virtual Staging</h3>
            <p className="text-gray-600">
              See this property fully furnished with our virtual staging technology.
              Visualize the space with different styles and layouts.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Measurements</h3>
            <p className="text-gray-600">
              Get accurate room dimensions and explore the layout with our
              interactive measuring tools.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-4">Video Walkthrough</h3>
            <p className="text-gray-600">
              Take a guided tour of the property with our professional video
              walkthrough.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
