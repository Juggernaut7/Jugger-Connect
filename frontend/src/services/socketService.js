import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io('https://jugger-connect-2.onrender.com', {
      auth: {
        token: token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Send a message
  sendMessage(receiverId, content, messageType = 'text', fileUrl = '') {
    if (!this.socket || !this.isConnected) {
      throw new Error('Socket not connected');
    }

    this.socket.emit('send_message', {
      receiverId,
      content,
      messageType,
      fileUrl
    });
  }

  // Start typing indicator
  startTyping(receiverId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('typing_start', { receiverId });
  }

  // Stop typing indicator
  stopTyping(receiverId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('typing_stop', { receiverId });
  }

  // Mark messages as read
  markAsRead(senderId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('mark_read', { senderId });
  }

  // Update user status
  updateStatus(status) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('update_status', { status });
  }

  // Listen for incoming messages
  onReceiveMessage(callback) {
    if (!this.socket) return;
    
    this.socket.on('receive_message', callback);
  }

  // Listen for message sent confirmation
  onMessageSent(callback) {
    if (!this.socket) return;
    
    this.socket.on('message_sent', callback);
  }

  // Listen for typing indicators
  onTypingStart(callback) {
    if (!this.socket) return;
    
    this.socket.on('typing_start', callback);
  }

  onTypingStop(callback) {
    if (!this.socket) return;
    
    this.socket.on('typing_stop', callback);
  }

  // Listen for user status updates
  onUserOnline(callback) {
    if (!this.socket) return;
    
    this.socket.on('user_online', callback);
  }

  onUserOffline(callback) {
    if (!this.socket) return;
    
    this.socket.on('user_offline', callback);
  }

  // Listen for messages read confirmation
  onMessagesRead(callback) {
    if (!this.socket) return;
    
    this.socket.on('messages_read', callback);
  }

  // Remove all listeners
  removeAllListeners() {
    if (!this.socket) return;
    
    this.socket.removeAllListeners();
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService; 