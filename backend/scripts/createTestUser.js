require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const testUsers = [
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  },
  {
    name: 'Fagun',
    email: 'fagun@gmail.com',
    password: 'password123'
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const createTestUsers = async () => {
  try {
    await connectDB();
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log('User already exists:', existingUser.email);
        continue;
      }

      // Create new user
      const user = await User.create(userData);
      console.log('User created successfully:', {
        id: user._id,
        name: user.name,
        email: user.email
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createTestUsers(); 