// deviceTypes.schema.js
const mongoose = require('mongoose');

const deviceTypeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('DeviceType', deviceTypeSchema);