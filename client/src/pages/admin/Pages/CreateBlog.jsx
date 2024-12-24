import React, { useState } from 'react';
import { Save, Plus, Trash, Edit, Search, Upload, X } from 'lucide-react';
import Sidebar from '../Navbar/page';

const BlogAdminPage = () => {
  const [posts, setPosts] = useState([
    {
      title: "The Future of Real Estate in Kathmandu Valley",
      excerpt: "Exploring upcoming developments and investment opportunities in Nepal's rapidly growing capital region.",
      author: "Aarav Sharma",
      date: "2024-11-08",
      categories: ["Market Analysis", "Investment"],
      isFeatured: true,
      image: null
    }
  ]);

  const [editingPost, setEditingPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState = {
    title: '',
    excerpt: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    categories: [],
    isFeatured: false,
    image: null
  };

  const [formData, setFormData] = useState(initialFormState);

  const categories = [
    "Market Analysis", "Investment", "Buying Guide", "Residential",
    "Commercial", "Legal", "Home Improvement", "Technology"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (!formData.categories.includes(value) && value) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    }
  };

  const removeCategory = (categoryToRemove) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost !== null) {
      setPosts(prev => prev.map((post, idx) => 
        idx === editingPost ? { ...formData, image: imagePreview } : post
      ));
    } else {
      setPosts(prev => [...prev, { ...formData, image: imagePreview }]);
    }
    setFormData(initialFormState);
    setImagePreview(null);
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (postIndex) => {
    setEditingPost(postIndex);
    const post = posts[postIndex];
    setFormData({
      ...post,
      date: post.date.split('T')[0]
    });
    setImagePreview(post.image);
    setShowForm(true);
  };

  const handleDelete = (postIndex) => {
    setPosts(prev => prev.filter((_, idx) => idx !== postIndex));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gradient-to-br from-cyan-900 via-gray-900 to-white/5">
        <div className="relative z-10 p-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Blog Management</h1>
              <button 
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700 transition-colors backdrop-blur-sm"
              >
                <Plus className="h-4 w-4" />
                New Post
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-gray-900/70 backdrop-blur-md rounded-lg shadow-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {editingPost !== null ? 'Edit Post' : 'Create New Post'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form fields remain the same */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Featured Image</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
                      } transition-colors`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-48 mx-auto rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <div className="text-sm text-gray-300">
                            <label className="cursor-pointer text-blue-400 hover:text-blue-300">
                              Click to upload
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e.target.files[0])}
                              />
                            </label>
                            <span> or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Categories</label>
                    <select
                      onChange={handleCategoryChange}
                      className="w-full rounded-lg bg-gray-800/50 border border-gray-700 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    >
                      <option value="">Select a category...</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-800/50 text-gray-200 text-sm"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="text-gray-400 hover:text-gray-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-4 h-4 bg-gray-800/50 border-gray-700 rounded focus:ring-blue-500 text-blue-600"
                    />
                    <label className="text-sm font-medium text-gray-300">Featured Post</label>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingPost(null);
                        setFormData(initialFormState);
                        setImagePreview(null);
                      }}
                      className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      {editingPost !== null ? 'Update Post' : 'Create Post'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Posts List */}
            <div className="bg-gray-900/70 backdrop-blur-md rounded-lg shadow-xl border border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-12 outline-none transition-colors"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Posts Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800/50 text-gray-300 text-left">
                    <th className="p-4">Title</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Categories</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredPosts.map((post, index) => (
                    <tr key={index} className="text-gray-300 hover:bg-gray-800/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {post.image && (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="h-10 w-10 object-cover rounded"
                            />
                          )}
                          <span className="font-medium">{post.title}</span>
                        </div>
                      </td>
                      <td className="p-4">{post.author}</td>
                      <td className="p-4">{new Date(post.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {post.categories.map((category) => (
                            <span
                              key={category}
                              className="px-2 py-1 text-xs rounded-full bg-gray-800/50 text-gray-300"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        {post.isFeatured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200">
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800/50 text-gray-400">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="p-1 hover:bg-gray-800/50 rounded-lg transition-colors"
                            title="Edit post"
                          >
                            <Edit className="h-4 w-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="p-1 hover:bg-gray-800/50 rounded-lg transition-colors"
                            title="Delete post"
                          >
                            <Trash className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPosts.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-400">
                        No posts found. {searchTerm ? 'Try a different search term.' : 'Create your first post!'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BlogAdminPage;