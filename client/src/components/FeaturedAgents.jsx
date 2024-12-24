import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, ThumbsUp } from 'lucide-react';

export default function FeaturedAgents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchTopAgents = async () => {
      try {
        const res = await fetch('/api/user/agents?limit=4&sort=rating');
        const data = await res.json();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchTopAgents();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Meet Our Top Agents
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Work with the best real estate professionals in the industry
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {agents.map((agent) => (
            <Link
              key={agent._id}
              to={`/user-profile/${agent._id}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={agent.photo}
                    alt={agent.username}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  {agent.isVerified && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full">
                      <Award className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{agent.username}</h3>
                  <p className="text-gray-600 text-sm mb-4">{agent.specialization}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{agent.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-blue-500" />
                      <span>{agent.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 