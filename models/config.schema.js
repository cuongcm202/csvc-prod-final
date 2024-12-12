const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  depreciationRate: { type: Number, require: true },
  settingSizeImg: {
    height: { type: Number, require: true },
    width: { type: Number, require: true }
  },
  settingSizeVideo: {
    height: { type: Number, require: true },
    width: { type: Number, require: true }
  }
});

module.exports = mongoose.model('Config', configSchema);
