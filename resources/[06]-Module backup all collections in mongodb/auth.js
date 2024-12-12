const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
const { OAuth2 } = google.auth;
const readline = require('readline');

const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath));

const { client_id, client_secret, redirect_uris } = credentials.web;

const oAuth2Client = new OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.file']
});

console.log('Authorize this app by visiting this url:', authUrl);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the code from that page here: ', async (code) => {
    rl.close();

    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        fs.writeFileSync('token.json', JSON.stringify(tokens));
        console.log('Token stored to token.json');
    } catch (error) {
        console.error('Error retrieving access token', error);
    }
});
