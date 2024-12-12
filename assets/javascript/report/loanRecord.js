

$(document).ready(function () {
    $("#spinner").hide();
    const loanTableBody = $("#loanTableBody");
    const pagination = $("#pagination");
    const itemsPerPage = 5;
    let currentPage = 1;
    let filteredData = mockData.slice(); // Create a copy of mockData for searching
    function renderTable(page) {
        loanTableBody.html("");
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        paginatedData.forEach((record, index) => {
            const row = `
            <tr>
            <td>${startIndex + index + 1}</td>
            <td>${record.device}</td>
            <td>
                <span class="userName-Info">${record.username}</span>                
            </td>
            <td>${record.borrowedAt}</td>
            <td>${record.expectedReturnDate}</td>
            <td>${record.actualReturnDate ? record.actualReturnDate : "-"}</td>
            <td>${record.transactionStatus}</td>
            <td>
            <button class="btn badge bg-primary" onclick="showRecordDetails(${
                startIndex + index
            })">Xem</button>
            </td>
            </tr>
            `;
            loanTableBody.append(row);
        });

        document.getElementById(
            "showingInfo"
        ).textContent = `Showing ${paginatedData.length} of ${filteredData.length} total Devices`;
    }

    function renderPagination() {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const maxVisiblePages = 3; // Maximum number of visible page links
        const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        if (currentPage > halfMaxVisiblePages + 1) {
            pagination.appendChild(createPaginationLink(1, "First"));
            pagination.appendChild(createPaginationEllipsis());
        }
        for (let i = startPage; i <= endPage; i++) {
            pagination.appendChild(
                createPaginationLink(i, i.toString(), i === currentPage)
            );
        }
        if (totalPages - endPage > 1) {
            pagination.appendChild(createPaginationEllipsis());
            pagination.appendChild(createPaginationLink(totalPages, "Last"));
        }
    }

    function createPaginationLink(pageNumber, text, isActive = false) {
        const li = document.createElement("li");
        li.className = "page-item";
        if (isActive) {
            li.classList.add("active");
        }
        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.textContent = text;
        a.addEventListener("click", () => {
            currentPage = pageNumber;
            renderTable(currentPage);
            renderPagination();
        });
        li.appendChild(a);
        return li;
    }

    function createPaginationEllipsis() {
        const li = document.createElement("li");
        li.className = "page-item disabled";
        const span = document.createElement("span");
        span.className = "page-link";
        span.textContent = "...";
        li.appendChild(span);
        return li;
    }

    function goToPage() {
        const pageInput = document.getElementById("pageInput").value;
        if (
            pageInput >= 1 &&
            pageInput <= Math.ceil(filteredData.length / itemsPerPage)
        ) {
            currentPage = parseInt(pageInput);
            renderTable(currentPage);
            renderPagination();
        } else {
            alert("Trang không tồn tại");
        }
    }

    window.goToPage = goToPage;
    function highlightCurrentPage() {
        const pages = pagination.find(".page-item");
        pages.removeClass("active");
        pages.eq(currentPage - 1).addClass("active");
    }

    window.showRecordDetails = function (index) {
        const record = filteredData[index];
        $("#btnCallUser").attr('href', 'tel:' + record.phone)
        $("#btnSendMailUser").attr('href', 'mailto:' + record.email)
        $("#device").val(record.device);
        $("#username").val(record.username);
        $("#fullname").val(record.fullname);
        $("#borrowedAt").val(record.borrowedAt);
        $("#expectedReturnDate").val(record.expectedReturnDate);
        $("#actualReturnDate").val(record.actualReturnDate);
        $("#transactionStatus").val(record.transactionStatus);

        document.querySelector('.form-image').innerHTML = `
        <img style="width: 100%; height: 220px; object-fit: contain;" id="deviceImage" src="${record.proofImageUrl ? record.proofImageUrl : '/public/images/image_placeholder.jpg'}" alt="Proof Image">
        `
        document.querySelector('.form-video').querySelector("#deviceVideo")?.remove()
        
        if (record.proofVideoUrl != undefined || record.proofVideoUrl != null) {
            document.querySelector('.form-video').innerHTML = `
            <video style="width: 100%; height: 220px; object-fit: contain;" id="deviceVideo" controls style="display: none;">
            <source src="${record.proofVideoUrl}" type="video/mp4">
            Your browser does not support the video tag.
            </video>
            `
        }

        $("#recordModal").modal("show");
    };

    function searchFunction() {
        const input = $("#searchInput").val().trim().toLowerCase();
        filteredData = mockData.filter(
            (record) =>
                record.device.toLowerCase().includes(input) ||
                record.username.toLowerCase().includes(input) ||
                record.borrowedAt.toLowerCase().includes(input) ||
                (record.actualReturnDate &&
                    record.actualReturnDate.toLowerCase().includes(input)) ||
                record.transactionStatus.toLowerCase().includes(input)
        );
        currentPage = 1; // Reset to the first page after each search
        renderTable(currentPage);
        renderPagination();
    }

    renderTable(currentPage);
    renderPagination();

    $("#searchButton").on("click", searchFunction);

    var tempMockData = mockData;
    $(".switchRetrieveAllData").change(function () {
        // Check if the checkbox is checked
        if ($(this).is(":checked")) {
            // If checked, do something
            retrieveSupplierData();
        } else {
            // If not checked, do something else
            mockData = tempMockData;
            searchFunction();
        }
    });

    function retrieveSupplierData(callback) {
        $("#spinner").show();
        $.ajax({
            url: "/record/loan/retrieveall",
            method: "GET",
            success: function (data) {
                mockData = data.data;
                $("#spinner").hide();
                searchFunction();
            },
            error: function (xhr, status, error) {
                // Xử lý lỗi
                console.error("Error:", status, error);
            },
        });
    }
});


// $(document).ready(function() {
//     document.getElementById('downloadBtn').addEventListener('click', function() {
//         axios.post('/xlsx/download', { filename: 'Loans.xlsx' }, { responseType: 'blob' })
//             .then(function(response) {
//                 const timestamp = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 15); // Tạo timestamp theo định dạng YYYYMMDDTHHMMSS
//                 const filename = 'Loans-' + timestamp + '.xlsx'; // Tạo tên file mới
//                 // Tạo một URL tạm thời từ dữ liệu blob để tạo ra liên kết tải xuống
//                 const url = window.URL.createObjectURL(new Blob([response.data]));
//                 const link = document.createElement('a');
//                 link.href = url;
//                 // Đặt tên file tải xuống
//                 link.setAttribute('download', filename);
//                 // Thêm link vào DOM và kích hoạt sự kiện click để bắt đầu tải xuống
//                 document.body.appendChild(link);
//                 link.click();
//                 // Xóa URL tạm thời sau khi tải xuống hoàn tất
//                 window.URL.revokeObjectURL(url);
//             })
//             .catch(function(error) {
//                 // Xử lý lỗi nếu có
//                 console.error('Lỗi khi gửi yêu cầu:', error);
//             });
//     });
// });