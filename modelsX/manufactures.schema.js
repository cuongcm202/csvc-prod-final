// manufacturers.schema.js
const mongoose = require('mongoose');

const manufacturerSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('Manufacturer', manufacturerSchema);