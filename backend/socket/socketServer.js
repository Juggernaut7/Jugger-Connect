const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (io) => {
  // Store connected users
  const connectedUsers = new Map();

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.userId})`);

    // Add user to connected users
    connectedUsers.set(socket.userId.toString(), {
      socketId: socket.id,
      user: socket.user
    });

    // Update user's online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date()
    });

    // Emit user online status to all connected users
    io.emit('user_online', {
      userId: socket.userId,
      isOnline: true,
      lastSeen: new Date()
    });

    // Join user to their personal room
    socket.join(socket.userId.toString());

    // Handle private message
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, messageType = 'text', fileUrl = '' } = data;

        // Create message in database
        const message = await Message.create({
          sender: socket.userId,
          receiver: receiverId,
          content,
          messageType,
          fileUrl
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name avatar')
          .populate('receiver', 'name avatar');

        // Send to receiver if online
        const receiverSocketId = connectedUsers.get(receiverId)?.socketId;
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', populatedMessage);
        }

        // Send back to sender
        socket.emit('message_sent', populatedMessage);

        // Emit typing stop
        socket.to(receiverId).emit('typing_stop', { userId: socket.userId });

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing_start', (data) => {
      const { receiverId } = data;
      socket.to(receiverId).emit('typing_start', { userId: socket.userId });
    });

    socket.on('typing_stop', (data) => {
      const { receiverId } = data;
      socket.to(receiverId).emit('typing_stop', { userId: socket.userId });
    });

    // Handle message read
    socket.on('mark_read', async (data) => {
      try {
        const { senderId } = data;
        
        await Message.markAsRead(senderId, socket.userId);
        
        // Notify sender that messages were read
        const senderSocketId = connectedUsers.get(senderId)?.socketId;
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages_read', { 
            readerId: socket.userId 
          });
        }
      } catch (error) {
        console.error('Mark read error:', error);
      }
    });

    // Handle user status
    socket.on('update_status', async (data) => {
      try {
        const { status } = data;
        
        await User.findByIdAndUpdate(socket.userId, {
          isOnline: status === 'online',
          lastSeen: new Date()
        });

        io.emit('user_status_update', {
          userId: socket.userId,
          isOnline: status === 'online',
          lastSeen: new Date()
        });
      } catch (error) {
        console.error('Update status error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.userId})`);

      // Remove user from connected users
      connectedUsers.delete(socket.userId.toString());

      // Update user's online status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date()
      });

      // Emit user offline status to all connected users
      io.emit('user_offline', {
        userId: socket.userId,
        isOnline: false,
        lastSeen: new Date()
      });
    });

    // Handle error
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Return connected users for external use
  return {
    getConnectedUsers: () => connectedUsers,
    emitToUser: (userId, event, data) => {
      const userSocket = connectedUsers.get(userId)?.socketId;
      if (userSocket) {
        io.to(userSocket).emit(event, data);
      }
    }
  };
}; 