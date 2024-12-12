// loans.schema.js
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowedAt: { type: Date, required: true },
  expectedReturnDate: { type: Date, required: true },
  actualReturnDate: { type: Date },
  status: { type: String, enum: ['Borrowed', 'Returned'], required: true }
});

module.exports = mongoose.model('Loan', loanSchema);