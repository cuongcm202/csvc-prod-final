
const ExcelJS = require('exceljs');
const path = require('path');

const myData = [
    { tenSanPham: 'Sữa chua', maSanPham: 'SP001', soLuong: 10, donGia: 5000, tongTien: 50000 },
    { tenSanPham: 'Bánh mì', maSanPham: 'SP002', soLuong: 20, donGia: 3000, tongTien: 60000 },
    { tenSanPham: 'Nước ngọt', maSanPham: 'SP003', soLuong: 15, donGia: 10000, tongTien: 150000 },
    { tenSanPham: 'Kẹo', maSanPham: 'SP004', soLuong: 30, donGia: 2000, tongTien: 60000 },
    { tenSanPham: 'Cà phê', maSanPham: 'SP005', soLuong: 5, donGia: 15000, tongTien: 75000 },
    { tenSanPham: 'Bánh quy', maSanPham: 'SP006', soLuong: 25, donGia: 4000, tongTien: 100000 },
    { tenSanPham: 'Nước suối', maSanPham: 'SP007', soLuong: 12, donGia: 8000, tongTien: 96000 },
    { tenSanPham: 'Kem', maSanPham: 'SP008', soLuong: 8, donGia: 20000, tongTien: 160000 },
    { tenSanPham: 'Bánh gạo', maSanPham: 'SP009', soLuong: 18, donGia: 6000, tongTien: 108000 },
    { tenSanPham: 'Mì gói', maSanPham: 'SP010', soLuong: 22, donGia: 7000, tongTien: 154000 },
    { tenSanPham: 'Nước ép', maSanPham: 'SP011', soLuong: 7, donGia: 12000, tongTien: 84000 },
    { tenSanPham: 'Socola', maSanPham: 'SP012', soLuong: 14, donGia: 10000, tongTien: 140000 },
    { tenSanPham: 'Kẹo cao su', maSanPham: 'SP013', soLuong: 28, donGia: 3000, tongTien: 84000 },
    { tenSanPham: 'Nước chanh', maSanPham: 'SP014', soLuong: 9, donGia: 9000, tongTien: 81000 },
    { tenSanPham: 'Nước dừa', maSanPham: 'SP015', soLuong: 11, donGia: 15000, tongTien: 165000 },
    { tenSanPham: 'Bánh flan', maSanPham: 'SP016', soLuong: 16, donGia: 18000, tongTien: 288000 },
    { tenSanPham: 'Bánh mì sandwich', maSanPham: 'SP017', soLuong: 21, donGia: 25000, tongTien: 525000 },
    { tenSanPham: 'Kem que', maSanPham: 'SP018', soLuong: 13, donGia: 5000, tongTien: 65000 },
    { tenSanPham: 'Nước trái cây', maSanPham: 'SP019', soLuong: 17, donGia: 14000, tongTien: 238000 },
    { tenSanPham: 'Bánh pizza', maSanPham: 'SP020', soLuong: 19, donGia: 35000, tongTien: 665000 },
    // Thêm 30 sản phẩm mới
    { tenSanPham: 'Sữa đậu nành', maSanPham: 'SP021', soLuong: 10, donGia: 6000, tongTien: 60000 },
    { tenSanPham: 'Bánh pho mát', maSanPham: 'SP022', soLuong: 20, donGia: 18000, tongTien: 360000 },
    { tenSanPham: 'Nước cam', maSanPham: 'SP023', soLuong: 15, donGia: 12000, tongTien: 180000 },
    { tenSanPham: 'Kẹo sô cô la', maSanPham: 'SP024', soLuong: 30, donGia: 4000, tongTien: 120000 },
    { tenSanPham: 'Cà phê sữa', maSanPham: 'SP025', soLuong: 5, donGia: 20000, tongTien: 100000 },
    { tenSanPham: 'Bánh quy hạt điều', maSanPham: 'SP026', soLuong: 25, donGia: 10000, tongTien: 250000 },
    { tenSanPham: 'Nước lọc', maSanPham: 'SP027', soLuong: 12, donGia: 5000, tongTien: 60000 },
    { tenSanPham: 'Kem tươi', maSanPham: 'SP028', soLuong: 8, donGia: 25000, tongTien: 200000 },
    { tenSanPham: 'Bánh bông lan', maSanPham: 'SP029', soLuong: 18, donGia: 7000, tongTien: 126000 },
    { tenSanPham: 'Mì xào', maSanPham: 'SP030', soLuong: 22, donGia: 8000, tongTien: 176000 },
    { tenSanPham: 'Nước dừa tươi', maSanPham: 'SP031', soLuong: 7, donGia: 20000, tongTien: 140000 },
    { tenSanPham: 'Sô cô la trắng', maSanPham: 'SP032', soLuong: 14, donGia: 15000, tongTien: 210000 },
    { tenSanPham: 'Kẹo dẻo', maSanPham: 'SP033', soLuong: 28, donGia: 2000, tongTien: 56000 },
    { tenSanPham: 'Nước dâu', maSanPham: 'SP034', soLuong: 9, donGia: 11000, tongTien: 99000 },
    { tenSanPham: 'Nước lọc khoáng', maSanPham: 'SP035', soLuong: 11, donGia: 18000, tongTien: 198000 },
    { tenSanPham: 'Bánh flan caramen', maSanPham: 'SP036', soLuong: 16, donGia: 20000, tongTien: 320000 },
    { tenSanPham: 'Bánh mì thịt', maSanPham: 'SP037', soLuong: 21, donGia: 30000, tongTien: 630000 },
    { tenSanPham: 'Kem sô cô la', maSanPham: 'SP038', soLuong: 13, donGia: 8000, tongTien: 104000 },
    { tenSanPham: 'Nước cam ép', maSanPham: 'SP039', soLuong: 17, donGia: 16000, tongTien: 272000 },
    { tenSanPham: 'Bánh trứng', maSanPham: 'SP040', soLuong: 19, donGia: 25000, tongTien: 475000 },
    { tenSanPham: 'Sữa bột', maSanPham: 'SP041', soLuong: 10, donGia: 10000, tongTien: 100000 },
    { tenSanPham: 'Bánh kem', maSanPham: 'SP042', soLuong: 20, donGia: 35000, tongTien: 700000 },
    { tenSanPham: 'Nước lựu', maSanPham: 'SP043', soLuong: 15, donGia: 13000, tongTien: 195000 },
    { tenSanPham: 'Kẹo gummy', maSanPham: 'SP044', soLuong: 30, donGia: 3000, tongTien: 90000 },
    { tenSanPham: 'Cà phê đen', maSanPham: 'SP045', soLuong: 5, donGia: 12000, tongTien: 60000 },
    { tenSanPham: 'Bánh quy sô cô la', maSanPham: 'SP046', soLuong: 25, donGia: 7000, tongTien: 175000 },
    { tenSanPham: 'Nước ngọt có gas', maSanPham: 'SP047', soLuong: 12, donGia: 8000, tongTien: 96000 },
    { tenSanPham: 'Kem sữa', maSanPham: 'SP048', soLuong: 8, donGia: 18000, tongTien: 144000 },
    { tenSanPham: 'Bánh bí đỏ', maSanPham: 'SP049', soLuong: 18, donGia: 5000, tongTien: 90000 },
    { tenSanPham: 'Mì hảo hảo', maSanPham: 'SP050', soLuong: 22, donGia: 6000, tongTien: 132000 }
];

