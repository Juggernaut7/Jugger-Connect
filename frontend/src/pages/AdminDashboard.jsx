import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { adminService } from '../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, FileText, UserX, UserCheck, Trash2, Search, BarChart3, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers(currentPage, 20, searchQuery);
      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(userId);
        toast.success(`User ${userName} deleted successfully`);
        fetchUsers();
        fetchStats();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleBanUser = async (userId, userName, isBanned) => {
    try {
      await adminService.banUser(userId);
      toast.success(`User ${userName} ${isBanned ? 'unbanned' : 'banned'} successfully`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error('Failed to ban/unban user');
    }
  };

  const handleVerifyUser = async (userId, userName, isVerified) => {
    try {
      await adminService.verifyUser(userId);
      toast.success(`User ${userName} ${isVerified ? 'unverified' : 'verified'} successfully`);
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify/unverify user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-slate-600 font-medium">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8 mb-6 sm:mb-8"
      >
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 font-medium text-sm sm:text-base">Manage users and monitor platform activity</p>
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
          <span>Platform Statistics</span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Users */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{stats.totalUsers || 0}</div>
            <div className="text-slate-600 text-sm sm:text-base">Total Users</div>
          </div>

          {/* Active Users */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{stats.activeUsers || 0}</div>
            <div className="text-slate-600 text-sm sm:text-base">Active Users</div>
          </div>

          {/* Total Posts */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{stats.totalPosts || 0}</div>
            <div className="text-slate-600 text-sm sm:text-base">Total Posts</div>
          </div>

          {/* Banned Users */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">{stats.bannedUsers || 0}</div>
            <div className="text-slate-600 text-sm sm:text-base">Banned Users</div>
          </div>
        </div>
      </motion.div>

      {/* User Management */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center space-x-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span>User Management</span>
          </h2>
          
          {/* Search */}
          <div className="relative mt-4 sm:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
              <p className="text-slate-600 font-medium text-sm sm:text-base">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {users.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg text-sm sm:text-base">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{user.name}</h3>
                        {user.isAdmin && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Admin</span>
                        )}
                        {user.isVerified && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Verified</span>
                        )}
                        {user.isBanned && (
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">Banned</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm truncate">{user.email}</p>
                      <p className="text-slate-500 text-xs truncate">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex flex-wrap gap-2">
                    {!user.isVerified && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerifyUser(user._id)}
                        className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 text-xs sm:text-sm flex items-center space-x-1"
                      >
                        <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Verify</span>
                      </motion.button>
                    )}
                    
                    {!user.isBanned ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBanUser(user._id)}
                        className="bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-all duration-200 text-xs sm:text-sm flex items-center space-x-1"
                      >
                        <UserX className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Ban</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUnbanUser(user._id)}
                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 text-xs sm:text-sm flex items-center space-x-1"
                      >
                        <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Unban</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-all duration-200 text-xs sm:text-sm flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Delete</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">No users found</h3>
                <p className="text-slate-600 text-sm sm:text-base">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 