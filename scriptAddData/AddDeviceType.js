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
    const deviceTypesData = [
        { name: 'Dụng cụ lâu bền', description: 'Dụng cụ lâu bền' },
        { name: 'Tài sản cố định', description: 'Tài sản cố định' },
    ];
    // Insert mock data
    await DeviceType.insertMany(deviceTypesData);

    console.log('Devicetype data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting mock data:', err);
    mongoose.disconnect();
  }
});