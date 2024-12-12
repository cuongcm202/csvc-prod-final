const express = require('express');
const router = express.Router();

const authController = require("../controllers/authController")
const authenToken = require("../modules/authServer")

// Route cho việc hiển thị trang thông tin cá nhân
router.get('/', authenToken.authenToken, authController.showBioPage);

// Route cho việc hiển thị form đăng nhập
router.get('/login', authController.showLoginForm);

// Route xử lý đăng nhập
router.post('/login', authController.login);

// Route cho việc hiển thị form đăng ký
router.get('/register', authController.showRegisterForm);

// Route xử lý đăng ký
router.post('/register', authController.register);

// Route xử lý việc đăng xuất
router.get('/logout', authController.logOut);

// Route quản lý người dùng
router.get('/manage', authenToken.authenToken, authController.ShowManageUserPage);
router.post('/update', authenToken.authenToken, authController.manageUserDB);


// Route quản lý thiết lập 
router.get('/config', authenToken.authenToken, authController.ShowConfigPage);
router.post('/config/save', authenToken.authenToken, authController.saveConfig);

module.exports = router;