const workbook = new ExcelJS.Workbook();

workbook.xlsx.readFile(path.join(__dirname, 'newfile.xlsx'))
    .then(() => {
        const worksheet = workbook.getWorksheet(1);

        // Thêm dữ liệu từ mảng myData vào file Excel
        myData.forEach(data => {
            const { tenSanPham, maSanPham, soLuong, donGia, tongTien } = data;
            worksheet.addRow([tenSanPham, maSanPham, soLuong, donGia, tongTien]);
        });

        // Lưu file Excel
        return workbook.xlsx.writeFile(path.join(__dirname, 'newfile.xlsx'));
    })
    .then(() => {
        console.log('Dữ liệu đã được thêm vào file Excel thành công.');

        // Chèn thêm 7 hàng phía trên dữ liệu đã chèn
        // const worksheet = workbook.getWorksheet(1);
        // // const dataToInsert = [
        // //     ['New Data 1', 'ND001', 1, 1000, 1000],
        // //     ['New Data 2', 'ND002', 2, 2000, 4000],
        // //     ['New Data 3', 'ND003', 3, 3000, 9000],
        // //     ['New Data 4', 'ND004', 4, 4000, 16000],
        // //     ['New Data 5', 'ND005', 5, 5000, 25000],
        // //     ['New Data 6', 'ND006', 6, 6000, 36000],
        // //     ['New Data 7', 'ND007', 7, 7000, 49000]
        // // ];
        // const dataToInsert = [
        //     [''],
        //     [''],
        //     [''],
        //     [''],
        //     [''],
        //     [''],
        //     ['']
        // ];

        // // Chèn từng hàng dữ liệu vào trước dòng đầu tiên của dữ liệu đã chèn
        // for (let i = 0; i < dataToInsert.length; i++) {
        //     worksheet.spliceRows(2, 0, dataToInsert[i]);
        // }

        // // Lưu file Excel sau khi chèn dữ liệu mới
        // return workbook.xlsx.writeFile(path.join(__dirname, 'newfile.xlsx'));
    })
    .then(() => {
        console.log('Dữ liệu mới đã được chèn vào file Excel thành công.');
    })
    .catch(err => {
        console.error('Đã xảy ra lỗi:', err);
    });

