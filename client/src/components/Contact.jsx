import { useState } from 'react';
import { Mail, Loader2, X, User, Crown, Badge, Clock, Send } from 'lucide-react';
import { useSelector } from 'react-redux';

const RoleBadge = ({ role }) => {
  const badges = {
    admin: {
      class: "bg-gradient-to-r from-red-500 via-purple-500 to-blue-500",
      animation: "animate-shimmer-fast",
      border: "border-purple-300",
      text: "Administrator",
      icon: Crown
    },
    agent: {
      class: "bg-gradient-to-r from-blue-400 via-teal-500 to-blue-600",
      animation: "animate-shimmer-medium",
      border: "border-blue-300",
      text: "Agent",
      icon: Badge
    },
    user: {
      class: "bg-gradient-to-r from-green-400 to-blue-400",
      animation: "animate-shimmer-slow",
      border: "border-green-300",
      text: "User",
      icon: User
    }
  };

  const badge = badges[role] || badges.user;
  const Icon = badge.icon;

  return (
    <div className={`relative overflow-hidden rounded-full`}>
      <div className={`
        ${badge.class} ${badge.animation}
        px-4 py-1 rounded-full border ${badge.border}
        text-white font-medium shadow-lg
        flex items-center gap-2
      `}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </div>
    </div>
  );
};

export default function Contact({ listing, onClose }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');

    try {
      if (!listing.landlordEmail) {
        throw new Error('Landlord email not available');
      }

      const response = await fetch('/api/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: listing.landlordEmail,
          from: currentUser.email,
          subject: `Inquiry about: ${listing.name}`,
          message: message,
          listingTitle: listing.name,
          senderName: currentUser.username,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage('');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-auto shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Contact Landlord</h2>
              <p className="text-sm text-gray-500 mt-1">
                Regarding: {listing.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <img
              src={currentUser.avatar || "/default-avatar.png"}
              alt={currentUser.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{currentUser.username}</h3>
              <RoleBadge role={currentUser.role || 'user'} />
            </div>
          </div>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              Message sent successfully! The landlord will contact you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Typical response time: 24h
                </div>
                <button
                  type="submit"
                  disabled={loading || !message.trim()}
                  className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2
                    ${loading || !message.trim() 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
