// logs.schema.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityType', required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, required: true }
});

module.exports = mongoose.model('Log', logSchema);