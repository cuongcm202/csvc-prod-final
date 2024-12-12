

    // ReadHeaderFileXlsx.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    //     // Bỏ qua hàng đầu tiên (nếu rowIndex = 1)
    //     if (rowIndex !== 1) {
    //         const rowValues = [];
    //         row.eachCell({ includeEmpty: true }, (cell) => {
    //             rowValues.push(cell.value);
    //         });
    //         rowI.push(rowValues);
    //     }
    // });

    // async function main() {
    //     const ExcelJS = require('exceljs');
    //     const moment = require('moment');
    
    //     // Get header file xlsx
    //     const headerFileXlsx = new ExcelJS.Workbook();
    //     await headerFileXlsx.xlsx.readFile('headerXlsxFile.xlsx');
    //     const ReadHeaderFileXlsx = headerFileXlsx.getWorksheet(1);
    
    //     // Get footer
    //     const footerFileXlsx = new ExcelJS.Workbook();
    //     await footerFileXlsx.xlsx.readFile('footerXlsxFile.xlsx');
    //     const ReadFooterFileXlsx = footerFileXlsx.getWorksheet(1);
    
    //     // Đọc dữ liệu từ file excel ban đầu (myfile.xlsx)
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.readFile('myfile.xlsx');
    
    //     // Sao chép dữ liệu từ hai sheet
    //     const rowI = [];
    
    //     for (let i = 1; i <= 16; i++) {
    //         const rowValues = [];
    //         ReadHeaderFileXlsx.getRow(i).eachCell({ includeEmpty: true }, (cell) => {
    //             const newCell = {
    //                 value: cell.value,
    //                 style: cell.style // Chỉ sao chép định dạng của cell
    //                 // Bạn có thể chọn các thuộc tính định dạng cụ thể bạn cần sao chép
    //             };
    //             rowValues.push(newCell);
    //         });
    //         rowI.push(rowValues);
    //     }
    
    //     workbook.eachSheet((worksheet, sheetId) => {
    //         worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    //             // Bỏ qua hàng đầu tiên (nếu là sheet đầu tiên và rowIndex = 1)
    //             if (!(sheetId === 1 && rowIndex === 1)) {
    //                 const rowValues = [];
    //                 row.eachCell({ includeEmpty: true }, (cell) => {
    //                     rowValues.push(cell.value);
    //                 });
    //                 rowI.push(rowValues);
    //             }
    //         });
    //     });
    
    //     ReadFooterFileXlsx.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    //         // Bỏ qua hàng đầu tiên (nếu rowIndex = 1)
    //         if (rowIndex !== 1) {
    //             const rowValues = [];
    //             row.eachCell({ includeEmpty: true }, (cell) => {
    //                 rowValues.push(cell.value);
    //             });
    //             rowI.push(rowValues);
    //         }
    //     });
    
    //     // Tạo một workbook mới và chèn dữ liệu đã lọc vào
    //     const newWorkbook = new ExcelJS.Workbook();
    //     const newWorksheet = newWorkbook.addWorksheet('Sheet1');
    
    //     // Chèn thêm 7 hàng trống phía trên dữ liệu
    //     for (let i = 1; i <= 7; i++) {
    //         newWorksheet.addRow([]);
    //     }
    
    //     // Chèn dữ liệu đã lọc vào
    //     rowI.forEach((rowValues) => {
    //         newWorksheet.addRow(rowValues);
    //     });
    
    //     // Lưu file excel mới
    //     const timestamp = moment().format('YYYYMMDDTHHmmss');
    //     const newFileName = `newMyFile-${timestamp}.xlsx`;
    //     await newWorkbook.xlsx.writeFile(newFileName);
    
    //     console.log(`File ${newFileName} đã được tạo.`);
    // }
    
    // main().catch(console.error);

    // async function main() {
    //     const ExcelJS = require('exceljs');
    //     const moment = require('moment');
    
    //     // Get header file xlsx
    //     const headerFileXlsx = new ExcelJS.Workbook();
    //     await headerFileXlsx.xlsx.readFile('headerXlsxFile.xlsx');
    //     const ReadHeaderFileXlsx = headerFileXlsx.getWorksheet(1);
    
    //     // Get footer
    //     const footerFileXlsx = new ExcelJS.Workbook();
    //     await footerFileXlsx.xlsx.readFile('footerXlsxFile.xlsx');
    //     const ReadFooterFileXlsx = footerFileXlsx.getWorksheet(1);
    
    //     // Đọc dữ liệu từ file excel ban đầu (myfile.xlsx)
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.readFile('myfile.xlsx');
    
    //     // Sao chép dữ liệu từ hai sheet
    //     const rowI = [];
    
    //     // Copy header data
    //     for (let i = 1; i <= 16; i++) {
    //         const rowValues = [];
    //         ReadHeaderFileXlsx.getRow(i).eachCell({ includeEmpty: true }, (cell) => {
    //             if (cell.value !== null) {
    //                 rowValues.push(cell.value);
    //             }
    //         });
    //         rowI.push(rowValues);
    //     }
    
    //     // Copy data from workbook sheets
    //     workbook.eachSheet((worksheet, sheetId) => {
    //         worksheet.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    //             // Skip first row (if it's the first sheet and rowIndex = 1)
    //             if (!(sheetId === 1 && rowIndex === 1)) {
    //                 const rowValues = [];
    //                 row.eachCell({ includeEmpty: true }, (cell) => {
    //                     rowValues.push(cell.value);
    //                 });
    //                 rowI.push(rowValues);
    //             }
    //         });
    //     });
    
    //     // Copy footer data
    //     ReadFooterFileXlsx.eachRow({ includeEmpty: true }, (row, rowIndex) => {
    //         // Skip first row (if rowIndex = 1)
    //         if (rowIndex !== 1) {
    //             const rowValues = [];
    //             row.eachCell({ includeEmpty: true }, (cell) => {
    //                 rowValues.push(cell.value);
    //             });
    //             rowI.push(rowValues);
    //         }
    //     });
    
    //     // Create a new workbook and insert copied data
    //     const newWorkbook = new ExcelJS.Workbook();
    //     const newWorksheet = newWorkbook.addWorksheet('Sheet1');
    
    //     // Insert copied data
    //     rowI.forEach((rowValues) => {
    //         newWorksheet.addRow(rowValues);
    //     });
    
    //     // Save the new excel file
    //     const timestamp = moment().format('YYYYMMDDTHHmmss');
    //     const newFileName = `newMyFile-${timestamp}.xlsx`;
    //     await newWorkbook.xlsx.writeFile(newFileName);
    
    //     console.log(`File ${newFileName} đã được tạo.`);
    // }
    
    // main().catch(console.error);
    
    

    // === formatted data

    // async function main() {
    //     const ExcelJS = require('exceljs');
    
    //     // Get header file xlsx
    //     const headerFileXlsx = new ExcelJS.Workbook();
    //     await headerFileXlsx.xlsx.readFile('headerXlsxFile.xlsx');
    //     const ReadHeaderFileXlsx = headerFileXlsx.getWorksheet(1);
    
    //     // Get footer
    //     const footerFileXlsx = new ExcelJS.Workbook();
    //     await footerFileXlsx.xlsx.readFile('footerXlsxFile.xlsx');
    //     const ReadFooterFileXlsx = footerFileXlsx.getWorksheet(1);
    
    //     // Đọc dữ liệu từ file excel ban đầu (myfile.xlsx)
    //     const workbook = new ExcelJS.Workbook();
    //     await workbook.xlsx.readFile('myfile.xlsx');
    
    //     // Sao chép dữ liệu từ hai sheet
    //     workbook.eachSheet((worksheet, sheetId) => {
    //         const newWorkbook = new ExcelJS.Workbook();
    //         const newWorksheet = newWorkbook.addWorksheet('Sheet1');
    
    //         // Copy header data
    //         if (sheetId === 1) {
    //             ReadHeaderFileXlsx.eachRow({ includeEmpty: true }, (row) => {
    //                 row.eachCell({ includeEmpty: true }, (cell) => {
    //                     newWorksheet.getCell(cell.address).value = cell.value;
    //                     newWorksheet.getCell(cell.address).style = cell.style;
    //                 });
    //             });
    //         }
    
    //         // Copy data from workbook sheets
    //         worksheet.eachRow({ includeEmpty: true }, (row) => {
    //             row.eachCell({ includeEmpty: true }, (cell) => {
    //                 newWorksheet.getCell(cell.address).value = cell.value;
    //                 newWorksheet.getCell(cell.address).style = cell.style;
    //             });
    //         });
    
    //         // Copy footer data
    //         if (sheetId === 1) {
    //             ReadFooterFileXlsx.eachRow({ includeEmpty: true }, (row) => {
    //                 row.eachCell({ includeEmpty: true }, (cell) => {
    //                     newWorksheet.getCell(cell.address).value = cell.value;
    //                     newWorksheet.getCell(cell.address).style = cell.style;
    //                 });
    //             });
    //         }
    
    //         // Save the new workbook to a file
    //         newWorkbook.xlsx.writeFile(`newfile_${sheetId}.xlsx`).then(() => {
    //             console.log(`newfile_${sheetId}.xlsx has been created successfully.`);
    //         }).catch((error) => {
    //             console.error(`Error occurred while writing newfile_${sheetId}.xlsx:`, error);
    //         });
    //     });
    // }
    
    // main().catch(console.error);

    // === Copy header with style working
    const ExcelJS = require('exceljs');
    const fs = require('fs');

    // Tên file Excel ban đầu và file mới cần tạo
    const inputFile = 'headerXlsxFile.xlsx';
    const outputFile = 'newfile.xlsx';

    // Tạo workbook mới
    const workbook = new ExcelJS.Workbook();

    // Đọc file Excel ban đầu
    workbook.xlsx.readFile(inputFile)
        .then(() => {
            // Lấy sheet đầu tiên
            const worksheet = workbook.getWorksheet(1);

            // Lưu header và định dạng của nó
            const headerRow = worksheet.getRow(1);
            
            const rowI = worksheet.getRow(2);
            

            // Copy định dạng và text từ header sang rowI
            headerRow.eachCell((cell, colNumber) => {
                const cellI = rowI.getCell(colNumber);
                cellI.value = cell.value;
                cellI.style = Object.assign({}, cell.style);
            });

            // Lưu vào file mới
            return workbook.xlsx.writeFile(outputFile);
        })
        .then(() => {
            console.log(`Đã lưu thành công vào ${outputFile}`);
        })
        .catch((error) => {
            console.error('Đã xảy ra lỗi:', error);
        });

























        
    // const ExcelJS = require('exceljs');
    // const fs = require('fs');
    // const inputFile = 'headerXlsxFile.xlsx';
    // const outputFile = 'newfile.xlsx';
    
    // // Hàm để cập nhật rowI từ headerRow và trả về mảng dữ liệu từ headerRow
    // async function updateRowWithHeader(inputFile, outputFile) {
    //     // Tạo workbook mới
    //     const workbook = new ExcelJS.Workbook();
    
    //     try {
    //         // Đọc file Excel ban đầu
    //         await workbook.xlsx.readFile('layoutXlsxFile.xlsx');
    
    //         // Lấy header từ sheet đầu tiên
    //         const headerWorksheet = workbook.getWorksheet(1);
    //         // Lưu header và định dạng của nó
    //         const headerRow = worksheet.getRow(1);

    //         // Lấy header từ sheet đầu tiên
    //         const footerWorksheet = workbook.getWorksheet(2);
    //         // Lưu header và định dạng của nó
    //         const footerRow = worksheet.getRow(1);


    //         // const rowI = worksheet.getRow(2);
    
    //         // const rowData = [];
    
    //         // Copy định dạng và text từ header sang rowI
    //         headerRow.eachCell((cell, colNumber) => {
    //             const cellI = rowI.getCell(colNumber);
    //             cellI.value = cell.value;
    //             cellI.style = Object.assign({}, cell.style);
    //         });
    
    //         // Lưu vào file mới
    //         await workbook.xlsx.writeFile(outputFile);
            
    //         // Trả về mảng dữ liệu từ header
    //         return ;
    //     } catch (error) {
    //         console.error('Error occurred:', error);
    //         return []; // Trả về mảng rỗng nếu có lỗi
    //     }
    // }

    // updateRowWithHeader(inputFile, outputFile)

    // const ExcelJS = require('exceljs');

    // async function generateNewFile() {
    //     const workbook = new ExcelJS.Workbook();
    //     const layoutXlsxFile = await workbook.xlsx.readFile('layoutXlsxFile.xlsx');
    
    //     // Step 1: Read the headerRow from sheet 1
    //     const sheet1 = layoutXlsxFile.getWorksheet(1);
    //     const headerRow = sheet1.getRow(1).values;
    
    //     // Step 2: Read the footerRow from sheet 2
    //     const sheet2 = layoutXlsxFile.getWorksheet(2);
    //     const footerRow = sheet2.getRow(1).values;
    
    //     // Step 3: Create myData array
    //     const myData = [
    //         { tenSanPham: 'Sữa chua', maSanPham: 'SP001', soLuong: 10, donGia: 5000, tongTien: 50000 },
    //         // Add other data as specified
    //     ];
    
    //     // Step 4: Combine header, myData, and footer into a single array
    //     const combinedData = [headerRow, ...myData.map(item => Object.values(item)), footerRow];
    
    //     // Step 5: Write combinedData into newfile.xlsx
    //     const newWorkbook = new ExcelJS.Workbook();
    //     const newSheet = newWorkbook.addWorksheet('Sheet 1');
    //     combinedData.forEach(row => {
    //         newSheet.addRow(row);
    //     });
    
    //     // Step 6: Save the new Excel file
    //     await newWorkbook.xlsx.writeFile('newfile.xlsx');
    // }
    
    // generateNewFile()
    //     .then(() => console.log('New file generated successfully.'))
    //     .catch(error => console.error('Error generating new file:', error));



    // ======
    // const ExcelJS = require('exceljs');
    // const fs = require('fs');
    // const inputFile = 'headerXlsxFile.xlsx';
    // const outputFile = 'newfile.xlsx';
    
    // // Hàm để cập nhật rowI từ headerRow và trả về mảng dữ liệu từ headerRow
    // async function updateRowWithHeader(inputFile, outputFile) {
    //     // Tạo workbook mới
    //     const workbook = new ExcelJS.Workbook();
    
    //     try {
    //         // Đọc file Excel ban đầu
    //         await workbook.xlsx.readFile(inputFile);
    
    //         // Lấy sheet đầu tiên
    //         const worksheet = workbook.getWorksheet(1);
    
    //         // Lưu header và định dạng của nó
    //         const headerRow = worksheet.getRow(1);
    //         const rowI = worksheet.getRow(2);
    
    //         const rowData = [];
    
    //         // Copy định dạng và text từ header sang rowI
    //         headerRow.eachCell((cell, colNumber) => {
    //             const cellI = rowI.getCell(colNumber);
    //             cellI.value = cell.value;
    //             cellI.style = Object.assign({}, cell.style);
    
    //             // Lưu dữ liệu từ header vào mảng
    //             rowData.push(cell.value);
    //         });
    
    //         // Lưu vào file mới
    //         await workbook.xlsx.writeFile(outputFile);
    //         console.log(rowData);
    //         // Trả về mảng dữ liệu từ header
    //         return rowData;
    //     } catch (error) {
    //         console.error('Error occurred:', error);
    //         return []; // Trả về mảng rỗng nếu có lỗi
    //     }
    // }

    // updateRowWithHeader(inputFile, outputFile)

