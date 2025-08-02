const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const makeUserAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found');
      return;
    }

    user.isAdmin = true;
    await user.save();
    
    console.log(`User ${user.name} (${user.email}) is now an admin!`);
  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node makeAdmin.js <email>');
  console.log('Example: node makeAdmin.js user@example.com');
  process.exit(1);
}

makeUserAdmin(email); 