// const ExcelJS = require('exceljs');
// const path = require('path');

// const myData = [
//     { tenSanPham: 'Sữa chua', maSanPham: 'SP001', soLuong: 10, donGia: 5000, tongTien: 50000 },
//     { tenSanPham: 'Bánh mì', maSanPham: 'SP002', soLuong: 20, donGia: 3000, tongTien: 60000 },
//     { tenSanPham: 'Nước ngọt', maSanPham: 'SP003', soLuong: 15, donGia: 10000, tongTien: 150000 },
//     { tenSanPham: 'Kẹo', maSanPham: 'SP004', soLuong: 30, donGia: 2000, tongTien: 60000 },
//     { tenSanPham: 'Cà phê', maSanPham: 'SP005', soLuong: 5, donGia: 15000, tongTien: 75000 },
//     { tenSanPham: 'Bánh quy', maSanPham: 'SP006', soLuong: 25, donGia: 4000, tongTien: 100000 },
//     { tenSanPham: 'Nước suối', maSanPham: 'SP007', soLuong: 12, donGia: 8000, tongTien: 96000 },
//     { tenSanPham: 'Kem', maSanPham: 'SP008', soLuong: 8, donGia: 20000, tongTien: 160000 },
//     { tenSanPham: 'Bánh gạo', maSanPham: 'SP009', soLuong: 18, donGia: 6000, tongTien: 108000 },
//     { tenSanPham: 'Mì gói', maSanPham: 'SP010', soLuong: 22, donGia: 7000, tongTien: 154000 },
//     { tenSanPham: 'Nước ép', maSanPham: 'SP011', soLuong: 7, donGia: 12000, tongTien: 84000 },
//     { tenSanPham: 'Socola', maSanPham: 'SP012', soLuong: 14, donGia: 10000, tongTien: 140000 },
//     { tenSanPham: 'Kẹo cao su', maSanPham: 'SP013', soLuong: 28, donGia: 3000, tongTien: 84000 },
//     { tenSanPham: 'Nước chanh', maSanPham: 'SP014', soLuong: 9, donGia: 9000, tongTien: 81000 },
//     { tenSanPham: 'Nước dừa', maSanPham: 'SP015', soLuong: 11, donGia: 15000, tongTien: 165000 },
//     { tenSanPham: 'Bánh flan', maSanPham: 'SP016', soLuong: 16, donGia: 18000, tongTien: 288000 },
//     { tenSanPham: 'Bánh mì sandwich', maSanPham: 'SP017', soLuong: 21, donGia: 25000, tongTien: 525000 },
//     { tenSanPham: 'Kem que', maSanPham: 'SP018', soLuong: 13, donGia: 5000, tongTien: 65000 },
//     { tenSanPham: 'Nước trái cây', maSanPham: 'SP019', soLuong: 17, donGia: 14000, tongTien: 238000 },
//     { tenSanPham: 'Bánh pizza', maSanPham: 'SP020', soLuong: 19, donGia: 35000, tongTien: 665000 },
//     // Thêm 30 sản phẩm mới
//     { tenSanPham: 'Sữa đậu nành', maSanPham: 'SP021', soLuong: 10, donGia: 6000, tongTien: 60000 },
//     { tenSanPham: 'Bánh pho mát', maSanPham: 'SP022', soLuong: 20, donGia: 18000, tongTien: 360000 },
//     { tenSanPham: 'Nước cam', maSanPham: 'SP023', soLuong: 15, donGia: 12000, tongTien: 180000 },
//     { tenSanPham: 'Kẹo sô cô la', maSanPham: 'SP024', soLuong: 30, donGia: 4000, tongTien: 120000 },
//     { tenSanPham: 'Cà phê sữa', maSanPham: 'SP025', soLuong: 5, donGia: 20000, tongTien: 100000 },
//     { tenSanPham: 'Bánh quy hạt điều', maSanPham: 'SP026', soLuong: 25, donGia: 10000, tongTien: 250000 },
//     { tenSanPham: 'Nước lọc', maSanPham: 'SP027', soLuong: 12, donGia: 5000, tongTien: 60000 },
//     { tenSanPham: 'Kem tươi', maSanPham: 'SP028', soLuong: 8, donGia: 25000, tongTien: 200000 },
//     { tenSanPham: 'Bánh bông lan', maSanPham: 'SP029', soLuong: 18, donGia: 7000, tongTien: 126000 },
//     { tenSanPham: 'Mì xào', maSanPham: 'SP030', soLuong: 22, donGia: 8000, tongTien: 176000 },
//     { tenSanPham: 'Nước dừa tươi', maSanPham: 'SP031', soLuong: 7, donGia: 20000, tongTien: 140000 },
//     { tenSanPham: 'Sô cô la trắng', maSanPham: 'SP032', soLuong: 14, donGia: 15000, tongTien: 210000 },
//     { tenSanPham: 'Kẹo dẻo', maSanPham: 'SP033', soLuong: 28, donGia: 2000, tongTien: 56000 },
//     { tenSanPham: 'Nước dâu', maSanPham: 'SP034', soLuong: 9, donGia: 11000, tongTien: 99000 },
//     { tenSanPham: 'Nước lọc khoáng', maSanPham: 'SP035', soLuong: 11, donGia: 18000, tongTien: 198000 },
//     { tenSanPham: 'Bánh flan caramen', maSanPham: 'SP036', soLuong: 16, donGia: 20000, tongTien: 320000 },
//     { tenSanPham: 'Bánh mì thịt', maSanPham: 'SP037', soLuong: 21, donGia: 30000, tongTien: 630000 },
//     { tenSanPham: 'Kem sô cô la', maSanPham: 'SP038', soLuong: 13, donGia: 8000, tongTien: 104000 },
//     { tenSanPham: 'Nước cam ép', maSanPham: 'SP039', soLuong: 17, donGia: 16000, tongTien: 272000 },
//     { tenSanPham: 'Bánh trứng', maSanPham: 'SP040', soLuong: 19, donGia: 25000, tongTien: 475000 },
//     { tenSanPham: 'Sữa bột', maSanPham: 'SP041', soLuong: 10, donGia: 10000, tongTien: 100000 },
//     { tenSanPham: 'Bánh kem', maSanPham: 'SP042', soLuong: 20, donGia: 35000, tongTien: 700000 },
//     { tenSanPham: 'Nước lựu', maSanPham: 'SP043', soLuong: 15, donGia: 13000, tongTien: 195000 },
//     { tenSanPham: 'Kẹo gummy', maSanPham: 'SP044', soLuong: 30, donGia: 3000, tongTien: 90000 },
//     { tenSanPham: 'Cà phê đen', maSanPham: 'SP045', soLuong: 5, donGia: 12000, tongTien: 60000 },
//     { tenSanPham: 'Bánh quy sô cô la', maSanPham: 'SP046', soLuong: 25, donGia: 7000, tongTien: 175000 },
//     { tenSanPham: 'Nước ngọt có gas', maSanPham: 'SP047', soLuong: 12, donGia: 8000, tongTien: 96000 },
//     { tenSanPham: 'Kem sữa', maSanPham: 'SP048', soLuong: 8, donGia: 18000, tongTien: 144000 },
//     { tenSanPham: 'Bánh bí đỏ', maSanPham: 'SP049', soLuong: 18, donGia: 5000, tongTien: 90000 },
//     { tenSanPham: 'Mì hảo hảo', maSanPham: 'SP050', soLuong: 22, donGia: 6000, tongTien: 132000 }
// ];

