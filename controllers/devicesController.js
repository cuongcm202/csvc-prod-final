const path = require("path");
const devicePathUpload = '/public/uploads/devices/'
// Import thư viện Moment.js để làm việc với ngày giờ
const moment = require('moment');
// Import device model

const { 
    Device,
    Location,
    Supplier,
    User,
    Loan,
    Log,
    DeviceType,
    Config,
     ErrorSchema
 } = require('../models/models.js')

function convertDatetoString(dateString) {
    // Create a Date object from the string
    const date = new Date(dateString);
  
    // Format the date according to the desired format
    const formattedDate = date.toISOString();
  
    // Return the formatted date string
    return formattedDate;
  }

function formatDateTime(inputDateTime) {
    // Sử dụng Moment.js để parse và format ngày giờ
    const formattedDateTime = moment(inputDateTime).format('DD/MM/YYYY-HH:mm');
    return formattedDateTime;
}

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.readIdDevice = async (req, res, next) => {
    try {

        const { id } = req.params

        const device = await Device.findOne({serialNumber: id})

        if (!device) {
            return res.status(200).json({
                success: false
            })
        }

        res.status(200).json({
            success: true
        })
    } catch {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'readIdDevice'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.showPageGetDetailDevice = async (req, res, next) => {
    try {

        const { id } = req.params

        const devices = await Device.find({serialNumber: id}, { __v: 0})
            .populate('deviceType', 'name')
            .populate('location', 'name')
            .populate('supplier', 'name')
            
        let statusLoanDevice = false;

        const existingLoanBorrowed = await Loan.find({ device: devices, transactionStatus: 'Borrowed' })
        
        const existingLoanReturned = await Loan.find({ device: devices, transactionStatus: 'Returned' })
        
        if (existingLoanBorrowed.length > existingLoanReturned.length) {
            statusLoanDevice = true
        }

        const formattedDevices = devices.map(device => ({
            ...device.toObject(),
            deviceType: device?.deviceType?.name,
            location: device?.location?.name,
            supplier: device?.supplier?.name,
            purchaseDate: formatDateTime(device?.purchaseDate),
            warrantyExpiry: formatDateTime(device?.warrantyExpiry)
        }));
        
        res.render("./contents/device/getDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Thêm thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Quản lý lịch sử mượn trả': '/record/loanrecord'
            },
            data: JSON.stringify(formattedDevices[0]),
            statusLoanDevice: statusLoanDevice
        });
    } catch(err) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showPageGetDetailDevice'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.showGetDetailDeviceByQrCode = async (req, res) => {
    try {


        res.render("./contents/device/qrDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Thêm thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Quản lý lịch sử mượn trả': '/record/loanrecord'
            }
        })
    } catch(err) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showGetDetailDeviceByQrCode'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.ShowReportDevicePage = async (req, res, next) => {
    // console.log("Get device routers".blue.bold);

    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }
        
        const configSchema = await Config.findOne();
        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype.name));
        const locations = await Location.find({}, 'name').then(locations => locations.map(location => location.name));
        const suppliers = await Supplier.find({}, 'name').then(suppliers => suppliers.map(supplier => supplier.name));

        await Device.aggregate([
            {
              $lookup: {
                from: 'devicetypes',
                localField: 'deviceType',
                foreignField: '_id',
                as: 'deviceType'
              }
            },
            {
              $unwind: '$deviceType'
            },
            {
              $lookup: {
                from: 'locations',
                localField: 'location',
                foreignField: '_id',
                as: 'location'
              }
            },
            {
              $unwind: '$location'
            },
            {
              $lookup: {
                from: 'suppliers',
                localField: 'supplier',
                foreignField: '_id',
                as: 'supplier'
              }
            },
            {
              $unwind: '$supplier'
            },
            {
              $set: {
                deviceType: '$deviceType.name',
                location: '$location.name',
                supplier: '$supplier.name',
                purchaseDate: { $toDate: '$purchaseDate' },
                warrantyExpiry: { $toDate: '$warrantyExpiry' },
                createDate: { $toDate: '$createDate' }
              }
            },
            {
              $project: {
                serialNumber: 1,
                name: 1,
                deviceType: 1,
                initStatus: {
                    $switch: {
                        branches: [
                        { case: { $eq: ['$initStatus', 'notUsed'] }, then: 'Chưa được sử dụng' },
                        { case: { $eq: ['$initStatus', 'used'] }, then: 'Đã được sử dụng' }
                        ],
                        default: '$initStatus'
                    }
                },
                imageUrl: 1,
                videoUrl: 1,
                location: 1,
                supplier: 1,
                description: 1,
                price: 1,
                purchaseDate: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S.%LZ', date: '$purchaseDate' } },
                warrantyExpiry: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S.%LZ', date: '$warrantyExpiry' } },
                createDate: { $dateToString: { format: '%Y-%m-%dT%H:%M:%S.%LZ', date: '$createDate' } },
                depreciationRate: 1,
                status: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$status', 'Active'] }, then: 'Hoạt động' },
                      { case: { $eq: ['$status', 'Repair'] }, then: 'Đang sửa chữa' },
                      { case: { $eq: ['$status', 'Damaged'] }, then: 'Bị hỏng' }
                    ],
                    default: '$status'
                  }
                }
              }
            }
          ]).then((devices) => {
            res.render("./contents/report/reportDevice.pug", {
                title: 'Thiết bị',
                routes: {
                    'Thêm thiết bị': '/device/create',
                    'Mượn thiết bị': '/device/loan',
                    'Đã mượn': '/device/return',
                    'Quản lý lịch sử mượn trả': '/record/loanrecord'
                },
                formattedDevices: JSON.stringify(devices.reverse()),
                devicetypes: JSON.stringify(devicetypes),
                locations: JSON.stringify(locations),
                suppliers: JSON.stringify(suppliers),
                settingSizeImg: JSON.stringify(configSchema.settingSizeImg),
                settingSizeVideo: JSON.stringify(configSchema.settingSizeVideo)
            });
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'ShowReportDevicePage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.showCreateDevicePage = async (req, res, next) => {
    // console.log("Create device routers".blue.bold);
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype?.name));
        const locations = await Location.find({}, 'name').then(locations => locations.map(location => location?.name));
        const suppliers = await Supplier.find({}, 'name').then(suppliers => suppliers.map(supplier => supplier?.name));

        res.render("./contents/device/createDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Thêm thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Quản lý lịch sử mượn trả': '/record/loanrecord'
            },
            devicetypes: devicetypes,
            locations: locations,
            suppliers: suppliers
        });
           
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showCreateDevicePage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.createDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const deviceType = await DeviceType.find({name: req.body.deviceType})
        const location = await Location.find({name: req.body.location});
        const supplier = await Supplier.find({name: req.body.supplier});
        const data = {
            ...req.body,
            initStatus: 'notUsed',
            deviceType: deviceType[0],
            location: location[0],
            supplier: supplier[0],
            createDate: Date.now(),
            depreciationRate: 15,
        }

        const device = new Device(data)
        await device
            .save()
            .then((result) => {
                // console.log(result);
                // console.log('Lưu thiết bị thành công'.blue.bold);
                const handleReturn = handleAlertWithRedirectPage('Lưu thiết bị thành công!','/device/report')
                res.send(handleReturn)
            })
            .catch((error) => {
                // console.log(error);
                // console.log('ID thiết bị đã tồn tại, vui lòng thử id khác'.red.bold);
                const handleReturn = handleAlertWithRedirectPage('Đã xảy ra lỗi khi thêm thiết bị, có thể id thiết bị đã tồn tại, vui lòng thử lại!','/device/create')
                res.send(handleReturn);
            });
    } catch (error) {
        res.status(404);
    }
};

