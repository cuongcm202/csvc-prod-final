
// const fs = require('fs');
// const path = require('path');

// // Function to export data to a CSV file
// function exportFileCSV(title, data, outputPath) {
//     return new Promise((resolve, reject) => {

//         // Convert data to CSV format
//         const csvData = convertToCSV(data);

//         // Full path for the CSV file
//         const csvFilePath = path.join(outputPath, `${title}.csv`);

//         // Write data to CSV file
//         fs.writeFile(csvFilePath, csvData, (err) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(csvFilePath);
//             }
//         });
//     });
// }

// // Function to convert data to CSV format
// function convertToCSV(data) {
//     let csvData = '';

//     // Loop through each object in the data array
//     data.forEach((row) => {
//         // Loop through the properties of the object
//         Object.values(row).forEach((value, index) => {
//             // Add comma if not first element in row
//             if (index > 0) {
//                 csvData += ',';
//             }
//             // Add value of property to CSV string
//             csvData += `"${value}"`;
//         });
//         // Add newline character after each row
//         csvData += '\n';
//     });

//     return csvData;
// }

// module.exports = {
//     exportFileCSV
// }

const fs = require('fs');
const path = require('path');

// Function to export data to a CSV file
async function exportFileCSV(title, data, outputPath) {
    try {
        // Convert data to CSV format
        const csvData = convertToCSV(data);

        // Full path for the CSV file
        const csvFilePath = path.join(outputPath, `${title}.csv`);

        // Write data to CSV file
        await fs.promises.writeFile(csvFilePath, csvData);

        return csvFilePath;
    } catch (err) {
        throw err;
    }
}

// Function to convert data to CSV format
function convertToCSV(data) {
    let csvData = '';

    // Loop through each object in the data array
    data.forEach((row) => {
        // Loop through the properties of the object
        Object.values(row).forEach((value, index) => {
            // Add comma if not first element in row
            if (index > 0) {
                csvData += ',';
            }
            // Add value of property to CSV string
            csvData += `"${value}"`;
        });
        // Add newline character after each row
        csvData += '\n';
    });

    return csvData;
}

module.exports = {
    exportFileCSV
}