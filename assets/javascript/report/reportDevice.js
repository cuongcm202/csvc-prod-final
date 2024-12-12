function forLoopArrayTypeReturnOpt(arrayTypeVietSub, arrayTypeOrigin, key) {
    var stringOption = '';
    arrayTypeVietSub.forEach((element, index) => {
        // console.log(element)
        var stringTemp = `<option value="${arrayTypeOrigin[index]}" ${element === key ? 'selected' : ''}>${element}</option>`
        stringOption += stringTemp
    });

    return stringOption
}


function convertDateTime(isoDateString) {
    const dateObject = new Date(isoDateString);

    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero based
    const year = dateObject.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate
}
// Constants for pagination
const itemsPerPage = 10; // Number of items per page
let currentPage = 1; // Current page

// Render pagination
function renderPagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(mockData.devices.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        pagination.appendChild(createPaginationLink(i, i.toString(), i === currentPage));
    }
}

// Create pagination link
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
        populateTable(mockData.devices, currentPage, itemsPerPage);
        renderPagination();
    });
    li.appendChild(a);
    return li;
}

// Function to populate device loan table
function populateTable(devices) {
    var tableBody = document.getElementById("deviceLoanTableBody");
    tableBody.innerHTML = ""; // Clear previous content

    // Calculate start and end index for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, devices.length);

    for (let i = startIndex; i < endIndex; i++) {
        var device = devices[i];
        var row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${device.name}</td>
            <td>${device.deviceType}</td>
            <td>${device.status}</td>
            <td>${device.initStatus}</td>
            <td>${device.location}</td>
            <td>${convertDateTime(device.purchaseDate)}</td>
            <td>${convertDateTime(device.warrantyExpiry)}</td>
            <td>
                <span class="btn badge bg-success" onclick="detailDevice(event, ${i})">Detail</span>
                <span class="btn badge bg-warning" onclick="updateDevice(event, ${i})">Update</span>
                <span class="btn badge bg-danger" onclick="deleteDevice(event, ${i}, '${device.serialNumber}')">Delete</span>
            </td>
        `;
        tableBody.appendChild(row);
    }
}
// Initial population of table
populateTable(mockData.devices);
renderPagination(); // Render pagination

// Detail function
function detailDevice(event, index) {
    const openModalBtn = document.getElementById('openModalBtn');
    const deviceModal = new bootstrap.Modal(document.getElementById('deviceModal'));
    // Sample device information
    populateModal(mockData.devices[index]); // Populate modal with device information
    deviceModal.show(); // Show modal
    // Event listener to close modal when clicked outside
    deviceModal._element.addEventListener('click', function(event) {
        if (event.target === deviceModal._element) {
            deviceModal.hide();
        }
    });
}
// Function to populate modal with device information
function populateModal(deviceInfo) {
    const modalBody = document.getElementById('modalBody');
    // Construct HTML to display device information
    modalBody.innerHTML = `
<div class="row">
<div class="col-md-6">
<div class="video-container">
<h2>Hình ảnh và video</h2>
<img style="width: 100%; max-height: ${settingSizeImg.height}; object-fit: contain;" id="deviceImage" src="${deviceInfo.imageUrl ? deviceInfo.imageUrl : '/public/images/image_placeholder.jpg'}" alt="Tivi Image">
${deviceInfo.videoUrl ? `
<video style="width: 100%; max-height: ${settingSizeVideo.height}; object-fit: contain; margin-top: 40px;" id="deviceVideo" controls style="display: none;">
<source src="${deviceInfo.videoUrl}" type="video/mp4">
Your browser does not support the video tag.
</video>
` : ''}
</div>
</div>
<div class="col-md-6">
<div class="device-info">
<div class="container">
<div class="row">
  <div class="col">
    <h2>Thông tin thiết bị</h2>
    <table class="table">
      <tbody>
        <tr>
          <th scope="row">ID:</th>
          <td>${deviceInfo.serialNumber}</td>
        </tr>
        <tr>
          <th scope="row">Tên:</th>
          <td>${deviceInfo.name}</td>
        </tr>
        <tr>
          <th scope="row">Loại:</th>
          <td>${deviceInfo.deviceType}</td>
        </tr>
        <tr>
          <th scope="row">Tình trạng:</th>
          <td>${deviceInfo.status}</td>
        </tr>
        <tr>
          <th scope="row">Vị trí:</th>
          <td>${deviceInfo.location}</td>
        </tr>
        <tr>
          <th scope="row">Giá:</th>
          <td>${deviceInfo.price ? deviceInfo.price : '-'}</td>
        </tr>
        <tr>
          <th scope="row">Mô tả:</th>
          <td>${deviceInfo.description}</td>
        </tr>
        <tr>
          <th scope="row">Ngày mua:</th>
          <td>${convertDateTime(deviceInfo.purchaseDate)}</td>
        </tr>
        <tr>
          <th scope="row">Hết hạn bảo hành:</th>
          <td>${convertDateTime(deviceInfo.warrantyExpiry)}</td>
        </tr>
        <tr>
          <th scope="row">Tỷ lệ khấu hao:</th>
          <td>${deviceInfo.depreciationRate}%</td>
        </tr>
        <tr>
          <th scope="row">Ngày thêm thiết bị:</th>
          <td>${convertDateTime(deviceInfo.createDate)}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</div>
</div>
</div>
<div class="col-md-12 text-center">

</div>
</div>
`;
}
// Update function
function updateDevice(event, index) {
    const openModalBtn = document.getElementById('openModalBtn');
    const deviceModal = new bootstrap.Modal(document.getElementById('deviceModal'));
    updateRenderDevice(mockData.devices[index]); // Populate modal with device information
    deviceModal.show(); // Show modal
    // Event listener to close modal when clicked outside
    deviceModal._element.addEventListener('click', function(event) {
        if (event.target === deviceModal._element) {
            deviceModal.hide();
        }
    });
}

function updateRenderDevice(deviceInfo) {
    const modalBody = document.getElementById('modalBody');
    var purchaseDateParts = convertDateTime(deviceInfo.purchaseDate).split('/'); // Split the date string into parts
    var purchaseDate = purchaseDateParts[2] + '-' + purchaseDateParts[1] + '-' + purchaseDateParts[0];
    var warrantyExpiryParts = convertDateTime(deviceInfo.warrantyExpiry).split('/'); // Split the date string into parts
    var warrantyExpiry = warrantyExpiryParts[2] + '-' + warrantyExpiryParts[1] + '-' + warrantyExpiryParts[0];
    modalBody.innerHTML = `
<form action="/device/update" method="post" enctype="application/json" id="updateDeviceForm">
<div class="mb-3 center">
    <h1>Cập nhật thiết bị</h1>
</div>
<div class="mb-3">
<input value="${deviceInfo.serialNumber}" name="serialNumber" hidden>
<label for="name" class="form-label">Tên thiết bị</label>
<input value="${deviceInfo.name}" type="text" class="form-control" id="name" name="name" placeholder="Enter device name">
</div>
<div class="mb-3">
<label for="type" class="form-label">Loại thiết bị</label>
<select class="form-select" id="deviceType" name="deviceType" required>
    ${forLoopArrayTypeReturnOpt(devicetypes, devicetypes, deviceInfo.deviceType)}
</select>
</div>
<div class="mb-3">
<label for="deviceStatus" class="form-label">Trạng thái thiết bị: </label>
<select class="form-select" id="deviceStatus" name="status" required>
    ${forLoopArrayTypeReturnOpt(['Hoạt động', 'Đang sửa chữa', 'Bị hỏng'], ['Active', 'Repair', 'Damaged'], deviceInfo.status)}
</select>
</div>
<div class="mb-3">
    <label class="form-label" for="deviceUrlImg">&#x1EA2;nh thi&#x1EBF;t b&#x1ECB;: </label>
    <div class="input-group">
        <input class="form-control" id="deviceUrlImg" type="file" />
        <button class="btn btn-outline-danger" type="button" onClick="
            handleDeleteFile(document.querySelector('#imageRender').getAttribute('src'))
        ">Xóa</button>
    </div>
    <div class="warrper text-center">
        <div class="spinner-border text-primary" id="spinner1" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <img class="img-fluid" id="imageRender" style="max-width: 100%" src="${deviceInfo.imageUrl}" alt="" ${!deviceInfo.imageUrl ? 'hidden' : ''}/></div>
</div>
<div class="mb-3">
<label class="form-label" for="deviceVideo">Video thi&#x1EBF;t b&#x1ECB;: </label>
<div class="input-group">
    <input class="form-control" id="deviceVideo" type="file" accept="video/*" />
    <button class="btn btn-outline-danger" type="button" onClick="
        handleDeleteFile(document.querySelector('#videoRender').getAttribute('src'))
    ">Xóa</button>
</div>
    <div class="warrper center-video">
        <div class="spinner-border text-primary" id="spinner2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <video src="${deviceInfo.videoUrl}" class="img-fluid" id="videoRender" controls="" style="max-width: 100%" ${!deviceInfo.videoUrl ? 'hidden' : ''}><!-- Nếu trình duyệt không hỗ trợ video, thông báo sẽ hiển thị ở đây-->Tr&igrave;nh duy&#x1EC7;t c&#x1EE7;a b&#x1EA1;n kh&ocirc;ng h&#x1ED7; tr&#x1EE3; ph&aacute;t video.</video></div>
</div>
<div class="mb-3">
<label for="location" class="form-label">Vị trí</label>
<select class="form-select" id="location" name="location" required>
    ${forLoopArrayTypeReturnOpt(locations, locations, deviceInfo.location)}
</select>
</div>
<div class="mb-3">
<label for="supplier" class="form-label">Nhà cung cấp</label>
<select class="form-select" id="supplier" name="supplier" required>
    ${forLoopArrayTypeReturnOpt(suppliers, suppliers,deviceInfo.supplier)}
</select>
</div>
<div class="mb-3">
<label for="purchaseDate" class="form-label">Ngày mua</label>
<input value="${purchaseDate}" type="date" class="form-control" name="purchaseDate" id="purchaseDate">
</div>
<div class="mb-3">
<label for="warrantyExpire" class="form-label">Ngày hết hạn</label>
<input value="${warrantyExpiry}" type="date" class="form-control" name="warrantyExpiry" id="warrantyExpire">
</div>
<div class="mb-3">
<label for="depreciationRate" class="form-label">Tỷ lệ khấu hao (%)</label>
<input value="${deviceInfo.depreciationRate}" type="text" class="form-control" name="depreciationRate" id="depreciationRate">
</div>
<input id="localStorageDataImage" type="hidden" name="imageUrl" value="${deviceInfo.imageUrl}" />
<input id="localStorageDataVideo" type="hidden" name="videoUrl" value="${deviceInfo.videoUrl}"/>
<button type="submit" class="btn btn-primary w-100">Cập nhật</button>
</form>
`

renderImageVideo()
}
// Delete function
async function deleteDevice(event, index, id) {
    // Prompt the user for confirmation
    var confirmation = confirm("Xác nhận bạn muốn xóa thiết bị này?");
    // If the user confirms the deletion
    if (confirmation) {

        handleDelete(id, index)

    }
}

function handleDelete(serialNumber, index) {
    axios.post('/device/delete', {
        serialNumber: `${serialNumber}`
    }).then(res => {
        
        if (res.data.success == false) {
            alert('Bạn không đủ thẩm quyền để thực hiện chức năng này!')
        } else {
            /*
            Tham số đầu tiên (1) là chỉ mục của phần tử bạn muốn bắt đầu xóa.
            Tham số thứ hai (1) là số lượng phần tử bạn muốn xóa từ chỉ mục đã chỉ định.
            */
            mockData.devices.splice(index, 1);
            // Rerender table
            populateTable(mockData.devices);

            alert('Xóa thiết bị thành công')
        }
    })
}

// document.getElementById("searchButton").addEventListener("click", function() {
//     const input = document.getElementById("searchInput").value.toUpperCase();
//     const tableBody = document.getElementById("deviceLoanTableBody");
//     const devices = mockData.devices;

//     // Filter devices based on search input
//     const filteredDevices = devices.filter(device => {
//         for (const key in device) {
//             if (device.hasOwnProperty(key)) {
//                 const value = device[key];
//                 if (typeof value === "string" && value.toUpperCase().includes(input)) {
//                     return true;
//                 }
//             }
//         }
//         return false;
//     });

//     // Update table rows based on filtered devices
//     tableBody.innerHTML = "";
//     filteredDevices.forEach((device, index) => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${device.name}</td>
//             <td>${device.deviceType.name}</td>
//             <td>${device.status}</td>
//             <td>${device.initStatus}</td>
//             <td>${device.location.name}</td>
//             <td>${convertDateTime(device.purchaseDate)}</td>
//             <td>${convertDateTime(device.warrantyExpiry)}</td>
//             <td>
//                 <span class="btn badge bg-success" onclick="detailDevice(event, ${index})">Detail</span>
//                 <span class="btn badge bg-warning" onclick="updateDevice(event, ${index})">Update</span>
//                 <span class="btn badge bg-danger" onclick="deleteDevice(event, ${index}, '${device.serialNumber}')">Delete</span>
//             </td>
//         `;
//         tableBody.appendChild(row);
//     });
// });
document.getElementById("searchButton").addEventListener("click", function() {
    const input = document.getElementById("searchInput").value.toUpperCase();
    const tableBody = document.getElementById("deviceLoanTableBody");
    const devices = mockData.devices;

    // Filter devices based on search input
    const filteredDevices = devices.filter(device => {
        for (const key in device) {
            if (device.hasOwnProperty(key)) {
                const value = device[key];
                if (typeof value === "string" && value.toUpperCase().includes(input)) {
                    return true;
                }
            }
        }
        return false;
    });

    // Update table rows based on filtered devices
    tableBody.innerHTML = "";
    filteredDevices.forEach((device, i) => {
        const index = devices.indexOf(device); // Lấy chỉ mục của thiết bị trong mảng gốc
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${device.name}</td>
            <td>${device.deviceType}</td>
            <td>${device.status}</td>
            <td>${device.initStatus}</td>
            <td>${device.location}</td>
            <td>${convertDateTime(device.purchaseDate)}</td>
            <td>${convertDateTime(device.warrantyExpiry)}</td>
            <td>
                <span class="btn badge bg-success" onclick="detailDevice(event, ${index})">Detail</span>
                <span class="btn badge bg-warning" onclick="updateDevice(event, ${index})">Update</span>
                <span class="btn badge bg-danger" onclick="deleteDevice(event, ${index}, '${device.serialNumber}')">Delete</span>
            </td>
        `;
        tableBody.appendChild(row);
    });
});

$("#searchInput").on("input", (event) => {
    const btnSearch = document.querySelector('#searchButton')
    if (!event.target.value) {
        btnSearch.click()
    }
});

// Go to page function
function goToPage() {
    const pageInput = document.getElementById('pageInput').value;
    if (pageInput >= 1 && pageInput <= Math.ceil(mockData.devices.length / itemsPerPage)) {
        currentPage = parseInt(pageInput);
        populateTable(mockData.devices, currentPage, itemsPerPage);
        renderPagination();
    } else {
        alert('Page does not exist');
    }
}

// Highlight current page
function highlightCurrentPage() {
    const pages = pagination.find(".page-item");
    pages.removeClass("active");
    pages.eq(currentPage - 1).addClass("active");
}

function renderImageVideo() {

    $('#spinner1').hide();
    $('#spinner2').hide();
    const imageRender = document.querySelector('#imageRender');
    const videoRender = document.querySelector('#videoRender');

    var imageUrlValue = '';
    var videoUrlValue = '';

    $('#deviceUrlImg').on('change', function(event) {
        const fileName = $(this)[0].files[0].name;
        event.preventDefault();
        const formData = new FormData($(this).closest('form')[0]);
        formData.append('file', $(this)[0].files[0]);
        
        // Show spinner
        $('#spinner1').show()

        uploadFile(formData, function(error, response) {

            if (error) {
                console.error(error);
            } else {
                imageUrlValue = response.data;
                imageRender.src = response.data;
                try {
                    localStorage.setItem('imageUrl', response.data);
                    document.getElementById('localStorageDataImage').value = localStorage.getItem('imageUrl');
                    document.getElementById('imageRender').hidden = false;
                    // Hide spinner regardless of response status
                    $('#spinner1').hide()
                } catch (e) {
                    console.error('LocalStorage error: ', e);
                }
            }
        });
    });

    $('#deviceVideo').on('change', function(event) {
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
                    document.getElementById('videoRender').hidden = false;
                    $('#spinner2').hide()
                } catch (e) {
                    console.error('LocalStorage error: ', e);
                }
            }
        });
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


// === req Download xlsx file ===

// $(document).ready(function() {
//     document.getElementById('downloadBtn').addEventListener('click', function() {
//         axios.post('/xlsx/download', { filename: 'Devices.xlsx' }, { responseType: 'blob' })
//             .then(function(response) {
//                 const timestamp = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 15); // Tạo timestamp theo định dạng YYYYMMDDTHHMMSS
//                 const filename = 'Devices-' + timestamp + '.xlsx'; // Tạo tên file mới
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

function handleDeleteFile(url) {
    if (url == '/public/images/image-placeholder02.png') {
        alert('Bạn cần up ảnh lên trước rồi mới xóa được')
        
    } else {
        
        axios.post('/image/delete', { filename: url })
            .then(response => {
                // Xử lý phản hồi từ server nếu cần
                console.log(response);
                if (response.data.success == true) {
                    document.querySelector('#imageRender').src = '/public/images/image-placeholder02.jpg';
                    alert('Xóa tệp thành công!')
                } else {
                    alert('Xóa tệp không thành công!')
                    console.log(response.data.message);
                }
            })
            .catch(error => {
                // Xử lý lỗi nếu có
                console.error('Có lỗi xảy ra khi gửi yêu cầu:', error);
            });
    }
}