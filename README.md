# Jugger-Connect

A modern social media platform with real-time chat functionality, built with React, Node.js, Express, MongoDB, and Socket.IO.

## Features

### Frontend (React)
- **Authentication**: Login/Register with JWT
- **Social Feed**: Create, like, comment, and share posts
- **User Profiles**: View and edit user profiles
- **Real-time Chat**: Instant messaging with Socket.IO
- **Responsive Design**: Modern UI with Tailwind CSS
- **User Search**: Find and connect with other users

### Backend (Node.js/Express)
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based authentication
- **Real-time Communication**: Socket.IO for live chat
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Support for images and files
- **User Management**: Follow/unfollow, profile updates

## Project Structure

```
/Jugger-Connect
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── posts/       # Post-related components
│   │   │   └── chat/        # Chat components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── backend/                  # Node.js backend
    ├── config/
    │   └── db.js            # Database configuration
    ├── controllers/         # Route controllers
    ├── middlewares/         # Custom middlewares
    ├── models/              # Mongoose models
    ├── routes/              # API routes
    ├── socket/              # Socket.IO handlers
    ├── .env                 # Environment variables
    ├── package.json
    └── server.js            # Main server file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Jugger-Connect
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jugger-connect
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

5. **Start the development servers**

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### Chat
- `GET /api/chat/conversations` - Get all conversations
- `GET /api/chat/conversation/:userId` - Get conversation with user
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/messages/read/:senderId` - Mark messages as read
- `GET /api/chat/unread-count` - Get unread count

## Socket.IO Events

### Client to Server
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator
- `mark_read` - Mark messages as read
- `update_status` - Update user status

### Server to Client
- `receive_message` - Receive new message
- `message_sent` - Confirm message sent
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `messages_read` - Messages were read
- `user_online` - User came online
- `user_offline` - User went offline

## Technologies Used

### Frontend
- React 18
- Vite
- Tailwind CSS
- Socket.IO Client
- React Router (planned)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcryptjs
- cors

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Future Enhancements

- [ ] Image upload functionality
- [ ] Push notifications
- [ ] Group chat support
- [ ] Video calling
- [ ] Story features
- [ ] Advanced search filters
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] Admin dashboard 