module.exports.updateDeviceDB = async (req, res, next) => {
//   console.log('Update device route'.yellow.bold)
  try {
    const { role } = req.userId;

    if (role != 'admin') {
        return res.redirect('/404')
    }
    
    const deviceType = await DeviceType.find({name: req.body.deviceType})
    const location = await Location.find({name: req.body.location});
    const supplier = await Supplier.find({name: req.body.supplier});
    const data = {
        ...req.body,
        deviceType: deviceType[0],
        location: location[0],
        supplier: supplier[0]
    }

    Device.findOneAndUpdate(
      { serialNumber: req.body.serialNumber }, // Điều kiện tìm kiếm - ở đây sử dụng trường id để tìm kiếm thiết bị cần cập nhật
      data, // Dữ liệu mới sẽ được cập nhật từ req.body
      { new: true, upsert: true } // Tùy chọn để trả về bản ghi mới sau khi cập nhật và tạo bản ghi mới nếu không tìm thấy
    ).then(updatedDevice => {
        // console.log("Update device successfully!!!".bgYellow.bold);
        const handleReturn = handleAlertWithRedirectPage('Cập nhật thiết bị thành công!','/device/report')
        res.send(handleReturn)
    })
    .catch(error => {res.status(401).json({
        message: "Xảy ra lỗi khi cập nhật thiết bị",
        error: error
      })})

  } catch (error) {
    res.status(401).json({
      message: error
    })
  }
}

