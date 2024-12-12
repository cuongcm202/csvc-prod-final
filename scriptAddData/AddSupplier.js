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
      { name: 'Supplier 1', address: '123 Supplier St', phone: '123-456-7890', email: 'supplier1@example.com' },
      { name: 'Supplier 2', address: '456 Supplier St', phone: '456-789-0123', email: 'supplier2@example.com' },
    ];

    // Insert mock data
    await Supplier.insertMany(suppliersData);

    console.log('Supplier data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting mock data:', err);
    mongoose.disconnect();
  }
});