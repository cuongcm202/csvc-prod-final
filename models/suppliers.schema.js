// suppliers.schema.js
const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, unique: true, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('Supplier', supplierSchema);