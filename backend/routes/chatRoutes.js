const express = require('express');
const router = express.Router();
const {
  createConversation,
  sendMessage,
  getConversation,
  getConversations,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage,
  searchMessages,
} = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Conversation routes
router.route('/conversations')
  .get(getConversations)
  .post(createConversation);

// Message routes
router.route('/messages')
  .post(sendMessage);

router.delete('/messages/:messageId', deleteMessage);

// Conversation routes - Updated to use conversationId
router.get('/conversation/:conversationId', getConversation);

// Message management routes
router.put('/messages/read/:senderId', markMessagesAsRead);
router.get('/unread-count', getUnreadCount);

// Search routes
router.get('/search', searchMessages);

module.exports = router; 