//     const ExcelJS = require('exceljs');
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
//     .then(() => {
//         console.log('Dữ liệu đã được thêm vào file Excel thành công.');

//         // Chèn thêm 7 hàng phía trên dữ liệu đã chèn
//         // const worksheet = workbook.getWorksheet(1);
//         // const dataToInsert = [
//         //     ['New Data 1', 'ND001', 1, 1000, 1000],
//         //     ['New Data 2', 'ND002', 2, 2000, 4000],
//         //     ['New Data 3', 'ND003', 3, 3000, 9000],
//         //     ['New Data 4', 'ND004', 4, 4000, 16000],
//         //     ['New Data 5', 'ND005', 5, 5000, 25000],
//         //     ['New Data 6', 'ND006', 6, 6000, 36000],
//         //     ['New Data 7', 'ND007', 7, 7000, 49000]
//         // ];

//         // // Chèn từng hàng dữ liệu vào trước dòng đầu tiên của dữ liệu đã chèn
//         // for (let i = 0; i < dataToInsert.length; i++) {
//         //     worksheet.spliceRows(2, 0, dataToInsert[i]);
//         // }

//         // Lưu file Excel sau khi chèn dữ liệu mới
//         return workbook.xlsx.writeFile(path.join(__dirname, 'newfile.xlsx'));
//     })
//     .then(() => {
//         console.log('Dữ liệu mới đã được chèn vào file Excel thành công.');
//     })
//     .catch(err => {
//         console.error('Đã xảy ra lỗi:', err);
//     });

