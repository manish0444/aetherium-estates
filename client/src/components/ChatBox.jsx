import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minus, MessageCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleBadge } from './RoleBadge';
import { format } from 'date-fns';

// AI Training Data
const aiTrainingData = {
  greetings: [
    "Hello! How can I assist you with your real estate needs today?",
    "Welcome to Aetherium Estates! I'm here to help you find your perfect property.",
    "Hi there! Looking for your dream home? I'm here to guide you through the process."
  ],
  propertySearch: [
    "I can help you search for properties based on your preferences. What type of property are you looking for?",
    "Would you like me to show you our latest listings that match your criteria?",
    "I can filter properties by location, price range, and features. What are your requirements?"
  ],
  pricing: [
    "Our properties range from affordable homes to luxury estates. What's your budget range?",
    "I can help you understand the pricing in different neighborhoods. Which area interests you?",
    "Let me show you properties that offer the best value for your investment."
  ],
  adminContact: [
    "For detailed inquiries, I recommend speaking with our admin team. Would you like to switch to the admin chat?",
    "Our admin team can provide more specific information. Shall I connect you with them?",
    "This requires admin assistance. Let me help you switch to the admin chat tab."
  ]
};

// AI Response Generator
const generateAIResponse = (message, currentUser) => {
  const lowercaseMsg = message.toLowerCase();
  
  if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi')) {
    return currentUser 
      ? `Hello ${currentUser.username}! ${aiTrainingData.greetings[Math.floor(Math.random() * aiTrainingData.greetings.length)]}` 
      : aiTrainingData.greetings[Math.floor(Math.random() * aiTrainingData.greetings.length)];
  }
  
  if (lowercaseMsg.includes('property') || lowercaseMsg.includes('house') || lowercaseMsg.includes('apartment')) {
    return aiTrainingData.propertySearch[Math.floor(Math.random() * aiTrainingData.propertySearch.length)];
  }
  
  if (lowercaseMsg.includes('price') || lowercaseMsg.includes('cost') || lowercaseMsg.includes('budget')) {
    return aiTrainingData.pricing[Math.floor(Math.random() * aiTrainingData.pricing.length)];
  }
  
  if (lowercaseMsg.includes('admin') || lowercaseMsg.includes('manager') || lowercaseMsg.includes('support')) {
    return aiTrainingData.adminContact[Math.floor(Math.random() * aiTrainingData.adminContact.length)];
  }
  
  return "I'm here to help you with any real estate related questions. Feel free to ask about properties, pricing, or specific features you're looking for!";
};

export default function ChatBox({ onClose, minimized, onMinimize }) {
  const [messages, setMessages] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('ai');
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const messageRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize AI messages
    setMessages([
      {
        content: "👋 Hi there! How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      },
      {
        content: "I'm here to assist you with any questions about properties or our services.",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, adminMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, adminMessages]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!currentUser) {
      setError('Please sign in to send messages');
      setTimeout(() => navigate('/sign-in'), 2000);
      return;
    }

    const messageObj = {
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    if (activeTab === 'ai') {
      setMessages(prev => [...prev, messageObj]);
      setIsTyping(true);

      setTimeout(() => {
        const aiResponse = {
          content: generateAIResponse(newMessage, currentUser),
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000);
    } else {
      setAdminMessages(prev => [...prev, messageObj]);
      setSending(true);
      
      try {
        const res = await fetch('/api/message/send-to-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: newMessage.trim(),
            userEmail: currentUser.email,
            userName: currentUser.username,
          }),
        });

        const data = await res.json();
        
        if (data.success) {
          setSuccess('Message sent successfully!');
          const adminResponse = {
            content: "Thank you for your message. An admin will respond shortly.",
            sender: 'admin',
            timestamp: new Date()
          };
          setAdminMessages(prev => [...prev, adminResponse]);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError('Failed to send message');
      } finally {
        setSending(false);
      }
    }

    setNewMessage('');
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
          {messages.length + adminMessages.length}
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
              <h3 className="font-semibold text-white">
                {activeTab === 'ai' ? 'AI Assistant' : 'Admin Chat'}
              </h3>
              <RoleBadge role={activeTab === 'ai' ? 'ai' : 'admin'} />
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

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'ai'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            AI Assistant
          </button>
          <button
            className={`flex-1 py-2 px-4 ${
              activeTab === 'admin'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('admin')}
          >
            Admin Chat
          </button>
        </div>

        {/* Messages Container */}
        <div 
          ref={chatContainerRef}
          className="p-4 h-96 overflow-y-auto space-y-4 scroll-smooth"
        >
          <AnimatePresence>
            {(activeTab === 'ai' ? messages : adminMessages).map((msg, index) => (
              <motion.div
                key={index}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-75">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex space-x-2 p-3 bg-gray-100 rounded-lg w-16"
            >
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
          <div className="flex items-end gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={currentUser ? `Message ${activeTab === 'ai' ? 'AI Assistant' : 'Admin'}...` : "Please sign in to send messages"}
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              disabled={!currentUser || sending}
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              disabled={!currentUser || sending || !newMessage.trim()}
            >
              <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}