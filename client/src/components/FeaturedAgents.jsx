import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, ThumbsUp, Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function FeaturedAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchTopAgents = async () => {
      try {
        const res = await fetch('/api/user/agents?limit=4&sort=rating');
        const data = await res.json();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopAgents();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, index) => (
        <div 
          key={index} 
          className={`rounded-xl overflow-hidden ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}
        >
          <div className="aspect-square bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className={`py-16 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold sm:text-4xl mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Meet Our Top Agents
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Work with the best real estate professionals in the industry
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map((agent) => (
              <Link
                key={agent._id}
                to={`/user-profile/${agent._id}`}
                className="group"
              >
                <div className={`relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                  isDarkMode ? 'bg-slate-800' : 'bg-white'
                }`}>
                  {/* Image Container */}
                  <div className="relative aspect-square">
                    <img
                      src={agent.photo || '/default-avatar.png'}
                      alt={agent.username}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Verification Badge */}
                    {agent.isVerified && (
                      <div className={`absolute top-2 right-2 p-2 rounded-full shadow-lg ${
                        isDarkMode ? 'bg-sky-500' : 'bg-blue-600'
                      }`}>
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{agent.username}</h3>
                    <p className={`text-sm mb-4 ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>{agent.specialization || 'Real Estate Agent'}</p>
                    
                    <div className={`flex items-center justify-between text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center gap-1">
                        <Star className={isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} />
                        <span>{agent.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className={isDarkMode ? 'text-sky-400' : 'text-blue-500'} />
                        <span>{agent.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 