// const workbook = new ExcelJS.Workbook();

// workbook.xlsx.readFile(path.join(__dirname, 'newfile.xlsx'))
//     .then(() => {
//         const worksheet = workbook.getWorksheet(1);

//         // Thêm dữ liệu từ mảng myData vào file Excel
//         myData.forEach(data => {
//             const { tenSanPham, maSanPham, soLuong, donGia, tongTien } = data;
//             worksheet.addRow([tenSanPham, maSanPham, soLuong, donGia, tongTien]);
//         });

//         // Lưu file Excel
//         return workbook.xlsx.writeFile(path.join(__dirname, 'newfile.xlsx'));
//     })
//     .then(async () => {
//         console.log('Dữ liệu đã được thêm vào file Excel thành công.');

//         // Chèn thêm 7 hàng phía trên dữ liệu đã chèn
//         const inputFile = 'headerXlsxFile.xlsx'; // Tên tệp đã có sẵn
//         const outputFile = 'newfile.xlsx'; // Tên tệp đầu ra sau khi đã chèn dữ liệu mới

//         // Tạo workbook mới và đọc dữ liệu từ tệp đã có sẵn
//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.readFile(inputFile);

//         // Lấy sheet đầu tiên
//         const worksheet = workbook.getWorksheet(1);

//         // Lưu header và định dạng của nó
//         const headerRow = worksheet.getRow(1);

