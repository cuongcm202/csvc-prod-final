const express = require('express');
const router = express.Router();
const authenToken = require("../modules/authServer");
const recordController = require("../controllers/recordController");

// Non-authenticated route
router.get('/loanrecord', authenToken.authenToken, recordController.ShowLoanRecordPage);
router.get('/loan/retrieveall', authenToken.authenToken, recordController.retrieveAllLoanRecordTable);

module.exports = router;
