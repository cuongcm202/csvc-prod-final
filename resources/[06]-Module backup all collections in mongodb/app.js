const fs = require('fs');
const ExcelJS = require('exceljs');
const { google } = require('googleapis');
const path = require('path');
const { OAuth2 } = google.auth;

// Replace with your data
const data = [
    { name: 'John Doe', email: 'john.doe@example.com', age: 30 },
    { name: 'Jane Smith', email: 'jane.smith@example.com', age: 25 }
];

const credentialsPath = path.join(__dirname, 'credentials.json');
const tokenPath = path.join(__dirname, 'token.json');

// Create an Excel file
async function createExcelFile() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Age', key: 'age', width: 10 }
    ];

    worksheet.addRows(data);

    const filePath = path.join(__dirname, 'data.xlsx');
    await workbook.xlsx.writeFile(filePath);
    
    console.log(`Excel file created at ${filePath}`);
    return filePath;
}

// Upload the file to Google Drive
async function uploadToDrive(filePath) {
    const auth = new OAuth2(
        'YOUR_CLIENT_ID', 
        'YOUR_CLIENT_SECRET', 
        'YOUR_REDIRECT_URI'
    );

    const token = JSON.parse(fs.readFileSync(tokenPath));
    auth.setCredentials(token);

    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: 'data.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
    const media = {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        body: fs.createReadStream(filePath)
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });
        console.log('File uploaded to Drive with ID:', response.data.id);
    } catch (error) {
        console.error('Error uploading file:', error.message);
    }
}

(async () => {
    try {
        const filePath = await createExcelFile();
        await uploadToDrive(filePath);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
