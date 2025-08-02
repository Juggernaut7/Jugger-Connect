# Jugger-Connect Setup Guide

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Environment Setup

The `.env` file in the backend folder is already configured with your MongoDB URI and JWT secret.

### 3. Start the Application

**Option 1: Use the batch script (Windows)**
```bash
start-dev.bat
```

**Option 2: Manual start**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Features Ready

✅ **Authentication**
- Register/Login with JWT
- Protected routes
- User session management

✅ **Social Media Features**
- Create and view posts
- Like posts
- User profiles
- Real-time updates

✅ **Real-time Chat**
- Socket.IO integration
- Instant messaging
- Typing indicators
- Online/offline status

✅ **Modern UI**
- Tailwind CSS styling
- Framer Motion animations
- Responsive design
- Loading states

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like/unlike post

### Chat
- `GET /api/chat/conversations` - Get conversations
- `POST /api/chat/messages` - Send message
- `GET /api/chat/conversation/:userId` - Get conversation

## Database

Connected to MongoDB Atlas:
- Database: `connect`
- Collections: `users`, `posts`, `messages`

## Next Steps

1. **Test the application** by registering a new user
2. **Create some posts** to test the social feed
3. **Try the chat** by creating multiple users
4. **Customize the UI** as needed for your contest

## Troubleshooting

- **Backend won't start**: Check if MongoDB connection is working
- **Frontend won't start**: Make sure all dependencies are installed
- **Chat not working**: Ensure Socket.IO is properly connected
- **Authentication issues**: Check JWT token in localStorage

## Contest Ready Features

- ✅ Full-stack MERN application
- ✅ Real-time chat with Socket.IO
- ✅ Modern UI with animations
- ✅ User authentication
- ✅ Social media features
- ✅ Responsive design
- ✅ Production-ready code structure

Your Jugger-Connect application is now ready for the contest! 🚀 