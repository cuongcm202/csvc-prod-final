const mongoose = require('mongoose');
const { User, DeviceType, Supplier, Location, Config } = require('../models/models');

mongoose.connect('mongodb://127.0.0.1:27017/CSVC', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  try {
    // Example mock data
    const usersData = [
        { username: 'admin', fullname: 'Admin User', password: 'adminhuet86', email: 'admin@gmail.com', phone: '987-654-3210', role: 'admin', createdAt: new Date() },
        { username: 'namds', fullname: 'Nguyễn Danh Nam', password: 'namds', email: 'namds@gmail.com', phone: '789-012-3456', role: 'admin', createdAt: new Date() },
        { username: 'lichnguyen', fullname: 'Nguyễn Quang Lịch', password: 'lichnguyen', email: 'lichnguyen@gmail.com', phone: '789-012-3456', role: 'admin', createdAt: new Date() },
    ];

    // Insert mock data
    await User.insertMany(usersData);

    console.log('User data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting mock data:', err);
    mongoose.disconnect();
  }
});