

var resultContainer = document.getElementById("qr-reader-results");
var lastResult,
    countResults = 0;

function onScanSuccess(decodedText, decodedResult) {
    if (decodedText !== lastResult) {
        ++countResults;
        lastResult = decodedText;
        // Handle on success condition with the decoded message.
        // console.log(`Scan result ${decodedText}`, decodedResult);
        document.getElementById("serialNumber").value = decodedText;
    }
}
var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", {
    fps: 10,
    qrbox: 250,
});
html5QrcodeScanner.render(onScanSuccess);

// Function to populate the dropdown with options
function populateDropdown() {
    var dropdown = document.getElementById("imageSelect");
    // Clear existing options
    dropdown.innerHTML = "";
    // Add a default option
    var defaultOption = document.createElement("option");
    defaultOption.text = "--Chọn ảnh--";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    dropdown.add(defaultOption);
    // Add options for each image URL
    data.imageUrl.forEach(function (image, index) {
        var option = document.createElement("option");
        option.value = image;
        option.text = "Ảnh " + (index + 1);
        dropdown.add(option);
    });
}
// Call the function to populate the dropdown when the page loads
window.onload = function () {
    populateDropdown();
};
// Function to change the displayed image when a different option is selected
function changeImage(selectElement) {
    // console.log(selectElement)
    var selectedImage = selectElement.value;
    var imageRender = document.getElementById("imageRender");
    // Set the src of the img tag to display the selected image
    imageRender.src = selectedImage;
}

function renderVideo(input) {
    var videoRender = document.getElementById("videoRender");
    var file = input.files[0];
    var videoURL = URL.createObjectURL(file);
    // Thiết lập src của thẻ video để hiển thị video
    videoRender.src = videoURL;
    // Hiển thị thẻ video
    videoRender.style.display = "block";
    // Tự động phát video sau khi được tải lên
    videoRender.autoplay = true;
}

$(document).ready(function() {
    // Select 2
    $('.js-example-theme-single').select2({width: 'resolve'});
    // 
    $('#spinner1').hide();
    $('#spinner2').hide();

    const imageRender = document.querySelector('#imageRender');
    const videoRender = document.querySelector('#videoRender');

    var imageUrlValue = '';
    var videoUrlValue = '';

    $('#deviceUrlImg').on('change', function(event) {

        var file = this.files[0];
        var maxSize = 10 * 1024 * 1024; // Giới hạn kích thước tập tin là 1MB
        if (file.size > maxSize) {
            alert('Kích thước ảnh tối thiểu 2mb.');
            this.value = ''; // Xóa lựa chọn tập tin
        } else {

            const fileName = $(this)[0].files[0].name;
            event.preventDefault();
            const formData = new FormData($(this).closest('form')[0]);
            formData.append('file', $(this)[0].files[0]);
            console.log(formData);
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
                        // Hide spinner regardless of response status
                        $('#spinner1').hide()
                    } catch (e) {
                        console.error('LocalStorage error: ', e);
                    }
                }
            });

        }

    });

    $('#deviceVideo').on('change', function(event) {

        var file = this.files[0];
        var maxSize = 100 * 1024 * 1024; // Giới hạn kích thước tập tin là 100MB
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

    // Delete image url 
    const deleteImageButton = document.querySelector('#deleteUrlImageBtn');
    const deleteVideoButton = document.querySelector('#deleteUrlVideoBtn');
    const image = document.querySelector('#imageRender');
    const video = document.querySelector('#videoRender');
    deleteImageButton.addEventListener('click', () => {
        // Lấy giá trị của thuộc tính src của thẻ hình ảnh
        const filename = image.getAttribute('src');
        
        if (filename == '/public/images/image-placeholder02.png') {
            alert('Bạn cần up ảnh lên trước rồi mới xóa được')
            // Gửi yêu cầu POST sử dụng Axios
        } else {
            axios.post('/image/delete', { filename })
                .then(response => {
                    // Xử lý phản hồi từ server nếu cần
                    console.log(response);
                    if (response.data.success == true) {
                        image.src = '/public/images/image-placeholder02.jpg';
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
    });

    deleteVideoButton.addEventListener('click', () => {
        // Lấy giá trị của thuộc tính src của thẻ hình ảnh
        const filename = video.getAttribute('src');
        
        if (filename == '' && filename == undefined) {
            alert('Bạn cần up video lên trước rồi mới xóa được')
            // Gửi yêu cầu POST sử dụng Axios
        } else {
            axios.post('/image/delete', { filename })
                .then(response => {
                    // Xử lý phản hồi từ server nếu cần
                    console.log(response);
                    if (response.data.success == true) {
                        video.src = '';
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
    });
});