//         // Lấy dòng đầu tiên của tệp đầu ra để chèn dữ liệu bên trên
//         const firstDataRow = worksheet.getRow(2);

//         // Lấy số lượng dòng dữ liệu cũ
//         const oldRowCount = worksheet.rowCount;

//         // Copy định dạng và text từ header sang các dòng phía dưới (phần dữ liệu cũ)
//         headerRow.eachCell((cell, colNumber) => {
//             const cellI = firstDataRow.getCell(colNumber);
//             cellI.value = cell.value;
//             cellI.style = Object.assign({}, cell.style);
//         });

//         // Chèn từng hàng dữ liệu vào trước dòng đầu tiên của dữ liệu đã chèn
//         for (let i = 0; i < dataToInsert.length; i++) {
//             worksheet.spliceRows(2, 0, dataToInsert[i]);
//         }

//         // Lưu file Excel sau khi chèn dữ liệu mới
//         return workbook.xlsx.writeFile(path.join(__dirname, 'newfile.xlsx'));
//     })
//     .then(() => {
//         console.log('Dữ liệu mới đã được chèn vào file Excel thành công.');
//     })
//     .catch(err => {
//         console.error('Đã xảy ra lỗi:', err);
//     });


// const ExcelJS = require('exceljs');

// async function main() {
//     try {
//         // Tên file Excel ban đầu và file mới cần tạo
//         const inputFile = 'headerXlsxFile.xlsx'; // Tên tệp đã có sẵn
//         const outputFile = 'newfile.xlsx'; // Tên tệp đầu ra sau khi đã chèn dữ liệu mới

//         // Tạo workbook mới và đọc dữ liệu từ tệp đã có sẵn
//         const workbook = new ExcelJS.Workbook();
//         await workbook.xlsx.readFile(inputFile);

//         // Lấy sheet đầu tiên
//         const worksheet = workbook.getWorksheet(1);

//         // Lưu header và định dạng của nó
//         const headerRow = worksheet.getRow(1);

//         // Lấy dòng đầu tiên của tệp đầu ra để chèn dữ liệu bên trên
//         const firstDataRow = worksheet.getRow(2);

//         // Lấy số lượng dòng dữ liệu cũ
//         const oldRowCount = worksheet.rowCount;

//         // Copy định dạng và text từ header sang các dòng phía dưới (phần dữ liệu cũ)
//         headerRow.eachCell((cell, colNumber) => {
//             const cellI = firstDataRow.getCell(colNumber);
//             cellI.value = cell.value;
//             cellI.style = Object.assign({}, cell.style);
//         });

//         // Thêm số dòng bằng với số lượng dòng dữ liệu cũ để chèn dữ liệu mới vào trên
//         worksheet.spliceRows(2, 0, ...Array(oldRowCount - 1).fill([]));

//         // Lưu vào file mới
//         await workbook.xlsx.writeFile(outputFile);

//         console.log(`Đã chèn dữ liệu thành công vào ${outputFile}`);
//     } catch (error) {
//         console.error('Đã xảy ra lỗi:', error);
//     }
// }

// // Gọi hàm chính
// main();



// const ExcelJS = require('exceljs');
// const path = require('path');

// // Đường dẫn tới file layoutXlsxFile.xlsx và newfile.xlsx
// const layoutFilePath = path.join(__dirname, 'layoutXlsxFile.xlsx');
// const newFilePath = path.join(__dirname, 'newfile.xlsx');

// // Hàm đọc layout file và trả về sheet thứ 2
// async function readLayoutFileAndGetSecondSheet() {
//     try {
//         const layoutWorkbook = new ExcelJS.Workbook();
//         await layoutWorkbook.xlsx.readFile(layoutFilePath);
//         const secondSheet = layoutWorkbook.getWorksheet(2);
//         if (secondSheet) {
//             return secondSheet;
//         } else {
//             throw new Error('Sheet not found in layout file.');
//         }
//     } catch (error) {
//         throw new Error('Error reading layout file:', error);
//     }
// }

