var updateCardCurrent;
var modalBody = document.getElementById("modalBody");

// Function to create device card
function createDeviceCard(device, index) {
    const card = document.createElement("div");
    card.classList.add("col");
    card.innerHTML = `
    <div class="card h-100">
    <p class="idDevice" hidden>${device._id}</p>
    <img style="height: 200px; ${device.imageUrl ? "object-fit: cover" : "object-fit: contain"}" src="${device.imageUrl ? device.imageUrl : '/public/images/image_placeholder.jpg'}" class="card-img-top" alt="Device Image">
    <div class="card-body">
    <h5 class="card-title">${device.name}</h5>
    <p class="card-text">Description: ${device.description}</p>
    <p class="card-text">Purchase Date: ${new Date(
        device.purchaseDate
    ).toLocaleDateString()}</p>
    <p class="card-text">Warranty Date: ${new Date(
        device.warrantyExpiry
    ).toLocaleDateString()}</p>
    <button type="button" style="background-color: #f16022; color: white;" class="btn w-100" data-bs-toggle="modal" data-bs-target="#exampleModal"  onclick="populateTable(event)">Trả thiết bị</button>
    </div>
    </div>
    `;
    return card;
}
// Function to render device cards
function renderDeviceCards(data) {
    const container = document.getElementById("deviceContainer");
    container.innerHTML = "";
    data.forEach((device, index) => {
        const card = createDeviceCard(device, index);
        container.appendChild(card);
    });
}
// Function to create sidebar with device types
function createDeviceTypeList(types) {
    const list = document.querySelectorAll("#deviceTypeList");
    list.forEach((i) => {
        i.innerHTML = "";
        types.forEach((type) => {
            const listItem = document.createElement("li");
            listItem.classList.add("list-group-item");
            listItem.textContent = type;
            listItem.addEventListener("click", () => filterDevicesByType(type));
            i.appendChild(listItem);
        });
    });
}
// Filter devices based on selected device type
function filterDevicesByType(type) {
    if (type === "All") {
        renderDeviceCards(mockData);
    } else {
        const filteredDevices = mockData.filter(
            (device) => device.deviceType === type
        );
        renderDeviceCards(filteredDevices);
    }
}
// Render all device types and devices on page load
window.onload = function () {
    createDeviceTypeList(["All", ...deviceTypes]); // Include 'all' option
    renderDeviceCards(mockData);
};

// Function to populate device loan table
function populateTable(event) {
    updateCardCurrent = event.target.parentElement.parentElement.parentElement
    const id = event.target.parentElement.parentElement.querySelector(".idDevice").textContent
    const device = mockData.find(item => item._id === id);
    modalBody.innerHTML = `
    <h3 class="card-title">${device.name}</h3>
    <img style="width: 100%; max-height: ${settingSizeImg.height}; object-fit: contain; margin-top: 30px" id="deviceImage" src="${device.imageUrl ? device.imageUrl : '/public/images/image_placeholder.jpg'}" alt="Tivi Image">
    <video style="width: 100%; height: 220px; object-fit: contain; margin-top: 30px" id="deviceVideo" controls ${device.videoUrl ? '' : 'hidden'}>
    <source src="${device.videoUrl}" type="video/mp4">
    Your browser does not support the video tag.
    </video>
    <p class="card-text"><strong>Loại:</strong> ${device.deviceType}</p>
    <p class="card-text"><strong>Vị trí:</strong> ${device.location}</p>
    <p class="card-text"><strong>Nhà cung cấp:</strong> ${device.supplier}</p>
    <p class="card-text"><strong>Mô tả:</strong> ${device.description}</p>
    <p class="card-text"><strong>Ngày mua:</strong> ${new Date(
        device.purchaseDate
    ).toLocaleDateString()}</p>
    <div class="mb-3"><label class="form-label" for="deviceUrlImg"><strong>Vui Lòng chụp ảnh minh chứng: </strong> (Hệ thống có lưu lại các hoạt động, vui lòng đọc kĩ hướng dẫn sử dụng)</label>
        <input class="form-control" id="deviceUrlImg" type="file" accept=".jpg, .jpeg, .png" />
        <div class="warrper text-center">
            <div class="spinner-border text-primary" id="spinner1" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <img class="img-fluid" id="imageRender" style="width: 100%; min-height: 500px; object-fit: cover;" src="" alt=""/>
        </div>
    </div>
    <div class="mb-3"><label class="form-label" for="deviceVideo"><strong>Vui lòng quay video minh chứng: </strong> (devices.videoUrl)</label>
        <input class="form-control" id="uploadDeviceVideo" type="file" accept="video/*" />
        <div class="warrper center-video">
            <div class="spinner-border text-primary" id="spinner2" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <video class="img-fluid" id="videoRender" controls="" style="width: 100%; min-height: 500px; display: none; " src=""><!-- Nếu trình duyệt không hỗ trợ video, thông báo sẽ hiển thị ở đây-->Tr&igrave;nh duy&#x1EC7;t c&#x1EE7;a b&#x1EA1;n kh&ocirc;ng h&#x1ED7; tr&#x1EE3; ph&aacute;t video.</video>
        </div>
    </div>
    <div class="d-flex justify-content-end"> <!-- Flex container for buttons -->
      <button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
      <button type="button" class="btn btn-warning" onclick="confirmLoan(event, '${device.serialNumber}')">Trả thiết bị</button>
    </div>
    `;

    $('#imageRender').hide()
    $('#spinner1').hide();
    $('#spinner2').hide();

    // const imageRender = document.querySelector('#imageRender');
    const videoRender = document.querySelector('#videoRender');

    var imageUrlValue = '';
    var videoUrlValue = '';

    $('#deviceUrlImg').on('change', function(event) {
        console.log('Upload img');
        var file = this.files[0];
        var maxSize = 10 * 1024 * 1024; // Giới hạn kích thước tập tin là 1MB
        if (file.size > maxSize) {
            alert('Kích thước ảnh tối thiểu 10mb.');
            this.value = ''; // Xóa lựa chọn tập tin
        } else {
            $('#imageRender').show()
            const fileName = $(this)[0].files[0].name;
            event.preventDefault();
            const formData = new FormData($(this).closest('form')[0]);
            formData.append('file', $(this)[0].files[0]);
            console.log(formData);
            // Show spinner
    
            uploadFile(formData, function(error, response) {
    
                if (error) {
                    console.error(error);
                } else {
                    imageUrlValue = response.data;
                    imageRender.src = response.data;
                    try {
                        localStorage.setItem('imageUrl', response.data);
                        document.getElementById('localStorageDataImage').value = localStorage.getItem('imageUrl');
                        // Hide spinner regardless of response status
                        $('#spinner1').hide()
                    } catch (e) {
                        console.error('LocalStorage error: ', e);
                    }
                }

            });
        }

        
    });

    $('#uploadDeviceVideo').on('change', function(event) {
        // console.log('Upload video');
        var file = this.files[0];
        console.log(file);
        var maxSize = 25 * 1024 * 1024; // Giới hạn kích thước tập tin là 100MB
        if (file.size > maxSize) {
            alert('Kích thước video tối thiểu 100mb.');
            this.value = ''; // Xóa lựa chọn tập tin
        } else {
            
            const fileName = $(this)[0].files[0].name;
            event.preventDefault();
            const formData = new FormData($(this).closest('form')[0]);
            formData.append('file', $(this)[0].files[0]);
            
            // Show spinner
            $('#spinner2').show()
    
            uploadFile(formData, function(error, response) {
                // Hide spinner regardless of response status
    
                if (error) {
                    console.error(error);
                } else {
                    videoRender.src = response.data;
                    videoRender.style.display = "flex";
                    try {
                        localStorage.setItem('videoUrl', response.data);
                        document.getElementById('localStorageDataVideo').value = localStorage.getItem('videoUrl');
                        $('#spinner2').hide()
                    } catch (e) {
                        console.error('LocalStorage error: ', e);
                    }
                }
            });

        }

    });

    // Function to upload file using AJAX
    function uploadFile(formData, callback) {
        $.ajax({
            url: '/uploads',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log('response: ', response);
                callback(null, response);
            },
            error: function(xhr, status, error) {
                callback(error);
            }
        });
    }
}

