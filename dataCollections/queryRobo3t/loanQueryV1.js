// Thực hiện câu truy vấn cho biết những người dùng nào quá hạn mà chưa trả

db.loans.find({
  "expectedReturnDate": { "$lt": new Date() },
  "transactionStatus": "Borrowed"
}).forEach(function(loan) {
var borrower = db.users.findOne({ _id: loan.borrower });
print("Người dùng quá hạn mà chưa trả: " + borrower.username); // Thay `.name` bằng trường dữ liệu tương ứng trong collection người dùng
});