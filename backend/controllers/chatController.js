const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Create a new conversation
// @route   POST /api/chat/conversations
// @access  Private
const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: 'Participant ID is required' });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Check if conversation already exists
    const existingConversation = await Message.findOne({
      $or: [
        { sender: req.user._id, receiver: participantId },
        { sender: participantId, receiver: req.user._id }
      ]
    });

    if (existingConversation) {
      // Return existing conversation info
      const populatedParticipant = await User.findById(participantId).select('name avatar');
      return res.json({
        _id: existingConversation._id,
        participants: [req.user, populatedParticipant]
      });
    }

    // Create a simple conversation ID (no database record needed initially)
    const conversationId = `${req.user._id}-${participantId}`;
    const populatedParticipant = await User.findById(participantId).select('name avatar');

    res.status(201).json({
      _id: conversationId,
      participants: [req.user, populatedParticipant]
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, messageType = 'text', fileUrl = '' } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: 'Conversation ID and content are required' });
    }

    // Parse conversation ID to get the receiver
    const userIds = conversationId.split('-');
    let receiverId;

    if (userIds.length === 2) {
      // New format: userId1-userId2
      receiverId = userIds[0] === req.user._id ? userIds[1] : userIds[0];
    } else {
      // Old format: message ID
      const conversation = await Message.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      receiverId = conversation.sender.equals(req.user._id) 
        ? conversation.receiver 
        : conversation.sender;
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType,
      fileUrl
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/chat/conversation/:conversationId
// @access  Private
const getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Parse conversation ID to get the other user
    const userIds = conversationId.split('-');
    let otherUserId;

    if (userIds.length === 2) {
      // New format: userId1-userId2
      otherUserId = userIds[0] === req.user._id ? userIds[1] : userIds[0];
    } else {
      // Old format: message ID
      const conversationMessage = await Message.findById(conversationId);
      if (!conversationMessage) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      otherUserId = conversationMessage.sender.equals(req.user._id) 
        ? conversationMessage.receiver 
        : conversationMessage.sender;
    }

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all messages between these two users
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ],
      isDeleted: false
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

    // Mark messages as read
    await Message.markAsRead(otherUserId, req.user._id);

    res.json({
      messages: messages.reverse(), // Show oldest first
      currentPage: page,
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ],
      isDeleted: false
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: -1 });

    // Group messages by conversation (other user)
    const conversationMap = new Map();

    messages.forEach(message => {
      const otherUserId = message.sender._id.equals(req.user._id) 
        ? message.receiver._id 
        : message.sender._id;
      
      const otherUser = message.sender._id.equals(req.user._id) 
        ? message.receiver 
        : message.sender;

      if (!conversationMap.has(otherUserId.toString())) {
        conversationMap.set(otherUserId.toString(), {
          _id: otherUserId,
          participants: [req.user, otherUser],
          lastMessage: message,
          unreadCount: 0
        });
      } else {
        const conversation = conversationMap.get(otherUserId.toString());
        // Update unread count if message is unread and user is receiver
        if (!message.isRead && message.receiver._id.equals(req.user._id)) {
          conversation.unreadCount += 1;
        }
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/chat/messages/read/:senderId
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;

    await Message.markAsRead(senderId, req.user._id);

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get unread message count
// @route   GET /api/chat/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user._id);

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/chat/messages/:messageId
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user owns the message
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this message' });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search messages
// @route   GET /api/chat/search
// @access  Private
const searchMessages = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ],
      content: { $regex: query, $options: 'i' },
      isDeleted: false
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);

    const total = await Message.countDocuments({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ],
      content: { $regex: query, $options: 'i' },
      isDeleted: false
    });

    res.json({
      messages,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total
    });
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getConversation,
  getConversations,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage,
  searchMessages,
}; 