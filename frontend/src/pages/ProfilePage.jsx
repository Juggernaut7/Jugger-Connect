import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { adminService } from '../services/adminService';
import { motion } from 'framer-motion';
import { User, Mail, Edit3, Save, X, Camera, BarChart3, FileText, Users, UserPlus, Zap, Clock, Trash2, UserX, UserCheck, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const targetUserId = userId || user?._id;
    setIsOwnProfile(targetUserId === user?._id);
    
    if (targetUserId) {
      fetchUserProfile(targetUserId);
      fetchUserPosts(targetUserId);
    }
  }, [userId, user]);

  const fetchUserProfile = async (targetUserId) => {
    try {
      setLoading(true);
      const userData = await userService.getUserById(targetUserId);
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        avatar: userData.avatar || null
      });
      setFollowerCount(userData.followers?.length || 0);
      setFollowingCount(userData.following?.length || 0);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async (targetUserId) => {
    try {
      const response = await postService.getPosts(1, 20, targetUserId);
      setUserPosts(response.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const updatedProfile = await userService.updateProfile(profile);
      updateUser(updatedProfile);
      
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      setError('Failed to save profile');
      toast.error('Failed to save profile');
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteUser = async () => {
    if (window.confirm(`Are you sure you want to delete ${profile.name}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(userId);
        toast.success(`User ${profile.name} deleted successfully`);
        window.location.href = '/';
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleBanUser = async () => {
    try {
      await adminService.banUser(userId);
      toast.success(`User ${profile.name} banned successfully`);
      fetchUserProfile(userId);
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban user');
    }
  };

  const handleVerifyUser = async () => {
    try {
      await adminService.verifyUser(userId);
      toast.success(`User ${profile.name} verified successfully`);
      fetchUserProfile(userId);
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
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
            <p className="text-slate-600 font-medium">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8 mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl sm:text-3xl lg:text-4xl shadow-lg">
              {profile.name?.charAt(0) || 'U'}
            </div>
            {isOwnProfile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </motion.button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  {profile.name || 'Unknown User'}
                </h1>
                <div className="flex items-center space-x-2 text-slate-600 text-sm sm:text-base mb-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{profile.email || 'No email'}</span>
                </div>
                <p className="text-slate-700 text-sm sm:text-base">
                  {profile.bio || 'No bio yet. Tell us about yourself!'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {isOwnProfile ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </motion.button>
                ) : (
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      Follow
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-slate-200 text-slate-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      Message
                    </motion.button>
                  </div>
                )}

                {/* Admin Actions */}
                {user?.isAdmin && !isOwnProfile && (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVerifyUser()}
                      className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Verify
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleBanUser()}
                      className="bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Ban
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDeleteUser()}
                      className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Delete
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>Statistics</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Posts */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{userPosts.length}</div>
            <div className="text-slate-600 text-sm sm:text-base">Posts</div>
          </div>

          {/* Followers */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{followerCount}</div>
            <div className="text-slate-600 text-sm sm:text-base">Followers</div>
          </div>

          {/* Following */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{followingCount}</div>
            <div className="text-slate-600 text-sm sm:text-base">Following</div>
          </div>

          {/* Joined Date */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-lg sm:text-xl font-bold text-slate-800 mb-1">
              {profile.createdAt ? new Date(profile.createdAt).getFullYear() : 'N/A'}
            </div>
            <div className="text-slate-600 text-xs sm:text-sm">Joined</div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6">Edit Profile</h3>
            <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter your name"
                />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
                    placeholder="Enter your email"
                />
                </div>
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 resize-none text-sm sm:text-base"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-slate-200 text-slate-700 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Posts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center space-x-2">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <span>My Posts</span>
        </h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
              <p className="text-slate-600 font-medium text-sm sm:text-base">Loading posts...</p>
            </div>
          </div>
        ) : userPosts.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {userPosts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {profile.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-slate-800 text-sm sm:text-base">{profile.name}</span>
                      <span className="text-slate-500 text-xs sm:text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{post.content}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 sm:space-x-6 text-slate-500 text-xs sm:text-sm">
                  <span className="flex items-center space-x-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{post.likes?.length || 0} likes</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{post.comments?.length || 0} comments</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No posts yet</h3>
            <p className="text-slate-600 text-sm sm:text-base">Start sharing your thoughts with the community!</p>
            </div>
          )}
      </motion.div>
    </div>
  );
};

export default ProfilePage; 