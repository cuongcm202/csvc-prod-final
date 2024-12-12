const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

const {
    User
 } = require('../models/models.js')

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}


module.exports.authenToken = async (req, res, next) => {
    try {
        const cookies = req.headers.cookie;
        // console.log(cookies);
        const cookiesArray = cookies.split("; ");
        // console.log(cookiesArray);
        // const sessionToken = cookiesArray[2].split("=")[1];
        let sessionToken = null;

        cookiesArray.forEach(cookie => {
            const [key, value] = cookie.split('=');
            if (key.trim() === 'token') {
                sessionToken = value;
            }
        });
        
        jwt.verify(sessionToken, process.env.ACCESS_TOKEN_SECRET, async (err, decodedData) => {
            // console.log(err, decodedData);
            if (err) {
                const handleReturn = handleAlertWithRedirectPage('Bạn cần đăng nhập để thực hiện chức năng này.','/user/login')
                res.send(handleReturn)
            } else {
                
                // Check time stamp token (lưu ý trong product cần loại bỏ phần check time stamp)
                if (decodedData.exp) {
                    const expirationTime = new Date(decodedData.exp * 1000);
                    const currentTime = new Date();
                    if (expirationTime < currentTime) {
                        console.log('Token đã hết hạn');
                    } else {
                        // === Return userid ===
                        // req.user = decodedData
                        const userId = await User.findOne({ email: decodedData.email },{ __v: 0, password: 0 });
                        req.userId = userId
                        // console.log('Token còn hiệu lực đến:', expirationTime);
                    }
                } else {
                    // console.log('Token không chứa thông tin về thời gian hết hạn');
                }
                
                next(); // Nếu không sẽ next, người dùng sẽ có thể truy cập vào route books
                // Nếu token hợp lệ, bạn có thể kiểm tra thời gian hết hạn của nó
            }
        });
    } catch(error) {
        res.status(401).redirect("/user/login")
    }
}