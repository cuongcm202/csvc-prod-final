// models.js
const Device = require('./devices.schema');
const Location = require('./locations.schema');
const Supplier = require('./suppliers.schema');
const User = require('./users.schema');
const Loan = require('./loans.schema');
const Log = require('./logs.schema');
const DeviceType = require('./deviceTypes.schema');
const Manufacturer = require('./manufacturers.schema');
const Role = require('./roles.schema');
const ActivityType = require('./activityTypes.schema');

module.exports = {
  Device,
  Location,
  Supplier,
  User,
  Loan,
  Log,
  DeviceType,
  Manufacturer,
  Role,
  ActivityType
};