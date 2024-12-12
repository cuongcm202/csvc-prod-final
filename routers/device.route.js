const express = require('express');
const router = express.Router();
const authenToken = require("../modules/authServer");
const devicesController = require("../controllers/devicesController");

// Get detail device
router.get('/get/deviceid=:id', devicesController.readIdDevice);
router.get('/deviceid=:id', devicesController.showPageGetDetailDevice);
router.get('/qrcode', devicesController.showGetDetailDeviceByQrCode);


// Define routes with HTTP methods and corresponding controller functions
router.get('/create', authenToken.authenToken, devicesController.showCreateDevicePage);
router.post('/add', authenToken.authenToken, devicesController.createDeviceDB);
router.post('/update', authenToken.authenToken, devicesController.updateDeviceDB);
router.post('/delete', authenToken.authenToken, devicesController.deleteDeviceDB);
router.get('/report', authenToken.authenToken, devicesController.ShowReportDevicePage);

// Routes requiring authentication
router.get('/loan', authenToken.authenToken, devicesController.ShowLoanDevicePage);
router.post('/loan', authenToken.authenToken, devicesController.loanDeviceDB);
router.get('/return', authenToken.authenToken, devicesController.ShowReturnDevicePage);
router.post('/return', authenToken.authenToken, devicesController.returnDeviceDB);

module.exports = router;
