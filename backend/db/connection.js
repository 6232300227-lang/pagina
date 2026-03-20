const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pagina_dev';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000
  });
  console.log(`MongoDB connected to database "${mongoose.connection.name}"`);
}

module.exports = { connectDB };
