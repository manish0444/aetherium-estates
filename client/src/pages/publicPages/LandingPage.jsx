import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GridBackground from '../../components/GridBackground';
import ParallaxText from '../../components/ParallaxText';
import { FaArrowRight, FaGithub, FaTwitter, FaLinkedin, FaPlay, FaBuildingCircleCheck, FaChartSimple, FaBuilding, FaCity, FaHouse, FaMapLocation } from 'react-icons/fa6';
import { Loader2 } from 'lucide-react';

const cards = [
  {
    title: "Virtual Property Tours",
    description: "Experience properties in immersive 3D virtual reality",
    color: "from-sky-400 to-blue-500",
    icon: <FaPlay className="w-8 h-8" />
  },
  {
    title: "Smart Contracts",
    description: "Secure and transparent blockchain transactions",
    color: "from-blue-500 to-indigo-600",
    icon: <FaBuildingCircleCheck className="w-8 h-8" />
  },
  {
    title: "AI-Powered Analytics",
    description: "Make informed decisions with predictive market insights",
    color: "from-indigo-600 to-purple-600",
    icon: <FaChartSimple className="w-8 h-8" />
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  // Format address helper function
  const formatAddress = (address) => {
    if (!address) return '';
    const parts = address.split(',').map(part => part.trim());
    const reversedParts = parts.reverse();
    const locality = reversedParts.find(part => 
      !part.toLowerCase().includes('nepal') &&
      !part.toLowerCase().includes('district') &&
      !part.toLowerCase().includes('province')
    ) || reversedParts[2];
    return locality;
  };

  // Fetch listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=6&sort=createdAt&order=desc&status=available');
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        } else {
          setListings(data);
          setFilteredListings(data);
        }
      } catch {
        setError('Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter(listing => 
        listing.propertyType.toLowerCase() === activeFilter.toLowerCase()
      );
      setFilteredListings(filtered);
    }
  }, [activeFilter, listings]);

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % cards.length);
    }, 5000);

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-slate-900">
      <GridBackground>
        <div className="relative z-20">
          {/* Enhanced Hero Section */}
      <motion.section
            style={{ opacity, scale, y }}
            className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-32 pb-20"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-sky-500/20 to-blue-500/20 blur-3xl rounded-full" />
              <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full" />
            </div>

            {/* Main Content */}
            <div className="relative text-center max-w-5xl mx-auto mb-12">
          <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ x: mousePosition.x, y: mousePosition.y }}
                className="mb-8"
              >
                <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-sky-400/10 to-blue-400/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-4">
                  Welcome to the Future of Real Estate
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
                style={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
              >
                Aetherium Estates
            </motion.h1>
              
            <motion.p
                className="text-xl md:text-2xl text-slate-300 mb-12"
                initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ x: mousePosition.x * 0.3, y: mousePosition.y * 0.3 }}
            >
                Experience the next generation of real estate investment powered by blockchain and AI
            </motion.p>

            <motion.div
                className="flex flex-wrap justify-center gap-4 mb-12"
                initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/25">
                  Start Exploring
                  <FaArrowRight className="inline-block ml-2" />
                </button>
                <button className="px-8 py-4 bg-slate-800 text-white rounded-lg text-lg font-semibold hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 border border-slate-700 hover:border-sky-500/50">
                  Learn More
                  <FaPlay className="inline-block ml-2" />
                </button>
              </motion.div>

              <motion.div
                className="flex justify-center gap-8 text-slate-400 mb-12"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div>
                  <div className="text-2xl font-bold text-sky-400">500+</div>
                  <div className="text-sm">Properties Listed</div>
                </div>
                <div className="border-l border-slate-700" />
                <div>
                  <div className="text-2xl font-bold text-sky-400">$10M+</div>
                  <div className="text-sm">Total Investment</div>
                </div>
                <div className="border-l border-slate-700" />
                <div>
                  <div className="text-2xl font-bold text-sky-400">50k+</div>
                  <div className="text-sm">Happy Clients</div>
                </div>
              </motion.div>
            </div>

            {/* Interactive Cards */}
            <div className="relative w-full max-w-4xl mx-auto h-80">
              <AnimatePresence mode="wait">
                {cards.map((card, index) => (
                  index === activeCard && (
                    <motion.div
                      key={card.title}
                      initial={{ x: 200, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -200, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`absolute inset-0 p-8 rounded-2xl bg-gradient-to-r ${card.color} shadow-xl transform hover:scale-105 transition-transform duration-300`}
                      style={{
                        x: mousePosition.x * 0.2,
                        y: mousePosition.y * 0.2,
                      }}
                    >
                      <div className="h-full flex flex-col justify-between text-white backdrop-blur-sm bg-white/10 rounded-xl p-6">
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-white/20 rounded-xl">
                              {card.icon}
                            </div>
                            <h3 className="text-3xl font-bold">{card.title}</h3>
                          </div>
                          <p className="text-xl text-white/90">{card.description}</p>
                        </div>
                        <div className="flex justify-end">
              <motion.button
                            whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                            className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold flex items-center group"
              >
                Learn More
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
                        </div>
                      </div>
            </motion.div>
                  )
                ))}
              </AnimatePresence>

              {/* Card Navigation Dots */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex justify-center gap-3">
                {cards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveCard(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeCard 
                        ? 'bg-sky-500 w-6' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
        </div>
      </motion.section>

          {/* Parallax Text */}
          <ParallaxText baseVelocity={-5}>
            DISCOVER • INVEST • GROW • THRIVE •
          </ParallaxText>

          {/* New Interactive Section */}
          <section className="relative py-24 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                  opacity: [0.3, 0.6],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.1),transparent_70%)]"
              />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 mb-6">
                  Why Choose Aetherium Estates?
            </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Experience the perfect blend of technology and real estate
            </p>
          </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Blockchain Security",
                    description: "Every transaction is secured and verified through blockchain technology",
                    icon: <FaBuildingCircleCheck className="w-8 h-8" />,
                    gradient: "from-sky-400 to-blue-500"
                  },
                  {
                    title: "AI-Powered Insights",
                    description: "Make data-driven decisions with our advanced AI analytics",
                    icon: <FaChartSimple className="w-8 h-8" />,
                    gradient: "from-blue-500 to-indigo-600"
                  },
                  {
                    title: "Virtual Experience",
                    description: "Tour properties from anywhere in the world in immersive 3D",
                    icon: <FaPlay className="w-8 h-8" />,
                    gradient: "from-indigo-600 to-purple-600"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                    <div className="relative p-8 bg-slate-800 rounded-2xl">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-slate-300">{feature.description}</p>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-600"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center mt-16"
              >
                <button className="px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/25">
                  Get Started Today
                  <FaArrowRight className="inline-block ml-2" />
                </button>
              </motion.div>
            </div>
          </section>

          {/* New Futuristic Section */}
          <section className="relative min-h-screen overflow-hidden bg-slate-900 py-24">
            {/* Parallax Background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [0, -150]),
                  opacity: useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0.2])
                }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.1),transparent_70%)]" />
                {/* City Silhouette */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-900 to-transparent">
                  <motion.div
                    style={{ x: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
                    className="absolute bottom-0 left-0 right-0 h-32"
                  >
                    <FaCity className="absolute bottom-0 left-1/4 text-sky-500/20 w-24 h-24" />
                    <FaBuilding className="absolute bottom-0 left-1/2 text-sky-500/20 w-32 h-32" />
                    <FaHouse className="absolute bottom-0 right-1/4 text-sky-500/20 w-24 h-24" />
                  </motion.div>
                </div>
              </motion.div>
        </div>

            {/* Main Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Interactive Property Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16"
              >
                <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-4 border border-slate-700">
                  <div className="flex flex-wrap gap-4 justify-center">
                    {['All', 'Apartment', 'House', 'Villa', 'Penthouse', 'Office'].map((filter) => (
                      <motion.button
                        key={filter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-6 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                          activeFilter === filter
                            ? 'bg-sky-500 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-sky-400'
                        }`}
                      >
                        {filter}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Interactive Property Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {loading ? (
                  <div className="col-span-3 flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                  </div>
                ) : error ? (
                  <div className="col-span-3 text-center text-red-500 py-20">
                    {error}
          </div>
                ) : filteredListings.length === 0 ? (
                  <div className="col-span-3 text-center text-slate-400 py-20">
                    No properties found
        </div>
                ) : (
                  filteredListings.slice(0, 6).map((listing, index) => (
          <motion.div
                      key={listing._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative"
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      {/* Property Image */}
                      <div className="relative h-64">
                        <img
                            src={listing.imageUrls[0]}
                            alt={listing.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                      </div>

                      {/* Property Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2">{listing.name}</h3>
                        <div className="flex items-center text-slate-300 mb-4">
                          <FaMapLocation className="w-4 h-4 mr-2" />
                            {formatAddress(listing.address)}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-sky-400">
                              {listing.currency === 'custom' ? listing.customCurrency :
                               listing.currency === 'NPR' ? 'Rs.' :
                               listing.currency === 'USD' ? '$' : '₹'}
                              {listing.regularPrice.toLocaleString()}
                              {listing.type === 'rent' && '/month'}
                            </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/listing/${listing._id}`)}
                            className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>

                      {/* Feature Tags */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                          {Object.entries(listing.amenities || {})
                            .filter(([, value]) => value)
                            .slice(0, 3)
                            .map(([key], i) => (
                          <motion.span
                                key={key}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                                className="px-3 py-1 bg-sky-500/80 backdrop-blur-sm rounded-full text-sm text-white capitalize"
                          >
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                          </motion.span>
                        ))}
                      </div>
                    </div>
          </motion.div>
                  ))
                )}
              </div>

              {/* Interactive 3D Map Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative h-96 rounded-2xl overflow-hidden bg-slate-800/50 backdrop-blur-lg border border-slate-700"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.1),transparent_70%)]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/listings-map')}
                    className="px-8 py-4 bg-sky-500/90 backdrop-blur-sm rounded-xl text-white font-semibold cursor-pointer"
                  >
                    Launch 3D Map
                  </motion.div>
                </div>
                {/* Add grid lines for futuristic effect */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(to right, rgba(56,189,248,0.1) 1px, transparent 1px),
                                   linear-gradient(to bottom, rgba(56,189,248,0.1) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }} />
              </motion.div>
            </div>
          </section>

          {/* Next-Generation Section */}
          <section className="relative min-h-screen overflow-hidden bg-slate-900 py-24">
            {/* Dynamic Intro with Immersive Parallax */}
            <div className="absolute inset-0">
              <motion.div
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [0, -100])
                }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.1),transparent_70%)]" />
                {/* Animated Background Elements */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                    opacity: [0.3, 0.6],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(56,189,248,0.1) 0%, transparent 50%)',
                    backgroundSize: '100% 100%',
                  }}
                />
              </motion.div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Mission Statement */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-center mb-20"
              >
                <motion.h2
                  initial={{ y: 50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 mb-6"
                >
                  Transforming Real Estate
                </motion.h2>
                <motion.p
                  initial={{ y: 30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl text-slate-300 max-w-3xl mx-auto"
                >
                  Building the future of property investment through innovation and technology
                </motion.p>
              </motion.div>

              {/* Interactive Timeline */}
              <div className="mb-32">
                <div className="relative">
                  <div className="absolute left-0 right-0 h-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-blue-600" />
                  <div className="relative flex justify-between">
                    {[
                      { year: '2020', title: 'Foundation', description: 'Company established with a vision' },
                      { year: '2021', title: 'Innovation', description: 'Launched blockchain integration' },
                      { year: '2022', title: 'Growth', description: 'Expanded to 10 major cities' },
                      { year: '2023', title: 'Future', description: 'Leading the digital revolution' }
                    ].map((milestone, index) => (
                      <motion.div
                        key={milestone.year}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                        className="relative group"
                      >
                        <div className="absolute -inset-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                        <div className="relative bg-slate-800 p-6 rounded-lg border border-slate-700">
                          <div className="text-3xl font-bold text-sky-400 mb-2">{milestone.year}</div>
                          <div className="text-xl font-semibold text-white mb-2">{milestone.title}</div>
                          <div className="text-slate-300">{milestone.description}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Statistics and Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
                {[
                  { value: '500+', label: 'Properties Listed', color: 'from-sky-400 to-blue-500' },
                  { value: '$100M+', label: 'Transaction Volume', color: 'from-blue-500 to-indigo-600' },
                  { value: '50k+', label: 'Happy Clients', color: 'from-indigo-600 to-purple-600' },
                  { value: '99%', label: 'Client Satisfaction', color: 'from-purple-600 to-pink-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-lg`} />
                    <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-lg border border-slate-700 text-center">
                      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-slate-300">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Team Section */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-center mb-16"
              >
                <h3 className="text-3xl font-bold text-white mb-12">Meet Our Visionaries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { name: 'Alex Chen', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' },
                    { name: 'Sarah Johnson', role: 'CTO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' },
                    { name: 'Michael Zhang', role: 'Head of Innovation', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80' }
                  ].map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                      <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden">
                        <div className="aspect-square">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h4 className="text-xl font-semibold text-white mb-1">{member.name}</h4>
                          <p className="text-sky-400">{member.role}</p>
                        </div>
                      </div>
              </motion.div>
            ))}
          </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="relative inline-block group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-lg font-semibold"
                  >
                    Join the Revolution
                    <FaArrowRight className="inline-block ml-2" />
                  </motion.button>
                </div>
              </motion.div>
        </div>
      </section>

          {/* Trailblazing Innovation Section */}
          <section className="relative min-h-screen overflow-hidden bg-slate-900 py-24">
            {/* AI-Driven Welcome Portal */}
            <div className="absolute inset-0">
              <motion.div
                style={{
                  y: useTransform(scrollYProgress, [0, 1], [0, -100])
                }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(56,189,248,0.1),transparent_70%)]" />
                {/* Animated Particles Background */}
                <motion.div
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                    opacity: [0.3, 0.6],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'radial-gradient(circle at center, rgba(56,189,248,0.1) 0%, transparent 50%)',
                    backgroundSize: '100% 100%',
                  }}
                />
              </motion.div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* AI Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <motion.div
                  className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-sky-400/10 to-blue-400/10 border border-sky-500/20 mb-6"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-sky-400"
                  >
                    {new Date().getHours() < 12 ? "Good Morning" : 
                     new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}
                  </motion.span>
                </motion.div>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 mb-6"
                >
                  Revolutionizing Real Estate
                </motion.h2>
              </motion.div>

              {/* Dynamic Mission Reel */}
              <div className="mb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative rounded-2xl overflow-hidden"
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    >
                      <source src="/videos/mission.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col justify-center"
                  >
                    <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
                    <p className="text-xl text-slate-300 mb-8">
                      Transforming the real estate industry through cutting-edge technology and innovation.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: '24/7', label: 'AI Support' },
                        { value: '100%', label: 'Secure' },
                        { value: '0%', label: 'Hidden Fees' },
                        { value: '1M+', label: 'Users' }
                      ].map((stat, index) => (
          <motion.div
                          key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700"
                        >
                          <div className="text-2xl font-bold text-sky-400">{stat.value}</div>
                          <div className="text-slate-400">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Interactive Innovation Showcase */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-32"
              >
                <h3 className="text-3xl font-bold text-white text-center mb-12">Innovation Hub</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'AI-Powered Matching',
                      description: 'Smart property recommendations based on your preferences',
                      icon: '🤖',
                      color: 'from-sky-400 to-blue-500'
                    },
                    {
                      title: 'Blockchain Security',
                      description: 'Secure and transparent transactions with smart contracts',
                      icon: '🔒',
                      color: 'from-blue-500 to-indigo-600'
                    },
                    {
                      title: 'Virtual Reality Tours',
                      description: 'Immersive 3D property tours from anywhere',
                      icon: '🏠',
                      color: 'from-indigo-600 to-purple-600'
                    }
                  ].map((innovation, index) => (
                    <motion.div
                      key={innovation.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      whileHover={{ scale: 1.05, rotateY: 10 }}
                      className="group relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur" />
                      <div className="relative h-full bg-slate-800 p-8 rounded-2xl border border-slate-700">
                        <div className="text-4xl mb-4">{innovation.icon}</div>
                        <h4 className="text-xl font-bold text-white mb-2">{innovation.title}</h4>
                        <p className="text-slate-300">{innovation.description}</p>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Real-Time Impact Dashboard */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-32"
              >
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
                  <h3 className="text-3xl font-bold text-white text-center mb-12">Real-Time Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                      { label: 'Active Users', value: '2.5k', trend: '+12%' },
                      { label: 'Properties Listed', value: '15k', trend: '+8%' },
                      { label: 'Transactions', value: '$50M', trend: '+15%' },
                      { label: 'Client Satisfaction', value: '98%', trend: '+2%' }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                        <div className="text-slate-400 mb-2">{metric.label}</div>
                        <div className="text-emerald-400 text-sm">{metric.trend}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
              >
                <div className="relative inline-block group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                    className="relative px-8 py-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg text-lg font-semibold"
                    onClick={() => navigate('/sign-up')}
            >
                    Start Your Journey
                    <FaArrowRight className="inline-block ml-2" />
            </motion.button>
                </div>
          </motion.div>
        </div>
      </section>

          {/* Footer */}
          <footer className="bg-slate-800/50 backdrop-blur-lg border-t border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-600 mb-4">
                    Aetherium Estates
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Revolutionizing real estate investment through blockchain technology and artificial intelligence.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                      <FaTwitter className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                      <FaGithub className="w-6 h-6" />
                    </a>
                    <a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">
                      <FaLinkedin className="w-6 h-6" />
                    </a>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">About Us</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">Properties</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">Investment</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">Contact</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4">Resources</h4>
                  <ul className="space-y-2">
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">Documentation</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="text-slate-300 hover:text-sky-400 transition-colors">FAQ</a></li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-400">
                <p>&copy; {new Date().getFullYear()} Aetherium Estates. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </GridBackground>
    </div>
  );
}