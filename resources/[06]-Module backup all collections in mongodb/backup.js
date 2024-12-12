const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const ExcelJS = require('exceljs');
const moment = require('moment');

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/CSVC', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Google Drive API setup
const credentialsPath = path.join(__dirname, 'credentials.json');
const tokenPath = path.join(__dirname, 'token.json');

const auth = new OAuth2(
    'YOUR_CLIENT_ID', 
    'YOUR_CLIENT_SECRET', 
    'YOUR_REDIRECT_URI'
);

const token = JSON.parse(fs.readFileSync(tokenPath));
auth.setCredentials(token);

const drive = google.drive({ version: 'v3', auth });

// Function to get all collections' data
async function getCollectionsData() {
    const client = mongoose.connection.getClient();
    const db = client.db('CSVC');
    const collections = await db.listCollections().toArray();
    const dataPromises = collections.map(async (collection) => {
        const name = collection.name;
        // Define a Mongoose model dynamically
        const Model = mongoose.model(name, new mongoose.Schema({}, { strict: false }), name);
        const docs = await Model.find({}).lean().exec();
        return { name, docs };
    });
    return Promise.all(dataPromises);
}

// Function to create an Excel file with a timestamp
async function createExcelFile(data) {
    const timestamp = moment().format('MM-DD-YYYY-HH-mm');
    const fileName = `backup-${timestamp}.xlsx`;
    const filePath = path.join(__dirname, fileName);

    const workbook = new ExcelJS.Workbook();

    for (const collection of data) {
        const worksheet = workbook.addWorksheet(collection.name);
        
        if (collection.docs.length > 0) {
            // Create header
            worksheet.columns = Object.keys(collection.docs[0]).map(key => ({ header: key, key }));
            
            // Add rows
            worksheet.addRows(collection.docs);
        }
    }

    await workbook.xlsx.writeFile(filePath);

    console.log(`Excel file created at ${filePath}`);
    return filePath;
}

// Function to upload the file to Google Drive
async function uploadToDrive(filePath) {
    const fileMetadata = {
        name: path.basename(filePath),
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

// Main function to backup and upload data
(async () => {
    try {
        const collectionsData = await getCollectionsData();
        const filePath = await createExcelFile(collectionsData);
        await uploadToDrive(filePath);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
