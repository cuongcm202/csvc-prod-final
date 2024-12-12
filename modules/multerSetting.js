const multer = require('multer')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require("path");

var uploadDirectory = path.join(__dirname, '../assets/public/uploads/devices/');

// Ensure upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    try {
        fs.mkdirSync(uploadDirectory);
        console.log('Upload directory created successfully.');
    } catch (err) {
        console.error('Error creating upload directory:', err);
        process.exit(1); // Exit the process if directory creation fails
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory)
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname))
    }
})

const upload = multer({ 
    dest: uploadDirectory,
    storage: storage,
})

module.exports = upload