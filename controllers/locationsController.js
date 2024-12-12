const { 
    Location,
    ErrorSchema
 } = require('../models/models.js')

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showCreateLocationsPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const locations = await Location.find({}, 'name').then(location => location.map(location => location?.name));
        res.render("./contents/locations/createLocations.pug", {
            title: 'Vị trí',
            routes: {
                'Tạo vị trí': '/locations/create',
                'Sửa vị trí': '/locations/detail'
            },
            locations: JSON.stringify(locations)
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showCreateLocationsPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.addLocations = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const location = new Location(req.body)
        await location
            .save()
            .then(result => {
                res.status(200).json({
                    success: true
                })
            })
            .catch(error => {
                res.status(200).json({
                    success: false
                })
            })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'addLocations'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.showDetailLocationsPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const locations = await Location.find()
            .sort({ _id: -1 }) // Sắp xếp theo _id giảm dần để lấy 20 phần tử cuối cùng
            .limit(20) 

        res.render("./contents/locations/detailLocations.pug", {
            title: 'Vị trí',
            routes: {
                'Tạo vị trí': '/locations/create',
                'Sửa vị trí': '/locations/detail'
            },
            locations: JSON.stringify(locations),
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showDetailLocationsPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.retrieveAllLocationsTable = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const locations = await Location.find();

        res.status(200).json({
            success: 'true',
            data: locations
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'retrieveAllLocationsTable'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.updateLocations = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin') {
            return res.redirect('/404')
        }

        // Tìm và cập nhật nhà cung cấp dựa trên name
        const updateLocation = await Location.findOneAndUpdate(
        { name: req.body.nameholder }, // Điều kiện tìm kiếm
        req.body, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updateLocation) {
            return res.status(404).json({ error: 'Không tìm thấy nơi lữu trữ' });
        }

        const handleResult = handleAlertWithRedirectPage('Cập nhật thành công!','/locations/detail')
        return res.send(
            handleResult
        )
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'updateLocations'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.deleteLocations = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin') {
            return res.status(200).json({
                success: false
            })
        }
        
        const deletedLocation = await Location.deleteOne({ name: req.body.locationName });
        res.status(200).json({
            success: true
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'deleteLocations'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}