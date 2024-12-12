const path = require("path");
const jwt = require('jsonwebtoken')

// Import device model
// const User = require("../models/usersSchema.js");
const { User, Config, Loan, Device, ErrorSchema } = require('../models/models')

const bcrypt = require('bcrypt');
const { match } = require("assert");

// Số vòng lặp sử dụng để băm mật khẩu, càng cao thì càng an toàn nhưng cũng tốn nhiều tài nguyên hơn
const saltRounds = 10;

async function hashPassword(password) {
    try {
        // Tạo salt (muối) ngẫu nhiên
        const salt = await bcrypt.genSalt(saltRounds);
        // Sử dụng salt để băm mật khẩu
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function comparePassword(password, hashedPassword) {
    try {
        // So sánh mật khẩu nhập vào với mật khẩu đã băm
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw error;
    }
}

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showBioPage = async (req, res, next) => {
    try {
        const { fullname, username, email, phone, role } = req.userId

        let routesTemp;

        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            routesTemp = {
                'Về trang chủ': '/',
                'Trang thông tin người dùng': '/user/login'
            }
        } else {
            routesTemp = {
                'Quản trị viên': '/user/manage',
                // 'Đăng nhập': '/user/login',
                // 'Đăng ký': '/user/register'
            }
        }

        res.render("./contents/user/bioPage.pug", {
            title: 'Home page',
            routes: routesTemp,
            data: { fullname, username, email, phone, role }
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showBioPage'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.showLoginForm = async (req, res, next) => {
    try {
        
        res.render("./contents/user/loginForm.pug", {
            title: 'Home page',
            routes: {
                'Trang người dùng': '/user',
                'Đăng ký': '/user/register'
            }
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showLoginForm'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        // Check user has return device or not
        let notReturn = false;

        var { email, password } = req.body
        
        email = email
        password = password
        
        // Lưu ý, cần phải đặt thời gian hết hạn token và cookie trùng nhau, tránh lỗi
        const expireTimeSession = 3000
        const accessToken = jwt.sign(req.body, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "3000s",
        });

        await User.find({email: email, password: password}).then(async user => {
            if (!user) {
                return res.status(200).json({
                    success: false
                })
            } else {
                
                // #### Check user return device ####
                
                var arrDeviceIdsNotReturned = [];
                var arrUserIdsNotReturned = [];
                let arrDeviceIdsUsed = await Device.find({ initStatus: "used" }).then(
                    (device) => device.map((device) => device?._id)
                );

                // Thực hiện lượt qua tất cả các deviceIds có trong arrDeviceIdsUsed trong bảng loan table
                // Để kiểm tra thiết bị nào đã được trả
                const processDeviceId = async (deviceId) => {
                    let arrDeviceIdsBorrowedReturn = await Loan.find({
                        device: deviceId,
                    }).populate("borrower", "username");
                    const arrDeviceIdsBorrowed = arrDeviceIdsBorrowedReturn
                        .filter((item) => item?.transactionStatus == "Borrowed")
                        .map((item) => item?.device);
                    const arrDeviceIdsReturned = arrDeviceIdsBorrowedReturn
                        .filter((item) => item?.transactionStatus == "Returned")
                        .map((item) => item?.device);
                    if (arrDeviceIdsBorrowed.length != arrDeviceIdsReturned.length) {
                        arrDeviceIdsNotReturned.push(deviceId);
                        arrUserIdsNotReturned.push(
                            arrDeviceIdsBorrowedReturn[0]?.borrower?.username
                        );
                    }
                };

                await Promise.all(arrDeviceIdsUsed.map(processDeviceId));

                // ==== Task 1: Thống kê những thiết bị được mượn nhưng chưa được trả => done
                // console.log("Thống kê những thiết bị được mượn nhưng chưa được trả");
                // console.log(
                //     "arrDeviceIdsNotReturned: ",
                //     arrDeviceIdsNotReturned.length
                // );
                async function getUserDataAndCount(arrUserIdsNotReturned) {
                    try {
                        // Truy vấn cơ sở dữ liệu để lấy thông tin người dùng
                        const users = await User.find(
                            { username: { $in: arrUserIdsNotReturned } },
                            { _id: 0, __v: 0, role: 0, createdAt: 0, password: 0 }
                        );

                        // Tạo đối tượng để lưu thông tin và số lần lặp
                        let userDataWithCount = {};

                        // Lặp qua mảng arrUserIdsNotReturned để đếm số lần lặp của mỗi người dùng
                        arrUserIdsNotReturned.forEach((username) => {
                            // Kiểm tra xem người dùng đã tồn tại trong userDataWithCount chưa
                            if (!userDataWithCount[username]) {
                                // Nếu chưa, thêm người dùng vào userDataWithCount và đặt số lần lặp là 1
                                userDataWithCount[username] = {
                                    user: users.find(
                                        (user) => user?.username === username
                                    ),
                                    numDevice: 1,
                                };
                            } else {
                                // Nếu đã có, tăng số lần lặp lên 1
                                userDataWithCount[username].numDevice++;
                            }
                        });

                        // Chuyển đổi đối tượng thành mảng và trả về
                        const userDataArray = Object.values(userDataWithCount);

                        // In ra mảng userDataArray để kiểm tra
                        // console.log(userDataArray);

                        // Trả về mảng userDataArray
                        return userDataArray;
                    } catch (error) {
                        console.error("Error:", error);
                        return null;
                    }
                }

                // Sử dụng hàm để lấy dữ liệu và đếm số lần lặp
                arrUserIdsNotReturned = await getUserDataAndCount(
                    arrUserIdsNotReturned
                );
                // console.log(arrUserIdsNotReturned);

                // ==== Task 2: Thống kê những người mượn quá hạn nhưng chưa trả
                //T1: Đầu tiên phải lấy ra được các thiết bị đã mượn nhưng chưa trả
                // => arrDeviceIdsNotReturned <=

                // Sau đó tìm kiếm trong bảng loan với những deviceId này, những deviceId nào với expectedReturnDate < now

                let arrDeviceIdsDue;

                // Bước 1: Tìm kiếm và lọc các bản ghi trong bảng Loan dựa trên arrDeviceIdsNotReturned
                await Loan.aggregate([
                    // Match records based on arrDeviceIdsNotReturned
                    {
                        $match: {
                            device: { $in: arrDeviceIdsNotReturned },
                        },
                    },
                    // Group by device, select the latest record based on idRecord
                    {
                        $group: {
                            _id: "$device",
                            latestRecord: { $max: "$idRecord" },
                            records: { $push: "$$ROOT" },
                        },
                    },
                    // Unwind the grouped records
                    {
                        $unwind: "$records",
                    },
                    // Match records with the latest idRecord
                    {
                        $match: {
                            $expr: { $eq: ["$records.idRecord", "$latestRecord"] },
                        },
                    },
                    // Filter overdue loans
                    {
                        $match: {
                            "records.transactionStatus": "Borrowed",
                            "records.expectedReturnDate": { $lt: new Date() },
                        },
                    },
                    // Lookup device information
                    {
                        $lookup: {
                            from: "devices", // Assuming the collection name is "devices"
                            localField: "records.device",
                            foreignField: "_id",
                            as: "device_info",
                        },
                    },
                    // Lookup borrower information
                    {
                        $lookup: {
                            from: "users", // Assuming the collection name is "users"
                            localField: "records.borrower",
                            foreignField: "_id",
                            as: "borrower_info",
                        },
                    },
                    // Project to reshape the output documents
                    {
                        $project: {
                            _id: "$records._id",
                            idRecord: "$records.idRecord",
                            device: { $arrayElemAt: ["$device_info.name", 0] }, // Assuming device name is in the "name" field
                            borrower: { $arrayElemAt: ["$borrower_info.username", 0] }, // Assuming borrower username is in the "username" field
                            fullname: { $arrayElemAt: ["$borrower_info.fullname", 0] }, // Assuming borrower username is in the "username" field
                            phone: { $arrayElemAt: ["$borrower_info.phone", 0] }, // Assuming borrower username is in the "username" field
                            borrowedAt: "$records.borrowedAt",
                            expectedReturnDate: "$records.expectedReturnDate",
                            actualReturnDate: "$records.actualReturnDate",
                            transactionStatus: "$records.transactionStatus",
                        },
                    },
                ])
                .then((result) => {
                    // console.log(result);
                    // console.log(user);
                    const userExists = result.some(userRecord => userRecord.borrower === user[0].username);
                    // console.log(userExists);
                    if (userExists == true) {
                        notReturn = true
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
                // #### --- ####
            }


            const fullname = encodeURIComponent(user[0].fullname);
            // console.log(`User ${user[0].username} just login!`.bgBlue);

            const sessionId = `sessionId=${req.sessionID}; Max-Age=${expireTimeSession}; HttpOnly; SameSite=Strict; Path=/`;
            const sessionUserName = `sessionUserName=${fullname}; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
            const sessionToken = `token=${accessToken}; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;

            res.setHeader('Set-Cookie', [sessionId, sessionUserName, sessionToken]);

            res.status(200).json({
                success: true,
                message: 'Login success',
                notReturn: notReturn
            })
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'login'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.showRegisterForm = async (req, res, next) => {
    try {
        res.render("./contents/user/registerForm.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Đăng nhập': '/user/login',
                'Đăng ký': '/user/register'
            }
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showRegisterForm'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.register = async (req, res, next) => {
    // Parse data from req.body
    const { fullname, username, password, email, phone } = req.body;

    try {
        // Create a new user instance
        const newUser = new User({
        fullname: fullname,
        username: username.toLowerCase(),
        password: password,
        email: email,
        phone: phone,
        role: 'guest', // Assuming default role is 'user',
        createdAt: Date.now()
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        const handleReturn = handleAlertWithRedirectPage('Đăng kí thành công!', '/user/login')
        res.send(handleReturn)
    } catch (error) {
        res.send(`<script>
                alert('Tài khoản này đã có người khác sử dụng! Vui lòng sử dụng tên đăng nhập và email là giá trị duy nhất!')
                window.location.assign(window.location.origin  + '/user/register');
            </script>`)
    }
}

module.exports.logOut = async (req, res, next) => {
    try {
        const expireTimeSession = 1
        const sessionId = `sessionId=''; Max-Age=${expireTimeSession}; HttpOnly; SameSite=Strict; Path=/`;
        const sessionUserName = `sessionUserName=''; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
        const sessionToken = `token=''; Max-Age=${expireTimeSession}; SameSite=Strict; Path=/`;
    
        res.setHeader('Set-Cookie', [sessionId, sessionUserName, sessionToken]);
    
        res.send(
            `<script>
                localStorage.setItem("notReturn", "true");
                alert('Đăng xuất thành công!')
                window.location.assign(window.location.origin  + '/');
            </script>`
        )
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'logOut'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.ShowManageUserPage = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }

        const users = await User.find({}, { _id: 0, __v: 0 })

        res.render("./contents/admin/manageUser.pug", {
            title: 'Home page',
            routes: {
                'Home': '/',
                'Login': '/user/login',
                'Register': '/user/register'
            },
            data: JSON.stringify(users)
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'ShowManageUserPage'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.manageUserDB = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role

        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }
        // console.log(req.body);
        const { username, fullname, email, password, phone, role } = req.body
        // console.log({ username, fullname, email, password, phone, role });
        const updatedUser = await User.findOneAndUpdate({username: username}, 
            {$set: {
                fullname: fullname,
                email: email,
                password: password,
                phone: phone,
                role: role
            }}
            , {
            new: true
        });

        if (!updatedUser) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'manageUserDB'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}


module.exports.ShowConfigPage = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }

        const configSchema = await Config.findOne({}, { _id: 0, __v: 0 });

        res.render("./contents/admin/configSetting.pug", {
            title: 'Config',
            routes: {
                'Home': '/',
                'Login': '/user/login',
                'Register': '/user/register'
            },
            configSetting: configSchema
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'ShowConfigPage'
          });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.saveConfig = async (req, res, next) => {
    try {
        const roleUserId = req.userId.role
        if (roleUserId != 'admin') {
            return res.redirect('/404')
        }
        
        const { depreciationRate, settingSizeImg, settingSizeVideo } = req.body;

        // Kiểm tra tỷ lệ khấu hao
        if (0 < depreciationRate && depreciationRate < 100) {}
        else {return  res.status(200).json({
            success: false
        })}
        // console.log(depreciationRate, settingSizeImg, settingSizeVideo );
        const updatedConfig = await Config.findOneAndUpdate(
            {},
            {
              depreciationRate,
              settingSizeImg,
              settingSizeVideo
            },
            {
              new: true, // Trả về tài liệu đã cập nhật
              upsert: true // Tạo mới nếu không tìm thấy
            }
        ).then(() => {
            res.status(200).json({
                success: true
            })
        }).catch(err => {
            res.status(200).json({
                success: false
            })
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showBioPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

