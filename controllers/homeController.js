const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const moment = require("moment");
const { stringify } = require("uuid");
// Ensure public/csv directory exists, create it if not
const csvDir = path.join(__dirname, "../assets/public/csv/export");
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir, { recursive: true });
}

const pathFolderXlsxWorking = "/assets/public/csv";

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
} = require("../models/models.js");

// Module
const { exportFileCSV } = require("../modules/exportFileCSV");
const { sendEmail } = require("../modules/sendEmail");
const {
    exportHeaderLayout,
    exportDataToXlsxFile,
} = require("../modules/exportFileXlsx.js");
const { findOne } = require("../models/devices.schema.js");

function calculateDepreciation(cost, year, depreciationRate) {
    // Lấy năm hiện tại theo múi giờ của server
    const currentYear = new Date().getFullYear();

    // Tính số năm kể từ khi tài sản được mua
    const years = parseInt(currentYear - year);
    const tongLuongKhauHao = years * (depreciationRate / 100)
    // Tính giá trị còn lại của tài sản sau khi khấu hao
    const depreciationValue = cost * tongLuongKhauHao

    return depreciationValue.toString()
}

function calculateRemainingValue(initValue, depreciationValue) {
  
    var remainingValue = initValue - depreciationValue

    return remainingValue;
}

function getStringDateTime() {
    const currentTime = Date.now();

    // Tạo một đối tượng Date từ Unix timestamp
    const currentDate = new Date(currentTime);

    // Lấy các thành phần ngày, tháng và năm
    const day = currentDate.getDate().toString().padStart(2, "0"); // Cần chú ý thêm padStart để thêm số 0 phía trước nếu cần
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0, cần thêm 1
    const year = currentDate.getFullYear();

    // Tạo chuỗi ngày tháng theo định dạng 'DD/MM/YYYY'
    const formattedDate = `${day}${month}${year}`;

    return formattedDate;
}

