const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
  removeComment,
} = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Post routes
router.route('/')
  .post(createPost)
  .get(getPosts);

router.route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

// Like/Unlike post
router.post('/:id/like', likePost);

// Comment routes
router.post('/:id/comment', addComment);
router.delete('/:id/comment/:commentId', removeComment);

module.exports = router; 