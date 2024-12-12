$(document).ready(function () {
    $("#spinner").hide();
    const supplierTableBody = $("#supplierTableBody");
    const pagination = $("#pagination");
    const itemsPerPage = 5;
    let currentPage = 1;
    var filteredData = mockData; // Tạo một bản sao của dữ liệu để tìm kiếm

    function renderTable(page) {
        supplierTableBody.html("");
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        paginatedData.forEach((supplier, index) => {
            const row = `
          <tr>
              <td>${startIndex + index + 1}</td>
              <td>${supplier.name}</td>
              <td>${supplier.address}</td>
              <td>${supplier.phone}</td>
              <td>${supplier.email}</td>
              <td>
              <button class="btn badge bg-primary" onclick="showSupplierDetails(${
                  startIndex + index
              })">Sửa</button>
          </tr>
          `;
            supplierTableBody.append(row);
        });

        document.getElementById(
            "showingInfo"
        ).textContent = `Showing ${paginatedData.length} of ${filteredData.length} total Suppliers`;
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

    function deleteSupplier(index, supplierName) {
        // console.log(supplierName);
        var confirmation = confirm(
            "Bạn có chắc muốn xóa nhà cung cấp này?"
        );
        if (confirmation) {
            handleDelete(supplierName);
        }
    }

    window.showSupplierDetails = function (index) {
        // console.log(index);
        const supplier = filteredData[index];
        $("#name-holder").val(supplier.name);
        $("#name").val(supplier.name);
        $("#address").val(supplier.address);
        $("#phone").val(supplier.phone);
        $("#email").val(supplier.email);
        $("#supplierModal").modal("show");
    };

    function searchFunction() {
        const input = document
            .getElementById("searchInput")
            .value.toLowerCase();
        filteredData = mockData.filter(
            (supplier) =>
                supplier.name.toLowerCase().includes(input) ||
                supplier.address.toLowerCase().includes(input) ||
                supplier.phone.toLowerCase().includes(input) ||
                supplier.email.toLowerCase().includes(input)
        );
        currentPage = 1; // Reset về trang đầu tiên sau mỗi lần tìm kiếm
        renderTable(currentPage);
        renderPagination();
    }

    renderTable(currentPage);
    renderPagination();

    // Sự kiện tìm kiếm khi nhập vào ô tìm kiếm
    // $("#searchInput").on("input", searchFunction);
    $("#searchButton").on("click", searchFunction);
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
            url: "/suppliers/retrieve",
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
