const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// User routes
router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/profile', updateProfile); // This should be PUT, but we'll use GET for now
router.put('/profile', updateProfile);
router.get('/:id', getUserById);

// Follow/Unfollow routes
router.post('/:id/follow', followUser);
router.delete('/:id/follow', unfollowUser);

// Followers/Following routes
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

module.exports = router; 