const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  banUser,
  verifyUser,
  getAdminStats
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { adminAuth } = require('../middlewares/adminAuthMiddleware');

// All admin routes are protected by both auth and admin middleware
router.use(protect);
router.use(adminAuth);

// Admin routes
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/verify', verifyUser);

module.exports = router; 