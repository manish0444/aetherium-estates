import { useState, useEffect, useRef } from 'react';
import { Send, X, Minus, Maximize2, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleBadge } from './RoleBadge';

export default function ChatBox({ onClose, minimized, onMinimize }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      message: "👋 Hi there! How can I help you today?",
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isAdmin: true
    },
    {
      message: "I'm here to assist you with any questions about properties or our services.",
      createdAt: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
      isAdmin: true
    }
  ]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const messageRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Clear status messages after delay
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please sign in to send messages');
      setTimeout(() => navigate('/sign-in'), 2000);
      return;
    }

    if (!message.trim()) return;

    try {
      setSending(true);
      
      const res = await fetch('/api/message/send-to-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message.trim(),
          userEmail: currentUser.email,
          userName: currentUser.username,
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        setSuccess('Message sent successfully!');
        setMessages(prev => [...prev, {
          message: message.trim(),
          createdAt: new Date(),
          isAdmin: false
        }]);
        setMessage('');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    setMessage(e.target.value);
  };

  if (minimized) {
    return (
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={onMinimize}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 group"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {messages.length}
        </span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Chat with Admin</h3>
              <RoleBadge role="admin" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onMinimize}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <Minus className="h-5 w-5 text-white" />
            </button>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="p-4 h-96 overflow-y-auto space-y-4 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="h-12 w-12 mb-2 text-gray-400" />
              <p className="text-center">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                key={index}
                className={`flex flex-col gap-1 ${msg.isAdmin ? '' : 'items-end'}`}
              >
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  msg.isAdmin 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-blue-600 text-white'
                }`}>
                  {msg.message}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </motion.div>
            ))
          )}

          {/* Status messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-50 text-green-600 p-3 rounded-lg text-sm"
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t bg-gray-50">
          <div className="flex items-end gap-2">
            <textarea
              ref={messageRef}
              value={message}
              onChange={handleTextareaChange}
              placeholder={currentUser ? "Type your message..." : "Please sign in to send messages"}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
              style={{ minHeight: '44px', maxHeight: '120px' }}
              disabled={!currentUser || sending}
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              disabled={!currentUser || sending || !message.trim()}
            >
              <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}