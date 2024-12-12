const path = require("path");
const fs = require('fs')

var uploadDirectory = '/public/uploads/devices/';

module.exports.uploadFile = async (req, res, next) => {

    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
    }

    const filePath = path.join(uploadDirectory, req.file.filename);

    // Construct URL for the uploaded file
    const fileUrl = uploadDirectory + `${req.file.filename}`;

    res.status(200).json({
        status: 'success',
        data: fileUrl
    })
}

module.exports.deleteFile = async (req, res, next) => {
    const { filename } = req.body;
    
    if (!filename) {
        return res.status(200).json({
            success: false,
            message: 'No filename'
        });
    }
    
    const filePath = path.join(__dirname, '../assets', filename);
   
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // console.error('Tệp không tồn tại hoặc không thể truy cập:', err);
            return res.status(200).json({
                success: false,
                message: err
            });
        }

        // Nếu tệp tồn tại, thực hiện xóa
        fs.unlink(filePath, (err) => {
            if (err) {
                // console.error('Lỗi khi xóa tệp:', err);
                return res.status(200).json({
                    success: false,
                    message: err
                });
            }
            
            return res.status(200).json({
                success: true,
                message: 'Xóa tệp thành công'
            });
        });
    });
};