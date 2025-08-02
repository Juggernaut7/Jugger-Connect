import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { userService } from '../services/userService';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, UserPlus, UserMinus, Users, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(new Set());
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const response = await userService.searchUsers(searchQuery);
      setUsers(response.users || []);
      
      // Update following status
      const followingSet = new Set();
      response.users.forEach(userResult => {
        if (userResult.isFollowing) {
          followingSet.add(userResult._id);
        }
      });
      setFollowing(followingSet);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userService.followUser(userId);
      setFollowing(prev => new Set([...prev, userId]));
      // Update the users list to reflect the new following status
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isFollowing: true } : user
      ));
      toast.success('User followed successfully!');
    } catch (error) {
      console.error('Follow error:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userService.unfollowUser(userId);
      setFollowing(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
      // Update the users list to reflect the new following status
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isFollowing: false } : user
      ));
      toast.success('User unfollowed successfully!');
    } catch (error) {
      console.error('Unfollow error:', error);
      toast.error('Failed to unfollow user');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6">
      {/* Search Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8 mb-6 sm:mb-8"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Discover People
            </h1>
            <p className="text-slate-600 font-medium text-sm sm:text-base">Find and connect with amazing people!</p>
          </div>
        </div>
      </motion.div>

      {/* Search Input */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-6 sm:mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for users by name or email..."
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-sm sm:text-base"
          />
        </div>
      </motion.div>

      {/* Search Results */}
      <div className="space-y-4 sm:space-y-6">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 sm:p-12"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
              </div>
              <p className="text-slate-600 font-medium text-sm sm:text-base">Searching for users...</p>
            </div>
          </motion.div>
        ) : users.length > 0 ? (
          <AnimatePresence>
            {users.map((userResult, index) => (
              <motion.div
                key={userResult._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Link to={`/profile/${userResult._id}`} className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-lg sm:text-xl">
                      {userResult.name?.charAt(0) || 'U'}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/profile/${userResult._id}`}
                      className="block"
                    >
                      <h3 className="font-bold text-slate-800 text-lg sm:text-xl hover:text-blue-600 transition-colors duration-200 truncate">
                        {userResult.name}
                      </h3>
                      <p className="text-slate-600 text-sm sm:text-base truncate">@{userResult.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
                      <p className="text-slate-500 text-xs sm:text-sm truncate">{userResult.email}</p>
                    </Link>
                  </div>
                  {userResult._id !== user?._id && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => userResult.isFollowing ? handleUnfollow(userResult._id) : handleFollow(userResult._id)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base ${
                        userResult.isFollowing
                          ? 'bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-600'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      }`}
                    >
                      {userResult.isFollowing ? (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <UserMinus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Unfollow</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Follow</span>
                        </div>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : searchQuery.trim().length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 sm:p-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No users found</h3>
              <p className="text-slate-600 text-sm sm:text-base">Try searching with different keywords</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 sm:p-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Search className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">Start searching</h3>
              <p className="text-slate-600 text-sm sm:text-base">Enter a name or email to find users</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 