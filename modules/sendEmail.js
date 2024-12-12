const dotenv = require('dotenv')
require('dotenv').config();
const nodemailer = require('nodemailer')
const path = require('path');

module.exports.sendMail = async (req, res, next) => {
    // console.log('Send mail route');
    const { userEmail, csvFile } = req.body;
    
    // console.log('csvPath: ', csvFile);
    const csvPath = path.join(__dirname, '../assets/public/csv/export', csvFile);
    // Send email
    const transporter = nodemailer.createTransport({
        // Your SMTP configuration here
        service: 'gmail',
            secure: false,
            auth: {
              user: process.env.APP_EMAIL,
              pass: process.env.APP_PASSWORD // Mật khẩu email của bạn
            }
    });

    const mailOptions = {
        from: process.env.APP_EMAIL,
        to: userEmail,
        subject: `Report device ${csvFile}`,
        text: `This is report data device from system
More infomation, please contact us!        
        `,
        attachments: [{
            filename: csvFile,
            path: csvPath
        }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.send(
                `<script>
                    alert('Gửi mail không thành công, vui lòng kiểm tra lại địa chỉ mail của bạn')
                    window.location.assign(window.location.origin  + '/sendemail');
                </script>`
            );
            return;
        }
        // console.log('Email sent: ' + info.response);
        res.send(
            `<script>
                alert('Gửi mail thành công, vui lòng kiểm tra hộp thư của bạn!')
                window.location.assign(window.location.origin  + '/');
            </script>`
        );
    });
}
