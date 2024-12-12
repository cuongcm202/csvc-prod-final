const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const pathFolderWorking = '/assets/public/csv'

async function exportHeaderLayout(inputFile, outputFile) {
    // inputfile = '/assets/public/csv'/layout/headerXlsxFile.xlsx
    // output file = /assets/public/csv/export/[nametable]-YYYYMMDDTHHmmss.xlsx
    

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
    
            return workbook.xlsx.writeFile(outputFile);
        })
        .then(() => {
            // console.log(`Đã lưu thành công vào ${outputFile}`);
            return;
        })
        .catch((error) => {
            console.error('Đã xảy ra lỗi:', error);
            return;
        });

}


async function exportDataToXlsxFile(tableNames, headerRowOrigin, headerRow, myData, inputFile) {
    // console.log(headerRowOrigin);
    // console.log(myData);
    // myData = [tensp,masp,soluong,dongia,v.v]
    // inputFile cần chèn và sao lưu lại
    // inputFile = /assets/public/csv/export/[nametable]-YYYYMMDDTHHmmss.xlsx

    const workbook = new ExcelJS.Workbook();

    workbook.xlsx.readFile(inputFile)
        .then(() => {
            const worksheet = workbook.getWorksheet(1);

            // Add header
            worksheet.addRow(headerRow);
            // console.log(myData);
            // Thêm dữ liệu từ mảng myData vào file Excel
            switch (tableNames) {
                case 'Loans':
                        myData.forEach(data => {
                        var { idRecord, device, borrower, borrowedAt, expectedReturnDate, actualReturnDate, transactionStatus } = data;
                        worksheet.addRow([idRecord, device, borrower, borrowedAt, expectedReturnDate, actualReturnDate, transactionStatus]);    
                        })
                        break;
                        
                    case 'Devices':
                        // console.log(data);
                        // var { name, serialNumber, createDate, quantity, price } = data;
                        // if (quantity == undefined) return '';
                        // worksheet.addRow([name, serialNumber, createDate, quantity, price ]);    
                        // break;

                        // const rowData = [];
                        // headerRowOrigin.forEach(key => {
                        //     // if (data[key] == 'Active') {data[key] = 'Hoạt động'}
                        //     rowData.push(data[key] || ''); // Lấy giá trị từ data hoặc để trống nếu không tồn tại
                        // });
                        // console.log(rowData);
                        
                        // worksheet.addRow(rowData);
                        const deviceMap = new Map();
                        let totalPrice = myData.map(item => parseInt(item.price));
                        let totalDepreciation = myData.map(item => parseInt(item.depreciation));
                        let totalRemainValue = myData.map(item => parseInt(item.remainValue));
                        let totalQuantity = 0;

                        totalPrice = totalPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                        totalDepreciation = totalDepreciation.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                        totalRemainValue = totalRemainValue.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                        
                        myData.forEach((data, index) => {
                            const { name, serialNumber, purchaseDate, price, depreciation, remainValue } = data;
                            
                            if (!deviceMap.has(name)) {
                              deviceMap.set(name, {
                                quantity: 1,
                                price: parseInt(price),
                                purchaseDate: new Date(purchaseDate).getFullYear(),
                                depreciation: parseInt(depreciation),
                                remainValue: parseInt(remainValue),
                                index: deviceMap.size + 1
                              });
                            } else {
                              const device = deviceMap.get(name);
                              device.quantity += 1;
                              device.price += parseInt(price);
                              device.depreciation += parseInt(depreciation)
                              device.remainValue += parseInt(remainValue)
                            }

                            totalQuantity += 1;
                          });
                        //   console.log(deviceMap);
                        // console.log(totalQuantity);
                          deviceMap.forEach((device, name) => {
                            const rowData = [
                              device.index,
                              name,
                              '', // Mã số
                              device.purchaseDate, // Năm
                              device.quantity,
                              device.price,
                              device.remainValue, // Nguyên giá
                              device.quantity,
                              device.price,
                              device.remainValue, // Nguyên giá
                              device.quantity,
                              device.price,
                              device.remainValue, // Nguyên giá,
                              device.depreciation
                            ];
                            // console.log(rowData);
                            worksheet.addRow(rowData);
                        });
                        const rowTotal = [
                            '',      'Cộng',
                            '',     '',
                            totalQuantity,      totalPrice,
                            totalRemainValue,     totalQuantity,
                            totalPrice, totalRemainValue,
                            totalQuantity,      totalPrice,
                            totalRemainValue,     totalDepreciation
                          ]
                        worksheet.addRow(rowTotal);

                        // Add header row
                        // worksheet.getRow(1).values = headerRowOrigin;
                        
                    default: 
                        break;

                }

                return workbook.xlsx.writeFile(inputFile);
            })

            // Lưu file Excel
        
        .then(() => {
            // console.log('Dữ liệu đã được thêm vào file Excel thành công.');
    
            // // Chèn thêm 7 hàng phía trên dữ liệu đã chèn
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
            return workbook.xlsx.writeFile(inputFile);
        })
        .then(() => {
            // console.log('Dữ liệu mới đã được chèn vào file Excel thành công.');
        })
        .catch(err => {
            console.error('Đã xảy ra lỗi:', err);
        });
}


module.exports = {
    exportHeaderLayout,
    exportDataToXlsxFile
}