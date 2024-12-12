// activityTypes.schema.js
const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String }
});

module.exports = mongoose.model('ActivityType', activityTypeSchema);