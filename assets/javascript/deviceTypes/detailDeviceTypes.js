$(document).ready(function () {
    $("#spinner").hide();
    const tableBody = $("#deviceTypesTableBody");
    const pagination = $("#pagination");
    const itemsPerPage = 5;
    let currentPage = 1;
    let filteredData = mockData.slice(); // Tạo một bản sao của dữ liệu để tìm kiếm

    function renderTable(page) {
        tableBody.html("");
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        paginatedData.forEach((deviceType, index) => {
            const row = `
                <tr>
                    <td>${startIndex + index + 1}</td>
                    <td>${deviceType.name}</td>
                    <td>${deviceType.description}</td>
                    <td>
                        <button class="btn badge bg-primary" onclick="showDeviceTypeDetails('${deviceType.name}')">Sửa</button>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });

        document.getElementById(
            "showingInfo"
        ).textContent = `Showing ${paginatedData.length} of ${filteredData.length} total Device Types`;
    }

    function renderPagination() {
        const pagination = document.getElementById("pagination");
        pagination.innerHTML = "";
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const maxVisiblePages = 5; // Maximum number of visible page links
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
        const pageInput = document.getElementById('pageInput').value;
        if (pageInput >= 1 && pageInput <= Math.ceil(filteredData.length / itemsPerPage)) {
            currentPage = parseInt(pageInput);
            renderTable(currentPage);
            renderPagination();
        } else {
            alert('Trang không tồn tại');
        }
    }

    window.goToPage = goToPage

    function highlightCurrentPage() {
        const pages = pagination.find(".page-item");
        pages.removeClass("active");
        pages.eq(currentPage - 1).addClass("active");
    }

    window.showDeviceTypeDetails = function (deviceTypeName) {
        const deviceType = filteredData.find((dt) => dt.name === deviceTypeName);
        const modalBody = $("#deviceTypeModal .modal-body");
        modalBody.html(`
            <form id="deviceTypeForm" action="/devicetypes/update" method="post">
                <div class="mb-3">
                    <input name="nameholder" type="text" class="form-control" hidden readonly value="${deviceType.name}" required>
                    <label for="nameInput" class="form-label">Tên</label>
                    <input name="name" type="text" class="form-control" id="nameInput" value="${deviceType.name}" required>
                </div>
                <div class="mb-3">
                    <label for="descriptionInput" class="form-label">Mô tả</label>
                    <textarea name="description" class="form-control" id="descriptionInput">${deviceType.description}</textarea>
                </div>
                <button class="btn btn-primary w-100" type="submit">Sửa</button>
            </form>
        `);
        $("#deviceTypeModal").modal("show");
    };

    function searchFunction() {
        const input = $("#searchInput").val().trim().toLowerCase();
        filteredData = mockData.filter(deviceType =>
            deviceType.name.toLowerCase().includes(input) ||
            deviceType.description.toLowerCase().includes(input)
        );
        currentPage = 1;
        renderTable(currentPage);
        renderPagination();
    }

    renderTable(currentPage);
    renderPagination();

    // Sự kiện tìm kiếm khi nhập vào ô tìm kiếm
    // $("#searchInput").on("input", searchFunction);
    $('#searchButton').on('click', searchFunction);
    $("#searchInput").on("input", (event) => {
        const btnSearch = document.querySelector('#searchButton')
        if (!event.target.value) {
            btnSearch.click()
        }
    });
    const tempMockData = mockData;
    $(".switchRetrieveAllData").change(function () {
        // Check if the checkbox is checked
        if ($(this).is(":checked")) {
            // If checked, do something
            retrieveDeviceTypesData();
        } else {
            // If not checked, do something else
            mockData = tempMockData;
            searchFunction();
        }
    });

    function retrieveDeviceTypesData(callback) {
        $("#spinner").show();
        $.ajax({
            url: "/devicetypes/retrieve",
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