// Function to confirm loan
function confirmLoan(event, deviceId) {
    const parentElement = event.target.parentElement.parentElement
    const imageUrl = parentElement.querySelector('#imageRender').getAttribute("src");
    const videoUrl = parentElement.querySelector('#videoRender').getAttribute("src");
    if (imageUrl == '' || videoUrl == '') {
        alert('Vui lòng chụp ảnh và quay video minh chứng!')
        return;
    }

    
    // Hiện ảnh lên
    
    // Get a reference to your modal
    var cancelButton = document.querySelector('.btn-secondary[data-bs-dismiss="modal"]');

    const confirmed = confirm("Xác nhận bạn muốn trả thiết bị này?");
    if (confirmed) {
        // Gửi sự kiện click tới nút "Hủy"
        cancelButton.click();
        // Send device ID to loan route
        axios
            .post("/device/return", { 
                deviceId: deviceId,
                proofImageUrl: imageUrl,
                proofVideoUrl: videoUrl
             })
            .then((response) => {
                if (response.data.success) {
                    alert("Trả thiết bị thành công!");

                    updateCardCurrent.style.display = 'none'
                } else {
                    alert(
                        "Trả thiết bị không thành công, vui lòng liên hệ admin để giải quyết vấn đề."
                    );
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}


$(document).ready(function () {
    const deviceContainer = $("#deviceContainer");
    const pagination = $("#pagination");
    const itemsPerPage = 12;
    let currentPage = 1;
    let filteredData = mockData.slice(); // Create a copy of mockData for searching

    // Function to render device cards
    function renderDeviceCards(data) {
        deviceContainer.html("");
        data.forEach((device, index) => {
            const card = createDeviceCard(device, index);
            deviceContainer.append(card);
        });
    }

    // Function to render pagination
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
            renderDeviceCards(getCurrentPageData());
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
            renderDeviceCards(getCurrentPageData());
            renderPagination();
        } else {
            alert('Trang không tồn tại');
        }
    }
    
    window.goToPage = goToPage

    // Function to highlight current page in pagination
    function highlightCurrentPage() {
        const pages = pagination.find(".page-item");
        pages.removeClass("active");
        pages.eq(currentPage - 1).addClass("active");
    }

    // Function to filter devices based on search input
    function searchFunction() {
        const input = $("#searchInput").val().trim().toLowerCase();
        filteredData = mockData.filter(
            (device) =>
            device?.name?.toLowerCase().includes(input) ||
            device?.description?.toLowerCase().includes(input) ||
            device?.purchaseDate?.toLowerCase().includes(input) ||
            device?.deviceType?.toLowerCase().includes(input) ||
            device?.location?.toLowerCase().includes(input) ||
            device?.supplier?.toLowerCase().includes(input)
        );
        currentPage = 1; // Reset to the first page after each search
        renderDeviceCards(getCurrentPageData());
        renderPagination();
    }

    // Function to get data for the current page
    function getCurrentPageData() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }

    // Event listener for search button click
    $("#searchButton").on("click", searchFunction);

    // Initial render
    renderDeviceCards(getCurrentPageData());
    renderPagination();

});

