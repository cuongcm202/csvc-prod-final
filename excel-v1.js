// const fs = require('fs');
// const xlsx = require('xlsx');

// // Function to generate the formatted timestamp
// function getFormattedTimestamp() {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     const day = String(now.getDate()).padStart(2, '0');
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const seconds = String(now.getSeconds()).padStart(2, '0');
//     return `${year}${month}${day}-${hours}${minutes}${seconds}`;
// }

// // Hàm đọc file excel và chỉnh sửa dữ liệu
// function editExcelFile(fileName) {
//     // Đọc file Excel
//     const workbook = xlsx.readFile(fileName);
    
//     // Lấy ra sheet đầu tiên trong workbook
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
    
//     // Đọc dữ liệu từ hàng thứ 2
//     const row2 = [];
//     for (let i = 1; i <= 3; i++) {
//         const cell = worksheet[xlsx.utils.encode_cell({r: 1, c: i})];
//         row2.push(cell ? cell.v : '');
//     }

//     // Chèn thêm một hàng vào phía sau hàng thứ 2
//     const newRow = [];
//     for (let i = 1; i <= 3; i++) {
//         const cell = worksheet[xlsx.utils.encode_cell({r: 2, c: i})];
//         newRow.push(cell ? cell.v : '');
//     }

//     // Chuyển đổi số thứ tự hàng từ 0-based sang 1-based
//     const currentRowCount = worksheet['!ref'].split(':').pop().match(/\d+/)[0];
//     const newRowIndex = parseInt(currentRowCount) + 1;

//     // Chèn dữ liệu mới vào hàng mới
//     newRow.forEach((value, index) => {
//         const cellAddress = xlsx.utils.encode_cell({ r: newRowIndex, c: index });
//         worksheet[cellAddress] = { t: 'n', v: value };
//     });

//     // Cập nhật phạm vi của sheet
//     worksheet['!ref'] = `A1:C${parseInt(currentRowCount) + 1}`;

//     // Lưu trữ dữ liệu của row2 vào hàng mới được chèn phía trên
//     row2.forEach((value, index) => {
//         const cellAddress = xlsx.utils.encode_cell({ r: newRowIndex - 1, c: index });
//         worksheet[cellAddress] = { t: 'n', v: value };
//     });

//     // Tạo workbook mới từ các thay đổi
//     const newWorkbook = xlsx.utils.book_new();
//     xlsx.utils.book_append_sheet(newWorkbook, worksheet, sheetName);

//     // Lưu file mới
//     const timestamp = getFormattedTimestamp();
//     const newFileName = `new${fileName.split('.')[0]}-${timestamp}.xlsx`;
//     xlsx.writeFile(newWorkbook, newFileName);

//     console.log(`File mới đã được tạo: ${newFileName}`);
// }

// // Sử dụng hàm để chỉnh sửa file Excel
// const fileName = 'myfile.xlsx';
// editExcelFile(fileName);

const fs = require('fs');
const xlsx = require('xlsx');

// Function to read Excel file and edit data
function editExcelFile(fileName) {
    // Read the Excel file
    const workbook = xlsx.readFile(fileName);
    
    // Get the first sheet in the workbook
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Step 2: Extract the data from the second row
    const row2Data = [];
    for (let i = 1; i <= 3; i++) {
        const cell = worksheet[xlsx.utils.encode_cell({r: 1, c: i})];
        row2Data.push(cell ? cell.v : '');
    }

    // Step 3: Insert a new row with the copied data
    const rowCount = worksheet['!ref'].split(':').pop().match(/\d+/)[0];
    const newRowNumber = parseInt(rowCount) + 1;

    for (let i = 1; i <= 3; i++) {
        const cellAddress = xlsx.utils.encode_cell({ r: newRowNumber, c: i });
        worksheet[cellAddress] = { t: 'n', v: row2Data[i - 1] };
    }

    // Step 4: Update the range of the worksheet
    worksheet['!ref'] = `A1:C${parseInt(rowCount) + 1}`;

    // Create a new workbook and write the modified data
    const newWorkbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(newWorkbook, worksheet, sheetName);

    // Generate new file name
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..*/, '');
    const newFileName = `new${fileName.split('.')[0]}-${timestamp}.xlsx`;

    // Write the new Excel file
    xlsx.writeFile(newWorkbook, newFileName);

    console.log(`New file created: ${newFileName}`);
}

// Usage: Edit Excel file
const fileName = 'myfile.xlsx';
editExcelFile(fileName);
