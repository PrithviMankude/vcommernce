require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connection to MongoDB successful');
  } catch (error) {
    console.error('Mongo DB connection failed');
    process.exit(1);
  }
};

module.exports = connectDb;
