

// $(".progress-bar").loading();
$(document).ready(function() {

    // Ensure the knob plugin is loaded before attempting to use it
    if ($.fn.knob) {
      // Initialize the knob
      $(".dial").knob({
        readOnly: true,
        draw: function () {
            $(this.i).val(this.cv + "%");
        },
    });
    } else {
      console.error("jQuery Knob plugin not loaded properly.");
    }
  });
  const pagination = $("#pagination");
  const itemsPerPage = 5;
  let currentPage = 1;
  var filteredData = arrUserIdsNotReturned; // Make a copy of the data to search
  
  function renderUserList() {
      var userList = $("#table1-body");
      userList.html(''); // Clear previous content
  
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
  
      paginatedData.forEach(function (userObj, index) {
          var user = userObj.user;
          var numDevice = userObj.numDevice;
          var row = `
              <tr>
                  <td>${startIndex + index + 1}</td>
                  <td>${user.fullname}</td>
                  <td>${user.username}</td>
                  <td>${user.email}</td>
                  <td style="display: flex; align-items: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 12px;"><!-- !Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc-->
                          <path fill="#f16022"
                              d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z">
                          </path>
                      </svg>
                      <a style="color:#f16022; text-decoration: none; margin-left: 10px;" href="tel:${user.phone}">${user.phone}</a>
                  </td>
                  <td>${numDevice}</td>
              </tr>
          `;
          userList.append(row);
      });
  
      document.getElementById("showingInfo").textContent = `Showing ${paginatedData.length} of ${filteredData.length} totals`;
  }
  
  function renderPagination() {
      pagination.html('');
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      const maxVisiblePages = 5; // Maximum number of visible page links
      const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfMaxVisiblePages);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      if (currentPage > halfMaxVisiblePages + 1) {
          pagination.append(createPaginationLink(1, "First"));
          pagination.append(createPaginationEllipsis());
      }
      for (let i = startPage; i <= endPage; i++) {
          pagination.append(
              createPaginationLink(i, i.toString(), i === currentPage)
          );
      }
      if (totalPages - endPage > 1) {
          pagination.append(createPaginationEllipsis());
          pagination.append(createPaginationLink(totalPages, "Last"));
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
      a.href = "#!";
      a.textContent = text;
      a.addEventListener("click", () => {
          currentPage = pageNumber;
          renderUserList();
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
  
  function searchFunction() {
      const input = $("#searchInput").val().toLowerCase();
      filteredData = arrUserIdsNotReturned.filter(
          (userObj) =>
              userObj.user.fullname.toLowerCase().includes(input) ||
              userObj.user.username.toLowerCase().includes(input) ||
              userObj.user.email.toLowerCase().includes(input) ||
              userObj.user.phone.toLowerCase().includes(input)
      );
      currentPage = 1; // Reset to the first page after each search
      renderUserList();
      renderPagination();
  }
  
  $("#searchButton").on("click", searchFunction);
  $("#searchInput").on("input", (event) => {
      const btnSearch = document.querySelector('#searchButton')
      if (!event.target.value) {
          btnSearch.click()
      }
  });
  
  renderUserList();
  renderPagination();
  
  // Render second table
  const pagination1 = $("#pagination1");
  const itemsPerPage1 = 5;
  let currentPage1 = 1;
  var filteredData1 = arrDeviceIdsDue; // Make a copy of the data to search
  
  function renderLoanList() {
      var loanList = $("#loan-list");
      loanList.html(''); // Clear previous content
  
      const startIndex1 = (currentPage1 - 1) * itemsPerPage1;
      const endIndex1 = startIndex1 + itemsPerPage1;
      const paginatedData1 = filteredData1.slice(startIndex1, endIndex1);
  
      paginatedData1.forEach(function (loan, index) {
          var row = `
              <tr>
                  <td>${startIndex1 + index + 1}</td>
                  <td>${loan.fullname}</td>
                  <td>${loan.borrower}</td>
                  <td>${loan.device}</td>
                  <td style="display: flex; align-items: center;">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 12px;"><!-- !Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc-->
                          <path fill="#f16022"
                              d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z">
                          </path>
                      </svg>
                      <a style="color: #f16022 ;text-decoration: none; margin-left: 10px;" href="tel:${loan.phone}">${loan.phone}</a>
                  </td>
                  <td>${new Date(loan.borrowedAt).toLocaleString()}</td>
                  <td>${new Date(loan.expectedReturnDate).toLocaleDateString()}</td>
              </tr>
          `;
          loanList.append(row);
      });
  
      document.getElementById("showingInfo1").textContent = `Showing ${paginatedData1.length} of ${filteredData1.length} totals`;
  }
  
  function renderPagination1() {
      pagination1.html('');
      const totalPages1 = Math.ceil(filteredData1.length / itemsPerPage1);
      const maxVisiblePages1 = 5; // Maximum number of visible page links
      const halfMaxVisiblePages1 = Math.floor(maxVisiblePages1 / 2);
      let startPage1 = Math.max(1, currentPage1 - halfMaxVisiblePages1);
      let endPage1 = Math.min(totalPages1, startPage1 + maxVisiblePages1 - 1);
      if (endPage1 - startPage1 + 1 < maxVisiblePages1) {
          startPage1 = Math.max(1, endPage1 - maxVisiblePages1 + 1);
      }
      if (currentPage1 > halfMaxVisiblePages1 + 1) {
          pagination1.append(createPaginationLink1(1, "First"));
          pagination1.append(createPaginationEllipsis1());
      }
      for (let i = startPage1; i <= endPage1; i++) {
          pagination1.append(
              createPaginationLink1(i, i.toString(), i === currentPage1)
          );
      }
      if (totalPages1 - endPage1 > 1) {
          pagination1.append(createPaginationEllipsis1());
          pagination1.append(createPaginationLink1(totalPages1, "Last"));
      }
  }
  
  function createPaginationLink1(pageNumber, text, isActive = false) {
      const li = document.createElement("li");
      li.className = "page-item";
      if (isActive) {
          li.classList.add("active");
      }
      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#!";
      a.textContent = text;
      a.addEventListener("click", () => {
          currentPage1 = pageNumber;
          renderLoanList();
          renderPagination1();
      });
      li.appendChild(a);
      return li;
  }
  
  function createPaginationEllipsis1() {
      const li = document.createElement("li");
      li.className = "page-item disabled";
      const span = document.createElement("span");
      span.className = "page-link";
      span.textContent = "...";
      li.appendChild(span);
      return li;
  }
  
  function searchFunction1() {
      const input = $("#searchInput1").val().toLowerCase();
      filteredData1 = arrDeviceIdsDue.filter(
          (loan) =>
              loan.fullname.toLowerCase().includes(input) ||
              loan.borrower.toLowerCase().includes(input) ||
              loan.device.toLowerCase().includes(input) ||
              loan.phone.toLowerCase().includes(input)
      );
      currentPage1 = 1; // Reset to the first page after each search
      renderLoanList();
      renderPagination1();
  }
  
  $("#searchButton1").on("click", searchFunction1);
  $("#searchInput1").on("input", (event) => {
      const btnSearch = document.querySelector('#searchButton1')
      if (!event.target.value) {
          btnSearch.click()
      }
  });
  
  renderLoanList();
  renderPagination1();