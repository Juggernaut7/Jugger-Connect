import api from './api';

export const postService = {
  // Get all posts (feed) or user's posts if userId is provided
  getPosts: async (page = 1, limit = 10, userId = null) => {
    let url = `/posts?page=${page}&limit=${limit}`;
    if (userId) {
      url += `&userId=${userId}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  // Create new post
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  // Get post by ID
  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  // Update post
  updatePost: async (postId, postData) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },

  // Delete post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Like/Unlike post
  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Add comment to post
  addComment: async (postId, comment) => {
    const response = await api.post(`/posts/${postId}/comment`, { content: comment });
    return response.data;
  },

  // Remove comment from post
  removeComment: async (postId, commentId) => {
    const response = await api.delete(`/posts/${postId}/comment/${commentId}`);
    return response.data;
  }
}; 