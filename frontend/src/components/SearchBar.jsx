import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, X, UserPlus, UserMinus } from 'lucide-react';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext.jsx';
import { toast } from 'react-toastify';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [following, setFollowing] = useState(new Set());
  const searchTimeoutRef = useRef(null);
  const { user } = useAuth();

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const response = await userService.searchUsers(query);
        setResults(response.users || []);
        setShowResults(true);
        
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
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFollow = async (userId) => {
    try {
      await userService.followUser(userId);
      setFollowing(prev => new Set([...prev, userId]));
      // Update the results to reflect the new following status
      setResults(prev => prev.map(user => 
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
      // Update the results to reflect the new following status
      setResults(prev => prev.map(user => 
        user._id === userId ? { ...user, isFollowing: false } : user
      ));
      toast.success('User unfollowed successfully!');
    } catch (error) {
      console.error('Unfollow error:', error);
      toast.error('Failed to unfollow user');
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="search-container relative">
      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full pl-7 sm:pl-10 pr-8 sm:pr-10 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-xs sm:text-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400 hover:text-slate-600 transition-colors duration-200"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/50 z-50 max-h-64 sm:max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-3 sm:p-4 text-center">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-2 text-xs sm:text-sm">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((userResult) => (
                  <motion.div
                    key={userResult._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                  >
                    <Link to={`/profile/${userResult._id}`} className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm">
                        {userResult.name?.charAt(0) || 'U'}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/profile/${userResult._id}`}
                        className="font-semibold text-slate-800 truncate hover:text-blue-600 transition-colors duration-200 block text-xs sm:text-sm"
                      >
                        {userResult.name}
                      </Link>
                      <p className="text-xs text-slate-500 truncate">@{userResult.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
                    </div>
                    {userResult._id !== user?._id && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => userResult.isFollowing ? handleUnfollow(userResult._id) : handleFollow(userResult._id)}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                          userResult.isFollowing
                            ? 'bg-slate-200 text-slate-700 hover:bg-red-100 hover:text-red-600'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {userResult.isFollowing ? (
                          <>
                            <UserMinus className="w-2 h-2 sm:w-3 sm:h-3 inline mr-1" />
                            <span className="hidden sm:inline">Unfollow</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-2 h-2 sm:w-3 sm:h-3 inline mr-1" />
                            <span className="hidden sm:inline">Follow</span>
                          </>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : query.trim().length > 0 ? (
              <div className="p-3 sm:p-4 text-center">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-xs sm:text-sm">No users found</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar; 