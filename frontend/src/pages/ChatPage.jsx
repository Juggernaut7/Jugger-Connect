import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { chatService } from '../services/chatService';
import { userService } from '../services/userService';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Search, Phone, Video, MoreVertical, Zap, User, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      console.log('Fetching conversations...');
      const response = await chatService.getConversations();
      console.log('Conversations response:', response);
      setConversations(response.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      console.log('Fetching messages for conversation:', conversationId);
      const response = await chatService.getConversation(conversationId);
      console.log('Messages response:', response);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleUserSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      console.log('Searching for users:', searchQuery);
      const response = await userService.searchUsers(searchQuery);
      console.log('Search results:', response);
      setSearchResults(response.users || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  const startConversation = async (userId) => {
    try {
      console.log('Starting conversation with user:', userId);
      
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p._id === userId)
      );

      if (existingConversation) {
        console.log('Existing conversation found:', existingConversation);
        setSelectedConversation(existingConversation);
        setShowUserSearch(false);
        setSearchQuery('');
        setSearchResults([]);
        return;
      }

      // Create new conversation
      console.log('Creating new conversation...');
      const response = await chatService.createConversation(userId);
      console.log('New conversation response:', response);
      
      const newConversation = {
        _id: response._id,
        participants: [user, response.participants.find(p => p._id === userId)],
        lastMessage: null,
        unreadCount: 0
      };

      console.log('New conversation object:', newConversation);
      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setShowUserSearch(false);
      setSearchQuery('');
      setSearchResults([]);
      toast.success('Conversation started!');
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      console.log('Sending message:', newMessage, 'to conversation:', selectedConversation._id);
      const response = await chatService.sendMessage(selectedConversation._id, newMessage);
      console.log('Send message response:', response);
      setMessages(prev => [...prev, response]);
      setNewMessage('');
      
      // Update the conversation's last message
      setConversations(prev => prev.map(conv => 
        conv._id === selectedConversation._id 
          ? { ...conv, lastMessage: response }
          : conv
      ));
      
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const messageDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-slate-600 font-medium">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-[500px] sm:h-[600px] lg:h-[600px]">
          {/* Left Sidebar - Conversations */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
            {/* Header */}
            <div className="p-3 sm:p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span>Messages</span>
                </h2>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserSearch(!showUserSearch)}
                    className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.button>
                </div>
        </div>

              {/* New Conversation Search */}
          <AnimatePresence>
                {showUserSearch && (
              <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyUp={handleUserSearch}
                        placeholder="Search users to chat with..."
                        className="w-full pl-8 sm:pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm"
                      />
                    </div>

                    {/* Search Results */}
                    <div className="max-h-24 sm:max-h-32 overflow-y-auto space-y-2">
                      {searchResults.map((userResult) => (
                        <motion.div
                          key={userResult._id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors duration-200"
                          onClick={() => startConversation(userResult._id)}
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                            {userResult.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-xs sm:text-sm truncate">{userResult.name}</p>
                            <p className="text-slate-500 text-xs truncate">@{userResult.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length > 0 ? (
                <div className="space-y-1">
                  {conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation);
                    return (
                      <motion.div
                        key={conversation._id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                          selectedConversation?._id === conversation._id
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-r-2 border-blue-600'
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm sm:text-base">
                            {otherUser?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate text-sm sm:text-base">{otherUser?.name || 'Unknown User'}</p>
                            <p className="text-slate-500 text-xs sm:text-sm truncate">
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                  </div>
                          {conversation.unreadCount > 0 && (
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conversation.unreadCount}
                    </div>
                  )}
                </div>
              </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2">No conversations yet</h3>
                  <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4">Start connecting with others to begin messaging!</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUserSearch(true)}
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-xs sm:text-sm"
                  >
                    Start a Conversation
                  </motion.button>
            </div>
          )}
        </div>
      </div>

          {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col">
            {selectedConversation ? (
          <>
            {/* Chat Header */}
                <div className="p-3 sm:p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm sm:text-base">
                        {getOtherParticipant(selectedConversation)?.name?.charAt(0) || 'U'}
                </div>
                <div>
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
                          {getOtherParticipant(selectedConversation)?.name || 'Unknown User'}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Online</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 sm:p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 sm:p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 sm:p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>
                </div>
              </div>
            </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                  <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                          message.sender === user._id
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          <p className="text-xs sm:text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                            message.sender === user._id ? 'text-blue-100' : 'text-slate-500'
                      }`}>
                            {formatTimeAgo(message.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                      </div>
                      <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-2">No messages yet</h3>
                      <p className="text-slate-600 text-xs sm:text-sm">Send a message to start the conversation!</p>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
                <div className="p-3 sm:p-4 border-t border-slate-200">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-3">
                <input
                  type="text"
                  value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm"
                  disabled={sending}
                />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                      className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {sending ? (
                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  ) : (
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                    </motion.button>
              </form>
            </div>
          </>
        ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Select a conversation</h3>
                <p className="text-slate-600 text-sm sm:text-base">Choose a chat to start messaging</p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 