module.exports.deleteDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin') {
            return res.status(200).json({
                success: false
            })
        }

        Device.deleteOne({ serialNumber: req.body.serialNumber }).then(result => {
            // console.log('Delete device successfully!'.bgRed)
        }).catch(err => {
            // console.log(`Đã xảy ra lỗi khi xóa thiết bị trong bảng device ${req.body.id}`.yellow)
        })
        res.status(200).json({
            success: true,
            message: 'Deleted device'
        })
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
}

module.exports.ShowLoanDevicePage = async (req, res, next) => {
    try {
        
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const configSchema = await Config.findOne();
        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype?.name));

        // Khai báo các biến cần sử dụng
        let arrDeviceIdsNotUsed, arrDeviceIdsUsed, Data;

        var arrDeviceIdsLoanChecked = [];

        // Câu truy vấn 1: Lọc ra tất cả các thiết bị với trạng thái notUsed
        arrDeviceIdsNotUsed = await Device.find({ initStatus: 'notUsed' })
            .populate('deviceType', 'name')
            .populate('location', 'name')
            .populate('supplier', 'name')
        // console.log('arrDeviceIdsNotUsed: ', arrDeviceIdsNotUsed);
        // Task 2: Kiểm tra bảng deviceId lấy ra tất cả các deviceId với trạng thái 'used' => arrDeviceIdsUsed
        arrDeviceIdsUsed = await Device.find({ initStatus: 'used' }).then(device => device.map(device => device?._id))

        // Task 3: Thực hiện lượt qua tất cả các deviceIds có trong arrDeviceIdsUsed trong bảng loan table
        // Để kiểm tra thiết bị nào đã được trả
        const processDeviceId = async (deviceId) => {
            let arrDeviceIdsBorrowedReturn = await Loan.find({ device: deviceId });
            const arrDeviceIdsBorrowed = arrDeviceIdsBorrowedReturn
                .filter(item => item?.transactionStatus == 'Borrowed')
                .map(item => item?.device);
            const arrDeviceIdsReturned = arrDeviceIdsBorrowedReturn
                .filter(item => item?.transactionStatus == 'Returned')
                .map(item => item?.device);
            if (arrDeviceIdsBorrowed.length == arrDeviceIdsReturned.length) {
                arrDeviceIdsLoanChecked.push(deviceId);
            }
        };

        await Promise.all(arrDeviceIdsUsed.map(processDeviceId));
        
        arrDeviceIdsLoanChecked = await Device.find({ _id: { $in: arrDeviceIdsLoanChecked } })
            .populate('deviceType', 'name')
            .populate('location', 'name')
            .populate('supplier', 'name')
        
        // Câu truy vấn 4: Ghép 2 arrDevicesNotUsed và arrDeviceReturned
        Data = [...arrDeviceIdsNotUsed, ...arrDeviceIdsLoanChecked]
        
        const formattedDevices = Data.map(device => ({
            ...device.toObject(),
            deviceType: device?.deviceType?.name,
            location: device?.location?.name,
            supplier: device?.supplier?.name
        }));
        
        res.render("./contents/device/loanDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Thêm thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Quản lý lịch sử mượn trả': '/record/loanrecord'
            },
            data: JSON.stringify(formattedDevices),
            deviceTypes: JSON.stringify(devicetypes),
            settingSizeImg: JSON.stringify(configSchema.settingSizeImg),
            settingSizeVideo: JSON.stringify(configSchema.settingSizeVideo)
        });

    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'ShowLoanDevicePage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.loanDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;
        
        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        // Using inherited variable from authenServer
        const userId = req.userId;
        
        const { deviceId, expectedReturnDate } = req.body;
        
        const expectedReturnDateString = convertDatetoString(expectedReturnDate);
        
        let deviceObject = await Device.findOne({ serialNumber: deviceId })

        // Task 3: Check if the device is already borrowed
        const existingLoanBorrowed = await Loan.find({ device: deviceObject, transactionStatus: 'Borrowed' })

        const existingLoanReturned = await Loan.find({ device: deviceObject, transactionStatus: 'Returned' })
        
        if (existingLoanBorrowed.length > existingLoanReturned.length) {
            return res.status(200).json({ success: false, message: 'Device is already borrowed' });
        }
        
        // Task 5: Update device status from notUsed to Used based on deviceId
        deviceObject.initStatus = 'used';
        await deviceObject.save();
        
        // Task 6: Get all idRecord from loan table and save them in increasing order, initialize idRecord to 1 if not exists
        const latestLoan = await Loan.findOne().sort({ idRecord: -1 });
        let nextIdRecord = 1;
        if (latestLoan) {
            nextIdRecord = latestLoan.idRecord + 1;
        }

        // Task 7: Save all information into loan table
        const newLoan = new Loan({
            idRecord: nextIdRecord,
            device: deviceObject,
            borrower: userId,
            borrowedAt: new Date(),
            expectedReturnDate: expectedReturnDateString,
            transactionStatus: 'Borrowed'
        });
        
        await newLoan.save();

        res.status(200).json({ success: true, message: 'Loan request processed successfully' });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.ShowReturnDevicePage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const configSchema = await Config.findOne();
        const devicetypes = await DeviceType.find({}, 'name').then(devicetypes => devicetypes.map(devicetype => devicetype?.name));

        const userId = req.userId;

        // T1: Lưu một biến để nhận các deviceId mà người dùng đã mượn sau khi kiểm tra là thiết bị đã trả
        var arrDeviceIdsReuturnChecked = []
        
        let arrDeviceIdsBorrowedReturn = await Loan.find({ borrower: userId }).then(loan => loan.map(loan => loan?.device))
        // console.log(arrDeviceIdsBorrowedReturn);

        var arrDeviceIdCount = {};

        arrDeviceIdsBorrowedReturn.forEach(function(deviceId) {
            if (arrDeviceIdCount[deviceId]) {
                arrDeviceIdCount[deviceId]++;
            } else {
                arrDeviceIdCount[deviceId] = 1;
            }
        })
        
        for (var deviceId in arrDeviceIdCount) {
            if (arrDeviceIdCount[deviceId] % 2 != 0 ) {
                arrDeviceIdsReuturnChecked.push(deviceId)
            }
        }
        // Lấy ra tất cả các deviceObjects dựa trên các bảng ghi người dùng mượn
        // Tìm kiếm dựa trên mảng
        const devices = await Device.find({ _id: { $in: arrDeviceIdsReuturnChecked }})
                .populate('deviceType', 'name')
                .populate('location', 'name')
                .populate('supplier', 'name')
        
        const formattedDevices = devices.map(device => ({
            ...device.toObject(),
            deviceType: device?.deviceType?.name,
            location: device?.location?.name,
            supplier: device?.supplier?.name
        }));
        
        res.render("./contents/device/returnDevice.pug", {
            title: 'Thiết bị',
            routes: {
                'Thêm thiết bị': '/device/create',
                'Mượn thiết bị': '/device/loan',
                'Đã mượn': '/device/return',
                'Quản lý lịch sử mượn trả': '/record/loanrecord'
            },
            data: JSON.stringify(formattedDevices),
            deviceTypes: JSON.stringify(devicetypes),
            settingSizeImg: JSON.stringify(configSchema.settingSizeImg),
            settingSizeVideo: JSON.stringify(configSchema.settingSizeVideo)
        });
        
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'ShowReturnDevicePage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.returnDeviceDB = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }
        
        const userId = req.userId;

        const { deviceId, proofImageUrl, proofVideoUrl } = req.body

        // Task 1: Thực hiện việc lấy ra deviceObject được gửi lên từ phía client
        let deviceObject = await Device.findOne({ serialNumber: deviceId })
        
        if (!deviceObject) {
            return res.status(200).json({ success: false, message: 'Device not found' });
        }  

        // Task 2: Get all idRecord from loan table and save them in increasing order, initialize idRecord to 1 if not exists
        const latestLoan = await Loan.findOne().sort({ idRecord: -1 });
        let nextIdRecord = 1;
        if (latestLoan) {
            nextIdRecord = latestLoan.idRecord + 1;
        }

        const expectedReturnDate = await Loan.findOne({ borrower: userId, device: deviceObject, transactionStatus: 'Borrowed' }).sort({ idRecord: -1 })
        
        // Task 3: Save all information into loan table
        const newLoan = new Loan({
            idRecord: nextIdRecord,
            device: deviceObject,
            borrower: userId,
            borrowedAt: new Date(),
            expectedReturnDate: expectedReturnDate.expectedReturnDate,
            actualReturnDate: new Date(),
            transactionStatus: 'Returned',
            proofImageUrl: proofImageUrl,
            proofVideoUrl: proofVideoUrl
        });
        
        await newLoan.save()
            .then(result => {})
            .catch(err => {
                return res.status(200).json({success: false, message: 'Cant save device.'})
            })

        res.status(200).json({
            success: true
        })

    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
}
