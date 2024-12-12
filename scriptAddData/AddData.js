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
    const suppliersData = [
      { name: 'Không bắt buộc', address: 'Không bắt buộc', phone: '123-456-7890', email: 'example@gmail.com' },
    ];

    const usersData = [
      { username: 'admin', fullname: 'Admin User', password: 'adminhuet86', email: 'admin@gmail.com', phone: '987-654-3210', role: 'admin', createdAt: new Date() },
      { username: 'moderator', fullname: 'Mod User', password: 'modhuet86', email: 'moderator@gmail.com', phone: '987-654-3210', role: 'admin', createdAt: new Date() },
      { username: 'namds', fullname: 'Nguyễn Danh Nam', password: 'namds', email: 'namds@gmail.com', phone: '789-012-3456', role: 'admin', createdAt: new Date() },
      { username: 'lichnguyen', fullname: 'Nguyễn Quang Lịch', password: 'lichnguyen', email: 'lichnguyen@gmail.com', phone: '789-012-3456', role: 'admin', createdAt: new Date() },
      { username: 'nqsang', fullname: 'Nguyễn Quang Sang', password: 'nqsang', email: 'ngsang@gmail.com', phone: '789-012-3456', role: 'admin', createdAt: new Date() },
    ];

    const locationsData = [
      { name: 'R.I', description: 'R.I', address: 'R.I' },
      { name: 'R.II', description: 'R.II', address: 'R.II' },
      { name: 'R.III', description: 'R.III', address: 'R.III' },
      { name: 'R.IV', description: 'R.IV', address: 'R.IV' },
      { name: 'R.V', description: 'R.V', address: 'R.V' },
      { name: 'R.VI', description: 'R.VI', address: 'R.VI' },
      { name: 'R.VII', description: 'R.VII', address: 'R.VII' },
      { name: 'R.VIII', description: 'R.VIII', address: 'R.VIII' },
      { name: 'R.IX', description: 'R.IX', address: 'R.IX' },
    ];

    const deviceTypesData = [
      { name: 'Dụng cụ lâu bền', description: 'Dụng cụ lâu bền' },
      { name: 'Tài sản cố định', description: 'Tài sản cố định' },
    ];

    const configData = {
      depreciationRate: 0.1,
      settingSizeImg: { height: 1024, width: 768 },
      settingSizeVideo: { height: 720, width: 1280 },
    };

    // Insert mock data
    await Supplier.insertMany(suppliersData);
    await User.insertMany(usersData);
    await Location.insertMany(locationsData);
    await DeviceType.insertMany(deviceTypesData);
    await Config.create(configData);

    console.log('Mock data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting mock data:', err);
    mongoose.disconnect();
  }
});
