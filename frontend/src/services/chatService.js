import api from './api';

export const chatService = {
  // Get all conversations
  getConversations: async () => {
    const response = await api.get('/chat/conversations');
    return response.data;
  },

  // Create a new conversation
  createConversation: async (userId) => {
    const response = await api.post('/chat/conversations', { participantId: userId });
    return response.data;
  },

  // Get conversation with a specific user
  getConversation: async (conversationId) => {
    const response = await api.get(`/chat/conversation/${conversationId}`);
    return response.data;
  },

  // Send a message
  sendMessage: async (conversationId, content) => {
    const response = await api.post('/chat/messages', {
      conversationId,
      content
    });
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (senderId) => {
    const response = await api.put(`/chat/messages/read/${senderId}`);
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await api.get('/chat/unread-count');
    return response.data;
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/chat/messages/${messageId}`);
    return response.data;
  },

  // Search messages
  searchMessages: async (query) => {
    const response = await api.get(`/chat/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}; 