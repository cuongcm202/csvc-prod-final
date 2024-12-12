// devices.schema.js
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String },
  deviceType: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceType', required: true },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
  serialNumber: { type: String, required: true },
  purchaseDate: { type: Date, required: true },
  status: { type: String, enum: ['Active', 'Repair', 'Damaged'], required: true },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }]
});

module.exports = mongoose.model('Device', deviceSchema);