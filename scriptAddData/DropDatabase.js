// db.js
const mongoose = require('mongoose');
const colors = require('colors'); // Sử dụng colors nếu muốn in ra console có màu

// Kết nối tới MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/CSVC', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB'.green.bold);
  
  // Drop Database
  try {
    await mongoose.connection.dropDatabase();
    console.log('Database dropped'.yellow.bold);

  } catch (error) {
    console.error('Error dropping database:', error);
  }

  // Đóng kết nối MongoDB khi hoàn thành
  mongoose.connection.close();
})
.catch((err) => console.error('Error connecting to MongoDB:', err));