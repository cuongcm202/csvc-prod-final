const express = require('express');
const router = express.Router();
const authenToken = require("../modules/authServer");
const suppliersController = require("../controllers/suppliersController");

// Show page create suppliers
router.get('/create', authenToken.authenToken, suppliersController.showCreateSuppliersPage);
router.post('/add', authenToken.authenToken, suppliersController.addSuppliers);

// Show detail suppliers page
router.get('/detail', authenToken.authenToken, suppliersController.showDetailSuppliersPage);
// Retrieve all suppliers 
router.get('/retrieve', authenToken.authenToken, suppliersController.retrieveAllSuppliersTable);
// Route update suppliers
router.post('/update', authenToken.authenToken, suppliersController.updateSuppliers);

module.exports = router;