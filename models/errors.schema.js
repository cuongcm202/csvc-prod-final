const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  message: { type: String, required: true },
  statusCode: { type: Number },
  route: { type: String },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Error', errorSchema);