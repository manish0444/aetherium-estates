import React from "react";
import { CiCircleCheck } from "react-icons/ci";
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope } from "react-icons/fa";

const About = () => {
  const teamMembers = [
    {
      name: "Jeevan Dahal ",
      role: "CEO & Developer",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
        email: "mailto:rftg@example.com"
      }
    },
    {
      name: "Manish bhandari",
      role: "CEO & Technical Developer",
      social: {
        linkedin: "#",
        github: "#",
        email: "mailto:d@example.com"
      }
    },
    {
      name: "Suraj ",
      role: "Founding Investor",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "mailto:d@example.com"
      }
    },
    {
      name: "Kreetan ",
      role: "Lead Investor",
      social: {
        linkedin: "#",
        email: "mailto:d@example.com"
      }
    },
    {
      name: "Ankit ",
      role: "Founding Partner",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "mailto:d@example.com"
      }
    }
  ];

  const stats = [
    { value: "500+", label: "Properties Sold" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "35+", label: "Years Experience" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                About Us
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Building the Future of
                <span className="block text-blue-600">Real Estate</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                We're revolutionizing the real estate industry through innovative technology and exceptional service. Our team combines deep industry expertise with cutting-edge technical knowledge.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-3xl transform rotate-3"></div>
              <img
                src="/api/placeholder/600/400"
                alt="Hero"
                className="relative rounded-3xl shadow-xl transform transition-transform hover:-translate-y-2 duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-blue-600">{stat.value}</div>
                <div className="mt-2 text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Our Vision
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Transforming Real Estate Through Technology
              </h2>
              <p className="text-gray-600">
                Our vision is to create a seamless, transparent, and efficient real estate marketplace powered by cutting-edge technology. We believe in combining traditional real estate expertise with modern technical innovation to deliver exceptional value to our clients.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-3xl transform -rotate-3"></div>
              <img
                src="/api/placeholder/600/400"
                alt="Vision"
                className="relative rounded-3xl shadow-xl transform transition-transform hover:-translate-y-2 duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Our Team
            </span>
            <h2 className="mt-4 text-3xl lg:text-4xl font-bold text-gray-900">
              Meet the Innovators
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
              <div key={member.name} className="group">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-blue-200 rounded-xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                  <img
                    src="/api/placeholder/300/300"
                    alt={member.name}
                    className="relative w-full h-64 object-cover rounded-xl shadow-lg transform transition-transform group-hover:-translate-y-1 duration-300"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 mb-4">{member.role}</p>
                <div className="flex space-x-4">
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-500 transition-colors">
                      <FaLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.twitter && (
                    <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                      <FaTwitter className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.github && (
                    <a href={member.social.github} className="text-gray-400 hover:text-gray-900 transition-colors">
                      <FaGithub className="w-5 h-5" />
                    </a>
                  )}
                  {member.social.email && (
                    <a href={member.social.email} className="text-gray-400 hover:text-red-500 transition-colors">
                      <FaEnvelope className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                Our Technology
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Powered by Innovation
              </h2>
              <ul className="space-y-4">
                {[
                  "Advanced Property Search Algorithms",
                  "Real-time Market Analytics",
                  "Secure Transaction Processing",
                  "Virtual Property Tours",
                  "Smart Contract Integration",
                  "AI-Powered Property Recommendations",
                ].map((tech) => (
                  <li key={tech} className="flex items-center space-x-3 group">
                    <CiCircleCheck className="w-6 h-6 text-green-500 transform transition-transform group-hover:scale-110 duration-300" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {tech}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-200 rounded-3xl transform -rotate-3"></div>
              <img
                src="/api/placeholder/600/400"
                alt="Technology"
                className="relative rounded-3xl shadow-xl transform transition-transform hover:-translate-y-2 duration-300"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;