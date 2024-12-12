const path = require("path");
const devicePathUpload = '/public/uploads/devices/'

// Import device model

const { 
    Device,
    Location,
    Supplier,
    User,
    Loan,
    Log,
    DeviceType,
    ErrorSchema
 } = require('../models/models.js')

 // Import thư viện Moment.js để làm việc với ngày giờ
const moment = require('moment');

// Hàm để chuyển đổi định dạng ngày giờ
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

module.exports.ShowLoanRecordPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        // Thực hiện truy vấn để lấy ra tất cả dữ liệu trong bảng LoanRecord, loại trừ các trường _id, __v và notes
        Loan.find({}, { _id: 0, __v: 0, notes: 0 })
        .populate('device', 'name')
        .populate('borrower', 'username fullname email phone')
        .sort({ _id: -1 }) // Sắp xếp theo _id giảm dần để lấy 20 phần tử cuối cùng
        .limit(20) 
        .then(records => {
            
            const formattedDevices = records.map((record) => {
                
                const device = record?.device?.name ?? 'Thiết bị đã bị xóa'
                const username = record?.borrower?.username
                const fullname = record?.borrower?.fullname
                const phone = record?.borrower?.phone
                const email = record?.borrower?.email
                
                const borrowedAt = formatDateTime(record.borrowedAt)

                const expectedReturnDate = formatDateTime(record.expectedReturnDate)

                if (record.actualReturnDate) {
                    var actualReturnDate = formatDateTime(record.actualReturnDate)
                } else {
                    var actualReturnDate = '-'
                }

                
                const transactionStatus = record?.transactionStatus
                
                const proofImageUrl = record?.proofImageUrl

                const proofVideoUrl = record?.proofVideoUrl
                
                return {
                    device,
                    username,
                    fullname,
                    phone,
                    email,
                    borrowedAt,
                    expectedReturnDate,
                    actualReturnDate,
                    transactionStatus,
                    proofImageUrl,
                    proofVideoUrl
                };
            });
            // console.log(formattedDevices[formattedDevices.length-1]);
            // res.render("./contents/report/loanRecord", {data: JSON.stringify(formattedDevices)})
            res.render("./contents/report/loanRecord.pug", {
                title: 'Home page',
                routes: {
                    'Tạo thiết bị': '/device/create',
                    'Mượn thiết bị': '/device/loan',
                    'Trả thiết bị': '/device/return',
                    'Quản lý lịch sử mượn trả': '/record/loanrecord'
                },
                data: JSON.stringify(formattedDevices)
            });
        })
        .catch(error => {
            console.error('Error fetching records:', error);
        });
    } catch(error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'ShowLoanRecordPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.retrieveAllLoanRecordTable = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }
        
        const loanRecord = await Loan.find({}, { _id: 0, __v: 0, notes: 0 })
        .populate('device', 'name')
        .populate('borrower', 'username')
        .then(records => {
            const formattedDevices = records.map((record) => {
                const device = record?.device?.name
                const username = record?.borrower?.username
                
                const borrowedAt = formatDateTime(record?.borrowedAt)

                const expectedReturnDate = formatDateTime(record?.expectedReturnDate)

                if (record.actualReturnDate) {
                    var actualReturnDate = formatDateTime(record?.actualReturnDate)
                } else {
                    var actualReturnDate = '-'
                }

                
                const transactionStatus = record?.transactionStatus
                return {
                    device,
                    username,
                    borrowedAt,
                    expectedReturnDate,
                    actualReturnDate,
                    transactionStatus
                };
            });

            res.status(200).json({
                success: 'true',
                data: formattedDevices
            })
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'retrieveAllLoanRecordTable'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}