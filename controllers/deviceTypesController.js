const { 
    DeviceType,
    ErrorSchema
 } = require('../models/models.js')

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showCreateDeviceTypesPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        res.render("./contents/deviceTypes/createDeviceTypes.pug", {
            title: 'Loại thiết bị',
            routes: {
                'Tạo loại thiết bị': '/devicetypes/create',
                'Sửa loại thiết bị': '/devicetypes/detail'
            }
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showCreateDeviceTypesPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.addDeviceTypes = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const deviceType = new DeviceType(req.body)
        await deviceType
            .save()
            .then(result => {
                const handleResult = handleAlertWithRedirectPage('Thêm mới thành công!','/devicetypes/detail')
                res.send(handleResult)
            })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'addDeviceTypes'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.showDetailDeviceTypesPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const deviceTypes = await DeviceType.find()
            .sort({ _id: -1 }) // Sắp xếp theo _id giảm dần để lấy 20 phần tử cuối cùng
            .limit(20) 

        res.render("./contents/deviceTypes/detailDeviceTypes.pug", {
            title: 'Loại thiết bị',
            routes: {
                'Tạo loại thiết bị': '/devicetypes/create',
                'Sửa loại thiết bị': '/devicetypes/detail'
            },
            deviceTypes: JSON.stringify(deviceTypes),
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showDetailDeviceTypesPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.retrieveAllDeviceTypesTable = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const deviceTypes = await DeviceType.find();
        
        res.status(200).json({
            success: 'true',
            data: deviceTypes
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'retrieveAllDeviceTypesTable'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.updateDeviceTypes = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin') {
            return res.redirect('/404')
        }

        // Tìm và cập nhật nhà cung cấp dựa trên name
        const updateDeviceTypes = await DeviceType.findOneAndUpdate(
        { name: req.body.nameholder }, // Điều kiện tìm kiếm
        req.body, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updateDeviceTypes) {
            return res.status(404).json({ error: 'Không tìm thấy loại thiết bị' });
        }

        const handleResult = handleAlertWithRedirectPage('Cập nhật thành công!','/devicetypes/detail')
        return res.send(
            handleResult
        )
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'updateDeviceTypes'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.deleteDeviceTypes = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin') {
            return res.status(200).json({
                success: false
            })
        }
        
        const deleteDeviceType = await DeviceType.deleteOne({ name: req.body.deviceTypeName });
        res.status(200).json({
            success: true
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'deleteDeviceTypes'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}