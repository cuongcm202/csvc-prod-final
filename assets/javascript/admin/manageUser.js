
var updateRoleUserCurrent;
const itemsPerPage = 5;
let currentPage = 1;
let filteredData = mockData;
function renderTable(page) {
    const tableBody = document.getElementById("user-table");
    tableBody.innerHTML = "";
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    paginatedData.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
    <td>
        <span class="userName-Info">${user.username}</span>
    </td>

    <td class="user-role">${
        user.role == "admin"
            ? '<span class="me-2 badge bg-danger">Admin</span><span class="me-2 badge bg-warning text-dark">Moderator</span><span class="me-2 badge bg-success">Guest</span>'
            : `${
                  user.role == "moderator"
                      ? `<span class="me-2 badge bg-warning text-dark">Moderator</span><span class="me-2 badge bg-success">Guest</span>`
                      : `<span class="me-2 badge bg-success">Guest</span>`
              }`
    }</td>
    <td>
    <button class="btn badge bg-primary" onclick="openEditModal(event, '${user.fullname}', '${
        user.username
    }', '${user.email}', '${user.password}', '${user.phone}', '${user.role}')">Edit</button>
    <button class="btn badge bg-danger">Delete</button>
    </td>
    `;
        tableBody.appendChild(row);
    });
    document.getElementById(
        "showingInfo"
    ).textContent = `Showing ${paginatedData.length} of ${filteredData.length} total Users`;
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

function searchFunction() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    filteredData = mockData.filter(
        (user) =>
            user.username.toLowerCase().includes(input) ||
            user.role.toLowerCase().includes(input)
    );
    currentPage = 1;
    renderTable(currentPage);
    renderPagination();
}
function openEditModal(event, fullname, username, email, password, phone, role) {
    updateRoleUserCurrent = event.target.parentElement.parentElement.querySelector('.user-role')
    
    document.getElementById("editUsername").value = username;
    document.getElementById("editUserFullName").value = fullname;
    document.getElementById("editEmail").value = email;
    document.getElementById("editPassword").value = password;
    document.getElementById("editPhone").value = phone;
    document.getElementById("wrapperEditRole").innerHTML = `
    <label class="form-label" for="editRole">Role</label>
    <select ${role == 'admin' ? 'hidden' : ''} id="editRole" class="form-select" aria-label="Default select example" name='role'>
        ${role == 'admin' ? '<option value="admin"></option>' : `
            <option value="moderator" ${
                role == "moderator" ? "selected" : ""
            }>Moderator</option>
            <option value="user" ${role == "guest" ? "selected" : ""}>Guest</option>
        `}
    </select>
    `;
    $("#editUserModal").modal("show");
}
renderTable(currentPage);
renderPagination();
$("#searchButton").on("click", searchFunction);

async function editUser(event) {
    try {
        event.preventDefault();

        const userInfoRow = updateRoleUserCurrent

        const cancelButton = document.querySelector('.btn-close[data-bs-dismiss="modal"]')
        // Assuming formData is an object containing form data
        const formData = {
            username: document.getElementById("editUsername").value,
            fullname: document.getElementById("editUserFullName").value,
            email: document.getElementById("editEmail").value,
            password: document.getElementById("editPassword").value,
            phone: document.getElementById("editPhone").value,
            role: document.getElementById("editRole").value
        };
        await axios.post("/user/update", formData)
        .then((response) => {
            // Handle success
            
            if (response.data.success == true) {
                
                if (formData.role == 'moderator') {
                    userInfoRow.innerHTML = `
                        <span class="me-2 badge bg-warning text-dark">Moderator</span><span class="me-2 badge bg-success">Guest</span>
                    `
                } else {
                    userInfoRow.innerHTML = `
                        <span class="me-2 badge bg-success">Guest</span>
                    `
                }

                cancelButton.click()
                
                alert('Cập nhật trạng thái người dùng thành công!')
                window.location.assign(window.location.origin  + '/user/manage');
                
            } else {
                alert('Có lỗi xảy ra khi cập nhật trạng thái người dùng.')
            }
        })
        .catch((error) => {
            // Handle error
            console.error(error);
        });
    } catch (error) {
        throw error;
    }
};

$("#btnSubmit").on("click", editUser);
$("#searchInput").on("input", (event) => {
    const btnSearch = document.querySelector('#searchButton')
    if (!event.target.value) {
        btnSearch.click()
    }
});