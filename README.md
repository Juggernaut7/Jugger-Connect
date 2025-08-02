# Jugger-Connect

A modern social media platform built with MERN stack featuring real-time chat, user authentication, dynamic profiles, admin dashboard, and responsive design.

## 🌐 Live Demo

- **Frontend**: [https://jugger-connect.vercel.app/](https://jugger-connect.vercel.app/)
- **Backend API**: [https://jugger-connect-2.onrender.com/](https://jugger-connect-2.onrender.com/)

## 🚀 Features

- **User Authentication**: Secure JWT-based login/registration
- **Real-time Chat**: Socket.IO powered messaging system
- **Dynamic Profiles**: User profiles with follow/unfollow functionality
- **Post Management**: Create, like, and comment on posts
- **Admin Dashboard**: User management and platform statistics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Search Functionality**: Find and connect with other users
- **Real-time Updates**: Live notifications and status updates

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **Deployment**: Vercel (Frontend), Render (Backend)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Juggernaut7/Jugger-Connect.git
   cd Jugger-Connect
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Run the application**
   ```bash
   # Run both frontend and backend
   npm run dev
   
   # Or run separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

## 🔧 Available Scripts

- `npm run dev` - Run both frontend and backend in development
- `npm run server` - Run backend server only
- `npm run client` - Run frontend development server
- `npm run install-all` - Install dependencies for all packages
- `npm run build` - Build frontend for production
- `npm start` - Start production backend server

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Posts**: Share your thoughts with the community
3. **Connect**: Search and follow other users
4. **Chat**: Start real-time conversations
5. **Admin Panel**: Manage users (admin only)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/unfollow` - Unfollow user
- `GET /api/users/search` - Search users

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Chat
- `GET /api/chat/conversations` - Get conversations
- `POST /api/chat/conversations` - Create conversation
- `GET /api/chat/conversation/:id` - Get conversation messages
- `POST /api/chat/messages` - Send message

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `PUT /api/admin/users/:id/ban` - Ban user (admin)
- `PUT /api/admin/users/:id/verify` - Verify user (admin)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jugger-Connect Team**

## 🙏 Acknowledgments

- React and Vite for the frontend framework
- Node.js and Express for the backend
- MongoDB for the database
- Socket.IO for real-time features
- Tailwind CSS for styling
- Framer Motion for animations 