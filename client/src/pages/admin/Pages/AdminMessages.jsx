import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Download, Reply, Loader2 } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages/all');
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId) => {
    try {
      const res = await fetch(`/api/messages/reply/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reply })
      });
      const data = await res.json();
      if (data.success) {
        fetchMessages();
        setReply('');
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">User Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message._id}
              className={`p-4 rounded-lg border ${
                selectedMessage?._id === message._id 
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              } cursor-pointer transition-colors`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{message.user.username}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(message.createdAt), 'PPp')}
                  </p>
                </div>
                {message.files?.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {message.files.length} attachment(s)
                  </span>
                )}
              </div>
              <p className="text-gray-700">{message.message}</p>
            </div>
          ))}
        </div>

        {/* Message Details */}
        {selectedMessage && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Message Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium">{selectedMessage.user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Message</p>
                  <p className="text-gray-700">{selectedMessage.message}</p>
                </div>
                {selectedMessage.files?.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.files.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          download
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Reply</h3>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows={4}
                placeholder="Type your reply..."
              />
              <button
                onClick={() => handleReply(selectedMessage._id)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Reply className="h-5 w-5" />
                Send Reply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 