// ===========


//     const ExcelJS = require('exceljs');

// // Tên file Excel ban đầu và file mới cần tạo
// const headerFile = 'headerXlsxFile.xlsx';
// const footerFile = 'footerXlsxFile.xlsx';
// const outputFile = 'newfile.xlsx';

// // Tạo workbook mới
// const workbook = new ExcelJS.Workbook();

// // Biến lưu nội dung header và footer
// let headerContent = null;
// let footerContent = null;

// // Đọc header file
// workbook.xlsx.readFile(headerFile)
//     .then(() => {
//         // Lấy sheet đầu tiên
//         const worksheet = workbook.getWorksheet(1);

//         // Lưu header và định dạng của nó
//         headerContent = worksheet.getRow(1).values;
//     })
//     .then(() => {
//         // Đọc footer file
//         return workbook.xlsx.readFile(footerFile);
//     })
//     .then(() => {
//         // Lấy sheet đầu tiên
//         const worksheet = workbook.getWorksheet(1);

//         // Lưu footer và định dạng của nó
//         footerContent = worksheet.getRow(1).values;

//         // Tạo workbook mới cho file output
//         const outputWorkbook = new ExcelJS.Workbook();

//         // Tạo worksheet cho file output
//         const outputWorksheet = outputWorkbook.addWorksheet('Sheet1');

//         // Ghi header vào file mới
//         outputWorksheet.addRow(headerContent);

//         // Ghi footer vào file mới
//         outputWorksheet.addRow(footerContent);

//         // Lưu file mới
//         return outputWorkbook.xlsx.writeFile(outputFile);
//     })
//     .then(() => {
//         console.log(`Đã lưu thành công vào ${outputFile}`);
//     })
//     .catch((error) => {
//         console.error('Đã xảy ra lỗi:', error);
//     });
