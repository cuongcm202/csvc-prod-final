const { 
    Supplier,
    ErrorSchema
 } = require('../models/models.js')

function handleAlertWithRedirectPage(alertString, redirect) {
    return `<script>
        alert('${alertString}')
        window.location.assign(window.location.origin  + '${redirect}');
    </script>`
}

module.exports.showCreateSuppliersPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const suppliers = await Supplier.find({}, 'name').then(supplier => supplier.map(supplier => supplier.name));
        res.render("./contents/suppliers/createSuppliers.pug", {
            title: 'Nhà cung cấp',
            routes: {
                'Tạo nhà cung cấp': '/suppliers/create',
                'Sửa nhà cung cấp': '/suppliers/detail'
            },
            suppliers: JSON.stringify(suppliers),
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showCreateSuppliersPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.addSuppliers = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const supplier = new Supplier(req.body)
        await supplier
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
            route: 'addSuppliers'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.showDetailSuppliersPage = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }

        const suppliers = await Supplier.find({})
            .sort({ _id: -1 }) // Sắp xếp theo _id giảm dần để lấy 20 phần tử cuối cùng
            .limit(20)

        res.render("./contents/suppliers/detailSuppliers.pug", {
            title: 'Nhà cung cấp',
            routes: {
                'Tạo nhà cung cấp': '/suppliers/create',
                'Sửa nhà cung cấp': '/suppliers/detail'
            },
            suppliers: JSON.stringify(suppliers),
        });
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'showDetailSuppliersPage'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.retrieveAllSuppliersTable = async (req, res, next) => {
    try {
        const { role } = req.userId;

        if (role != 'admin' && role != 'moderator') {
            return res.redirect('/404')
        }
        
        const suppliers = await Supplier.find();

        res.status(200).json({
            success: 'true',
            data: suppliers
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'retrieveAllSuppliersTable'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.updateSuppliers = async (req, res, next) => {
    try {

        const { role } = req.userId;

        if (role != 'admin') {
            return res.redirect('/404')
        }

        // console.log(req.body);
        // Tìm và cập nhật nhà cung cấp dựa trên name
        const updatedSupplier = await Supplier.findOneAndUpdate(
        { name: req.body.nameholder }, // Điều kiện tìm kiếm
        req.body, // Dữ liệu cập nhật
        { new: true } // Trả về bản ghi đã được cập nhật
        );

        if (!updatedSupplier) {
            return res.status(404).json({ error: 'Không tìm thấy nhà cung cấp' });
        }

        const handleResult = handleAlertWithRedirectPage('Cập nhật thành công!','/suppliers/detail')
        return res.send(
            handleResult
        )
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'updateSuppliers'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}

module.exports.deleteSuppliers = async (req, res, next) => {
    try {

        const { role } = req.userId;

        if (role != 'admin') {
            return res.status(200).json({
                success: false
            })
        }
        

        const deletedSupplier = await Supplier.deleteOne({ name: req.body.supplierName });
        res.status(200).json({
            success: true
        })
    } catch (error) {
        const errorlog = new ErrorSchema({
            message: error,
            statusCode: 400,
            route: 'deleteSuppliers'
        });
          
        // Save the error to the database
        errorlog.save()
        const handleReturn = handleAlertWithRedirectPage('Đã có lỗi xảy ra! Liên hệ quản trị viên để giải quyết','/')
        res.send(handleReturn);
    }
}