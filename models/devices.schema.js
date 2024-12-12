// devices.schema.js
const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  serialNumber: { type: String, unique: true, required: true},
  name: { type: String, required: true },
  deviceType: { type: mongoose.Schema.Types.ObjectId, ref: 'DeviceType', required: true },
  status: { type: String, enum: ['Active', 'Repair', 'Damaged'], required: true },
  initStatus: { type: String, enum: ['used', 'notUsed'], required: true },
  imageUrl: { type: String },  
  videoUrl: { type: String },
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  description: { type: String },
  price: { type: String },
  purchaseDate: { type: Date, required: true },
  warrantyExpiry: { type: Date, require: true},
  createDate: { type: Date, require: true},
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Log' }],
  depreciationRate: { type: Number, require: true },
});

module.exports = mongoose.model('Device', deviceSchema);