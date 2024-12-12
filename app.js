
const express = require("express");
var fs = require('fs').promises;
const app = express();

// import .env
const dotenv = require('dotenv')
dotenv.config()

// Session
const session = require('express-session');

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));  

// Import các module cần thiết
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Connect mongodb
const mongodb = require('./models/db');

// Setting static folder
// Middleware để phục vụ các tệp tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'assets'), {
  // Cấu hình kiểu MIME cho tệp JavaScript
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// ==== Thiết lập Pug là công cụ mẫu cho Express ====
app.set('view engine', 'pug'); // Sử dụng Pug làm công cụ mẫu
app.set('views', './views'); // Đặt thư mục chứa các mẫu Pug

// Middleware cho bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Color
const colors = require('colors');

// Import routers
const authenToken = require("./modules/authServer");
const homeRouter = require('./routers/home.route')
const deviceRouter = require('./routers/device.route')
const userRouter = require('./routers/user.route')
const supplierRouter = require('./routers/suppliers.route')
const locationRouter = require('./routers/locations.route')
const deviceTypesRouter = require('./routers/deviceTypes.route')
const recordRouter = require('./routers/record.route')

app.use("/", homeRouter)
app.use("/device", deviceRouter);
app.use("/user", userRouter)
app.use("/suppliers", supplierRouter)
app.use("/locations", locationRouter)
app.use("/devicetypes", deviceTypesRouter)
app.use("/record", recordRouter)

// Route demo
app.get("/demo", (req, res) => {
  res.render("./contents/demo/paginationTemplate.pug", {
    title: 'Home page',
    routes: {
        'Home': '/',
        'Detail': '/device/report',
        'Create': '/device/create',
        'Loan': '/device/loan',
        'Return': '/device/return'
    }
});
})

async function listFilesWithExtension(directory, extensions) {
  try {
      // Kiểm tra xem directory có tồn tại không
      await fs.access(directory, fs.constants.F_OK);
    
      // Tách các phần mở rộng trong biến extensions
      const allowedExtensions = extensions.split(', ');
     
      // Lấy danh sách các file trong thư mục
      const files = await fs.readdir(directory);

      // Danh sách kết quả
      let resultList = [];

      // Lặp qua từng file
      for (const file of files) {
          const filePath = path.join(directory, file);
          // Kiểm tra thông tin về file
          const stats = await fs.stat(filePath);

          if (stats.isFile()) {
              // Lấy phần mở rộng của file
              const fileExtension = path.extname(file).slice(1);
              // Kiểm tra xem phần mở rộng có trong danh sách cho phép không
              if (allowedExtensions.includes(fileExtension.toLowerCase())) {
                  // Lấy thông tin về file
                  const fileInfo = {
                      name: file,
                      size: stats.size,
                      created: stats.birthtime
                  };
                  resultList.push(fileInfo);
              }
          }
      }
      return resultList;
  } catch (error) {
      console.log(error);
      throw new Error(`Thư mục '${directory}' không tồn tại.`);
  }
}

app.get('/api/v1/exports',authenToken.authenToken, async (req, res) => {
    const { role } = req.userId;
   
    if (role != 'admin') {
      return res.redirect('/404')
    }
    
    const directory = 'assets/public/csv/export';
    const extensions = 'xlsx, csv, xls, doc, docx';

    try {
      const result = await listFilesWithExtension(directory, extensions);
      // console.log(result[0]);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/api/v1/show',authenToken.authenToken, async (req, res) => {
    try {
      const { role } = req.userId;

      if (role != 'admin') {
          return res.redirect('/404')
      }

      res.render("./contents/exportFiles.pug", {
        title: 'Thiết bị',
        routes: {
            // 'Trang chủ': '/',
            // 'Thông tin thiết bị': '/device/report',
            // 'Tạo thiết bị': '/device/create',
            // 'Mượn thiết bị': '/device/loan',
            // 'Đã mượn': '/device/return',
            // 'Quản lý lịch sử mượn trả': '/record/loanrecord'
        },
      })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/v1/exports/:fileName',authenToken.authenToken, async (req, res) => {
    const directory = 'assets/public/csv/export';
    const fileName = req.params.fileName;
    const filePath = path.join(directory, fileName);
    try {
        await fs.unlink(filePath);
        res.json({ message: 'File deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: `Error deleting file: ${error.message}` });
    }
});

app.get('/api/v1/exports/:fileName/download',authenToken.authenToken, (req, res) => {
  const directory = 'assets/public/csv/export';
  const fileName = req.params.fileName;
  const filePath = path.join(directory, fileName);
  res.download(filePath, fileName);
});

const https = require('https');
var fsNoneAsync = require('fs');
// huet.devicemanage.com.vn
// Kết nối tới cổng máy chủ
const PORT = process.env.PORT || 443; // Sử dụng cổng mặc định 3100 nếu không được chỉ định
// const PORT = process.env.PORT || 80; // Sử dụng cổng mặc định 3100 nếu không được chỉ định

const options = {
  key: fsNoneAsync.readFileSync('./server.key'), // Path to your private key file
  cert: fsNoneAsync.readFileSync('./server.crt'), // Path to your certificate file
};
// const options = {}
// Create HTTPS server
const server = https.createServer(options, app);

// Listen on port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});