// // Hàm chèn dữ liệu vào file newfile.xlsx
// async function insertDataToNewFile(dataToInsert) {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(newFilePath);
//     const worksheet = workbook.getWorksheet(1);

//     // Chèn từng hàng dữ liệu vào trước dòng đầu tiên của dữ liệu đã chèn
//     for (let i = 0; i < dataToInsert.length; i++) {
//         worksheet.spliceRows(2, 0, dataToInsert[i]);
//     }

//     // Lưu file Excel sau khi chèn dữ liệu mới
//     await workbook.xlsx.writeFile(newFilePath);
//     console.log('Dữ liệu mới đã được chèn vào file Excel thành công.');
// }

// // Hàm chính để thực hiện end-to-end
// async function main() {
//     try {
//         // Đọc sheet thứ 2 từ layout file
//         const secondSheet = await readLayoutFileAndGetSecondSheet();

//         // Lấy định dạng và dữ liệu từ sheet thứ 2
//         const dataToInsert = [];
//         secondSheet.eachRow((row, rowNumber) => {
//             if (rowNumber > 1) {
//                 const rowData = [];
//                 row.eachCell(cell => {
//                     rowData.push(cell.value);
//                 });
//                 dataToInsert.push(rowData);
//             }
//         });

//         // Chèn dữ liệu vào file newfile.xlsx
//         await insertDataToNewFile(dataToInsert);
//     } catch (error) {
//         console.error('Đã xảy ra lỗi:', error.message);
//     }
// }

// // Gọi hàm main để thực hiện end-to-end
// main();

// const ExcelJS = require('exceljs');
// const path = require('path');

// // Đường dẫn tới file layoutXlsxFile.xlsx và newfile.xlsx
// const layoutFilePath = path.join(__dirname, 'layoutXlsxFile.xlsx');
// const newFilePath = path.join(__dirname, 'newfile.xlsx');

// // Hàm đọc layout file và trả về sheet thứ 2
// async function readLayoutFileAndGetSecondSheet() {
//     try {
//         const layoutWorkbook = new ExcelJS.Workbook();
//         await layoutWorkbook.xlsx.readFile(layoutFilePath);
//         const secondSheet = layoutWorkbook.getWorksheet(2);
//         if (secondSheet) {
//             return secondSheet;
//         } else {
//             throw new Error('Sheet not found in layout file.');
//         }
//     } catch (error) {
//         throw new Error('Error reading layout file:', error);
//     }
// }

// // Hàm chèn dữ liệu vào file newfile.xlsx
// async function insertDataToNewFile(dataToInsert) {
//     const workbook = new ExcelJS.Workbook();
//     await workbook.xlsx.readFile(newFilePath);
//     const worksheet = workbook.getWorksheet(1);

//     // Lưu header và định dạng của nó
//     const headerRow = worksheet.getRow(1);

//     // Chèn từng hàng dữ liệu vào trước dòng đầu tiên của dữ liệu đã chèn
//     for (let i = 0; i < dataToInsert.length; i++) {
//         const rowData = dataToInsert[i];
//         const row = worksheet.addRow(rowData);

//         // Copy styles from header row
//         row.eachCell((cell, colNumber) => {
//             cell.style = Object.assign({}, headerRow.getCell(colNumber).style);
//         });
//     }

//     // Lưu file Excel sau khi chèn dữ liệu mới
//     await workbook.xlsx.writeFile(newFilePath);
//     console.log('Dữ liệu mới đã được chèn vào file Excel thành công.');
// }

// // Hàm chính để thực hiện end-to-end
// async function main() {
//     try {
//         // Đọc sheet thứ 2 từ layout file
//         const secondSheet = await readLayoutFileAndGetSecondSheet();

//         // Lấy định dạng và dữ liệu từ sheet thứ 2
//         const dataToInsert = [];
//         secondSheet.eachRow((row, rowNumber) => {
//             if (rowNumber > 1) {
//                 const rowData = [];
//                 row.eachCell(cell => {
//                     rowData.push(cell.value);
//                 });
//                 dataToInsert.push(rowData);
//             }
//         });

//         // Chèn dữ liệu vào file newfile.xlsx
//         await insertDataToNewFile(dataToInsert);
//     } catch (error) {
//         console.error('Đã xảy ra lỗi:', error.message);
//     }
// }

// // Gọi hàm main để thực hiện end-to-end
// main();