module.exports.homePage = async (req, res, next) => {
    try {
        res.render("./contents/home/home.pug", {
            title: "Trang chủ",
            routes: {
                "Trang chủ": "/",
                Dashboard: "/dashboard",
                "Quản lý profile": "/user",
                "Quản lý thiết bị": "/device/report",
                "Quản lý nhà cung cấp": "/suppliers/detail",
                "Quản lý vị trí": "/locations/detail",
                "Quản lý loại thiết bị": "/devicetypes/detail",
                "Quản lý lịch sử mượn trả": "/record/loanrecord",
            },
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'homePage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.showDashBoard = async (req, res, next) => {
    try {

        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/user')
        }

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
            arrDeviceIdsDue = result;
        })
        .catch((error) => {
            console.error(error);
        });
        // console.log(arrDeviceIdsDue);

        
        // ==== Task 3: Thống kê những thiết bị không còn hoạt động
        let arrDevice = await Device.find({});
        const arrDeviceNotWorking = [];

        await Device.find().then((device) => {
            device.map((device) => {
                if (device.status != "Active") {
                    // console.log(device);
                    arrDeviceNotWorking.push(device);
                } else {
                    // arrDevice.push(device)
                }
            });
        });
        // console.log(arrDevice.length);
        // console.log("arrDeviceNotWorking: ", arrDeviceNotWorking.length);

        res.render("./contents/dashboard/dashboard.pug", {
            title: "Home page",
            routes: {
                "Quản lý nhà cung cấp": "/suppliers/detail",
                "Quản lý vị trí": "/locations/detail",
                "Quản lý loại thiết bị": "/devicetypes/detail",
                "Quản lý lịch sử mượn trả": "/record/loanrecord",
            },
            data: {
                totalDevices: arrDevice.length,
                // Task 1: Thống kê những thiết bị được mượn nhưng chưa được trả || arrDeviceIdsNotReturned / totalDevices
                arrDeviceIdsNotReturned: arrDeviceIdsNotReturned.length,
                // Task 2: Thống kê những người mượn quá hạn nhưng chưa trả || arrDeviceIdsDue / arrDeviceIdsNotReturned
                arrDeviceIdsDue: arrDeviceIdsDue.length,
                // Task 3: Thống kê những thiết bị không còn hoạt động || arrDeviceNotWorking / totalDevices
                arrDeviceNotWorking: arrDeviceNotWorking.length,
            },
            arrUserIdsNotReturned: JSON.stringify(arrUserIdsNotReturned),
            arrDeviceIdsDue: JSON.stringify(arrDeviceIdsDue)
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showDashBoard'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.errorPage = async (req, res, next) => {
    try {
        res.render("error404", {
            title: "Home page",
            routes: {
                "Trang chủ": "/",
            },
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'errorPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.showExportFileCSV = async (req, res, next) => {
    try {
        res.render("./contents/exportCSV.pug", {
            title: "Home page",
            routes: {
                "Trang chủ": "/",
            },
            typesCSV: {
                Supplier: "Suppliers table",
                Location: "Locations table",
                DeviceType: "Device Types table",
                Loan: "Loan table",
            },
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showExportFileCSV'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.exportFileCSV = async (req, res, next) => {
    try {
        async function getObjectList(req) {
            let csvFileName = ""; // Initialize csvFileName variable

            if (req.body) {
                if (req.body.csvFile == "Supplier") {
                    const suppliers = await Supplier.find(
                        {},
                        { _id: 0, __v: 0 }
                    ).then((suppliers) =>
                        suppliers.map((supplier) => {
                            return { ...supplier._doc };
                        })
                    );
                    csvFileName = "suppliers"; // Set corresponding CSV file name
                    return { data: suppliers, fileName: csvFileName }; // Return data and file name
                } else if (req.body.csvFile == "Location") {
                    const locations = await Location.find(
                        {},
                        { _id: 0, __v: 0 }
                    ).then((locations) =>
                        locations.map((location) => {
                            return { ...location._doc };
                        })
                    );
                    csvFileName = "locations"; // Set corresponding CSV file name
                    return { data: locations, fileName: csvFileName }; // Return data and file name
                } else if (req.body.csvFile == "DeviceType") {
                    const deviceTypes = await DeviceType.find(
                        {},
                        { _id: 0, __v: 0 }
                    ).then((devicetypes) =>
                        devicetypes.map((devicetype) => {
                            return { ...devicetype._doc };
                        })
                    );
                    csvFileName = "deviceTypes"; // Set corresponding CSV file name
                    return { data: deviceTypes, fileName: csvFileName }; // Return data and file name
                } else if (req.body.csvFile == "Loan") {
                    const loans = await Loan.find({}, { _id: 0, __v: 0 }).then(
                        (loans) =>
                            loans.map((loan) => {
                                return { ...loan._doc };
                            })
                    );
                    csvFileName = "loans"; // Set corresponding CSV file name
                    return { data: loans, fileName: csvFileName }; // Return data and file name
                }
            }

            return { data: null, fileName: null }; // Return null if req.body is invalid or csvFile is not valid
        }

        let { data, fileName } = await getObjectList(req); // Await getObjectList to get the data and file name
        const outputPath = csvDir;
        // console.log(typeof data);
        // console.log(data);

        exportFileCSV(fileName, data, outputPath)
            .then((filePath) => {
                // console.log("CSV file saved at:", filePath);
                // Return path of CSV file to client
                res.download(filePath);
            })
            .catch((err) => {
                console.error("Error saving CSV file:", err);
                res.status(500).send(
                    "An error occurred while processing the request."
                );
            });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'exportFileCSV'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.updateXlsxFile = async (req, res, next) => {
    // const configSchema = await Config.findOne()
    // const depreciationRate = configSchema.depreciationRate
    
    const deviceTypesName = req.body.deviceTypes
    // const deviceTypesName = "Dụng cụ lâu bền"
    // const deviceTypesName = "Tài sản cố định"
    // const timestamp = moment().format('YYYYMMDDTHHmmss');
    const timestamp = require('moment-timezone').utc().utcOffset('+07:00').format('YYYYMMDDTHHmmss');


    const inputLayoutFile = path.join(
        __dirname,
        "../",
        pathFolderXlsxWorking,
        "layout",
        "headerXlsxFile.xlsx"
    );

    const tableNames = 'Devices';
    // const tableNames = "Loans";
    const outputFile = path.join(
        __dirname,
        "../",
        pathFolderXlsxWorking,
        "export",
        `${deviceTypesName}-${timestamp}.xlsx`
    );

    try {
        var headerRow, formattedLoans;

        switch (tableNames) {
            case "Loans":
                headerRow = Object.keys(Loan.schema.obj);
                headerRow = headerRow.filter(
                    (key) =>
                        key !== "_id" &&
                        key !== "__v" &&
                        key !== "proofImageUrl" &&
                        key !== "proofVideoUrl"
                );

                await exportHeaderLayout(inputLayoutFile, outputFile);

                const loans = await Loan.find(
                    {},
                    { _id: 0, __v: 0, proofImageUrl: 0, proofVideoUrl: 0 }
                )
                    .populate("device", "name")
                    .populate("borrower", "username");

                formattedLoans = loans.map((loan) => ({
                    ...loan.toObject(),
                    device: loan?.device?.name,
                    borrower: loan?.borrower?.username,
                }));

                setTimeout(() => {
                    exportDataToXlsxFile(
                        tableNames,
                        headerRow,
                        formattedLoans,
                        outputFile
                    );
                }, 1000);

                break;
            case "Devices":
                // console.log('GET deivce table');

                // const headerRowOrigin = Object.keys(Device.schema.obj)
                // .filter(key => !["_id", "__v", "imageUrl", "videoUrl", "assignedUser", "loans", "logs"].includes(key))
                // .sort((a, b) => {
                //   // Sắp xếp các key theo thứ tự yêu cầu
                //   const order = ["name", "serialNumber", "createDate", "quantity", "price", "residual value"];
                //   return order.indexOf(a) - order.indexOf(b);
                // });
                const headerRowOrigin = ["STT", "name", "serial Number", "purchaseDate", "quantity", "price", "residual value", "quantity", "price", "residual value", "quantity", "price", "residual value"];

                const headerMapping = {
                    name: 'Tên dụng cụ lâu bền',
                    serialNumber: 'Mã số',
                    createDate: 'Năm',
                    quantity: 'Số lượng',
                    price: 'Nguyên giá',
                    // 'residual value': 'Giá trị còn lại' - Đã loại bỏ vì giá trị mặc định rỗng
                  };
                  
                // const headerRow = Object.keys(Device.schema.obj)
                // .filter(key =>
                //     key !== "_id" &&
                //     key !== "__v" &&
                //     key !== "imageUrl" &&
                //     key !== "videoUrl" &&
                //     key !== "assignedUser" &&
                //     key !== "loans" &&
                //     key !== "logs" &&
                //     key !== "deviceType" &&
                //     key !== "initStatus" &&
                //     key !== "location" &&
                //     key !== "supplier" &&
                //     key !== "description" &&
                //     key !== "purchaseDate" &&
                //     key !== "warrantyExpiry" &&
                //     key !== "status" 

                // )
                // .map(key => ({
                //     key,
                //     displayName: headerMapping[key] || key
                // }))
                // .sort((a, b) => {
                //     // Sắp xếp theo thứ tự yêu cầu
                //     const order = ['name', 'serialNumber', 'createDate', 'quantity', 'price'];
                //     return order.indexOf(a.key) - order.indexOf(b.key);
                // })
                // .map(item => item.displayName); // Chỉ lấy tên hiển thị

                const headerRow = [
                    "Stt",
                    'Tên dụng cụ lâu bền',
                    'Mã số',
                    'Năm',
                    'Số lượng',
                    'Nguyên giá',
                    'Giá trị còn lại',
                    'Số lượng',
                    'Nguyên giá',
                    'Giá trị còn lại',
                    'Số lượng',
                    'Nguyên giá',
                    'Giá trị còn lại',
                    'Tỷ lệ khấu hao'
                  ]
                // console.log(headerRow);

                await exportHeaderLayout(inputLayoutFile, outputFile);

                // const devices = await Device.find(
                //     {},
                //     { _id: 0, __v: 0, loans: 0, logs: 0 }
                // )
                //     .populate("deviceType", "name")
                //     .populate("location", "name")
                //     .populate("supplier", "name");
                const devices = await Device.find(
                    {},
                    { _id: 0, __v: 0, loans: 0, logs: 0 }
                )
                    .populate({
                        path: 'deviceType',
                        match: { name: deviceTypesName },
                        select: 'name'
                    })
                    .populate('location', 'name')
                    .populate('supplier', 'name');
                // console.log(devices);

                // formattedDevices = devices.map((device) => ({
                //     ...device.toObject(),
                //     deviceType: device.deviceType.name,
                //     location: device.location.name,
                //     supplier: device.supplier.name,
                // }));
                // const formattedDevices = devices.map((device) => ({
                //     ...device.toObject(),
                //     deviceType: device?.deviceType ? device?.deviceType.name : null,
                //     location: device?.location ? device?.location.name : null,
                //     supplier: device?.supplier ? device?.supplier.name : null,
                // }));
                
                const formattedDevices = devices.map((device) => {
             
                    // Lấy năm từ chuỗi purchaseDate
                    const purchaseYear = new Date(device.purchaseDate).getFullYear();
                    const cost = parseFloat(device.price.replace(/[^0-9.-]+/g,"")); // Chuyển đổi price thành số
                    
                    const depreciation = calculateDepreciation(cost, purchaseYear, device.depreciationRate)
                    
                    const remainValue = calculateRemainingValue(cost, depreciation)
                    return {
                        ...device.toObject(),
                        deviceType: device?.deviceType ? device?.deviceType.name : null,
                        location: device?.location ? device?.location.name : null,
                        supplier: device?.supplier ? device?.supplier.name : null,
                        depreciation,
                        remainValue
                    };
                });
                
                const filteredDevices = formattedDevices.filter(device => device.deviceType !== null);
                
                // console.log(formattedDevices);
                // console.log(formattedDevices);
                setTimeout(() => {
                    exportDataToXlsxFile(
                        tableNames,
                        headerRowOrigin,
                        headerRow,
                        filteredDevices,
                        outputFile
                    );
                }, 1000);

                break;

            default:
                break;
        }

        res.status(200).json({});
    } catch(error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'updateXlsxFile'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.ShowDownloadXlsxFile = async (req, res, next) => {
    // Get header row
    try {
        // === Get filenames ====
        const directoryPath = path.join(
            __dirname,
            "../assets",
            "public",
            "csv",
            "export"
        );

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error("Error reading directory:", err);
            }

            res.render("./contents/showDownloadXlsxFile.pug", {
                title: "Download xlsx file",
                routes: {
                    "Thông tin thiết bị": "/device/report",
                    "Tạo thiết bị": "/device/create",
                    "Mượn thiết bị": "/device/loan",
                    "Đã mượn": "/device/return",
                    "Quản lý lịch sử mượn trả": "/record/loanrecord",
                },
                data: files,
            });
        });
    } catch(error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'ShowDownloadXlsxFile'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.downloadXlsxFile = async (req, res, next) => {
    const { filename } = req.body; // Get the filename from query parameters
    const timestamp = moment().format("YYYYMMDDTHHmmss");
    // console.log(filename);
    // Check if filename is provided
    if (!filename) {
        return res.status(400).send("Filename is required");
    }

    // Construct the file path
    const filePath = path.join(
        __dirname,
        "../assets",
        "public",
        "csv",
        "export",
        filename
    );

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    try {
        const newFilename = `${filename.split(".")[0]}-${timestamp}.${
            filename.split(".")[1]
        }`;
        // Set response headers
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${newFilename}`
        );

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'downloadXlsxFile'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};

module.exports.sendEmail = async (req, res, next) => {
    try {
        fs.readdir(csvDir, (err, files) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Internal Server Error" });
                return;
            }
            const csvFiles = files.filter((file) => file.endsWith(".xlsx"));
            res.render("./contents/sendEmail.pug", {
                title: "Gửi mail",
                routes: {
                    "Trang chủ": "/",
                },
                filesnamecsv: csvFiles,
            });
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'sendEmail'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
};
