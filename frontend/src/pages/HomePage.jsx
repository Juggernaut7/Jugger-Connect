import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { postService } from '../services/postService';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, Zap, Clock, User } from 'lucide-react';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getPosts();
      setPosts(response.posts || []);
    } catch (error) {
      setError('Failed to load posts');
      toast.error('Failed to load posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      setPosting(true);
      const post = await postService.createPost({ content: newPost });
      setPosts([post, ...posts]);
      setNewPost('');
      toast.success('Post created successfully!');
    } catch (error) {
      setError('Failed to create post');
      toast.error('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await postService.likePost(postId);
      // Update the post in the list
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const isLiked = post.likes.some(like => like._id === user._id);
          if (isLiked) {
            return { ...post, likes: post.likes.filter(like => like._id !== user._id) };
          } else {
            return { ...post, likes: [...post.likes, user] };
          }
        }
        return post;
      }));
    } catch (error) {
      toast.error('Failed to like post');
      console.error('Error liking post:', error);
    }
  };

  const isPostLiked = (post) => {
    return post.likes.some(like => like._id === user._id);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now - postDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-slate-600 font-medium">Loading your feed...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8 mb-6 sm:mb-8"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Jugger-Connect
            </h1>
            <p className="text-slate-600 font-medium text-sm sm:text-base">Share your thoughts and connect with others!</p>
          </div>
        </div>
      </motion.div>

      {/* Create Post Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <form onSubmit={handleSubmitPost}>
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Link to={`/profile/${user?._id}`} className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </Link>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share your thoughts with the community..."
                className="w-full p-3 sm:p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 resize-none text-sm sm:text-base"
                rows="3"
                disabled={posting}
              />
              {error && (
                <div className="mt-2 text-red-600 text-sm">{error}</div>
              )}
              <div className="mt-4 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={posting || !newPost.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm sm:text-base"
                >
                  {posting ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                      <span>Posting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Post</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Posts Feed */}
      <div className="space-y-4 sm:space-y-6">
        <AnimatePresence>
          {posts.map((post, index) => (
            <PostCard 
              key={post._id} 
              post={post} 
              index={index}
              onLike={handleLikePost}
              isLiked={isPostLiked(post)}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </AnimatePresence>

        {posts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No posts yet</h3>
            <p className="text-slate-600 text-sm sm:text-base">Be the first to share something amazing with the community!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// PostCard Component with Comments
const PostCard = ({ post, index, onLike, isLiked, formatTimeAgo }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await postService.getPostById(post._id);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleCommentToggle = () => {
    if (!showComments) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setPostingComment(true);
      const response = await postService.addComment(post._id, newComment);
      // Add the new comment to the beginning of the comments list
      setComments(prev => [response, ...prev]);
      setNewComment('');
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
        <Link to={`/profile/${post.author?._id}`} className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
            {post.author?.name?.charAt(0) || 'U'}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Link 
              to={`/profile/${post.author?._id}`}
              className="font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base truncate"
            >
              {post.author?.name || 'Unknown User'}
            </Link>
            <div className="flex items-center space-x-1 text-slate-500 text-xs sm:text-sm flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm">@{post.author?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
        </div>
      </div>
      
      <p className="text-slate-800 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">{post.content}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center space-x-4 sm:space-x-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(post._id)}
            className={`flex items-center space-x-1 sm:space-x-2 transition-all duration-200 ${
              isLiked 
                ? 'text-red-500' 
                : 'text-slate-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium text-sm sm:text-base">{post.likes?.length || 0}</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCommentToggle}
            className="flex items-center space-x-1 sm:space-x-2 text-slate-500 hover:text-blue-500 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">{comments.length || post.comments?.length || 0}</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-1 sm:space-x-2 text-slate-500 hover:text-green-500 transition-all duration-200"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base hidden sm:inline">Share</span>
          </motion.button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200"
          >
            <div className="space-y-3 sm:space-y-4">
              {/* Comments List */}
              {loadingComments ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-slate-600 text-sm sm:text-base">Loading comments...</span>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-slate-50 rounded-xl"
                    >
                      <Link to={`/profile/${comment.user?._id}`} className="flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg">
                          {comment.user?.name?.charAt(0) || 'U'}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Link 
                            to={`/profile/${comment.user?._id}`}
                            className="font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-200 text-xs sm:text-sm truncate"
                          >
                            {comment.user?.name || 'Unknown User'}
                          </Link>
                          <span className="text-slate-500 text-xs">{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                        <p className="text-slate-700 text-xs sm:text-sm">{comment.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-600 text-xs sm:text-sm">No comments yet. Be the first to comment!</p>
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-lg flex-shrink-0">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-2 sm:px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm"
                    disabled={postingComment}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={postingComment || !newComment.trim()}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
                >
                  {postingComment ? 'Posting...' : 'Post'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomePage; 