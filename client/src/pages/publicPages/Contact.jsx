import React from "react";
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactPage = () => {
  const admins = [
    {
      name: "Jeevan Dahal ",
      role: "CEO & Developer",
      email: "d@example.com",
      phone: "868",
      address: "123 Tech ",
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#"
      },
      availability: "Mon-Fri, 9AM-5PM PST",
      profileImage: "/api/placeholder/400/400"
    },
    {
      name: "Manish Bhandari",
      role: "CEO & Technical Lead",
      email: "d@example.com",
      phone: "+1",
      address: "456  ",
      social: {
        linkedin: "#",
        github: "#"
      },
      availability: "Mon-Fri, 10AM-6PM PST",
      profileImage: "/api/placeholder/400/400"
    },
    {
      name: "Suraj ",
      role: "Founding Investor",
      email: "d@example.com",
      phone: "+1 ",
      address: "789 ",
      social: {
        linkedin: "#",
        twitter: "#"
      },
      availability: "By appointment",
      profileImage: "/api/placeholder/400/400"
    },
    {
      name: "Kreetan ",
      role: "Lead Investor",
      email: "d@example.com",
      phone: "+1 (555) 456-7890",
      address: "321 ",
      social: {
        linkedin: "#"
      },
      availability: "Tue-Thu, 11AM-4PM EST",
      profileImage: "/api/placeholder/400/400"
    },
    {
      name: "Ankit ",
      role: "Founding Partner",
      email: "t@example.com",
      phone: "+1 ",
      address: "654",
      social: {
        linkedin: "#",
        twitter: "#"
      },
      availability: "Mon-Wed, 9AM-3PM EST",
      profileImage: "/api/placeholder/400/400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <header className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
            Contact Our <span className="text-blue-600">Team</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with our leadership team. We're here to help you with any questions or inquiries you might have.
          </p>
        </div>
      </header>

      {/* Admin Cards Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {admins.map((admin) => (
              <div
                key={admin.name}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Profile Header */}
                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <img
                      src={admin.profileImage}
                      alt={admin.name}
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  </div>
                </div>

                {/* Profile Content */}
                <div className="pt-16 p-6 space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">{admin.name}</h3>
                    <p className="text-blue-600 font-medium">{admin.role}</p>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaEnvelope className="w-5 h-5 text-blue-500" />
                      <a href={`mailto:${admin.email}`} className="hover:text-blue-600 transition-colors">
                        {admin.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <FaPhone className="w-5 h-5 text-blue-500" />
                      <a href={`tel:${admin.phone}`} className="hover:text-blue-600 transition-colors">
                        {admin.phone}
                      </a>
                    </div>
                    <div className="flex items-start space-x-3 text-gray-600">
                      <FaMapMarkerAlt className="w-5 h-5 text-blue-500 mt-1" />
                      <span>{admin.address}</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                    <p className="font-medium">Available: {admin.availability}</p>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4 pt-4">
                    {admin.social.linkedin && (
                      <a
                        href={admin.social.linkedin}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaLinkedin className="w-6 h-6" />
                      </a>
                    )}
                    {admin.social.twitter && (
                      <a
                        href={admin.social.twitter}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTwitter className="w-6 h-6" />
                      </a>
                    )}
                    {admin.social.github && (
                      <a
                        href={admin.social.github}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaGithub className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;