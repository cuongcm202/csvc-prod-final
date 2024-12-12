// loans.schema.js
const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  idRecord: { type: Number, unique: true, require: true },
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  borrowedAt: { type: Date, required: true },
  expectedReturnDate: { type: Date },
  actualReturnDate: { type: Date },
  transactionStatus: { type: String, enum: ['Borrowed', 'Returned'], required: true },
  proofImageUrl: { type: String },
  proofVideoUrl: { type: String }
});

module.exports = mongoose.model('Loan', loanSchema);