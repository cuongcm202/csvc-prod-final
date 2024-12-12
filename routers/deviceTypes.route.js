const express = require('express');
const router = express.Router();
const authenToken = require("../modules/authServer");
const deviceTypesController = require("../controllers/deviceTypesController");

// Show page create DeviceTypes
router.get('/create', authenToken.authenToken, deviceTypesController.showCreateDeviceTypesPage);
router.post('/add', authenToken.authenToken, deviceTypesController.addDeviceTypes);

// Show detail DeviceTypes page
router.get('/detail', authenToken.authenToken, deviceTypesController.showDetailDeviceTypesPage);
// Retrieve all deviceTypes
router.get('/retrieve', authenToken.authenToken, deviceTypesController.retrieveAllDeviceTypesTable);
// Route update DeviceTypes
router.post('/update', authenToken.authenToken, deviceTypesController.updateDeviceTypes);

module.exports = router;