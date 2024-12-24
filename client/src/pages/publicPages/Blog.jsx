import React from 'react';
import { Clock, User, ArrowRight, Search } from 'lucide-react';

const BlogCard = ({ post }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1">
    <img 
      src={`/api/placeholder/800/400`}
      alt={post.title} 
      className="w-full h-48 object-cover"
    />
    <div className="p-6">
      <div className="flex gap-4 mb-3">
        {post.categories.map((category, idx) => (
          <span 
            key={idx} 
            className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600"
          >
            {category}
          </span>
        ))}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {post.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {post.excerpt}
      </p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{post.date}</span>
        </div>
      </div>
    </div>
  </div>
);

const FeaturedPost = ({ post }) => (
  <div className="relative bg-white rounded-xl shadow-lg overflow-hidden h-[500px] group">
    <img 
      src={`/api/placeholder/1200/800`}
      alt={post.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
    <div className="absolute bottom-0 p-8 text-white">
      <div className="flex gap-4 mb-4">
        {post.categories.map((category, idx) => (
          <span 
            key={idx}
            className="text-xs font-medium px-3 py-1 rounded-full bg-white/20"
          >
            {category}
          </span>
        ))}
      </div>
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-200 mb-6 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg transition-colors hover:bg-white/30">
          Read More
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

const BlogPage = () => {
  // Sample blog data
  const featuredPost = {
    title: "The Future of Real Estate in Kathmandu Valley",
    excerpt: "Exploring upcoming developments and investment opportunities in Nepal's rapidly growing capital region.",
    author: "Aarav Sharma",
    date: "November 8, 2024",
    categories: ["Market Analysis", "Investment"]
  };

  const posts = [
    {
      title: "5 Best Locations for Your First Home in Pokhara",
      excerpt: "A comprehensive guide to finding the perfect residential area in the city of lakes.",
      author: "Priya Adhikari",
      date: "November 7, 2024",
      categories: ["Buying Guide", "Residential"]
    },
    {
      title: "Understanding Property Registration Process in Nepal",
      excerpt: "Step-by-step guide to navigating property documentation and legal requirements.",
      author: "Rajesh KC",
      date: "November 6, 2024",
      categories: ["Legal", "Guide"]
    },
    {
      title: "Commercial Real Estate Trends in 2024",
      excerpt: "Analysis of current market trends and future predictions for commercial properties.",
      author: "Samir Thapa",
      date: "November 5, 2024",
      categories: ["Commercial", "Market Analysis"]
    },
    {
      title: "Home Renovation Tips for Nepalese Weather",
      excerpt: "Expert advice on making your property weather-resistant and comfortable year-round.",
      author: "Maya Gurung",
      date: "November 4, 2024",
      categories: ["Home Improvement", "Tips"]
    },
    {
      title: "Investment Opportunities in Emerging Cities",
      excerpt: "Exploring real estate potential in Nepal's rapidly developing urban areas.",
      author: "Bikash Shrestha",
      date: "November 3, 2024",
      categories: ["Investment", "Market Analysis"]
    },
    {
      title: "Smart Home Technology in Nepal",
      excerpt: "Latest trends in home automation and smart solutions for modern living.",
      author: "Nisha Pradhan",
      date: "November 2, 2024",
      categories: ["Technology", "Modern Living"]
    }
  ];

  const categories = [
    "Market Analysis", "Investment", "Buying Guide", "Residential",
    "Commercial", "Legal", "Home Improvement", "Technology"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NepalNiwas Blog
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Insights and guides about Nepal's real estate market
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12 flex flex-wrap gap-2 justify-center">
          {categories.map((category, idx) => (
            <button
              key={idx}
              className="px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <FeaturedPost post={featuredPost} />
        </div>

        {/* Recent Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <BlogCard key={idx} post={post} />
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto">
            Load More Articles
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;