const express = require('express')
const router = express.Router()

const authenToken = require("../modules/authServer");
const homeController = require("../controllers/homeController")
const uploadModule = require("../modules/uploadServer")
const upload = require("../modules/multerSetting")
const moduleSendEmail = require('../modules/sendEmail')

router.get('/', authenToken.authenToken, homeController.showDashBoard)
router.post('/uploads', upload.single('file'), uploadModule.uploadFile)
router.post('/image/delete', uploadModule.deleteFile)
router.get('/404', homeController.errorPage)

// Route export csv file
router.get('/export', homeController.showExportFileCSV)
router.post('/export', homeController.exportFileCSV)

// Route export xlsx

router.post('/xlsx/update', homeController.updateXlsxFile)
router.get('/xlsx/get', homeController.ShowDownloadXlsxFile)
router.post('/xlsx/download', homeController.downloadXlsxFile)

// Route send email
router.get('/sendemail', homeController.sendEmail)
router.post('/sendemailupload', moduleSendEmail.sendMail)

// Route show dashboard
// router.get('/dashboard', homeController.showDashBoard)
module.exports = router;