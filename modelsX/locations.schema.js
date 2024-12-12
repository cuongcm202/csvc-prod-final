// locations.schema.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true }
});

module.exports = mongoose.model('Location', locationSchema);