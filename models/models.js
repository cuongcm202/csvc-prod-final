// models.js
const Device = require('./devices.schema');
const Location = require('./locations.schema');
const Supplier = require('./suppliers.schema');
const User = require('./users.schema');
const Loan = require('./loans.schema');
const Log = require('./logs.schema');
const DeviceType = require('./deviceTypes.schema');
const Config = require('./config.schema');
const ErrorSchema = require('./errors.schema')

module.exports = {
  Device,
  Location,
  Supplier,
  User,
  Loan,
  Log,
  DeviceType,
  Config,
  ErrorSchema
};
