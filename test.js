const fs = require('fs');
const path = require('path');

function listFilesWithExtension(directory, extensions) {
    // Kiểm tra xem directory có tồn tại không
    if (!fs.existsSync(directory)) {
        console.log(`Thư mục '${directory}' không tồn tại.`);
        return;
    }

    // Tách các phần mở rộng trong biến extensions
    const allowedExtensions = extensions.split(', ');

    // Đọc danh sách các file trong thư mục
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Lỗi khi đọc thư mục:', err);
            return;
        }

        // Liệt kê các file và thông tin về chúng
        console.log("Danh sách các file trong thư mục:");
        files.forEach((file, index) => {
            const filePath = path.join(directory, file);
            // Kiểm tra xem filePath là file hay thư mục
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Lỗi khi kiểm tra tệp:', err);
                    return;
                }
                if (stats.isFile()) {
                    // Lấy phần mở rộng của file
                    const fileExtension = path.extname(file).slice(1);
                    // Kiểm tra xem phần mở rộng có trong danh sách cho phép không
                    if (allowedExtensions.includes(fileExtension.toLowerCase())) {
                        // Lấy thông tin về file
                        const fileLastModified = stats.mtime;
                        // In ra thông tin về file
                        console.log(`${index + 1}. ${file} - Loại: File, Ngày giờ tạo: ${fileLastModified}`);
                    }
                } else {
                    console.log(`${index + 1}. ${file} - Loại: Thư mục`);
                }
            });
        });
    });
}

// Đường dẫn đến thư mục chứa các file
const directory = 'assets/public/csv/export';

// Các phần mở rộng cho phép (cách nhau bằng dấu phẩy và khoảng trắng)
const extensions = 'xlsx, csv, xls, doc, docx';

// Gọi hàm listFilesWithExtension với directory và extensions
listFilesWithExtension(directory, extensions);
