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
    const configData = {
        depreciationRate: 0.1,
        settingSizeImg: { height: 1024, width: 768 },
        settingSizeVideo: { height: 720, width: 1280 },
    };
  
    // Insert mock data
    await Config.create(configData);

    console.log('Config data inserted successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error inserting mock data:', err);
    mongoose.disconnect();
  }
});