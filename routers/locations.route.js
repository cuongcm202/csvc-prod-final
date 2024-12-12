const express = require('express');
const router = express.Router();
const authenToken = require("../modules/authServer");
const locationsController = require("../controllers/locationsController");

// Show page create Locations
router.get('/create', authenToken.authenToken, locationsController.showCreateLocationsPage);
router.post('/add', authenToken.authenToken, locationsController.addLocations);

// Show detail Locations page
router.get('/detail', authenToken.authenToken, locationsController.showDetailLocationsPage);
// Retrieve all locations
router.get('/retrieve', authenToken.authenToken, locationsController.retrieveAllLocationsTable);
// Route update Locations
router.post('/update', authenToken.authenToken, locationsController.updateLocations);

module.exports = router;